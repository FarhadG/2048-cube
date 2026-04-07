import Grid from './grid.js';
import Cube from './cube.js';

const VECTORS = [
  { x: 0, y: -1, z: 0 },  // 0: up
  { x: 1, y: 0, z: 0 },   // 1: right
  { x: 0, y: 1, z: 0 },   // 2: down
  { x: -1, y: 0, z: 0 },  // 3: left
  { x: 0, y: 0, z: -1 },  // 4: front
  { x: 0, y: 0, z: 1 },   // 5: back
];

export default class GameManager {
  constructor(size, InputManager, Actuator) {
    this.size = size;
    this.inputManager = new InputManager();
    this.actuator = new Actuator();
    this.grid = new Grid(this.size);

    this.inputManager.on('move', (direction) => this.#move(direction));
    this.#addStartCubes();
    this.#actuate();
  }

  #addStartCubes() {
    for (let i = 0; i < 2; i++) {
      this.#addRandomCube();
    }
  }

  #addRandomCube() {
    if (this.grid.cellsAvailable()) {
      const value = Math.random() < 0.9 ? 2 : 4;
      const cube = new Cube(this.grid.randomAvailableCell(), value);
      this.grid.insertCube(cube);
    }
  }

  #actuate() {
    this.actuator.actuate(this.grid);
  }

  #prepareCubes() {
    this.grid.eachCell((x, y, z, cube) => {
      if (cube) {
        cube.mergedFrom = null;
        cube.savePosition();
      }
    });
  }

  #moveCube(cube, cell) {
    this.grid.cells[cube.z][cube.x][cube.y] = null;
    this.grid.cells[cell.z][cell.x][cell.y] = cube;
    cube.updatePosition(cell);
  }

  #move(direction) {
    const vector = VECTORS[direction];
    const traversals = this.#buildTraversals(vector);
    let moved = false;

    this.#prepareCubes();

    for (const z of traversals.z) {
      for (const x of traversals.x) {
        for (const y of traversals.y) {
          const cell = { x, y, z };
          const cube = this.grid.cellContent(cell);

          if (cube) {
            const positions = this.#findFarthestPosition(cell, vector);
            const next = this.grid.cellContent(positions.next);

            if (next && next.value === cube.value && !next.mergedFrom) {
              const merged = new Cube(positions.next, cube.value * 2);
              merged.mergedFrom = [cube, next];

              this.grid.insertCube(merged);
              this.grid.removeCube(cube);
              cube.updatePosition(positions.next);
            } else {
              this.#moveCube(cube, positions.farthest);
            }

            moved = true;
          }
        }
      }
    }

    if (moved) {
      this.#addRandomCube();
      this.#actuate();
    }
  }

  #buildTraversals(vector) {
    const positions = Array.from({ length: this.size }, (_, i) => i);
    return {
      x: vector.x === 1 ? [...positions].reverse() : [...positions],
      y: vector.y === 1 ? [...positions].reverse() : [...positions],
      z: vector.z === 1 ? [...positions].reverse() : [...positions],
    };
  }

  #findFarthestPosition(cell, vector) {
    let previous;
    do {
      previous = cell;
      cell = {
        x: previous.x + vector.x,
        y: previous.y + vector.y,
        z: previous.z + vector.z,
      };
    } while (this.grid.withinBounds(cell) && this.grid.cellAvailable(cell));

    return { farthest: previous, next: cell };
  }
}
