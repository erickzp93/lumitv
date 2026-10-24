// LuminaTV 1.1.0 — TizenBrew playback service (includes ws, MIT license).
"use strict";

function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != _typeof(t) || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = function __commonJS(cb, mod) {
  return function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = {
      exports: {}
    }).exports, mod), mod.exports;
  };
};

// node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "node_modules/safe-buffer/index.js"(exports2, module2) {
    var buffer = require("buffer");
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module2.exports = buffer;
    } else {
      copyProps(buffer, exports2);
      exports2.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function (arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function (size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function (size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function (size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/async-limiter/index.js
var require_async_limiter = __commonJS({
  "node_modules/async-limiter/index.js"(exports2, module2) {
    "use strict";

    function Queue(options) {
      if (!(this instanceof Queue)) {
        return new Queue(options);
      }
      options = options || {};
      this.concurrency = options.concurrency || Infinity;
      this.pending = 0;
      this.jobs = [];
      this.cbs = [];
      this._done = done.bind(this);
    }
    var arrayAddMethods = ["push", "unshift", "splice"];
    arrayAddMethods.forEach(function (method) {
      Queue.prototype[method] = function () {
        var methodResult = Array.prototype[method].apply(this.jobs, arguments);
        this._run();
        return methodResult;
      };
    });
    Object.defineProperty(Queue.prototype, "length", {
      get: function get() {
        return this.pending + this.jobs.length;
      }
    });
    Queue.prototype._run = function () {
      if (this.pending === this.concurrency) {
        return;
      }
      if (this.jobs.length) {
        var job = this.jobs.shift();
        this.pending++;
        job(this._done);
        this._run();
      }
      if (this.pending === 0) {
        while (this.cbs.length !== 0) {
          var cb = this.cbs.pop();
          process.nextTick(cb);
        }
      }
    };
    Queue.prototype.onDone = function (cb) {
      if (typeof cb === "function") {
        this.cbs.push(cb);
        this._run();
      }
    };
    function done() {
      this.pending--;
      this._run();
    }
    module2.exports = Queue;
  }
});

// node_modules/ws/lib/buffer-util.js
var require_buffer_util = __commonJS({
  "node_modules/ws/lib/buffer-util.js"(exports2, module2) {
    "use strict";

    var safeBuffer = require_safe_buffer();
    var Buffer2 = safeBuffer.Buffer;
    var concat = function concat(list, totalLength) {
      var target = Buffer2.allocUnsafe(totalLength);
      var offset = 0;
      for (var i = 0; i < list.length; i++) {
        var buf = list[i];
        buf.copy(target, offset);
        offset += buf.length;
      }
      return target;
    };
    try {
      var bufferUtil = require("bufferutil");
      module2.exports = Object.assign({
        concat
      }, bufferUtil.BufferUtil || bufferUtil);
    } catch (e) {
      var mask = function mask(source, mask2, output, offset, length) {
        for (var i = 0; i < length; i++) {
          output[offset + i] = source[i] ^ mask2[i & 3];
        }
      };
      var unmask = function unmask(buffer, mask2) {
        var length = buffer.length;
        for (var i = 0; i < length; i++) {
          buffer[i] ^= mask2[i & 3];
        }
      };
      module2.exports = {
        concat,
        mask,
        unmask
      };
    }
  }
});

// node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "node_modules/ws/lib/permessage-deflate.js"(exports2, module2) {
    "use strict";

    var safeBuffer = require_safe_buffer();
    var Limiter = require_async_limiter();
    var zlib = require("zlib");
    var bufferUtil = require_buffer_util();
    var Buffer2 = safeBuffer.Buffer;
    var TRAILER = Buffer2.from([0, 0, 255, 255]);
    var EMPTY_BLOCK = Buffer2.from([0]);
    var kWriteInProgress = Symbol("write-in-progress");
    var kPendingClose = Symbol("pending-close");
    var kTotalLength = Symbol("total-length");
    var kCallback = Symbol("callback");
    var kBuffers = Symbol("buffers");
    var kError = Symbol("error");
    var kOwner = Symbol("owner");
    var zlibLimiter;
    var PerMessageDeflate = /*#__PURE__*/function () {
      /**
       * Creates a PerMessageDeflate instance.
       *
       * @param {Object} options Configuration options
       * @param {Boolean} options.serverNoContextTakeover Request/accept disabling
       *     of server context takeover
       * @param {Boolean} options.clientNoContextTakeover Advertise/acknowledge
       *     disabling of client context takeover
       * @param {(Boolean|Number)} options.serverMaxWindowBits Request/confirm the
       *     use of a custom server window size
       * @param {(Boolean|Number)} options.clientMaxWindowBits Advertise support
       *     for, or request, a custom client window size
       * @param {Object} options.zlibDeflateOptions Options to pass to zlib on deflate
       * @param {Object} options.zlibInflateOptions Options to pass to zlib on inflate
       * @param {Number} options.threshold Size (in bytes) below which messages
       *     should not be compressed
       * @param {Number} options.concurrencyLimit The number of concurrent calls to
       *     zlib
       * @param {Boolean} isServer Create the instance in either server or client
       *     mode
       * @param {Number} maxPayload The maximum allowed message length
       */
      function PerMessageDeflate(options, isServer, maxPayload) {
        _classCallCheck(this, PerMessageDeflate);
        this._maxPayload = maxPayload | 0;
        this._options = options || {};
        this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
        this._isServer = !!isServer;
        this._deflate = null;
        this._inflate = null;
        this.params = null;
        if (!zlibLimiter) {
          var concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          zlibLimiter = new Limiter({
            concurrency
          });
        }
      }
      /**
       * @type {String}
       */
      return _createClass(PerMessageDeflate, [{
        key: "offer",
        value:
        /**
         * Create an extension negotiation offer.
         *
         * @return {Object} Extension parameters
         * @public
         */
        function offer() {
          var params = {};
          if (this._options.serverNoContextTakeover) {
            params.server_no_context_takeover = true;
          }
          if (this._options.clientNoContextTakeover) {
            params.client_no_context_takeover = true;
          }
          if (this._options.serverMaxWindowBits) {
            params.server_max_window_bits = this._options.serverMaxWindowBits;
          }
          if (this._options.clientMaxWindowBits) {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          } else if (this._options.clientMaxWindowBits == null) {
            params.client_max_window_bits = true;
          }
          return params;
        }
        /**
         * Accept an extension negotiation offer/response.
         *
         * @param {Array} configurations The extension negotiation offers/reponse
         * @return {Object} Accepted configuration
         * @public
         */
      }, {
        key: "accept",
        value: function accept(configurations) {
          configurations = this.normalizeParams(configurations);
          this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
          return this.params;
        }
        /**
         * Releases all resources used by the extension.
         *
         * @public
         */
      }, {
        key: "cleanup",
        value: function cleanup() {
          if (this._inflate) {
            if (this._inflate[kWriteInProgress]) {
              this._inflate[kPendingClose] = true;
            } else {
              this._inflate.close();
              this._inflate = null;
            }
          }
          if (this._deflate) {
            if (this._deflate[kWriteInProgress]) {
              this._deflate[kPendingClose] = true;
            } else {
              this._deflate.close();
              this._deflate = null;
            }
          }
        }
        /**
         *  Accept an extension negotiation offer.
         *
         * @param {Array} offers The extension negotiation offers
         * @return {Object} Accepted configuration
         * @private
         */
      }, {
        key: "acceptAsServer",
        value: function acceptAsServer(offers) {
          var opts = this._options;
          var accepted = offers.find(function (params) {
            if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && !params.client_max_window_bits) {
              return false;
            }
            return true;
          });
          if (!accepted) {
            throw new Error("None of the extension offers can be accepted");
          }
          if (opts.serverNoContextTakeover) {
            accepted.server_no_context_takeover = true;
          }
          if (opts.clientNoContextTakeover) {
            accepted.client_no_context_takeover = true;
          }
          if (typeof opts.serverMaxWindowBits === "number") {
            accepted.server_max_window_bits = opts.serverMaxWindowBits;
          }
          if (typeof opts.clientMaxWindowBits === "number") {
            accepted.client_max_window_bits = opts.clientMaxWindowBits;
          } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
            delete accepted.client_max_window_bits;
          }
          return accepted;
        }
        /**
         * Accept the extension negotiation response.
         *
         * @param {Array} response The extension negotiation response
         * @return {Object} Accepted configuration
         * @private
         */
      }, {
        key: "acceptAsClient",
        value: function acceptAsClient(response) {
          var params = response[0];
          if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
            throw new Error('Unexpected parameter "client_no_context_takeover"');
          }
          if (!params.client_max_window_bits) {
            if (typeof this._options.clientMaxWindowBits === "number") {
              params.client_max_window_bits = this._options.clientMaxWindowBits;
            }
          } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
            throw new Error('Unexpected or invalid parameter "client_max_window_bits"');
          }
          return params;
        }
        /**
         * Normalize parameters.
         *
         * @param {Array} configurations The extension negotiation offers/reponse
         * @return {Array} The offers/response with normalized parameters
         * @private
         */
      }, {
        key: "normalizeParams",
        value: function normalizeParams(configurations) {
          var _this = this;
          configurations.forEach(function (params) {
            Object.keys(params).forEach(function (key) {
              var value = params[key];
              if (value.length > 1) {
                throw new Error(`Parameter "${key}" must have only a single value`);
              }
              value = value[0];
              if (key === "client_max_window_bits") {
                if (value !== true) {
                  var num = +value;
                  if (!Number.isInteger(num) || num < 8 || num > 15) {
                    throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
                  }
                  value = num;
                } else if (!_this._isServer) {
                  throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
                }
              } else if (key === "server_max_window_bits") {
                var _num = +value;
                if (!Number.isInteger(_num) || _num < 8 || _num > 15) {
                  throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
                }
                value = _num;
              } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
                if (value !== true) {
                  throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
                }
              } else {
                throw new Error(`Unknown parameter "${key}"`);
              }
              params[key] = value;
            });
          });
          return configurations;
        }
        /**
         * Decompress data. Concurrency limited by async-limiter.
         *
         * @param {Buffer} data Compressed data
         * @param {Boolean} fin Specifies whether or not this is the last fragment
         * @param {Function} callback Callback
         * @public
         */
      }, {
        key: "decompress",
        value: function decompress(data, fin, callback) {
          var _this2 = this;
          zlibLimiter.push(function (done) {
            _this2._decompress(data, fin, function (err, result) {
              done();
              callback(err, result);
            });
          });
        }
        /**
         * Compress data. Concurrency limited by async-limiter.
         *
         * @param {Buffer} data Data to compress
         * @param {Boolean} fin Specifies whether or not this is the last fragment
         * @param {Function} callback Callback
         * @public
         */
      }, {
        key: "compress",
        value: function compress(data, fin, callback) {
          var _this3 = this;
          zlibLimiter.push(function (done) {
            _this3._compress(data, fin, function (err, result) {
              done();
              callback(err, result);
            });
          });
        }
        /**
         * Decompress data.
         *
         * @param {Buffer} data Compressed data
         * @param {Boolean} fin Specifies whether or not this is the last fragment
         * @param {Function} callback Callback
         * @private
         */
      }, {
        key: "_decompress",
        value: function _decompress(data, fin, callback) {
          var _this4 = this;
          var endpoint = this._isServer ? "client" : "server";
          if (!this._inflate) {
            var key = `${endpoint}_max_window_bits`;
            var windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
            this._inflate = zlib.createInflateRaw(Object.assign({}, this._options.zlibInflateOptions, {
              windowBits
            }));
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            this._inflate[kOwner] = this;
            this._inflate.on("error", inflateOnError);
            this._inflate.on("data", inflateOnData);
          }
          this._inflate[kCallback] = callback;
          this._inflate[kWriteInProgress] = true;
          this._inflate.write(data);
          if (fin) this._inflate.write(TRAILER);
          this._inflate.flush(function () {
            var err = _this4._inflate[kError];
            if (err) {
              _this4._inflate.close();
              _this4._inflate = null;
              callback(err);
              return;
            }
            var data2 = bufferUtil.concat(_this4._inflate[kBuffers], _this4._inflate[kTotalLength]);
            if (fin && _this4.params[`${endpoint}_no_context_takeover`] || _this4._inflate[kPendingClose]) {
              _this4._inflate.close();
              _this4._inflate = null;
            } else {
              _this4._inflate[kWriteInProgress] = false;
              _this4._inflate[kTotalLength] = 0;
              _this4._inflate[kBuffers] = [];
            }
            callback(null, data2);
          });
        }
        /**
         * Compress data.
         *
         * @param {Buffer} data Data to compress
         * @param {Boolean} fin Specifies whether or not this is the last fragment
         * @param {Function} callback Callback
         * @private
         */
      }, {
        key: "_compress",
        value: function _compress(data, fin, callback) {
          var _this5 = this;
          if (!data || data.length === 0) {
            process.nextTick(callback, null, EMPTY_BLOCK);
            return;
          }
          var endpoint = this._isServer ? "server" : "client";
          if (!this._deflate) {
            var key = `${endpoint}_max_window_bits`;
            var windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
            this._deflate = zlib.createDeflateRaw(Object.assign(
            // TODO deprecate memLevel/level and recommend zlibDeflateOptions instead
            {
              memLevel: this._options.memLevel,
              level: this._options.level
            }, this._options.zlibDeflateOptions, {
              windowBits
            }));
            this._deflate[kTotalLength] = 0;
            this._deflate[kBuffers] = [];
            this._deflate.on("data", deflateOnData);
          }
          this._deflate[kWriteInProgress] = true;
          this._deflate.write(data);
          this._deflate.flush(zlib.Z_SYNC_FLUSH, function () {
            var data2 = bufferUtil.concat(_this5._deflate[kBuffers], _this5._deflate[kTotalLength]);
            if (fin) data2 = data2.slice(0, data2.length - 4);
            if (fin && _this5.params[`${endpoint}_no_context_takeover`] || _this5._deflate[kPendingClose]) {
              _this5._deflate.close();
              _this5._deflate = null;
            } else {
              _this5._deflate[kWriteInProgress] = false;
              _this5._deflate[kTotalLength] = 0;
              _this5._deflate[kBuffers] = [];
            }
            callback(null, data2);
          });
        }
      }], [{
        key: "extensionName",
        get: function get() {
          return "permessage-deflate";
        }
      }]);
    }();
    module2.exports = PerMessageDeflate;
    function deflateOnData(chunk) {
      this[kBuffers].push(chunk);
      this[kTotalLength] += chunk.length;
    }
    function inflateOnData(chunk) {
      this[kTotalLength] += chunk.length;
      if (this[kOwner]._maxPayload < 1 || this[kTotalLength] <= this[kOwner]._maxPayload) {
        this[kBuffers].push(chunk);
        return;
      }
      this[kError] = new RangeError("Max payload size exceeded");
      this[kError].closeCode = 1009;
      this.removeListener("data", inflateOnData);
      this.reset();
    }
    function inflateOnError(err) {
      this[kOwner]._inflate = null;
      this[kCallback](err);
    }
  }
});

