/* $version_start$ 21/04/2009$eGainBlue$1.0 $version_end$ */

$(function() {

	function configureEscalationForm() {

		if (typeof contactFormConfiguration !== 'undefined') {
			
			try {
				if (contactFormConfiguration && 
						contactFormConfiguration.enableContactFormTitle !== true) {
					removeDomElement("crm-fields-title");
				}
				else {
					$("#crm-fields-title").removeClass("hide");
				}
			} catch(e) {}
			
			try {
				if (contactFormConfiguration && 
						contactFormConfiguration.enableContactFormCity !== true) {
					removeDomElement("crm-fields-city");
				}	
				else {
					$("#crm-fields-city").removeClass("hide");
				}	
			} catch(e) {}

		}
		else {
			removeDomElement("crm-fields-title");
			removeDomElement("crm-fields-city");
		}
	}
		
    configureEscalationForm();

    /*traceOnConsole(commonVariables.escalationSfThanksTitle);
    traceOnConsole(commonVariables.escalationSfThanksOK);
    traceOnConsole(commonVariables.escalationSfThanksKO);
    traceOnConsole(commonVariables.popupBeginOf);
    traceOnConsole(commonVariables.popupEndOf);
    traceOnConsole(commonVariables.popupClose);*/

});

function checkOpener() {
	var windowName = window.name;
	if (windowName.indexOf("ArticleDetails")>=0) {
		window.onbeforeunload = onBeforeUnload;
	} else {
		window.onbeforeunload = null;
	}
}

function onBeforeUnload() {
	if (document.all && ((window.event.clientX<0) || (window.event.clientY<0))) {
		return L10N_CLOSE_ARTICLE_DETAILS_WINDOW_CONFIRM;
	}
}

function checkEnterForEscalation(evt) {
	try {
		/* Handle non-IE browsers */
		var keyCode = (window.event) ? evt.keyCode : evt.which;
		if (keyCode == 13) {
			validateForm();
		}
	} catch(e) {
		alert(e.message);
	}
}

function formFocus() {
	checkOpener();
	//document.getElementById("escalation").customerName.focus();
}

