/* $version_start$ 21/04/2009$eGainBlue$1.0 $version_end$ */
/**
 * Javascript functions used in all the templates
 */

function getForm(form)
{
	return typeof (form) == 'string' ? document.getElementById(form) : form;
}

function getFormElement(form, name)
{
	return getForm(form).elements[name];
}

function getFormValue(form, name)
{
	return getFormElement(form, name).value;
}

// Set value of the named input in the specified form (create the element if
// necessary)
function setFormValue(form, inputName, value)
{
	if (false)
		alert(form + ' ' + inputName + ' ' + value)

	form = getForm(form);
	if (getFormElement(form, inputName) != null)
	{
		getFormElement(form, inputName).setAttribute('value', value);
		getFormElement(form, inputName).value = value;
		return;
	}

	/*
	 * Create and initialize a hidden input, and use browser sniffing to determine if IE (required
	 * to work around IE bugs) See
	 * http://webbugtrack.blogspot.com/2007/10/bug-235-createelement-is-broken-in-ie.html for more
	 * information.
	 */
	var isIE = navigator.userAgent.indexOf('MSIE') >= 0;
	// var isIE9 = ($.browser.msie && /9.0/.test(navigator.userAgent));
	// fix tkt 6308 (https://gist.github.com/ddiaz/1993311)
	var ie = (function(){
		var undef,v = 3,div = document.createElement('div'),all = div.getElementsByTagName('i');
		while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);
		return v > 4 ? v : undef;}());
	isIE9 = (ie >= 9);
	isIE10 = navigator.userAgent.indexOf("MSIE 10") > 0;	// FIX23 [fix tkt 7489]
	
	var input = null;
	if (!isIE || isIE9 || isIE10)
	{
		input = document.createElement('input');
		input.setAttribute('name', inputName);
	}
	else
	{
		try {
			input = document.createElement('<input name="' + inputName + '" />');
		} catch (e) {
			// fix tkt 7654 (fallback for IE emulator issues)
			input = document.createElement('input');
			input.setAttribute('name', inputName);
		}
	}
	input.setAttribute('type', 'hidden');
	input.setAttribute('value', value);
	input.value = value;
	try
	{
		form.appendChild(input);
	}
	catch (e)
	{
		alert("Error : setFormValue -" + e.message);
	}
}

function submitSSForm(form, command, formAction, method, target)
{
	if (false)
	{
		// Debug: enable to use the link href rather than the onclick handler
		if (window.event && window.event.srcElement && window.event.srcElement.tagName.toLowerCase() == 'a')
			return true;
	}

	var form = getForm(form);
	setFormValue(form, 'CONFIGURATION', commonVariables.configurationId);
	setFormValue(form, 'PARTITION_ID', commonVariables.partitionId);
	setFormValue(form, 'TIMEZONE_OFFSET', commonVariables.timezoneOffset);
	setFormValue(form, 'isSecure', commonVariables.isSecure);
	if (command)
		setFormValue(form, 'CMD', command);
	if (formAction)
		form.action = formAction;
	if (!form.action)
		form.action = commonVariables.formAction;
	if (method)
		form.method = method;
	else
		form.method = commonVariables.submissionMethod;
	if (target)
		form.target = target;

	// Debugging only
	if (false)
	{
		alert(form.id + ' ' + form.action + ' ' + getFormValue(form, 'CMD'));
		for ( var i = 0; i < form.elements.length; i++)
		{
			alert(form.elements[i].name + ' ' + form.elements[i].value);
		}
	}

	form.submit();

	// Prevent the default action if the handler is on a link or button etc.
	return false;
}

function submitOnReturn(evt, form)
{
	if (window.event && window.event.keyCode == 13 || evt.which == 13)
		submitSSForm(form);
}

function startGuidedHelp()
{
	var form = getForm('ssForm');
	setFormValue(form, 'CMD', 'iLogon');
	setFormValue(form, 'GCL', 'Yes');
	setFormValue(form, 'LG', 1);
	return submitSSForm(form);
}

function executeLink(linkName, linkId, linkType)
{
	var linkFrm = getForm("linkOptions");
	setFormValue(linkFrm, 'LINK_ID', linkId);
	setFormValue(linkFrm, 'LINK_TYPE', linkType);
	setFormValue(linkFrm, 'LINK_NAME', linkName);
	return submitSSForm(linkFrm);
}

