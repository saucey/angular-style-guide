export const defaultOptions = {
  "title" : "Title Blue Block",
  "description" : "Description Blue Block",
  "caption" : "Bedragen zijn bruto per maand",
  "button" : {
    "label" : "Vraag offerte aan",
    "show" : true
  },
  "dipFixed" : [{
      "boxTitle" : "Ouderdomspensioen",
      "boxContent" : [{"label" : "Levenslang", "reference" : "lifelongMine"}]
    }, {
      "boxTitle" : "Partnerpensioen",
      "boxContent" : [{"label" : "Levenslang", "reference" : "lifelongPartner"}]
    } 
  ],
  "dipHighLow" : [{
      "boxTitle" : "Ouderdomspensioen",
      "boxContent" : [
        {"label" : "Eerste 5 jaar", "reference" : "first5YearsMine"},
        {"label" : "Na 5 jaar", "reference" : "after5YearsMine"}
      ]
    }, {
      "boxTitle" : "Partnerpensioen",
      "boxContent" : [{"label" : "Levenslang", "reference" : "lifelongPartner"}]
    } 
  ],
  "vpuVariable" : [{
      "boxTitle" : "Ouderdomspensioen",
      "boxContent" : [
        "Eerste jaar",
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
      "boxTitle" : "Partnerpensioen",
      "boxContent" : [
        "Eerste 5 jaar",
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
      "boxTitle" : "Ouderdomspensioen",
      "boxContent" : [
        "Eerste jaar",
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
      "boxTitle" : "Partnerpensioen",
      "boxContent" : [{"label" : "Levenslang", "reference" : "lifelongPartner"}]
    } 
  ],
  "template" : "dipFixed",
  "callServiceOnInit" : true,
  "serviceUrl" : "/services/US_RestGatewayWeb/rest/requestResponse/BS_PENSIOENOVEREENKOMST_ROA/calculate"
};