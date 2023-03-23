var Settings = {};

if (typeof window.api==='undefined') {
    Settings.get = (key) => {
        return Cookie.get(key);
    };
    Settings.set = (pairs) => {
        for (let key in pairs) {
            Cookie.set(key, pairs[key]);
        }
    };
} else {
    console.log("Settings in desktopApp!");
    Settings.get = (key) => {
        return window.api.invoke("getSetting",key);
    };
    Settings.set = (pairs) => {
        window.api.invoke("setSettings", pairs);
    };
}
