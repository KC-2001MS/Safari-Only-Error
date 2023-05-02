// List of exceptions (exceptions or blacklist). This must be a complete domain or subdomain.
var g_exceptions = [];
var g_isEnabled = true;
var g_isWhitelist = true;

var c_enabledIcons = {
    16: "images/enabled_toolbar-icon/toolbar-icon-16a.png",
    19: "images/enabled_toolbar-icon/toolbar-icon-19a.png",
    32: "images/enabled_toolbar-icon/toolbar-icon-32a.png",
    38: "images/enabled_toolbar-icon/toolbar-icon-38a.png",
    48: "images/enabled_toolbar-icon/toolbar-icon-48a.png",
    72: "images/enabled_toolbar-icon/toolbar-icon-72a.png"
};
var c_disabledIcons = {
    16: "images/disabled_toolbar-icon/toolbar-icon-16d.png",
    19: "images/disabled_toolbar-icon/toolbar-icon-19d.png",
    32: "images/disabled_toolbar-icon/toolbar-icon-32d.png",
    38: "images/disabled_toolbar-icon/toolbar-icon-38d.png",
    48: "images/disabled_toolbar-icon/toolbar-icon-48d.png",
    72: "images/disabled_toolbar-icon/toolbar-icon-72d.png"
};

function updateOptions() {
    console.log("Updating options");
    g_exceptions = [];
    var domains = [];
    chrome.storage.local.get(null, function(items) {
        domains = items.exceptions;
        for (d in domains) {
              var domain = domains[d].trim();
              if (domain != "") { // Ignore empty lines
                  g_exceptions.push(RegExp("(.|^)" + domain + "$"));
              }
        }
        g_isWhitelist = (items.exceptionType == "whitelist");
        g_isEnabled = items.enabled;
        
        if (g_isEnabled) {
            chrome.action.setIcon({path: c_enabledIcons});
        } else {
            chrome.action.setIcon({path: c_disabledIcons});
        }
    });
}

function setEnabled(enabled) {
    /* Reflect the value of the enabled key of the Storage API */
    chrome.storage.local.set({'enabled': enabled}, function () {
        updateOptions();
    });
}

chrome.runtime.onInstalled.addListener((details) => {
    var init_exceptions = ["mail.google.com", "gmail.com"];
    var init_exceptionType = "whitelist";
    var init_enabled = true;
    console.log("init");
    // Processing during update and installation
    if (details.reason === "install") {
        /* Reflect the value of the enabled key of the Storage API */
        chrome.storage.local.set({
            exceptions: init_exceptions,
            exceptionType: init_exceptionType,
            enabled: init_enabled
        });
        console.log("install");
        return;
    }
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.method === "updateOptions") {
            console.log(request);
            /* Reflect settings in Storage API data */
                updateOptions();
                sendResponse({});
          } else {
            sendResponse({});
          }
        return true;
    }
);

/* Changed browserAction to action to support Manifest v3 */
chrome.action.onClicked.addListener(function(tab) {
    setEnabled(!g_isEnabled);
});

updateOptions();
