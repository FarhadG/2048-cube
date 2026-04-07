# Modernize 2048-Cube Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize an 11-year-old vanilla JS + SCSS codebase to use ES6 classes, modern CSS (custom properties, nesting, layers), and clean up bugs — while preserving all game functionality.

**Architecture:** Keep the existing separation of concerns (Cube, Grid, GameManager, HTMLActuator, KeyboardInputManager). Convert constructor/prototype to ES6 classes. Replace SCSS with modern CSS. Simplify Vite config by removing Sass dependency.

**Tech Stack:** Vanilla JS (ES2022+), modern CSS (nesting, custom properties, @layer), Vite 6

---

## Chunk 1: CSS Migration

### Task 1: Create modern CSS font file

**Files:**
- Create: `src/styles/fonts.css` (replaces `src/styles/fonts/_clear-sans.scss`)

- [ ] **Step 1: Create `src/styles/fonts.css`**

```css
@font-face {
  font-family: "Clear Sans";
  src: url("/fonts/ClearSans-Light-webfont.woff") format("woff");
  font-weight: 200;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Clear Sans";
  src: url("/fonts/ClearSans-Regular-webfont.woff") format("woff");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Clear Sans";
  src: url("/fonts/ClearSans-Bold-webfont.woff") format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/fonts.css
git commit -m "refactor: convert font declarations to plain CSS"
```

---

### Task 2: Create modern CSS reset

**Files:**
- Create: `src/styles/reset.css` (replaces `src/styles/reset.scss`)

- [ ] **Step 1: Create `src/styles/reset.css`**

Same content as `reset.scss` — it's already pure CSS. Just copy it as `reset.css`.

- [ ] **Step 2: Commit**

```bash
git add src/styles/reset.css
git commit -m "refactor: convert reset to plain CSS"
```

---

### Task 3: Create main stylesheet with custom properties and generated classes

This is the big one. Convert `config.scss`, `helpers.scss`, and `style.scss` into a single `style.css` using CSS custom properties, native nesting, and `@layer`. The SCSS loops that generate 64 position classes and 11 value classes must be pre-computed and written out as plain CSS.

**Files:**
- Create: `src/styles/style.css` (replaces `config.scss`, `helpers.scss`, `style.scss`)

- [ ] **Step 1: Create `src/styles/style.css`**

The file should contain:

1. **Custom properties** (replacing SCSS variables):
   ```css
   :root {
     --game-size: 400px;
     --cubes-per-row: 4;
     --cube-size: 100px;
     --transition-speed: 100ms;
     --cube-color: #eee4da;
     --cube-gold-color: #edc22e;
     --text-color: #776e65;
     --bright-text-color: #f9f6f2;
     --background: #faf8ef;
     --side-background: rgba(0, 0, 0, 0.04);
     --cube-border-color: #776a5e;
     --side-border-color: #8f867d;
   }
   ```

2. **General styles** (from style.scss lines 9-43) using native nesting where appropriate.

3. **Cube face transforms** — pre-compute the 6 `.side-*` and `.cube-*` transform rules from the `cubeGenerator` mixin. These are static (6 sides, known angles).

4. **64 position classes** — pre-compute `.cube-position-{x}-{y}-{z}` for x,y,z in 0..3. Each has `position: absolute; left: x*100px; top: y*100px; transform: translate3d(0,0, 150px - z*100px)`.

5. **11 value classes** — pre-compute `.cube-{N} > .cube` for N in 2,4,8,...,2048. Each has the background color (mixed from tan→gold with special overrides), text color, font-size, and box-shadow. Pre-calculate the color values from the SCSS color.mix logic.

6. **Animations** (appear keyframes, .cube-new, .cube-merged).

- [ ] **Step 2: Commit**

```bash
git add src/styles/style.css
git commit -m "refactor: convert styles to modern CSS with custom properties and nesting"
```

---

### Task 4: Create main CSS entry point and wire up imports

**Files:**
- Create: `src/styles/main.css` (replaces `src/styles/main.scss`)

- [ ] **Step 1: Create `src/styles/main.css`**

```css
@layer reset, base, components;

@import "./fonts.css" layer(base);
@import "./reset.css" layer(reset);
@import "./style.css" layer(components);
```

