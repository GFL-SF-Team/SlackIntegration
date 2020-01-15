/*
 * Class: L_SlackNotificationControllerTest
 * @date: 16.08.19
 * @description: Test class for L_SlackNotificationController
 */
@IsTest
private class L_SlackNotificationControllerTest {

	@TestSetup
	static void insertCustomSettings() {

		Workspace__c workspace = new Workspace__c(Name = 'my name',
				Token__c = 'xoxp-012345678901-012345678901-012345678901-testexampleoftoken12345678901234');
		insert workspace;
		SlackChannel__c[] channelsCustomSettings = new SlackChannel__c[]{};
		channelsCustomSettings.add(new SlackChannel__c(Name = 'notifications', IdChannel__c = 'ID_CHAN01',
				WorkspaceId__c = workspace.Id));
		channelsCustomSettings.add(
				new SlackChannel__c(Name = 'random', IdChannel__c = 'ID_CHAN02', WorkspaceId__c = workspace.Id));
		insert channelsCustomSettings;
	}


	@IsTest
	static void testSendSlackNotification() {

		String type = 'ERROR';
		String priority = 'HIGH';
		String message = 'Some text message from lightning...';
		Test.setMock(HttpCalloutMock.class, new Util_SlackNotifierMock());

		Test.startTest();
		L_SlackNotificationController.sendSlackNotification(type, priority, message);
		Test.stopTest();

		System.assert(true);
	}


	@IsTest
	static void testSendSlackNotification2() {

		String type = 'WARNING';
		String priority = 'MEDIUM';
		String message = 'Some text message from lightning...';
		Test.setMock(HttpCalloutMock.class, new Util_SlackNotifierMock());

		Test.startTest();
		L_SlackNotificationController.sendSlackNotification(type, priority, message);
		Test.stopTest();

		System.assert(true);
	}


	@IsTest
	static void testSendSlackNotification3() {

		String type = 'INFO';
		String priority = 'LOW';
		String message = 'Some text message from lightning...';
		Test.setMock(HttpCalloutMock.class, new Util_SlackNotifierMock());

		Test.startTest();
		L_SlackNotificationController.sendSlackNotification(type, priority, message);
		Test.stopTest();

		System.assert(true);
	}
}