function executeCascadedLink(row, col)
{
	eval("document.cascade_" + row + "_" + col + ".submit()");
}

function validateAndExecuteLink()
{
	var inputs = new Array();
	var size = document.linkInputOptions.elements.length;
	var count = 0;
	for ( var i = 0; i < size; i++)
	{
		var name = document.linkInputOptions.elements[i].name;
		if (name.indexOf("inputKey_") != -1 && name.indexOf(".key") != -1 && !(name.indexOf(".keyType") != -1))
		{
			var underscoreIndex = name.indexOf("_");
			var dotIndex = name.indexOf(".");
			var keyIndex = name.substring(underscoreIndex + 1, dotIndex);
			if (name.indexOf(".keyName") != -1)
			{
				if (typeof inputs[keyIndex] == "undefined")
					inputs[keyIndex] = new Object();
				inputs[keyIndex].name = document.linkInputOptions.elements[i].value;
			}
			else if (name.indexOf(".keyValue") != -1)
			{
				if (typeof inputs[keyIndex] == "undefined")
					inputs[keyIndex] = new Object();
				inputs[keyIndex].value = document.linkInputOptions.elements[i].value;
			}
		}
	}

	for (i = 0; i < inputs.length; i++)
	{
		var value = inputs[i].value;
		if (value == "")
		{
			alert(L10N_DATAADAPTOR_ENTRY_PROMPT_PREFIX + inputs[i].name);
			return false;
		}
	}

	document.linkInputOptions.submit();
	return true;
}

// Create event handler for window close
function closewindow()
{
	try
	{
		if (document.all)
		{
			var windowName = window.name;
			if ((window.screenTop > 10000 || (window.event.clientX < -5000) || (window.event.clientY < -5000))
							&& windowName != 'attachment' && windowName.indexOf('ArticleDetails') < 0
							&& window.name != 'PrintArticle')
			{
				// Auto-logoff
				submitSSForm('ssForm', 'LOGOFF');
			}
		}
	}
	catch (e)
	{
	}
}

// Firefox does not pick up the following variables from util.js, so redefine here
var IDENTIFIER_START = "\\{";
var IDENTIFIER_END = "\\}";

function getFormattedMessage(msgStr, dynamicValues)
{
	var retVal = msgStr;

	try
	{
		if (typeof dynamicValues != "undefined" && dynamicValues != null)
		{
			var size = dynamicValues.length;
			for ( var i = 0; i < size; i++)
			{
				retVal = retVal.replace(new RegExp(IDENTIFIER_START + i + IDENTIFIER_END, "g"), dynamicValues[i]);
			}
		}
	}
	catch (e)
	{
		alert(e.message);
	}

	return retVal;
}

// Assign event handler
window.onunload = closewindow;

