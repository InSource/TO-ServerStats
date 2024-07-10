TO related staff I've recreated and/or refactored 🙄

-----
`index.html` — LuckyDog's TO server [stats page](https://serverstatus.tacops.de/index.php) (by _LuckyDog_)

-----
`stream_overlay.html` — OBS [HUD overlays](https://tactical-ops.eu/tactical-ops-tv-overlay.php) used for streaming (by _jo0Oey_)

It works without using any web server, just open `file:///path/to/stream_overlay.html?ip=81.169.138.37&port=9777&icons=true` and voilà! ;)

Features:
- Retrieve server stats from LuckyDog's API
- UI is fully rendered on the client-side
- Url-parameters supported:
  - `ip`, `port`
  - `timeout` — data refresh rate (in seconds)
  - `mode` — `main` (used by default), `trimmed34`, `trimmed35` or `legacy`
  - `icons` — if it's `true` icons will be shown for player's score, kills, deaths, etc. instead of text labels `S:`, `K:`, etc.

To do:
- Handle different server versions:
  - [x] [Main](https://tactical-ops.eu/totv/overlays/ld_hud.php) (powered by LuckyDog API)
    - [x] regular
    - [x] with icons! (add `icons=true` to the url)
  - [ ] Trimmed — less information available, e.g., no Player Status, Round Wins, etc (powered by LuckyDog API)
    - [ ] [TO3.4 Version](https://tactical-ops.eu/totv/overlays/ld_hud_to340.php)
    - [ ] [TO3.5 Version](https://tactical-ops.eu/totv/overlays/ld_hud_to3t0.php)
  - [ ] [Legacy](https://tactical-ops.eu/totv/overlays/333n_hud.php) — it only has a 1-5min update rate and is missing allot of info (powered by 333 Networks API)

Considerations:
- Should be there any indication on the request fail?
- Should we stop request data no matter what or stop after certain retry count?
- When server doesn't return some fields should I use some defaults or just show `N/A`?