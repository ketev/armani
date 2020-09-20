/* $version_start$ 21/04/2009$eGainBlue$1.0 $version_end$ */

function viewMoreUsefulItems(frameTitle, allArticleIds, noOfArticlesToShow, pageNumber) {
	setFormValue('ssForm', 'USEFUL_ITEMS_FRAME_TITLE', frameTitle);
	setFormValue('ssForm', 'allArticleIds', allArticleIds);
	setFormValue('ssForm', 'nextPageNo', pageNumber);
	setFormValue('ssForm', 'articlePerPage', commonVariables.articlesPerPage);

	// Submit using post if allArticleIds > 1024 characters, to prevent URL too long error
	return submitSSForm('ssForm', 'VIEW_MORE_USEFUL_ITEMS', commonVariables.formAction, 
		(allArticleIds.length > 1024 ? 'post' : commonVariables.submissionMethod));
}
