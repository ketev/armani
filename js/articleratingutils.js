var rateDebug = false;

function yooxRateAccessibilityAjax(articleId, ratingValue)
{
	var rateUrl = commonVariables.ssUrl + 
		'&CMD=SUBMIT_ARTICLE_RATING' + 
		'&RATING='+ratingValue+
		'&ARTICLE_ID='+articleId +
		'&handlerMode=ajaxCall';
	
	alert('yooxRateAccessibilityAjax::'+articleId+'::'+ratingValue);
/*
	if (rateDebug) alert(rateUrl);
	
	jQuery.ajax({ 
		url: rateUrl, 
		contentType: "application/xhtml+xml; charset=utf-8",
		dataType: 'html',
		cache:false,
		error: function(req, textStatus, error){
			// do nothing
		},
		success: function(data){
			if (rateDebug) alert(data);
			
			var feedbackEl = document.getElementById('feedback-answer-' + articleId);
			if ( feedbackEl ) {
				//if (jQuery.browser.msie) { fix tkt 6306
				if (navigator.appVersion.indexOf("MSIE") != -1) {
					var index1 = data.indexOf("<div class=\"crm-article\" id=\"responseMessage\">");
					var offset = "<div class=\"crm-article\" id=\"responseMessage\">".length;
					var index2 = data.indexOf("</div>");
					if (rateDebug) alert("index1="+index1+"index2="+index2);
					try
					{
						var x = data.substring((index1+offset),index2);
						if (rateDebug) alert(x);
						if (x) feedbackEl.innerHTML = x;
						$('#feedback-answer-'+articleId).attr( 'style', 'padding-right:15px;' );
					} catch (e) {}
				}
				else {
					var x = jQuery(data).find('#responseMessage').text();
					if (rateDebug) alert(x);
					if (x) feedbackEl.innerHTML = x;
					$('#feedback-answer-'+articleId).attr( 'style', 'padding-right:15px;' );
				}
			}
		}
	});
*/	
}