function FormValidator() {
	var escalFrm = document.getElementById("escalation");
	var isValid = true;

	//Encode and set the customer name.
  	var custName = escalFrm.customerName.value;
	try { custName = custName.trim(); } catch(ec) {}	// fix ticket 7040
	if (!(custName == "")) {
		hideErrorClass('customerName');
  	    custName = escape(custName);
	}
	else {
		showErrorClass('customerName', L10N_ESCALATION_ERROR_NAME, isValid);
		isValid = false;
	}

	//Encode and set the customer surname.
  	var custLastName = escalFrm.surname.value;
	try { custLastName = custLastName.trim(); } catch(ec) {}	// fix ticket 7040
	if (!(custLastName == "")) {
		hideErrorClass('surname');
  	    custLastName = escape(custLastName);
	}
	else {
		showErrorClass('surname', L10N_ESCALATION_ERROR_LASTNAME, isValid);
		isValid = false;
	}
	
	// validate phone number
	var phoneValue = escalFrm.phone.value;
	try { phoneValue = phoneValue.trim(); } catch(ec) {}
	var phoneRequired = true;
	try {
		if (escalFrm && escalFrm.phone_required && escalFrm.phone_required.value=='false')
			phoneRequired = false;
	}
	catch(ecfpr) {}
	var only_digit_pattern = /^\d+$/;
	if (phoneRequired && phoneValue.length==0) {
		showErrorClass('phone', L10N_ESCALATION_ERROR_PHONE, isValid);
		isValid = false;
	}
	else if (phoneRequired && phoneValue.length>0 && (!only_digit_pattern.test(phoneValue)) ) {
		showErrorClass('phone', L10N_ESCALATION_ERROR_PHONE_FORMAT, isValid);
		isValid = false;
	}
	else if (!phoneRequired && phoneValue.length>0 && (!only_digit_pattern.test(phoneValue)) ) {
		showErrorClass('phone', L10N_ESCALATION_ERROR_PHONE_FORMAT, isValid);
		isValid = false;
	}
	else {
		hideErrorClass('phone');
		escalFrm.phone.value = escape(phoneValue);
	}
		
	// validate email address
	if ( (escalFrm.emailaddress.value == "") || !isEmailAddr(escalFrm.emailaddress.value) || (escalFrm.emailaddress.value.length < 3) ) {
		showErrorClass('emailaddress', ((escalFrm.emailaddress.value == "") ?  L10N_ESCALATION_ERROR_EMAIL : L10N_ESCALATION_ERROR_EMAIL_FORMAT), isValid );
		isValid = false;
	}
	else {
		hideErrorClass('emailaddress');
	}

	// validate TOPIC selection 
	var cTopicIndex = document.getElementById("escalationTopic").selectedIndex;
	//alert("cTopicIndex="+cTopicIndex);
	//alert("escalFrm.escalationTopic.options[cTopicIndex].value="+escalFrm.escalationTopic.options[cTopicIndex].value);	
	//if (escalFrm.escalationTopic.options[cTopicIndex].value == -1) {
	if (cTopicIndex == 0) {
		showErrorClass('escalationTopic', L10N_ESCALATION_ERROR_TOPIC, isValid);
		isValid = false;
	} else {
		hideErrorClass('escalationTopic');
	}

	// validate email content
	var message = escalFrm.description.value;
	try { message = message.trim(); } catch(ec) {}	// fix ticket 7040
	if (message == "") {
		showErrorClass('description', L10N_ESCALATION_ERROR_COMMENT, isValid);
		isValid = false;
	} else {
		hideErrorClass('description');
		//escalFrm.description1.value = escape(message);
	}
	
	//validate recaptcha
	console.log("recaptcha validation");
	try{
		var recapctha_required = escalFrm.recaptcha_required.value;
		var recapctha = escalFrm.recaptcha.value;
		try{ recapctha = recapctha.trim(); } catch{ }
		console.log("recapctha_required: "+recapctha_required);
		if ("true" == recapctha_required.toLowerCase()){
				console.log("recapctha: "+recapctha);
				if (recapctha==""){
					console.log("showErrorClass: ");
					showErrorClass('recaptcha', L10N_ESCALATION_ERROR_RECAPTCHA, isValid);
					isValid = false;
				}else {
					console.log("hideErrorClass: ");
					hideErrorClass('recaptcha');
					//escalFrm.description1.value = escape(message);
				}
		}
	} catch(ec){}
	//if (!isValid) {
	//	try { 
			//window.scrollTo(0, 0); 
			//escalFrm.customerName.focus();
	//	} catch(exx) {}
	//}

	return isValid;
}

function validateForm() {
	try {
		return FormValidator();
	} catch(e) {
		traceOnConsole(e);
	}
	
	return false;
}

function populateEscalationTopicValues() {
	
	var escalFrm = document.getElementById("escalation");

	try {
		var values = escalFrm.TOPIC[escalFrm.TOPIC.selectedIndex].value.split(':');
		escalFrm.TOPIC_ID.value = -1;
		escalFrm.TOPIC_TYPE.value = 0;
		escalFrm.STARTING_ID.value = 0;
		return true;
	} 
	catch(e) {
		traceOnConsole(e);
	}

	return false;
}

/**
 * Event handler when Send button is clicked.
 * 
 * @param formId Id of form being submitted.
 */
function onClickSend(formId, showPopup) {
	// If form is valid, populate fields and submit
	traceOnConsole('onClickSend');
	var escalateButton= document.getElementById("escalate");	//fix: disable multiple form submit
	//escalateButton.disabled=true;
	sfc=0;
	traceOnConsole('sfc init.');
	
	$searchArticlesBeforeSubmit = $('#escalation').find('#searchArticlesBeforeSubmit');

	if (($searchArticlesBeforeSubmit.val() === "true")) 
	{
		populateEscalationTopicValues();
		populateEmailTags();
		setFileNames(formId);
		
		traceOnConsole('isIEversion()='+isIEversion());
		if (! isIEversion())
			searchForArticles();
		else
			searchForArticlesIE();
		//return submitSSForm("escalation", null, null, 'post');
		return false;
	}
	else {
		escalateButton.disabled=false;
	}
	
	return false;
	
}

/**
 * Event handler when Reset button is clicked.
 */
function onClickReset(tableId) {
	// Remove all attachments
	removeAllAttachmentRows(tableId);
}

