var HTMLActuator = function() {
  this.gameContainer = document.getElementById('grid-container');
};

HTMLActuator.prototype.actuate = function(grid) {
  var self = this;
  var grid = grid.cells;

  window.requestAnimationFrame(function() {
    self.clearContainer();

    for(var z = 0; z < grid.length; z++) {
      var zGrid = grid[z];
      for(var x = 0; x < zGrid.length; x++) {
        for(var y = 0; y < zGrid[x].length; y++) {
          var cell = zGrid[x][y];
          if (cell) {
            self.addCube(cell);
          }
        }
      }
    }
  });
};


HTMLActuator.prototype.clearContainer = function() {
  while (this.gameContainer.firstChild) {
    this.gameContainer.removeChild(this.gameContainer.firstChild);
  }
};


HTMLActuator.prototype.addCube = function(cell) {
  var self = this;

  var cubeContainer = document.createElement('div');

  var position = cell.previousPosition || { x: cell.x, y: cell.y, z: cell.z };
  var positionClass = this.positionClass(position);

  cubeContainer.classList.add('cube', 'cube-' + cell.value, positionClass);

  var sideNames = ['left', 'top', 'right', 'bottom', 'front', 'back'];

  for(var i = 0; i < 6; i++) {
    var cubeSide = document.createElement('div');
    cubeSide.classList.add('cube', 'cube-' + sideNames[i]);
    cubeSide.textContent = cell.value;
    cubeContainer.appendChild(cubeSide);
  }

  this.gameContainer.appendChild(cubeContainer);

  if (cell.previousPosition) {
    window.requestAnimationFrame(function() {
      cubeContainer.classList.remove(cubeContainer.classList[2]);
      cubeContainer.classList.add(self.positionClass({
        x: cell.x,
        y: cell.y,
        z: cell.z
      }));
    });
  } else if (cell.mergedFrom) {
    cubeContainer.classList.add('cube-merged');
    cell.mergedFrom.forEach(function(merged) {
      self.addCube(merged);
    });
  } else {
    cubeContainer.classList.add('cube-new');
  }
};


HTMLActuator.prototype.positionClass = function(position) {
  return "cube-position-" + position.x + "-" + position.y + "-" + position.z;
};
