/* $version_start$ 20/08/2009$eGainBlue$1.0 $version_end$ */
/**
 * This file contains data validation functions.
 */

/**
 * Return true if value specified is purely numeric;
 * false, otherwise.
 */
function isNumeric(sText)
{
	var numericExp = new RegExp("^[0-9]+$");
	return numericExp.test(sText);
}

/**
 * Return true if value specified can be used for a user name;
 * false, otherwise.
 */
function isUserName(sText)
{
	var userNameExp = new RegExp("^[a-zA-Z][a-zA-Z0-9_]*$");
	return userNameExp.test(sText);
}

/**
 * Return true if value specified is blank or consists purely
 * of spaces; false otherwise.
 */
function isEmptyOrSpace(sText)
{
	var emptyExp = new RegExp("^ *$");
	return emptyExp.test(sText);
}

/**
 * Return true if value specified represents a well-formed
 * e-mail address.
 */
function isEmailAddr(s)
{
	var c;
	for (i = 0; i < s.length; i++)
	{
		c = s.charAt(i).charCodeAt(0);
		if (c >= 127 || c < 32)
			return false;
	}
	
	// FIX18: check email suffix (length must be > 1)
	var suffix = "";
	try {
		if (s.indexOf(".") > 0)
		{
			var suffixes = s.split(".");
			if ( suffixes.length > 0 )
				suffix = suffixes[suffixes.length - 1];
			else suffix = "";
			suffix = suffix.trim();
			if ( suffix.length < 2) 
				return false;
		}
	} catch (e) {}	

	var validChars = "[^\\(\\)><@,;:\\\\\\\"\\.\\[\\]\\s]";
	var quotedUser = "(\"[^\"]*\")";
	var atom = validChars + "+";
	var word = "(" + atom + "|" + quotedUser + ")";
	var ipDomainRE = new RegExp("^\\[(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})\\]$");
	var userRE = new RegExp("^" + word + "(\\." + word + ")*$");
	var domainRE = new RegExp("^" + atom + "(\\." + atom + ")+$");
	var emailRE = new RegExp("^(.+)@(.+)$");
	s.match(emailRE);
	var user = RegExp.$1;
	// FIX21: allow email addresses like user.@domain.com (ticket 7443)
	try {
		if (user!=undefined && user.length>0 && user.slice(-1)==".")
			user = user.substring(0, user.length - 1);
	} catch (ex) {}
	var domain = new String(RegExp.$2);
	if (!userRE.test(user))
		return false;
	
	var ipMatches = domain.match(ipDomainRE);
	if (ipMatches != null && ipMatches.length != 0)
	{
		for (i = 1; i < 4; i++)
		{
			if (ipMatches[0].charCodeAt(i) > 255)
				return false;
		}
		return true;
	}
	
	return (domainRE.test(domain));
}

/**
 * Return true if customer information is valid;
 * display error and return false otherwise.
 */
