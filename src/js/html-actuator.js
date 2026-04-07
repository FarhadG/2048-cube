const SIDE_NAMES = ['left', 'top', 'right', 'bottom', 'front', 'back'];

export default class HTMLActuator {
  constructor() {
    this.container = document.getElementById('grid-container');
  }

  actuate(grid) {
    requestAnimationFrame(() => {
      this.container.replaceChildren();

      for (let z = 0; z < grid.cells.length; z++) {
        for (let x = 0; x < grid.cells[z].length; x++) {
          for (let y = 0; y < grid.cells[z][x].length; y++) {
            const cell = grid.cells[z][x][y];
            if (cell) this.#addCube(cell);
          }
        }
      }
    });
  }

  #addCube(cell) {
    const wrapper = document.createElement('div');
    const position = cell.previousPosition ?? { x: cell.x, y: cell.y, z: cell.z };

    wrapper.classList.add('cube', `cube-${cell.value}`, this.#positionClass(position));

    for (const name of SIDE_NAMES) {
      const face = document.createElement('div');
      face.classList.add('cube', `cube-${name}`);
      face.textContent = cell.value;
      wrapper.appendChild(face);
    }

    this.container.appendChild(wrapper);

    if (cell.previousPosition) {
      requestAnimationFrame(() => {
        wrapper.classList.remove(this.#positionClass(position));
        wrapper.classList.add(this.#positionClass(cell));
      });
    } else if (cell.mergedFrom) {
      wrapper.classList.add('cube-merged');
      cell.mergedFrom.forEach((merged) => this.#addCube(merged));
    } else {
      wrapper.classList.add('cube-new');
    }
  }

  #positionClass({ x, y, z }) {
    return `cube-position-${x}-${y}-${z}`;
  }
}
