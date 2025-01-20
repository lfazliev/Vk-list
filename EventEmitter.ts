class EventEmitter {
  private events: { [key: string]: ((...args: any[]) => void)[] };

  constructor() {
    this.events = {};
  }

  on(eventName: string, listener: (...args: any[]) => void): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  emit(eventName: string, ...args: any[]): void {
    if (this.events[eventName]) {
      this.events[eventName].forEach((listener) => {
        listener(...args);
      });
    }
  }

  off(eventName: string, listener: (...args: any[]) => void): void {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (l) => l !== listener,
      );
    }
  }
}

export default EventEmitter;
