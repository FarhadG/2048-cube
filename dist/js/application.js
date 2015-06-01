window.addEventListener('DOMContentLoaded', function() {
  window.requestAnimationFrame(function() {
    var manager = new GameManager(4, KeyboardInputManager, HTMLActuator);
  });

  var container = document.getElementById('container');

  function resetContainer() {
    container.style.perspective = '1000px';
    container.style.perspectiveOrigin = (window.innerWidth / 2) + 'px -270px';
  }

  resetContainer();

  if (window.attachEvent) {
    window.attachEvent('onresize', resetContainer);
  }
  else if (window.addEventListener) {
    window.addEventListener('resize', resetContainer, true);
  }
});


