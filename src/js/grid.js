var Grid = function(size) {
  this.size = size;
  this.cells = [];
  this.build();
};


Grid.prototype.build = function() {
  for(var z = 0; z < this.size; z++) {
    this.cells[z] = [];
    
    for (var x = 0; x < this.size; x++) {
      var row = this.cells[z][x] = [];

      for (var y = 0; y < this.size; y++) {
        row.push(null);
      }
    }
  }
};


Grid.prototype.randomAvailableCell = function() {
  var cells = this.availableCells();

  if (cells.length) {
    var randomPosition = Math.floor(Math.random() * cells.length);
    return cells[randomPosition];
  }
};


Grid.prototype.availableCells = function() {
  var cells = [];

  this.eachCell(function(x, y, z, cube) {
    if (!cube) {
      cells.push({ x: x, y: y, z: z });
    }
  });

  return cells;
};


Grid.prototype.eachCell = function(cb) {
  for(var z = 0; z < this.size; z++) {
    for(var x = 0; x < this.size; x++) {
      for(var y = 0; y < this.size; y++) {
        cb(x, y, z, this.cells[z][x][y]);
      }
    }
  }
};


Grid.prototype.cellsAvailable = function() {
  return !!this.availableCells().length;
};


Grid.prototype.cellAvailable = function(cell) {
  return !this.cellOccupied(cell);
};


Grid.prototype.cellOccupied = function(cell) {
  return !!this.cells[cell.z][cell.x][cell.y];
};


Grid.prototype.cellContent = function(cell) {
  if (this.withinBounds(cell)) {
    return this.cells[cell.z][cell.x][cell.y];
  } else {
    return null;
  }
};


Grid.prototype.insertCube = function(cube) {
  this.cells[cube.z][cube.x][cube.y] = cube;
};


Grid.prototype.removeCube = function(cube) {
  this.cells[cube.z][cube.x][cube.y] = null;
};


Grid.prototype.withinBounds = function(position) {
  return position.x >= 0 && position.x < this.size &&
         position.y >= 0 && position.y < this.size &&
         position.z >= 0 && position.z < this.size;
};


Grid.prototype.printGrid = function() {
  var map = this.cells.map(function(zGrid) {
    return zGrid.map(function(row) {
      return row.map(function(cell) {
        if (cell && cell.value) {
          return "x:" + cell.x + ",y:" + cell.y + ",z:" + cell.z;
        } else {
          return "-";
        }
      });
    });
  }).join('\n_______________________________\n');

  console.log(map, "\n\n");
};
