/*
 * Class: L_SlackNotificationController
 * Test Class: L_SlackNotificationControllerTest
 * @date: 15.08.19
 * @description: Controller for SlackNotification Lightning Component
 */
global with sharing class L_SlackNotificationController {

	/*
	 * @date: 15.08.19
	 * @description: Creates Message from Lightning front-end using type, priority and textMessage and broadcasts it
	 * @param: type - type of the message
	 * @param: priority - message priority
	 * @param: textMessage - text of the message from Lightning front-end controller
	 * @test: L_SlackNotificationControllerTest.testSendSlackNotification()
	 */
	@AuraEnabled
	global static void sendSlackNotification(String type, String priority, String textMessage) {

		D_SlackMessage.LightningMessage slackMessage = new D_SlackMessage.LightningMessage();
		slackMessage.setTypeEvent(type);
		slackMessage.setPriorityLevel(priority);
		slackMessage.setNotificationText(textMessage);
		slackMessage.broadcast();
	}
}