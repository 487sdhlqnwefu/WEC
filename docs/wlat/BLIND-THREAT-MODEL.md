# Blind judging threat model

Attackers: curious organisers, judges, competitors, audience, leaked logs, predictable A/B.

Controls:
- Mapping generated with CSPRNG, independent of seed, bracket side, and upload order.
- Mapping stored separately; not included in public, judge, competitor, or Realtime DTOs.
- Steward reveal requires recent auth, reason, and an access log.
- Online A/B presentation order is hashed per voter so “A” is not always left.
- Physical placement hints randomise table side.
- No live A/B totals. Public may show ballot *counts* only.
- Filenames hashed; originals stay private; judging alt text is “Latte art Entry A/B”.
- Venue checklist: software cannot hide bodies on stage.

Residual risk: a steward colluding with a judge, or a camera showing the pourer. Operational, not software.