// node_modules/ws/lib/event-target.js
var require_event_target = __commonJS({
  "node_modules/ws/lib/event-target.js"(exports2, module2) {
    "use strict";

    var Event = /*#__PURE__*/_createClass(
    /**
     * Create a new `Event`.
     *
     * @param {String} type The name of the event
     * @param {Object} target A reference to the target to which the event was dispatched
     */
    function Event(type, target) {
      _classCallCheck(this, Event);
      this.target = target;
      this.type = type;
    });
    var MessageEvent = /*#__PURE__*/function (_Event) {
      /**
       * Create a new `MessageEvent`.
       *
       * @param {(String|Buffer|ArrayBuffer|Buffer[])} data The received data
       * @param {WebSocket} target A reference to the target to which the event was dispatched
       */
      function MessageEvent(data, target) {
        var _this6;
        _classCallCheck(this, MessageEvent);
        _this6 = _callSuper(this, MessageEvent, ["message", target]);
        _this6.data = data;
        return _this6;
      }
      _inherits(MessageEvent, _Event);
      return _createClass(MessageEvent);
    }(Event);
    var CloseEvent = /*#__PURE__*/function (_Event2) {
      /**
       * Create a new `CloseEvent`.
       *
       * @param {Number} code The status code explaining why the connection is being closed
       * @param {String} reason A human-readable string explaining why the connection is closing
       * @param {WebSocket} target A reference to the target to which the event was dispatched
       */
      function CloseEvent(code, reason, target) {
        var _this7;
        _classCallCheck(this, CloseEvent);
        _this7 = _callSuper(this, CloseEvent, ["close", target]);
        _this7.wasClean = target._closeFrameReceived && target._closeFrameSent;
        _this7.reason = reason;
        _this7.code = code;
        return _this7;
      }
      _inherits(CloseEvent, _Event2);
      return _createClass(CloseEvent);
    }(Event);
    var OpenEvent = /*#__PURE__*/function (_Event3) {
      /**
       * Create a new `OpenEvent`.
       *
       * @param {WebSocket} target A reference to the target to which the event was dispatched
       */
      function OpenEvent(target) {
        _classCallCheck(this, OpenEvent);
        return _callSuper(this, OpenEvent, ["open", target]);
      }
      _inherits(OpenEvent, _Event3);
      return _createClass(OpenEvent);
    }(Event);
    var ErrorEvent = /*#__PURE__*/function (_Event4) {
      /**
       * Create a new `ErrorEvent`.
       *
       * @param {Object} error The error that generated this event
       * @param {WebSocket} target A reference to the target to which the event was dispatched
       */
      function ErrorEvent(error, target) {
        var _this8;
        _classCallCheck(this, ErrorEvent);
        _this8 = _callSuper(this, ErrorEvent, ["error", target]);
        _this8.message = error.message;
        _this8.error = error;
        return _this8;
      }
      _inherits(ErrorEvent, _Event4);
      return _createClass(ErrorEvent);
    }(Event);
    var EventTarget = {
      /**
       * Register an event listener.
       *
       * @param {String} method A string representing the event type to listen for
       * @param {Function} listener The listener to add
       * @public
       */
      addEventListener(method, listener) {
        if (typeof listener !== "function") return;
        function onMessage(data) {
          listener.call(this, new MessageEvent(data, this));
        }
        function onClose(code, message) {
          listener.call(this, new CloseEvent(code, message, this));
        }
        function onError(error) {
          listener.call(this, new ErrorEvent(error, this));
        }
        function onOpen() {
          listener.call(this, new OpenEvent(this));
        }
        if (method === "message") {
          onMessage._listener = listener;
          this.on(method, onMessage);
        } else if (method === "close") {
          onClose._listener = listener;
          this.on(method, onClose);
        } else if (method === "error") {
          onError._listener = listener;
          this.on(method, onError);
        } else if (method === "open") {
          onOpen._listener = listener;
          this.on(method, onOpen);
        } else {
          this.on(method, listener);
        }
      },
      /**
       * Remove an event listener.
       *
       * @param {String} method A string representing the event type to remove
       * @param {Function} listener The listener to remove
       * @public
       */
      removeEventListener(method, listener) {
        var listeners = this.listeners(method);
        for (var i = 0; i < listeners.length; i++) {
          if (listeners[i] === listener || listeners[i]._listener === listener) {
            this.removeListener(method, listeners[i]);
          }
        }
      }
    };
    module2.exports = EventTarget;
  }
});

