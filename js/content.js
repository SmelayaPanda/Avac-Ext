// -------------------------------------------------------------------------
const url = "https://translate.yandex.net/api/v1.5/tr.json/translate",
    keyAPI = "trnsl.1.1.20130922T110455Z.4a9208e68c61a760.f819c1db302ba637c2bea1befa4db9f784e9fbb8";
// -------------------------------------------------------------------------
// Listen popup.js
window.onload = function () {
    chrome.runtime.onMessage.addListener(msgObj => {

        let parts = msgObj.split(" ");
        if (parts[0] === "translate_btn") {
            //avacPost(level, langFrom, langTo)
            avacPost(parts[1], parts[2], parts[3]);
        }
    });
};

// -------------------------------------------------------------------------
function avacPost(level, langFrom, langTo) {

    const url = "http://panda.jelastic.regruhosting.ru/avac/";
    const req = new XMLHttpRequest();
    const params =
        "goto=" + document.URL + "&" +
        "level=" + level + "&" +
        "langFrom=" + langFrom + "&" +
        "langTo=" + langTo;

    console.log(params);
    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    req.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            myDictionary = JSON.parse(this.responseText);
            translateText.call(this);
        }
    };
    req.send(params);
};

// -------------------------------------------------------------------------
function translateText() {
    console.log("Start");

    if (document.getElementsByClassName("avac")) {
        removeElementsByClass("avac")
    }

    let paragraphs = document.getElementsByTagName("p");
    for (let i = 0; i < paragraphs.length; i++) {
        let text = paragraphs[i].textContent;
        for (let key in myDictionary) {
            if (myDictionary.hasOwnProperty(key)) {
                text = text.replace(" " + key + " ",
                    ` ${key} <span class="avac" style="color: green">
                                 [ <i>${myDictionary[key]}</i> ]
                             </span>`);
            }
        }

        paragraphs[i].innerHTML = text;
    }
    console.log("Complete");
}
// -------------------------------------------------------------------------
function yandexTranslate() {

    let xhr = new XMLHttpRequest(),
        //textAPI = document.querySelector('#source').value,
        textAPI = "Hello",
        //langAPI = document.querySelector('#lang').value;
        langAPI = "ru";

    data = "key=" + keyAPI + "&text=" + textAPI + "&lang=" + langAPI;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(data);
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let res = this.responseText;
            let json = JSON.parse(res);
            if (json.code === 200) {

                return json.text[0];
                //document.querySelector('#output').innerHTML = json.text[0];
            }
            else {

                console.log("Error code:" + json.code);
                //document.querySelector('#output').innerHTML = "Error Code: " + json.code;
            }
        }
    }
}
// -------------------------------------------------------------------------
function removeElementsByClass(className) {
    var elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}
String.prototype.replaceAll = function (strReplace, strWith) {
    // See http://stackoverflow.com/a/3561711/556609
    var esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var reg = new RegExp(esc, 'ig');
    return this.replace(reg, strWith);
};