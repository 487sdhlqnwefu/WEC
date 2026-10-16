export const WBT_PATHS = {
  home: "/wbt",
  how: "/wbt/how-it-works",
  sitters: "/wbt/sitters",
  competitors: "/wbt/competitors",
  luck: "/wbt/luck",
  wec: "/wbt/wec",
  contact: "/wbt/contact",
  wecHome: "/",
} as const;

export const NAV = [
  { label: "Home", href: WBT_PATHS.home },
  { label: "How it works", href: WBT_PATHS.how },
  { label: "Sitters", href: WBT_PATHS.sitters },
  { label: "Competitors", href: WBT_PATHS.competitors },
  { label: "Luck vs skill", href: WBT_PATHS.luck },
  { label: "WEC", href: WBT_PATHS.wec },
  { label: "Contact", href: WBT_PATHS.contact },
] as const;

export const WORDMARK = {
  line1: "WORLD BARISTA",
  line2: "TOURNAMENT",
} as const;

export const SIBLING_LINK = "WEC espresso knockout";

export const FOOTER = {
  blurb: "Tickets and entry fees fund the room. Kit is on loan. Tell us if it worked.",
  legal:
    "World Barista Tournament. Sibling of World Espresso Championship. Neither result decides the other.",
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
  lede: "There is no world’s best coffee — only the world’s best coffee for you. A barista’s job is to make this person’s order. Ordinary drinkers pay to sit. Baristas pay to compete. We count.",
  sit: "Sit",
  compete: "Compete",
  how: "How it works",
  productH2: "That is the whole product",
  product: [
    "Two finished drinks on the table. Same ticket. You pick the one you like more.",
    "You never get one cup. You never score a memory.",
    "A silent barista can win every ticket they make.",
  ],
  colourH2: "Order like a customer",
  colourIntro:
    "You choose a drink and a colour from a café board. Both baristas have to hit that ticket.",
  barH2: "Espresso and filter. One bar.",
  bar: "A barista makes espresso-style drinks and filter. Splitting those into separate world titles treats the café as two sports. Here it is one job: the ticket that landed.",
  whoH2: "Who pays is who it exists for",
  sittersTitle: "Sitters",
  sittersBody:
    "You register, pay about the price of two to five café coffees, and drink two serious coffees of your order.",
  sittersLink: "Register interest",
  competitorsTitle: "Competitors",
  competitorsBody:
    "You pay an entry fee. Same station class. The coffee list is the list the competitors chose.",
  competitorsLink: "The job",
  luckH2: "We name the luck. Then we count.",
  luck: "Every competition has luck. We say where it sits. We print how thick or thin the count was. We never claim zero luck.",
  luckLink: "Luck vs skill",
  siblingH2: "WEC is the espresso knockout.",
  sibling:
    "WBT is the café tournament. Same honesty about pairs. Different job. A WEC result does not crown WBT, and the other way around.",
  siblingLink: "Read the sibling",
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
      body: "Names off. House till. No face-to-face ordering while the pair stays blind.",
    },
    {
      title: "Two cups at the same time",
      body: "Look, then drink. Milk drinks include how they look in the cup — not a pattern exam.",
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
    "The event exists for sitters and competitors because they pay. We do not open the doors on a thin sitter floor.",
    "This page is the sport, not the match-day till software.",
  ],
} as const;

export const SITTERS = {
  title: "Sitters — World Barista Tournament",
  h1: "You paid to sit. That is why you decide.",
  lede: "Ordinary drinkers. Not a judging caste. You sign up because you get to drink serious coffee of your order — twice — and pick the one you like more.",
  seatH2: "The seat",
  seat: [
    "Register and pay a small ticket — about two to five café coffees.",
    "On the day you sit, a short, simple activity so the words texture, sour vs bitter, and aftertaste are in the mouth. Not a weeks-long course.",
    "Order from the colour board like a customer.",
    "Receive two finished drinks at the same time. Never one.",
    "Pick which you like more. Optional notes. Then you are done with that ticket.",
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
  ],
  formH2: "Register interest",
  formIntro:
    "First event tickets are not on sale here yet. Leave your name if you want a seat when they are.",
  name: "Name",
  email: "Email",
  city: "City",
  weekly: "I drink coffee at least weekly",
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
    "Sixteen baristas. Pools, then knockout. Entry is an entry fee, not a sponsor package. Tickets plus entry fees fund the room.",
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

export const WEC_PAGE = {
  title: "WEC — World Barista Tournament",
  h1: "WEC is the espresso knockout. WBT is the café tournament.",
  lede: "World Espresso Championship came first: paired espresso, same honesty about two cups. It stays that. World Barista Tournament is the full café job under the same two-cup law, decided by paid ordinary drinkers.",
  lines: [
    "WEC job: espresso.",
    "WBT job: espresso-based, milk, batch, hand brew, cold brew.",
    "Both: two cups at the same time.",
    "WBT sitters: ordinary drinkers who paid.",
    "WBT coffee: competitor-chosen list; hopper skill per colour.",
    "A WEC result does not seed WBT. A WBT champion is not automatically WEC champion.",
  ],
  wecHome: "WEC homepage",
  wbtHome: "WBT home",
} as const;

export const CONTACT = {
  title: "Contact — World Barista Tournament",
  h1: "Contact",
  lede: "Sitters, competitors, unpaid kit loans, press. This inbox is shared with World Espresso Championship until WBT has its own. Put WBT in the subject.",
  email: "hello@worldespressochampionship.com",
  name: "Name",
  emailLabel: "Email",
  about: "About",
  aboutOptions: [
    { value: "Sitters", label: "Sitters" },
    { value: "Competitors", label: "Competitors" },
    { value: "Unpaid kit loan", label: "Unpaid kit loan" },
    { value: "Press", label: "Press" },
    { value: "Something else", label: "Something else" },
  ],
  kitHint:
    "Loan is unpaid. Same class both sides of a match. Feedback is the return. This is not a title-rights form.",
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
  "fake judges",
  "championship platform",
  "bergamot",
  "jasmine",
] as const;
