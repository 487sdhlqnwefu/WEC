# Roles and permissions

| Role | Mapping | Ballots | Timer | Roster | Public |
| --- | --- | --- | --- | --- | --- |
| Platform Admin | yes (audited) | override only | yes | yes | yes |
| Lead organiser | no (unless also steward) | progress only | yes | yes | yes |
| Blind Steward | yes (dedicated console, reauth, audit) | never | no | no | yes |
| Judge | never | assigned heat only | no | no | yes |
| Competitor / team / coach | never | never | view | own entry | yes |
| Shot barista | never | never | view queue | no | yes |
| Online member voter | never | eligible open-member rounds | no | no | yes |
| Public spectator | never | progress count only | view | no | yes |

Conflicts enforced in `api/wlat/domain/roles.ts`: steward cannot compete/coach/judge/vote; competitor cannot judge; coach cannot judge a coached heat.