function populateEmailTags() {
	
	var escalFrm= document.getElementById("escalation");
	
	try 
	{	
		var emailTextWithoutFields = escalFrm.description.value;
		emailTextWithoutFields = escape(emailTextWithoutFields);
		
		var topicSel= document.getElementById("escalationTopic");
		// Y024 - WorkflowEmailForward
		var topicId = topicSel.options[topicSel.selectedIndex].value;
		try {
			var values = topicId.split(':');
			topicId = values[0];
		} catch (e) { topicId = "-1"; }			
		// Y024 - WorkflowEmailForward
		var topicName = "";
		try{
			topicName = topicSel[topicSel.selectedIndex].firstChild.nodeValue;
			topicName = topicName.replace(/^\s+|\s+$/g, "");	// trim
			topicName = topicName.replace(/(\r\n|\n|\r)/gm,"");	// remove line breaks
		} catch (e) {}
		topicName = escape(topicName);
		
		var product = "";
		try{
			product = escalFrm.product.value;
		} catch (e) {}

		var mobile = "0";
		try{
			mobile = escalFrm.mobile.value;
		} catch (e) {}
		
		var orderNum = "";
		try{
			orderNum = escalFrm.order.value;
			orderNum = orderNum + "";
			if (orderNum!=null && orderNum!=undefined && orderNum.length>20) {
				orderNum = orderNum.substring(0, 19);
			}
		} catch (e) {}

		var titleSel= document.getElementById("title");
		var titleVal = "";
		try{
			if (titleSel)
				titleVal = titleSel.options[titleSel.selectedIndex].value;
		} catch (e) {}		

		var city = "";
		try{
			city = escalFrm.city.value;
		} catch (e) {}		

		escalFrm.description1.value = "\n\n\n\n\n\n\n\n\n\n\n$FIELDS$\n" +
			"\ntarget = Customer Care" +
			"\nNazione = "+escape(escalFrm.country.value)+
			"\narea = "+escape(escalFrm.area.value)+
			"\nstore = "+escape(escalFrm.store.value)+
			"\nlang = "+escape(escalFrm.lang.value)+
			"\nlanguageCode = "+escape(escalFrm.languageCode.value)+
			"\nnome = "+escape(escalFrm.customerName.value)+
			"\ncognome = "+escape(escalFrm.surname.value)+
			"\nmail = "+escalFrm.emailaddress.value+
			"\nnumero_ordine = "+orderNum+
			"\ntelefono = "+escalFrm.phone.value+
			"\nproduct = "+escape(product)+
			"\nmotivo = "+topicName+
			"\ntopic_id = "+topicId+
			"\nmobile = "+mobile+
			"\ntitle = "+titleVal+
			"\ncity = "+escape(city)+
			"\ncommento = "+emailTextWithoutFields;
		//alert('email content='+escalFrm.description1.value);
		return true;
	} 
	catch(e) {}

	return false;
}

function searchForArticles()
{
	traceOnConsole('searchForArticles');
	
	var form = document.getElementById("escalation");
	setFormValue(form, 'CONFIGURATION', commonVariables.configurationId);
	setFormValue(form, 'PARTITION_ID', commonVariables.partitionId);
	setFormValue(form, 'TIMEZONE_OFFSET', commonVariables.timezoneOffset);
	setFormValue(form, 'isSecure', commonVariables.isSecure);
	setFormValue(form, 'USERTYPE', commonVariables.userType);
	
	var post_data = new FormData();
    post_data.append( 'CONFIGURATION', 	commonVariables.configurationId);
	post_data.append( 'PARTITION_ID', 	commonVariables.partitionId);
	post_data.append( 'TIMEZONE_OFFSET',commonVariables.timezoneOffset);
	post_data.append( 'isSecure', 		commonVariables.isSecure);
	post_data.append( 'USERTYPE', 		commonVariables.userType);
	post_data.append( 'customerName', 	$('#customerName').val() );
	post_data.append( 'surname', 		$('#surname').val() );
	post_data.append( 'phone', 			$('#phone').val() );
	post_data.append( 'emailaddress', 	$('#emailaddress').val() );
	post_data.append( 'combo_emails', 	$('#combo_emails').val() );
	post_data.append( 'subject', 		$('#subject').val() );
	post_data.append( 'description', 	$('#description1').val() );
	post_data.append( 'description1', 	$('#description1').val() );
	post_data.append( 'area', 			$('#area').val() );
	post_data.append( 'store', 			$('#store').val() );
	post_data.append( 'lang',		 	$('#lang').val() );
	post_data.append( 'languageCode', 	$('#languageCode').val() );
	post_data.append( 'country', 		$('#country').val() );
	post_data.append( 'TOPIC', 			$('#escalationTopic').val() );
	post_data.append( 'TOPIC_ID', 		'-1' );
	post_data.append( 'TOPIC_TYPE', 	'0' );
	post_data.append( 'STARTING_ID', 	'0' );
	post_data.append( 'CMD',			'ESCALATION_START');
	
	$.ajax({
		type: "POST",
		url: "selfservice.controller?CONFIGURATION="+commonVariables.configurationId,
		data: post_data,
		cache: false,
	    contentType: false,
	    processData: false,
	    async: false,
		success: function(response) {
			traceOnConsole('response='+response);
			if (response 
				&& response.indexOf("thankyou") > -1
				&& response.indexOf("responseMessage") > -1 ) {
				//formReset();
			}
			$(document).trigger("Crm::Results", response);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
     		traceOnConsole("ajax error --> XMLHttpRequest:"+XMLHttpRequest+", error:"+textStatus+", errorThrown:"+errorThrown);
			//$(document).trigger("Crm::Results", response);
		}
	});
}


