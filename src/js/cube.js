export default class Cube {
  constructor(position, value = 2) {
    this.x = position.x;
    this.y = position.y;
    this.z = position.z;
    this.value = value;
    this.previousPosition = null;
    this.mergedFrom = null;
  }

  savePosition() {
    this.previousPosition = { x: this.x, y: this.y, z: this.z };
  }

  updatePosition({ x, y, z }) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
