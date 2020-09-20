/* $version_start$ 20/08/2009$eGainBlue$1.0 $version_end$ */
/**
 * This file contains file attachment functions.
 */
var NO_ATTACHMENTS_ALLOWED = 4;
var fileIndex = 0;

/**
 * Add a row to a table which contains one file attachment per row.
 * 
 * @param tableId Id of table to insert rows into
 */
function addAttachmentRow(tableId)
{
	var tbl = document.getElementById(tableId);
	var lastRow = tbl.rows.length;
	
	// Check if maximum number of allowed attachments reached
	if (lastRow == NO_ATTACHMENTS_ALLOWED - 1)
	{
		// Don't allow any more attachments to be added
		document.getElementById("addAttachment").disabled = true;
	}
	
	// Insert row/cell in table
	var row = tbl.insertRow(lastRow);
	var cell = row.insertCell(0);
	cell.className = 'Attachment';

	// Create new unique name for file (since they can be deleted and added as-desired)
	var fname = 'fileName' + fileIndex++;
	
	cell.innerHTML = '<label class="BrowseButtonLabel">&nbsp;</label>' + 
		' <span class="BrowseButtonClass"><input type="file"  name="' + fname + '" contentEditable="false" />' +
		' </span><span class="RemoveButtonWrapper">' +
		' <img  class="RemoveButtonClass" name="remove" title="' + REMOVE + '"' +
		' onclick="removeAttachmentRow(\'' + tableId + '\','+ row.rowIndex+');"' +
		' src="' + commonVariables.templatePath + '/images/delete.gif" /></span>';

	cell = row.insertCell(1);
}

/**
 * Remove specified row from a table which contains one file attachment per row.
 * 
 * @param tableId Id of table to delete row from
 * @param row Row index to delete
 */
function removeAttachmentRow(tableId, rowIndex)
{
	// Enable button to add attachment
	document.getElementById("addAttachment").disabled = false;
	
	// Delete row
	var tbl = document.getElementById(tableId);
	try {
		tbl.deleteRow(rowIndex);
	} catch(e) {
	}
}

/**
 * Remove all row table which contains one file attachment per row.
 * 
 * @param tableId Id of table to delete row from
 */
function removeAllAttachmentRows(tableId)
{
	// Enable button to add attachment
	document.getElementById("addAttachment").disabled = false;
	
	var tbl = document.getElementById(tableId);
	var lastRow = tbl.rows.length - 1;
//	try {
		for(var i=lastRow; i>=0; i--) {
			tbl.deleteRow(i);
		}
//	} catch(e) {
//	}
}

/**
 * Store concatenated list of file names in hidden field.
 * 
 * @param formId Id of form having fileNames field
 */
function setFileNames(formId) {
	var frm = document.getElementById(formId);
	var numElements = frm.elements.length;
	var fileNames = "";
	
	// Process all form elements
	for(var i=0; i<numElements; i++)
	{
		// Check if form element is a file
		if(frm.elements[i].type == "file")
		{
			// Get file name
			var fileName = frm.elements[i].value;
			if(typeof(fileName) != "undefined" && fileName != null && fileName != "")
			{
				// Get file name, excluding path
				fileName = fileName.substring((fileName.lastIndexOf("\\") + 1), fileName.length);
				//fileNames = fileNames+escape(fileName)+'|';
				fileNames = fileNames+escape(fileName);
			}
		}
	}

	frm.fileNames.value = fileNames;
}