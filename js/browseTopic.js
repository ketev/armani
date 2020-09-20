/* $version_start$ 21/04/2009$eGainBlue$1.0 $version_end$ */

var ajaxTopicTree = true; // note there is a similar server side flag in topicTreeUtil.jspf
var xmlhttp = null;
var topicItem = null;

function clickTopic(topicId, topicType, startingId, topicName, parentTopicId, parentTopicType, source, topicHrchy) {
	var win = window.name.indexOf("ArticleDetails") >= 0 ? opener : window;
	var ssForm = win.getForm('ssForm');
	win.setFormValue(ssForm, 'TOPIC_ID', topicId);
	win.setFormValue(ssForm, 'TOPIC_TYPE', topicType);
	win.setFormValue(ssForm, 'STARTING_ID', startingId);
	win.setFormValue(ssForm, 'TOPIC_NAME', unescape(topicName));
	win.setFormValue(ssForm, 'PARENT_TOPIC_ID', parentTopicId);
	win.setFormValue(ssForm, 'PARENT_TOPIC_TYPE', parentTopicType);
	win.setFormValue(ssForm, 'SOURCE_FORM', source);
	win.setFormValue(ssForm, 'TOPIC_HIERARCHY', topicHrchy);
	win.setFormValue(ssForm, 'TOP_LEVEL_TOPIC', parentTopicId);

	return win.submitSSForm(ssForm, 'BROWSE_TOPIC');
}

function clickTopicDFAQ(topicId, topicType, startingId, topicName, parentTopicId, parentTopicType, source) {
	var win = window.name.indexOf("ArticleDetails") >= 0 ? opener : window;
	var ssForm = win.getForm('ssForm');
	win.setFormValue(ssForm, 'TOPIC_ID', topicId);
	win.setFormValue(ssForm, 'TOPIC_TYPE', topicType);
	win.setFormValue(ssForm, 'STARTING_ID', startingId);
	win.setFormValue(ssForm, 'TOPIC_NAME', unescape(topicName));
	win.setFormValue(ssForm, 'PARENT_TOPIC_ID', parentTopicId);
	win.setFormValue(ssForm, 'PARENT_TOPIC_TYPE', parentTopicType);
	win.setFormValue(ssForm, 'SOURCE_FORM', source);
	if (parentTopicId==commonVariables.rootTopicId) {
		win.setFormValue(ssForm, 'SIDE_LINK_TOPIC_ID', topicId);
	} else {
		win.setFormValue(ssForm, 'SIDE_LINK_TOPIC_ID', parentTopicId);
		win.setFormValue(ssForm, 'SIDE_LINK_SUB_TOPIC_ID', topicId);
	}
	win.setFormValue(ssForm, 'SIDE_LINK_TOPIC_INDEX', -1);
	win.setFormValue(ssForm, 'SIDE_LINK_SUB_TOPIC_INDEX', -1);
	win.setFormValue(ssForm, 'SUB_TOPIC_ID', -1);
	
	return win.submitSSForm(ssForm,'DFAQ');
}

function expand(evt, elt, topicId) {
	evt = (evt) ? evt : window.event;
	// find the li containing expansion controls, topic link and, possibly, subtree
	while (elt.nodeName.toLowerCase() != 'li') { elt = elt.parentNode; }
	elt.className = elt.className.replace(/collapsed/, 'expanded');
	topicItem = elt; // remember for AJAX state change function

	var hasSubtree = false; // do we need to insert children via AJAX?
	for (var i = 0; i < elt.childNodes.length; i++) {
		var child = elt.childNodes[i];
		if (child.className == 'expand') child.style.display = 'none';
		if (child.className == 'collapse') child.style.display = 'inline';
		if (child.nodeName.toLowerCase() == 'ul') {
			hasSubtree = true;
			// child.style.display = 'block';
			//$(child).show('slow');
			$(child).slideDown('slow');
		}
	}

	if (ajaxTopicTree) {
		xmlhttp=GetXmlHttpObject();
		if (xmlhttp==null) {
			alert ("Your browser does not support XMLHTTP!");
			return;
		}
		var url = commonVariables.ssUrl;
		url += '&CMD=BROWSE_KB';
		url += '&TOPIC_ID=' + topicId
		url += "&sid="+Math.random();
		xmlhttp.onreadystatechange = hasSubtree? function() {} : expandTreeNodeStateChange;
		xmlhttp.open("GET", url, true);
		xmlhttp.send(null);
	}
	return stopEvent(evt);
}

