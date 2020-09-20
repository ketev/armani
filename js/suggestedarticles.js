/*
 * This file contains the support functions for the suggested articles template.
 */

// This function addresses the request of ascending order sorting on any attribute.
function sortAsc(attribName)
{
	setFormValue('suggestedArticlesResultsForm', 'sortOrder', '1');
	setFormValue('suggestedArticlesResultsForm', 'sortOn', attribName);
	return submitSSForm('suggestedArticlesResultsForm', 'SORT_SUGGESTED_ARTICLES_LIST');
}

// This function addresses the request of descending order sorting on any attribute.
function sortDesc(attribName)
{
	setFormValue('suggestedArticlesResultsForm', 'sortOrder', '0');
	setFormValue('suggestedArticlesResultsForm', 'sortOn', attribName);
	return submitSSForm('suggestedArticlesResultsForm', 'SORT_SUGGESTED_ARTICLES_LIST');
}

// This function fetches the page corresponding to the page number passed.
function getPage(nextPageNo)
{
	setFormValue('suggestedArticlesResultsForm', 'nextPageNo', nextPageNo);
	return submitSSForm('suggestedArticlesResultsForm', 'GET_NEXT_PAGE_SUGGESTED_ARTICLES_RESULTS', null, "POST");
}

function toggleMore(id) 
{
	$("#article-descr-"+id).hide();
	$("#article-content-"+id).show();
	$("#article-more-button-"+id).hide();
	$("#article-less-button-"+id).show();
}

function toggleLess(id) 
{
	$("#article-descr-"+id).show();
	$("#article-content-"+id).hide();
	$("#article-more-button-"+id).show();
	$("#article-less-button-"+id).hide();
}