function searchForArticlesIE()
{
	traceOnConsole('searchForArticlesIE');

	var form = document.getElementById("escalation");

	setFormValue(form, 'CONFIGURATION', commonVariables.configurationId);
	setFormValue(form, 'PARTITION_ID', commonVariables.partitionId);
	setFormValue(form, 'TIMEZONE_OFFSET', commonVariables.timezoneOffset);
	setFormValue(form, 'isSecure', commonVariables.isSecure);
	setFormValue(form, 'USERTYPE', commonVariables.userType);

	setFormValue(form, 'customerName', $('#customerName').val());
	setFormValue(form, 'combo_emails', $('#combo_emails').val());
	//setFormValue(form, 'description1', $('#description').val());	// fix ticket 7608
	setFormValue(form, 'TOPIC', $('#escalationTopic').val());
	
	var options = { 
        target:       '#escalationout',   // target element(s) to be updated with server response 
		url:		  'selfservice.controller?CONFIGURATION='+commonVariables.configurationId,
		type:		  'post',
        beforeSubmit: showRequest,  // pre-submit callback 
        success:      showResponse  // post-submit callback 
		//dataType:  null        // 'xml', 'script', or 'json' (expected server response type) 
        //clearForm: true        // clear all form fields after successful submit 
        //resetForm: true        // reset the form after successful submit 
        //timeout:   3000 
    }; 
	
	$('#escalation').submit(function() { 
        $(this).ajaxSubmit(options); 
        return false; 
    });
}

function showRequest(formData, jqForm, options) { 
    var queryString = $.param(formData); 
    traceOnConsole('queryString:'+queryString);
	return true; 
} 

function showResponse(response, statusText, xhr, $form)  { 
    traceOnConsole('showResponse:'+response);
	$(document).trigger("Crm::Results", response);	
} 


function finishEscalation()
{
	sendSF();
}

function avertEscalation()
{
	var data =  'CONFIGURATION='+commonVariables.configurationId+
				'&PARTITION_ID='+commonVariables.partitionId+
				'&TIMEZONE_OFFSET='+
				'&isSecure=false'+
				'&ADDITIONAL_YOOX_REASON=AVERT_ESCALATION'+
				'&CMD=THANKS_PAGE'+
				'&handlerMode=ajaxCall';
    traceOnConsole('avertEscalation:data'+data);
	
	$.ajax({
		type: "GET",
		url: "selfservice.controller?"+data,
		cache: false,
	    contentType: false,
	    processData: false,
	    async: false,
		success: function(response) {
			traceOnConsole('avertEscalation:'+response);
			//response = getResponseSubstring(response);
			$(document).trigger("Crm::Thanks", response);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
     		traceOnConsole("avertEscalation, ajax error --> XMLHttpRequest:"+XMLHttpRequest+", error:"+textStatus+", errorThrown:"+errorThrown);
			//$(document).trigger("Crm::Thanks", response);
		}
	});
}

