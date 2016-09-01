export const defaultOptions = {
  header: 'Is beleggen iets voor u?',
  subheader: 'Beleggen is een mooie manier om uw geld te laten groeien. Maar is het ook écht iets voor u is?',
  action: 'Doe de quiz!',
  opnieuw: 'Doe de quiz nog een keer',
  cta: {
    text: 'Begin met beleggen',
    url: '/particulier/beleggen/u-wilt-zelf-voor-het-eerst-beleggen'
  },
  result: {
    title: '{{ data.score }} van de {{ data.countQuestions }} vragen goed', // not working yet
    text: 'Verbeter uw kennis van beleggen met de volgende tips.',
    winnerTitle: 'Alle vragen goed!',
    winnerText: 'Gefeliciteerd, het lijkt erop dat u helemaal klaar bent om meer uit uw geld te halen.',
  },
  questions: [
    {
      q: 'Weet u hoeveel geld er elke maand binnenkomt en hoeveel u uitgeeft?',
      correct: true,
      check: 'Goed inzicht in uw geldzaken',
      tip: 'Goed inzicht in uw geldzaken is belangrijk. Zeker als u gaat beleggen. Tip: houd een tijdje een kasboekje bij. U ziet dan precies wat uw inkomsten en uitgaven zijn. En of beleggen bij uw budget past.'
    },
    {
      q: 'Heeft u een potje voor onverwachte uitgaven?',
      correct: true,
      check: 'Potje achter de hand',
      tip: 'Het is verstandig om een potje achter de hand te hebben voor onverwachte uitgaven. Bijvoorbeeld voor een dure reparatie aan uw auto. Een buffer van een paar duizend euro is meestal voldoende. Heeft u meer spaargeld? Dan kunt u denken aan beleggen.'
    },
    {
      q: 'Heeft u een lening?',
      correct: false,
      check: 'Geen leningen',
      tip: 'U betaalt rente over uw leningen. Het kan slim zijn om die leningen eerst af te lossen. Zo spaart u geld uit. Beleg in elk geval nooit met geleend geld. Uw belegging kan minder waard worden. In het ergste geval blijft u zitten met een restschuld.'
    },
    {
      q: 'Kunt u het geld dat u ‘over’ heeft voor langere tijd missen?',
      correct: true,
      check: 'U kunt uw geld langere tijd missen',
      tip: 'Beleggen is een kwestie van geduld. Vaak ontstaat er pas na een aantal jaar een mooi rendement. Voorkom dus dat u het geld ineens moet opnemen voor andere dingen.'
    },
    {
      q: 'Weet u wat de risico’s zijn van beleggen?',
      correct: true,
      check: "Bekend met de risico's",
      tip: 'Beleggen levert vaak meer op dan sparen. Maar daar staat een groter risico tegenover. U kunt een deel van uw geld verliezen. Vindt u zekerheid belangrijk? Dan kunt u uw geld beter op een spaarrekening laten staan.'
    },
    {
      q: 'Krijgt u hartkloppingen van het idee dat uw belegging minder waard kan worden?',
      check: 'Resultaten kunnen schommelen',
      correct: false,
      tip: 'Dan is beleggen misschien niet zo’n goed idee. De waarde van uw beleggingen schommelt. Zeker op de korte termijn kunnen de verschillen groot zijn. Daar moet u wel tegen kunnen.'
    }
  ]
};
