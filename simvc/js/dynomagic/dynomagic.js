/*
 * Dynomagic Javascript Library
 * Copyright 2010, Eugene Maslovich
 * ehpc@yandex.ru
 * http://ehpc.org.ru/dynomagic/
 *
 */

function DynomagicI18n(){}
DynomagicI18n.cancelButton = "отмена";
DynomagicI18n.saveButton = "сохранить";

function DynomagicInputType(){}
DynomagicInputType.textbox = "Textbox";
DynomagicInputType.rich = "Rich";
DynomagicInputType.checkbox = "Checkbox";

function DynomagicEditorType(){}
DynomagicEditorType.textbox = "dynoInput" + DynomagicInputType.textbox;
DynomagicEditorType.rich = "dynoInput" + DynomagicInputType.rich;
DynomagicEditorType.checkbox = "dynoInput" + DynomagicInputType.checkbox;

function Dynomagic()
{
    var dynoTablePrefix = "dynoTable_";
    var dynoFieldPrefix = "dynoField_";
    var dynoUriPrefix = "dynoUri";
    var dynoUriUpdatePrefix = "dynoUriUpdate";
    var dynoInputTypePrefix = "dynoInputType";
    var dynoHidden = "dynoHidden";
    var dynoInvisible = "dynoInvisible";
    var dynoSyntax = "dynoSyntax";
    /* [ 
     *    [
     *      tableName,
     *      tableDom,
     *      uri,
     *      id,
     *      fields => [
     *                  fieldName,
     *                  fieldDom,
     *                  fieldValue,
     *                  editorDom,
     *                  editorType,
     *                  editorLabel,
     *                  fieldHidden,
     *                  fieldInvisible
     *                ]
     *    ],
     *    [
     *      ...
     *    ]
     * ]
     */
    var dynoTables = new Array();

    // Get suffix from class
    var extractValueFromClass = function (classPrefix, el)
    {
        var className = el.attr("className");
        if (className)
        {
            classes = el.attr("className").split(" ");
            for (var i = 0; i < classes.length; i++)
            {
                if (classes[i].indexOf(classPrefix) >= 0)
                {
                    var value = classes[i].replace(classPrefix, "");
                    return value;
                }
            }
        }
        return null;
    }

    // Returns array of elements which class attribute starts with prefix
    // el - from where to start searching
    // RETURN: [["dom"=>jquery, "value"=>string], ...]
    var findByClassPrefix = function (classPrefix, el)
    {
        var res = new Array();
        el.find("*").each(function () {
            var className = $(this).attr("className");
            if (className)
            {
                var value = extractValueFromClass(classPrefix, $(this));
                if (value !== null)
                {
                    var entry = new Array();
                    entry["dom"] = $(this);
                    entry["value"] = value;

                    var value2 = extractValueFromClass(dynoInputTypePrefix, $(this));
                    if (value2 === null)
                        entry["inputType"] = DynomagicInputType.textbox;
                    else
                        entry["inputType"] = value2;

                    var hidden = extractValueFromClass(dynoHidden, $(this));
                    if (hidden === null)
                        entry["hidden"] = false;
                    else
                        entry["hidden"] = true;

                    var invisible = extractValueFromClass(dynoInvisible, $(this));
                    if (invisible === null)
                        entry["invisible"] = false;
                    else
                        entry["invisible"] = true;

                    var syntax = extractValueFromClass(dynoSyntax, $(this));
                    if (syntax === null)
                        entry["syntax"] = false;
                    else
                        entry["syntax"] = true;

                    res.push(entry);
                }
            }
        });
        return res;
    }

    // Fill editor
    var fillEditorN = function (n)
    {
        for (j = 0; j < dynoTables[n]["fields"].length; j++)
        {
            var fieldValue = dynoTables[n]["fields"][j]["fieldValue"];
            fieldValue = textTransformHtmlSpecial(fieldValue, true);
            var editorDom = dynoTables[n]["fields"][j]["editorDom"];
            var editorType = dynoTables[n]["fields"][j]["editorType"];
            if (editorType == DynomagicEditorType.textbox)
            {
                editorDom.val(fieldValue);
            }
            else if (editorType == DynomagicEditorType.rich)
            {
                editorDom.val(fieldValue);
            }
            else if (editorType == DynomagicEditorType.checkbox)
            {
                if (parseInt(fieldValue) != 0)
                {
                    editorDom.attr("checked", "checked");
                }
                else
                {
                    editorDom.removeAttr("checked");
                }
            }
        }
    }

    // Fill editor
    var saveEditorN = function (n)
    {
        var tableDom = dynoTables[n]["tableDom"];
        progressShowProgress(tableDom, "идет сохранение");

        var res = {};
        for (j = 0; j < dynoTables[n]["fields"].length; j++)
        {
            var editorDom = dynoTables[n]["fields"][j]["editorDom"];
            var editorType = dynoTables[n]["fields"][j]["editorType"];
            var editorValue;
            if (editorType == DynomagicEditorType.textbox)
            {
                editorValue = editorDom.val();
            }
            else if (editorType == DynomagicEditorType.rich)
            {
                editorValue = editorDom.val();
            }
            else if (editorType == DynomagicEditorType.checkbox)
            {
                editorValue = editorDom.is(':checked') ? 1 : 0;
            }
            // escape
            editorValue = textTransformHtmlSpecial(editorValue, false);
            var fieldName = dynoTables[n]["fields"][j]["fieldName"];
            res[fieldName] = editorValue;
        }
        res.id = dynoTables[n]["id"];
        var uriUpdate = dynoTables[n]["uriUpdate"];
        $.post(
            uriUpdate,
            {data : JSON.stringify(res)},
            function (data) {
                progressHideProgress(tableDom);
                fillN(n, false);
            }
        );
    }

    // Find all dyno fields
    // get tables
    this.run = function()
    {
        var tables = findByClassPrefix(dynoTablePrefix, $("*"));
        for (var i = 0; i < tables.length; i++)
        {
            //get uri
            var uri = $.trim(findByClassPrefix(dynoUriPrefix, tables[i]["dom"])[0]["dom"].text());
            var uriUpdate = $.trim(findByClassPrefix(dynoUriUpdatePrefix, tables[i]["dom"])[0]["dom"].text());
            var table = new Array();
            table["tableName"] = tables[i]["value"];
            table["tableDom"] = tables[i]["dom"];
            table["uri"] = uri;
            table["uriUpdate"] = uriUpdate;
            table["fields"] = new Array();
            // get fields
            var fields = findByClassPrefix(dynoFieldPrefix, tables[i]["dom"]);
            for (var j = 0; j < fields.length; j++)
            {
                var fieldName = fields[j]["value"];
                var fieldDom = fields[j]["dom"];
                var fieldInputType = fields[j]["inputType"];
                var field = new Array();
                field["fieldName"] = fieldName;
                field["fieldDom"] = fieldDom;
                field["fieldInputType"] = fieldInputType;
                field["fieldHidden"] = fields[j]["hidden"];
                field["fieldInvisible"] = fields[j]["invisible"];
                field["fieldSyntax"] = fields[j]["syntax"];
                var label = fieldDom.find(".dynoLabel");
                field["editorLabel"] = label.text();
                label.remove();
                table["fields"].push(field);
            }
            dynoTables.push(table);
        }
        this.fillAll(true);
    }

    // Create Nth editor
    var createEditorN = function (n)
    {
        var tableName = dynoTables[n]["tableName"];
        var tableDom = dynoTables[n]["tableDom"];
        html = '<div class="dynoEditor"></div>';
        var dynoEditor = $(html);
        dynoEditor.appendTo(tableDom);
        for (j = 0; j < dynoTables[n]["fields"].length; j++)
        {
            var fieldName = dynoTables[n]["fields"][j]["fieldName"];
            var fieldDom = dynoTables[n]["fields"][j]["fieldDom"];
            var fieldHidden = dynoTables[n]["fields"][j]["fieldHidden"];
            var editorLabel = dynoTables[n]["fields"][j]["editorLabel"];
            if (fieldHidden)
            {
                fieldDom.show();
            }
            var fieldInputType = dynoTables[n]["fields"][j]["fieldInputType"];
            var editorDom;
            var editorType = "dynoInput" + fieldInputType;
            if (fieldInputType == DynomagicInputType.textbox)
            {
                html = '<input id="dyno' + fieldDom.attr('id') + '" class="' + editorType + '" type="text" spellcheck="false" />';
                editorDom = $(html);
                editorDom.appendTo(dynoEditor);
            }
            else if (fieldInputType == DynomagicInputType.rich)
            {
                html = '<textarea id="dyno' + fieldDom.attr('id') + '" class="' + editorType + '"></textarea>';
                editorDom = $(html);
                editorDom.appendTo(dynoEditor);
            }
            else if (fieldInputType == DynomagicInputType.checkbox)
            {
                html = '<input id="dyno' + fieldDom.attr('id') + '" class="' + editorType + '" type="checkbox" />';
                editorDom = $(html);
                editorDom.appendTo(dynoEditor);
            }
            editorDom.wrap('<div class="dynoEditable"></div>');
            if (editorLabel != "")
            {
                if (fieldInputType == DynomagicInputType.checkbox)
                {
                    editorDom.after(editorLabel);
                }
                else
                {
                    editorDom.before('<div class="dynoEditableLabel">' + editorLabel + '</div>');
                }
            }
            if (fieldInputType == DynomagicInputType.rich)
            {
                editorDom.TextAreaResizer();
            }
            if (!fieldDom.is(":visible"))
                editorDom.hide();
            dynoTables[n]["fields"][j]["editorDom"] = editorDom;
            dynoTables[n]["fields"][j]["editorType"] = editorType;
            // positioning
            editorDom.css("top", fieldDom.offset().top + parseInt(fieldDom.css("borderTopWidth"), 10) - parseInt(editorDom.css("borderTopWidth"), 10) - 1);
            editorDom.css("left", fieldDom.offset().left + parseInt(fieldDom.css("borderLeftWidth"), 10) - parseInt(editorDom.css("borderLeftWidth"), 10));
            if (fieldInputType != DynomagicInputType.checkbox)
            {
                editorDom.css("width", fieldDom.css("width"));
                editorDom.css("height", fieldDom.css("height"));
            }
            if (fieldHidden)
            {
                fieldDom.hide();
            }
        }
        // save/cancel buttons
        html = '<div class="dynoButtons"></div>';
        var buttonsDom = $(html);
        buttonsDom.appendTo(dynoEditor);
        html = '<input id="dynoCancel' + fieldDom.attr('id') + '" class="dynoCancel" type="button" value="' + DynomagicI18n.cancelButton + '" />';
        var cancelDom = $(html);
        cancelDom.appendTo(buttonsDom);
        cancelDom.click(function () {
            dynoEditor.hide();
            fillEditorN(n);
        });
        html = '<input id="dynoSave' + fieldDom.attr('id') + '" class="dynoSave" type="button" value="' + DynomagicI18n.saveButton + '" />';
        var saveDom = $(html);
        saveDom.appendTo(buttonsDom);
        saveDom.click(function () {
            dynoEditor.hide();
            saveEditorN(n);
        });
        // positioning buttons
        buttonsDom.css("top", tableDom.offset().top + parseInt(tableDom.css("height"), 10));
        saveDom.css("left", cancelDom.offset().left + parseInt(cancelDom.css("width"), 10));

        // show/hide button
        html = '<div class="dynoShowHideButton"><img src="' + dynomagicImgUri + 'showhide.png" width="16" height="16" /></div>';
        var showhideDom = $(html);
        showhideDom.appendTo(tableDom);
        showhideDom.css("top", tableDom.offset().top + 5);
        showhideDom.css("left", parseInt(tableDom.css("width"), 10) - parseInt(showhideDom.css("width"), 10));
        showhideDom.click(function () {
            if (dynoEditor.is(":visible"))
            {
                dynoEditor.hide();
            }
            else
            {
                dynoEditor.show();
            }
        });
        showhideDom.hide();

        dynoEditor.hide();
        tableDom.hover(
            function () {
                showhideDom.show();
            },
            function () {
                showhideDom.hide();
            }
        );
        var tableDomborderTopWidth = parseInt(tableDom.css("borderTopWidth"), 10);
        if (isNaN(tableDomborderTopWidth)) tableDomborderTopWidth = 0;
        var dynoEditorborderTopWidth = parseInt(dynoEditor.css("borderTopWidth"), 10);
        if (isNaN(dynoEditorborderTopWidth)) dynoEditorborderTopWidth = 0;
        var tableDomborderLeftWidth = parseInt(tableDom.css("borderLeftWidth"), 10);
        if (isNaN(tableDomborderLeftWidth)) tableDomborderLeftWidth = 0;
        var dynoEditorborderLeftWidth = parseInt(dynoEditor.css("borderLeftWidth"), 10);
        if (isNaN(dynoEditorborderLeftWidth)) dynoEditorborderLeftWidth = 0;

        dynoEditor.css("top", tableDom.offset().top + tableDomborderTopWidth - dynoEditorborderTopWidth - 1);
        dynoEditor.css("left", tableDomborderLeftWidth - dynoEditorborderLeftWidth);

    }


    // Fills Nth element with data
    var fillN = function (n, createEditor)
    {
        var tableDom = dynoTables[n]["tableDom"];
        progressShowProgress(tableDom, "загрузка данных");
        var tableName = dynoTables[n]["tableName"];
        var uri = dynoTables[n]["uri"];
        $.getJSON(uri, function(data) {
            var table = eval("data.db."+tableName);
            for (j = 0; j < dynoTables[n]["fields"].length; j++)
            {
                var fieldName = dynoTables[n]["fields"][j]["fieldName"];
                var fieldDom = dynoTables[n]["fields"][j]["fieldDom"];
                var fieldInvisible = dynoTables[n]["fields"][j]["fieldInvisible"];
                if (fieldInvisible)
                {
                    fieldDom.hide();
                }
                var fieldValue = eval("table."+fieldName);
                dynoTables[n]["fields"][j]["fieldValue"] = fieldValue;
                // Use special text syntax or not?
                var fieldSyntax = dynoTables[n]["fields"][j]["fieldSyntax"];
                if (fieldSyntax)
                {
                    fieldDom.html(textTransformToHtml(fieldValue));
                    youtubinize(fieldDom);
                }
                else
                {
                    fieldDom.html(fieldValue);
                }
            }
            var rowId = eval("table.id");
            dynoTables[n]["id"] = rowId;
            if (createEditor)
                createEditorN(n);
            fillEditorN(n);
            if (typeof(SyntaxHighlighter) !== "undefined")
            {
                SyntaxHighlighter.highlight();
            }
            progressHideProgress(tableDom);
        });
    }

    // Fill element data by it's tableName
    this.fillTable = function (tableName)
    {
        for (i = 0; i < dynoTables.length; i++)
        {
            if (dynoTables[i]["tableName"] == tableName)
            {
                fillN(i);
            }
        }
    }

    // Fill all available elements
    this.fillAll = function (createEditor)
    {
        for (i = 0; i < dynoTables.length; i++)
        {
            fillN(i, createEditor);
        }
    }

    var youtubinize = function(dom)
    {
        dom.find("a.dynoYoutube").each(function () {
            var width = $(this).attr("width");
            var height = $(this).attr("height");
            var url = $(this).attr("href");
            $(this).youtubin({
                swfWidth : width,
                swfHeight : height
            });
        });
    }

    this.staticRun = function (value, dom)
    {
        dom.html(textTransformToHtml(value));
        youtubinize(dom);
        SyntaxHighlighter.all();
    }
}


/*
 * table, field
 * 1. fetch data from server
 * 2. fill div with data
 * 3. edit button
 * 4. editor
 * 5. pull data to server
 * 6. refresh
 */