// node_modules/ws/lib/extension.js
var require_extension = __commonJS({
  "node_modules/ws/lib/extension.js"(exports2, module2) {
    "use strict";

    var tokenChars = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    // 0 - 15
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    // 16 - 31
    0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0,
    // 32 - 47
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
    // 48 - 63
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    // 64 - 79
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
    // 80 - 95
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    // 96 - 111
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0
    // 112 - 127
    ];
    function push(dest, name, elem) {
      if (Object.prototype.hasOwnProperty.call(dest, name)) dest[name].push(elem);else dest[name] = [elem];
    }
    function parse(header) {
      var offers = {};
      if (header === void 0 || header === "") return offers;
      var params = {};
      var mustUnescape = false;
      var isEscaping = false;
      var inQuotes = false;
      var extensionName;
      var paramName;
      var start = -1;
      var end = -1;
      for (var i = 0; i < header.length; i++) {
        var code = header.charCodeAt(i);
        if (extensionName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (code === 32 || code === 9) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            var name = header.slice(start, end);
            if (code === 44) {
              push(offers, name, params);
              params = {};
            } else {
              extensionName = name;
            }
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else if (paramName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (code === 32 || code === 9) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            push(params, header.slice(start, end), true);
            if (code === 44) {
              push(offers, extensionName, params);
              params = {};
              extensionName = void 0;
            }
            start = end = -1;
          } else if (code === 61 && start !== -1 && end === -1) {
            paramName = header.slice(start, i);
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else {
          if (isEscaping) {
            if (tokenChars[code] !== 1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (start === -1) start = i;else if (!mustUnescape) mustUnescape = true;
            isEscaping = false;
          } else if (inQuotes) {
            if (tokenChars[code] === 1) {
              if (start === -1) start = i;
            } else if (code === 34 && start !== -1) {
              inQuotes = false;
              end = i;
            } else if (code === 92) {
              isEscaping = true;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
            inQuotes = true;
          } else if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (start !== -1 && (code === 32 || code === 9)) {
            if (end === -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            var value = header.slice(start, end);
            if (mustUnescape) {
              value = value.replace(/\\/g, "");
              mustUnescape = false;
            }
            push(params, paramName, value);
            if (code === 44) {
              push(offers, extensionName, params);
              params = {};
              extensionName = void 0;
            }
            paramName = void 0;
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        }
      }
      if (start === -1 || inQuotes) {
        throw new SyntaxError("Unexpected end of input");
      }
      if (end === -1) end = i;
      var token = header.slice(start, end);
      if (extensionName === void 0) {
        push(offers, token, {});
      } else {
        if (paramName === void 0) {
          push(params, token, true);
        } else if (mustUnescape) {
          push(params, paramName, token.replace(/\\/g, ""));
        } else {
          push(params, paramName, token);
        }
        push(offers, extensionName, params);
      }
      return offers;
    }
    function format(extensions) {
      return Object.keys(extensions).map(function (extension) {
        var configurations = extensions[extension];
        if (!Array.isArray(configurations)) configurations = [configurations];
        return configurations.map(function (params) {
          return [extension].concat(Object.keys(params).map(function (k) {
            var values = params[k];
            if (!Array.isArray(values)) values = [values];
            return values.map(function (v) {
              return v === true ? k : `${k}=${v}`;
            }).join("; ");
          })).join("; ");
        }).join(", ");
      }).join(", ");
    }
    module2.exports = {
      format,
      parse
    };
  }
});

// node_modules/ws/lib/constants.js
var require_constants = __commonJS({
  "node_modules/ws/lib/constants.js"(exports2) {
    "use strict";

    var safeBuffer = require_safe_buffer();
    var Buffer2 = safeBuffer.Buffer;
    exports2.BINARY_TYPES = ["nodebuffer", "arraybuffer", "fragments"];
    exports2.GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
    exports2.EMPTY_BUFFER = Buffer2.alloc(0);
    exports2.NOOP = function () {};
  }
});

// node_modules/ws/lib/validation.js
var require_validation = __commonJS({
  "node_modules/ws/lib/validation.js"(exports2) {
    "use strict";

    try {
      var isValidUTF8 = require("utf-8-validate");
      exports2.isValidUTF8 = _typeof(isValidUTF8) === "object" ? isValidUTF8.Validation.isValidUTF8 : isValidUTF8;
    } catch (e) {
      exports2.isValidUTF8 = function () {
        return true;
      };
    }
    exports2.isValidStatusCode = function (code) {
      return code >= 1e3 && code <= 1013 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
    };
  }
});

// node_modules/ws/lib/receiver.js
var require_receiver = __commonJS({
  "node_modules/ws/lib/receiver.js"(exports2, module2) {
    "use strict";

    var safeBuffer = require_safe_buffer();
    var PerMessageDeflate = require_permessage_deflate();
    var bufferUtil = require_buffer_util();
    var validation = require_validation();
    var constants = require_constants();
    var Buffer2 = safeBuffer.Buffer;
    var GET_INFO = 0;
    var GET_PAYLOAD_LENGTH_16 = 1;
    var GET_PAYLOAD_LENGTH_64 = 2;
    var GET_MASK = 3;
    var GET_DATA = 4;
    var INFLATING = 5;
    var Receiver = /*#__PURE__*/function () {
      /**
       * Creates a Receiver instance.
       *
       * @param {Object} extensions An object containing the negotiated extensions
       * @param {Number} maxPayload The maximum allowed message length
       * @param {String} binaryType The type for binary data
       */
      function Receiver(extensions, maxPayload, binaryType) {
        _classCallCheck(this, Receiver);
        this._binaryType = binaryType || constants.BINARY_TYPES[0];
        this._extensions = extensions || {};
        this._maxPayload = maxPayload | 0;
        this._bufferedBytes = 0;
        this._buffers = [];
        this._compressed = false;
        this._payloadLength = 0;
        this._fragmented = 0;
        this._masked = false;
        this._fin = false;
        this._mask = null;
        this._opcode = 0;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragments = [];
        this._cleanupCallback = null;
        this._isCleaningUp = false;
        this._hadError = false;
        this._loop = false;
        this.add = this.add.bind(this);
        this.onmessage = null;
        this.onclose = null;
        this.onerror = null;
        this.onping = null;
        this.onpong = null;
        this._state = GET_INFO;
      }
      /**
       * Consumes `n` bytes from the buffered data, calls `cleanup` if necessary.
       *
       * @param {Number} n The number of bytes to consume
       * @return {(Buffer|null)} The consumed bytes or `null` if `n` bytes are not
       *     available
       * @private
       */
      return _createClass(Receiver, [{
        key: "consume",
        value: function consume(n) {
          if (this._bufferedBytes < n) {
            this._loop = false;
            if (this._isCleaningUp) this.cleanup(this._cleanupCallback);
            return null;
          }
          this._bufferedBytes -= n;
          if (n === this._buffers[0].length) return this._buffers.shift();
          if (n < this._buffers[0].length) {
            var buf = this._buffers[0];
            this._buffers[0] = buf.slice(n);
            return buf.slice(0, n);
          }
          var dst = Buffer2.allocUnsafe(n);
          do {
            var _buf = this._buffers[0];
            if (n >= _buf.length) {
              this._buffers.shift().copy(dst, dst.length - n);
            } else {
              _buf.copy(dst, dst.length - n, 0, n);
              this._buffers[0] = _buf.slice(n);
            }
            n -= _buf.length;
          } while (n > 0);
          return dst;
        }
        /**
         * Adds new data to the parser.
         *
         * @param {Buffer} chunk A chunk of data
         * @public
         */
      }, {
        key: "add",
        value: function add(chunk) {
          this._bufferedBytes += chunk.length;
          this._buffers.push(chunk);
          this.startLoop();
        }
        /**
         * Starts the parsing loop.
         *
         * @private
         */
      }, {
        key: "startLoop",
        value: function startLoop() {
          this._loop = true;
          do {
            switch (this._state) {
              case GET_INFO:
                this.getInfo();
                break;
              case GET_PAYLOAD_LENGTH_16:
                this.getPayloadLength16();
                break;
              case GET_PAYLOAD_LENGTH_64:
                this.getPayloadLength64();
                break;
              case GET_MASK:
                this.getMask();
                break;
              case GET_DATA:
                this.getData();
                break;
              default:
                this._loop = false;
            }
          } while (this._loop);
        }
        /**
         * Reads the first two bytes of a frame.
         *
         * @private
         */
      }, {
        key: "getInfo",
        value: function getInfo() {
          var buf = this.consume(2);
          if (buf === null) return;
          if ((buf[0] & 48) !== 0) {
            this.error(new RangeError("Invalid WebSocket frame: RSV2 and RSV3 must be clear"), 1002);
            return;
          }
          var compressed = (buf[0] & 64) === 64;
          if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
            this.error(new RangeError("Invalid WebSocket frame: RSV1 must be clear"), 1002);
            return;
          }
          this._fin = (buf[0] & 128) === 128;
          this._opcode = buf[0] & 15;
          this._payloadLength = buf[1] & 127;
          if (this._opcode === 0) {
            if (compressed) {
              this.error(new RangeError("Invalid WebSocket frame: RSV1 must be clear"), 1002);
              return;
            }
            if (!this._fragmented) {
              this.error(new RangeError("Invalid WebSocket frame: invalid opcode 0"), 1002);
              return;
            } else {
              this._opcode = this._fragmented;
            }
          } else if (this._opcode === 1 || this._opcode === 2) {
            if (this._fragmented) {
              this.error(new RangeError(`Invalid WebSocket frame: invalid opcode ${this._opcode}`), 1002);
              return;
            }
            this._compressed = compressed;
          } else if (this._opcode > 7 && this._opcode < 11) {
            if (!this._fin) {
              this.error(new RangeError("Invalid WebSocket frame: FIN must be set"), 1002);
              return;
            }
            if (compressed) {
              this.error(new RangeError("Invalid WebSocket frame: RSV1 must be clear"), 1002);
              return;
            }
            if (this._payloadLength > 125) {
              this.error(new RangeError(`Invalid WebSocket frame: invalid payload length ${this._payloadLength}`), 1002);
              return;
            }
          } else {
            this.error(new RangeError(`Invalid WebSocket frame: invalid opcode ${this._opcode}`), 1002);
            return;
          }
          if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
          this._masked = (buf[1] & 128) === 128;
          if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;else this.haveLength();
        }
        /**
         * Gets extended payload length (7+16).
         *
         * @private
         */
      }, {
        key: "getPayloadLength16",
        value: function getPayloadLength16() {
          var buf = this.consume(2);
          if (buf === null) return;
          this._payloadLength = buf.readUInt16BE(0, true);
          this.haveLength();
        }
        /**
         * Gets extended payload length (7+64).
         *
         * @private
         */
      }, {
        key: "getPayloadLength64",
        value: function getPayloadLength64() {
          var buf = this.consume(8);
          if (buf === null) return;
          var num = buf.readUInt32BE(0, true);
          if (num > Math.pow(2, 53 - 32) - 1) {
            this.error(new RangeError("Unsupported WebSocket frame: payload length > 2^53 - 1"), 1009);
            return;
          }
          this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4, true);
          this.haveLength();
        }
        /**
         * Payload length has been read.
         *
         * @private
         */
      }, {
        key: "haveLength",
        value: function haveLength() {
          if (this._opcode < 8 && this.maxPayloadExceeded(this._payloadLength)) {
            return;
          }
          if (this._masked) this._state = GET_MASK;else this._state = GET_DATA;
        }
        /**
         * Reads mask bytes.
         *
         * @private
         */
      }, {
        key: "getMask",
        value: function getMask() {
          this._mask = this.consume(4);
          if (this._mask === null) return;
          this._state = GET_DATA;
        }
        /**
         * Reads data bytes.
         *
         * @private
         */
      }, {
        key: "getData",
        value: function getData() {
          var data = constants.EMPTY_BUFFER;
          if (this._payloadLength) {
            data = this.consume(this._payloadLength);
            if (data === null) return;
            if (this._masked) bufferUtil.unmask(data, this._mask);
          }
          if (this._opcode > 7) {
            this.controlMessage(data);
          } else if (this._compressed) {
            this._state = INFLATING;
            this.decompress(data);
          } else if (this.pushFragment(data)) {
            this.dataMessage();
          }
        }
        /**
         * Decompresses data.
         *
         * @param {Buffer} data Compressed data
         * @private
         */
      }, {
        key: "decompress",
        value: function decompress(data) {
          var _this9 = this;
          var perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
          perMessageDeflate.decompress(data, this._fin, function (err, buf) {
            if (err) {
              _this9.error(err, err.closeCode === 1009 ? 1009 : 1007);
              return;
            }
            if (_this9.pushFragment(buf)) _this9.dataMessage();
            _this9.startLoop();
          });
        }
        /**
         * Handles a data message.
         *
         * @private
         */
      }, {
        key: "dataMessage",
        value: function dataMessage() {
          if (this._fin) {
            var messageLength = this._messageLength;
            var fragments = this._fragments;
            this._totalPayloadLength = 0;
            this._messageLength = 0;
            this._fragmented = 0;
            this._fragments = [];
            if (this._opcode === 2) {
              var data;
              if (this._binaryType === "nodebuffer") {
                data = toBuffer(fragments, messageLength);
              } else if (this._binaryType === "arraybuffer") {
                data = toArrayBuffer(toBuffer(fragments, messageLength));
              } else {
                data = fragments;
              }
              this.onmessage(data);
            } else {
              var buf = toBuffer(fragments, messageLength);
              if (!validation.isValidUTF8(buf)) {
                this.error(new Error("Invalid WebSocket frame: invalid UTF-8 sequence"), 1007);
                return;
              }
              this.onmessage(buf.toString());
            }
          }
          this._state = GET_INFO;
        }
        /**
         * Handles a control message.
         *
         * @param {Buffer} data Data to handle
         * @private
         */
      }, {
        key: "controlMessage",
        value: function controlMessage(data) {
          if (this._opcode === 8) {
            if (data.length === 0) {
              this._loop = false;
              this.onclose(1005, "");
              this.cleanup(this._cleanupCallback);
            } else if (data.length === 1) {
              this.error(new RangeError("Invalid WebSocket frame: invalid payload length 1"), 1002);
            } else {
              var code = data.readUInt16BE(0, true);
              if (!validation.isValidStatusCode(code)) {
                this.error(new RangeError(`Invalid WebSocket frame: invalid status code ${code}`), 1002);
                return;
              }
              var buf = data.slice(2);
              if (!validation.isValidUTF8(buf)) {
                this.error(new Error("Invalid WebSocket frame: invalid UTF-8 sequence"), 1007);
                return;
              }
              this._loop = false;
              this.onclose(code, buf.toString());
              this.cleanup(this._cleanupCallback);
            }
            return;
          }
          if (this._opcode === 9) this.onping(data);else this.onpong(data);
          this._state = GET_INFO;
        }
        /**
         * Handles an error.
         *
         * @param {Error} err The error
         * @param {Number} code Close code
         * @private
         */
      }, {
        key: "error",
        value: function error(err, code) {
          this._hadError = true;
          this._loop = false;
          this.onerror(err, code);
          this.cleanup(this._cleanupCallback);
        }
        /**
         * Checks payload size, disconnects socket when it exceeds `maxPayload`.
         *
         * @param {Number} length Payload length
         * @private
         */
      }, {
        key: "maxPayloadExceeded",
        value: function maxPayloadExceeded(length) {
          if (length === 0 || this._maxPayload < 1) return false;
          var fullLength = this._totalPayloadLength + length;
          if (fullLength <= this._maxPayload) {
            this._totalPayloadLength = fullLength;
            return false;
          }
          this.error(new RangeError("Max payload size exceeded"), 1009);
          return true;
        }
        /**
         * Appends a fragment in the fragments array after checking that the sum of
         * fragment lengths does not exceed `maxPayload`.
         *
         * @param {Buffer} fragment The fragment to add
         * @return {Boolean} `true` if `maxPayload` is not exceeded, else `false`
         * @private
         */
      }, {
        key: "pushFragment",
        value: function pushFragment(fragment) {
          if (fragment.length === 0) return true;
          var totalLength = this._messageLength + fragment.length;
          if (this._maxPayload < 1 || totalLength <= this._maxPayload) {
            this._messageLength = totalLength;
            this._fragments.push(fragment);
            return true;
          }
          this.error(new RangeError("Max payload size exceeded"), 1009);
          return false;
        }
        /**
         * Releases resources used by the receiver.
         *
         * @param {Function} cb Callback
         * @public
         */
      }, {
        key: "cleanup",
        value: function cleanup(cb) {
          if (this._extensions === null) {
            if (cb) cb();
            return;
          }
          if (!this._hadError && (this._loop || this._state === INFLATING)) {
            this._cleanupCallback = cb;
            this._isCleaningUp = true;
            return;
          }
          this._extensions = null;
          this._fragments = null;
          this._buffers = null;
          this._mask = null;
          this._cleanupCallback = null;
          this.onmessage = null;
          this.onclose = null;
          this.onerror = null;
          this.onping = null;
          this.onpong = null;
          if (cb) cb();
        }
      }]);
    }();
    module2.exports = Receiver;
    function toBuffer(fragments, messageLength) {
      if (fragments.length === 1) return fragments[0];
      if (fragments.length > 1) return bufferUtil.concat(fragments, messageLength);
      return constants.EMPTY_BUFFER;
    }
    function toArrayBuffer(buf) {
      if (buf.byteOffset === 0 && buf.byteLength === buf.buffer.byteLength) {
        return buf.buffer;
      }
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
  }
});

// node_modules/ws/lib/sender.js
var require_sender = __commonJS({
  "node_modules/ws/lib/sender.js"(exports2, module2) {
    "use strict";

    var safeBuffer = require_safe_buffer();
    var crypto = require("crypto");
    var PerMessageDeflate = require_permessage_deflate();
    var bufferUtil = require_buffer_util();
    var validation = require_validation();
    var constants = require_constants();
    var Buffer2 = safeBuffer.Buffer;
    var Sender = /*#__PURE__*/function () {
      /**
       * Creates a Sender instance.
       *
       * @param {net.Socket} socket The connection socket
       * @param {Object} extensions An object containing the negotiated extensions
       */
      function _Sender(socket2, extensions) {
        _classCallCheck(this, _Sender);
        this._extensions = extensions || {};
        this._socket = socket2;
        this._firstFragment = true;
        this._compress = false;
        this._bufferedBytes = 0;
        this._deflating = false;
        this._queue = [];
      }
      /**
       * Frames a piece of data according to the HyBi WebSocket protocol.
       *
       * @param {Buffer} data The data to frame
       * @param {Object} options Options object
       * @param {Number} options.opcode The opcode
       * @param {Boolean} options.readOnly Specifies whether `data` can be modified
       * @param {Boolean} options.fin Specifies whether or not to set the FIN bit
       * @param {Boolean} options.mask Specifies whether or not to mask `data`
       * @param {Boolean} options.rsv1 Specifies whether or not to set the RSV1 bit
       * @return {Buffer[]} The framed data as a list of `Buffer` instances
       * @public
       */
      return _createClass(_Sender, [{
        key: "close",
        value:
        /**
         * Sends a close message to the other peer.
         *
         * @param {(Number|undefined)} code The status code component of the body
         * @param {String} data The message component of the body
         * @param {Boolean} mask Specifies whether or not to mask the message
         * @param {Function} cb Callback
         * @public
         */
        function close(code, data, mask, cb) {
          var buf;
          if (code === void 0) {
            buf = constants.EMPTY_BUFFER;
          } else if (typeof code !== "number" || !validation.isValidStatusCode(code)) {
            throw new TypeError("First argument must be a valid error code number");
          } else if (data === void 0 || data === "") {
            buf = Buffer2.allocUnsafe(2);
            buf.writeUInt16BE(code, 0, true);
          } else {
            buf = Buffer2.allocUnsafe(2 + Buffer2.byteLength(data));
            buf.writeUInt16BE(code, 0, true);
            buf.write(data, 2);
          }
          if (this._deflating) {
            this.enqueue([this.doClose, buf, mask, cb]);
          } else {
            this.doClose(buf, mask, cb);
          }
        }
        /**
         * Frames and sends a close message.
         *
         * @param {Buffer} data The message to send
         * @param {Boolean} mask Specifies whether or not to mask `data`
         * @param {Function} cb Callback
         * @private
         */
      }, {
        key: "doClose",
        value: function doClose(data, mask, cb) {
          this.sendFrame(_Sender.frame(data, {
            fin: true,
            rsv1: false,
            opcode: 8,
            mask,
            readOnly: false
          }), cb);
        }
        /**
         * Sends a ping message to the other peer.
         *
         * @param {*} data The message to send
         * @param {Boolean} mask Specifies whether or not to mask `data`
         * @param {Function} cb Callback
         * @public
         */
      }, {
        key: "ping",
        value: function ping(data, mask, cb) {
          var readOnly = true;
          if (!Buffer2.isBuffer(data)) {
            if (data instanceof ArrayBuffer) {
              data = Buffer2.from(data);
            } else if (ArrayBuffer.isView(data)) {
              data = viewToBuffer(data);
            } else {
              data = Buffer2.from(data);
              readOnly = false;
            }
          }
          if (this._deflating) {
            this.enqueue([this.doPing, data, mask, readOnly, cb]);
          } else {
            this.doPing(data, mask, readOnly, cb);
          }
        }
        /**
         * Frames and sends a ping message.
         *
         * @param {*} data The message to send
         * @param {Boolean} mask Specifies whether or not to mask `data`
         * @param {Boolean} readOnly Specifies whether `data` can be modified
         * @param {Function} cb Callback
         * @private
         */
      }, {
        key: "doPing",
        value: function doPing(data, mask, readOnly, cb) {
          this.sendFrame(_Sender.frame(data, {
            fin: true,
            rsv1: false,
            opcode: 9,
            mask,
            readOnly
          }), cb);
        }
        /**
         * Sends a pong message to the other peer.
         *
         * @param {*} data The message to send
         * @param {Boolean} mask Specifies whether or not to mask `data`
         * @param {Function} cb Callback
         * @public
         */
      }, {
        key: "pong",
        value: function pong(data, mask, cb) {
          var readOnly = true;
          if (!Buffer2.isBuffer(data)) {
            if (data instanceof ArrayBuffer) {
              data = Buffer2.from(data);
            } else if (ArrayBuffer.isView(data)) {
              data = viewToBuffer(data);
            } else {
              data = Buffer2.from(data);
              readOnly = false;
            }
          }
          if (this._deflating) {
            this.enqueue([this.doPong, data, mask, readOnly, cb]);
          } else {
            this.doPong(data, mask, readOnly, cb);
          }
        }
        /**
         * Frames and sends a pong message.
         *
         * @param {*} data The message to send
         * @param {Boolean} mask Specifies whether or not to mask `data`
         * @param {Boolean} readOnly Specifies whether `data` can be modified
         * @param {Function} cb Callback
         * @private
         */
      }, {
        key: "doPong",
        value: function doPong(data, mask, readOnly, cb) {
          this.sendFrame(_Sender.frame(data, {
            fin: true,
            rsv1: false,
            opcode: 10,
            mask,
            readOnly
          }), cb);
        }
        /**
         * Sends a data message to the other peer.
         *
         * @param {*} data The message to send
         * @param {Object} options Options object
         * @param {Boolean} options.compress Specifies whether or not to compress `data`
         * @param {Boolean} options.binary Specifies whether `data` is binary or text
         * @param {Boolean} options.fin Specifies whether the fragment is the last one
         * @param {Boolean} options.mask Specifies whether or not to mask `data`
         * @param {Function} cb Callback
         * @public
         */
      }, {
        key: "send",
        value: function send(data, options, cb) {
          var opcode = options.binary ? 2 : 1;
          var rsv1 = options.compress;
          var readOnly = true;
          if (!Buffer2.isBuffer(data)) {
            if (data instanceof ArrayBuffer) {
              data = Buffer2.from(data);
            } else if (ArrayBuffer.isView(data)) {
              data = viewToBuffer(data);
            } else {
              data = Buffer2.from(data);
              readOnly = false;
            }
          }
          var perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
          if (this._firstFragment) {
            this._firstFragment = false;
            if (rsv1 && perMessageDeflate) {
              rsv1 = data.length >= perMessageDeflate._threshold;
            }
            this._compress = rsv1;
          } else {
            rsv1 = false;
            opcode = 0;
          }
          if (options.fin) this._firstFragment = true;
          if (perMessageDeflate) {
            var opts = {
              fin: options.fin,
              rsv1,
              opcode,
              mask: options.mask,
              readOnly
            };
            if (this._deflating) {
              this.enqueue([this.dispatch, data, this._compress, opts, cb]);
            } else {
              this.dispatch(data, this._compress, opts, cb);
            }
          } else {
            this.sendFrame(_Sender.frame(data, {
              fin: options.fin,
              rsv1: false,
              opcode,
              mask: options.mask,
              readOnly
            }), cb);
          }
        }
        /**
         * Dispatches a data message.
         *
         * @param {Buffer} data The message to send
         * @param {Boolean} compress Specifies whether or not to compress `data`
         * @param {Object} options Options object
         * @param {Number} options.opcode The opcode
         * @param {Boolean} options.readOnly Specifies whether `data` can be modified
         * @param {Boolean} options.fin Specifies whether or not to set the FIN bit
         * @param {Boolean} options.mask Specifies whether or not to mask `data`
         * @param {Boolean} options.rsv1 Specifies whether or not to set the RSV1 bit
         * @param {Function} cb Callback
         * @private
         */
      }, {
        key: "dispatch",
        value: function dispatch(data, compress, options, cb) {
          var _this0 = this;
          if (!compress) {
            this.sendFrame(_Sender.frame(data, options), cb);
            return;
          }
          var perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
          this._deflating = true;
          perMessageDeflate.compress(data, options.fin, function (_, buf) {
            options.readOnly = false;
            _this0.sendFrame(_Sender.frame(buf, options), cb);
            _this0._deflating = false;
            _this0.dequeue();
          });
        }
        /**
         * Executes queued send operations.
         *
         * @private
         */
      }, {
        key: "dequeue",
        value: function dequeue() {
          while (!this._deflating && this._queue.length) {
            var params = this._queue.shift();
            this._bufferedBytes -= params[1].length;
            params[0].apply(this, params.slice(1));
          }
        }
        /**
         * Enqueues a send operation.
         *
         * @param {Array} params Send operation parameters.
         * @private
         */
      }, {
        key: "enqueue",
        value: function enqueue(params) {
          this._bufferedBytes += params[1].length;
          this._queue.push(params);
        }
        /**
         * Sends a frame.
         *
         * @param {Buffer[]} list The frame to send
         * @param {Function} cb Callback
         * @private
         */
      }, {
        key: "sendFrame",
        value: function sendFrame(list, cb) {
          if (list.length === 2) {
            this._socket.write(list[0]);
            this._socket.write(list[1], cb);
          } else {
            this._socket.write(list[0], cb);
          }
        }
      }], [{
        key: "frame",
        value: function frame(data, options) {
          var merge = data.length < 1024 || options.mask && options.readOnly;
          var offset = options.mask ? 6 : 2;
          var payloadLength = data.length;
          if (data.length >= 65536) {
            offset += 8;
            payloadLength = 127;
          } else if (data.length > 125) {
            offset += 2;
            payloadLength = 126;
          }
          var target = Buffer2.allocUnsafe(merge ? data.length + offset : offset);
          target[0] = options.fin ? options.opcode | 128 : options.opcode;
          if (options.rsv1) target[0] |= 64;
          if (payloadLength === 126) {
            target.writeUInt16BE(data.length, 2, true);
          } else if (payloadLength === 127) {
            target.writeUInt32BE(0, 2, true);
            target.writeUInt32BE(data.length, 6, true);
          }
          if (!options.mask) {
            target[1] = payloadLength;
            if (merge) {
              data.copy(target, offset);
              return [target];
            }
            return [target, data];
          }
          var mask = crypto.randomBytes(4);
          target[1] = payloadLength | 128;
          target[offset - 4] = mask[0];
          target[offset - 3] = mask[1];
          target[offset - 2] = mask[2];
          target[offset - 1] = mask[3];
          if (merge) {
            bufferUtil.mask(data, mask, target, offset, data.length);
            return [target];
          }
          bufferUtil.mask(data, mask, data, 0, data.length);
          return [target, data];
        }
      }]);
    }();
    module2.exports = Sender;
    function viewToBuffer(view) {
      var buf = Buffer2.from(view.buffer);
      if (view.byteLength !== view.buffer.byteLength) {
        return buf.slice(view.byteOffset, view.byteOffset + view.byteLength);
      }
      return buf;
    }
  }
});

// node_modules/ws/lib/websocket.js
var require_websocket = __commonJS({
  "node_modules/ws/lib/websocket.js"(exports2, module2) {
    "use strict";

    var EventEmitter = require("events");
    var crypto = require("crypto");
    var https = require("https");
    var http2 = require("http");
    var url = require("url");
    var PerMessageDeflate = require_permessage_deflate();
    var EventTarget = require_event_target();
    var extension = require_extension();
    var constants = require_constants();
    var Receiver = require_receiver();
    var Sender = require_sender();
    var readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    var protocolVersions = [8, 13];
    var closeTimeout = 30 * 1e3;
    var WebSocket2 = /*#__PURE__*/function (_EventEmitter) {
      /**
       * Create a new `WebSocket`.
       *
       * @param {String} address The URL to which to connect
       * @param {(String|String[])} protocols The subprotocols
       * @param {Object} options Connection options
       */
      function _WebSocket(address, protocols, options) {
        var _this1;
        _classCallCheck(this, _WebSocket);
        _this1 = _callSuper(this, _WebSocket);
        _this1.readyState = _WebSocket.CONNECTING;
        _this1.protocol = "";
        _this1._binaryType = constants.BINARY_TYPES[0];
        _this1._finalize = _this1.finalize.bind(_this1);
        _this1._closeFrameReceived = false;
        _this1._closeFrameSent = false;
        _this1._closeMessage = "";
        _this1._closeTimer = null;
        _this1._finalized = false;
        _this1._closeCode = 1006;
        _this1._extensions = {};
        _this1._isServer = true;
        _this1._receiver = null;
        _this1._sender = null;
        _this1._socket = null;
        _this1._error = null;
        if (address !== null) {
          if (!protocols) {
            protocols = [];
          } else if (typeof protocols === "string") {
            protocols = [protocols];
          } else if (!Array.isArray(protocols)) {
            options = protocols;
            protocols = [];
          }
          initAsClient.call(_this1, address, protocols, options);
        }
        return _this1;
      }
      _inherits(_WebSocket, _EventEmitter);
      return _createClass(_WebSocket, [{
        key: "CONNECTING",
        get: function get() {
          return _WebSocket.CONNECTING;
        }
      }, {
        key: "CLOSING",
        get: function get() {
          return _WebSocket.CLOSING;
        }
      }, {
        key: "CLOSED",
        get: function get() {
          return _WebSocket.CLOSED;
        }
      }, {
        key: "OPEN",
        get: function get() {
          return _WebSocket.OPEN;
        }
        /**
         * This deviates from the WHATWG interface since ws doesn't support the required
         * default "blob" type (instead we define a custom "nodebuffer" type).
         *
         * @type {String}
         */
      }, {
        key: "binaryType",
        get: function get() {
          return this._binaryType;
        },
        set: function set(type) {
          if (constants.BINARY_TYPES.indexOf(type) < 0) return;
          this._binaryType = type;
          if (this._receiver) this._receiver._binaryType = type;
        }
        /**
         * @type {Number}
         */
      }, {
        key: "bufferedAmount",
        get: function get() {
          if (!this._socket) return 0;
          return (this._socket.bufferSize || 0) + this._sender._bufferedBytes;
        }
        /**
         * @type {String}
         */
      }, {
        key: "extensions",
        get: function get() {
          return Object.keys(this._extensions).join();
        }
        /**
         * Set up the socket and the internal resources.
         *
         * @param {net.Socket} socket The network socket between the server and client
         * @param {Buffer} head The first packet of the upgraded stream
         * @param {Number} maxPayload The maximum allowed message size
         * @private
         */
      }, {
        key: "setSocket",
        value: function setSocket(socket2, head, maxPayload) {
          var _this10 = this;
          socket2.setTimeout(0);
          socket2.setNoDelay();
          socket2.on("close", this._finalize);
          socket2.on("error", this._finalize);
          socket2.on("end", this._finalize);
          this._receiver = new Receiver(this._extensions, maxPayload, this.binaryType);
          this._sender = new Sender(socket2, this._extensions);
          this._socket = socket2;
          if (head.length > 0) socket2.unshift(head);
          socket2.on("data", this._receiver.add);
          this._receiver.onmessage = function (data) {
            return _this10.emit("message", data);
          };
          this._receiver.onping = function (data) {
            _this10.pong(data, !_this10._isServer, constants.NOOP);
            _this10.emit("ping", data);
          };
          this._receiver.onpong = function (data) {
            return _this10.emit("pong", data);
          };
          this._receiver.onclose = function (code, reason) {
            _this10._socket.removeListener("data", _this10._receiver.add);
            _this10._closeFrameReceived = true;
            _this10._closeMessage = reason;
            _this10._closeCode = code;
            if (code === 1005) _this10.close();else _this10.close(code, reason);
          };
          this._receiver.onerror = function (error, code) {
            if (_this10._error) return;
            _this10._closeCode = code;
            if (!_this10._finalized) _this10.finalize(error);else _this10.emit("error", error);
          };
          this.readyState = _WebSocket.OPEN;
          this.emit("open");
        }
        /**
         * Clean up internal resources and emit the `'close'` event.
         *
         * @param {(Boolean|Error)} error Indicates whether or not an error occurred
         * @private
         */
      }, {
        key: "finalize",
        value: function finalize(error) {
          var _this11 = this;
          if (this._finalized) return;
          this.readyState = _WebSocket.CLOSING;
          this._finalized = true;
          if (!this._socket) {
            this.emit("error", error);
            this.readyState = _WebSocket.CLOSED;
            this.emit("close", this._closeCode, this._closeMessage);
            return;
          }
          clearTimeout(this._closeTimer);
          this._socket.removeListener("data", this._receiver.add);
          this._socket.removeListener("close", this._finalize);
          this._socket.removeListener("error", this._finalize);
          this._socket.removeListener("end", this._finalize);
          this._socket.on("error", constants.NOOP);
          if (error) {
            if (error !== true) this._error = error;
            this._socket.destroy();
          } else {
            this._socket.end();
          }
          this._receiver.cleanup(function () {
            var err = _this11._error;
            if (err) {
              _this11._error = null;
              _this11.emit("error", err);
            }
            _this11.readyState = _WebSocket.CLOSED;
            if (_this11._extensions[PerMessageDeflate.extensionName]) {
              _this11._extensions[PerMessageDeflate.extensionName].cleanup();
            }
            _this11.emit("close", _this11._closeCode, _this11._closeMessage);
          });
        }
        /**
         * Start a closing handshake.
         *
         *            +----------+     +-----------+   +----------+
         *     + - - -|ws.close()|---->|close frame|-->|ws.close()|- - - -
         *            +----------+     +-----------+   +----------+       |
         *     |      +----------+     +-----------+         |
         *            |ws.close()|<----|close frame|<--------+            |
         *            +----------+     +-----------+         |
         *  CLOSING         |              +---+             |         CLOSING
         *                  |          +---|fin|<------------+
         *     |            |          |   +---+                          |
         *                  |          |   +---+      +-------------+
         *     |            +----------+-->|fin|----->|ws.finalize()| - - +
         *                             |   +---+      +-------------+
         *     |     +-------------+   |
         *      - - -|ws.finalize()|<--+
         *           +-------------+
         *
         * @param {Number} code Status code explaining why the connection is closing
         * @param {String} data A string explaining why the connection is closing
         * @public
         */
      }, {
        key: "close",
        value: function close(code, data) {
          var _this12 = this;
          if (this.readyState === _WebSocket.CLOSED) return;
          if (this.readyState === _WebSocket.CONNECTING) {
            this._req.abort();
            this.finalize(new Error("WebSocket was closed before the connection was established"));
            return;
          }
          if (this.readyState === _WebSocket.CLOSING) {
            if (this._closeFrameSent && this._closeFrameReceived) this._socket.end();
            return;
          }
          this.readyState = _WebSocket.CLOSING;
          this._sender.close(code, data, !this._isServer, function (err) {
            if (err) return;
            _this12._closeFrameSent = true;
            if (!_this12._finalized) {
              if (_this12._closeFrameReceived) _this12._socket.end();
              _this12._closeTimer = setTimeout(_this12._finalize, closeTimeout, true);
            }
          });
        }
        /**
         * Send a ping.
         *
         * @param {*} data The data to send
         * @param {Boolean} mask Indicates whether or not to mask `data`
         * @param {Function} cb Callback which is executed when the ping is sent
         * @public
         */
      }, {
        key: "ping",
        value: function ping(data, mask, cb) {
          if (typeof data === "function") {
            cb = data;
            data = mask = void 0;
          } else if (typeof mask === "function") {
            cb = mask;
            mask = void 0;
          }
          if (this.readyState !== _WebSocket.OPEN) {
            var err = new Error(`WebSocket is not open: readyState ${this.readyState} (${readyStates[this.readyState]})`);
            if (cb) return cb(err);
            throw err;
          }
          if (typeof data === "number") data = data.toString();
          if (mask === void 0) mask = !this._isServer;
          this._sender.ping(data || constants.EMPTY_BUFFER, mask, cb);
        }
        /**
         * Send a pong.
         *
         * @param {*} data The data to send
         * @param {Boolean} mask Indicates whether or not to mask `data`
         * @param {Function} cb Callback which is executed when the pong is sent
         * @public
         */
      }, {
        key: "pong",
        value: function pong(data, mask, cb) {
          if (typeof data === "function") {
            cb = data;
            data = mask = void 0;
          } else if (typeof mask === "function") {
            cb = mask;
            mask = void 0;
          }
          if (this.readyState !== _WebSocket.OPEN) {
            var err = new Error(`WebSocket is not open: readyState ${this.readyState} (${readyStates[this.readyState]})`);
            if (cb) return cb(err);
            throw err;
          }
          if (typeof data === "number") data = data.toString();
          if (mask === void 0) mask = !this._isServer;
          this._sender.pong(data || constants.EMPTY_BUFFER, mask, cb);
        }
        /**
         * Send a data message.
         *
         * @param {*} data The message to send
         * @param {Object} options Options object
         * @param {Boolean} options.compress Specifies whether or not to compress `data`
         * @param {Boolean} options.binary Specifies whether `data` is binary or text
         * @param {Boolean} options.fin Specifies whether the fragment is the last one
         * @param {Boolean} options.mask Specifies whether or not to mask `data`
         * @param {Function} cb Callback which is executed when data is written out
         * @public
         */
      }, {
        key: "send",
        value: function send(data, options, cb) {
          if (typeof options === "function") {
            cb = options;
            options = {};
          }
          if (this.readyState !== _WebSocket.OPEN) {
            var err = new Error(`WebSocket is not open: readyState ${this.readyState} (${readyStates[this.readyState]})`);
            if (cb) return cb(err);
            throw err;
          }
          if (typeof data === "number") data = data.toString();
          var opts = Object.assign({
            binary: typeof data !== "string",
            mask: !this._isServer,
            compress: true,
            fin: true
          }, options);
          if (!this._extensions[PerMessageDeflate.extensionName]) {
            opts.compress = false;
          }
          this._sender.send(data || constants.EMPTY_BUFFER, opts, cb);
        }
        /**
         * Forcibly close the connection.
         *
         * @public
         */
      }, {
        key: "terminate",
        value: function terminate() {
          if (this.readyState === _WebSocket.CLOSED) return;
          if (this.readyState === _WebSocket.CONNECTING) {
            this._req.abort();
            this.finalize(new Error("WebSocket was closed before the connection was established"));
            return;
          }
          this.finalize(true);
        }
      }]);
    }(EventEmitter);
    readyStates.forEach(function (readyState, i) {
      WebSocket2[readyStates[i]] = i;
    });
    ["open", "error", "close", "message"].forEach(function (method) {
      Object.defineProperty(WebSocket2.prototype, `on${method}`, {
        /**
         * Return the listener of the event.
         *
         * @return {(Function|undefined)} The event listener or `undefined`
         * @public
         */
        get() {
          var listeners = this.listeners(method);
          for (var i = 0; i < listeners.length; i++) {
            if (listeners[i]._listener) return listeners[i]._listener;
          }
        },
        /**
         * Add a listener for the event.
         *
         * @param {Function} listener The listener to add
         * @public
         */
        set(listener) {
          var listeners = this.listeners(method);
          for (var i = 0; i < listeners.length; i++) {
            if (listeners[i]._listener) this.removeListener(method, listeners[i]);
          }
          this.addEventListener(method, listener);
        }
      });
    });
    WebSocket2.prototype.addEventListener = EventTarget.addEventListener;
    WebSocket2.prototype.removeEventListener = EventTarget.removeEventListener;
    module2.exports = WebSocket2;
    function initAsClient(address, protocols, options) {
      var _this13 = this;
      options = Object.assign({
        protocolVersion: protocolVersions[1],
        protocol: protocols.join(","),
        perMessageDeflate: true,
        handshakeTimeout: null,
        localAddress: null,
        headers: null,
        family: null,
        origin: null,
        agent: null,
        host: null,
        //
        // SSL options.
        //
        checkServerIdentity: null,
        rejectUnauthorized: null,
        passphrase: null,
        ciphers: null,
        ecdhCurve: null,
        cert: null,
        key: null,
        pfx: null,
        ca: null
      }, options);
      if (protocolVersions.indexOf(options.protocolVersion) === -1) {
        throw new RangeError(`Unsupported protocol version: ${options.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`);
      }
      this._isServer = false;
      this.url = address;
      var serverUrl = url.parse(address);
      var isUnixSocket = serverUrl.protocol === "ws+unix:";
      if (!serverUrl.host && (!isUnixSocket || !serverUrl.path)) {
        throw new Error(`Invalid URL: ${address}`);
      }
      var isSecure = serverUrl.protocol === "wss:" || serverUrl.protocol === "https:";
      var key = crypto.randomBytes(16).toString("base64");
      var httpObj = isSecure ? https : http2;
      var perMessageDeflate;
      var requestOptions = {
        port: serverUrl.port || (isSecure ? 443 : 80),
        host: serverUrl.hostname,
        path: "/",
        headers: {
          "Sec-WebSocket-Version": options.protocolVersion,
          "Sec-WebSocket-Key": key,
          "Connection": "Upgrade",
          "Upgrade": "websocket"
        }
      };
      if (options.headers) Object.assign(requestOptions.headers, options.headers);
      if (options.perMessageDeflate) {
        perMessageDeflate = new PerMessageDeflate(options.perMessageDeflate !== true ? options.perMessageDeflate : {}, false);
        requestOptions.headers["Sec-WebSocket-Extensions"] = extension.format({
          [PerMessageDeflate.extensionName]: perMessageDeflate.offer()
        });
      }
      if (options.protocol) {
        requestOptions.headers["Sec-WebSocket-Protocol"] = options.protocol;
      }
      if (options.origin) {
        if (options.protocolVersion < 13) {
          requestOptions.headers["Sec-WebSocket-Origin"] = options.origin;
        } else {
          requestOptions.headers.Origin = options.origin;
        }
      }
      if (options.host) requestOptions.headers.Host = options.host;
      if (serverUrl.auth) requestOptions.auth = serverUrl.auth;
      if (options.localAddress) requestOptions.localAddress = options.localAddress;
      if (options.family) requestOptions.family = options.family;
      if (isUnixSocket) {
        var parts = serverUrl.path.split(":");
        requestOptions.socketPath = parts[0];
        requestOptions.path = parts[1];
      } else if (serverUrl.path) {
        if (serverUrl.path.charAt(0) !== "/") {
          requestOptions.path = `/${serverUrl.path}`;
        } else {
          requestOptions.path = serverUrl.path;
        }
      }
      var agent = options.agent;
      if (options.rejectUnauthorized != null || options.checkServerIdentity || options.passphrase || options.ciphers || options.ecdhCurve || options.cert || options.key || options.pfx || options.ca) {
        if (options.passphrase) requestOptions.passphrase = options.passphrase;
        if (options.ciphers) requestOptions.ciphers = options.ciphers;
        if (options.ecdhCurve) requestOptions.ecdhCurve = options.ecdhCurve;
        if (options.cert) requestOptions.cert = options.cert;
        if (options.key) requestOptions.key = options.key;
        if (options.pfx) requestOptions.pfx = options.pfx;
        if (options.ca) requestOptions.ca = options.ca;
        if (options.checkServerIdentity) {
          requestOptions.checkServerIdentity = options.checkServerIdentity;
        }
        if (options.rejectUnauthorized != null) {
          requestOptions.rejectUnauthorized = options.rejectUnauthorized;
        }
        if (!agent) agent = new httpObj.Agent(requestOptions);
      }
      if (agent) requestOptions.agent = agent;
      this._req = httpObj.get(requestOptions);
      if (options.handshakeTimeout) {
        this._req.setTimeout(options.handshakeTimeout, function () {
          _this13._req.abort();
          _this13.finalize(new Error("Opening handshake has timed out"));
        });
      }
      this._req.on("error", function (error) {
        if (_this13._req.aborted) return;
        _this13._req = null;
        _this13.finalize(error);
      });
      this._req.on("response", function (res) {
        if (!_this13.emit("unexpected-response", _this13._req, res)) {
          _this13._req.abort();
          _this13.finalize(new Error(`Unexpected server response: ${res.statusCode}`));
        }
      });
      this._req.on("upgrade", function (res, socket2, head) {
        _this13.emit("upgrade", res);
        if (_this13.readyState !== WebSocket2.CONNECTING) return;
        _this13._req = null;
        var digest = crypto.createHash("sha1").update(key + constants.GUID, "binary").digest("base64");
        if (res.headers["sec-websocket-accept"] !== digest) {
          socket2.destroy();
          return _this13.finalize(new Error("Invalid Sec-WebSocket-Accept header"));
        }
        var serverProt = res.headers["sec-websocket-protocol"];
        var protList = (options.protocol || "").split(/, */);
        var protError;
        if (!options.protocol && serverProt) {
          protError = "Server sent a subprotocol but none was requested";
        } else if (options.protocol && !serverProt) {
          protError = "Server sent no subprotocol";
        } else if (serverProt && protList.indexOf(serverProt) === -1) {
          protError = "Server sent an invalid subprotocol";
        }
        if (protError) {
          socket2.destroy();
          return _this13.finalize(new Error(protError));
        }
        if (serverProt) _this13.protocol = serverProt;
        if (perMessageDeflate) {
          try {
            var extensions = extension.parse(res.headers["sec-websocket-extensions"]);
            if (extensions[PerMessageDeflate.extensionName]) {
              perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
              _this13._extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            socket2.destroy();
            _this13.finalize(new Error("Invalid Sec-WebSocket-Extensions header"));
            return;
          }
        }
        _this13.setSocket(socket2, head, 0);
      });
    }
  }
});

// node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "node_modules/ws/lib/websocket-server.js"(exports2, module2) {
    "use strict";

    var safeBuffer = require_safe_buffer();
    var EventEmitter = require("events");
    var crypto = require("crypto");
    var http2 = require("http");
    var url = require("url");
    var PerMessageDeflate = require_permessage_deflate();
    var extension = require_extension();
    var constants = require_constants();
    var WebSocket2 = require_websocket();
    var Buffer2 = safeBuffer.Buffer;
    var WebSocketServer = /*#__PURE__*/function (_EventEmitter2) {
      /**
       * Create a `WebSocketServer` instance.
       *
       * @param {Object} options Configuration options
       * @param {String} options.host The hostname where to bind the server
       * @param {Number} options.port The port where to bind the server
       * @param {http.Server} options.server A pre-created HTTP/S server to use
       * @param {Function} options.verifyClient An hook to reject connections
       * @param {Function} options.handleProtocols An hook to handle protocols
       * @param {String} options.path Accept only connections matching this path
       * @param {Boolean} options.noServer Enable no server mode
       * @param {Boolean} options.clientTracking Specifies whether or not to track clients
       * @param {(Boolean|Object)} options.perMessageDeflate Enable/disable permessage-deflate
       * @param {Number} options.maxPayload The maximum allowed message size
       * @param {Function} callback A listener for the `listening` event
       */
      function WebSocketServer(options, callback) {
        var _this14;
        _classCallCheck(this, WebSocketServer);
        _this14 = _callSuper(this, WebSocketServer);
        options = Object.assign({
          maxPayload: 100 * 1024 * 1024,
          perMessageDeflate: false,
          handleProtocols: null,
          clientTracking: true,
          verifyClient: null,
          noServer: false,
          backlog: null,
          // use default (511 as implemented in net.js)
          server: null,
          host: null,
          path: null,
          port: null
        }, options);
        if (options.port == null && !options.server && !options.noServer) {
          throw new TypeError('One of the "port", "server", or "noServer" options must be specified');
        }
        if (options.port != null) {
          _this14._server = http2.createServer(function (req, res) {
            var body = http2.STATUS_CODES[426];
            res.writeHead(426, {
              "Content-Length": body.length,
              "Content-Type": "text/plain"
            });
            res.end(body);
          });
          _this14._server.listen(options.port, options.host, options.backlog, callback);
        } else if (options.server) {
          _this14._server = options.server;
        }
        if (_this14._server) {
          _this14._removeListeners = addListeners(_this14._server, {
            listening: _this14.emit.bind(_this14, "listening"),
            error: _this14.emit.bind(_this14, "error"),
            upgrade: function upgrade(req, socket2, head) {
              _this14.handleUpgrade(req, socket2, head, function (ws) {
                _this14.emit("connection", ws, req);
              });
            }
          });
        }
        if (options.perMessageDeflate === true) options.perMessageDeflate = {};
        if (options.clientTracking) _this14.clients = /* @__PURE__ */new Set();
        _this14.options = options;
        return _this14;
      }
      /**
       * Returns the bound address, the address family name, and port of the server
       * as reported by the operating system if listening on an IP socket.
       * If the server is listening on a pipe or UNIX domain socket, the name is
       * returned as a string.
       *
       * @return {(Object|String|null)} The address of the server
       * @public
       */
      _inherits(WebSocketServer, _EventEmitter2);
      return _createClass(WebSocketServer, [{
        key: "address",
        value: function address() {
          if (this.options.noServer) {
            throw new Error('The server is operating in "noServer" mode');
          }
          if (!this._server) return null;
          return this._server.address();
        }
        /**
         * Close the server.
         *
         * @param {Function} cb Callback
         * @public
         */
      }, {
        key: "close",
        value: function close(cb) {
          if (this.clients) {
            var _iterator = _createForOfIteratorHelper(this.clients),
              _step;
            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var client = _step.value;
                client.terminate();
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          }
          var server = this._server;
          if (server) {
            this._removeListeners();
            this._removeListeners = this._server = null;
            if (this.options.port != null) return server.close(cb);
          }
          if (cb) cb();
        }
        /**
         * See if a given request should be handled by this server instance.
         *
         * @param {http.IncomingMessage} req Request object to inspect
         * @return {Boolean} `true` if the request is valid, else `false`
         * @public
         */
      }, {
        key: "shouldHandle",
        value: function shouldHandle(req) {
          if (this.options.path && url.parse(req.url).pathname !== this.options.path) {
            return false;
          }
          return true;
        }
        /**
         * Handle a HTTP Upgrade request.
         *
         * @param {http.IncomingMessage} req The request object
         * @param {net.Socket} socket The network socket between the server and client
         * @param {Buffer} head The first packet of the upgraded stream
         * @param {Function} cb Callback
         * @public
         */
      }, {
        key: "handleUpgrade",
        value: function handleUpgrade(req, socket2, head, cb) {
          var _this15 = this;
          socket2.on("error", socketOnError);
          var version = +req.headers["sec-websocket-version"];
          var extensions = {};
          if (req.method !== "GET" || req.headers.upgrade.toLowerCase() !== "websocket" || !req.headers["sec-websocket-key"] || version !== 8 && version !== 13 || !this.shouldHandle(req)) {
            return abortConnection(socket2, 400);
          }
          if (this.options.perMessageDeflate) {
            var perMessageDeflate = new PerMessageDeflate(this.options.perMessageDeflate, true, this.options.maxPayload);
            try {
              var offers = extension.parse(req.headers["sec-websocket-extensions"]);
              if (offers[PerMessageDeflate.extensionName]) {
                perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
                extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
              }
            } catch (err) {
              return abortConnection(socket2, 400);
            }
          }
          var protocol = (req.headers["sec-websocket-protocol"] || "").split(/, */);
          if (this.options.handleProtocols) {
            protocol = this.options.handleProtocols(protocol, req);
            if (protocol === false) return abortConnection(socket2, 401);
          } else {
            protocol = protocol[0];
          }
          if (this.options.verifyClient) {
            var info = {
              origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
              secure: !!(req.connection.authorized || req.connection.encrypted),
              req
            };
            if (this.options.verifyClient.length === 2) {
              this.options.verifyClient(info, function (verified, code, message) {
                if (!verified) return abortConnection(socket2, code || 401, message);
                _this15.completeUpgrade(protocol, extensions, req, socket2, head, cb);
              });
              return;
            }
            if (!this.options.verifyClient(info)) return abortConnection(socket2, 401);
          }
          this.completeUpgrade(protocol, extensions, req, socket2, head, cb);
        }
        /**
         * Upgrade the connection to WebSocket.
         *
         * @param {String} protocol The chosen subprotocol
         * @param {Object} extensions The accepted extensions
         * @param {http.IncomingMessage} req The request object
         * @param {net.Socket} socket The network socket between the server and client
         * @param {Buffer} head The first packet of the upgraded stream
         * @param {Function} cb Callback
         * @private
         */
      }, {
        key: "completeUpgrade",
        value: function completeUpgrade(protocol, extensions, req, socket2, head, cb) {
          var _this16 = this;
          if (!socket2.readable || !socket2.writable) return socket2.destroy();
          var key = crypto.createHash("sha1").update(req.headers["sec-websocket-key"] + constants.GUID, "binary").digest("base64");
          var headers = ["HTTP/1.1 101 Switching Protocols", "Upgrade: websocket", "Connection: Upgrade", `Sec-WebSocket-Accept: ${key}`];
          var ws = new WebSocket2(null);
          if (protocol) {
            headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
            ws.protocol = protocol;
          }
          if (extensions[PerMessageDeflate.extensionName]) {
            var params = extensions[PerMessageDeflate.extensionName].params;
            var value = extension.format({
              [PerMessageDeflate.extensionName]: [params]
            });
            headers.push(`Sec-WebSocket-Extensions: ${value}`);
            ws._extensions = extensions;
          }
          this.emit("headers", headers, req);
          socket2.write(headers.concat("\r\n").join("\r\n"));
          socket2.removeListener("error", socketOnError);
          ws.setSocket(socket2, head, this.options.maxPayload);
          if (this.clients) {
            this.clients.add(ws);
            ws.on("close", function () {
              return _this16.clients.delete(ws);
            });
          }
          cb(ws);
        }
      }]);
    }(EventEmitter);
    module2.exports = WebSocketServer;
    function addListeners(server, map) {
      for (var _i = 0, _Object$keys = Object.keys(map); _i < _Object$keys.length; _i++) {
        var event = _Object$keys[_i];
        server.on(event, map[event]);
      }
      return function removeListeners() {
        for (var _i2 = 0, _Object$keys2 = Object.keys(map); _i2 < _Object$keys2.length; _i2++) {
          var _event = _Object$keys2[_i2];
          server.removeListener(_event, map[_event]);
        }
      };
    }
    function socketOnError() {
      this.destroy();
    }
    function abortConnection(socket2, code, message) {
      if (socket2.writable) {
        message = message || http2.STATUS_CODES[code];
        socket2.write(`HTTP/1.1 ${code} ${http2.STATUS_CODES[code]}\r
Connection: close\r
Content-type: text/html\r
Content-Length: ${Buffer2.byteLength(message)}\r
\r
` + message);
      }
      socket2.removeListener("error", socketOnError);
      socket2.destroy();
    }
  }
});

// node_modules/ws/index.js
var require_ws = __commonJS({
  "node_modules/ws/index.js"(exports2, module2) {
    "use strict";

    var WebSocket2 = require_websocket();
    WebSocket2.Server = require_websocket_server();
    WebSocket2.Receiver = require_receiver();
    WebSocket2.Sender = require_sender();
    module2.exports = WebSocket2;
  }
});

// src/service.js
var fs = require("fs");
var http = require("http");
var WebSocket = require_ws();
var VERSION = "1.1.0";
var BINDING = "__luminaNative";
var socket = null;
var contexts = {};
var mainContext = null;
var sequence = 0;
var pending = {};
var busy = false;
var discovering = false;
var registeredContext = null;
var disposed = false;
var allowed = ["status", "play", "pause", "toggle", "seek", "unmute", "click"];
function isLuminaPage(url) {
  try {
    url = decodeURIComponent(url || "");
  } catch (e) {
    return false;
  }
  return /^http:\/\/(127\.0\.0\.1|localhost):8081\/module\/gh\/erickzp93\/lumitv(?:@[^/]+)?\/dist\/index\.html(?:[?#]|$)/.test(url);
}
function listeningPorts(text) {
  var ports = {};
  text.split("\n").slice(1).forEach(function (line) {
    var columns = line.trim().split(/\s+/);
    if (columns[3] !== "0A") return;
    var port = parseInt((columns[1] || "").split(":").pop(), 16);
    if (port > 1024 && port !== 8081 && port !== 26101) ports[port] = true;
  });
  return Object.keys(ports).map(Number);
}
function getPages(port) {
  return new Promise(function (resolve) {
    var request = http.get({
      host: "127.0.0.1",
      port,
      path: "/json/list"
    }, function (response) {
      var data = "";
      response.on("data", function (chunk) {
        data += chunk;
        if (data.length > 1e5) request.destroy();
      });
      response.on("end", function () {
        try {
          var pages = JSON.parse(data);
          resolve(Array.isArray(pages) ? pages : []);
        } catch (e) {
          resolve([]);
        }
      });
    });
    request.setTimeout(500, function () {
      request.destroy();
      resolve([]);
    });
    request.on("error", function () {
      resolve([]);
    });
  });
}
function call(method, params) {
  return new Promise(function (resolve, reject) {
    if (!socket || socket.readyState !== WebSocket.OPEN) return reject(new Error("BRIDGE_OFFLINE"));
    var id = ++sequence;
    var timer = setTimeout(function () {
      delete pending[id];
      reject(new Error("COMMAND_TIMEOUT"));
    }, 5e3);
    pending[id] = {
      resolve,
      reject,
      timer
    };
    socket.send(JSON.stringify({
      id,
      method,
      params: params || {}
    }));
  });
}
function evaluate(contextId, expression, gesture) {
  return call("Runtime.evaluate", {
    contextId,
    expression,
    returnByValue: true,
    awaitPromise: true,
    userGesture: !!gesture
  }).then(function (result) {
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "EVALUATION_FAILED");
    return result.result && result.result.value;
  });
}
function mediaCommand(command) {
  var video = document.querySelector("video");
  var player = document.querySelector("[data-media-player]");
  function request(type, detail) {
    if (!player) return false;
    player.dispatchEvent(new CustomEvent(type, {
      detail,
      bubbles: true,
      composed: true
    }));
    return true;
  }
  function seek(time) {
    var target = Math.max(0, Math.min(time, video.duration > 0 ? video.duration - 0.1 : time));
    if (!request("media-seek-request", target)) video.currentTime = target;
  }
  function snapshot() {
    if (!video) return {
      error: "VIDEO_NOT_READY"
    };
    return {
      currentTime: video.currentTime,
      duration: isFinite(video.duration) ? video.duration : 0,
      paused: video.paused,
      ended: video.ended,
      muted: video.muted,
      volume: video.volume,
      readyState: video.readyState,
      error: video.error ? video.error.message || "MEDIA_ERROR_" + video.error.code : null
    };
  }
  if (command.action === "click") {
    var element = document.elementFromPoint(command.x, command.y);
    if (element && typeof element.click === "function") element.click();
    return Promise.resolve(snapshot());
  }
  if (!video || command.action !== "status" && video.readyState === 0) return Promise.resolve({
    error: "VIDEO_NOT_READY"
  });
  var action = command.action;
  if (action === "toggle") action = video.paused ? "play" : "pause";
  if (action === "play" && video.readyState < 2) return Promise.resolve({
    error: "VIDEO_NOT_READY"
  });
  if (action === "play" || action === "unmute") {
    var volume = typeof command.volume === "number" ? Math.max(0, Math.min(1, command.volume)) : 0.5;
    request("media-volume-change-request", volume);
    request("media-unmute-request");
    video.muted = false;
    video.defaultMuted = false;
    video.volume = volume;
  }
  if (action === "play" && typeof command.startAt === "number" && Math.abs(video.currentTime - command.startAt) > 0.5) {
    seek(command.startAt);
  }
  if (action === "pause") {
    request("media-pause-request");
    video.pause();
  }
  if (action === "seek") seek(video.currentTime + command.seconds);
  if (action === "play") {
    try {
      request("media-play-request");
      return Promise.resolve(video.play()).then(snapshot, function (error) {
        return {
          error: error.name + ": " + error.message
        };
      });
    } catch (error) {
      return Promise.resolve({
        error: error.message
      });
    }
  }
  return Promise.resolve(snapshot());
}
function sendToApp(method, data) {
  if (mainContext === null) return Promise.resolve();
  return evaluate(mainContext, "window.LuminaBridge && window.LuminaBridge." + method + "(" + JSON.stringify(data) + ")");
}
function locate() {
  var videoFrameId = null;
  return call("Page.getFrameTree").then(function (result) {
    var frameId = result.frameTree.frame.id;
    (result.frameTree.childFrames || []).forEach(function (child) {
      if (child.frame.name === "lumina-player") videoFrameId = child.frame.id;
    });
    mainContext = null;
    Object.keys(contexts).forEach(function (id) {
      if (contexts[id] === frameId) mainContext = Number(id);
    });
    if (mainContext === null || !isLuminaPage(result.frameTree.frame.url)) throw new Error("APP_NOT_READY");
    return evaluate(mainContext, "window.LuminaBridge && window.LuminaBridge.context()");
  }).then(function (metadata) {
    if (!metadata) throw new Error("APP_NOT_READY");
    var bind = registeredContext === mainContext ? Promise.resolve() : call("Runtime.addBinding", {
      name: BINDING,
      executionContextId: mainContext
    }).then(function () {
      registeredContext = mainContext;
    });
    return bind.then(function () {
      return sendToApp("ready", {
        version: VERSION
      });
    }).then(function () {
      if (metadata.view !== "player") return {
        metadata,
        contextId: null
      };
      var contextId = null;
      Object.keys(contexts).forEach(function (id) {
        if (videoFrameId !== null && contexts[id] === videoFrameId) contextId = Number(id);
      });
      if (contextId === null) throw new Error("VIDEO_NOT_READY");
      return {
        metadata,
        contextId
      };
    });
  });
}
function execute(command) {
  return locate().then(function (target) {
    if (target.contextId === null || target.metadata.session !== command.session) throw new Error("STALE_SESSION");
    return evaluate(target.contextId, "(" + mediaCommand.toString() + ")(" + JSON.stringify(command) + ")", command.action !== "status").then(function (snapshot) {
      return {
        session: command.session,
        snapshot
      };
    });
  });
}
function onBinding(params) {
  if (params.name !== BINDING || params.executionContextId !== mainContext || params.payload.length > 4096) return;
  var command;
  try {
    command = JSON.parse(params.payload);
  } catch (e) {
    return;
  }
  if (!command || allowed.indexOf(command.action) < 0 || !Number.isInteger(command.id) || command.id < 1 || !Number.isInteger(command.session) || command.session < 0) return;
  if (command.action === "seek" && (typeof command.seconds !== "number" || !isFinite(command.seconds) || Math.abs(command.seconds) > 3600)) return;
  if (command.action === "click" && (typeof command.x !== "number" || typeof command.y !== "number" || !isFinite(command.x) || !isFinite(command.y) || command.x < 0 || command.y < 0 || command.x > 1e4 || command.y > 1e4)) return;
  if (command.volume !== void 0 && (typeof command.volume !== "number" || !isFinite(command.volume) || command.volume < 0 || command.volume > 1)) return;
  if (command.startAt !== void 0 && (typeof command.startAt !== "number" || !isFinite(command.startAt) || command.startAt < 0)) return;
  execute(command).then(function (result) {
    result.id = command.id;
    return sendToApp("receive", result);
  }).catch(function (error) {
    var message = /Cannot find context|context.*destroyed|Cannot find.*execution context/i.test(error.message) ? "VIDEO_NOT_READY" : error.message;
    return sendToApp("receive", {
      id: command.id,
      session: command.session,
      error: message
    }).catch(function () {});
  });
}
function attach(page, port) {
  if (disposed) return;
  var url = (page.webSocketDebuggerUrl || "").replace(/ws:\/\/[^/]+/, "ws://127.0.0.1:" + port);
  if (!url) return;
  socket = new WebSocket(url, {
    maxPayload: 2 * 1024 * 1024
  });
  socket.on("open", function () {
    contexts = {};
    mainContext = null;
    registeredContext = null;
    call("Runtime.enable").then(function () {
      return call("Page.enable");
    }).catch(function () {
      socket.close();
    });
  });
  socket.on("message", function (data) {
    var message;
    try {
      message = JSON.parse(data);
    } catch (e) {
      return;
    }
    if (message.id && pending[message.id]) {
      var request = pending[message.id];
      delete pending[message.id];
      clearTimeout(request.timer);
      if (message.error) request.reject(new Error(message.error.message));else request.resolve(message.result);
    } else if (message.method === "Runtime.executionContextCreated") {
      var context = message.params.context;
      if (context.auxData && context.auxData.isDefault) contexts[context.id] = context.auxData.frameId;
    } else if (message.method === "Runtime.executionContextDestroyed") {
      delete contexts[message.params.executionContextId];
      if (message.params.executionContextId === registeredContext) registeredContext = null;
    } else if (message.method === "Runtime.executionContextsCleared") {
      contexts = {};
      mainContext = null;
      registeredContext = null;
    } else if (message.method === "Runtime.bindingCalled") onBinding(message.params);
  });
  socket.on("error", function () {
    socket.close();
  });
  socket.on("close", function () {
    socket = null;
    contexts = {};
    mainContext = null;
    registeredContext = null;
    Object.keys(pending).forEach(function (id) {
      clearTimeout(pending[id].timer);
      pending[id].reject(new Error("BRIDGE_OFFLINE"));
    });
    pending = {};
  });
}
function discover() {
  if (disposed || socket || discovering) return;
  discovering = true;
  var ports = {};
  ["/proc/net/tcp", "/proc/net/tcp6"].forEach(function (file) {
    try {
      listeningPorts(fs.readFileSync(file, "utf8")).forEach(function (port) {
        ports[port] = true;
      });
    } catch (e) {}
  });
  Promise.all(Object.keys(ports).map(function (port) {
    return getPages(Number(port)).then(function (pages) {
      return {
        port: Number(port),
        pages
      };
    });
  })).then(function (results) {
    results.some(function (result) {
      var page = result.pages.filter(function (page2) {
        return page2.type === "page" && isLuminaPage(page2.url);
      })[0];
      if (!page) return false;
      attach(page, result.port);
      return true;
    });
    discovering = false;
  }, function () {
    discovering = false;
  });
}
function tick() {
  if (disposed) return;
  if (!socket || socket.readyState !== WebSocket.OPEN) return discover();
  if (busy) return;
  busy = true;
  locate().then(function (target) {
    if (target.contextId === null) return;
    return evaluate(target.contextId, "(" + mediaCommand.toString() + ')({action:"status"})').then(function (snapshot) {
      return sendToApp("update", {
        session: target.metadata.session,
        snapshot
      });
    });
  }).catch(function () {}).then(function () {
    busy = false;
  });
}
module.exports = {
  isLuminaPage,
  listeningPorts,
  mediaCommand
};
if (!process.env.LUMINA_TEST) {
  if (process.__luminaPlaybackService) process.__luminaPlaybackService.stop();
  interval = setInterval(tick, 1e3);
  process.__luminaPlaybackService = {
    version: VERSION,
    stop: function stop() {
      disposed = true;
      clearInterval(interval);
      if (socket) socket.close();
    }
  };
  discover();
}
var interval;
