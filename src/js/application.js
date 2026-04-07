import '../styles/main.css';
import KeyboardInputManager from './keyboard-input-manager.js';
import HTMLActuator from './html-actuator.js';
import GameManager from './game-manager.js';

const container = document.getElementById('container');

function updatePerspective() {
  container.style.perspective = '1000px';
  container.style.perspectiveOrigin = `${window.innerWidth / 2}px -270px`;
}

updatePerspective();
window.addEventListener('resize', updatePerspective);

new GameManager(4, KeyboardInputManager, HTMLActuator);
