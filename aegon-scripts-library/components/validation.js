/**
 * Example JavaScript component
 */
// Closure with jQuery support
(function($, Drupal) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.validation = {
    attach: function () {
      this.init();
      this.attached = true;  //used to determine if this function has already run
    },
    attached: false,
    lastErrorObj: null,
    init: function () {
      var that = this;
      $("[data-validate], [data-validate-restrained]").each( function () {
        // get the predefined validator from the json-object defined in data-validate
        var v = (this.attributes['data-validate'] || this.attributes['data-validate-restrained']).value;
        var restrained = this.attributes['data-validate-restrained'] !== undefined;
        var validator;
        // check if validator key is in the form ['key'], if not, it needs a . in front for eval
        v = (v && v.length === 0) || v[0] === "[" ? v : "." + v;
        try {
          // if validator is empty, also throw an error; disable for jshint, since it appears not possible to smuggle js-code into js by way of code on the template, and the alternative of implementing this test is bazillions of lines long
          validator = eval("that.validators" + v) || (v.bla.bla); // jshint ignore:line
        }
        catch (e) {
          window.console && window.console.warn("error getting validator " + v + ". Maybe it was not defined?");
        }

        if (restrained) {
          this.oldValue = this.value;
          this.oldPos = $(this).caret();  //get the cursor position
          $(this).on("keyup", that.restrain)
            .click(function () {this.oldPos = $(this).caret(); });
        }
        
        // makes the element where the last error occurred accessible as a static object
        that.lastErrorObj = this;
        // react to different formats of validator
        switch (typeof validator) {
          case "function":
            // refers to the class initialized in validators2validVal
            $(this).addClass("vv" + v);
            // add convenience function for changing the error text pertaining to this object
            this.errorText = function (text) {
              $("~ .errorText", this).html(text);
            };
            break;
          case "object":
            if (validator instanceof RegExp) {
              // get rid of the / / around the pattern
              validator = validator.source;
              // if there is already a pattern defined, this takes prevalence
              this.pattern = this.pattern || validator;
            }
            break;
        }
      });

      this.validators2validVal();
    },
    restrain: function () {
      // [this] will be the DOM object this function has been grafted upon
      var name = this.attributes['data-validate-restrained'].value;
      // make the names work with vvValidators (aka, no [])
      var tmp = name.split(/(\.|(['"]\])?\[['"]|['"]\])/g);
      var names = [];
      for (var i = 0; i < tmp.length; i+=3) {if (tmp[i]) {names[names.length] = tmp[i];}}
      var validator = Drupal.behaviors.validation.vvValidators["vv." + names.join(".")];
      if (validator instanceof RegExp) {
        if (!validator.test(this.value)) {
          this.value = this.oldValue;
          $(this).caret(this.oldPos);
        }
      }
      else {
        if (!validator(this.value)) {
          this.value = this.oldValue;
          $(this).caret(this.oldPos);
        }
      }
      this.oldPos = $(this).caret();  //get the cursor position
      this.oldValue = this.value;
    },

    testSelector: function (selector) {
      if (!document.querySelector) {    //checks if querySelector is implemented and raises an error if not
        throw "Cannot test for selector " + selector + " because document.querySelector is not available.";
      }
      try {document.querySelector(selector);} catch (e) {return false;}
      return true;
    },

    test: function () {
      return this.testSelector("form:invalid");
    },
    // fixes form validation for IE, using validVal, since :invalid is not implemented in IE
    IEFix: function (form_selector, keyup) {
      if (!this.test()) {  //if the userAgent does not know the :invalid pseudoclass, we need the validation workaround provided by validVal
        return this.activate(form_selector, keyup);
      }
      return false;
    },
    otherFix: function (form_selector, keyup) {
      //only activate, if required, aka if there is a validator required on the form that is a function
      this.activate(form_selector, keyup);
    },
    activate: function (form_selector, keyup) {
      $(form_selector).validVal({
        validate: {
          onKeyup: keyup, //if checking is required in RealTime, this has to be true
        },
        form: {
          onInvalid: function () {},  //turn off error alert on submit
        },
        customValidations: this.vvValidators,
      });
      return true;
    },
    validate: function (form_selector) {
      $(form_selector).trigger( "validate" );
    },
    invalid: function (form_selector) {
      //if (!this.test()) { //apply validaVal always, not just in IE9
        this.validate(form_selector);
      //}
      $(form_selector).find("input, select, textarea").removeClass("blurred").filter(":visible")
      // add blurred, so that validation takes place on all visible elements
        .addClass("blurred");
      try {
        return $(form_selector).find("input.invalid.blurred, select.invalid.blurred, textarea.invalid.blurred, input:invalid.blurred, select:invalid.blurred, textarea:invalid.blurred").length;
      }
      catch (e) {
        return $(form_selector).find("input.invalid.blurred, select.invalid.blurred, textarea.invalid.blurred").length;        
      }
    },

    // converts .validators into a straight format readable by validVal; nested validators become one key, aka a: {b: {c: /validator/}} becomes a.b.c = validator
    vvValidators: {},
    validators2validVal: function (obj, path) {
      obj = obj || this.validators;
      path = path || ["vv"];
      if (typeof obj === "object") {
        if (obj instanceof RegExp) {
          this.vvValidators[path.join(".")] = obj;
        }
        else {  // we just assume we are dealing with a RegExp
          // create the json path for this particular validator in this.validators
          for (var o in obj) {
            if (o) {
              var nPath = [];
              // nPath = path won't work because it is interpreted as a pointer to the array, instead of a proper clone
              for (var i = 0; i < path.length; i++) {
                nPath.push(path[i]);
              }
              nPath.push(o);

              this.validators2validVal(obj[o], nPath);
            }
          }
        }
      }
      else {
        this.vvValidators[path.join(".")] = obj;
      }
    },

    // nested validators are possible, enclose non - \w - names or JS-keywords in ['']
    validators: {
      zip: {
        nl: function (val) {
          var matt = val.match(/^\s*(\d{4})\s*([a-zA-Z]{2})\s*$/i);
          this.value = matt ? matt[1] + " " + matt[2].toUpperCase() : this.value;
          // this.errorText("bluuuuub");
          return matt;
        },
      },
      iban: {
        rxs: {
          nl: /^NL\d\d[a-z0-9]{4}\d{10}$/i,
          de: /^DE\d\d\d{18}$/i,
        },
        nl: function (val) {return Drupal.behaviors.validation.validators.iban.fix(val, "nl");},
        de: function (val) {return Drupal.behaviors.validation.validators.iban.fix(val, "de");},
        auto: function (val) {
          var country = val.replace(/^(..).*/, "$1").toLowerCase();  // get the country to relate to rxs
          return Drupal.behaviors.validation.validators.iban.fix(val, country);
        },
        fix: function (val, country) { 
          var numberize = function (letter) { // turns a letter into a number, with a = 10, b = 11...
              return "" + (letter.toLowerCase().charCodeAt(0) - 87);
          };
          var bigMod = function(divident, divisor) {  // needed for big-number (such as modified IBANs) modulo calculation
              // implementation taken from http://stackoverflow.com/questions/929910/modulo-in-javascript-large-number
              // based on http://www.devx.com/tips/Tip/39012
              var partLength = 10;

              while (divident.length > partLength) {
                  var part = divident.substring(0, partLength);
                  divident = (part % divisor) +  divident.substring(partLength);          
              }

              return divident % divisor;
          };
          var check = function (val) { // defines the general sanity check for iban, aka modified(iban) % 97 == 1
            var iban = val.replace(/^(..)(..)(.*)/, "$3$1$2"); // Move the four initial characters to the end of the string
            iban = iban.replace(/([a-z])/ig, numberize); // replace all letters by numbers, such that A = 10, B = 11... 
            return bigMod(iban, 97) === 1;
          };

          val = val.replace(/\s/g, "");  // get rid of all space-related characters
          var rxs = Drupal.behaviors.validation.validators.iban.rxs;
          return val.match(rxs[country]) ? check(val, country) : false;
        },
      },
      integer: /^\d*$/,
      text: /^\w*$/,
      email: /^[A-Z0-9]([\w\.\-]*[A-Z0-9])*@([A-Z0-9]([\w\.\-]*[A-Z0-9]|[A-Z0-9])*\.)[A-Z]{2,}$/i,  ///^([A-Z0-9_][\-A-Z0-9_\.]*@[A-Z0-9_][\-\.A-Z0-9_]+\.[A-Z]{2,8})?$/i
      phone: function (val) {
        // this needs to be implemented as a function, since validVal has a problem with the following regex
        return val.match(/^(|(\+|0{1,2})[1-9][.\- \d]*\d+)$/); // this assumes that there cannot be phone numbers in an international format with less than 3 characters, which should be reasonable...
      },
      address: {
        global: /^[A-Za-z0-9 '.\-]*$/i,
      },
      mobile: {
        nl: function (val) {
          return val.match(/^(|(06)[1-9][0-9]{7})$/);
        },
      },
      'house-nr': function (val) {
        return val.match(/^[a-z0-9\.]*$/i);
      },
      example: {
        'for': {
          a: {
            regex: {
              validation: /^.*$/,
            },
            'function': {
              // val is the value of the form element
              // keyup indicates if the validation was triggered on keyup (which is helpful if on keyup needs different behaviour than on blur or on submit)
              validation: function (val, keyup) {
                if (val.match(/^\d+$/i)) {  //just use any error condition here
                  console.dir(this);  //any kind of code here
                  
                  return true;  //does not trigger the error behaviour
                }
                else {
                  
                  if (keyup) {
                    console.log("error was triggered on keyup, not on blur");
                    //the error was triggered on keyup, not on blur
                  }
                  console.log(val); //any kind of error treatment code here
                  this.errorText("bluuuuub");  // convenience function, writes an error message different from the one predefined in the .errorText DOM object on the template
                  
                  return false; //triggers the error behaviour
                }
              },
            },
          },
        }
      },
    }
  };

})(this.jQuery, this.Drupal);
