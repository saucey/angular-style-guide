export var defaultOptions = {
  /**
   * LAYOUT & TEXT
   */
  header: "Gratis e-book 'Beleggen voor beginners'",
  subheader: 'Tips en handleiding voor de beginnende belegger',
  title: 'Ontvang het gratis e-book',
  disclaimer: 'Aegon gaat vertrouwelijk om met jouw persoonsgegevens. Door dit formulier te verzenden geef je Aegon toestemming om jou telefonisch of per e-mail te benaderen voor marketingdoeleinden over beleggen.',
  button: 'Aanvragen',
  thanks: {
    title: 'Bedankt voor uw aanvraag!',
    line1: 'U ontvangt zo spoedig mogelijk een e-mail met het e-book.',
    line2: 'Kunt u niet wachten? Dan kunt u het e-book hieronder alvast downloaden.',
  },
  download: {
    text: 'Download e-book',
    url: 'https://www.aegon.nl/file/17849/download?token=elyU_klT'
  },
  /**
   * FORM POSTING
   */
  // Url to post form to; usually for all FormAssembly forms the same
  postUrl: '/particulier/forms/processor',
  // Friendly names for form fields; use the friendly name in your template,
  // and the real form name will be submitted
  fields : {
    aanhef: {
      name: 'tfa_141',
      dhr: 'Dhr.',
      mevr: 'Mevr.'
    },
    voorletters: {
      name: 'tfa_142',
      placeholder: 'Voorletters'
    },
    tussenvoegsel: {
      name: 'tfa_143',
      placeholder: 'Tussenvoegsel'
    },
    achternaam: {
      name: 'tfa_144',
      placeholder: 'Achternaam'
    },
    email: {
      name: 'tfa_145',
      placeholder: 'E-mail adres'
    },
    voorwaarden: {
      name: 'voorwaarden',
      text: 'Ik accepteer de voorwaarden'
    }
  },
  // Hidden form fields & values; use the actual values here
  // Key/values will be added to form post data automatically
  hiddenFields: {
    nid: 35973, // Drupal form node id. Get it from the form edit url in Drupal
    // ADDITIONAL HIDDEN FIELDS FOR FORM
    tfa_146: 'EBKBEGIN', // Herkomstcode
    tfa_test: 'TEST',
    tfa_147: function () {
      console.log('function', this);
      return new Date().getTime()
    }
  },
  form: {
    nid: 35973,
    mapping: {
      aanhef: 'tfa_141',
      voorletters: 'tfa_142',
      tussenvoegsel: 'tfa_143',
      achternaam: 'tfa_144',
      email: 'tfa_145',
      herkomstcode: 'tfa_146',
      datumtijd: 'tfa_147'
    }
  },
  /**
   * OPTIONS
   */
  xdemo: 2000,
};

// FORM ASSEMBLY META FIELDS; MOST CAN BE OMITTED SO WE DON'T SEND THEM
// tfa_dbFormId: '141', // not required
// tfa_dbTimeStarted: 1472040902, // not required
// tfa_dbVersionId: 7, // not required
// origin: 'particulier/formulier-angular-e-book', // not required
// build_id: 'unknown', // not required
// form_name: 'Angular e-book', // not required
// token: '395880098e3b41088d9416b7985b5748' // not required