var sfc = 0;

function sendSF()
{
	sfc++;
	traceOnConsole('['+sfc+']'+'sendSF(db)');
	disableSendButton();
	
	var orderNum = "";
	try{
		orderNum = $('#order').val();
		orderNum = orderNum + "";
		if (orderNum!=null && orderNum!=undefined && orderNum.length>20) {
			orderNum = orderNum.substring(0, 19);
		}
	} catch (e) {}

	var topicSel= document.getElementById("escalationTopic");
	var topicId = topicSel.options[topicSel.selectedIndex].value;
	var topicText = topicSel.options[topicSel.selectedIndex].text;
	try {
		var values = topicId.split(':');
		topicId = values[0];
	} catch (e) { topicId = "-1"; }	

	var Web_Form_Country_Iso_Code__c=encodeURIComponent($( "input[name='countryCode']" ).val());
	var Web_Form_Area__c=$( "input[name='area']" ).val();
	var Web_Form_Store_Code__c=$( "input[name='store']" ).val();
	var Web_Form_Language_Id__c=$( "input[name='lang']" ).val();
	var Web_Form_First_Name__c=encodeURIComponent($('#customerName').val());
	var Web_Form_Last_Name__c=encodeURIComponent($('#surname').val());
	var SuppliedEmail=$('#emailaddress').val();
	var Web_Form_Order_Number__c=orderNum;
	var SuppliedPhone=$('#phone').val();
	var Web_Form_Product__c=encodeURIComponent($('#product').val());
	var Subject=encodeURIComponent(topicText);
	var Web_Form_Topic__c=topicId;
	var Web_Form_Salutation__c=$('#title').val();
	if (Web_Form_Salutation__c == undefined || Web_Form_Salutation__c=='undefined') {
		Web_Form_Salutation__c = '';
	}
	var Web_Form_City__c=encodeURIComponent($('#city').val());
	if (Web_Form_City__c == undefined || Web_Form_City__c=='undefined') {
		Web_Form_City__c = '';
	}
	var Description=encodeURIComponent($('#description').val());
	var  recaptcha = "";
	
	try{ 
		recaptcha = $('#recaptcha').val(); 
	} catch(ec) {}

	var pars = "?";
	pars += 'Subject='+Subject+'&';
	pars += 'SuppliedEmail='+SuppliedEmail+'&';
	pars += 'SuppliedPhone='+SuppliedPhone+'&';
	pars += 'Web_Form_City__c='+Web_Form_City__c+'&';
	pars += 'Web_Form_Country_Iso_Code__c='+Web_Form_Country_Iso_Code__c+'&';
	pars += 'Web_Form_Last_Name__c='+Web_Form_Last_Name__c+'&';
	pars += 'Web_Form_First_Name__c='+Web_Form_First_Name__c+'&';
	pars += 'Web_Form_Order_Number__c='+Web_Form_Order_Number__c+'&';
	pars += 'Web_Form_Product__c='+Web_Form_Product__c+'&';
	pars += 'Web_Form_Salutation__c='+Web_Form_Salutation__c+'&';
	pars += 'Web_Form_Store_Code__c='+Web_Form_Store_Code__c+'&';
	pars += 'Web_Form_Topic__c='+Web_Form_Topic__c;
	traceOnConsole('['+sfc+']'+'pars='+pars);

	var hasAttachment = false;
	var attach_file = '';
	var file_name   = '';
	var content_type = '';
	try {
		attach_file = $('input[name=attachments]')[0].files[0];
		if (attach_file != undefined) {
			file_name = $('input[name=fileNames]').val();
		}
		content_type = attach_file.type;
		hasAttachment = true;
	} catch(e) {}
	
	var r_data = {};
	var r_headers = {};
	if (hasAttachment) {
		 try
		 {
 			r_data = $('input[name=attachments]')[0].files[0];
		 	r_headers = {
				"Attachment-Name" : file_name,
				"Attachment-Content-Type" : content_type
		 	}
		 }
		 catch(e) {
			 traceOnConsole('Error handling attachment='+e);
		 }
	}
	r_headers["Webform-Data"]='Description='+Description;
	r_headers["g-recaptcha-response"] = recaptcha;
	var sfEndpoint = document.getElementById("escalation_sf").action;

	if (sfc==1) {
		$.support.cors = true;
		$.ajax({
			type: "POST",
			url: sfEndpoint+pars,
			data: r_data,
			cache: false,
		    contentType: 'application/octet-stream',
		    crossDomain: true,
		    headers: r_headers,
			processData: false,
		    async: false,
			success: function(response) {
				enableSendButton();
				traceOnConsole('['+sfc+']'+'response='+JSON.stringify(response));
				var isSuccess = false;
				if (response && response.success && (response.success=="true" || response.success==true)) {
					isSuccess = true;
					formReset();
				}
				var responseAsHtml = buildPopupResponse(isSuccess);
				$(document).trigger("Crm::Thanks", responseAsHtml);
			},
			done: function(response) {
				traceOnConsole('['+sfc+']'+'done, response='+response);
				enableSendButton();
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				enableSendButton();
	     		traceOnConsole('['+sfc+']'+"ajax error --> XMLHttpRequest:"+JSON.stringify(XMLHttpRequest)+", error:"+textStatus+", errorThrown:"+errorThrown);
	     		var responseAsHtml = buildPopupResponse(false);
				$(document).trigger("Crm::Thanks", responseAsHtml);
			}
		});
	} 
	else {
		traceOnConsole('['+sfc+']'+'skip');
	}
}

