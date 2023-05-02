/* Save options to Storage API in background.js */
function save_options() {
    var exceptions = document.getElementById("exceptions").value.split("\n");
    var exceptionType = document.getElementById("exceptionType").value;
    var enabled = document.getElementById("enabled").checked;
    //Process to send options to background.js
    chrome.storage.local.set({
        exceptions: exceptions,
        exceptionType: exceptionType,
        enabled: enabled
    });
    chrome.runtime.sendMessage({ method: "updateOptions" });

    // Update status to let user know options were saved.
    $("#status").fadeIn();
    setTimeout(function () {
        $("#status").fadeOut();
    }, 2000);
}

/* Restore Storage API values */
function restore_options() {
    /* Get settings from background.js */
    chrome.storage.local.get(null, function (items) {
        console.log(items);
        var exceptions = items.exceptions.join("\n");
        var exceptionType = items.exceptionType;
        var enabled = items.enabled;

        console.log("exceptionType: " + items.exceptionType);
        if (exceptions != null) {
            document.getElementById("exceptions").value = exceptions;
        }
        if (exceptionType != null) {
            $('#exceptionType option[value="' + exceptionType + '"]').prop('selected', true);
        }
        if (enabled != null) {
            document.getElementById("enabled").checked = enabled;
        }
    });
}

//Code for localization support
function localizeHtmlPage() {
    //Localize by replacing __MSG_***__ meta tags
    var objects = document.getElementsByTagName('html');
    for (var j = 0; j < objects.length; j++) {
        var obj = objects[j];

        var valStrH = obj.innerHTML.toString();
        var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function (match, v1) {
            return v1 ? chrome.i18n.getMessage(v1) : "";
        });

        if (valNewH != valStrH) {
            obj.innerHTML = valNewH;
        }
    }
}

localizeHtmlPage()
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
