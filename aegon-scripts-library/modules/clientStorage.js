/*
 * Local storage wrapper
 *
 * Author: Antonio D'Angelo, antonio.dangelo@hcl.com
 *
 */

//create global namespace.
var clientStorage = (function() {
    var instance,
        debug = false;

    return {
        getInstance: function() {
            if(!instance) {
                instance = init();
            }
        }
    }

    function init() {
        return {

        }
    }

})();