declare var wNumb: any;

export const defaultOptions = {
  mockData: false,
  serviceUrl: '/US_RestGatewayWeb/rest/requestResponse/BS_AE_POLIS_AOV_02/',
  serviceCredentials: 'FIXME',
  summaryPath: '#',
  specificationCallDelay: 500,
  personalDataHeading: 'Uw gegevens',
  birthDate: {
    minAge: 18,
    maxAge: 59,
    label: 'Wat is uw geboortedatum?',
    help: '',
    error: `Controleer of uw geboortedatum klopt. Is dit juist? Dan is uw leeftijd te dicht op de maximale leeftijd
            die wij voor uw beroep verzekeren. Of u bent jonger dan 18 jaar. Neem contact op met een adviseur voor
            een advies op maat.`
  },
  profession: {
    noMatchText: 'Er zijn geen beroepen gevonden',
    label: 'Wat is uw beroep?',
    help: `Vul de eerste letters van uw beroep in en kies uw beroep uit de lijst. Staat uw beroep er niet tussen?
           Kies dan het beroep dat het best bij uw werkzaamheden past.`,
    error: `Voor dit beroep kan geen premie worden berekend. Neem contact op met een adviseur voor een advies op maat.`
  },
  income: {
    min: 3125,
    max: 1000000,
    label: 'Wat is uw bruto jaarinkomen?',
    help: `Vul uw bruto inkomen in voor aftrek van belasting. Als dit schommelt, geeft u een gemiddelde over de
           afgelopen drie jaar. Als starter geeft u een indicatie wat u denkt te gaan verdienen.`,
    error: `Geef hier uw bruto jaarinkomen op. Deze moet minimaal €3.125 zijn. U kunt 80% van uw inkomen voor
            arbeidsongeschiktheid verzekeren.`
  },
  calculateButtonText: 'Bereken premie',

  otherChoicesHeading: 'Uw keuzes',
  startingTerm: {
    initial: 30,
    choices: [
      {
        label: '2 weken',
        value: 14
      },
      {
        label: '1 maand',
        value: 30
      },
      {
        label: '3 maanden',
        value: 90
      },
      {
        label: '1 jaar',
        value: 365
      }
    ],
    label: 'Welke eigen risicoperiode kiest u?',
    help: 'Uw uitkering start na afloop van deze periode. De meest gekozen periode is 1 maand.'
  },

  grossYearAmount: {
    slider: {
      start: 2500, // Handle start position
      step: 500, // Slider moves in increments of xx
      orientation: 'horizontal', // Orient the slider vertically
      behaviour: 'snap', // click anywhere to start dragging + draggable range
      range: { // Slider can select '0' to '100'
        'min': 2500,
        'max': 125000
      },
      connect: 'lower',
      pips: { // Shows scale and values below chart
        mode: 'range',
        density: 100
      }
    },
    label: 'Welk bruto jaarbedrag wilt u verzekeren?',
    help: `Dit is het bedrag na aftrek van belastingvoordeel. Wij rekenen met een gemiddeld belastingvoordeel van 35%.
           Voor uw situatie kan dit meer of minder zijn.`
  },
  result: {
    grossPremium: {
      label: 'Bruto premie per maand',
      help: `Dit is het bedrag dat u maandelijks betaalt, inclusief 5% doorlopende korting.
             Uw premie is fiscaal aftrekbaar. Als u een uitkering krijgt dan betaalt u daar belasting over.`
    },
    netPremium: {
      label: 'Netto premie per maand',
      help: `Dit is het bedrag na aftrek van belastingvoordeel. Wij rekenen met gemiddeld belastingvoordeel van 35%.
             Voor uw situatie kan dit meer of minder zijn.`
    },
    adviseButtonText: 'Adviesgesprek aanvragen',
    summaryButtonText: 'Bekijk en mail overzicht'
  }
};
