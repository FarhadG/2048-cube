var KeyboardInputManager = function() {
  this.events = {};
  this.listen();
};


KeyboardInputManager.prototype.on = function(event, cb) {
  if (!this.events[event]) this.events[event] = [];
  this.events[event].push(cb);
};


KeyboardInputManager.prototype.emit = function(event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function(cb) {
      cb(data);
    });
  }
};


KeyboardInputManager.prototype.listen = function() {
  var gameContainer = document.getElementById('game-container');
  var xAngle = 0, yAngle = 0, zAngle = 0;

  document.addEventListener('keydown', function(event) {
    var keyCode = event.which;
    var keyPressed = this.keyMap(keyCode);
    var arrowKeyAction = null, rotateKeyAction = null; 

    var modifiers = event.altKey || event.ctrlKey
                    event.metaKey || event.shiftKey;

    if (modifiers) return;

    var arrowKeyPressed  = keyPressed.arrowKey;
    var rotateKeyPressed = keyPressed.rotateKey;

    if (arrowKeyPressed) {
      keyCode = this.arrowKeyModifier(keyCode, xAngle, yAngle, zAngle);
      arrowKeyAction = this.arrowKeyAction(keyCode);
      this.emit('move', arrowKeyAction);
    }

    else if (rotateKeyPressed) {
      keyCode = this.rotateKeyModifier(keyCode, xAngle, yAngle, zAngle);
      rotateKeyAction = this.rotateKeyAction(keyCode, xAngle, yAngle, zAngle);

      xAngle = rotateKeyAction.newXAngle;
      yAngle = rotateKeyAction.newYAngle;

      var newStyle = ["rotate3d(1,0,0,"+ xAngle +"deg)", 
                      "rotate3d(0,1,0,"+ yAngle +"deg)", 
                      "rotate3d(0,0,1,"+ zAngle +"deg)"];

      gameContainer.style.webkitTransform = newStyle.join(' ');
    }

  }.bind(this), false);
};


KeyboardInputManager.prototype.keyMap = function(keyCode) {
  var arrowKey = {
    38: true,
    39: true,
    40: true,
    37: true,
    191: true,
    190: true
  };

  var rotateKey = {
    65: true,
    87: true,
    68: true,
    83: true
  };

  return {
    arrowKey: arrowKey[keyCode],
    rotateKey: rotateKey[keyCode]
  };
};


KeyboardInputManager.prototype.arrowKeyModifier = function(keyCode, x, y, z) {
  var arrowKey = {
    38: 0,  // up
    39: 1,  // right
    40: 2,  // down
    37: 3,  // left
    191: 4, // front /
    190: 5  // back  .
  };

  var upsideDown     = (x % 180 === 0 && (x / 180) % 2 !== 0);
  var acuteSideways  = (x % 90  === 0 && (x / 90)  % 2 !== 0);
  var obtuseSideways = (x % 270 === 0 && (x / 270) % 2 !== 0);

  return keyCode;
};


KeyboardInputManager.prototype.arrowKeyAction = function(keyCode) {
  var arrowKey = {
    38: 0,  // up
    39: 1,  // right
    40: 2,  // down
    37: 3,  // left
    191: 4, // front /
    190: 5  // back  .
  };

  return arrowKey[keyCode];
};


KeyboardInputManager.prototype.rotateKeyModifier = function(keyCode, x, y, z) {
  var acuteSidewaysModifier = { // to do
    65: 65, // a
    87: 87, // w
    68: 68, // d
    83: 83  // s
  };
  
  var upsideDownModifier = {
    65: 68, // a
    87: 87, // w
    68: 65, // d
    83: 83  // s
  };

  var obtuseSidewaysModifier = { // to do
    65: 65, // a
    87: 87, // w
    68: 68, // d
    83: 83  // s
  };

  var acuteSideways  = (x % 90  === 0 && (x / 90)  % 2 !== 0);
  var upsideDown     = (x % 180 === 0 && (x / 180) % 2 !== 0);
  var obtuseSideways = (x % 270 === 0 && (x / 270) % 2 !== 0);

  if (acuteSideways) {
    keyCode = acuteSidewaysModifier[keyCode];
  } else if (upsideDown) {
    keyCode = upsideDownModifier[keyCode];
  } else if (obtuseSideways) {
    keyCode = obtuseSidewaysModifier[keyCode];
  }

  return keyCode;
};


KeyboardInputManager.prototype.rotateKeyAction = function(keyCode, x, y, z) {
  var rotateKey = {
    65: function() { y -= 90; }, // a
    87: function() { x += 90; }, // w
    68: function() { y += 90; }, // d
    83: function() { x -= 90; }  // s
  };
  
  var rotateAction = rotateKey[keyCode];
  rotateAction && rotateAction();

  return {
    newXAngle: x,
    newYAngle: y
  };
};
