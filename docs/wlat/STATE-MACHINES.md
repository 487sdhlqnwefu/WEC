# Event and heat state machines

## Event

`draft → awaiting_payment → setup → registration_open → roster_locked → bracket_ready → live → completed → archived`

Payment webhook, not the Checkout redirect, moves `awaiting_payment` to `setup`. `cancelled` is reachable from pre-live states.

## Heat

Normal: `scheduled → check_in → (pattern_reveal if Match the Pattern) → prep → competition → photography → awaiting_uploads → judging_open → judging_closed → finalized`

Freestyle skips `pattern_reveal`. Photography may jump to `judging_open` when both photos are already verified.

Overlay states: `paused`, `restart_pending`, `void`. Active states (occupy the v1 event lock): check-in through judging, plus paused and restart_pending.

## Timer

Stored on the server: phase, start, expected end, pause timestamp, accumulated pause, optimistic `version`. Clients display `remainingMs` from those timestamps.
