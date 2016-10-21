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
      "boxContent" : ["Levenslang"]
    }, {
      "boxTitle" : "Partnerpensioen",
      "boxContent" : ["Levenslang"]
    } 
  ],
  "dipHighLow" : [{
      "boxTitle" : "Ouderdomspensioen",
      "boxContent" : ["Eerste 5 jaar", "Na 5 jaar"]
    }, {
      "boxTitle" : "Partnerpensioen",
      "boxContent" : ["Levenslang"]
    } 
  ],
  "vpuVariable" : [{
      "boxTitle" : "Ouderdomspensioen",
      "boxContent" : [
        "Eerste jaar",
        { 
          "subBoxTitle" : "Na 10 jaar",
          "subBoxContent" : ["Optimistisch", "Neutraal", "Pessimistisch"] 
        }
      ]
    }, {
      "boxTitle" : "Partnerpensioen",
      "boxContent" : [
        "Eerste 5 jaar",
        { 
          "subBoxTitle" : "Na 10 jaar",
          "subBoxContent" : ["Optimistisch", "Neutraal", "Pessimistisch"] 
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
          "subBoxContent" : ["Optimistisch", "Neutraal", "Pessimistisch"] 
        }
      ]
    }, {
      "boxTitle" : "Partnerpensioen",
      "boxContent" : ["Levenslang"]
    } 
  ],
  "template" : "vpuVariable"
};