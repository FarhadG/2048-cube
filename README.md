2048 Cube
====

An interactive 3D cube version of 2048 with CSS3 animations.

No jQuery. No HTML5 Canvas. No JavaScript animations.

That said, I may be doing a tutorial, along with the same game using WebGL, for performance, usability and features comparisons. This project is in its early stages and still has many things left to do. If something is not working or you would like a new feature, please use the issues page.

## Demo

Click for a live demo: <a href="http://farhadg.github.io/2048-cube/" target="_blank">2048 Cube</a>.

## Installation

You can simply fork or clone (download); then follow the given commands.

```
  $ git clone https://github.com/FarhadG/2048-cube.git
  $ npm install
  $ npm run start
```

## Usage

Once you've installed all of the dependencies and issued the command `npm run start`, gulp will automatically fire up `http://localhost:2048/dist/` and present you with the game.

The controls are as follows (refer to TODOs with upcoming features):
- WASD: Flips the cube around
- Arrows: Move the cubes to either left, right, up, or down
- <: Moves the cubes back (towards the back of the cube)
- ?: Moves the cubes forward (towards the front of the cube)

Additionally, `npm run start` provides you with live reloading and compiling of the assets from the `src` directory to `dist`. If you prefer just the build, you can run `npm run build`.

## TODOs

I'll be adding more meshing features; that said, if you'd like a feature, let me know so that I'll try and implement it into future updates.


Quaternions
- It's currently using Euler rotations, hence, Quaternions will help with intuitive rotations.

Gesture Support
- Add touch and intuitive gesture support.

Mobile Support
- Make the game responsiveness to various resolutions.

Optimizations
- There are optimizations in the pipeline for faster traversals and data structures.

Game Mechanics
- Add scoring, leaderboards and other various game mechanics.
