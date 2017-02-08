/*global window*/
/*global alert*/
/*global $*/
/*global confirm*/

var ajaxURL = "http://127.0.0.1:5000/";
$(document).ready(function () {
    "use strict";

    function displayAWord(aString) {
        var firstLetter = aString[0].toUpperCase();
        var restOfString = aString.slice(1, aString.length);
        return firstLetter + restOfString;
    }

    function getURLQueryParams() {
        var url = window.location;
        var searchParams = url.search;
        var out = null;
        if (searchParams.indexOf("&") > -1) {
            out = searchParams.split("?")[1].split("&");
        } else {
            out = searchParams.split("?"); //.split("&");
        }
        return out;
    }

    function findStringInArray(aList, stringValue) {
        var cur = null;
        var out = null;
        var i = 0;
        for (i = 0; i < aList.length; i += 1) {
            cur = aList[i];
            if (cur.indexOf(stringValue) > -1) {
                out = cur;
            }
        }
        return out;
    }

    var params = getURLQueryParams();
    var decision = findStringInArray(params, "action=");
    var id = findStringInArray(params, "id=");
    if (id === "") {
        id = null;
    } else {
        id = id.split("id=")[1];
    }
    if (decision === "") {
        decision = null;
    } else {
        decision = decision.split("action=")[1];
    }
    var header = $("#receipt-header");
    var headerText = document.createTextNode("Receipt for " + displayAWord(decision));
    header.html(headerText);
    console.log(header);
    console.log(headerText);
    var div = $("#receipt-div");
    var p = document.createElement("p");
    var pText = document.createTextNode("Your receipt is " + id);
    p.appendChild(pText);
    div.html(p);
});