// add a UL containing the responseText to the LI containing the topicItem
function expandTreeNodeStateChange(evt) {
	if (xmlhttp.readyState != 4) return;

	if (xmlhttp.responseText.indexOf('login.jsp') >= 0
	 || xmlhttp.responseText.indexOf('topicTree.jsp') < 0) {
		document.location.href = commonVariables.ssUrl + '&CMD=STARTPAGE';
	}

	var elt = topicItem;
	while (elt.tagName != 'LI') elt = elt.parentNode;
//	elt.innerHTML = elt.innerHTML + '<ul>' + xmlhttp.responseText + '</ul>';
	$(elt).append('<ul style="display:none">' + xmlhttp.responseText + '</ul>');
	$(elt).find('ul').show('slow');
}

function collapse(evt, elt, topicId) {
	evt = (evt) ? evt : window.event;
	// find the li containing expansion controls, topic link and, possibly, subtree
	while (elt.nodeName.toLowerCase() != 'li') { elt = elt.parentNode; }
	elt.className = elt.className.replace(/expanded/, 'collapsed');

	for (var i = 0; i < elt.childNodes.length; i++) {
		var child = elt.childNodes[i];
		if (child.className == 'expand') child.style.display = 'inline';
		if (child.className == 'collapse') child.style.display = 'none';
		if (child.nodeName.toLowerCase() == 'ul') {
			//child.style.display = 'none';
			//$(child).hide('slow');
			$(child).slideUp();
		}
	}

	if (ajaxTopicTree) {
		// tell the server we've collpsed the node
		xmlhttp=GetXmlHttpObject();
		if (xmlhttp==null)
	    {
			alert ("Your browser does not support XMLHTTP!");
			return;
		}
		var url = commonVariables.ssUrl;
		url += '&CMD=BROWSE_KB';
		url += '&TOPIC_ID=' + topicId
		url += '&ACTION=close'
		url += "&sid="+Math.random();
		xmlhttp.onreadystatechange = function() {}; // we just informed the server
		xmlhttp.open("GET", url, true);
		xmlhttp.send(null);
	}
	return stopEvent(evt);
}

// non AJAX version only
function expandAll(evt) {
	var topicTreeModule = document.getElementById('topicTreeModule');
	var elts = topicTreeModule.getElementsByTagName('SPAN');
	for (var i = 0; i < elts.length; i++) {
		if (elts[i].className == 'expand') {
			topicId = elts[i].parentNode.id.substring('topic'.length);
			expand(evt, elts[i], topicId);
		}
	}
}

// non AJAX version only
function collapseAll(evt) {
	var topicTreeModule = document.getElementById('topicTreeModule');
	var elts = topicTreeModule.getElementsByTagName('SPAN');
	for (var i = 0; i < elts.length; i++) {
		if (elts[i].className == 'collapse') {
			topicId = elts[i].parentNode.id.substring('topic'.length);
			collapse(evt, elts[i], topicId);
		}
	}
}

function GetXmlHttpObject() {
	if (window.XMLHttpRequest) {
		return new XMLHttpRequest(); // Firefox, Chrome, Opera, Safari, IE7+
	}
	if (window.ActiveXObject)
	{
		return new ActiveXObject("Microsoft.XMLHTTP"); // IE6, IE5
	}
	return null;
}

function stopEvent(e) {
	if (!e) e = window.event;
	if (e.stopPropagation) {
		e.stopPropagation();
	} else {
		e.cancelBubble = true;
	}
	return false;
}
function cancelEvent(e) {
	if (!e) e = window.event;
	if (e.preventDefault) {
		e.preventDefault();
	} else {
		e.returnValue = false;
	}
	return false;
}

function isRealMouseOut(e, elt) {
	if (!e) e = window.event;
	var reltg = (e.relatedTarget) ? e.relatedTarget : e.toElement;
	while (reltg.tagName != 'BODY'){
		if (reltg == elt) return false;
		reltg = reltg.parentNode;
	}
	return true;
}
