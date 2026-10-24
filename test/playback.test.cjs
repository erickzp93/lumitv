const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const {JSDOM} = require('jsdom');
process.env.LUMINA_TEST = '1';
const service = require('../src/service.js');

function media(video) {
  const context = vm.createContext({document:{querySelector:()=>video}, Promise, isFinite});
  return command => vm.runInContext(`(${service.mediaCommand.toString()})(${JSON.stringify(command)})`, context);
}
function video() {
  return {paused:true, currentTime:0, duration:120, readyState:4, muted:true, defaultMuted:true, volume:0.05,
    play(){this.paused=false;return Promise.resolve();}, pause(){this.paused=true;}};
}
function app(t) {
  const dom = new JSDOM(fs.readFileSync('dist/index.html','utf8'), {
    url:'http://127.0.0.1:8081/module/gh%2Ferickzp93%2Flumitv/dist/index.html', runScripts:'outside-only'
  });
  t.after(()=>dom.window.close());
  const w = dom.window;
  w.HTMLElement.prototype.scrollIntoView = function(){};
  const add = w.addEventListener.bind(w);
  w.addEventListener = (type, ...args) => {if(type!=='DOMContentLoaded')add(type,...args);};
  const context = dom.getInternalVMContext();
  vm.runInContext(fs.readFileSync('dist/player-bridge.js','utf8'),context);
  vm.runInContext(fs.readFileSync('dist/app.js','utf8'),context);
  const run = expression => vm.runInContext(expression,context);
  run(`openPlayer({id:123,media_type:'movie',title:'Test'});`);
  return {w,run,context};
}

test('play activates real media, restores sound and resumes at requested time', async()=>{
  const v=video(); const result=await media(v)({action:'play',startAt:42,volume:0.5});
  assert.equal(v.paused,false);assert.equal(v.muted,false);assert.equal(v.volume,0.5);
  assert.equal(result.currentTime,42);assert.equal(result.paused,false);
});
test('pause, toggle and seeking operate on the actual video with bounds',async()=>{
  const v=video(), command=media(v);
  await command({action:'toggle'});assert.equal(v.paused,false);
  await command({action:'pause'});assert.equal(v.paused,true);
  await command({action:'seek',seconds:-10});assert.equal(v.currentTime,0);
  await command({action:'seek',seconds:500});assert.equal(v.currentTime,119.9);
});
test('missing videos and rejected play promises never report successful playback',async()=>{
  assert.equal((await media(null)({action:'play'})).error,'VIDEO_NOT_READY');
  const v=video();v.play=()=>Promise.reject(new Error('decoder failure'));
  assert.match((await media(v)({action:'play'})).error,/decoder failure/);assert.equal(v.paused,true);
});
test('service discovers only this module and parses listening rather than established sockets',()=>{
  assert.equal(service.isLuminaPage('http://127.0.0.1:8081/module/gh%2Ferickzp93%2Flumitv/dist/index.html'),true);
  assert.equal(service.isLuminaPage('http://127.0.0.1:8081/module/gh%2Ferickzp93%2Flumitv@v1.1.0/dist/index.html'),true);
  assert.equal(service.isLuminaPage('http://127.0.0.1:8081/module/gh%2Ferickzp93%2Flumitv%40v1.1.0/dist/index.html'),true);
  assert.equal(service.isLuminaPage('https://attacker.test/module/gh%2Ferickzp93%2Flumitv/dist/index.html'),false);
  assert.equal(service.isLuminaPage('http://127.0.0.1:8081/module/gh%2Fother%2Flumitv/dist/index.html'),false);
  assert.deepEqual(service.listeningPorts('header\n0: 0100007F:CBC4 00000000:0000 0A\n1: 0100007F:1F91 00000000:0000 0A\n2: 0100007F:CBC5 00000000:0000 01'),[52164]);
});
test('opening a title does not invent a clock, runtime, or saved progress',t=>{
  const {run}=app(t);
  assert.equal(run('State.currentTime'),0);assert.equal(run('State.duration'),0);
  assert.equal(run('State.isPlaying'),false);assert.equal(run('State.history.length'),0);
  assert.equal(run('window.progressInterval'),undefined);
});
test('only real samples save progress; repeated paused samples do not rewrite storage',t=>{
  const {run}=app(t);
  run('applyPlaybackSnapshot({currentTime:42,duration:120,paused:false});');
  assert.equal(run('State.history[0].currentTime'),42);
  const timestamp=run('State.history[0].updatedAt');
  run('applyPlaybackSnapshot({currentTime:42,duration:120,paused:true});');
  assert.equal(run('State.history[0].updatedAt'),timestamp);
  run('applyPlaybackSnapshot({currentTime:Infinity,duration:120,paused:false});');
  assert.equal(run('State.currentTime'),42);
});
test('a late command response cannot update a new playback session',async t=>{
  const {run,w}=app(t);
  w.__luminaNative=()=>{};run('window.LuminaBridge.ready({version:"test"})');
  const promise=run('window.LuminaBridge.request("play")');
  const id=run('window.LuminaBridge.sequence'), session=run('State.playerSession');
  run('State.playerSession += 1');
  w.LuminaBridge.receive({id,session,snapshot:{currentTime:70,duration:120,paused:false}});
  await assert.rejects(promise,/STALE_SESSION/);assert.equal(run('State.currentTime'),0);
});
test('messages from wrong sources, unrelated titles and MEDIA_DATA history are ignored',t=>{
  const {run,w}=app(t);const frame=w.document.getElementById('player-iframe');
  const emit=(source,data)=>w.dispatchEvent(new w.MessageEvent('message',{origin:'https://vidlink.pro',source,data}));
  const event={type:'PLAYER_EVENT',data:{mtmdbId:123,event:'play',currentTime:50,duration:120}};
  emit(w,event);assert.equal(run('State.currentTime'),0);
  emit(frame.contentWindow,{...event,data:{...event.data,mtmdbId:999}});assert.equal(run('State.currentTime'),0);
  emit(frame.contentWindow,{type:'MEDIA_DATA',data:{123:{progress:{watched:99,duration:120}}}});assert.equal(run('State.currentTime'),0);
  emit(frame.contentWindow,event);assert.equal(run('State.currentTime'),50);
});
test('native Tizen Back removes the external frame before host forwarding and restores home focus',t=>{
  const {run,w}=app(t);const old=w.document.getElementById('player-iframe');
  run(`(function(){var e=document.createEvent('CustomEvent');e.initCustomEvent('tizenhwkey',true,true,null);e.keyName='back';document.dispatchEvent(e);for(var i=0;i<window.frames.length;i++){window.frames[i].document.dispatchEvent(e);}})()`);
  assert.equal(run('State.currentView'),'home');assert.notEqual(w.document.getElementById('player-iframe'),old);
  assert.equal(w.document.getElementById('player-iframe').hasAttribute('src'),false);
  assert.equal(w.document.activeElement.id,'hero-play-btn');
});
