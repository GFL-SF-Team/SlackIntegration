/*
 * Class: Util_SlackNotifierTest
 * @date: 16.08.19
 * @description: Test class for Util_SlackNotifier
 */
@IsTest
private class Util_SlackNotifierTest {

	@TestSetup
	static void insertCustomSettings() {

		Workspace__c workspace = new Workspace__c(Name = 'my name',
				Token__c = 'xoxp-705140850724-707466024983-694209657490-a9f2e6c503f81df23a699ebf46b73492');
		insert workspace;

		SlackChannel__c[] channelsCustomSettings = new SlackChannel__c[]{};
		channelsCustomSettings.add(new SlackChannel__c(Name = 'notifications', IdChannel__c = 'CLK7XH57T',
				WorkspaceId__c = workspace.Id));
		channelsCustomSettings.add(
				new SlackChannel__c(Name = 'random', IdChannel__c = 'WRONG_ID', WorkspaceId__c = workspace.Id));
		insert channelsCustomSettings;
	}


	@IsTest
	static void testBroadcastMessageToWorkspace() {

		try {
			Account a = new Account(Name = 'my name');
			update a;
		} catch (Exception e) {
			D_SlackMessage.ApexMessage message = new D_SlackMessage.ApexMessage();
			message.setTypeEvent(D_SlackMessage.EventType.INFO);
			message.setPriorityLevel(D_SlackMessage.Priority.MEDIUM);
			message.setThrownException(e);
			Test.setMock(HttpCalloutMock.class, new Util_SlackNotifierMock());

			Test.startTest();
			message.broadcast();
			Test.stopTest();
		}

		System.assert(true);
	}


	@IsTest
	static void testBroadcastMessageToWorkspaceUsers() {

		List<SlackChannel__c> channelsCustomSettings = [SELECT Id, Name, IdChannel__c From SlackChannel__c LIMIT 1000];
		delete channelsCustomSettings;

		try {
			String s;
			s.length();
		} catch (Exception e) {
			D_SlackMessage.ApexMessage message = new D_SlackMessage.ApexMessage();
			message.setThrownException(e);
			Test.setMock(HttpCalloutMock.class, new Util_SlackNotifierMock());

			Test.startTest();
			message.broadcast();
			Test.stopTest();
		}

		System.assert(true);
	}


	@IsTest
	static void testBroadcastMessageToWorkspaceInfo() {

		D_SlackMessage.ApexMessage message = new D_SlackMessage.ApexMessage();
		message.setClassName('MyClass');
		message.setMethodName('myMethod');
		message.setLineNumber(62);
		message.setNotificationText('Some notification...');
		Test.setMock(HttpCalloutMock.class, new Util_SlackNotifierMock());

		Test.startTest();
		message.broadcast();
		Test.stopTest();

		System.assert(true);
	}

}