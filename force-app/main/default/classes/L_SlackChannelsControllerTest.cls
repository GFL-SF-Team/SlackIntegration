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
											      Token__c = 'xoxp-012345678901-012345678901-012345678901-testexampleoftoken12345678901234');
		insert workspace;

		SlackChannel__c[] channelsCustomSettings = new SlackChannel__c [] { 
		};
		channelsCustomSettings.add(new SlackChannel__c(Name = 'notifications', IdChannel__c = 'SOME_ID01', 
								   WorkspaceId__c = workspace.Id));
		channelsCustomSettings.add(new SlackChannel__c(Name = 'random', IdChannel__c = 'SOME_ID02', WorkspaceId__c = workspace.Id));

		insert channelsCustomSettings;
	}


	@IsTest static void testGetSlackChannels() {

		LightningResult response = L_SlackChannelsController.getSlackChannels();
		SlackChannel__c[] channels = (List<SlackChannel__c>) JSON.deserialize(response.data, List<SlackChannel__c>.class);

		System.assert(response.success);
		System.assertEquals(2, channels.size());
	}


	@IsTest static void testGetWorkspaces() {

		LightningResult response = L_SlackChannelsController.getWorkspaces();
		Workspace__c[] workspaces = (List<Workspace__c>) JSON.deserialize(response.data, List<Workspace__c>.class);

		System.assert(response.success);
		System.assertEquals(1, workspaces.size());
	}


	@IsTest static void testGetExistingSlackChannels() {

		String jsonWorkspaces = L_SlackChannelsController.getWorkspaces().data;
		Workspace__c[] workspaces = (List<Workspace__c>) JSON.deserialize(jsonWorkspaces, List<Workspace__c>.class);
		String workspaceToken = workspaces [0].Token__c;
		Test.setMock(HttpCalloutMock.class, new Util_SlackNotifierMock());

		Test.startTest();
		LightningResult response = L_SlackChannelsController.getExistingSlackChannels(workspaceToken);
		Test.stopTest();
		SlackChannel__c[] channels = (List<SlackChannel__c>) JSON.deserialize(response.data, List<SlackChannel__c>.class);

		System.assert(response.success);
		System.assertEquals(1, channels.size());
	}

	@IsTest static void testGetExistingSlackChannelsFromInvalidWorkspace() {

		String workspaceToken = '';
		Test.setMock(HttpCalloutMock.class, new Util_SlackNotifierMock());

		Test.startTest();
		LightningResult response = L_SlackChannelsController.getExistingSlackChannels(workspaceToken);
		Test.stopTest();

		System.assert(!response.success);
	}


	@IsTest static void testSaveChannelsFromWorkspace() {

		String jsonWorkspaces = L_SlackChannelsController.getWorkspaces().data;
		Workspace__c[] workspaces = (List<Workspace__c>) JSON.deserialize(jsonWorkspaces, List<Workspace__c>.class);

		Workspace__c workspace = workspaces [0];
		String workspaceId = workspace.Id;
		SlackChannel__c channel1 =
		new SlackChannel__c(Name = 'channel1', IdChannel__c = 'ID_CHAN1', WorkspaceId__c = workspaceId);
		SlackChannel__c channel2 =
		new SlackChannel__c(Name = 'channel2', IdChannel__c = 'ID_CHAN2', WorkspaceId__c = workspaceId);
		SlackChannel__c channel3 =
		new SlackChannel__c(Name = 'channel3', IdChannel__c = 'ID_CHAN3', WorkspaceId__c = workspaceId);
		SlackChannel__c[] channelsList = new SlackChannel__c [] { 
			channel1, channel2, channel3 };

		Test.startTest();
		LightningResult response = L_SlackChannelsController.saveChannelsFromWorkspace(channelsList, workspaceId);
		Test.stopTest();

		SlackChannel__c[] channelsListAfterInsert = [SELECT Id FROM SlackChannel__c LIMIT 1000];
		System.assert(response.success);
		System.assertEquals(3, channelsListAfterInsert.size());

	}

	@IsTest static void testSaveInvalidChannels() {

		String jsonWorkspaces = L_SlackChannelsController.getWorkspaces().data;
		Workspace__c[] workspaces = (List<Workspace__c>) JSON.deserialize(jsonWorkspaces, List<Workspace__c>.class);

		Workspace__c workspace = workspaces [0];
		String workspaceId = workspace.Id;
		SlackChannel__c channel1 = new SlackChannel__c(Name = '', IdChannel__c = '');
		SlackChannel__c[] channelsList = new SlackChannel__c [] { channel1 };

		Test.startTest();
		LightningResult response = L_SlackChannelsController.saveChannelsFromWorkspace(channelsList, workspaceId);
		Test.stopTest();

		System.assert(!response.success);

	}

	@IsTest static void testDeleteChannel() {

		SlackChannel__c channelToDelete = [SELECT Id FROM SlackChannel__c LIMIT 1];

		Test.startTest();
		LightningResult response = L_SlackChannelsController.deleteChannel(channelToDelete);
		Test.stopTest();

		SlackChannel__c[] channelsListAfterInsert = [SELECT Id FROM SlackChannel__c LIMIT 1000];
		System.assert(response.success);
		System.assertEquals(1, channelsListAfterInsert.size());
	}

	@IsTest static void testDeleteInvalidChannel() {

		SlackChannel__c channelToDelete = new SlackChannel__c(Name='Some Channel', IdChannel__c='SOME_ID12');

		Test.startTest();
		LightningResult response = L_SlackChannelsController.deleteChannel(channelToDelete);
		Test.stopTest();

		SlackChannel__c[] channelsListAfterInsert = [SELECT Id FROM SlackChannel__c LIMIT 1000];
		System.assert(!response.success);
	}
}