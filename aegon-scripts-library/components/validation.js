/**
 * @file
 * Example JavaScript component.
 */

// Closure with jQuery support.
(function ($, Drupal) {
  'use strict';

  // Add new item to public Drupal object.
  Drupal.behaviors.validation = {
    attach: function () {
      this.init();
      // Used to determine if this function has already run.
      this.attached = true;
    },
    attached: false,
    lastErrorObj: null,
    init: function () {
      var that = this;
      $("[data-validate], [data-validate-restrained]").each(function () {
        // Get the predefined validator from the json-object defined in data-validate.
        var v = (this.attributes['data-validate'] || this.attributes['data-validate-restrained']).value;
        var restrained = this.attributes['data-validate-restrained'] !== undefined;
        // Var iban = this.attributes['data-validate'].value === 'iban.nl';.
        var validator;

        // IBAN field logic.
        if (v === 'iban.nl') {
          $(this).on({
            // Dont allow user to use spaces.
            keydown: function (e) {
              if (e.which === 32) {
                return false;
              }
            },
            change: function () {
              this.value = this.value.replace(/\s/g, "");
            },
            // Convert string to uppercase & add spaces.
            blur: function () {
              var newVal,
                oldVal = this.value;

                // Removes all spaces.
                newVal = oldVal.replace(/\s+/g, '');

              if (newVal.length > 0) {
                // Convert value to uppercase.
                newVal = newVal.toUpperCase();
                // Add space after every 4th character.
                newVal = newVal.match(new RegExp('.{1,4}', 'g')).join(" ");
                this.value = newVal;
              }
              else {
                this.value = '';
              }
            },
            // Remove all spaces that we add on blur.
            focus: function () {
              this.value = this.value.replace(/\s+/g, '');
            }
          });
        }

        // Check if validator key is in the form ['key'], if not, it needs a . in front for eval.
        v = (v && v.length === 0) || v[0] === "[" ? v : "." + v;
        try {
          // If validator is empty, also throw an error; disable for jshint, since it appears not possible to smuggle js-code into js by way of code on the template, and the alternative of implementing this test is bazillions of lines long
          validator = eval("that.validators" + v) || (v.bla.bla); // jshint ignore:line
        }
        catch (e) {
          window.console && window.console.warn("error getting validator " + v + ". Maybe it was not defined?");
        }

        if (restrained) {
          this.oldValue = this.value;
          // Get the cursor position.
          this.oldPos = $(this).caret();
          $(this).on("keyup", that.restrain)
            .click(function () {this.oldPos = $(this).caret();
            });
        }

        // Makes the element where the last error occurred accessible as a static object.
        that.lastErrorObj = this;
        // React to different formats of validator.
        switch (typeof validator) {
          case "function":
            // Refers to the class initialized in validators2validVal.
            $(this).addClass("vv" + v);
            // Add convenience function for changing the error text pertaining to this object.
            this.errorText = function (text) {
              $("~ .errorText", this).html(text);
            };
            break;

          case "object":
            if (validator instanceof RegExp) {
              // Get rid of the / / around the pattern.
              validator = validator.source;
              // If there is already a pattern defined, this takes prevalence.
              this.pattern = this.pattern || validator;
            }
            break;
        }
      });

      this.validators2validVal();
    },
    restrain: function () {
      // [this] will be the DOM object this function has been grafted upon.
      var name = this.attributes['data-validate-restrained'].value;
      // Make the names work with vvValidators (aka, no [])
      var tmp = name.split(/(\.|(['"]\])?\[['"]|['"]\])/g);
      var names = [];
      for (var i = 0; i < tmp.length; i += 3) {
        if (tmp[i]) {
          names[names.length] = tmp[i];
        }
      }
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
      // Get the cursor position.
      this.oldPos = $(this).caret();
      this.oldValue = this.value;
    },

    testSelector: function (selector) {
      // Checks if querySelector is implemented and raises an error if not.
      if (!document.querySelector) {
        throw "Cannot test for selector " + selector + " because document.querySelector is not available.";
      }
      try {
        document.querySelector(selector);
      }
      catch (e) {
        return false;
      }
      return true;
    },

    test: function () {
      return this.testSelector("form:invalid");
    },
    // Fixes form validation for IE, using validVal, since :invalid is not implemented in IE.
    IEFix: function (form_selector, keyup) {
      // If the userAgent does not know the :invalid pseudoclass, we need the validation workaround provided by validVal.
      if (!this.test()) {
        return this.activate(form_selector, keyup);
      }
      return false;
    },
    otherFix: function (form_selector, keyup) {
      // Only activate, if required, aka if there is a validator required on the form that is a function.
      this.activate(form_selector, keyup);
    },
    activate: function (form_selector, keyup) {
      $(form_selector).validVal({
        validate: {
          // If checking is required in RealTime, this has to be true.
          onKeyup: keyup,
        },
        form: {
          onInvalid: function () {
          },  //turn off error alert on submit
        },
        customValidations: this.vvValidators,
      });
      return true;
    },
    validate: function (form_selector) {
      $(form_selector).trigger("validate");
    },
    invalid: function (form_selector) {
      // If (!this.test()) { //apply validaVal always, not just in IE9.
        this.validate(form_selector);
      // }.
      $(form_selector).find("input, select, textarea").removeClass("blurred").filter(":visible")
      // Add blurred, so that validation takes place on all visible elements.
        .addClass("blurred");
      try {
        return $(form_selector).find("input.invalid.blurred, select.invalid.blurred, textarea.invalid.blurred, select:invalid.blurred, textarea:invalid.blurred").length;
      }
      catch (e) {
        return $(form_selector).find("input.invalid.blurred, select.invalid.blurred, textarea.invalid.blurred").length;
      }
    },

    // Converts .validators into a straight format readable by validVal; nested validators become one key, aka a: {b: {c: /validator/}} becomes a.b.c = validator.
    vvValidators: {},
    validators2validVal: function (obj, path) {
      obj = obj || this.validators;
      path = path || ["vv"];
      if (typeof obj === "object") {
        if (obj instanceof RegExp) {
          this.vvValidators[path.join(".")] = obj;
        }
        // We just assume we are dealing with a RegExp.
        else {
          // Create the json path for this particular validator in this.validators.
          for (var o in obj) {
            if (o) {
              var nPath = [];
              // nPath = path won't work because it is interpreted as a pointer to the array, instead of a proper clone.
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

    // Nested validators are possible, enclose non - \w - names or JS-keywords in [''].
    validators: {
      zip: {
        nl: function (val) {
          var matt = val.match(/^\s*(\d{4})\s*([a-zA-Z]{2})\s*$/i);
          this.value = matt ? matt[1] + " " + matt[2].toUpperCase() : this.value;
          // this.errorText("bluuuuub");.
          return matt;
        },
      },
      iban: {
        rxs: {
          nl: /^NL\d\d[a-z0-9]{4}\d{10}$/i,
          de: /^DE\d\d\d{18}$/i,
        },
        nl: function (val) {return Drupal.behaviors.validation.validators.iban.fix(val, "nl");
        },
        de: function (val) {return Drupal.behaviors.validation.validators.iban.fix(val, "de");
        },
        auto: function (val) {
          // Get the country to relate to rxs.
          var country = val.replace(/^(..).*/, "$1").toLowerCase();
          return Drupal.behaviors.validation.validators.iban.fix(val, country);
        },
        fix: function (val, country) {
          // Turns a letter into a number, with a = 10, b = 11...
          var numberize = function (letter) {
              return "" + (letter.toLowerCase().charCodeAt(0) - 87);
          };
          // Needed for big-number (such as modified IBANs) modulo calculation.
          var bigMod = function (divident, divisor) {
              // Implementation taken from http://stackoverflow.com/questions/929910/modulo-in-javascript-large-number
              // based on http://www.devx.com/tips/Tip/39012
              var partLength = 10;

            while (divident.length > partLength) {
                var part = divident.substring(0, partLength);
                divident = (part % divisor) + divident.substring(partLength);
            }

              return divident % divisor;
          };
          // Defines the general sanity check for iban, aka modified(iban) % 97 == 1.
          var check = function (val) {
            // Move the four initial characters to the end of the string.
            var iban = val.replace(/^(..)(..)(.*)/, "$3$1$2");
            // Replace all letters by numbers, such that A = 10, B = 11...
            iban = iban.replace(/([a-z])/ig, numberize);
            return bigMod(iban, 97) === 1;
          };

          // Get rid of all space-related characters.
          val = val.replace(/\s/g, "");
          var rxs = Drupal.behaviors.validation.validators.iban.rxs;
          return val.match(rxs[country]) ? check(val, country) : false;
        },
      },
      integer: /^\d*$/,
      text: /^\w*$/,
      // ^([A-Z0-9_][\-A-Z0-9_\.]*@[A-Z0-9_][\-\.A-Z0-9_]+\.[A-Z]{2,8})?$/i.
      email: /^[A-Z0-9]([\w\.\-]*[A-Z0-9])*@([A-Z0-9]([\w\.\-]*[A-Z0-9]|[A-Z0-9])*\.)[A-Z]{2,}$/i,
      phone: function (val) {
        // This needs to be implemented as a function, since validVal has a problem with the following regex
        // Empty|Local numbers|International numbers.
        return val.match(/^(|(?:00)[1-9][0-9]{7,15}|(?:0)[1-7][0-9]{8})$/);
      },
      address: {
        global: /^[A-Za-z0-9 '.\-]*$/i,
      },
      mobile: {
        nl: function (val) {
          // Empty|Local numbers|International numbers.
          return val.match(/^(|(?:06)[1-9][0-9]{7}|(?:00)[1-9][0-9]{7,12})$/);
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
              // Val is the value of the form element
              // keyup indicates if the validation was triggered on keyup (which is helpful if on keyup needs different behaviour than on blur or on submit)
              validation: function (val, keyup) {
                // Just use any error condition here.
                if (val.match(/^\d+$/i)) {
                  // Any kind of code here.
                  console.dir(this);

                  // Does not trigger the error behaviour.
                  return true;
                }
                else {

                  if (keyup) {
                    console.log("error was triggered on keyup, not on blur");
                    // The error was triggered on keyup, not on blur.
                  }
                  // Any kind of error treatment code here.
                  console.log(val);
                  // Convenience function, writes an error message different from the one predefined in the .errorText DOM object on the template.
                  this.errorText("bluuuuub");

                  // Triggers the error behaviour.
                  return false;
                }
              },
            },
          },
        }
      },
    }
  };

})(this.jQuery, this.Drupal);
