import type { WbtSlug } from "./host";

export const NAV_ITEMS: { label: string; slug: WbtSlug }[] = [
  { label: "Home", slug: "home" },
  { label: "How it works", slug: "how" },
  { label: "Sitters", slug: "sitters" },
  { label: "Festival", slug: "festival" },
  { label: "Results", slug: "results" },
  { label: "Competitors", slug: "competitors" },
  { label: "Luck vs skill", slug: "luck" },
  { label: "WEC", slug: "wec" },
  { label: "Contact", slug: "contact" },
];

export const WORDMARK = {
  line1: "WORLD BARISTA",
  line2: "TOURNAMENT",
} as const;

export const SIBLING_LINK = "WEC espresso knockout";

export const FOOTER = {
  blurb:
    "Sitter tickets and entry fees pay for the decision. Industry tickets, paid coffees (competitor commission), pair packs, and side games pay for the festival. Kit is on loan. The silent till may take a paid isolation sponsor — not title rights. Look, then drink. Art side prizes published, not the title.",
  legal:
    "World Barista Tournament. Sibling of World Espresso Championship. Neither result decides the other.",
  canonical:
    "WBT: worldbaristatournament.com. Umbrella — World Coffee Tournaments: www.worldcoffeetournaments.com.",
  umbrellaName: "World Coffee Tournaments",
  family: "a World Coffee Tournaments event",
  scc: "Specialty Coffee Community — free membership later",
} as const;

export const COLOURS = [
  {
    name: "Brown",
    meaning: "Chocolatey, cocoa, toasted, malt",
  },
  {
    name: "Gold",
    meaning: "Honey, citrus, stone fruit",
  },
  {
    name: "Red",
    meaning: "Berries, jam",
  },
  {
    name: "Purple",
    meaning: "Ripe / funky fruit — the notes people associate with natural-process coffees",
  },
] as const;

export const HOME = {
  title: "World Barista Tournament",
  eyebrow: "World Barista Tournament",
  h1: "Two drinks. Same order. Which do you like more?",
  lede: "There is no world’s best coffee — only the world’s best coffee for you. A barista’s job is to make this person’s order. Ordinary drinkers pay to sit on a silent path — no stage, no PA — until their assessments are done; then they may enter the festival. Baristas pay to compete. Industry pays to watch. Milk pours once; you look; side prizes if you vote; then those drinks get drunk. We count likes for the title.",
  sit: "Sit silent",
  festival: "Festival",
  compete: "Compete",
  how: "How it works",
  productH2: "That is the whole product",
  product: [
    "Two finished drinks on the table. Same ticket. You pick the one you like more.",
    "You never get one cup. You never score a memory.",
    "A silent barista can win every ticket they make.",
  ],
  pathsH2: "Two paths. One weekend.",
  pathsSilentTitle: "Silent path",
  pathsSilent:
    "Until your assessments for the event are done: no stage, no emcee, no PA, no industry floor. You order alone. You will not see the show until you have voted. After that you may enter the festival.",
  pathsFestTitle: "Festival / stage",
  pathsFest:
    "Industry pays to watch. Emcee, art side prizes, pair packs, cup tasters. After official tickets, paid coffees — competitors take a commission. Grand. Loud. Celebrate coffee. Not the title.",
  pass: "One pour. Look. Then drink. Stage → phone side prizes → the same cups continue (silent likes, pair pack, or the floor). Not the title. Not a dump sport.",
  pathsLinkSilent: "Sitters",
  pathsLinkFest: "Festival",
  colourH2: "Order like a customer",
  colourIntro:
    "You choose a drink and a colour from a café board. Both baristas have to hit that ticket.",
  barH2: "Espresso and filter. One bar.",
  bar: "A barista makes espresso-style drinks and filter. Splitting those into separate world titles treats the café as two sports. Here it is one job: the ticket that landed.",
  whoH2: "Who pays is who it exists for",
  sittersTitle: "Sitters",
  sittersBody:
    "You register, pay about the price of two to five café coffees, and drink two serious coffees of your order. That funds the decision.",
  sittersLink: "Register interest",
  competitorsTitle: "Competitors",
  competitorsBody:
    "You pay an entry fee. Same station class. The coffee list is the list the competitors chose.",
  competitorsLink: "The job",
  festivalTitle: "Festival",
  festivalBody:
    "Industry pays to watch, vote look as a side prize, buy a pair pack, play odd-cup games, and drink the coffee. Competitors take a commission. None of that picks the champion.",
  festivalLink: "Not the title",
  luckH2: "We name the luck. Then we count.",
  luck: "Every competition has luck. We say where it sits. We print how thick or thin the count was. We never claim zero luck.",
  luckLink: "Luck vs skill",
  siblingH2: "WEC is the espresso knockout.",
  sibling:
    "WBT is the café tournament. Same honesty about pairs. Different job. A WEC result does not crown WBT, and the other way around. Both sit under World Coffee Tournaments.",
  siblingLink: "Read the sibling",
  resultsH2: "Likes vs art vs commission",
  results:
    "Champion = silent-path paired likes. Art side prizes and commissions are published next to that. None of those other columns is the title. Those cups were drunk. Not a dump sport.",
  resultsLink: "Likes vs art vs commission",
} as const;

