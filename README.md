# RTA – RollerCoin Task Assistant

RTA is a local-first helper for viewing and organizing RollerCoin Taskwall offers. This repository contains the **0.3 Offer Manager** prototype.

## Features in 0.3

- Read-only scanning of visible RollerCoin Taskwall offer cards
- Local browser extension for Opera GX / Chromium-based browsers
- Local Node.js bridge between the extension and dashboard
- Offer list with reward and duration information
- Local offer history: newly seen, disappeared, and changed offers
- Manual tracking of game/app task goals, progress, deadlines, and status
- Manual survey outcome statistics (success, screenout, technical issue, time, and actual reward)
- Local browser storage for dashboard data

## Project status

Version 0.3 was tested by the project owner with a 12-offer Taskwall scan and the local bridge. Development is currently paused. The project is an experimental community prototype, not an official RollerCoin product.

## Requirements

- Windows
- Node.js installed
- Opera GX or another Chromium-based browser supporting Manifest V3 extensions
- Access to the RollerCoin Taskwall

No npm packages are required; the local bridge uses Node.js built-in modules only.

## Quick start (Windows)

1. Download this repository as a ZIP and extract it.
2. Open `RTA_LocalBridge` and double-click `RTA_Starten.bat`.
3. Keep the console window open. The dashboard opens at `http://127.0.0.1:8765`.
4. In the browser, open `opera://extensions` (or the equivalent extensions page), enable Developer mode, and choose **Load unpacked**.
5. Select the `RTA_Extension` folder from the extracted project.
6. Open the RollerCoin Taskwall, open the RTA extension, and choose **Taskwall scannen**.
7. Choose **An RTA TestApp senden** to send the scan to the local dashboard.

Stop the local bridge with `Ctrl+C` in its console window.

## Privacy and safety

- The bridge binds to `127.0.0.1` and is intended to run on the user's own computer.
- The scanner reads visible Taskwall offer information. It does not click offers, play games, answer surveys, bypass CAPTCHAs, or submit offers.
- Survey results and game/app progress are entered manually by the user.
- The dashboard stores its working data in the browser's local storage. The bridge also writes scan snapshots beside `server.js` while running; do not commit generated scan files.
- Do not publish RollerCoin account identifiers, survey links containing personal IDs, browser profiles, cookies, credentials, or personal exports.

## Repository layout

- `RTA_Extension/` – browser scanner extension
- `RTA_LocalBridge/` – local Node.js bridge and Windows launcher
- `RTA_TestApp/` – local web dashboard

## Disclaimer

RTA is an independent, unofficial project and is not affiliated with, endorsed by, or sponsored by RollerCoin. Use it in accordance with RollerCoin's terms and the rules of any offer or survey provider.