function trim(str)
{
	return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function getTreeTrain()
{
	var maketree = getForm("maketree");
	var replace = maketree.elements['treeretain'].value;
	var intIndexOfMatch = replace.indexOf("*");
	while (intIndexOfMatch != -1)
	{
		replace = replace.replace("*", "\"");
		intIndexOfMatch = replace.indexOf("*");
	}
	var intIndexOfMatch2 = replace.indexOf("^");
	while (intIndexOfMatch2 != -1)
	{
		replace = replace.replace("^", "\&nbsp\;")
		intIndexOfMatch2 = replace.indexOf("^");
	}
	return replace;
}

function removeArticleFromFavorites(configId, articleId)
{
	// Confirm deletion of favorite
	if (confirm(L10N_DELETE_FAVORITE_CONFIRM))
	{

		var iFavCount = readCookie('favoritefaqcount');
		var favs = new Array(iFavCount);
		var removal = "|" + articleId;
		var count = 1;
		for (i = 1; i <= iFavCount; i++)
		{
			favs[i - 1] = readCookie('favoritefaq' + i);
		}
		document.cookie = "";
		for (i = 1; i <= iFavCount; i++)
		{
			if (favs[i - 1].indexOf(removal) >= 0)
				continue;
			setCookie('favoritefaq' + count, favs[i - 1]);
			count++;
		}
		setCookie('favoritefaq' + iFavCount, "");
		iFavCount--;
		if (iFavCount < 0)
			iFavCount = 0;
		setCookie('favoritefaqcount', iFavCount);

		// Refresh list of favorites
		submitSSForm('myStuff', 'MY_FAVORITES');
	}
}

function addArticleToFavorites(articleId, articleName)
{
	if (document.cookie.indexOf(commonVariables.configurationId + "|" + articleId) == -1)
	{
		var iFavCount = readCookie('favoritefaqcount');
		iFavCount++;
		setCookie('favoritefaqcount', iFavCount);
		setCookie('favoritefaq' + iFavCount, commonVariables.configurationId + "|" + articleId);
		iFavCount = readCookie('favoritecount');
		alert(getFormattedMessage(L10N_ARTICLE_ADDED_TO_FAVORITES, [articleName]));
	}
	else
	{
		alert(getFormattedMessage(L10N_ARTICLE_ALREADY_ADDED_TO_FAVORITES, [articleName]));
	}
}

function setCookie(name, value, path, domain, secure)
{
	var now = new Date();
	now.setTime(now.getTime() + 365 * 24 * 60 * 60 * 1000);
	var curCookie = name + "=" + value + "; expires=" + now.toGMTString() + ((path) ? "; path=" + path : "")
					+ ((domain) ? "; domain=" + domain : "") + ((secure) ? "; secure" : "");
	document.cookie = curCookie;
}

function readCookie(cookieName)
{
	var theCookie = "" + document.cookie;
	var ind = theCookie.indexOf(cookieName);
	if (ind == -1 || cookieName == "")
		return "";
	var ind1 = theCookie.indexOf(';', ind);
	if (ind1 == -1)
		ind1 = theCookie.length;
	return unescape(theCookie.substring(ind + cookieName.length + 1, ind1));
}

/* Change appearance of row */
function changeRowColor(tableRow, highLight, current)
{
	tableRow.className = current;
	if (highLight)
	{
		tableRow.className += 'hover';
	}
}

function cancelEvent(evt) {
	if (!evt) evt = window.event;
	evt = evt ? evt : window.event;
	evt = evt || window.event;
	evt.cancelBubble = true;
	evt.cancel = true;
	evt.returnValue = false;
	if (evt.preventDefault) evt.preventDefault();
	if (evt.stopPropagation) evt.stopPropagation();
	return false;
}

function openLayer(articleId, confId, ts)
{
	openMagnigicPopupLayerAjax(articleId, confId, ts);
}

var layerDebug = false;
function getLayerAjax(articleId, confId, ts)
{
	var layerUrl = '/system/selfservice.controller?'+
		'CONFIGURATION='+confId+
		'&PARTITION_ID=1'+
		'&secureFlag=false&TIMEZONE_OFFSET=' + 
		'&CMD=VIEW_ARTICLE' + 
		'&ARTICLE_ID='+articleId +
		'&OPTION=LAYER'+
		'&USERTYPE=1';
	
	if (layerDebug) alert(layerUrl);
	if (ts == undefined || ts == null) ts = "";	// fix for multiple LAYER on topic articles
	
	jQuery.ajax({ 
		url: layerUrl, 
		contentType: "application/xhtml+xml; charset=utf-8",
		dataType: 'html',
		cache:false,
		error: function(req, textStatus, error){
			// do nothing
		},
		success: function(data){
			if (layerDebug) alert(data);
			
			var divLayerEl = document.getElementById('layer'+ts+articleId);	// fix for multiple LAYER on topic articles
			if ( divLayerEl ) {
				var index1 = data.indexOf("<div id=\"articleLayer\">");
				var offset = "<div id=\"articleLayer\">".length;
				var index2 = data.indexOf("</div>");
				if (layerDebug) alert("index1="+index1+"index2="+index2);
				if (index1 == -1) return;
				try
				{
					var x = data.substring((index1+offset),index2);
					if (layerDebug) alert(x);
					if (x) jQuery('#layer'+ts+articleId).html(x);	// fix for multiple LAYER on topic articles
					jQuery('#layer'+ts+articleId).show();	// fix for multiple LAYER on topic articles
				} catch (e) {}
			}
		}
	});
}

function openMagnigicPopupLayerAjax(articleId, confId, ts)
{
	var layerUrl = '/system/selfservice.controller?'+
		'CONFIGURATION='+confId+
		'&PARTITION_ID=1'+
		'&secureFlag=false&TIMEZONE_OFFSET=' + 
		'&CMD=VIEW_ARTICLE' + 
		'&ARTICLE_ID='+articleId +
		'&OPTION=LAYER'+
		'&USERTYPE=1';

	EGFUNCTS.callMPAjaxPopup(layerUrl);
}

