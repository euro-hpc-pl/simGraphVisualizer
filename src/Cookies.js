/**
 * Namespace object for cookie operations.
 * @namespace Cookie
 */
var Cookie = {};

/**
 * Sets a cookie with the specified name, value, and options.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {Object} options - The options for the cookie.
 */
Cookie.set = (name, value, options) => {
    const opts = {
        path: "/",
        ...options
    };

    if (navigator.cookieEnabled) { //czy ciasteczka są włączone
        const cookieName = encodeURIComponent(name);
        const cookieVal = encodeURIComponent(value);
        let cookieText = cookieName + "=" + cookieVal;

        if (opts.days && typeof opts.days === "number") {
            const data = new Date();
            data.setTime(data.getTime() + (opts.days * 24*60*60*1000));
            cookieText += "; expires=" + data.toUTCString();
        }

        if (opts.path) {
            cookieText += "; path=" + opts.path;
        }
        if (opts.domain) {
            cookieText += "; domain=" + opts.domain;
        }
        if (opts.secure) {
            cookieText += "; secure";
        }

        window.document.cookie = cookieText;
    }
};


/**
 * Gets the value of a cookie with the specified name.
 * @param {string} name - The name of the cookie.
 * @returns {string|undefined} The value of the cookie, or `undefined` if not found.
 */
Cookie.get = (name) => {
    if (window.document.cookie !== "") {
        const cookies = window.document.cookie.split(/; */);

        for (let cookie of cookies) {
            const [ cookieName, cookieVal ] = cookie.split("=");
            if (cookieName === decodeURIComponent(name)) {
                return decodeURIComponent(cookieVal);
            }
        }
    }

    return undefined;
};

/**
 * Deletes a cookie with the specified name and options.
 * @param {string} name - The name of the cookie.
 * @param {Object} options - The options for the cookie.
 */
Cookie.delete = (name, options) => {
    const opts = {
        path: "/",
        ...options
    };

    const cookieName = encodeURIComponent(name);
    let cookieText = cookieName + "=";
    if (opts.path) {
        cookieText += "; path=" + opts.path;
    }
    cookieText += "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = cookieText;
};
