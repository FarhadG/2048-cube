var Cube = function(position, value) {
  this.x     = position.x;
  this.y     = position.y;
  this.z     = position.z;
  this.value = value || 2;

  this.previousPosition = null;
  this.mergedFrom = null;
};


Cube.prototype.savePosition = function () {
  this.previousPosition = { x: this.x, y: this.y, z: this.z };
};


Cube.prototype.updatePosition = function(position) {
  this.x = position.x;
  this.y = position.y;
  this.z = position.z;
};
