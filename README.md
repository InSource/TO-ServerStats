TO related staff I've recreated and/or refactored 🙄

`index.html` — _LuckyDog_'s TO server [stats page](https://serverstatus.tacops.de/index.php) (by LuckyDog)

`stream_overlay.html` — OBS [HUD overlays](https://tactical-ops.eu/tactical-ops-tv-overlay.php) for TO stream (by _jo0Oey_)

Features:
- Retrieve server stats from _LuckyDog_'s API
- UI is fully rendered on the client-side
- Url-parameters supported: `ip`, `port`, `timeout` (data refresh rate)

To do:
- Handle different server versions:
  - [x] [Main](https://tactical-ops.eu/totv/overlays/ld_hud.php) (powered by LuckyDog API)
  - [ ] Trimmed — less information available, e.g., no Player Status, Round Wins, etc (powered by LuckyDog API)
    - [ ] [TO3.4 Version](https://tactical-ops.eu/totv/overlays/ld_hud_to340.php)
    - [ ] [TO3.5 Version](https://tactical-ops.eu/totv/overlays/ld_hud_to3t0.php)
  - [ ] Legacy — it only has a 1-5min update rate and is missing allot of info (powered by 333 Networks API)
   