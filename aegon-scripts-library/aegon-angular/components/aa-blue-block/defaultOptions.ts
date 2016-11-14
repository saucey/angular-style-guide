export const defaultOptions = {
  "title" : "Title Blue Block",
  "description" : "Description Blue Block",
  "caption" : "Bedragen zijn bruto per maand",
  "button" : {
    "label" : "Vraag offerte aan",
    "show" : false,
    "forceShow" : false,
    "url" : "/",
    "saveDataOnClick" : {
      "enabled" : false,
      "key" : "pensionProduct"
    }
  },
  "dipFixed" : [{
      "fixedRowsHeight" : 2,
      "showRules" : {
        "alwaysShow" : false,
        "onInit" : false,
        "dataReference" : "lifelongMine"
      },
      "boxTitle" : "Ouderdomspensioen",
      "boxContent" : [{"label" : "Levenslang", "reference" : "lifelongMine"}]
    }, {
      "showRules" : {
        "alwaysShow" : false,
        "onInit" : false,
        "dataReference" : "lifelongPartner"
      },
      "boxTitle" : "Partnerpensioen",
      "boxContent" : [{"label" : "Levenslang", "reference" : "lifelongPartner"}]
    } 
  ],
  "dipHighLow" : [{
      "fixedRowsHeight" : 2,
      "showRules" : {
        "alwaysShow" : false,
        "onInit" : false,
        "dataReference" : "first5YearsMine"
      },
      "boxTitle" : "Ouderdomspensioen",
      "boxContent" : [
        {"label" : "Eerste 5 jaar", "reference" : "first5YearsMine"},
        {"label" : "Na 5 jaar", "reference" : "after5YearsMine"}
      ]
    }, {
      "showRules" : {
        "alwaysShow" : false,
        "onInit" : false,
        "dataReference" : "lifelongPartner"
      },
      "boxTitle" : "Partnerpensioen",
      "boxContent" : [{"label" : "Levenslang", "reference" : "lifelongPartner"}]
    } 
  ],
  "vpuVariable" : [{
      "showRules" : {
        "alwaysShow" : false,
        "onInit" : false,
        "dataReference" : "optimisticMine"
      },
      "boxTitle" : "Ouderdomspensioen",
      "boxContent" : [
        {"label" : "Eerste jaar", "reference" : "firstYearsMine"},
        { 
          "subBoxTitle" : "Na 10 jaar",
          "subBoxContent" : [
            {"label" : "Optimistisch", "reference" : "optimisticMine"},
            {"label" : "Neutraal", "reference" : "neutralMine"},
            {"label" : "Pessimistisch", "reference" : "pessimisticMine"}
           ] 
        }
      ]
    }, {
      "showRules" : {
        "alwaysShow" : false,
        "onInit" : false,
        "dataReference" : "optimisticPartner"
      },
      "boxTitle" : "Partnerpensioen",
      "boxContent" : [
        {"label" : "Eerste jaar", "reference" : "firstYearsPartner"},
        { 
          "subBoxTitle" : "Na 10 jaar",
          "subBoxContent" : [
            {"label" : "Optimistisch", "reference" : "optimisticPartner"},
            {"label" : "Neutraal", "reference" : "neutralPartner"},
            {"label" : "Pessimistisch", "reference" : "pessimisticPartner"}
          ] 
        }
      ]
    } 
  ],
  "vpuFixed" : [{
      "showRules" : {
        "alwaysShow" : false,
        "onInit" : false,
        "dataReference" : "optimisticMine"
      },
      "boxTitle" : "Ouderdomspensioen",
      "boxContent" : [
        {"label" : "Eerste jaar", "reference" : "firstYearsMine"},
        { 
          "subBoxTitle" : "Na 10 jaar",
          "subBoxContent" : [
            {"label" : "Optimistisch", "reference" : "optimisticMine"},
            {"label" : "Neutraal", "reference" : "neutralMine"},
            {"label" : "Pessimistisch", "reference" : "pessimisticMine"}
          ] 
        }
      ]
    }, {
      "showRules" : {
        "alwaysShow" : false,
        "onInit" : false,
        "dataReference" : "lifelongPartner"
      },
      "boxTitle" : "Partnerpensioen",
      "boxContent" : [{"label" : "Levenslang", "reference" : "lifelongPartner"}]
    } 
  ],
  "template" : "dipFixed",
  "callServiceOnInit" : true,
  "serviceUrl" : "/services/US_RestGatewayWeb/rest/requestResponse/BS_PENSIOENOVEREENKOMST_ROA/calculate",
  "serviceCredentials": "FILL_ME_IN_AA_DATA",
  "serviceErrorHandler" : {
    "enabled" : true,
    "message" : "Service niet beschikbaar, probeer het later opnieuw."
  }
};