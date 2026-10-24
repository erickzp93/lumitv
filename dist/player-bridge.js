'use strict';

// TizenBrew installs __luminaNative only in this app's main execution context.
// The website inside the iframe never receives this binding.
window.LuminaBridge = {
  pending: new Map(),
  sequence: 0,
  lastSeen: 0,
  connected: false,
  context() {
    return {view: State.currentView, session: State.playerSession};
  },
  ready(info) {
    this.lastSeen = Date.now();
    if (!this.connected) {
      this.connected = true;
      Debugger.info(`Control de video conectado (v${info.version})`);
    }
  },
  request(action, options = {}) {
    if (typeof window.__luminaNative !== 'function' || Date.now() - this.lastSeen > 5000) {
      return Promise.reject(new Error('BRIDGE_OFFLINE'));
    }
    const id = ++this.sequence;
    const session = State.playerSession;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error('COMMAND_TIMEOUT'));
      }, 22000);
      this.pending.set(id, {resolve, reject, timer, session});
      try { window.__luminaNative(JSON.stringify({...options, id, session, action})); }
      catch (error) {
        clearTimeout(timer);
        this.pending.delete(id);
        reject(error);
      }
    });
  },
  receive(result) {
    const pending = this.pending.get(result.id);
    if (!pending) return;
    clearTimeout(pending.timer);
    this.pending.delete(result.id);
    if (result.session !== pending.session || result.session !== State.playerSession) {
      pending.reject(new Error('STALE_SESSION'));
    } else if (result.error || (result.snapshot && result.snapshot.error)) {
      pending.reject(new Error(result.error || result.snapshot.error));
    } else {
      this.update(result);
      pending.resolve(result.snapshot);
    }
  },
  update(result) {
    this.lastSeen = Date.now();
    if (State.currentView !== 'player' || result.session !== State.playerSession || !result.snapshot) return;
    applyPlaybackSnapshot(result.snapshot);
  }
};