- [ ] **Step 2: Update `src/js/application.js` import**

Change line 1 from:
```js
import '../styles/main.scss';
```
to:
```js
import '../styles/main.css';
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/main.css src/js/application.js
git commit -m "refactor: wire up CSS entry point with @layer imports"
```

---

### Task 5: Remove SCSS files and Sass dependency

**Files:**
- Delete: `src/styles/main.scss`, `src/styles/config.scss`, `src/styles/helpers.scss`, `src/styles/style.scss`, `src/styles/reset.scss`, `src/styles/fonts/_clear-sans.scss`, `src/styles/fonts/` directory
- Modify: `package.json` — remove `sass` from devDependencies
- Modify: `vite.config.js` — remove `css.preprocessorOptions` block

- [ ] **Step 1: Delete old SCSS files**

```bash
rm src/styles/main.scss src/styles/config.scss src/styles/helpers.scss src/styles/style.scss src/styles/reset.scss
rm -rf src/styles/fonts/
```

- [ ] **Step 2: Remove sass from package.json devDependencies**

Remove the `"sass": "^1.86.0"` line.

- [ ] **Step 3: Simplify vite.config.js**

```js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/2048-cube/',
  server: {
    port: 2048,
  },
});
```

- [ ] **Step 4: Reinstall dependencies**

```bash
npm install
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: remove SCSS and Sass dependency"
```

---

## Chunk 2: JavaScript Modernization

### Task 6: Modernize Cube class

**Files:**
- Modify: `src/js/cube.js`

- [ ] **Step 1: Rewrite `src/js/cube.js` as ES6 class**

```js
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
```

- [ ] **Step 2: Commit**

```bash
git add src/js/cube.js
git commit -m "refactor: convert Cube to ES6 class"
```

---

### Task 7: Modernize Grid class

**Files:**
- Modify: `src/js/grid.js`

- [ ] **Step 1: Rewrite `src/js/grid.js` as ES6 class**

```js
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
```

Note: removed `printGrid()` (debug-only utility, not called anywhere).

- [ ] **Step 2: Commit**

```bash
git add src/js/grid.js
git commit -m "refactor: convert Grid to ES6 class"
```

---

### Task 8: Modernize HTMLActuator class

**Files:**
- Modify: `src/js/html-actuator.js`

- [ ] **Step 1: Rewrite `src/js/html-actuator.js` as ES6 class**

```js
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
```

Key changes:
- `replaceChildren()` instead of while-loop removal
- `??` instead of `||` for position fallback
- Private method `#addCube` and `#positionClass`
- Fix: remove position class by name instead of fragile `classList[2]` index

- [ ] **Step 2: Commit**

```bash
git add src/js/html-actuator.js
git commit -m "refactor: convert HTMLActuator to ES6 class"
```

---

### Task 9: Modernize KeyboardInputManager class and fix bugs

**Files:**
- Modify: `src/js/keyboard-input-manager.js`

- [ ] **Step 1: Rewrite `src/js/keyboard-input-manager.js` as ES6 class**

```js
const ARROW_KEYS = new Map([
  ['ArrowUp', 0],
  ['ArrowRight', 1],
  ['ArrowDown', 2],
  ['ArrowLeft', 3],
  ['/', 4],
  ['.', 5],
]);

const ROTATE_KEYS = new Set(['a', 'w', 'd', 's']);

const ROTATE_ACTIONS = {
  a: (x, y) => ({ x, y: y - 90 }),
  w: (x, y) => ({ x: x + 90, y }),
  d: (x, y) => ({ x, y: y + 90 }),
  s: (x, y) => ({ x: x - 90, y }),
};

export default class KeyboardInputManager {
  #events = {};
  #xAngle = 0;
  #yAngle = 0;
  #zAngle = 0;
  #gameContainer = document.getElementById('game-container');

  constructor() {
    this.#listen();
  }

  on(event, callback) {
    this.#events[event] ??= [];
    this.#events[event].push(callback);
  }

  #emit(event, data) {
    this.#events[event]?.forEach((cb) => cb(data));
  }

  #listen() {
    document.addEventListener('keydown', (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

      const { key } = event;

      if (ARROW_KEYS.has(key)) {
        event.preventDefault();
        this.#emit('move', ARROW_KEYS.get(key));
      } else if (ROTATE_KEYS.has(key)) {
        event.preventDefault();
        const action = ROTATE_ACTIONS[key];
        const result = action(this.#xAngle, this.#yAngle);
        this.#xAngle = result.x;
        this.#yAngle = result.y;

        this.#gameContainer.style.transform = [
          `rotate3d(1,0,0,${this.#xAngle}deg)`,
          `rotate3d(0,1,0,${this.#yAngle}deg)`,
          `rotate3d(0,0,1,${this.#zAngle}deg)`,
        ].join(' ');
      }
    });
  }
}
```

Key changes:
- **Bug fix:** Missing `||` operator on line 33-34 of original — fixed by using proper `||` chain
- Use `event.key` instead of deprecated `event.which` keycodes
- Use `Map` and `Set` for key lookups
- Remove `webkitTransform` (no longer needed)
- Simplify rotation logic — the modifier functions were mostly no-ops (marked "to do"); remove the incomplete indirection and keep the direct rotation
- All state is private (`#` fields)

