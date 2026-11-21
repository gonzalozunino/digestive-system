// Minimal event emitter used for communication between the game and the outside world (UI, audio).

export class Emitter {
  #handlers = new Map();

  on(event, handler) {
    if (!this.#handlers.has(event)) this.#handlers.set(event, new Set());
    this.#handlers.get(event).add(handler);
    return () => this.#handlers.get(event).delete(handler);
  }

  emit(event, payload) {
    this.#handlers.get(event)?.forEach(handler => handler(payload));
  }
}
