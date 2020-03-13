/*
 * Class: L_SlackChannelsController
 * Test Class: L_SlackChannelsControllerTest
 * @date: 30.08.19
 * @description: Controller class for SlackChannels Lightning component
 */
global with sharing class L_SlackChannelsController {


	public static final LightningResult RESPONSE =  new LightningResult();
	/*
	 * @date: 02.09.19
	 * @description: Gets Slack channels from Custom Settings
	 * @test: L_SlackChannelsControllerTest.testGetSlackChannels()
	 */
	@AuraEnabled
	global static LightningResult getSlackChannels() {

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
	global static LightningResult getWorkspaces() {
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
	global static LightningResult getExistingSlackChannels(String workspaceToken) {

		SlackChannel__c[] slackChannelsList;

		try{
			slackChannelsList = Util_SlackNotifierHelper.getWorkspaceChannelsFromSlack(workspaceToken); 
			RESPONSE.setResult(JSON.serialize(slackChannelsList));

		}catch (ShowMessageException e){
			RESPONSE.setErrorWithShowing(e.getMessage());
			
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
	global static LightningResult saveChannelsFromWorkspace(String selectedChannels, String workspaceId) {

		try{
			SlackChannel__c[] selectedChannelsParsed = (SlackChannel__c[]) JSON.deserialize(selectedChannels, List<SlackChannel__c>.class);
			Util_SlackSettingsData.saveChannelsFromWorkspace(selectedChannelsParsed, workspaceId);
			RESPONSE.setResult('');

		}catch (ShowMessageException e){
			RESPONSE.setErrorWithShowing(e.getMessage());
			
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
	global static LightningResult deleteChannel(String channel) {

		try{
			SlackChannel__c channelParsed = (SlackChannel__c)JSON.deserialize(channel, SlackChannel__c.class);
			Util_SlackSettingsData.deleteChannel(channelParsed);
			RESPONSE.setResult('');

		}catch (ShowMessageException e){
			RESPONSE.setErrorWithShowing(e.getMessage());
			
		}catch (Exception e){
			RESPONSE.setError(e.getMessage());
		}

		return RESPONSE;
	}
}