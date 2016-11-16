export const defaultOptions = {
  start: {
    url: '/page-to-redirect-when-no-session-storage',
    redirect: false
  },  
  subtitle: "Vul hieronder uw gegevens in. U ontvangt dan van ons een offerte per mail.",
  termsTitle: "Voorwaarden offerte aanvraag",
  termsList: [
    "U heeft als werknemer een pensioenkapitaal opgebouwd.",
    "Het vrijgekomen bedrag is €25.000 of hoger.",
    "De pensioenuitkering moet uiterlijk over 3 maanden ingaan."
  ],
  yourDataTitle: "Uw gegevens",
  yourDataText: "Na het versturen van uw aanvraag ontvangt de offerte binnen 5 dagen per brief bij u thuis. Uw adviseur neemt later contact met u op en kijkt samen met u wat het beste bij u past. Daarna kunt u een afspraak maken voor een persoonlijk gesprek.",
  values: {
    pensionLocation: ['Bij Aegon', 'Niet bij Aegon', 'Aegon en elders']
  },
  sticky: {
    title: 'Samenvatting',
    helpers: {
      grossPerMonth: 'Bedragen bruto per maand'
    },
    labels: {
      pension: ['Pensioenuitkering', 'Partnerpensioenuitkering'],
      pensionProduct: 'Uitkerend pensioenproduct',
      pensionAmount: 'Opgebouwd pensioenkapitaal',
      pensionLocation: 'Pensioen opgebouwd',
      pensionPartner: 'Pensioen partner',
      startingDate: 'Startdatum uitkering',
      birthDate: 'Geboortedatum',
      birthDateOfPartner: 'Geboortedatum partner'
    },
    link: {
      text: 'Uw gegevens aanpassen',
      url: '/link-to-edit'
    }
  }
}