export const HOW = {
  title: "How it works — World Barista Tournament",
  h1: "How it works",
  lede: "A ticket lands. Two people make it. Two cups arrive together. You say which you like more. After the last ballot, the match is a count.",
  steps: [
    {
      title: "You order",
      body: "Drink type and a colour, plus the modifiers on the menu. Not a surprise signature. Not “the coffee of the year.”",
    },
    {
      title: "Both bars get the same ticket",
      body: "Names off. House till on the silent path. You order alone. No face-to-face ordering while the pair stays blind.",
    },
    {
      title: "Two cups at the same time",
      body: "Look, then drink. Milk drinks include how they look in the cup — not a pattern exam.",
    },
    {
      title: "Look, then drink",
      body: "The pour happens once on the festival stage. Audience phones may vote side prizes: overall, new pattern, contrast, consistency. The same drinks get drunk — closed doors to you, a pair pack, or the floor. Published. Not the title. Not a dump sport.",
    },
    {
      title: "Forced like",
      body: "Which do you like more? You may leave notes on texture, taste, and flavour & smell. Notes are not scores. The pick is the data.",
    },
    {
      title: "We count",
      body: "When the tickets for that match are done, we count the likes. We print the count. Majority wins the match.",
    },
  ],
  orderH2: "Espresso-based, batch, hand brew, cold brew",
  order:
    "This is café work. Hand brew is capped per match because it takes time. Cold brew is made off-site before the event, sealed, and checked in — still two cups of the same ticket.",
  hopperH2: "Hopper skill is part of the job",
  hopper: [
    "One espresso grinder per colour. From a published list of greens and roast profiles, the barista chooses what goes in that hopper — blends allowed. Same colour ticket, two different executions. Still two cups.",
    "The list is not every coffee on earth. The competitor community decides it. Not a trade-ritual score gate.",
  ],
  stationH2: "Same class both sides",
  station:
    "Same machines, grinders, brew kit class. Kit may be loaned unpaid. Competitors (and the champion) give usage feedback. That feedback is the return. No title owner on the ballot.",
  firstH2: "First tournament, in outline",
  first: [
    "Field of 16, in pools then knockout. Two matches at a time.",
    "The title exists for sitters and competitors because they pay. We do not open the silent doors on a thin sitter floor.",
    "Industry festival is a second door. Art side prizes, pair packs, and cup tasters live there. They do not pick the champion. Those cups are drunk.",
    "This page is the sport, not the match-day till software.",
  ],
} as const;