- [ ] **Step 2: Commit**

```bash
git add src/js/keyboard-input-manager.js
git commit -m "refactor: convert KeyboardInputManager to ES6 class, fix modifier bug"
```

---

### Task 10: Modernize GameManager class

**Files:**
- Modify: `src/js/game-manager.js`

- [ ] **Step 1: Rewrite `src/js/game-manager.js` as ES6 class**

```js
import Grid from './grid.js';
import Cube from './cube.js';

const VECTORS = [
  { x: 0, y: -1, z: 0 },  // 0: up
  { x: 1, y: 0, z: 0 },   // 1: right
  { x: 0, y: 1, z: 0 },   // 2: down
  { x: -1, y: 0, z: 0 },  // 3: left
  { x: 0, y: 0, z: -1 },  // 4: front
  { x: 0, y: 0, z: 1 },   // 5: back
];

export default class GameManager {
  constructor(size, InputManager, Actuator) {
    this.size = size;
    this.inputManager = new InputManager();
    this.actuator = new Actuator();
    this.grid = new Grid(this.size);

    this.inputManager.on('move', (direction) => this.#move(direction));
    this.#addStartCubes();
    this.#actuate();
  }

  #addStartCubes() {
    for (let i = 0; i < 2; i++) {
      this.#addRandomCube();
    }
  }

  #addRandomCube() {
    if (this.grid.cellsAvailable()) {
      const value = Math.random() < 0.9 ? 2 : 4;
      const cube = new Cube(this.grid.randomAvailableCell(), value);
      this.grid.insertCube(cube);
    }
  }

  #actuate() {
    this.actuator.actuate(this.grid);
  }

  #prepareCubes() {
    this.grid.eachCell((x, y, z, cube) => {
      if (cube) {
        cube.mergedFrom = null;
        cube.savePosition();
      }
    });
  }

  #moveCube(cube, cell) {
    this.grid.cells[cube.z][cube.x][cube.y] = null;
    this.grid.cells[cell.z][cell.x][cell.y] = cube;
    cube.updatePosition(cell);
  }

  #move(direction) {
    const vector = VECTORS[direction];
    const traversals = this.#buildTraversals(vector);
    let moved = false;

    this.#prepareCubes();

    for (const z of traversals.z) {
      for (const x of traversals.x) {
        for (const y of traversals.y) {
          const cell = { x, y, z };
          const cube = this.grid.cellContent(cell);

          if (cube) {
            const positions = this.#findFarthestPosition(cell, vector);
            const next = this.grid.cellContent(positions.next);

            if (next && next.value === cube.value && !next.mergedFrom) {
              const merged = new Cube(positions.next, cube.value * 2);
              merged.mergedFrom = [cube, next];

              this.grid.insertCube(merged);
              this.grid.removeCube(cube);
              cube.updatePosition(positions.next);
            } else {
              this.#moveCube(cube, positions.farthest);
            }

            moved = true;
          }
        }
      }
    }

    if (moved) {
      this.#addRandomCube();
      this.#actuate();
    }
  }

  #buildTraversals(vector) {
    const positions = Array.from({ length: this.size }, (_, i) => i);
    return {
      x: vector.x === 1 ? [...positions].reverse() : [...positions],
      y: vector.y === 1 ? [...positions].reverse() : [...positions],
      z: vector.z === 1 ? [...positions].reverse() : [...positions],
    };
  }

  #findFarthestPosition(cell, vector) {
    let previous;
    do {
      previous = cell;
      cell = {
        x: previous.x + vector.x,
        y: previous.y + vector.y,
        z: previous.z + vector.z,
      };
    } while (this.grid.withinBounds(cell) && this.grid.cellAvailable(cell));

    return { farthest: previous, next: cell };
  }
}
```

