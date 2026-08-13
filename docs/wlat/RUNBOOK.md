# Live-event runbook

## Connectivity loss
Clients poll every 1–2s and can open SSE `/api/wlat/stream?slug=`. Timer truth is on the server. Show “reconnecting” without resetting the clock.

## Timer recovery
If a device dies, another authorised operator opens Control. Same heat, same `version`. Stale versions are rejected. Pause requires a reason.

## Upload failure
Keep the local file. Staff with `photo_support` can retry. Qualifying verified platform/network failure: one organiser restart.

## Missing judge
Do not finalise an official panel with a missing ballot. Replace the judge (conflict or absence) before judging opens, or use Platform Admin recovery.

## Result dispute
Do not edit ballots. Void + revote (admin) or manual override (Platform Admin) with an immutable audit reason. Public pages must still show that a result was manually resolved.

## Blindness breach
Steward reports incident. Organiser/Admin choose continue, void, restart, or manual resolve. Record affected ballots.
