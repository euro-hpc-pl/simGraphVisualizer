/* global Cookie */

/**
 * Namespace object for application settings.
 * @namespace Settings
 */
var Settings = {};

if (typeof window.api==='undefined') {
    /**
     * Gets the value of a setting with the specified key using cookies.
     * @param {string} key - The key of the setting.
     * @returns {string|undefined} The value of the setting, or `undefined` if not found.
     */
    Settings.get = (key) => {
        return Cookie.get(key);
    };

    /**
     * Sets multiple settings using cookies.
     * @param {Object} pairs - The key-value pairs of settings to be set.
     */
    Settings.set = (pairs) => {
        for (let key in pairs) {
            Cookie.set(key, pairs[key]);
        }
    };
} else {
    console.log("Settings in desktopApp!");

    /**
     * Gets the value of a setting with the specified key using the desktop app API.
     * @param {string} key - The key of the setting.
     * @returns {Promise} A promise that resolves to the value of the setting.
     */
    Settings.get = (key) => {
        return window.api.invoke("getSetting",key);
    };

    /**
     * Sets multiple settings using the desktop app API.
     * @param {Object} pairs - The key-value pairs of settings to be set.
     */
    Settings.set = (pairs) => {
        window.api.invoke("setSettings", pairs);
    };
}
