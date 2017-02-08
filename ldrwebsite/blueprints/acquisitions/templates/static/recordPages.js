/*global window*/
/*global alert*/
/*global $*/
/*global confirm*/

var ajaxURL = "https://y2.lib.uchicago.edu/hrapi/";

$(document).ready(function() {
    "use strict";

    function displayAWord(aString) {
        var firstLetter = aString[0].toUpperCase();
        var restOfString = aString.slice(1, aString.length);
        return firstLetter + restOfString;
    }

    function displayAMachinePhrase(aString) {
        var stringParts = aString.split("-");
        var output = "";
        for (var n in stringParts) {
            output = output + " " + displayAWord(stringParts[n]);
        }
        return output;
    }

    function machinifyAPhrase(aString) {
        var newPhrase = aString.replace(/\s/g, '-');
        return newPhrase.toLowerCase();
    }

    function formLabel(forId) {
        var labelStrings = forId.split("-");
        var labelText = "";
        if (labelStrings.length > 1) {
            var i = null;
            var cur = null;
            var display = null;
            var newLabelText = null;
            for (i = 0; i < labelStrings.length; i += 1) {
                cur = labelStrings[i];
                display = displayAWord(cur);
                newLabelText = " " + display;
                labelText += newLabelText;
            }
        } else if (labelStrings.length === 1) {
            labelText = displayAWord(labelStrings[0]);
        }
        var label = document.createElement("label");
        label.setAttribute("for", forId);
        if (labelText !== "" && labelText.indexOf("Save") === -1 && labelText.indexOf("Cancel") === -1) {
            label.appendChild(document.createTextNode(labelText));
        }
        return label;
    }

    function formSelectField(inputName, innerElementList) {
        var select = document.createElement("select");
        select.setAttribute("name", inputName);
        select.setAttribute("class", "form-control");
        var i = null;
        for (i = 0; i < innerElementList.length; i += 1) {
            select.appendChild(innerElementList[i]);
        }
        return select;
    }

    function formSelectOptionItem(valueString) {
        var option = document.createElement("option");
        option.setAttribute("id", valueString);
        option.appendChild(document.createTextNode(valueString));
        return option;
    }

    function formInputField(inputName, inputType, placeholder) {
        var input = document.createElement("input");
        input.setAttribute("class", "form-control");
        input.setAttribute("name", inputName);
        input.setAttribute("type", inputType);
        input.setAttribute("id", inputName);
        input.setAttribute("placeholder", placeholder);
        return input;
    }

    function formHiddenField(inputName, inputValue) {
        var input = document.createElement("input");
        input.setAttribute("name", inputName);
        input.setAttribute("type", "hidden");
        input.value = inputValue;
        return input;
    }

    function formTextAreaField(inputName, placeholder) {
        var textfield = document.createElement("textarea");
        textfield.setAttribute("class", "form-control");
        textfield.setAttribute("name", inputName);
        textfield.setAttribute("placeholder", placeholder);
        return textfield;
    }

    function formCheckBoxField(inputName) {
        var checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("name", inputName);
        return checkbox;
    }

    function formGroup(innerElement) {
        var div = document.createElement("div");
        div.setAttribute("class", "form-group");
        var labelName = innerElement.getAttribute("name");
	if (labelName.indexOf("address-information-") >= 0) {
		labelName = labelName.split(/address-information-\d+-/)[1]
	}
        var label = null;
        var helpblock = document.createElement("div");
        helpblock.setAttribute("class", "help-block-with-errors");
	var inputName = innerElement.getAttribute("name");

        if (innerElement.getAttribute("type") === "checkbox") {
            label = formLabel(labelName);
	    label.setAttribute("class", "center-block");
            div.appendChild(label);
	    div.appendChild(innerElement);
	    div.appendChild(helpblock); 
        } else {
            label = formLabel(labelName);
            div.appendChild(label);
            div.appendChild(innerElement);
            div.appendChild(helpblock);
        }
        return div;
    }

    function phoneGroupDiv(innerElement) {
        var div = document.createElement("div");
        div.setAttribute("id", "phone-numbers");
        div.appendChild(innerElement);
        return div;
    }

    function emailGroupDiv(innerElement) {
        var div = document.createElement("div");
        div.setAttribute("id", "emails");
        div.appendChild(innerElement);
        return div;
    }

    function formRow(innerElementList) {
        var div = document.createElement("div");
        div.setAttribute("class", "row");
        var i = null;
        for (i = 0; i < innerElementList.length; i += 1) {
            div.appendChild(innerElementList[i]);
        }
        return div;
    }

    function formRowWholeColumn(innerElement) {
        var div = document.createElement("div");
        div.setAttribute("class", "col-sm-10");
        div.appendChild(innerElement);
        return div;
    }

    function formRowHalfColumn(innerElement) {
        var div = document.createElement("div");
        div.setAttribute("class", "col-sm-5");
        div.appendChild(innerElement);
        return div;
    }

    function formRowThirdColumn(innerElement) {
        var div = document.createElement("div");
        div.setAttribute("class", "col-sm-3");
        div.appendChild(innerElement);
        return div;
    }

    function makeAFormInputRequired(inputElement) {
        inputElement.setAttribute("required", "true");
        return inputElement;
    }

    function setRegexValidatorInput(inputElement, regexPattern, titleString) {
        inputElement.setAttribute("pattern", regexPattern);
        inputElement.setAttribute("title", titleString);
        return inputElement;
    }

    function makePhoneInput(num) {
        var name = "phone-" + num.toString();
        var phone = formRowWholeColumn(formGroup(setRegexValidatorInput(formInputField(name, "tel", "773-555-5555 or 1-2345"), "\\d{3}[-]\\d{3}[-]\\d{4}|\\d{1}[-]\\d{4}", "should look like 7773-444-5555 or 1-2345")));
        return formRow([phone]);
    }

    function addInputToGroupDiv(inputElement, idString) {
        var divToAppendTo = document.getElementById(idString);
        divToAppendTo.appendChild(inputElement);
        return divToAppendTo;

    }

    function makeEmailInput(num) {
        var name = "email-" + num.toString();
        var email = formRowWholeColumn(formGroup(formInputField(name, "email", "example@uchicago.edu", "should be a valid email address")));
        return formRow([email]);
    }

    function submitButton() {
        var button = document.createElement("button");
        var cancel = document.createElement("a");
        button.setAttribute("name", "save");
        button.setAttribute("type", "submit");
        button.setAttribute("class", "btn btn-primary");
        button.appendChild(document.createTextNode("Save"));
        cancel.setAttribute("href", "null");
        cancel.setAttribute("name", "cancel");
        cancel.setAttribute("class", "btn btn-warning");
        cancel.setAttribute("role", "button");
        cancel.appendChild(document.createTextNode("Cancel"));

        return formRow([formRowHalfColumn(formGroup(button)), formRowHalfColumn(formGroup(cancel))]);
    }

    function getPrePopElements() {
        var inputs = $("input");
        var textareas = $("textarea");
        return { inputs: inputs, textareas: textareas };
    }

    function addRecordToCategory(categoryName, recordID) {
        var urlString = ajaxURL + 'category/' + categoryName;
        var newObj = Object.create(null);
        newObj.record_identifier = recordID;
        var data = $.ajax({
            type: "POST",
            url: urlString,
            data: JSON.stringify(newObj),
            async: true,
            success: function(data) {
                return data;
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
        return data;
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
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {
                return data;
            }
        });
    }

    function getCollections() {
        var urlString = "https://y2.lib.uchicago.edu/inventory/inventories/collections.json";
        var newObj = Object.create(null);
        return $.ajax({
            type: "GET",
            url: urlString,
            data: JSON.stringify(newObj),
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {
                return data;
            }
        });
    }



    function getAValueInARecord(recordId, key) {
        "use strict";
        var urlString = ajaxURL + "record/" + recordId + "/" + encodeURIComponent(key);
        var newObj = Object.create(null);
        return $.ajax({
            type: "GET",
            url: urlString,
            data: JSON.stringify(newObj),
            contenType: "application/json",
            dataType: "json",
            async: false,
            success: function(data) {
                return data;
            }
        })
    }

    function getCollectionTitleList() {
	var collections = getCollections().responseJSON.Collections
	return collections
	/*if (localStorage["Collections"] == undefined) {
        	var collection_category = getRecordsByCategory('Collection');
		var records = collection_category.responseJSON.data.record_identifiers;
	      	var out = new Array();
        	$.each(records, function(index, value) {
            		var vdata = getAValueInARecord(value, "Collection Title");
            		var vdata = vdata.responseJSON.data.value[0];
	            	out.push(vdata);
        	});
                localStorage.setItem("Collections", JSON.stringify(out));
		return out;
	} else {
		var collections = JSON.parse(localStorage.getItem("Collections"));
		return collections;
	}*/
    }

    function postNewRecord(o) {
        var urlString = ajaxURL + "record";
        var newObj = Object.create(null);
        return $.ajax({
            type: "POST",
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

    function addKeyValueToRecord(recordID, key, valueString) {
        var urlString = ajaxURL + "record/" + recordID + "/" + encodeURIComponent(key);
        var newObj = Object.create(null);
        newObj.value = valueString;
        return $.ajax({
            type: "POST",
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

    function findObjectInAnArray(id, listName) {
        var gettable = localStorage.getItem(listName);
        var out = Object.create(null);
        var match = null;
        if (gettable !== null) {
            var mainObj = JSON.parse(localStorage.getItem(listName));
            var keys = Object.keys(mainObj);

            for (var n in keys) {
                var cur = n;
                if (cur === id) {
                    match = mainObj[cur];
                }
            }
        }
        return match;
    }

    function getAValueFromCurrentRecord(record, inputElement) {
        if (typeof(inputElement) === "object") {
            name = displayAMachinePhrase(inputElement.getAttribute("name")).replace(' ', '');
            if (typeof(record[name]) === "string") {
                inputElement.value = record[name];
            } else if (record[name] instanceof Array) {
                inputElement.value = record[name][0];
            }
        }
        return inputElement;
    }

    function prePopInputs(currentRecord) {
        var selects = document.getElementsByTagName("select");
        var inputs = document.getElementsByTagName("input");
        var textareas = document.getElementsByTagName("textarea");
        for (var n in selects) {
            getAValueFromCurrentRecord(currentRecord, selects[n]);
        }
        for (var n in inputs) {
            getAValueFromCurrentRecord(currentRecord, inputs[n]);
        }
        for (var n in textareas) {
            getAValueFromCurrentRecord(currentRecord, textareas[n]);
        }
    }

    function prePopMajorForm(word) {
        var currentRecord = getRecord(id);
        var record = currentRecord.responseJSON.data.record;
        if (record["Donor"]) {
            if (localStorage.getItem("Donor") === null) {
                var donorObj = record["Donor"];
                var donorkeys = Object.keys(donorObj);
                var newObj = Object.create(null);
                for (var r in donorkeys) {
                    newObj[parseInt(r)] = donorObj[r];
                }
                localStorage.setItem("Donor", JSON.stringify(newObj));
            }
        }
        if (record["Source"]) {
            if (localStorage.getItem("Source") === null) {
                var sourceObj = record["Source"];
                var sourcekeys = Object.keys(sourceObj);
                var newObj = Object.create(null);
                for (var r in sourcekeys) {
                    newObj[parseInt(r)] = sourceObj[r];
                }
                localStorage.setItem("Source", JSON.stringify(newObj));
            }
        }
        if (record["Physical Media Information"]) {
            if (localStorage.getItem("Physical Media Information") === null) {
                var physmediaObj = record["Physical Media Information"];
                var physmediakeys = Object.keys(physmediaObj);
                var newObj = Object.create(null);
                for (var r in physmediakeys) {
                    newObj[parseInt(r)] = physmediaObj[r];
                }
                localStorage.setItem("Physical Media Information", JSON.stringify(newObj));
            }
        }
        if (record["Restriction Information"]) {
            if (localStorage.getItem("Restriction Information") === null) {
                var restrictionObj = record["Restriction Information"];
                var restrictionObj = record["Restriction Information"];
                var restrictionkeys = Object.keys(restrictionObj);
                var newObj = Object.create(null);
                for (var r in restrictionkeys) {
		    var aRestrictionObj = Object.create(null);
		    if (restrictionObj["Restriction"] !== null) {
			aRestrictionObj["Restriction Code"] = restrictionObj["Restriction"];	
		    } else {
			aRestrictionObj["Restriction Code"] = restrictionObj["Restriction Code"];
		    }
		    if (restrictionObj["Comment"] !== null) {
			aRestrictionObj["Restriction Comment"] = restrictionObj["Comment"];
		    } else {
			aRestrictionObj["Restriction Comment"] = restrictionObj["Restriction Comment"];
		    }
		    
                    newObj[parseInt(r)] = restrictionObj[r];
                }
                localStorage.setItem("Restriction Information", JSON.stringify(newObj));
            }
        }
        loadAList("donors-list");
        loadAList("sources-list");
        loadAList("physmedia-list");
        loadAList("restriction-list");
        if (word === 'accession') {
            buildAccessionForm();
        } else if (word === 'acquisition') {
            buildAcquisitionForm();
        }
        var fieldset = document.getElementsByTagName("fieldset")[0];
        var inputs = fieldset.getElementsByTagName("input");
        var textareas = fieldset.getElementsByTagName("textarea");
        for (var n in inputs) {
            if (typeof(inputs[n]) === 'object') {
                if (inputs[n].getAttribute("type") === "checkbox") {
                    var dname = displayAMachinePhrase(inputs[n].getAttribute("name")).replace(' ', '');
                    if (record[dname] !== undefined) {
                        var l = record[dname];
                        if (l.indexOf(true) > -1) {
                            inputs[n].setAttribute("checked", "true");
                        }
                    }
                }
                var a = inputs[n];
                var name = a.getAttribute("name");
                var displayName = displayAMachinePhrase(name).replace(' ', '');
                if (record[displayName] !== undefined) {
                    a.value = record[displayName][0];
                }
            }
        }
        for (var z in textareas) {
            if (typeof(textareas[z]) === 'object') {
                var b = textareas[z];
                var name = b.getAttribute("name");
                var displayName = displayAMachinePhrase(name).replace(' ', '');
                record[displayName];
                if (record[displayName] !== undefined) {
                    b.value = record[displayName];
                }
            }
        }
    }

    function prePopPersonForm(word) {
        buildPersonForm(word);
        var currentRecord = findObjectInAnArray(id, displayAWord(word));
        var emaildiv = document.getElementById("emails");
        var phonediv = document.getElementById("phone-numbers");
        var addresses = document.getElementById("addresses");
        var recordEmails = currentRecord["Email"];
        var recordPhones = currentRecord["Phone"];
        var recordAddresses = currentRecord["Address Information"];
        if (recordEmails !== undefined) {
            var emailKeys = Object.keys(recordEmails);
            var copied = emailKeys.splice(1, emailKeys.length - 1);
            for (var i in copied) {
                if (i == "0") {
                    i = "2";
                }
                var newEmailInput = makeEmailInput(i);

                addInputToGroupDiv(newEmailInput, "emails");
            }
            for (var j in Object.keys(currentRecord["Email"])) {
                var newNumber = (parseInt(j) + 1).toString();
                var cur = recordEmails[j];
                var a = $("input[name='email-" + newNumber.toString() + "']");
                a.val(cur);
            }
        }
        if (recordPhones !== undefined) {
            var phoneKeys = Object.keys(recordPhones);
            for (var i in phoneKeys.splice(1, phoneKeys.length - 1)) {
                if (i == "0") {
                    i = "2";
                }
                var newPhoneInput = makePhoneInput(i);
                addInputToGroupDiv(newPhoneInput, "phone-numbers");
            }
            for (var j in Object.keys(currentRecord["Phone"])) {
                var newNumber = (parseInt(j) + 1).toString();
                var cur = recordPhones[j];
                var a = $("input[name='phone-" + newNumber + "']")
                a.val(cur);
            }
        }
        if (recordAddresses !== undefined) {
            var addressKeys = Object.keys(recordAddresses);
            for (var i in addressKeys.splice(1, addressKeys.length - 1)) {
                if (i == "0") {
                    i = "2";
                }
                var newAddress = buildAddressForm(newNumber);
                addInputToGroupDiv(newAddress, 'addresses');
            }
            for (var j in Object.keys(currentRecord["Address Information"])) {
                var newNumber = (parseInt(j) + 1).toString();
                var cur = recordAddresses[newNumber.toString()];
                for (var prop in cur) {
                    var b = cur[prop];
                    var label = "address-information-" + newNumber + machinifyAPhrase(prop);
                    var curin = $("input[name='" + label + "']");
                    curin.val(b);
                }
            }
        }
        var firstInput = $("input[name='first-name']");
        var lastInput = $("input[name='last-name']");
        var affil = $("input[name='affiliated-organization']");
        var jobtitle = $("input[name='job-title']");
        if (currentRecord["First Name"] !== undefined) {
            firstInput.val(currentRecord["First Name"]);
        }
        if (currentRecord["Last Name"] !== undefined) {
            lastInput.val(currentRecord["Last Name"]);
        }
        if (currentRecord["Affiliated Organization"] !== undefined) {
            affil.val(currentRecord["Affiliated Organization"]);
        }
        if (currentRecord["Job Title"] !== undefined) {
            jobtitle.val(currentRecord["Job Title"]);
        }
    }

    function prePopPhysmediaForm(word) {
        buildPhysmediaForm();
        var currentRecord = findObjectInAnArray(id, "Physical Media Information");
        prePopInputs(currentRecord);
    }

    function prePopRestrictionForm(word) {
        buildRestrictionForm();
        var currentRecord = findObjectInAnArray(id, "Restriction Information");
        var inputs = document.getElementsByTagName("select");
        var textareas = document.getElementsByTagName("textarea");
        prePopInputs(currentRecord);
    }

    function prePopSwitchFunc(word, id) {
        var output = null;
        var currentRecord = null;
        if (word === 'donor' || word === 'source') {
            prePopPersonForm(word);
        } else if (word === 'accession') {
            prePopMajorForm(word);
        } else if (word === 'acquisition') {
            prePopMajorForm(word);
        } else if (word === 'physmedia') {
            prePopPhysmediaForm();
        } else if (word === 'restriction') {
            prePopRestrictionForm();
        } else {
        }
    }

    function buildAddressForm(num) {
        var numString = num.toString();
        var individualAddressDiv = document.createElement("div");
        individualAddressDiv.setAttribute("id", "address-" + numString);
        var addressLegend = document.createElement("legend");
        var addressFieldSet = document.createElement("fieldset");
        addressLegend.appendChild(document.createTextNode("Mailing Address Information " + numString));
        addressFieldSet.appendChild(addressLegend);
        var streetAddress = formRowHalfColumn(formGroup(formInputField("address-information-" + numString + "-street-address", "text", "123 Example Street")));
        var unitNumber = formRowHalfColumn(formGroup(formInputField("address-information-" + numString + "-unit-number", "text", "12B")));
        var city = formRowThirdColumn(formGroup(formInputField("address-information-" + numString + "-city", "text", "Demo City")));
        var state = formRowThirdColumn(formGroup(setRegexValidatorInput(formInputField("address-information-" + numString + "-state", "text", "IL"), "\\w{2}", "should be a mailing address state code like IL")));
        var zipCode = formRowThirdColumn(formGroup(setRegexValidatorInput(formInputField("address-information-" + numString + "-zip-code", "zipcode", "55555"), "\\d{5}[-]?[\\d{4}]?", "should look like 60637")));
        addressFieldSet.appendChild(formRow([streetAddress, unitNumber]));
        addressFieldSet.appendChild(formRow([city, state, zipCode]));
        individualAddressDiv.appendChild(addressFieldSet);
        return individualAddressDiv;
    }

    function buildPersonForm(correctTerm) {
        var formdiv = $("#form-div");
        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("id", correctTerm + "-form");
        form.setAttribute("data-toggle", "validator");
        form.setAttribute("role", "form");
        form.setAttribute("action", "form.html?action=" + localStorage.getItem("action"));
        form.setAttribute("form", "form-horizontal");

        var addPhone = document.createElement("a");
        addPhone.setAttribute("href", "#");
        addPhone.setAttribute("id", "addPhone");
        addPhone.setAttribute("class", "btn btn-primary");
        addPhone.setAttribute("role", "button");
        addPhone.appendChild(document.createTextNode("Add Phone"));

        var addEmail = document.createElement("a");
        addEmail.setAttribute("id", "addEmail");
        addEmail.setAttribute("class", "btn btn-primary");
        addEmail.setAttribute("role", "button");
        addEmail.appendChild(document.createTextNode("Add Email"));

        var addAddress = document.createElement("a");
        addAddress.setAttribute("id", "addAddress");
        addAddress.setAttribute("class", "btn btn-primary");
        addAddress.setAttribute("role", "button");
        addAddress.appendChild(document.createTextNode("Add Address"));

        var fieldset = document.createElement("fieldset");
        var legend = document.createElement("legend");
        var legendH3 = document.createElement("h3");
        var legendP = document.createElement("p");
        legendH3.appendChild(document.createTextNode("Creating a " + displayAWord(correctTerm)));
        legendP = document.createElement("p");
        legendP.appendChild(addPhone);
        legendP.appendChild(document.createTextNode(" "));
        legendP.appendChild(addEmail);
        legendP.appendChild(document.createTextNode(" "));
        legendP.appendChild(addAddress);
        legend.appendChild(legendH3);
        legend.appendChild(legendP);
        legend.appendChild(addPhone);
        legend.appendChild(document.createTextNode(" "));
        legend.appendChild(addEmail);
        legend.appendChild(document.createTextNode(" "));
        legend.appendChild(addAddress);
        fieldset.appendChild(legend);
        var firstName = formRowHalfColumn(formGroup(formInputField("first-name", "text", "Jane")));

        var lastName = formRowHalfColumn(formGroup(formInputField("last-name", "text", "Doe")));

        var affiliatedOrganization = formRowHalfColumn(formGroup(formInputField("affiliated-organization", "text", "University of Chicago Physics Department")));
        var jobTitle = formRowHalfColumn(formGroup(formInputField("job-title", "text", "Department Chair")));

        var phone = phoneGroupDiv(makePhoneInput(1), "phone-numbers");
        var email = emailGroupDiv(makeEmailInput(1), "emails");
        fieldset.appendChild(formRow([firstName, lastName]));
        fieldset.appendChild(formRow([affiliatedOrganization, jobTitle]));
        fieldset.appendChild(phone);
        fieldset.appendChild(email);
        var addressGroupDiv = document.createElement("div");
        addressGroupDiv.setAttribute("id", "addresses");
        var anAddressForm = buildAddressForm("1");
        addressGroupDiv.appendChild(anAddressForm);
        fieldset.appendChild(addressGroupDiv);
        fieldset.appendChild(submitButton());
        form.appendChild(fieldset);
        formdiv.html(form);
    }

    function generateHiddenFieldForPerson(term, appendableDiv, peopleRecords) {
        for (var n in peopleRecords) {
            var anObj = peopleRecords[n];
            var firstNameField = term + "-" + n.toString() + "-" + "first-name";
            var firstNameValue = anObj["First Name"];
            var lastNameField = term + "-" + n.toString() + "-" + "last-name";
            var lastNameValue = anObj["Last Name"];

            var firstNameFHF = formHiddenField(firstNameField, firstNameValue);
            var lastNameFHF = formHiddenField(lastNameField, lastNameValue);

            appendableDiv.appendChild(firstNameFHF);
            appendableDiv.appendChild(lastNameFHF);

            for (var phone in anObj["Phone"]) {
                var fieldName = term + "-" + n.toString() + "-phone-" + phone;
                var fieldValue = anObj["Phone"][phone];
                var fhf = formHiddenField(fieldName, fieldValue);
                appendableDiv.appendChild(fhf);
            }
            for (var email in anObj["Email"]) {
                var fieldName = term + "-" + n.toString() + "-email-" + email;
                var fieldValue = anObj["Email"][email];
                var fhf = formHiddenField(fieldName, fieldValue);
                appendableDiv.appendChild(fhf);
            }
            for (var address in anObj["Address Information"]) {
                var baseField = term + "-" + n.toString() + "-address-information-" + address;
                for (var field in anObj["Address Information"][address]) {
                    var fieldName = baseField + machinifyAPhrase(field);
                    var fieldValue = anObj["Address Information"][address][field];
                    var fhf = formHiddenField(fieldName, fieldValue);
                    appendableDiv.appendChild(fhf);
                }
            }
        }
    }

    function generateHiddenFieldForListOfDatum(term, appendableDiv, datumObjs) {
        for (var a in datumObjs) {
            var anObj = datumObjs[a];
            for (var b in anObj) {
                var fieldName = term + "-" + a.toString() + "-" + machinifyAPhrase(b);
                var fieldValue = anObj[b];
                var fhf = formHiddenField(fieldName, fieldValue);
                appendableDiv.appendChild(fhf);
            }
        }
    }

    function addHiddenFields() {
        var hiddenFieldsDiv = document.createElement("div");
        hiddenFieldsDiv.setAttribute("id", "hidden-fields");
        if (localStorage.getItem("Donor") !== null) {
            var obj = JSON.parse(localStorage.getItem("Donor"));
            generateHiddenFieldForPerson("donor", hiddenFieldsDiv, obj);
        }
        if (localStorage.getItem("Source") !== null) {
            var obj = JSON.parse(localStorage.getItem("Source"));
            generateHiddenFieldForPerson("source", hiddenFieldsDiv, obj);
        }
        if (localStorage.getItem("Restriction Information") !== null) {
            var obj = JSON.parse(localStorage.getItem("Restriction Information"));
            generateHiddenFieldForListOfDatum("restriction-information", hiddenFieldsDiv, obj);
        }
        if (localStorage.getItem("Physical Media Information") !== null) {
            var obj = JSON.parse(localStorage.getItem("Physical Media Information"));
            generateHiddenFieldForListOfDatum("physical-media-information", hiddenFieldsDiv, obj);
        }
        return hiddenFieldsDiv;
    }

    function buildAccessionForm() {
        var formdiv = $("#form-div");
        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("id", "accession-form");
        form.setAttribute("data-toggle", "validator");
        form.setAttribute("role", "form");
        for (var p in getURLQueryParams(location)) {
            if (getURLQueryParams(location)[p].indexOf("item=") > -1) {
                var id = getURLQueryParams(location)[p].split("item=")[1];
                localStorage.setItem("acquisitionBeingCompleted", id);
            }
        }
        form.setAttribute("form", "form-horizontal");
        var fieldset = document.createElement("fieldset");

        var addDonor = document.createElement("a");
        addDonor.setAttribute("href", "#");
        addDonor.setAttribute("id", "new-donor-button");
        addDonor.setAttribute("class", "btn btn-primary");
        addDonor.setAttribute("role", "button");
        addDonor.appendChild(document.createTextNode("Add a Donor"));

        var addSource = document.createElement("a");
        addSource.setAttribute("href", "#");
        addSource.setAttribute("id", "new-source-button");
        addSource.setAttribute("class", "btn btn-primary");
        addSource.setAttribute("role", "button");
        addSource.appendChild(document.createTextNode("Add a Source"));

        var addPhysmedia = document.createElement("a");
        addPhysmedia.setAttribute("href", "#");
        addPhysmedia.setAttribute("id", "new-physmedia-button");
        addPhysmedia.setAttribute("class", "btn btn-primary");
        addPhysmedia.setAttribute("role", "button");
        addPhysmedia.appendChild(document.createTextNode("Add a Physical Media"));

        var addRestriction = document.createElement("a");
        addRestriction.setAttribute("href", "#");
        addRestriction.setAttribute("id", "new-restriction-button");
        addRestriction.setAttribute("class", "btn btn-primary");
        addRestriction.setAttribute("role", "button");
        addRestriction.appendChild(document.createTextNode("Add a Restriction"));

        var legend = document.createElement("legend");
        var legendH3 = document.createElement("h3");
        var legendP = document.createElement("p");
        legendH3.appendChild(document.createTextNode("Creating an Accession"));
        legendP.appendChild(addDonor);
        legendP.appendChild(document.createTextNode(" "));
        legendP.appendChild(addSource);
        legendP.appendChild(document.createTextNode(" "));
        legendP.appendChild(addPhysmedia);
        legendP.appendChild(document.createTextNode(" "));
        legendP.appendChild(addRestriction);
        legend.appendChild(legendH3);
        legend.appendChild(legendP);

        var mixedAcquisition = formGroup(setRegexValidatorInput(makeAFormInputRequired(formInputField("mixed-acquisition", "text", "true or false")), "true|false", "must be either \'true\' or \'false\'"));
        var accessionId = formGroup(makeAFormInputRequired(setRegexValidatorInput(makeAFormInputRequired(formInputField("accession-identifier", "text", "2016-002")), "\\d{4}[-]\\d{3}", "should look like 2001-001")));
        var collectionTitle = formGroup(makeAFormInputRequired(formInputField("collection-title", "text", "John Doe Manuscripts. Digital Collection.")));
	var eadid = formGroup(makeAFormInputRequired(setRegexValidatorInput(formInputField("EADID", "text", "ICU.SPCL.CAMPUB"), "ICU.SPCL.\\w{3,}", "should look like ICU.SPCL.CAMPUB or ICU.SPCL.TEST")));
        var spanDate = formGroup(setRegexValidatorInput(formInputField("span-date", "text", "1980-199"), "[\\d{2}]?[/]?\\d{4}-[\\d{2}]?[/]?\\d{4}", "should look like 02/1980-04/1999 or 1980-1999"));
        var access = formGroup(formCheckBoxField("access"));
        var discover = formGroup(formCheckBoxField("discover"));
        var receiptRequired = formGroup(formCheckBoxField("receipt-letter-required"));
        var giftAckRequired = formGroup(formCheckBoxField("gift-acknowledgement-required"));
        var receiptLetterDate = formGroup(formInputField("receipt-letter-information-sent", "text", "02/01/1999"));
        var fiscalYear = formGroup(setRegexValidatorInput(formInputField("fiscal-year", "text", "2006-2007"), "\\d{4}-\\d{4}", "should look like 2016-2017"));
        var giftAckDate = formGroup(formInputField("gift-acknowledgement-information-received", "text", "10/20/1999"));
        var organization = formGroup(formInputField("organization-name", "text", "University of Chicago Special Collections Research Center"));
        var summary = formGroup(formTextAreaField("summary", "This is a description of the accession"));
        var orginDescription = formGroup(formTextAreaField("origin-description", "This is a description of the origin of this accession"));
        var rights = formGroup(formTextAreaField("rights", "This is a description of the rights for this accession"));
        var accessDescription = formGroup(formTextAreaField("access-description", "This is a description of the access constraints for this accession"));
        var adminContent = formGroup(formTextAreaField("administrative-content", "This is a note that the processor shouild know about this accession"));
        var ownershipStatus = formGroup(setRegexValidatorInput(formInputField("ownership-status", "text", "Owned or Donated or Other"), "Owned|Deposited|Other", "should be either Owned or Deposited or Other"));
        var filesReceived = formGroup(makeAFormInputRequired(formInputField("date-files-received", ",text", "The date LDR received the files")));
        var materialsReceived = formGroup(formInputField("date-materials-received", "text", "The date SPCL received materials"));
        var firstRow = formRow([formRowWholeColumn(mixedAcquisition)]);
        var secondRow = formRow([formRowHalfColumn(accessionId), formRowHalfColumn(eadid)]);
        var thirdRow = formRow([formRowHalfColumn(collectionTitle), formRowHalfColumn(spanDate)]);
        var fourthRow = formRow([formRowWholeColumn(summary)]);
        var fifthRow = formRow([formRowHalfColumn(access), formRowHalfColumn(discover)]);
        var sixthRow = formRow([formRowHalfColumn(receiptRequired), formRowHalfColumn(receiptLetterDate)]);
        var seventhRow = formRow([formRowHalfColumn(giftAckRequired), formRowHalfColumn(giftAckDate)]);
        var eighthRow = formRow([formRowHalfColumn(fiscalYear), formRowHalfColumn(organization)]);
        var ninthRow = formRow([formRowWholeColumn(ownershipStatus)]);
        var tenthRow = formRow([formRowWholeColumn(orginDescription)]);
        var eleventhRow = formRow([formRowWholeColumn(rights)]);
        var twelfthRow = formRow([formRowWholeColumn(accessDescription)]);
        var thirteenthRow = formRow([formRowWholeColumn(adminContent)]);
        var fourteenthRow = formRow([formRowHalfColumn(filesReceived), formRowHalfColumn(materialsReceived)]);
        var hiddenFields = addHiddenFields();

        fieldset.appendChild(legend);
        fieldset.appendChild(firstRow);
        fieldset.appendChild(secondRow);
        fieldset.appendChild(thirdRow);
        fieldset.appendChild(fourthRow);
        fieldset.appendChild(fifthRow);
        fieldset.appendChild(sixthRow);
        fieldset.appendChild(seventhRow);
        fieldset.appendChild(eighthRow);
        fieldset.appendChild(ninthRow);
        fieldset.appendChild(tenthRow);
        fieldset.appendChild(eleventhRow);
        fieldset.appendChild(twelfthRow);
        fieldset.appendChild(thirteenthRow);
        fieldset.appendChild(fourteenthRow);
        fieldset.appendChild(hiddenFields);

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        var currentDate = yyyy + "-" + mm + "-" + dd;
        var recordCreationDate = formHiddenField("date-record-created", currentDate);
        fieldset.appendChild(recordCreationDate);
        fieldset.appendChild(submitButton());
        form.appendChild(fieldset);
        formdiv.html(form);
    }

    function buildAcquisitionForm() {
        var formdiv = $("#form-div");
        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("id", "acquisition-form");
        form.setAttribute("data-toggle", "validator");
        form.setAttribute("role", "form");
        form.setAttribute("action", "form.html?action=acquisition");
        form.setAttribute("form", "form-horizontal");
        var addDonor = document.createElement("a");
        addDonor.setAttribute("href", "#");
        addDonor.setAttribute("id", "new-donor-button");
        addDonor.setAttribute("class", "btn btn-primary");
        addDonor.setAttribute("role", "button");
        addDonor.appendChild(document.createTextNode("Add a Donor"));

        var addSource = document.createElement("a");
        addSource.setAttribute("href", "#");
        addSource.setAttribute("id", "new-source-button");
        addSource.setAttribute("class", "btn btn-primary");
        addSource.setAttribute("role", "button");
        addSource.appendChild(document.createTextNode("Add a Source"));

        var addPhysmedia = document.createElement("a");
        addPhysmedia.setAttribute("href", "#");
        addPhysmedia.setAttribute("id", "new-physmedia-button");
        addPhysmedia.setAttribute("class", "btn btn-primary");
        addPhysmedia.setAttribute("role", "button");
        addPhysmedia.appendChild(document.createTextNode("Add a Physical Media"));

        var addRestriction = document.createElement("a");
        addRestriction.setAttribute("href", "#");
        addRestriction.setAttribute("id", "new-restriction-button");
        addRestriction.setAttribute("class", "btn btn-primary");
        addRestriction.setAttribute("role", "button");
        addRestriction.appendChild(document.createTextNode("Add a Restriction"));

        var legend = document.createElement("legend");

        var legendH3 = document.createElement("h3");

        var legendP = document.createElement("p");
        legendH3.appendChild(document.createTextNode("Creating an Acquisition"));
        legendP.appendChild(addDonor);
        legendP.appendChild(document.createTextNode(" "));
        legendP.appendChild(addSource);
        legendP.appendChild(document.createTextNode(" "));
        legendP.appendChild(addPhysmedia);
        legendP.appendChild(document.createTextNode(" "));
        legendP.appendChild(addRestriction);
        legend.appendChild(legendH3);
        legend.appendChild(legendP);

        var fieldset = document.createElement("fieldset");
        fieldset.appendChild(legend);

        var mixedAcquisition = formGroup(makeAFormInputRequired(setRegexValidatorInput(formInputField("mixed-acquisition", "text", "true or false"), "true|false", "must be either \'true\' or \'false\'")));
        var accessionId = formGroup(setRegexValidatorInput(makeAFormInputRequired(formInputField("accession-identifier", "text", "2017-001")), "\\d{4}[-]\\d{3}", "must look like 2007-001"));
        var collectionTitle = formGroup(makeAFormInputRequired(formInputField("collection-title", "text", "McQuowan Papers. Digital Collection.")));
        var spanDate = formGroup(setRegexValidatorInput(formInputField("span-date", "text", "1980-1999"), "[\\d{2}]?[/]?\\d{4}-[\\d{2}]?[/]?\\d{4}", "must look like 01/1980-02/1980 or 01/1980-1999 or 1980-1999"));
        var receiptRequired = formGroup(formCheckBoxField("receipt-letter-required"));
        var giftAckRequired = formGroup(formCheckBoxField("gift-acknowledgement-required"));
        var receiptLetterDate = formGroup(formInputField("receipt-letter-information-sent", "text", "04/01/1970"));
        var giftAckDate = formGroup(formInputField("gift-acknowledgement-information-received", "text", "01/12/1971"));
        var organization = formGroup(formInputField("organization-name", "text", "University of Chicago Special Collections Research Center"));
        var summary = formGroup(formTextAreaField("summary", "This acquisition is part of long term digitization effort"));
        var orginDescription = formGroup(formTextAreaField("origin-description", "This originates from some place"));
        var adminContent = formGroup(formTextAreaField("administrative-content", "Here is some information that a processor needs to know that is exceptional about this acquisition"));
        var firstRow = formRow([formRowWholeColumn(mixedAcquisition)]);
        var secondRow = formRow([formRowWholeColumn(accessionId)]);
        var thirdRow = formRow([formRowHalfColumn(collectionTitle), formRowHalfColumn(spanDate)]);
        var fourthRow = formRow([formRowHalfColumn(receiptRequired), formRowHalfColumn(receiptLetterDate)]);
        var fifthRow = formRow([formRowHalfColumn(giftAckRequired), formRowHalfColumn(giftAckDate)]);
        var sixthRow = formRow([formRowWholeColumn(organization)]);
        var seventhRow = formRow([formRowWholeColumn(summary)]);
        var eighthRow = formRow([formRowWholeColumn(orginDescription)]);
        var ninthRow = formRow([formRowWholeColumn(adminContent)]);
        var hiddenFields = addHiddenFields();
        fieldset.appendChild(legend);
        fieldset.appendChild(firstRow);
        fieldset.appendChild(secondRow);
        fieldset.appendChild(thirdRow);
        fieldset.appendChild(fourthRow);
        fieldset.appendChild(fifthRow);
        fieldset.appendChild(sixthRow);
        fieldset.appendChild(seventhRow);
        fieldset.appendChild(eighthRow);
        fieldset.appendChild(ninthRow);
        fieldset.appendChild(hiddenFields);

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        var currentDate = yyyy + "-" + mm + "-" + dd;
        var accessionDate = formHiddenField("accession-date", currentDate);
        var acquisitionDate = formHiddenField("acquisition-date", currentDate);
        fieldset.appendChild(acquisitionDate);

        fieldset.appendChild(submitButton());
        form.appendChild(fieldset);
        formdiv.html(form);
    }

    function buildPhysmediaForm() {
        var formdiv = $("#form-div");
        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("id", "physmedia-form");
        form.setAttribute("data-toggle", "validator");
        form.setAttribute("role", "form");
        form.setAttribute("action", "form.html?action=" + localStorage.getItem("action"));
        form.setAttribute("form", "form-horizontal");
        var fieldset = document.createElement("fieldset");
        var legend = document.createElement("legend");
        legend.appendChild(document.createTextNode("Adding a Physical Media"));
        fieldset.appendChild(legend);
        var physmedialabel = formGroup(setRegexValidatorInput(formInputField("label", "text", "disk"), "\\w{2,10}", "Should be a word that has at least 2 characters and at most 10 characters."));
        var physmediaquantity = formGroup(formInputField("quantity", "num", "10"));
        var aFormRow = formRow([formRowHalfColumn(physmedialabel), formRowHalfColumn(physmediaquantity)]);
        fieldset.appendChild(aFormRow);
        fieldset.appendChild(submitButton());
        form.appendChild(fieldset);
        formdiv.html(form);
    }

    function buildRestrictionForm() {
        var formdiv = $("#form-div");
        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("id", "restriction-form");
        form.setAttribute("data-toggle", "validator");
        form.setAttribute("role", "form");
        form.setAttribute("action", "form.html?action=" + localStorage.getItem("action"));
        form.setAttribute("form", "form-horizontal");
        var fieldset = document.createElement("fieldset");
        var legend = document.createElement("legend");
        legend.appendChild(document.createTextNode("Adding a Restriction"));
        fieldset.appendChild(legend);
        var restrictionCodes = ["", "O", "OU", "DR-##", "R-DA", "R-30", "R-50", "R-80", "R-##D", "R-X", "R-P30", "MR", "R-S", "R-C"];
        var restrictionOptions = [];
        var i = null;
        for (i = 0; i < restrictionCodes.length; i += 1) {
            restrictionOptions.push(formSelectOptionItem(restrictionCodes[i]));
        }
        var restrictionCode = formRow([formRowWholeColumn(formGroup(makeAFormInputRequired(formSelectField("restriction-code", restrictionOptions))))]);
        var restrictionComment = formRow([formRowWholeColumn(formGroup(formTextAreaField("restriction-comment", "There are financial records in this acquisition")))]);
        fieldset.appendChild(restrictionCode);
        fieldset.appendChild(restrictionComment);
        form.appendChild(fieldset);
        form.appendChild(submitButton());
        formdiv.html(form);
    }

    function emptyFormSwitchFunc(word) {
        if (word === 'donor' || word === 'source') {
            buildPersonForm(word);
        } else if (word === 'accession') {
            buildAccessionForm();
        } else if (word === 'acquisition') {
            buildAcquisitionForm();
        } else if (word === 'physmedia') {
            buildPhysmediaForm();
        } else if (word === 'restriction') {
            buildRestrictionForm();
        } else {
        }
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


    $(function() {
        var availableTags = getCollectionTitleList() //getRecordsByCategory('Collection').responseJSON.data.record_identifiers;
        $('input[name="collection-title"]').autocomplete({
            source: availableTags
        });
    });


    $(function() {
        $("#addEmail").click(function() {
            var emailDiv = document.getElementById("emails");
            var i = null;
            var array = emailDiv.getElementsByTagName("input");
            var name = null;
            var allnums = [];
            for (i = 0; i < array.length; i += 1) {
                name = parseInt(array[i].getAttribute("name").split("-")[1]);
                allnums.push(name);
            }
            var sortedAllNums = allnums.sort();
            var highestNum = sortedAllNums[sortedAllNums.length - 1];
            var newNumber = highestNum + 1;
            var newEmailInput = makeEmailInput(newNumber);

            addInputToGroupDiv(newEmailInput, "emails");
        });
    });

    $(function() {
        $("#addPhone").click(function() {
            var phoneDiv = document.getElementById("phone-numbers");
            var i = null;
            var array = phoneDiv.getElementsByTagName("input");
            var name = null;
            var allnums = [];
            for (i = 0; i < array.length; i += 1) {
                name = parseInt(array[i].getAttribute("name").split("-")[1]);
                allnums.push(name);
            }
            var sortedAllNums = allnums.sort();
            var highestNum = sortedAllNums[sortedAllNums.length - 1];
            var newNumber = highestNum + 1;
            var newEmailInput = makePhoneInput(newNumber);
            addInputToGroupDiv(newEmailInput, "phone-numbers");

        });
    });

    $(function() {
        $("#addAddress").click(function() {
            var addresses = document.getElementById("addresses");
            var i = null;
            var potentialDivs = addresses.getElementsByTagName("div");
            var addressDivs = [];
            var addressNum = null;
            var divId = null;
            for (i = 0; i < potentialDivs.length; i += 1) {
                divId = potentialDivs[i].getAttribute("id");
                if (divId !== null) {
                    addressNum = parseInt(divId.split('-')[1]);
                    addressDivs.push(addressNum);
                }
            }
            var sortedAllNums = addressDivs.sort();
            var highestNum = sortedAllNums[sortedAllNums.length - 1];
            var newNumber = highestNum + 1;
            var newAddress = buildAddressForm(newNumber);
            addInputToGroupDiv(newAddress, 'addresses');
        });
    });

    function savePhysmediaForm(thingToBeEdited) {
        var form = document.getElementById("physmedia-form");
        var forminputs = form.getElementsByClassName("form-control");
        var newObj = Object.create(null);
        var currentInput = null;
        var name = null;
        var i = null;
        for (i = 0; i < forminputs.length; i += 1) {
            currentInput = (forminputs[i]);
            name = currentInput.getAttribute("name");
            if (name.indexOf("label") > -1 && forminputs[i].value !== "") {
                newObj.Label = forminputs[i].value;
            } else if (name.indexOf("quantity") > -1 && forminputs[i].value !== "") {
                newObj.Quantity = forminputs[i].value;
            }
        }
        if (thingToBeEdited !== null) {
            var donors = JSON.parse(localStorage.getItem("Physical Media Information"));
            var donorkeys = Object.keys(donors);
            donors[thingToBeEdited] = newObj;
            localStorage.setItem("Physical Media Information", JSON.stringify(donors));
        } else if (localStorage.getItem("Physical Media Information") !== null) {
            var n = JSON.parse(localStorage.getItem("Physical Media Information"));
            var physmediaNumbered = Object.keys(n);
            var sortedPhysmediaNumbered = physmediaNumbered.sort();
            var lastPhysmediaNumber = sortedPhysmediaNumbered[sortedPhysmediaNumbered.length - 1];
            lastPhysmediaNumber = parseInt(lastPhysmediaNumber);
            var newPhysmediaNumber = lastPhysmediaNumber + 1;
            n[newPhysmediaNumber.toString()] = newObj;
            var stringN = JSON.stringify(n);
            localStorage.setItem("Physical Media Information", stringN);
        } else {
            var newPhysmedia = Object.create(null);
            newPhysmedia["0"] = newObj;
            localStorage.setItem("Physical Media Information", JSON.stringify(newPhysmedia));
        }
        var action = localStorage.getItem("action");
        var item = localStorage.getItem("acquisitionBeingCompleted");
        if (item !== null) {
            var newurl = "form.html?action=" + action + "&item=" + item;
        } else {
            newurl = "form.html?action=" + localStorage.getItem("action");
        }
        form.setAttribute("action", newurl);
    }

    function saveRestrictionForm(thingToBeEdited) {
        var form = document.getElementById("restriction-form");
        var forminputs = form.getElementsByClassName("form-control");
        var newObj = Object.create(null);
        var currentInput = null;
        var name = null;
        var i = null;
        for (i = 0; i < forminputs.length; i += 1) {
            currentInput = (forminputs[i]);
            name = currentInput.getAttribute("name");
            if (name.indexOf("restriction-code") > -1 && forminputs[i].value !== "") {
                newObj["Restriction Code"] = forminputs[i].value;
            } else if (name.indexOf("restriction-comment") > -1 && forminputs[i].value !== "") {
                newObj["Restriction Comment"] = forminputs[i].value;
            }
        }
        if (thingToBeEdited !== null) {
            var donors = JSON.parse(localStorage.getItem("Restriction Information"));
            var donorkeys = Object.keys(donors);
            donors[thingToBeEdited] = newObj;
            localStorage.setItem("Restriction Information", JSON.stringify(donors));
        } else if (localStorage["Restriction Information"] !== undefined) {
            var n = JSON.parse(localStorage.getItem("Restriction Information"));
            var restrictionNumbered = Object.keys(n);
            var sortedRestrictionNumbered = restrictionNumbered.sort();
            var lastRestrictionNumber = sortedRestrictionNumbered[sortedRestrictionNumbered.length - 1];
            lastRestrictionNumber = parseInt(lastRestrictionNumber);
            var newRestrictionNumber = lastRestrictionNumber + 1;
            n[newRestrictionNumber.toString()] = newObj;
            var stringN = JSON.stringify(n);
            localStorage.setItem("Restriction Information", stringN);
        } else {
            var newRestriction = Object.create(null);
            newRestriction["0"] = newObj;
            localStorage.setItem("Restriction Information", JSON.stringify(newRestriction));
        }
        var action = localStorage.getItem("action");
        var item = localStorage.getItem("acquisitionBeingCompleted");
        if (item !== null) {
            var newurl = "form.html?action=" + action + "&item=" + item;
        } else {
            newurl = "form.html?action=" + localStorage.getItem("action");
        }
        form.setAttribute("action", newurl);
    }

    function savePersonForm(word, thingToBeEdited) {
        var form = document.getElementById(word + "-form");
        var displayWord = displayAWord(word);
        var forminputs = form.getElementsByClassName("form-control");
        var i = null;
        var currentInput = null;
        var name = null;
        var newObj = Object.create(null);
        var emails = Object.create(null);
        var phones = Object.create(null);
        var addressName = null;
        var emailNum = null;
        var phoneNum = null;
        var addressNumber = null;
        var field = null;
        var fieldWord = null;
        var displayField = null;
        var displayPart = null;
        var k = null;
        for (i = 0; i < forminputs.length; i += 1) {
            currentInput = forminputs[i];
            name = currentInput.getAttribute("name");
            if (name.indexOf('email-') > -1 && forminputs[i].value !== "") {
                emailNum = name.split("email-")[1];
                if (newObj.Email === undefined) {
                    newObj.Email = Object.create(null);
                }
                newObj.Email[emailNum] = forminputs[i].value;
            } else if (name.indexOf('phone') > -1 && forminputs[i].value !== "") {
                phoneNum = name.split("phone-")[1];
                if (newObj.Phone === undefined) {
                    newObj.Phone = Object.create(null);
                }
                newObj.Phone[phoneNum] = forminputs[i].value;
            } else if (name.indexOf('first-name') > -1 && forminputs[i].value !== "") {
                newObj["First Name"] = forminputs[i].value;
            } else if (name.indexOf('last-name') > -1 && forminputs[i].value !== "") {
                newObj["Last Name"] = forminputs[i].value;
            } else if (name.indexOf('affiliated-organization') > -1 && forminputs[i].value !== "") {
                newObj["Affiliated Organization"] = forminputs[i].value;
            } else if (name.indexOf('job-title') > -1 && forminputs[i].value !== "") {
                newObj["Job Title"] = forminputs[i].value;
            } else if (name.indexOf('address-information') > -1 && forminputs[i].value !== "") {
                addressName = name.split("address-information-")[1];
                addressNumber = addressName[0];
                if (newObj["Address Information"] === undefined) {
                    newObj["Address Information"] = Object.create(null);
                }
                field = addressName.split(addressNumber + '-')[1];
                fieldWord = field.split('-');
                displayField = "";
                for (k = 0; k < fieldWord.length; k += 1) {
                    displayPart = displayAWord(fieldWord[k]);
                    displayField += " " + displayPart;
                }
                if (newObj["Address Information"][addressNumber] === undefined) {
                    newObj["Address Information"][addressNumber] = Object.create(null);
                }
                if (newObj["Address Information"][addressNumber][displayField] === undefined) {
                    newObj["Address Information"][addressNumber][displayField] = forminputs[i].value;
                }
            }
        }
        if (thingToBeEdited !== null) {
            var donors = JSON.parse(localStorage.getItem(displayWord));
            var donorkeys = Object.keys(donors);
            donors[thingToBeEdited] = newObj;
            localStorage.setItem(displayWord, JSON.stringify(donors));

        } else if (localStorage[displayWord] !== undefined) {
            var n = JSON.parse(localStorage.getItem(displayWord));
            var donorsNumbered = Object.keys(n);
            var sortedDonorsNumbered = donorsNumbered.sort();
            var lastDonorNumber = sortedDonorsNumbered[sortedDonorsNumbered.length - 1];
            lastDonorNumber = parseInt(lastDonorNumber);
            var newDonorNumber = lastDonorNumber + 1;
            n[newDonorNumber.toString()] = newObj;
            var stringN = JSON.stringify(n);
            localStorage.setItem(displayWord, stringN);
        } else {
            var newPerson = Object.create(null);
            newPerson["0"] = newObj;
            localStorage.setItem(displayWord, JSON.stringify(newPerson));
        }
        var action = localStorage.getItem("action");
        var item = localStorage.getItem("acquisitionBeingCompleted");
        if (item !== null) {
            var newurl = "form.html?action=" + action + "&item=" + item;
        } else {
            newurl = "form.html?action=" + localStorage.getItem("action");
        }
        form.setAttribute("action", newurl);
    }

    function loadAList(listName) {
        var dl = document.createElement("dl");
        if (listName.split("s-").length == 2) {
            var editType = listName.split("s-")[0];
        } else if (listName.split('-').length == 2) {
            var editType = listName.split('-')[0];
        }
        var listDiv = $("#" + listName);
        var localStorageLookup = null;
        if (listName === "donors-list") {
            localStorageLookup = "Donor";
        } else if (listName === "sources-list") {
            localStorageLookup = "Source";
        } else if (listName === "restriction-list") {
            localStorageLookup = "Restriction Information";
        } else if (listName === "physmedia-list") {
            localStorageLookup = "Physical Media Information";
        } else {
        }
        var dataToLoad = JSON.parse(localStorage.getItem(localStorageLookup));
        if (dataToLoad !== null) {
            var n = Object.keys(dataToLoad);
            var i = null;
            var dt = null;
            var dd = null;
            var string = null;
            for (i = 0; i < n.length; i += 1) {
                if (listName === "donors-list") {
                    string = dataToLoad[i]["First Name"] + " " + dataToLoad[i]["Last Name"];
                    dt = document.createElement("dt");
                    dt.appendChild(document.createTextNode(string));
                    dl.appendChild(dt);
                } else if (listName === "sources-list") {
                    string = dataToLoad[i]["First Name"] + " " + dataToLoad[i]["Last Name"];
                    dt = document.createElement("dt");
                    dt.appendChild(document.createTextNode(string));
                    dl.appendChild(dt);
                } else if (listName === "restriction-list") {
                    dt = document.createElement("dt");
                    dt.appendChild(document.createTextNode(dataToLoad[i]["Restriction Code"]));
                    dl.appendChild(dt);
                    if (dataToLoad[i]["Restriction Comment"] !== undefined) {
                        dd = document.createElement("dd");
                        dd.appendChild(document.createTextNode(dataToLoad[i]["Restriction Comment"]));
                        dl.appendChild(dt);
                    }
                } else if (listName === "physmedia-list") {
                    dt = document.createElement("dt");
                    dt.appendChild(document.createTextNode(dataToLoad[i].Label + " (amount: " + dataToLoad[i].Quantity + ")"));
                }
                var dd = document.createElement("dd");
                var itemNum = i;
                itemNum = itemNum.toString();

                var editButton = document.createElement("a");
                editButton.setAttribute("href", "form.html?action=" + editType + "&item=" + itemNum);
                editButton.setAttribute("class", "btn btn-primary btn-sm");
                editButton.setAttribute("role", "button")
                editButton.setAttribute("id", "edit-" + editType + (i + 1).toString());
                editButton.appendChild(document.createTextNode("Edit"));

                var deleteButton = document.createElement("button");
                deleteButton.setAttribute("class", "btn btn-danger btn-sm");
                deleteButton.setAttribute("role", "button")
                deleteButton.setAttribute("id", "delete-" + editType + "-" + i.toString());
                deleteButton.appendChild(document.createTextNode("Delete"));

                dd.appendChild(editButton);
                dd.appendChild(document.createTextNode(" "));
                dd.appendChild(deleteButton);
                dl.appendChild(dt);
                dl.appendChild(dd);
                listDiv.html(dl);
            }
        }
    }

    function addFieldToARecord(recordID, field, value) {
        var fieldParts = field.split("-");
        var fieldName = null;
        if (field.indexOf("physical-media-information") > -1) {
            var num = fieldParts[3];
            var field = displayAMachinePhrase(fieldParts[fieldParts.length - 1]).replace(' ', '');
            fieldName = "Physical Media Information" + num.toString() + '.' + field + "0";
        } else if (field.indexOf("restriction-information") > -1) {
            var num = fieldParts[2];
            var field = displayAMachinePhrase(fieldParts[fieldParts.length - 2] + '-' + fieldParts[fieldParts.length - 1]).replace(' ', '');
            fieldName = "Restriction Information" + num.toString() + '.' + field + "0";
        } else if (field.indexOf("address-information") > -1) {
            var type = fieldParts[0];
            var num = fieldParts[1];
            var addressInfoNum = fieldParts[4];
            var field = fieldParts.splice(5, fieldParts.length);
            var aString = "";
            for (var n in field) {
                aString = aString + "-" + field[n];
            }
            aString = displayAMachinePhrase(aString.replace('-', '')).replace(' ', '');
            fieldName = type + num.toString() + '.' + "Address Information" + addressInfoNum.toString() + '.' + aString + '0';
        } else if (field.indexOf("email") > -1 || field.indexOf("phone") > -1) {
            var num = fieldParts[1];
            var type = displayAMachinePhrase(fieldParts[0]).replace(' ', '');
            var field = displayAMachinePhrase(fieldParts[2]).replace(' ', '');
            var fieldNum = fieldParts[3] - 1;
            fieldNum = fieldNum.toString();
            fieldName = type + num + '.' + field + fieldNum;
        } else if (field.indexOf("last-name") > -1 || field.indexOf("first-name") > -1) {
            var num = fieldParts[1] - 1;
            var type = fieldParts[0];
            var field = fieldParts[fieldParts.length - 2] + "-" + fieldParts[fieldParts.length - 1];
            fieldName = displayAMachinePhrase(type).replace(' ', '') + num.toString() + '.' + displayAMachinePhrase(field).replace(' ', '') + "0";
        } else {
            fieldName = displayAMachinePhrase(field).replace(' ', '') + "0";
            if (fieldName === "Mixed Acquisition") {
                if (value === "yes") {
                    value = Boolean(true);
                } else {
                    value = Boolean(false);
                }
            }
        }


	if (fieldName.indexOf('-') > -1) {
		fieldName = fieldName.replace('-', '');
		fieldName = fieldName.replace('-', '');
	} 
	if (value !== "") {
		if (value === "false") {
			value = Boolean(false);
		} 
		if (value === "true") {
			value = Boolean(true);
		}
       	 	else {
			value = value;
		}	
		addKeyValueToRecord(recordID, fieldName, value);
	}

    }

    function saveMajorForm(formTypeString) {
        var form = document.getElementById(formTypeString + "-form");
        var inputs = form.getElementsByTagName("input");
        var textareas = form.getElementsByTagName("textarea");
        var newObj = Object.create(null);
        var currentInput = null;
        var name = null;
        var i = null;
        var recordID = postNewRecord();
        recordID = recordID.responseJSON.data.record_identifier;
        var category = displayAWord(formTypeString);
        var fullcategory = category + "Record";
        var added = addRecordToCategory(displayAWord(formTypeString) + "Record", recordID);
        for (i = 0; i < inputs.length; i += 1) {
            var cur = inputs[i];
            if (cur.getAttribute("type") === "checkbox") {
                var t = $("input[name=\'" + cur.getAttribute("name") + "\']");
                var value = t.is(":checked").toString();
            } else if (cur.value === "") {
                var value = null;
            } else {
                var value = cur.value;
            }
            if (value !== null) {
                addFieldToARecord(recordID, cur.getAttribute("name"), value)
            }
        }
        for (i = 0; i < textareas.length; i += 1) {
            var cur = textareas[i];
            addFieldToARecord(recordID, cur.getAttribute("name"), cur.value);
        }
        return recordID;
    }

    $(function() {
        $("#donor-form").validator().on('submit', function(e) {
            if (!e.isDefaultPrevented()) {
                var p = getURLQueryParams();
                var editable = findStringInArray(p, "item=");
                if (editable !== null) {
                    savePersonForm("donor", editable.split("=")[1]);
                } else {
                    savePersonForm("donor", null);
                }
            }
        });
    });

    $(function() {
        $("#source-form").validator().on('submit', function(e) {
            if (!e.isDefaultPrevented()) {
                var p = getURLQueryParams();
                var editable = findStringInArray(p, "item=");
                if (editable !== null) {
                    answer = savePersonForm("source", editable.split("=")[1]);
                } else {
                    savePersonForm("source", null);
                }
            }

        });
    });

    $(function() {
        $("#physmedia-form").validator().on('submit', function(e) {
            if (!e.isDefaultPrevented()) {
                var p = getURLQueryParams();
                var editable = findStringInArray(p, "item=");
                if (editable !== null) {
                   savePhysmediaForm(editable.split("=")[1]);
                } else {
                   savePhysmediaForm(null);
                }
            }
        });
    });

    $(function() {
        $("#restriction-form").validator().on('submit', function(e) {
            if (!e.isDefaultPrevented()) {
                var p = getURLQueryParams();
                var editable = findStringInArray(p, "item=");
                if (editable !== null) {
                    saveRestrictionForm(editable.split("=")[1]);

                } else {
                    saveRestrictionForm(null);
                }
            }
        });
    });

    $(function() {
        $("#accession-form").validator().on('submit', function(e) {
            if (!e.isDefaultPrevented()) {
                var newRecordID = saveMajorForm("accession")
        	localStorage.clear();
		this.setAttribute("action", "receipt.html?id=" + newRecordID + "&action=accession");
            }
        });
    });

    $(function() {
        $("#acquisition-form").validator().on('submit', function(e) {
            if (!e.isDefaultPrevented()) {
                var newRecordID = saveMajorForm("acquisition");
		localStorage.clear();
		this.setAttribute("action", "receipt.html?id=" + newRecordID + "&action=acquisition");
               	 
            }
        });
    });

    $(function() {
        $("a[name='cancel']").click(function() {
            var cancelAction = localStorage.getItem("action");
            var newurl = "form.html?action=" + cancelAction;
            if (localStorage.getItem("acquisitionBeingCompleted") !== null) {
                newurl += "&item=" + localStorage.getItem("acquisitionBeingCompleted");
            }
            this.setAttribute("href", newurl);
        });
    });

    $(function() {
        $("#new-donor-button").click(function() {
            var last = localStorage.getItem("action");
            location.replace("form.html?action=donor&last=" + last);
        });
    });

    $(function() {
        $("#start-over").click(function() {
            var confirmAction = confirm("Are you sure?");
            if (confirmAction == true) {
                var cancelAction = localStorage.getItem("action");
                localStorage.clear();
                location.replace("form.html?action=" + cancelAction);
            }
        });
    });

    $(function() {
        $("#new-source-button").click(function() {
            var last = localStorage.getItem("action");
            location.replace("form.html?action=source&last=" + last);
        });
    });

    $(function() {
        $("#new-restriction-button").click(function() {
            var last = localStorage.getItem("action");
            location.replace("form.html?action=restriction&last=" + last);
        });
    });

    $(function() {
        $("#new-physmedia-button").click(function() {
            location.replace("form.html?action=physmedia");
        });
    });

    $(function() {
	$("#start-over").click(function() {
	    localStorage.clear();
	});
    });

    $(function() {
        $("button[id^='delete']").click(function() {
            var id = this.getAttribute("id");
            var idParts = id.split('-');
            var idCategory = idParts[1];
            if (idCategory == "physmedia") {
                var word = "Physical Media Information";
            } else if (idCategory == "restriction") {
                var word = "Restriction Information";
            } else {
                word = displayAWord(idParts[1]).replace(' ', '');
            }
            var l = JSON.parse(localStorage.getItem(word));
            var record = idParts[2];
            delete l[record];
            localStorage.setItem(word, JSON.stringify(l));
            location.reload();
        });
    });

    $(function() {
        $('input[name="gift-acknowledgement-information-received"]').datepicker();
    });

    $(function() {
        $('input[name="receipt-letter-information-sent"]').datepicker();
    });

    $(function() {
        $('input[name="date-files-received"]').datepicker();
    });

    $(function() {
        $('input[name="date-materials-received"]').datepicker();
    });

    var params = getURLQueryParams();
    var id = findStringInArray(params, "item=");
    var decision = findStringInArray(params, "action=");
    if (decision === "") {
        decision = null;
    } else {
        decision = decision.split("action=")[1];
    }
    if (decision === 'accession' || decision === 'acquisition') {
        localStorage.setItem("action", decision);
    }
    if (id === "" || id === null) {
        id = null;
    } else {
        id = id.split("item=")[1];
    }
    if (id !== null) {
        prePopSwitchFunc(decision, id);
    } else {
        emptyFormSwitchFunc(decision);
    }
    loadAList("donors-list");
    loadAList("sources-list");
    loadAList("physmedia-list");
    loadAList("restriction-list");
});
