/* ============================================================
   EVERYTHING YOU EDIT LIVES IN THIS FILE.
   To add a book, a film, a post or an interest, copy one of the
   { ... } blocks, paste it into the list and change the text.
   Keep the commas between blocks.
   ============================================================ */

window.SITE = {

  email: "hianhoepua@berkeley.edu",

  links: [
    { label: "GitHub", url: "https://github.com/phihooo" }
    // { label: "LinkedIn", url: "https://www.linkedin.com/in/your-handle" }
  ],

  // Résumé page. Put your PDF next to index.html and write its file name
  // here, e.g. "resume.pdf". Leave as "" until you have one.
  resume: "",

  // Home page
  location: "Berkeley, California / 37.87\u00b0 N",
  tagline: "Curious about neural networks, and about where human learning meets machine learning.",

  // Short lines on the home page under "Right now".
  // A line can carry a small drawing: { text: "...", sticker: "cards" }
  now: [
    "At UC Berkeley, studying Computer Science and Applied Mathematics.",
    { text: "Studying LLM reasoning in poker.", sticker: "cards" },
    "Machine Learning Engineer at the Student Association for Applied Statistics.",
    { text: "Tearing fingers at bouldering.", sticker: "boulder" }
  ],

  // The home page screen types out a screenplay title page, then a scene.
  //   title:   the title of the "film"
  //   opening: one of these lines shows on each visit. Add or remove freely.
  //   quote:   shown under the screen
  title: "The Beautiful Game of Life",
  quote: { text: "The answer must be in the attempt.", by: "C\u00e9line, Before Sunrise" },
  screen: "fadein",
  opening: [
    "IAN PUA studies maths and computer science by day and watches too many films by night.",
    "IAN PUA, a long way from Singapore, asks a machine why it folded.",
    "IAN PUA wants to know whether machines learn the way people do.",
    "IAN PUA opens a laptop. He should be asleep."
  ],

  // About, on the home page: one string per paragraph.
  about: [
    "I'm Hian Hoe, but I also go by Ian. I grew up in Singapore and went to boarding school in the UK. Before Berkeley, I spent two years in the Singaporean military as a platoon sergeant, teaching satellite and battlefield communications to around 300 recruits.",
    "I love solving complex problems and looking at things from different perspectives, and I'm as curious about people as I am about machines. Away from a screen I'm usually climbing, diving or at the cinema."
  ],

  // Optional facts box beside the backstory. Leave empty for none.
  // Example: { icon: "home", label: "from", value: "Singapore" }
  facts: [],

  // Media diet page.
  //   type:   "book", "film", "tv" or "article"
  //   status: "now" (in progress) or "done"
  //   by:     author, director or publication (optional)
  //   sticker: a small drawing beside the title. One of: axe, jelly, moth, eye,
  //            dunes, sunrise, fox, quill, camera, atom, thread, palette,
  //            chicken, planet. Leave it out for none.
  //   when:   a year or date shown on the right. Films use the release year. (optional)
  //   note:   what stayed with you (optional)
  //   url:    link, mainly for articles (optional)
  media: [
    {
      type: "book", status: "done",
      sticker: "axe", title: "Crime and Punishment", by: "Fyodor Dostoevsky",
      note: "Read slowly, chapter by chapter. It left me with a thesis about Raskolnikov's extraordinary-man theory and modern figures who mistake being beyond the law for being beyond morality."
    },
    { type: "book", status: "done", sticker: "jelly", title: "\u00c1gua Viva", by: "Clarice Lispector" },
    { type: "book", status: "done", sticker: "moth", title: "Strange the Dreamer", by: "Laini Taylor" },
    { type: "film", status: "done", sticker: "eye", title: "You Can See Everything", when: "2026" },
    { type: "film", status: "done", sticker: "dunes", title: "Dune: Part One and Part Two", when: "2021, 2024" },
    { type: "film", status: "done", sticker: "sunrise", title: "The Before Trilogy", when: "1995\u20132013" },
    { type: "film", status: "done", sticker: "fox", title: "Fantastic Mr. Fox", when: "2009" },
    { type: "film", status: "done", sticker: "quill", title: "Pride & Prejudice", when: "2005" },
    { type: "film", status: "done", sticker: "camera", title: "Yi Yi", when: "2000" },
    { type: "film", status: "done", sticker: "atom", title: "Oppenheimer", when: "2023" },
    { type: "film", status: "done", sticker: "thread", title: "Past Lives", when: "2023" },
    { type: "film", status: "done", sticker: "palette", title: "Portrait of a Lady on Fire", when: "2019" },
    { type: "film", status: "done", sticker: "chicken", title: "City of God", when: "2002" },
    { type: "tv", status: "done", sticker: "planet", title: "Andor", when: "2022" }
  ],

  // Writing page.
  //   To give a piece its own page on this site, add a slug and a body:
  //     slug: "my-essay",            (letters, digits and hyphens only)
  //     body: [ "First paragraph.", "## A heading", "> A quote", "Next paragraph." ]
  //   Or set url to link to a piece published somewhere else.
  //   With neither, the piece is listed but not clickable.
  writing: [
    {
      when: "In progress",
      title: "An essay on Crime and Punishment and unaccountable power",
      blurb: "Raskolnikov's theory, read against people today who treat legal impunity as moral permission.",
      url: ""
    }
  ],

  // icon is one of "climb", "run", "dive", "film", "sport", "french".
  // To use a picture instead (a logo or your own photo), add image: "img/file.png".
  interests: [
    { icon: "climb", name: "Tearing fingers at bouldering", note: "Climbing. Aiming for two sessions a week." },
    { icon: "run", name: "Running",    note: "Finished a marathon after about five months of training." },
    { icon: "dive", name: "Diving",     note: "Certified rescue diver." },
    { icon: "film", name: "Film and TV", note: "Big-format spectacle and quiet, intimate films both. The running list is under Words & pictures." },
    { icon: "sport", name: "Watching sport", note: "NBA, soccer and the NFL. Cincinnati Bengals on Sundays. NBA statistics are what first pulled me towards data science." },
    { icon: "french", name: "French",     note: "Practising every day." }
  ],

  // Adventures page.
  //   places: pins on the map. Look up lat and lon by searching
  //           "<place> coordinates". South and west are negative.
  //           here: true marks where you are now.
  //   next:   your next trip. Fill in both to show a countdown,
  //           e.g. { where: "Patagonia", date: "2027-06-01" }
  //   log:    things you've gone and done. when and where are optional.
  adventures: {
    places: [
      { name: "Singapore", country: "Singapore",     continent: "Asia",          lat: 1.35,  lon: 103.82,  note: "home" },
      { name: "Berkeley",  country: "United States", continent: "North America", lat: 37.87, lon: -122.27, note: "now", here: true }
    ],
    next: { where: "", date: "" },
    log: [
      { when: "", what: "Ran a marathon", where: "After about five months of training." },
      { when: "", what: "Certified as a rescue diver", where: "" }
    ]
  }
};