export const SITTERS = {
  title: "Sitters — World Barista Tournament",
  h1: "You will not see the show until you have voted.",
  lede: "This is the silent path. Ordinary drinkers. Not a judging caste. You pay to sit, you order alone, you pick the cup you like more. No stage, no audio, no industry — until your assessments are done. After that you may enter the festival.",
  silentH2: "The silent wing",
  silent: [
    "Different door from the festival until you have finished assessing.",
    "Until then you never witness the stage. You never hear the emcee.",
    "Ordering and assessment is the person alone. No one in your ear.",
    "After your assessments for the event are done, you may enter the festival. Until then, silent.",
  ],
  seatH2: "The seat",
  seat: [
    "Register and pay a small ticket — about two to five café coffees.",
    "On the day you sit, a short, simple activity so the words texture, sour vs bitter, and aftertaste are in the mouth. Not a weeks-long course.",
    "Order from the colour board like a customer.",
    "Receive two finished drinks at the same time. Never one.",
    "Pick which you like more. Optional notes. Then you are done with that ticket.",
    "After your assessments for the event are done, you may enter the festival. Until then, silent.",
  ],
  whoH2: "Who should sit",
  who: [
    "People who drink coffee at least weekly. The largest coffee market is not a specialty panel. If the room is only trained palates wearing sitter badges, we have the wrong room.",
    "You do not need to name origins. You do not need to perform tasting notes. Liking is enough.",
  ],
  oweH2: "What we owe you",
  owe: [
    "Serious coffee for your ticket.",
    "Two cups at once.",
    "A choice that is allowed to be “I just like this one more.”",
    "No requirement to match a wheel.",
    "Nobody in your ear. Isolation of opinion is the product.",
  ],
  formH2: "Register interest",
  formIntro:
    "First event tickets are not on sale here yet. Leave your name if you want a seat when they are.",
  name: "Name",
  email: "Email",
  city: "City",
  weekly: "I drink coffee at least weekly",
  silentCheck: "I understand I will not see the show until my assessments are done",
  note: "Anything we should know",
  submit: "Register interest",
  success: "Interest noted. We will write when seats open.",
  error:
    "Could not send. Email hello@worldespressochampionship.com with subject WBT sitter.",
} as const;

export const COMPETITORS = {
  title: "Competitors — World Barista Tournament",
  h1: "The job is the ticket.",
  lede: "Take a specific order. Make a specific coffee for that person. Espresso and filter on the same bar. Same station class as the person you draw. The coffee list is the list you chose.",
  winH2: "What winning means",
  win: [
    "The champion is the barista who won the last head-to-head on counted likes for the people who sat that tournament. Different sitters can like opposite cups. Both can be right for them. This person won more of those tickets.",
    "Do not read the title as world’s best coffee. It is not.",
  ],
  barH2: "On the bar",
  bar: [
    "Stock four colours: Brown, Gold, Red, Purple. Hopper and brew bin.",
    "Choose green and/or roast profile from the published community list. Blends allowed.",
    "Hit espresso-based drinks, batch, a capped pour-over, and cold brew you steeped before you arrived.",
    "Get the pair to the pass on time.",
    "A silent barista can win every ticket they make. There is no speech round.",
  ],
  listH2: "The list on the bar is the list the competitors chose",
  list: [
    "Not a panel of trade scores. Entered baristas nominate, then the field ranks a diverse published menu of greens and roast profiles for that event. Not every coffee in the world. Enough to stock four colours.",
    "Hopper skill is real because the list is real and shared.",
  ],
  kitH2: "Kit is on loan. Tell us if it worked.",
  kit: "Machines, grinders, brew kit: unpaid loan, same class both sides. You use it under match pressure. You (and the champion) give usage feedback. That is the company’s return. You are not a silent billboard.",
  fieldH2: "First field",
  field:
    "Sixteen baristas. Pools, then knockout. Entry is an entry fee, not a title-sponsor package. Sitter tickets plus entry fees pay for the decision. After official tickets, festival coffees can pay you a commission. The title is still the likes.",
  formH2: "Register interest",
  formIntro:
    "Leave your name if you want to enter, or to help lock the community coffee list, when the first field opens.",
  name: "Name",
  email: "Email",
  city: "City / shop",
  compete: "I want to compete",
  listHelp: "I want to help with the coffee list",
  note: "Note",
  submit: "Register interest",
  success: "Interest noted. We will write when entry opens.",
  error:
    "Could not send. Email hello@worldespressochampionship.com with subject WBT competitor.",
} as const;

