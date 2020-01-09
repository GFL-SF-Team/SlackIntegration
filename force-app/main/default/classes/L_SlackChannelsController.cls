/*
 * Class: L_SlackChannelsController
 * Test Class: L_SlackChannelsControllerTest
 * @date: 30.08.19
 * @description: Controller class for SlackChannels Lightning component
 */
public class L_SlackChannelsController {


	public static final LightningResult RESPONSE =  new LightningResult();
	/*
	 * @date: 02.09.19
	 * @description: Gets Slack channels from Custom Settings
	 * @test: L_SlackChannelsControllerTest.testGetSlackChannels()
	 */
	@AuraEnabled
	public static LightningResult getSlackChannels() {

		SlackChannel__c[] slackChannelsList;

		try{
			slackChannelsList = Util_SlackSettingsData.getChannelsFromSettings();
			RESPONSE.setResult(JSON.serialize(slackChannelsList));

		}catch (Exception e){
			RESPONSE.setError(e.getMessage());
		}

		return RESPONSE;
	}

	/*
	 * @date: 02.09.19
	 * @description: Gets Slack workspaces from Custom Settings
	 * @test: L_SlackChannelsControllerTest.testGetWorkspaces()
	 */
	@AuraEnabled
	public static LightningResult getWorkspaces() {
		Workspace__c[] slackWorkspacesList;

		try{
			slackWorkspacesList = Util_SlackSettingsData.getWorkspacesFromSettings();
			RESPONSE.setResult(JSON.serialize(slackWorkspacesList));

		}catch (Exception e){
			RESPONSE.setError(e.getMessage());
		}

		return RESPONSE;
	}

	/*
	 * @date: 02.09.19
	 * @description: Gets Slack channels from Slack by performing HTTP request
	 * @param: workspaceToken - token from Slack workspace
	 * @test: L_SlackChannelsControllerTest.testGetExistingSlackChannels()
	 */
	@AuraEnabled
	public static LightningResult getExistingSlackChannels(String workspaceToken) {

		SlackChannel__c[] slackChannelsList;

		try{
			slackChannelsList = Util_SlackNotifierHelper.getWorkspaceChannelsFromSlack(workspaceToken); 
			RESPONSE.setResult(JSON.serialize(slackChannelsList));

		}catch (Exception e){
			RESPONSE.setError(e.getMessage());
		}

		return RESPONSE;
	}

	/*
	 * @date: 02.09.19
	 * @description: Rewrites selected channels for workspace in Custom Settings
	 * @param: selectedChannels - a list of channels selected in the Slack Workspace channels component
	 * @param: workspaceId - an Id of the Workspace__c record of the selectedChannels list from Custom Settings
	 * @test: L_SlackChannelsControllerTest.testSaveChannelsFromWorkspace()
	 */
	@AuraEnabled
	public static LightningResult saveChannelsFromWorkspace(SlackChannel__c[] selectedChannels, String workspaceId) {

		try{
			Util_SlackSettingsData.saveChannelsFromWorkspace(selectedChannels, workspaceId);
			RESPONSE.setResult(JSON.serialize(''));

		}catch (Exception e){
			RESPONSE.setError(e.getMessage());
		}

		return RESPONSE;
	}

	/*
	 * @date: 02.09.19
	 * @description: Deletes a specified channel record from Custom Settings
	 * @param: channel - a channel record to delete from the Custom Settings
	 * @test: L_SlackChannelsControllerTest.testDeleteChannel()
	 */
	@AuraEnabled
	public static LightningResult deleteChannel(SlackChannel__c channel) {

		try{
			Util_SlackSettingsData.deleteChannel(channel);
			RESPONSE.setResult(JSON.serialize(''));

		}catch (DmlException e){
			RESPONSE.setError(e.getMessage());

		}catch (Exception e){
			RESPONSE.setError(e.getMessage());
		}

		return RESPONSE;
	}
}