function isValidCustomerInformation(formName)
{
	var str;
	var ch;
	var frm = getForm(formName);
	str = frm.SEQ.value

	for (j = 0; j < frm.SEQ.value.length; j++)
	{
		ch = str.charAt(j);
		switch (ch)
		{
			case "U":
				// Validate user name
				if (!isUserName(frm.USERNAME.value))
				{
					alert(L10N_INVALID_USER_NAME);
					frm.USERNAME.focus();
					return (false);
				}

				if (frm.USER_NAME_HD.value != 0)
				{
					if (isEmptyOrSpace(frm.USERNAME.value))
					{
						alert(L10N_USER_NAME_REQD);
						frm.USERNAME.focus();
						return (false);
					}

					if (frm.USERNAME.value.length > 200)
					{
						alert(L10N_USER_NAME_LENGTH_INVALID);
						frm.USERNAME.focus();
						return (false);
					}
				}
				break;
				
			case "F":
				// Validate first name
				if (frm.FIRST_NAME.value.length > 124)
				{
					alert(L10N_FIRST_NAME_LENGTH_INVALID);
					frm.FIRST_NAME.focus();
					return (false);
				}

				if (frm.FIRST_NAME_HD.value != 0)
				{
					if (isEmptyOrSpace(frm.FIRST_NAME.value))
					{
						alert(L10N_FIRST_NAME_REQD);
						frm.FIRST_NAME.focus();
						return (false);
					}
				}
				break;
				
			case "W":
				// Validate password
				if (frm.PASSWORD_HD.value != 0)
				{
					if (isEmptyOrSpace(frm.PASSWORD.value))
					{
						alert(L10N_PASSWORD_REQD);
						frm.PASSWORD.focus();
						return (false);
					}

					if (frm.PASSWORD.value.length < 6)
					{
						alert(L10N_PASSWORD_LENGTH_INVALID1);
						frm.PASSWORD.focus();
						return (false);
					}

					if (frm.PASSWORD.value.length > 255)
					{
						alert(L10N_PASSWORD_LENGTH_INVALID2);
						frm.PASSWORD.focus();
						return (false);
					}

					if (isEmptyOrSpace(frm.RETYPEPASSWORD.value))
					{
						alert(L10N_RE_TYPE_PASSWORD_REQD);
						frm.RETYPEPASSWORD.focus();
						return (false);
					}

					if (frm.RETYPEPASSWORD.value != frm.PASSWORD.value)
					{
						alert(L10N_PASSWORD_DO_NOT_MATCH);
						frm.RETYPEPASSWORD.focus();
						return (false);
					}

					if (frm.PASSWORD.value == "******" && frm.RETYPEPASSWORD.value == "******")
					{
						frm.PASSWORD.value = frm.PASSWORDFROMDB.value;
						frm.RETYPEPASSWORD.value = frm.PASSWORDFROMDB.value;
					}
				}
				break;
				
			case "M":
				// Validate middle name
				if (frm.MIDDLE_NAME.value.length > 124)
				{
					alert(L10N_MIDDLE_NAME_LENGTH_INVALID);
					frm.MIDDLE_NAME.focus();
					return (false);
				}
				
				if (frm.MIDDLE_NAME_HD.value != 0)
				{
					if (isEmptyOrSpace(frm.MIDDLE_NAME.value))
					{
						alert(L10N_MIDDLE_NAME_REQD);
						frm.MIDDLE_NAME.focus();
						return (false);
					}
				}
				break;
				
			case "L":
				// Validate last name
				if (frm.LAST_NAME.value.length > 124)
				{
					alert(L10N_LAST_NAME_LENGTH_INVALID);
					frm.LAST_NAME.focus();
					return (false);
				}
				
				if (frm.LAST_NAME_HD.value != 0)
				{
					if (isEmptyOrSpace(frm.LAST_NAME.value))
					{
						alert(L10N_LAST_NAME_REQD);
						frm.LAST_NAME.focus();
						return (false);
					}
				}
				break;
				
			case "o":
				// Validate eGain Support number
				if (isEmptyOrSpace(frm.SUPPORT_ACCOUNT_NUMBER.value))
				{
					alert(L10N_SUPPORT_ACCOUNT_NUMBER_REQD);
					document.signup.SUPPORT_ACCOUNT_NUMBER.focus();
					return false;
				}
				break;
				
			case "N":
				// Validate Company name
				if (isEmptyOrSpace(frm.COMPANY_NAME.value))
				{
					alert(L10N_COMPANY_NAME_REQD);
					document.signup.COMPANY_NAME.focus();
					return false;
				}
				break;

			case "E":
				// Validate e-mail address
				if (frm.EMAIL_ADDRESS.value.length > 200)
				{
					alert(L10N_EMAIL_ADDRESS_LENGTH_INVALID);
					frm.EMAIL_ADDRESS.focus();
					return (false);
				}

				if (!isEmailAddr(frm.EMAIL_ADDRESS.value))
				{
					alert(L10N_INVALID_EMAIL);
					frm.EMAIL_ADDRESS.focus();
					return (false);
				}

				if (frm.EMAIL_ADDRESS_HD.value != 0)
				{
					if (isEmptyOrSpace(frm.EMAIL_ADDRESS.value))
					{
						alert(L10N_INVALID_EMAIL);
						frm.EMAIL_ADDRESS.focus();
						return (false);
					}
				}
				break;
				
			case "Z":
				// Validate zip code
				if (frm.ZIP.value.length > 50)
				{
					alert(L10N_ZIP_LENGTH_INVALID);
					frm.ZIP.focus();
					return (false);
				}

				if (frm.ZIP_HD.value != 0)
				{
					if (isEmptyOrSpace(frm.ZIP.value))
					{
						alert(L10N_ZIP_REQD);
						frm.ZIP.focus();
						return (false);
					}
				}
				break;
				
			case "G":
				// Validate gender
				if (frm.GENDER_HD.value != 0)
				{
					if (isEmptyOrSpace(frm.GENDER.value))
					{
						alert(L10N_GENDER_REQD);
						frm.GENDER.focus();
						return (false);
					}
				}
				break;
				
			case "A":
				// Validate marital status
				if (frm.MARITAL_STATUS_HD.value != 0)
				{
					if (isEmptyOrSpace(frm.MARITAL_STATUS.value))
					{
						alert(L10N_MARITAL_STATUS_REQD);
						frm.MARITAL_STATUS.focus();
						return (false);
					}
				}
				break;
				
			case "D":
				// Validate birth date
				if (frm.DATE_OF_BIRTH_MM.value.length > 0)
				{
					if (!isNumeric(frm.DATE_OF_BIRTH_MM.value))
					{
						alert(L10N_INVALID_DATE_OF_BIRTH_MM);
						frm.DATE_OF_BIRTH_MM.focus();
						return (false);
					}

					if ((frm.DATE_OF_BIRTH_MM.value > 12) || (frm.DATE_OF_BIRTH_MM.value < 1))
					{
						alert(L10N_DATE_OF_BIRTH_MM_LENGTH_INVALID);
						frm.DATE_OF_BIRTH_MM.focus();
						return (false);
					}

					frm.DATE_OF_BIRTH_MM_HD.value = 1;
				}

				// Day of Date of Birth validation
				if (frm.DATE_OF_BIRTH_DD.value.length > 0)
				{
					if (!isNumeric(frm.DATE_OF_BIRTH_DD.value))
					{
						alert(L10N_INVALID_DATE_OF_BIRTH_DD);
						frm.DATE_OF_BIRTH_DD.focus();
						return (false);
					}

					// Validate month and days combination
					if ((frm.DATE_OF_BIRTH_MM.value == 4 || frm.DATE_OF_BIRTH_MM.value == 6
									|| frm.DATE_OF_BIRTH_MM.value == 9 || frm.DATE_OF_BIRTH_MM.value == 11)
									&& ((frm.DATE_OF_BIRTH_DD.value >= 31) || (frm.DATE_OF_BIRTH_DD.value < 1)))
					{
						alert(L10N_DATE_OF_BIRTH_DD_LENGTH_INVALID1);
						frm.DATE_OF_BIRTH_DD.focus();
						return (false);
					}

					if ((frm.DATE_OF_BIRTH_MM.value == 1 || frm.DATE_OF_BIRTH_MM.value == 3
									|| frm.DATE_OF_BIRTH_MM.value == 5 || frm.DATE_OF_BIRTH_MM.value == 7
									|| frm.DATE_OF_BIRTH_MM.value == 8 || frm.DATE_OF_BIRTH_MM.value == 10 || frm.DATE_OF_BIRTH_MM.value == 12)
									&& ((frm.DATE_OF_BIRTH_DD.value >= 32) || (frm.DATE_OF_BIRTH_DD.value < 1)))
					{
						alert(L10N_DATE_OF_BIRTH_DD_LENGTH_INVALID);
						frm.DATE_OF_BIRTH_DD.focus();
						return (false);
					}

					frm.DATE_OF_BIRTH_MM_HD.value = 1;
				}
				
				// Validate year
				if (frm.DATE_OF_BIRTH_YY.value.length > 0)
				{
					if (!isNumeric(frm.DATE_OF_BIRTH_YY.value))
					{
						alert(L10N_INVALID_DATE_OF_BIRTH_YY);
						frm.DATE_OF_BIRTH_YY.focus();
						return (false);
					}

					if ((frm.DATE_OF_BIRTH_YY.value < 1753) || (frm.DATE_OF_BIRTH_YY.value > 9999))
					{
						alert(L10N_DATE_OF_BIRTH_YY_LENGTH_INVALID);
						frm.DATE_OF_BIRTH_YY.focus();
						return (false);
					}

					// Validate day and month combinations
					if ((frm.DATE_OF_BIRTH_MM.value == 2) && ((frm.DATE_OF_BIRTH_YY.value) % 4 == 0))
					{
						if ((frm.DATE_OF_BIRTH_DD.value >= 30) || (frm.DATE_OF_BIRTH_DD.value < 1))
						{
							// alert enter date from 1 to 29
							alert(L10N_DATE_OF_BIRTH_DD_LENGTH_INVALID3);
							frm.DATE_OF_BIRTH_DD.focus();
							return (false);
						}
					}
					else if ((frm.DATE_OF_BIRTH_MM.value == 2) && ((frm.DATE_OF_BIRTH_YY.value) % 4 != 0))
					{
						if ((frm.DATE_OF_BIRTH_DD.value >= 29) || (frm.DATE_OF_BIRTH_DD.value < 1))
						{
							// alert enter date from 1 to 28
							alert(L10N_DATE_OF_BIRTH_DD_LENGTH_INVALID2);
							frm.DATE_OF_BIRTH_DD.focus();
							return (false);
						}
					}
					
					frm.DATE_OF_BIRTH_MM_HD.value = 1;
				}
				
				// Validate month of birth
				if (frm.DATE_OF_BIRTH_MM_HD.value != 0)
				{
					if (isEmptyOrSpace(frm.DATE_OF_BIRTH_MM.value))
					{
						alert(L10N_DATE_OF_BIRTH_MM_REQD);
						frm.DATE_OF_BIRTH_MM.focus();
						return (false);
					}
					
					// Validate day
					if (isEmptyOrSpace(frm.DATE_OF_BIRTH_DD.value))
					{
						alert(L10N_DATE_OF_BIRTH_DD_REQD);
						frm.DATE_OF_BIRTH_DD.focus();
						return (false);
					}
					
					// Validate year
					if (isEmptyOrSpace(frm.DATE_OF_BIRTH_YY.value))
					{
						alert(L10N_DATE_OF_BIRTH_YY_REQD);
						frm.DATE_OF_BIRTH_YY.focus();
						return (false);
					}
				}
				break;
				
			case "R":
				// Validate address line 1
				if (frm.ADDRESSLINE1.value.length > 50)
				{
					alert(L10N_ADDRESSLINE1_LENGTH_INVALID);
					frm.ADDRESSLINE1.focus();
					return (false);
				}

				if (frm.ADDRESSLINE1_HD.value != 0)
				{
					if (isEmptyOrSpace(frm.ADDRESSLINE1.value))
					{
						alert(L10N_ADDRESSLINE1_REQD);
						frm.ADDRESSLINE1.focus();
						return (false);
					}
				}
				break;
				
			case "I":
				// Validate address line 2
				if (frm.ADDRESSLINE2.value.length > 50)
				{
					alert(L10N_ADDRESSLINE2_LENGTH_INVALID);
					frm.ADDRESSLINE2.focus();
					return (false);
				}

				if (frm.ADDRESSLINE2_HD.value != 0)
				{
					if (isEmptyOrSpace(frm.ADDRESSLINE2.value))
					{
						alert(L10N_ADDRESSLINE2_REQD);
						frm.ADDRESSLINE2.focus();
						return (false);
					}
				}
				break;
				
			case "C":
				// Validate city
				if (frm.CITY.value.length > 50)
				{
					alert(L10N_CITY_LENGTH_INVALID);
					frm.CITY.focus();
					return (false);
				}

				if (frm.CITY_HD.value != 0)
				{
					if (isEmptyOrSpace(frm.CITY.value))
					{
						alert(L10N_CITY_REQD);
						frm.CITY.focus();
						return (false);
					}
				}
				break;
				
			case "T":
				// Validate state
				if (frm.STATE.value.length > 50)
				{
					alert(L10N_STATE_LENGTH_INVALID);
					frm.STATE.focus();
					return (false);
				}

				if (frm.STATE_HD.value != 0)
				{
					if (isEmptyOrSpace(frm.STATE.value))
					{
						alert(L10N_STATE_REQD);
						frm.STATE.focus();
						return (false);
					}
				}
				break;
				
			case "Y":
				// Validate country
				if (frm.COUNTRY1.value.length > 50)
				{
					alert(L10N_COUNTRY1_LENGTH_INVALID);
					frm.COUNTRY1.focus();
					return (false);
				}

				if (frm.COUNTRY1_HD.value != 0)
				{
					if (isEmptyOrSpace(frm.COUNTRY1.value))
					{
						alert(L10N_COUNTRY1_REQD);
						frm.COUNTRY1.focus();
						return (false);
					}
				}
				break;
				
			case "P":
				// Validate phone number
				if (frm.PHONE_NUMBER.value.length > 40)
				{
					alert(L10N_PHONE_NUMBER_LENGTH_INVALID);
					frm.PHONE_NUMBER.focus();
					return (false);
				}

				if (frm.PHONE_NUMBER_HD.value != 0)
				{
					if (isEmptyOrSpace(frm.PHONE_NUMBER.value))
					{
						alert(L10N_PHONE_NUMBER_REQD);
						frm.PHONE_NUMBER.focus();
						return (false);
					}
				}
				break;
				
			default:
				break;
		}
	}

	return (true);
}