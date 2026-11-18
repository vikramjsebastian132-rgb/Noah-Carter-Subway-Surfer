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

## Leaderboard

After each run, your distance is posted to a shared leaderboard so friends can compare. The first time, you type a name (up to 16 letters or numbers); after that, every run posts automatically and the board keeps each name's best distance. Open **Leaderboard** from the start screen to see the top runners.

The scores are stored by `server.js` (`GET /api/scores`, `POST /api/scores`). Because the game runs in the browser, a determined player could post a fake distance, so treat it as a friendly board.

## Deploy on Railway

The repo includes a tiny Node server (`server.js`, no dependencies). Railway detects `package.json` and runs `npm start`, which serves the game and the leaderboard on the `PORT` Railway provides.

**Keep scores across redeploys:** Railway wipes the app's files on every deploy. In your Railway service, add a **Volume** (mount path `/data`) and set the variable `DATA_DIR=/data`. Without a volume the leaderboard resets each time you redeploy. To run it locally: `npm start`, then open http://localhost:3000.
