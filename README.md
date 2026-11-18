# High-Top Dash

A cross-country themed 3D endless runner you play in the browser. Run the dirt trail through rolling hills, hurdle barrels, duck under course banners, climb hay wagons, grab coins and stay ahead of Coach. Calm background music is generated live in the browser (tap ♪ to mute).

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

## Score

Your score is the distance you run, in meters. Orange banner arches mark every 250 m, and your best distance is saved in the browser.

## Power-ups

- **Magnet**: pulls nearby coins to you
- **Super sneakers**: jump high enough to land on trains
- **2x coins**: every coin counts double
- **Jetpack**: fly above the trains and collect sky coins

Built with [three.js](https://threejs.org/). This is an original fan-made game and is not affiliated with any commercial game.

## Deploy on Railway

The repo includes a tiny Node server (`server.js`, no dependencies). Railway detects `package.json` and runs `npm start`, which serves the game on the `PORT` Railway provides. To run it locally: `npm start`, then open http://localhost:3000.
