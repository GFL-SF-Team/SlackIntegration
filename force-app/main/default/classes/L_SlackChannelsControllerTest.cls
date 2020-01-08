/*
 * Class: L_SlackChannelsControllerTest
 * @date: 30.08.19
 * @description: Test class for L_SlackChannelsController
 */
@IsTest
private class L_SlackChannelsControllerTest {

	@TestSetup
	static void insertCustomSettings() {

		Workspace__c workspace = new Workspace__c(Name = 'my name', 
											      Token__c = 'xoxp-705140850724-707466024983-694209657490-a9f2e6c503f81df23a699ebf46b73492');
		insert workspace;

		SlackChannel__c[] channelsCustomSettings = new SlackChannel__c [] { 
		};
		channelsCustomSettings.add(new SlackChannel__c(Name = 'notifications', IdChannel__c = 'CLK7XH57T', 
								   WorkspaceId__c = workspace.Id));
		channelsCustomSettings.add(new SlackChannel__c(Name = 'random', IdChannel__c = 'WRONG_ID', WorkspaceId__c = workspace.Id));
		insert channelsCustomSettings;
	}


	@IsTest static void testGetSlackChannels() {

		String jsonResult = L_SlackChannelsController.getSlackChannels().data;
		SlackChannel__c[] channels = (List<SlackChannel__c>) JSON.deserialize(jsonResult, List<SlackChannel__c>.class);

		System.assertEquals(2, channels.size());
	}


	@IsTest static void testGetWorkspaces() {

		String jsonResult = L_SlackChannelsController.getWorkspaces().data;
		Workspace__c[] workspaces = (List<Workspace__c>) JSON.deserialize(jsonResult, List<Workspace__c>.class);
		System.assertEquals(1, workspaces.size());
	}


	@IsTest static void testGetExistingSlackChannels() {

		String jsonWorkspaces = L_SlackChannelsController.getWorkspaces().data;
		Workspace__c[] workspaces = (List<Workspace__c>) JSON.deserialize(jsonWorkspaces, List<Workspace__c>.class);
		String workspaceToken = workspaces [0].Token__c;
		Test.setMock(HttpCalloutMock.class, new Util_SlackNotifierMock());

		Test.startTest();
		String jsonChannels = L_SlackChannelsController.getExistingSlackChannels(workspaceToken).data;
		Test.stopTest();
		SlackChannel__c[] channels = (List<SlackChannel__c>) JSON.deserialize(jsonChannels, List<SlackChannel__c>.class);


		System.assertEquals(1, channels.size());
	}


	@IsTest static void testSaveChannelsFromWorkspace() {

		String jsonWorkspaces = L_SlackChannelsController.getWorkspaces().data;
		Workspace__c[] workspaces = (List<Workspace__c>) JSON.deserialize(jsonWorkspaces, List<Workspace__c>.class);

		Workspace__c workspace = workspaces [0];
		String workspaceId = workspace.Id;
		SlackChannel__c channel1 =
		new SlackChannel__c(Name = 'channel1', IdChannel__c = 'LK43K3JJ', WorkspaceId__c = workspaceId);
		SlackChannel__c channel2 =
		new SlackChannel__c(Name = 'channel2', IdChannel__c = 'KE5F35VS', WorkspaceId__c = workspaceId);
		SlackChannel__c channel3 =
		new SlackChannel__c(Name = 'channel3', IdChannel__c = 'LDE4U3K3', WorkspaceId__c = workspaceId);
		SlackChannel__c[] channelsList = new SlackChannel__c [] { 
			channel1, channel2, channel3 };

		Test.startTest();
		L_SlackChannelsController.saveChannelsFromWorkspace(channelsList, workspaceId);
		Test.stopTest();

		SlackChannel__c[] channelsListAfterInsert = [SELECT Id FROM SlackChannel__c LIMIT 1000];
		System.assertEquals(3, channelsListAfterInsert.size());

	}


	@IsTest static void testDeleteChannel() {

		SlackChannel__c channelToDelete = [SELECT Id FROM SlackChannel__c LIMIT 1];
		L_SlackChannelsController.deleteChannel(channelToDelete);
		SlackChannel__c[] channelsListAfterInsert = [SELECT Id FROM SlackChannel__c LIMIT 1000];
		System.assertEquals(1, channelsListAfterInsert.size());
	}
}