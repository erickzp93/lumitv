'use strict';

// Runs inside TizenBrew, using its existing local developer connection.
// No public server, PC address, shell command or arbitrary-evaluation endpoint.
var fs = require('fs');
var http = require('http');
var WebSocket = require('ws');
var VERSION = '1.1.0';
var BINDING = '__luminaNative';
var socket = null;
var contexts = {};
var mainContext = null;
var sequence = 0;
var pending = {};
var busy = false;
var discovering = false;
var registeredContext = null;
var disposed = false;
var allowed = ['status', 'play', 'pause', 'toggle', 'seek', 'unmute', 'click'];

function isLuminaPage(url) {
  try { url = decodeURIComponent(url || ''); } catch (e) { return false; }
  return /^http:\/\/(127\.0\.0\.1|localhost):8081\/module\/gh\/erickzp93\/lumitv(?:@[^/]+)?\/dist\/index\.html(?:[?#]|$)/.test(url);
}

function listeningPorts(text) {
  var ports = {};
  text.split('\n').slice(1).forEach(function(line) {
    var columns = line.trim().split(/\s+/);
    if (columns[3] !== '0A') return;
    var port = parseInt((columns[1] || '').split(':').pop(), 16);
    if (port > 1024 && port !== 8081 && port !== 26101) ports[port] = true;
  });
  return Object.keys(ports).map(Number);
}

function getPages(port) {
  return new Promise(function(resolve) {
    var request = http.get({host:'127.0.0.1', port:port, path:'/json/list'}, function(response) {
      var data = '';
      response.on('data', function(chunk) { data += chunk; if (data.length > 100000) request.destroy(); });
      response.on('end', function() {
        try { var pages = JSON.parse(data); resolve(Array.isArray(pages) ? pages : []); }
        catch (e) { resolve([]); }
      });
    });
    request.setTimeout(500, function() { request.destroy(); resolve([]); });
    request.on('error', function() { resolve([]); });
  });
}

function call(method, params) {
  return new Promise(function(resolve, reject) {
    if (!socket || socket.readyState !== WebSocket.OPEN) return reject(new Error('BRIDGE_OFFLINE'));
    var id = ++sequence;
    var timer = setTimeout(function() { delete pending[id]; reject(new Error('COMMAND_TIMEOUT')); }, 20000);
    pending[id] = {resolve:resolve, reject:reject, timer:timer};
    socket.send(JSON.stringify({id:id, method:method, params:params || {}}));
  });
}

function evaluate(contextId, expression, gesture) {
  return call('Runtime.evaluate', {contextId:contextId, expression:expression, returnByValue:true,
    awaitPromise:true, userGesture:!!gesture}).then(function(result) {
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'EVALUATION_FAILED');
    return result.result && result.result.value;
  });
}

// This function is evaluated only in the frame owned by #player-iframe.
function mediaCommand(command) {
  var video = document.querySelector('video');
  var player = document.querySelector('[data-media-player]');
  // Vidstack/DASH providers maintain their own seeking state. Their documented
  // request events keep the provider and its media element synchronized.
  function request(type, detail) {
    if (!player) return false;
    player.dispatchEvent(new CustomEvent(type, {detail:detail, bubbles:true, composed:true}));
    return true;
  }
  function seek(time) {
    var target = Math.max(0, Math.min(time, video.duration > 0 ? video.duration - 0.1 : time));
    if (!request('media-seek-request', target)) video.currentTime = target;
  }
  function snapshot() {
    if (!video) return {error:'VIDEO_NOT_READY'};
    return {currentTime:video.currentTime, duration:isFinite(video.duration) ? video.duration : 0,
      paused:video.paused, ended:video.ended, muted:video.muted, volume:video.volume,
      readyState:video.readyState, error:video.error ? video.error.message || 'MEDIA_ERROR_' + video.error.code : null};
  }
  if (command.action === 'click') {
    var element = document.elementFromPoint(command.x, command.y);
    if (element && typeof element.click === 'function') element.click();
    return Promise.resolve(snapshot());
  }
  if (!video || (command.action !== 'status' && video.readyState === 0)) return Promise.resolve({error:'VIDEO_NOT_READY'});
  var action = command.action;
  if (action === 'toggle') action = video.paused ? 'play' : 'pause';
  if (action === 'play' || action === 'unmute') {
    var volume = typeof command.volume === 'number' ? Math.max(0, Math.min(1, command.volume)) : 0.5;
    video.muted = false;
    video.defaultMuted = false;
    video.volume = volume;
  }
  if (action === 'play' && typeof command.startAt === 'number' && Math.abs(video.currentTime - command.startAt) > 0.5) {
    seek(command.startAt);
  }
  if (action === 'pause') { request('media-pause-request'); video.pause(); }
  if (action === 'seek') seek(video.currentTime + command.seconds);
  if (action === 'play') {
    try {
      request('media-play-request');
      return Promise.resolve(video.play()).then(snapshot, function(error) {
        return {error:error.name + ': ' + error.message};
      });
    } catch (error) { return Promise.resolve({error:error.message}); }
  }
  return Promise.resolve(snapshot());
}

function sendToApp(method, data) {
  if (mainContext === null) return Promise.resolve();
  return evaluate(mainContext, 'window.LuminaBridge && window.LuminaBridge.' + method + '(' + JSON.stringify(data) + ')');
}

function locate() {
  var videoFrameId = null;
  return call('Page.getFrameTree').then(function(result) {
    var frameId = result.frameTree.frame.id;
    (result.frameTree.childFrames || []).forEach(function(child) {
      if (child.frame.name === 'lumina-player') videoFrameId = child.frame.id;
    });
    mainContext = null;
    Object.keys(contexts).forEach(function(id) {
      if (contexts[id] === frameId) mainContext = Number(id);
    });
    if (mainContext === null || !isLuminaPage(result.frameTree.frame.url)) throw new Error('APP_NOT_READY');
    return evaluate(mainContext, 'window.LuminaBridge && window.LuminaBridge.context()');
  }).then(function(metadata) {
    if (!metadata) throw new Error('APP_NOT_READY');
    var bind = registeredContext === mainContext ? Promise.resolve() :
      call('Runtime.addBinding', {name:BINDING, executionContextId:mainContext}).then(function() { registeredContext = mainContext; });
    return bind.then(function() { return sendToApp('ready', {version:VERSION}); }).then(function() {
      if (metadata.view !== 'player') return {metadata:metadata, contextId:null};
      var contextId = null;
      Object.keys(contexts).forEach(function(id) {
        if (videoFrameId !== null && contexts[id] === videoFrameId) contextId = Number(id);
      });
      if (contextId === null) throw new Error('VIDEO_NOT_READY');
      return {metadata:metadata, contextId:contextId};
    });
  });
}

function execute(command) {
  return locate().then(function(target) {
    if (target.contextId === null || target.metadata.session !== command.session) throw new Error('STALE_SESSION');
    return evaluate(target.contextId, '(' + mediaCommand.toString() + ')(' + JSON.stringify(command) + ')', command.action !== 'status')
      .then(function(snapshot) { return {session:command.session, snapshot:snapshot}; });
  });
}

function onBinding(params) {
  if (params.name !== BINDING || params.executionContextId !== mainContext || params.payload.length > 4096) return;
  var command;
  try { command = JSON.parse(params.payload); } catch (e) { return; }
  if (!command || allowed.indexOf(command.action) < 0 || !Number.isInteger(command.id) || command.id < 1 || !Number.isInteger(command.session) || command.session < 0) return;
  if (command.action === 'seek' && (typeof command.seconds !== 'number' || !isFinite(command.seconds) || Math.abs(command.seconds) > 3600)) return;
  if (command.action === 'click' && (typeof command.x !== 'number' || typeof command.y !== 'number' || !isFinite(command.x) || !isFinite(command.y) || command.x < 0 || command.y < 0 || command.x > 10000 || command.y > 10000)) return;
  if (command.volume !== undefined && (typeof command.volume !== 'number' || !isFinite(command.volume) || command.volume < 0 || command.volume > 1)) return;
  if (command.startAt !== undefined && (typeof command.startAt !== 'number' || !isFinite(command.startAt) || command.startAt < 0)) return;
  execute(command).then(function(result) {
    result.id = command.id;
    return sendToApp('receive', result);
  }).catch(function(error) {
    var message = /Cannot find context|context.*destroyed|Cannot find.*execution context/i.test(error.message) ? 'VIDEO_NOT_READY' : error.message;
    return sendToApp('receive', {id:command.id, session:command.session, error:message}).catch(function() {});
  });
}

function attach(page, port) {
  if (disposed) return;
  var url = (page.webSocketDebuggerUrl || '').replace(/ws:\/\/[^/]+/, 'ws://127.0.0.1:' + port);
  if (!url) return;
  socket = new WebSocket(url, {maxPayload:2 * 1024 * 1024});
  socket.on('open', function() {
    contexts = {}; mainContext = null; registeredContext = null;
    call('Runtime.enable').then(function() { return call('Page.enable'); }).catch(function() { socket.close(); });
  });
  socket.on('message', function(data) {
    var message;
    try { message = JSON.parse(data); } catch (e) { return; }
    if (message.id && pending[message.id]) {
      var request = pending[message.id]; delete pending[message.id]; clearTimeout(request.timer);
      if (message.error) request.reject(new Error(message.error.message)); else request.resolve(message.result);
    } else if (message.method === 'Runtime.executionContextCreated') {
      var context = message.params.context;
      if (context.auxData && context.auxData.isDefault) contexts[context.id] = context.auxData.frameId;
    } else if (message.method === 'Runtime.executionContextDestroyed') {
      delete contexts[message.params.executionContextId];
      if (message.params.executionContextId === registeredContext) registeredContext = null;
    } else if (message.method === 'Runtime.executionContextsCleared') {
      contexts = {}; mainContext = null; registeredContext = null;
    } else if (message.method === 'Runtime.bindingCalled') onBinding(message.params);
  });
  socket.on('error', function() { socket.close(); });
  socket.on('close', function() {
    socket = null; contexts = {}; mainContext = null; registeredContext = null;
    Object.keys(pending).forEach(function(id) { clearTimeout(pending[id].timer); pending[id].reject(new Error('BRIDGE_OFFLINE')); });
    pending = {};
  });
}

function discover() {
  if (disposed || socket || discovering) return;
  discovering = true;
  var ports = {};
  ['/proc/net/tcp', '/proc/net/tcp6'].forEach(function(file) {
    try { listeningPorts(fs.readFileSync(file, 'utf8')).forEach(function(port) { ports[port] = true; }); } catch (e) {}
  });
  Promise.all(Object.keys(ports).map(function(port) {
    return getPages(Number(port)).then(function(pages) { return {port:Number(port), pages:pages}; });
  })).then(function(results) {
    results.some(function(result) {
      var page = result.pages.filter(function(page) { return page.type === 'page' && isLuminaPage(page.url); })[0];
      if (!page) return false;
      attach(page, result.port); return true;
    });
    discovering = false;
  }, function() { discovering = false; });
}

function tick() {
  if (disposed) return;
  if (!socket || socket.readyState !== WebSocket.OPEN) return discover();
  if (busy) return;
  busy = true;
  locate().then(function(target) {
    if (target.contextId === null) return;
    return evaluate(target.contextId, '(' + mediaCommand.toString() + ')({action:"status"})').then(function(snapshot) {
      return sendToApp('update', {session:target.metadata.session, snapshot:snapshot});
    });
  }).catch(function() {}).then(function() { busy = false; });
}

// Exports support focused tests; TizenBrew executes the service as a script.
module.exports = {isLuminaPage:isLuminaPage, listeningPorts:listeningPorts, mediaCommand:mediaCommand};
if (!process.env.LUMINA_TEST) {
  // TizenBrew can load a tagged update in the same Node process.
  // Replace our previous instance so commands cannot execute twice.
  if (process.__luminaPlaybackService) process.__luminaPlaybackService.stop();
  var interval = setInterval(tick, 1000);
  process.__luminaPlaybackService = {version:VERSION, stop:function() {
    disposed = true;
    clearInterval(interval);
    if (socket) socket.close();
  }};
  discover();
}
