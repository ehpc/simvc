// str: "143_44+547_44+90"
// replaceTextNotBetween(str, "_", "+", "4", "0")
// output: "103_44+507_44+90"
// So it replaces substrings outside of substrings
// WARNING: won't work if leftText == rightText
function replaceTextNotBetween(text, leftText, rightText, searchText, replaceText)
{
    // locate right border
    var parts = text.split(rightText);
    for (var i = 0; i < parts.length; i++)
    {
        var part = parts[i];
        // locate left border
        if (part.indexOf(leftText) != -1)
        {
            var splits = part.split(leftText);
            // substring that we do not want to hurt is in array's tail
            for (var j = 0; j < splits.length - 1; j++)
            {
                // We can send complex replace function instead of plain replace
                if (typeof(searchText) == "function")
                {
                    splits[j] = searchText(splits[j]);
                }
                else
                {
                    splits[j] = splits[j].split(searchText).join(replaceText);
                }
            }
            part = splits.join(leftText);
            parts[i] = part;
        }
        // If there is no left border, we should process that substring
        else
        {
            if (typeof(searchText) == "function")
            {
                parts[i] = searchText(part);
            }
            else
            {
                parts[i] = part.split(searchText).join(replaceText);
            }
        }
    }
    var res = parts.join(rightText);
    return res;
}

// str: "143_44+547_44+90"
// replaceTextBetween(str, "_", "+", "4", "0")
// output: "143_00+547_00+90"
// So it replaces substrings inside of substrings
// WARNING: won't work if leftText == rightText
function replaceTextBetween(text, leftText, rightText, searchText, replaceText)
{
    var parts = text.split(rightText);
    for (var i = 0; i < parts.length; i++)
    {
        var part = parts[i];
        if (part.indexOf(leftText) != -1)
        {
            var splits = part.split(leftText);
            splits[splits.length-1] = splits[splits.length-1].split(searchText).join(replaceText);
            part = splits.join(leftText);
            parts[i] = part;
        }
    }
    var res = parts.join(rightText);
    return res;
}


// Convert text to html
function textTransformToHtml(text)
{
    var html = text;
    //html = html.replace(/&/gi, "&amp;");
    //html = html.replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
    html = html.replace(/\r\n/gi, "<br/>").replace(/\n/gi, "<br/>");
    html = html.replace(/\[h(\d)\](.+?)\[\/h\d\]/gi, "<h$1>$2</h$1>");

    html = html.replace(/\[q\](.+?)\[q\]/g, '<i class="ttQuoted">$1</i>');
    html = html.replace(/\[f\](.+?)\[f\]/g, '<b class="ttFilename">$1</b>');
    html = html.replace(/\[space=(.+?)\]/g, '<span style="margin-right: $1">&nbsp;</span>');
    html = html.replace(/\[mdash\]/g, '&mdash;');

    html = html.replace(/\[img(.*?)\](.+?)\[\/img\]/g, '<img $1 src="$2" />');
    html = html.replace(/\[a(.*?)\](.+?)\[\/a\]/g, '<a $1 target="_blank">$2</a>');

    html = html.replace(/<br\/>(\d)\. /g, '<br/><b class="numlist">$1.</b> ');

    // word-highliter
    var words = new Array();
    var rx = /\[wh=([abcdefABCDEF0-9]+?)\](.+?)\[wh\]/g;
    var match;
    while (match = rx.exec(html))
    {
        var color = match[1];
        var word = match[2];
        words[word] = color;
    }
    html = html.replace(/\[wh=[abcdefABCDEF0-9]+?\].+?\[wh\]/gi, "");
    for (word in words)
    {
        color = words[word];
        html = replaceTextNotBetween(html, "[code", "[/code]", word, '<span style="color: #' + color + '">' + word + '</span>');
    }


    // prepare code for syntax highlighting
    html = html.replace(/\[code (class="brush\: .+?")\](.+?)\[\/code\]/gi, "<pre $1>$2</pre>");
    html = replaceTextBetween(html, '<pre class="brush', "</pre>", "<br/>", "\n");

    return html;
}

function textTransformHtmlSpecial(text, reverse)
{
    var html = text;
    html = html.replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
    html = html.replace(/&amp;/gi, "&");
    if (!reverse)
    {
        html = html.replace(/&/gi, "&amp;");
        html = html.replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
    }
    return html;
}