export const LUCK = {
  title: "Luck vs skill — World Barista Tournament",
  h1: "We name the luck. Then we count.",
  lede: "Every competition has luck. Titles that print one “best coffee” total as if it were a sterile instrument do not say so. We do. The count is still the count. Nothing here adds dice to the match.",
  skillH2: "Skill — what the barista is for",
  skill: [
    "Choosing from the community list, stocking hoppers and bins, blending.",
    "Making this person’s order — espresso or filter — then the next person’s.",
    "The received milk drink, including how it looks.",
    "Surviving the rush. Getting the pair to the pass on time.",
    "Winning a majority of independent paired likes, then enough matches.",
  ],
  skillClose:
    "Skill is not a speech. Skill is not a trade-ritual number. Skill is not “this coffee is objectively the world’s.”",
  luckH2: "Luck — what the barista does not choose",
  luck: [
    "Which ordinary drinkers paid to sit this weekend. Whose “for you” is in the data.",
    "Which tickets they order: drink, colour, modifiers, and the order of the queue.",
    "Who you draw. Left or right on the table.",
    "Which SKUs made the list before lock. After lock, choosing from that list is skill.",
    "A finite number of forced choices. A thin win is a thin win. We print that.",
  ],
  luckClose:
    "Because there is no world’s best coffee — only the world’s best coffee for you — luck includes which “you” walked in.",
  printH2: "How luck stays visible",
  print:
    "After assessments, we publish the count for the match: how many valid likes, the score, how wide the margin was. A blowout and a one-ticket win are not the same amount of doubt. Majority still stands. We never edit luck out of the line. We never claim the count had zero luck.",
  close:
    "Read this next to any title that does not have a luck chapter. The contrast is in what is written down.",
} as const;

export const FESTIVAL = {
  title: "Festival — World Barista Tournament",
  h1: "The festival is the loud door.",
  lede: "Industry pays to watch. Emcee on the stage. Look, then drink. Side prizes on the pour. Pair packs. Cup tasters. After official tickets, buy a coffee from the people who just competed — they take a commission. None of that is the title. This is not a dump sport.",
  lookH2: "Look, then drink",
  look: "A pattern is worth a quick look. Then the cup is consumed. Milk drinks are poured once on the festival stage. You see the pour live, then close-up on your phone. You may vote side prizes: overall look, novel pattern, contrast, consistency — or which barista you prefer. Still a look vote. Then the same drinks get drunk: through closed doors to silent sitters, in a pair pack, or on the floor. Published. Not the title. Not a visual-only championship.",
  prizesH2: "Side prizes",
  prizesIntro: "Extra games. Fun. Same liquid. Zero title weight.",
  prizes: ["Overall look", "Novel pattern", "Contrast", "Consistency"],
  packsH2: "Pair packs",
  packs:
    "Buy one from each of the two baristas. Own two-cup pick. Compare later to official likes. Entertainment and teaching. Not a ballot. You drink them.",
  gamesH2: "Cup tasters",
  games:
    "Odd-cup triangles, a clock, hard on purpose. Sensory gym. Zero title weight. You taste the cups.",
  getH2: "The loud wing",
  get: [
    "A different door from the sitters until sitters have finished assessing. Then they may enter.",
    "Watch the bars. Cheer. Emcee. Make it grand.",
    "Look, then drink. Art side prizes, pair packs, cup tasters — zero title weight.",
    "After official tickets, paid coffees. Industry pays. Competitors take a commission.",
  ],
  notH2: "Not the title",
  not: "Ordinary drinkers on the silent path pick which of two drinks they like more. We count. That is the champion. We also publish art side prizes and commission / sales by barista. The people who chase edge-of-tomorrow flavour are a small crowd. A living is made on ordinary liking. A scoresheet opinion is not a fact.",
  formH2: "Register interest",
  formIntro:
    "Festival tickets are not on sale here yet. Leave your name if you want the loud wing when they are.",
  name: "Name",
  email: "Email",
  city: "City",
  note: "Anything we should know",
  submit: "Register interest",
  success: "Interest noted. We will write when festival tickets open.",
  error:
    "Could not send. Email hello@worldespressochampionship.com with subject WBT festival.",
} as const;

