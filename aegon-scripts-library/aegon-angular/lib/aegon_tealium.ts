/**
 * Checks if utag and utag_data exist
 * and triggers tealium functions.
 * 
 * @param data {Object}: an object with the tealium variables.

 */
export function aegonTealium (data: Object): void {
  // Merge properties with global utag_data object when available.
  var opt = [
      "page_cat_1_type",
      "page_cat_2_name",
      "page_cat_3_section",
      "page_cat_4_productgroup",
      "page_cat_5_product",
      "page_cat_6_businessline"
  ];

  if (typeof utag_data === 'object') {
      for(let i=0;i<opt.length;i++) {
          if (!data.hasOwnProperty(opt[i])) {
              if (utag_data.hasOwnProperty(opt[i]) && utag_data[opt[i]] !== "" ) {
                  data[opt[i]] = utag_data[opt[i]];
              }
          }
      }
  }    
  // Check if utag can be used.
  if(typeof utag === 'object' && typeof utag.view === 'function') {
    // Triggers event.
    utag.view(data);
  } else {
    // Give some time to load as it is asynchronous.
    setTimeout(() => { 
      if (typeof utag === 'object' && typeof utag.view === 'function') {
        utag.view(data);
      }
    }, 1600);
  }
}