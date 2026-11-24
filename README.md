# Quake Echo

Compare agency estimates of the same Sunshine Coast earthquake and explore where people reported feeling it. [Open Quake Echo](https://coolcode.ca/quakeecho/).

<!-- coolcode:guide -->
Search for Sechelt, then compare its community intensity with the preferred Canadian and US magnitudes. Change the minimum response count to see which places are supported by many independent submissions.
<!-- /coolcode:guide -->

## Data and interpretation

This reviewed cross-border case pairs the [Canadian archival bulletin](https://earthquakescanada.nrcan.gc.ca/recent/2025/20250221.2126/index-en.php) for the Sunshine Coast event of February 21, 2025 with [USGS event us7000pfbs](https://earthquake.usgs.gov/earthquakes/eventpage/us7000pfbs). The importer validates their origin times, reads the Canadian magnitude, type and depth, and displays the preferred USGS solution. Each currently published USGS origin and the DYFI public-response product carries its own update timestamp. The generic footer date in the Canadian bulletin does not date its solution. The USGS community table groups voluntary responses by ZIP or locality. CDI describes reported effects, while magnitude estimates source size. Coverage and self-selection affect the distribution. Rechecking this reviewed event can pick up revisions. An additional event requires an individually verified match.

## Reproducing the edition

Install lxml to parse the bulletin table. Run `python3 scripts/refresh.py` from the repository. The monthly GitHub Action checks the sources, validates the offline build and publishes changes. A failed retrieval leaves the previous release available. The retrieval date is separate from the observation period. Results are calculated locally in the browser from the bundled edition. Visitor selections are not uploaded.

Run `node --test tests/*.test.mjs`, `python3 -m unittest discover -s tests` and `python3 scripts/build.py`. Serve `dist/` to preview the standalone site. The Pages workflow also exercises the main interaction and responsive layout in Chromium.

<!-- schedule-reliability -->
## Schedule reliability

Public GitHub repositories can have scheduled workflows disabled after 60 days of inactivity. A separate weekly [schedule guard](.github/workflows/schedule-guard.yml) calls GitHub's enable-workflow API for an explicit list of refresh workflows and itself. It can restore workflows disabled for inactivity, preserves manually disabled workflows, and runs independently of collection failures.

This is an interim mitigation, not a scheduling guarantee: GitHub does not document active-workflow renewal as a permanent exemption, and scheduled runs can be delayed or dropped. A scheduler on our own Linux server is the planned independent trigger. The guard does not collect data, create dummy commits, or change source/check timestamps; successful collection and published data freshness still need monitoring.
<!-- /schedule-reliability -->
