export const defaultOptions = {
  start: {
    url: '/page-to-redirect-when-no-session-storage',
    redirect: false
  },  
  subtitle: "Vul hieronder uw gegevens in. U ontvangt dan van ons een offerte per mail.",
  termsTitle: "Voorwaarden offerte aanvraag",
  termsList: false,
  yourDataTitle: "Uw gegevens",
  yourDataText: "Na het versturen van uw aanvraag ontvangt de offerte binnen 5 dagen per brief bij u thuis. Uw adviseur neemt later contact met u op en kijkt samen met u wat het beste bij u past. Daarna kunt u een afspraak maken voor een persoonlijk gesprek.",
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
    values: {
      pensionLocation: ['Bij Aegon', 'Niet bij Aegon', 'Aegon en elders']
    },
    link: {
      text: 'Uw gegevens aanpassen',
      url: '/link-to-edit'
    }
  },
  form : {
    name: 'form_name',
    redirectUrl: '/template-aa-pension-offer-confirmation.html',
    inputList: [
      {
        label: 'Aanhef',
        inputs: [
          { width: 4, type: 'radio', name: 'titel', required: true, value: 'Heer', label: 'Heer' },
          { width: 6, type: 'radio', name: 'titel', required: true, value: 'Mevrouw', label: 'Mevrouw' }
        ]
      },
      {
        label: 'Voorletters',
        inputs: [
          { width: 3, type: 'text', placeholder: '', name: 'voorl', required: true, pattern: '[a-zA-Z]+', value: '', error: 'Error message', storage: false }
        ]
      },
      {
        label: 'Tussenvoegsel',
        inputs: [
          { width: 3, type: 'text', placeholder: '', name: 'voorv', pattern: '[a-zA-Z]+', value: '', error: 'Error message', storage: false }
        ]
      },
      {
        label: 'Achternaam',
        inputs: [
          { width: 7, type: 'text', placeholder: '', name: 'anaam', required: true, pattern: '[a-zA-Z]+', value: '', error: 'Error message', storage: false }
        ]
      },
      {
        label: 'Postcode',
        inputs: [
          { width: 5, type: 'text', placeholder: '', name: 'pcode', required: true, pattern: '[a-zA-Z]+', value: '', error: 'Error message', storage: false }
        ]
      },
      {
        label: 'Huisnummer- en toevoeging',
        inputs: [
          { width: 3, type: 'text', placeholder: '', name: 'huisnr', required: true, pattern: '[a-zA-Z]+', value: '', error: 'Error message', storage: false },
          { width: 3, type: 'text', placeholder: '', name: 'toevoeg', required: false, pattern: '[a-zA-Z]+', value: '', error: 'Error message', storage: false }
        ]
      },
      {
        label: 'Straat',
        inputs: [
          { width: 7, type: 'text', placeholder: '', name: 'straat', required: true, pattern: '[a-zA-Z]+', value: '', error: 'Error message', storage: false }
        ]
      },
      {
        label: 'Plaats',
        inputs: [
          { width: 7, type: 'text', placeholder: '', name: 'plaats', required: true, pattern: '[a-zA-Z]+', value: '', error: 'Error message', storage: false }
        ]
      },
      {
        label: 'Telefoonummer',
        inputs: [
          { width: 7, type: 'text', placeholder: '', name: 'telnum', required: true, pattern: '[0-9]+', value: '', error: 'Error message', storage: false }
        ]
      },
      {
        label: 'E-mailadres',
        inputs: [
          { width: 7, type: 'email', placeholder: '', name: 'to', required: true,  value: '', error: 'Error message', storage: false }
        ]
      },
      { type: 'hidden', name: 'nascosto', value: 'ciao', storage: {type: 'session', object: 'obj', key: 'k'} }
    ],
    submitButton: {
      serviceUrl: 'https://www.test.aegon.nl/data/thund/thund/dip',
      label: 'Verzenden'
    }
  }
}