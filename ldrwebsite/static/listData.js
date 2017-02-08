/*global window*/
/*global alert*/
/*global $*/
/*global confirm*/

var ajaxURL = "https://y2.lib.uchicago.edu/hrapi/";

$(document).ready(function () {
    "use strict";

    function displayAWord(aString) {
        var firstLetter = aString[0].toUpperCase();
        var restOfString = aString.slice(1, aString.length);
        return firstLetter + restOfString;
    }

    function getAValueInARecord(recordId, key) {
        var urlString = ajaxURL + "record/" + recordId + "/" + encodeURIComponent(key);
        var newObj = Object.create(null);
        return $.ajax({
            type: "GET",
            url: urlString,
            data: JSON.stringify(newObj),
            async: false,
            success: function(data) {return data;},
            contenType: "application/json",
            dataType: "json"
        });
    }

    function getRecord(recordID) {
        var urlString = ajaxURL + "record/" + recordID;
        var newObj = Object.create(null);
        return $.ajax({
            type: "GET",
            url: urlString,
            data: JSON.stringify(newObj),
            async: false,
            success: function(data) {
                return data;
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    }


    function getRecordsByCategory(categoryName) {
        var urlString = ajaxURL + "category/" + categoryName;
        var newObj = Object.create(null);
        return $.ajax({
            type: "GET",
            url: urlString,
            data: JSON.stringify(newObj),
            async: false,
            success: function(data) {return data;},
            contentType: "application/json",
            dataType: "json"
        });
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

    function displayAnAccessionRecord(data) {
	var div = document.createElement("div");
	var firsth3 = document.createElement("h3");
	var onep = document.createElement("p");
	onep.appendChild(document.createTextNode(data["Summary"][0]));
	div.appendChild(onep);
	var twop = document.createElement("p");
	if (data["Mixed Acquisition"] === undefined) {
		twop.appendChild(document.createTextNode("Mixed Acquisition: false"));
	} else {
		twop.appendChild(document.createTextNode("Mixed Acquisition: " + data["Mixed Acquisition"][0]));

	}
	div.appendChild(twop);
	var threep = document.createElement("p");
	if (data["Date Files Received"] !== undefined) {
		console.log(data);
		threep.appendChild(document.createTextNode("Date Files Received: " + data["Date Files Received"][0]));
		div.appendChild(threep);
	}
	if (data["Date Materials Received"] !== undefined) {

		var fourp = document.createElement("p");
		fourp.appendChild(document.createTextNode("Date Materials Received: " + data["Date Materials Received"][0]));
		div.appendChild(fourp);
	}
	if (data["Restriction Information"] !== undefined) {
		var h3 = document.createElement("p");
		h3.appendChild(document.createTextNode("Restrictions:"));
		var ul = document.createElement("ul");
		var restrictions = data["Restriction Information"];
		var restrictionKeys = Object.keys(restrictions);
        	for (var n in restrictionKeys) {	
			var li = document.createElement("li");		
			console.log(restrictions[n]);
			if (restrictions[n]["Restriction Code"] !== undefined) {
				console.log("hello");
				li.appendChild(document.createTextNode(restrictions[n]["Restriction Code"])); 
			} else {
				console.log(restrictions[n]);
				li.appendChild(document.createTextNode(restrictions[n]["Restriction"]));
			}
			ul.appendChild(li);
		}
		div.appendChild(h3);
		div.appendChild(ul);
	}

	if (data["Physical Media Information"] !== undefined) {
		var h3 = document.createElement("p");
		h3.appendChild(document.createTextNode("Physical Media Information"));
	var ul = document.createElement("ul");
	var physmedia = data["Physical Media Information"];
	var physmediakeys = Object.keys(physmedia);
	for (var n in physmediakeys) {
		var li = document.createElement("li");
		li.appendChild(document.createTextNode(physmedia[n]["Quantity"] + " " + physmedia[n]['Label']));
		ul.appendChild(li);
		}
		div.appendChild(h3);
		div.appendChild(ul);
	}
	return div;
    }

    $(function() {
        $("button[id^='export-']").click(function() {
            var id = this.getAttribute("id").split("export-")[1];
	    var n = "div[class='export-" + id + "']";
	    var d = getRecord(id).responseJSON.data.record;
	    var p = $(n).html(JSON.stringify(d));
        });
    });

    $(function() {
        $("button[id^='view-']").click(function() {
	    try {
            var id = this.getAttribute("id").split("view-")[1];
	    console.log(id);
	    var n = "div[class='export-" + id + "']";
	    var d = displayAnAccessionRecord(getRecord(id).responseJSON.data.record);
	    var p = $(n).html(d);
            } catch (TypeError) {
             alert("Cannot view that record. Try viewing it as raw string");
            }
        });
    });


    var params = getURLQueryParams();
    var decision = findStringInArray(params, "action=");
    if (decision === "") {
        decision = null;
    } else {
        decision = decision.split("action=")[1];
    }
    var data = getRecordsByCategory(displayAWord(decision) + "Record");
    console.log(data);
    var ids = data.responseJSON.data.record_identifiers;
    var htmlToFill = $("#listing-div");
    var header = $("#listing-header");
    header.html(document.createTextNode("List of " + displayAWord(decision)+"s"));
    var dl = document.createElement("dl");
    dl.setAttribute("class", "list-group"); 
    var count = 0;
    if (decision === 'accession') {
        for (var n in ids) {
            var value = ids[n];
            var exportButton = document.createElement("button");
            exportButton.setAttribute("class", "btn btn-primary btn-sm");
            exportButton.setAttribute("role", "button")
            exportButton.setAttribute("id", "export-" + value);
            exportButton.appendChild(document.createTextNode("As Raw String"));

	    var viewButton = document.createElement("button");
	    viewButton.setAttribute("class", "btn btn-primary btn-sm");
            viewButton.setAttribute("role", "button")
            viewButton.setAttribute("id", "view-" + value);
            viewButton.appendChild(document.createTextNode("View Record"));
	
	    var dd = document.createElement("dd");
	    dd.appendChild(exportButton);
	    dd.appendChild(document.createTextNode(" "));
	    dd.appendChild(viewButton);
            var dt = document.createElement("dt");
            var title = getAValueInARecord(value, "Collection Title").responseJSON.data.value[0];
            var accessionid = getAValueInARecord(value, "Accession Identifier").responseJSON.data.value[0];
            var val = accessionid + " from " + title;
	    var listItemDiv = document.createElement("div");
	    var exportDiv = document.createElement("div");
	    exportDiv.setAttribute("class", "export-" + value);

	    listItemDiv.setAttribute("class", "list-group-item");
	    listItemDiv.setAttribute("id", value);
            dt.appendChild(document.createTextNode(val));
            listItemDiv.appendChild(dt);
	    listItemDiv.appendChild(dd);
	    listItemDiv.appendChild(exportDiv);
            dl.appendChild(listItemDiv);
            count += 1;
        }
    } else if (decision == 'acquisition') {
        for (var n in ids) {
            var value = ids[n];
            var exportButton = document.createElement("button");
            exportButton.setAttribute("class", "btn btn-primary btn-sm");
            exportButton.setAttribute("role", "button")
            exportButton.setAttribute("id", "export-" + value);
            exportButton.appendChild(document.createTextNode("As Raw String"));

	    var viewButton = document.createElement("button");
	    viewButton.setAttribute("class", "btn btn-primary btn-sm");
            viewButton.setAttribute("role", "button")
            viewButton.setAttribute("id", "view-" + value);
            viewButton.appendChild(document.createTextNode("View Record"));
	

	    var dd = document.createElement("dd");
	    dd.appendChild(exportButton);
	    dd.appendChild(document.createTextNode(" "));
	    dd.appendChild(viewButton);
            var dt = document.createElement("dt");
            var title = getAValueInARecord(value, "Collection Title").responseJSON.data.value[0];
            var accessionid = getAValueInARecord(value, "Accession Identifier").responseJSON.data.value[0];
            var val = accessionid + " from " + title;
	    var listItemDiv = document.createElement("div");
	    var exportDiv = document.createElement("div");
	    exportDiv.setAttribute("class", "export-" + value);


	    listItemDiv.setAttribute("class", "list-group-item");
	    listItemDiv.setAttribute("id", value);
            dt.appendChild(document.createTextNode(val));
            listItemDiv.appendChild(dt);
	    listItemDiv.appendChild(dd);
	    listItemDiv.appendChild(exportDiv);
            dl.appendChild(listItemDiv);
            count += 1;
       }
    }
    if (count == 0) {
       var p = document.createElement("p");
       p.appendChild(document.createTextNode("There are no records at this time."));
       htmlToFill.html(p)
    } else {
       htmlToFill.html(dl);
    }
});
