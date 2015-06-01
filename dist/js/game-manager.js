var GameManager = function(size, InputManager, Actuator) {
  this.size         = size;
  this.inputManager = new InputManager();
  this.actuator     = new Actuator;
  
  this.startCubes   = 2;
  this.grid         = new Grid(this.size);

  this.inputManager.on('move', this.move.bind(this));

  this.setup();
};


GameManager.prototype.setup = function() {
  this.addStartCubes();

  this.actuate();
};


GameManager.prototype.addStartCubes = function() {
  for(var i = 0; i < this.startCubes; i++) {
    this.addRandomCube();
  }
};


GameManager.prototype.addRandomCube = function() {
  if (this.grid.cellsAvailable()) {
    var value = Math.random() < 0.9 ? 2 : 4;
    var cube = new Cube(this.grid.randomAvailableCell(), value);
    
    this.grid.insertCube(cube);
  }
};


GameManager.prototype.actuate = function() {
  this.actuator.actuate(this.grid);
};


GameManager.prototype.prepareCubes = function() {
  this.grid.eachCell(function(x, y, z, cube) {
    if (cube) {
      cube.mergedFrom = null;
      cube.savePosition();
    }
  });
};


GameManager.prototype.saveCubePositions = function() {
  this.grid.eachCell(function(x, y, z, cube) {
    if (cube) {
      cube.savePosition();
    }
  })
};


GameManager.prototype.moveCube = function(cube, cell) {
  this.grid.cells[cube.z][cube.x][cube.y] = null;
  this.grid.cells[cell.z][cell.x][cell.y] = cube;
  cube.updatePosition(cell);
};


GameManager.prototype.move = function(direction) {
  var self = this;

  var cell, cube;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

  this.prepareCubes();

  traversals.z.forEach(function(z) {
    traversals.x.forEach(function(x) {
      traversals.y.forEach(function(y) {
        cell = { x: x, y: y, z: z };
        var cube = self.grid.cellContent(cell);

        if (cube) {
          var positions = self.findFarthestPosition(cell, vector);
          var next      = self.grid.cellContent(positions.next);

          if (next && next.value === cube.value && !next.mergedFrom) {
            var merged = new Cube(positions.next, cube.value * 2);
            merged.mergedFrom = [cube, next];

            self.grid.insertCube(merged);
            self.grid.removeCube(cube);

            cube.updatePosition(positions.next);
          } else {
            self.moveCube(cube, positions.farthest);
          }

          moved = true;
        }
      });
    });
  });

  if (moved) {
    this.addRandomCube();
    this.actuate();
  }
};


GameManager.prototype.getVector = function(direction) {
  var map = {
    0: {  x: 0,  y: -1, z: 0  }, // up
    1: {  x: 1,  y: 0,  z: 0  }, // right
    2: {  x: 0,  y: 1,  z: 0  }, // down
    3: {  x: -1, y: 0,  z: 0  }, // left
    4: {  x: 0,  y: 0,  z: -1 }, // front
    5: {  x: 0,  y: 0,  z: 1  }  // back
  };

  return map[direction];
};


GameManager.prototype.buildTraversals = function(vector) {
  var traversals = { x: [], y: [], z: [] };

  for(var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
    traversals.z.push(pos);
  }

  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();
  if (vector.z === 1) traversals.z = traversals.z.reverse();

  return traversals;
};


GameManager.prototype.findFarthestPosition = function(cell, vector) {
  var previous;

  do {
    previous = cell;
    cell = {
      x: previous.x + vector.x,
      y: previous.y + vector.y,
      z: previous.z + vector.z
    }
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell
  };
};
