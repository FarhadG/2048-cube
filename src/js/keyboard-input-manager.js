const ARROW_KEYS = new Map([
  ['ArrowUp', 0],
  ['ArrowRight', 1],
  ['ArrowDown', 2],
  ['ArrowLeft', 3],
  ['/', 4],
  ['.', 5],
]);

const ROTATE_KEYS = new Set(['a', 'w', 'd', 's']);

const ROTATE_ACTIONS = {
  a: (x, y) => ({ x, y: y - 90 }),
  w: (x, y) => ({ x: x + 90, y }),
  d: (x, y) => ({ x, y: y + 90 }),
  s: (x, y) => ({ x: x - 90, y }),
};

export default class KeyboardInputManager {
  #events = {};
  #xAngle = 0;
  #yAngle = 0;
  #zAngle = 0;
  #gameContainer = document.getElementById('game-container');

  constructor() {
    this.#listen();
  }

  on(event, callback) {
    this.#events[event] ??= [];
    this.#events[event].push(callback);
  }

  #emit(event, data) {
    this.#events[event]?.forEach((cb) => cb(data));
  }

  #listen() {
    document.addEventListener('keydown', (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

      const { key } = event;

      if (ARROW_KEYS.has(key)) {
        event.preventDefault();
        this.#emit('move', ARROW_KEYS.get(key));
      } else if (ROTATE_KEYS.has(key)) {
        event.preventDefault();
        const action = ROTATE_ACTIONS[key];
        const result = action(this.#xAngle, this.#yAngle);
        this.#xAngle = result.x;
        this.#yAngle = result.y;

        this.#gameContainer.style.transform = [
          `rotate3d(1,0,0,${this.#xAngle}deg)`,
          `rotate3d(0,1,0,${this.#yAngle}deg)`,
          `rotate3d(0,0,1,${this.#zAngle}deg)`,
        ].join(' ');
      }
    });
  }
}
