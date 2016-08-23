export const options = {
  title: 'Sparen of beleggen: wat levert het op?',
  // Interest rates
  interest: {
    savings: 0.8,
    pessimistic: -0.7,
    neutral: 3.3,
    optimistic: 5.9
  },
  inlay: {
    // Inlay input
    slider: {
      start: 100,
      range: {
        'min': [  0, 100 ],
        '25%': [ 1000, 1000 ],
        '50%': [ 10000, 5000 ],
        '75%': [ 50000, 5000 ],
        'max': [ 100000 ]
      },
      connect: 'lower',
    	behaviour: 'snap'
    },
    label: 'Eerste eenmalige inleg',
    help: 'Vul een bedrag in tussen de € 0,- en € 100.000,-',
  },
  // Periodic input
  periodic: {
    label: 'Periodieke inleg per maand',
    slider: {
      start: 10,
      range: {
        'min': [  0, 10 ],
        '25%': [ 250, 50],
        '50%': [ 1000, 100 ],
        'max': [ 2000 ]
      },
      connect: 'lower',
    	behaviour: 'snap'
    },
    help: 'Vul een bedrag in tussen de € 0 en € 2.000'
  },
  // Duration input
  duration: {
    label: 'Toon mogelijk resultaat na',
    slider: {
      start: 10,
      range: {
        'min': [  1, 1 ],
        'max': [ 50 ]
      },
      connect: 'lower',
    	behaviour: 'snap'
    },
    help: 'Vul een periode in tussen 1 en 50 jaar. Wilt u korter dan 10 jaar vermogen opbouwen? Dan heeft u weinig tijd om eventuele koersdalingen goed te maken.'
  },
  // resultRoundPrecision: -1,
  result: {
    inlay: {
      label: 'Totale inleg'
    },
    savings: {
      label: 'Resultaat uit sparen',
      help: 'Helptekst voor resultaat sparen'
    },
    invest: {
      label: 'Resultaat uit beleggen',
      help: 'Helptekst voor resultaat beleggen.'
    },
    roundPrecision: -1, // Show numbers rounded to given number of decimals. Negative = rounded multiples, e.g. -3 = 1000's.
  },
  conversate: {
    text: 'Gratis orientatiegesprek aanvragen',
    url: 'https://www.aegon.nl/particulier/beleggen/adviesgesprek-beleggen'
  },
  cta: {
    text: 'Direct zelf regelen',
    url: 'https://online.aegon.nl/bank/public/AccountOpening?ProductId=77'
  },
  disclaimer: "Bovenstaande berekening is een indicatie. Aan deze indicatie kunnen geen rechten worden ontleend. Beleggen brengt kosten en risico's met zich mee die niet bij sparen voorkomen. De waarde van uw belegging kan fluctueren. In het verleden behaalde resultaten bieden geen garantie voor de toekomst.",
  chartUpdateDelay: 500 // // Update chart at most every given milliseconds, e.g. 1000 for 1 sec throttle.
};
