declare var wNumb: any;
export const options = {
  title: 'Sparen of beleggen: wat levert meer op?',
  inlay_slider: {
    start: 100,
    range: {
      'min': [  0, 100 ],
      '25%': [ 1000, 1000 ],
      '50%': [ 10000, 5000 ],
      '75%': [ 50000, 5000 ],
      'max': [ 100000 ]
    },
    connect: 'lower',
  	behaviour: 'snap',
    format: wNumb({
      decimals: 0
    })
  },
  inlay_label: 'Eerste eenmalige inleg',
  inlay_help: 'Vul een bedrag in tussen de € 0,- en € 100.000,-',
  periodic_label: 'Periodieke inleg per maand',
  periodic_slider: {
    start: 10,
    range: {
      'min': [  0, 10 ],
      '25%': [ 250, 50],
      '50%': [ 1000, 100 ],
      'max': [ 2000 ]
    },
    connect: 'lower',
  	behaviour: 'snap',
    format: wNumb({
      decimals: 0
    })
  },
  periodic_help: 'Vul een bedrag in tussen de € 10,- en € 2.000,-',
  duration_label: 'Toon mogelijk resultaat na',
  duration_slider: {
    start: 10,
    range: {
      'min': [  1, 1 ],
      'max': [ 50 ]
    },
    connect: 'lower',
  	behaviour: 'snap',
    format: wNumb({
      decimals: 0
    })
  },
  duration_help: 'Vul een periode in tussen 10 en 30 jaar. Wilt u korter dan 10 jaar vermogen opbouwen? Dan heeft u weinig tijd om eventuele koersdalingen goed te maken.',
  result_inlay_label: 'Totale inleg',
  result_savings_label: 'Resultaat uit sparen',
  result_savings_help: 'Er is gerekend met een vaste rente van xx',
  result_invest_label: 'Resultaat uit beleggen',
  result_invest_help: 'Helptekst voor hierbij.',
  conversate_text: 'Gratis orientatiegesprek aanvragen',
  cta_button_text: 'Direct zelf regelen',
  disclaimer_text: 'Alle berekeningen zijn op basis van een ...'
};
