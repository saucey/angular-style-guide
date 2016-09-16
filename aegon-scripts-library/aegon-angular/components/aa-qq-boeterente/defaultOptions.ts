declare var wNumb: any;

export const defaultOptions = {
  mockData: true,
  personalDataHeading: 'Bereken indicatie omzettingskosten',
  mortgageType: 'Hypotheekvorm van het leningdeel',
  mortgageTypeHint: 'Voer hier de hypotheekvorm in van het leningdeel waarvan u de omzettingskosten wilt berekenen.',

  mortgageTypesPlaceholder: 'Maak uw keuze',

  mortgageTypesLabels: [
    'Aflossingsvrij',
    'Annuitair',
    '(Bank)Spaar',
    'Lineair',
    'Overig'
  ],

  payAttention: `Let op!`,

  annuityInfoBox: `Voor een lineaire of annuitaïre hypotheek zullen de werkelijke omzettingskosten lager uitvallen dan in deze indicatieberekening.`,

  savingsInfoBox: `U krijgt over het spaarsaldo dezelfde rente als u betaalt over de hypotheek. Een lagere hypotheekrente leidt tot een hogere spaarpremie. Ga goed na of uw netto maandlasten bij een lagere rente wel omlaag gaan en of u uw doelkapitaal haalt.`,

  initialAmountLabel: `Oorspronkelijke bedrag`,
  initialAmountHint: `Het totale bedrag van het leningdeel op het moment dat u de hypotheek afsloot.`,

  extraPaymentLabel: `Heeft u al extra afgelost op dit bedrag?`,

  extraPaymentHint: "Als u een annuitaïre of lineaire hypotheek heeft en u naast de reguliere aflossing niet extra heeft afgelost kiest u 'Nee'",

  extraPaymentNoLabel: `Nee`,
  extraPaymentYesLabel: `Ja`,

  extraPaymentThisYearLabel: `Dit jaar`,

  extraPaymentLastYearLabel: `Voorgaande jaren`,

  interestPeriodEndDateLabel: `Einddatum rentevastperiode`,

  currentInterestRateLabel: `Huidig rentepercentage`,

  currentInterestRateHint: `Het rentepercentage dat is vastgelegd in uw huidige hypotheekcontract.`,
  currentInterestRatePlaceholder: `4,0%`,

  nhgApplicableLabel: `NHG van toepassing`,
  nhgApplicableHint: `Geef hier aan of op uw hypotheek de Nationale Hypotheek Garantie (NHG) van toepassing is.`,
  nhgApplicableNoLabel: `Nee`,
  nhgApplicableYesLabel: `Ja`,

  calculateButtonLabel: `Bereken`,
  results: {
    headline: `Indicatie omzettingskosten`,
    subHeadline: `Op basis van:`,
    remainingPeriod: `Resterende rentevastperiode`,
    interestRate: `Vergelijkingsrente`,
    interestRateHint: `Het actuele rentepercentage dat geldt voor de periode van uw resterende rentevastperiode. U vindt de geldende percentages op onze pagina met actuele rentepercentages.`,

    option1: {
      headline: `Optie 1: omzetten naar marktrente`,
      desc: `Na betaling van de omzettingskosten kunt u profiteren van een lagere rente. Het verschil in maandlasten is afhankelijk van de nieuwe rentevastperiode die u wenst.`,
      learnMoreText: `Meer over omzetten naar marktrente`,
      learnMoreUrl: `#`,

      newInterestPeriodLabel: `Nieuwe rentevastperiode`,
      newInterestPeriodWithInterest: `met rente`,

      newInterestPeriods: [
        {
          label: `Variabele rente`,
          value: 0
        }, {
          label: `2 jaar`,
          value: 24
        }, {
          label: `5 jaar`,
          value: 60
        }, {
          label: `10 jaar`,
          value: 120
        }, {
          label: `15 jaar`,
          value: 180
        }, {
          label: `20 jaar`,
          value: 240
        }
      ],

      currentInterestPerMonth: `Huidige rente per maand`,
      currentInterestPerMonthGross: `bruto`,

      newInterestPerMonth: `Nieuwe rente per maand`,
      newInterestPerMonthGross: `bruto`
    },

    option2A: {
      headline: `Optie 2: rentemiddelen`,
      desc: `De omzettingskosten worden met een renteopslag doorberekend. De oude en nieuwe rente wordt 'gemiddeld'. Log in bij Mijn Aegon om uw nieuwe rente per maand te zien.`,
      learnMoreText: `Meer over rentemiddeling`,
      learnMoreUrl: `#`

    },
    option2B: {
      headline: `Optie 2: for Spaar and Overige`,
      desc: `Placeholder text for Spaar and Overige`
    },

    whatNextHeadline: `Hoe verder?`,
    whatNextDesc: `Als het aanpassen van uw hypotheekrente u interessant lijkt ga dan naar Mijn Aegon en download uw hypotheekrente opties als PDF`,

    learnMoreText: `Meer over de voor- en nadelen van de opties`,
    learnMoreUrl: `#`,

    goToMyAegon: `Ga naar Mijn Aegon`,

    calculationNotPossible: `Berekening niet mogelijk`,
    calculationNotPossibleDesc: `Het ingevoerde rentepercentage is lager dan de nu geldende marktrente. Het is daarom niet mogelijk om de omzettingskosten te berekenen. Controleer of u het juiste rentepercentage heeft ingevoerd.`,

    disclaimer: `* De uitkomst van deze berekening is een indicatie en kan u helpen bij de overweging om uw hypotheekrente aan te passen. Aan de berekening kunnen geen rechten worden ontleend.`
  },


};
