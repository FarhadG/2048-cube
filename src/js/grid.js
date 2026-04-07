export default class Grid {
  constructor(size) {
    this.size = size;
    this.cells = this.#build();
  }

  #build() {
    return Array.from({ length: this.size }, () =>
      Array.from({ length: this.size }, () =>
        Array.from({ length: this.size }, () => null)
      )
    );
  }

  eachCell(callback) {
    for (let z = 0; z < this.size; z++) {
      for (let x = 0; x < this.size; x++) {
        for (let y = 0; y < this.size; y++) {
          callback(x, y, z, this.cells[z][x][y]);
        }
      }
    }
  }

  availableCells() {
    const cells = [];
    this.eachCell((x, y, z, cube) => {
      if (!cube) cells.push({ x, y, z });
    });
    return cells;
  }

  randomAvailableCell() {
    const cells = this.availableCells();
    if (cells.length) {
      return cells[Math.floor(Math.random() * cells.length)];
    }
  }

  cellsAvailable() {
    return this.availableCells().length > 0;
  }

  cellAvailable(cell) {
    return !this.cellOccupied(cell);
  }

  cellOccupied(cell) {
    return !!this.cells[cell.z][cell.x][cell.y];
  }

  cellContent(cell) {
    if (this.withinBounds(cell)) {
      return this.cells[cell.z][cell.x][cell.y];
    }
    return null;
  }

  insertCube(cube) {
    this.cells[cube.z][cube.x][cube.y] = cube;
  }

  removeCube(cube) {
    this.cells[cube.z][cube.x][cube.y] = null;
  }

  withinBounds({ x, y, z }) {
    return x >= 0 && x < this.size &&
           y >= 0 && y < this.size &&
           z >= 0 && z < this.size;
  }
}
