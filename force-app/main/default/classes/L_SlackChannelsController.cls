/*
 * Class: L_SlackChannelsController
 * Test Class: L_SlackChannelsControllerTest
 * @date: 30.08.19
 * @description: Controller class for SlackChannels Lightning component
 */
public class L_SlackChannelsController {

	/*
	 * @date: 02.09.19
	 * @description: Gets Slack channels from Custom Settings
	 * @test: L_SlackChannelsControllerTest.testGetSlackChannels()
	 */
	@AuraEnabled
	public static String getSlackChannels() {

		return JSON.serialize(Util_SlackSettingsData.getChannelsFromSettings());
	}

	/*
	 * @date: 02.09.19
	 * @description: Gets Slack workspaces from Custom Settings
	 * @test: L_SlackChannelsControllerTest.testGetWorkspaces()
	 */
	@AuraEnabled
	public static String getWorkspaces() {

		return JSON.serialize(Util_SlackSettingsData.getWorkspacesFromSettings());
	}

	/*
	 * @date: 02.09.19
	 * @description: Gets Slack channels from Slack by performing HTTP request
	 * @param: workspaceToken - token from Slack workspace
	 * @test: L_SlackChannelsControllerTest.testGetExistingSlackChannels()
	 */
	@AuraEnabled
	public static String getExistingSlackChannels(String workspaceToken) {

		List<SlackChannel__c> channels = Util_SlackNotifierHelper.getWorkspaceChannelsFromSlack(workspaceToken);

		return JSON.serialize(channels);
	}

	/*
	 * @date: 02.09.19
	 * @description: Rewrites selected channels for workspace in Custom Settings
	 * @param: selectedChannels - a list of channels selected in the Slack Workspace channels component
	 * @param: workspaceId - an Id of the Workspace__c record of the selectedChannels list from Custom Settings
	 * @test: L_SlackChannelsControllerTest.testSaveChannelsFromWorkspace()
	 */
	@AuraEnabled
	public static void saveChannelsFromWorkspace(SlackChannel__c[] selectedChannels, String workspaceId) {

		Util_SlackSettingsData.saveChannelsFromWorkspace(selectedChannels, workspaceId);
	}

	/*
	 * @date: 02.09.19
	 * @description: Deletes a specified channel record from Custom Settings
	 * @param: channel - a channel record to delete from the Custom Settings
	 * @test: L_SlackChannelsControllerTest.testDeleteChannel()
	 */
	@AuraEnabled
	public static void deleteChannel(SlackChannel__c channel) {

		Util_SlackSettingsData.deleteChannel(channel);
	}
}