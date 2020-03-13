/* Class: LightningResult
 * Test Class: LightningResultTest
 * @author: Dmytro Lambru
 * @date: 25.08.2018
 * @description: Response wrapper for Lightning Components
 * @history:
 */
global class LightningResult {

	private static final Integer SHOW_MESSAGE_CODE = 1001;

	@AuraEnabled
	/* Successful(TRUE) or not successful(FALSE) operation */
	global Boolean success {get; set;}

	@AuraEnabled
	/* For send a message */
	global String message {get; set;}

	@AuraEnabled
	/* Data in JSON string */
	global String data {get; set;}

	@AuraEnabled
	/* Code number for the error */
	global Integer code {get; set;}

	/* For success response - set JSON data  */
	public void setResult(String data) {
		this.data = data;
		this.success = TRUE;
	}

	/* For error response - set message */
	public void setError(String message) {
		this.message = message;
		this.success = FALSE;
	}

	/* For error response with displaying - set message */
	public void setErrorWithShowing(String message) {
		this.setError(message, SHOW_MESSAGE_CODE);
	}

	/* For error response with error code number */
	public void setError(Integer code) {
		this.code = code;
		this.success = FALSE;
	}

	/* For error response with message and error code number */
	public void setError(String message, Integer code) {
		this.message = message;
		this.code = code;
		this.success = FALSE;
	}
}