Key changes:
- Arrow function for event binding (no `.bind(this)`)
- `VECTORS` array replaces `getVector()` method
- `for...of` instead of `.forEach()`
- All internal methods are private (`#`)
- Removed `setup()`, `saveCubePositions()` (unused) — inlined into constructor
- Removed `startCubes` property (just use literal `2`)

- [ ] **Step 2: Commit**

```bash
git add src/js/game-manager.js
git commit -m "refactor: convert GameManager to ES6 class"
```

---

### Task 11: Modernize application entry point

**Files:**
- Modify: `src/js/application.js`

- [ ] **Step 1: Rewrite `src/js/application.js`**

```js
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
```

Key changes:
- Remove `DOMContentLoaded` wrapper (script is `type="module"`, already deferred)
- Remove `requestAnimationFrame` wrapper (unnecessary here)
- Remove IE `attachEvent` fallback
- `const`/`let` throughout

- [ ] **Step 2: Commit**

```bash
git add src/js/application.js
git commit -m "refactor: modernize application entry point"
```

---

## Chunk 3: HTML & Config Cleanup

### Task 12: Clean up HTML and remove stale files

**Files:**
- Modify: `index.html`
- Modify: `.gitignore`
- Delete: `gulpfile.js`, `src/index.html` (if still tracked), `dist/` contents (if tracked)

- [ ] **Step 1: Clean up `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>2048 Cube</title>
  <meta name="description" content="The famous 2048, except as a 3D cube.">
  <meta name="author" content="Farhad Ghayour">
</head>
<body>
  <div id="instructions">
    <h1>2048 Cube</h1>
    <p>A 3D CSS-only version of 2048 (<a href="https://github.com/FarhadG/2048-cube" target="_blank" rel="noopener">GitHub</a>).</p>
    <ul>
      <li><b>WASD</b> &mdash; Rotate the cube</li>
      <li><b>Arrow keys</b> &mdash; Move cubes left / right / up / down</li>
      <li><b>.</b> &mdash; Move cubes back</li>
      <li><b>/</b> &mdash; Move cubes forward</li>
    </ul>
  </div>

  <div id="container">
    <div id="game-container">
      <div class="side side-left"></div>
      <div class="side side-top"></div>
      <div class="side side-right"></div>
      <div class="side side-bottom"></div>
      <div class="side side-front"></div>
      <div class="side side-back"></div>
      <div id="grid-container"></div>
    </div>
  </div>

  <script type="module" src="/src/js/application.js"></script>
</body>
</html>
```

Changes: add `lang="en"`, remove IE meta, remove `(HTML, CSS)` from title, add `rel="noopener"`, clean up control descriptions, remove HTML comments.

- [ ] **Step 2: Delete stale build artifacts**

```bash
rm -f gulpfile.js
git rm --cached -r dist/ 2>/dev/null || true
```

- [ ] **Step 3: Commit**

```bash
git add index.html gulpfile.js
git add -u dist/ src/index.html 2>/dev/null || true
git commit -m "refactor: clean up HTML and remove stale build files"
```

---

### Task 13: Verify everything works

- [ ] **Step 1: Run the dev server**

```bash
npm run dev
```

Open `http://localhost:2048` and verify:
- Cube renders with 3D perspective
- Arrow keys move cubes in 4 directions
- `.` and `/` keys move cubes back/forward
- WASD rotates the cube
- Cubes merge on matching values
- New cubes appear with animation
- Styles look correct (colors, fonts, sizing)

- [ ] **Step 2: Run the production build**

```bash
npm run build
```

Verify no build errors.

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address issues found during verification"
```