function showErrorClass(fieldName, msg, isFirstError) {
	//if ( document.getElementById(fieldName) ) {
	//	document.getElementById(fieldName).className += " error";
	// CR:Y023
	//alert('fieldName='+fieldName+', msg='+msg+', isFirstError='+isFirstError);
	var x = document.getElementById(fieldName);
	if ( x ) {
		if (x.className.indexOf("error") < 0)
			x.className += " error ";
	}
	showErrorMessage(fieldName, msg, isFirstError);
}
function showErrorMessage(fieldName, msg, isFirstError) {
	// CR:Y023
	var err = document.getElementById("error_"+fieldName);
	if (err) {
		err.innerHTML = msg;
		var reg = new RegExp('(\\s|^)hide(\\s|$)');
		err.className=err.className.replace(reg,' ');
	}
}

function hideErrorClass(fieldName) {
	// CR:Y023
	var ele = document.getElementById(fieldName);
	if (ele.className.match(new RegExp('(\\s|^)error(\\s|$)'))) {
		var reg = new RegExp('(\\s|^)error(\\s|$)');
		ele.className=ele.className.replace(reg,' ');
	}
	hideErrorMessage(fieldName);
}
function hideErrorMessage(fieldName) {
	// CR:Y023
	var err = document.getElementById("error_"+fieldName);
	if (err) {
		if (err.className.indexOf("hide") < 0)
			err.className = err.className + " hide";
	}
}

function formReset(){
	var x = document.getElementById('escalation');
	if (x) {
		$("#phone").val("");
		$("#order").val("");
		$("#product").val("");
		$("#description").val("");
		$("#description1").val("");
	}
}



function hideModalOverlay() {
	if ( document.getElementById("escalation-overlay") ) document.getElementById("escalation-overlay").className += " hide";
}

function showModalOverlay() {
	try
	{
		window.scrollTo(0, 0);
		var overlayText = document.getElementById("overlay-email-message");
		if (overlayText) {
			var escalFrm= document.getElementById("escalation");
			var customerMessage = escalFrm.description1.value;
			overlayText.innerHTML = customerMessage;
		}
		
		var ele = document.getElementById("escalation-overlay");
		if (ele.className.match(new RegExp('(\\s|^)hide(\\s|$)'))) {
			var reg = new RegExp('(\\s|^)hide(\\s|$)');
			ele.className=ele.className.replace(reg,' ');
		}
	} catch (e) {}
}

/*Wrap text: every "MaxLength" characters add "FillChar" character */
function WrapText(Input) {
	var FillChar = "\n";
	var MaxLength = 45;
	var pattern = new RegExp("([^-]{" + MaxLength + "})", "g");
	var myString = Input;
	return myString.replace(pattern, "$1"+FillChar);
}

function onTopicSelection()
{
	showHideProductCode();
	var gotLinkToArticle = checkLinkToArticle();
	/*
	if (gotLinkToArticle) {
		$("#escalate").prop("disabled", true);
	}
	else {
		$("#escalate").prop("disabled", false);
	}
	*/
}

