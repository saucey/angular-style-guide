export const defaultOptions = {
  annuityInterestDefault: 0.05,
  annuityInterests: [],
  interests: [],
  income: {
    'initial': 2500,
    'min': 200,
    'p25': 1000,
    'p50': 2000,
    'p75': 3000,
    'max': 7500
  },
  incomePartner: {
    'initial': 0,
    'min': 0,
    'p25': 1000,
    'p50': 2000,
    'p75': 3000,
    'max': 7500
  },
  interestYears: {
    'initial': 2,
    'min': 2,
    'p25': 5,
    'p50': 10,
    'p75': 15,
    'max': 28    
  },

  
  title: 'Bereken uw maximale hypotheek',
  
  incomeLabel: 'Vul hier uw bruto maandinkomen in',
  incomeHelpText: 'Dit is uw maandelijkse bruto inkomen exclusief uw vakantiegeld en eventuele dertiende maand.',
  incomeExtraMonthLabel: 'Vaste 13e maand',
  incomeVacationMoneyLabel: 'Vakantiegeld',

  incomePartnerLabel: 'Vul hier het bruto inkomen van uw partner in',
  incomePartnerHelpText: 'Dit is het maandelijkse bruto inkomen van uw partner exclusief vakantiegeld en eventuele dertiende maand.',
  incomePartnerExtraMonthLabel: 'Vaste 13e maand',
  incomePartnerVacationMoneyLabel: 'Vakantiegeld',  

  interestYearsLabel: 'Kies uw rentevaste periode',
  interestYearsHelpText: 'U zet bij het afsluiten van uw hypotheek het rentepercentage voor een bepaalde periode vast. Dit heet de rentevaste periode. Wanneer de rentevaste periode voorbij is, kiest u opnieuw hoe lang u uw rente wilt vastzetten.',

  playWithMortgageLabel: 'Bereken uw maandlasten bij een lagere hypotheek',
  playValueLabel: 'Uw maximale hypotheek',
  playValueHelpText: 'Vul het hypotheekbedrag in dat u wilt lenen. Zo berekent u wat uw bruto maandlasten zijn bij een lager bedrag dan uw maximale hypotheek.',

  mortgageValueTitle: 'Hypotheekbedrag',
  monthlyPaymentTitle: 'Bruto maandlasten',
  ctaButtonText: 'Bekijk de adviesmogelijkheden',
  ctaButtonUrl: '/particulier/hypotheek/hypotheekadvies'
};