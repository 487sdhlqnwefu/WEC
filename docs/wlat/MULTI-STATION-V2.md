# Multi-station v2 seam

v1 resolves the single enabled station through a service (`enabledStation`). Heat, timer, upload, ballot, and board records already have `station_id`.

v2 should:
- Allow multiple enabled stations.
- Move `wlat_event_runtime_locks` uniqueness from `event_id` to `(event_id, station_id)`.
- Lease one active heat and timer per station.
- Schedule parallel heats with feeder and rest constraints.
- Fan out Realtime per station; keep a tournament overview.

Do not expose multi-station controls in v1 UI.