function checkLinkToArticle()
{
	var gotLinkToArticle = false;

	try
	{
		var topicSel= document.getElementById("escalationTopic");
		var topicId = topicSel.options[topicSel.selectedIndex].value;
		try {
			var values = topicId.split(':');
			traceOnConsole("topic.length: "+values.length);
			if (values.length > 3) {
				articleReference = values[4];
				traceOnConsole("articleReference: "+articleReference);
				var url = '/system/web/custom/hp/article.jsp?OPTION=LAYER&articleId='+articleReference;
				EGFUNCTS.callMPAjaxPopup(url);
				gotLinkToArticle= true;
			}
		} catch (e) { topicId = "-1"; }
	} 
	catch (e) {}

	return gotLinkToArticle;
}
function showHideProductCode()
{
	try
	{
		var topicSel= document.getElementById("escalationTopic");
		var topicId = topicSel.options[topicSel.selectedIndex].value;
		try {
			var values = topicId.split(':');
			topicId = values[0];
		} catch (e) { topicId = "-1"; }

		var productInfoTopicId = "19316";
		try {
			productInfoTopicId = $("#productInfoTopicId").val();
		} catch (e) {}
		
		// configure here topic_id that will show "Product Code" section
		if (topicId == productInfoTopicId) {
			if ( $("#product-section").hasClass("hide") )
				$("#product-section").removeClass("hide");
		}
		else {
			if ( ! $("#product-section").hasClass("hide") )
				$("#product-section").addClass("hide");
		}
	}
	catch(e) {}
}

function isIEversion () {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

function getResponseSubstring(str)
{
	var x = str;
	var k1 = -1;
	var k2 = -1;
	try
	{
		k1 = str.indexOf('<section');
		k2 = str.indexOf('</section>');
		var x = str.substr( k1, k2 );
	}
	catch (e) {}
	traceOnConsole('getResponseSubstring, ['+k1+','+k2+']:'+x);
	return x;
}

function traceOnConsole(s)
{
	var consoleDebug=true;

	if ( consoleDebug 
			&& window.console 
			&& window.console.log ) {
		try {
			window.console.log(s);
		} catch (ex) {}
	}
}

function removeDomElement(id) {
	if (checkDomElement(id)) {
		try {
			$('#'+id).remove();
		}catch(e) {}
	}
}

function checkDomElement(id) {
	return ($('#'+id).length > 0);
}

function buildPopupResponse(res){

	var msg = commonVariables.escalationSfThanksKO;
	if (res) {
		msg = commonVariables.escalationSfThanksOK;
	}

	var responseAsHtml = "<!DOCTYPE html>"+
			"<!--[if IE 8]><html class=\"no-js ie8 ielt9 ielt10\" lang=\"en\"> <![endif]-->"+
			"<!--[if IE 9]><html class=\"no-js ie9 ielt10\" lang=\"en\"> <![endif]-->"+
			"<!--[if gt IE 9]><!--> <html class=\"no-js\" lang=\"en\"> <!--<![endif]-->"+
			"<div class=\"mfp-content-contactAnswers\" id=\"thankyou\">"+
			"    <div class=\"is-vHidden\">"+commonVariables.popupBeginOf+"</div>"+
			"	<section id=\"thankyousection\">"+
			"		<header>"+
			"			<h1>"+commonVariables.escalationSfThanksTitle+"</h1>"+
			"		</header>"+
			"		<div class=\"crm-article\" id=\"responseMessage\">"+
			"			<p>"+msg+"</p>"+
			"		</div>"+
			"	</section>"+
			"    <div class=\"is-vHidden\">"+commonVariables.popupEndOf+"</div>"+
			"	<button class=\"mfp-close\" type=\"button\">"+
			"		<span class=\"icon\"></span>"+
			"		<span class=\"text is-vHidden\">"+commonVariables.popupClose+"</span>"+
			"	</button>"+
			"</div>";
	return responseAsHtml;
}

function disableSendButton() {
	if ( $('#sendEmail') ) {
		 $('#sendEmail').attr('disabled', 'disabled');
	}
}

function enableSendButton() {
	if ( $('#sendEmail') ) {
		 $('#sendEmail').removeAttr('disabled');
	}
}