export const RESULTS = {
  title: "Likes vs art vs commission — World Barista Tournament",
  h1: "Likes vs art vs commission",
  lede: "Champion = silent-path paired likes. Also print festival art side prizes — overall, novel pattern, contrast, consistency — published, not the title; those cups were drunk. Commissions next to that. Optional: pair-pack picks vs official likes — still not a ballot. Market is ordinary taste; flavour-chasing is a small crowd. A scoresheet opinion is not a fact. Empty tables until event one. No rant. Not a dump sport.",
  likesH2: "Likes — the title",
  likes:
    "Counted paired likes from the silent path. That is who won the tournament. Different sitters can like opposite cups. Both can be right for them.",
  commissionsH2: "Commissions — the industry till",
  commissions:
    "After official tickets, festival coffees. Competitor commission by barista. If you want to make a living, the consumer profile is the market. Flavour-chasing is a small crowd.",
  factH2: "A scoresheet opinion is not a fact",
  fact: "We put the columns on one page so you can see them. We do not pretend a small trained palate is the same as the people who buy coffee.",
  emptyH2: "No numbers yet",
  artH2: "Art side prizes — published, not the title",
  art: "Overall look, novel pattern, contrast, consistency. Phone votes on the same cups that get drunk. Printed next to likes so you can see the gap. Side prizes are not the champion. Not a dump sport.",
  empty:
    "First tournament not yet counted. When it is, this page shows likes (the title), art side prizes, and industry commissions.",
  columns: [
    "Competitor",
    "Silent-path likes",
    "Art side prizes",
    "Festival commission",
  ],
} as const;

export const WEC_PAGE = {
  title: "WEC — World Barista Tournament",
  h1: "WEC is the espresso knockout. WBT is the café tournament.",
  lede: "World Espresso Championship came first: paired espresso, same honesty about two cups. It stays that. World Barista Tournament is the full café job under the same two-cup law, decided by paid ordinary drinkers. Both sit under World Coffee Tournaments. WBT does not replace WEC.",
  lines: [
    "WEC job: espresso.",
    "WBT job: espresso-based, milk, batch, hand brew, cold brew.",
    "Both: two cups at the same time.",
    "WBT sitters: ordinary drinkers who paid.",
    "WBT coffee: competitor-chosen list; hopper skill per colour.",
    "A WEC result does not seed WBT. A WBT champion is not automatically WEC champion.",
    "WBT public home: worldbaristatournament.com. Umbrella is World Coffee Tournaments at www.worldcoffeetournaments.com. The WEC site stays WEC on its own host.",
  ],
  wecHome: "WEC homepage",
  wbtHome: "WBT home",
} as const;

export const CONTACT = {
  title: "Contact — World Barista Tournament",
  h1: "Contact",
  lede: "Sitters, festival, competitors, unpaid kit loans, silent-path till isolation, press. This inbox is shared with World Espresso Championship until WBT has its own. Put WBT in the subject.",
  email: "hello@worldespressochampionship.com",
  name: "Name",
  emailLabel: "Email",
  about: "About",
  aboutOptions: [
    { value: "Sitters", label: "Sitters (silent path)" },
    { value: "Festival", label: "Festival / industry tickets" },
    { value: "Competitors", label: "Competitors" },
    { value: "Unpaid kit loan", label: "Unpaid kit loan" },
    { value: "Silent-path till", label: "Silent-path till (isolation, not title)" },
    { value: "Press", label: "Press" },
    { value: "Something else", label: "Something else" },
  ],
  kitHint:
    "Loan is unpaid. Same class both sides of a match. Feedback is the return. This is not a title-rights form.",
  posHint:
    "A paid till on the silent path funds isolation of opinion: one person, alone, ordering. It does not buy the winner. Not a title sponsor.",
  message: "Message",
  submit: "Send",
  success: "Sent.",
  error: "Could not send. Write the email yourself.",
} as const;

export const CONTACT_EMAIL = "hello@worldespressochampionship.com";

/** Strings that must never appear in public WBT copy. */
export const FORBIDDEN = [
  "presented by",
  "flavour-wheel",
  "flavor-wheel",
  "flavour wheel",
  "flavor wheel",
  "0–6",
  "0-6",
  "Q-score",
  "Q-grader",
  "WBC is fake",
  "SCA fake",
  "SCA is fake",
  "fake judges",
  "championship platform",
  "bergamot",
  "jasmine",
  "world latte art",
  "wlac",
  "sustainability director",
] as const;
