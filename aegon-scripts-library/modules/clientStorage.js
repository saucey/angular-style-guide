/*
 * Local storage wrapper
 *
 * Author: Antonio D'Angelo, antonio.dangelo@hcl.com
 *
 */

clientStorage = (function() {
    var instance,
        options = {
            // Encoding is available only for Local and Session storage
            "encoding": true,
            // Experimental: It will encode also the key
            "fullEncoded" : false
        },
        // Create Base64 Object - IE9 support
        Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}},
        base64Pattern = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;

    return {
        getInstance: function(opt) {
            if(!instance) {
                instance = init(opt);
            }
            return instance;
        }
    };

    function extend() {
        // Variables
        var extended = {};
        var deep = false;
        var i = 0;
        var length = arguments.length;

        // Check if a deep merge
        if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
            deep = arguments[0];
            i++;
        }

        // Merge the object into the extended object
        var merge = function (obj) {
            for ( var prop in obj ) {
                if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                    // If deep merge and property is an object, merge properties
                    if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                        extended[prop] = extend( true, extended[prop], obj[prop] );
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        // Loop through each object and conduct a merge
        for ( ; i < length; i++ ) {
            var obj = arguments[i];
            merge(obj);
        }

        return extended;

    };

    function isEncoded(str) {
        return base64Pattern.test(str);
    };

    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    function encode(val) {
        return Base64.encode(val);
    };

    function decode(val) {
        return Base64.decode(val);
    };

    function innerGetItem(storage, keyName) {
        var key = keyName;

        if(options.encoding && options.fullEncoded) {
            key = encode(keyName);
        }

        var item = storage.getItem(key) || "";

        if(isEncoded(item)) {
            item = decode(item);
        }

        if(isJson(item)) {
            item = JSON.parse(item);
        }

        return item;
    }

    function innerSetItem(storage, keyName, value, forceEncoding) {
        var key = keyName,
            item = value;

        item = JSON.stringify(item);

        if(options.encoding || forceEncoding) {
            item = encode(item);
            if(options.fullEncoded) {
                key = encode(keyName);
            }
        }

        try {
            storage.setItem(key, item);
        } catch (e) {
            console.error('Quota exceeded!', e); //data wasn't successfully saved due to quota exceed so throw an error
            return false;
        }

        return true;
    }

    function innerRemoveItem(storage, keyName) {
        var key = keyName;

        if(options.encoding && options.fullEncoded) {
            key = encode(keyName);
        }

        storage.removeItem(key);
    }

    function innerClear(storage) {
        storage.clear();
    }

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + ((Number.parseInt(exdays)||2000)*24*60*60*1000));

        var expires = "expires="+d.toUTCString();
        if(typeof cvalue ==='object') {
            cvalue = JSON.stringify(cvalue);
        }
        cvalue = encodeURIComponent(cvalue);
        document.cookie = cname + "=" + cvalue + "; " + expires;

        return true;
    }

    function getCookie(cname) {
        var name = cname + "=",
            ca = document.cookie.split(';');

        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                var item = decodeURIComponent(c.substring(name.length, c.length));
                if(isJson(item)) {
                    item = JSON.parse(item);
                }
                return item;
            }
        }
        return "";
    }

    function removeCookie(cname) {
        setCookie(cname, "", -1);
    }

    function deleteAllCookies() {
        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }
    
    function init(opt) {
        options = extend(true, options, opt);
        return {
            "session": {
                "length": sessionStorage.length,
                "key": function(_key) {
                    return sessionStorage.key(_key);
                },
                "getItem": function(_keyName) {
                    return innerGetItem(sessionStorage, _keyName);
                },
                "setItem": function(_key, _value) {
                    return innerSetItem(sessionStorage, _key, _value)
                },
                "removeItem": function(_key) {
                    return innerRemoveItem(sessionStorage, _key);
                },
                "clearStorage": function() {
                    return innerClear(sessionStorage);
                }

            },
            "local": {
                "length": sessionStorage.length,
                "key": function(_key) {
                    return localStorage.key(_key);
                },
                "getItem": function(_keyName) {
                    return innerGetItem(localStorage, _keyName);
                },
                "setItem": function(_key, _value) {
                    return innerSetItem(localStorage, _key, _value)
                },
                "removeItem": function(_key) {
                    return innerRemoveItem(localStorage, _key);
                },
                "clearStorage": function() {
                    return innerClear(localStorage);
                }
            },
            "cookie": {
                "length": document.cookie.split(";").length,
                "key": function(_key) {
                    return ((document.cookie.split(";") || []) [_key] || "=").split("=")[0];
                },
                "getItem": function(_keyName) {
                    return getCookie(_keyName);
                },
                "setItem": function(_key, _value, _exp_date) {
                    return setCookie(_key, _value, _exp_date);
                },
                "removeItem": function(_key) {
                    return removeCookie(_key);
                },
                "clearStorage": function() {
                    return deleteAllCookies();
                }
            }
        }
    }
})();

