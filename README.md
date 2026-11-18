# High-Top Dash

A 3D endless runner you play in the browser. Dodge trains, jump barriers, roll under bars, grab coins and stay ahead of Coach.

## Play

Open `index.html` in a browser. No install or build step.

## Controls

| Action | Keyboard | Phone |
| --- | --- | --- |
| Switch lanes | ← → or A / D | Swipe left / right |
| Jump | ↑, W or Space | Swipe up |
| Roll | ↓ or S | Swipe down |
| Hoverboard (3 per run, saves you from one crash) | H | Double-tap |
| Pause | P or Esc | Pause button |

## Power-ups

- **Magnet**: pulls nearby coins to you
- **Super sneakers**: jump high enough to land on trains
- **2x score**: doubles your multiplier
- **Jetpack**: fly above the trains and collect sky coins

Built with [three.js](https://threejs.org/). This is an original fan-made game and is not affiliated with any commercial game.

## Deploy on Railway

The repo includes a tiny Node server (`server.js`, no dependencies). Railway detects `package.json` and runs `npm start`, which serves the game on the `PORT` Railway provides. To run it locally: `npm start`, then open http://localhost:3000.
