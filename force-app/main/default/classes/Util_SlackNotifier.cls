/*
 * Class: Util_SlackNotifier
 * Test Class: Util_SlackNotifierTest
 * @date: 15.08.19
 * @description: Performs broadcasting a message to workspace channels or users
 */
public with sharing class Util_SlackNotifier {

	/*
	 * @date: 15.08.2019
	 * @description: Sends a message to slack channels from specified in Custom Settings or to users if the channels do not exist
	 * @param: plainMessage - Simple text to display in pop-up notifications
	 * @param: richMessage - Structured rich message in JSON format to display in main slack window
	 * @test: Util_SlackNotifierTest.testBroadcastMessageToWorkspace()
	 */
	public static void broadcastMessageToWorkspace(String plainMessage, String richMessage) {

		Workspace__c[] workspaces = Util_SlackSettingsData.getWorkspacesFromSettings();
		SlackChannel__c[] channelsFromSettings = Util_SlackSettingsData.getChannelsFromSettings();

		for (Workspace__c workspace : workspaces) {
			SlackChannel__c[] channelsFromSlack =
					Util_SlackNotifierHelper.getWorkspaceChannelsFromSlack(workspace.Token__c);

			channelsFromSlack =
					Util_SlackNotifierHelper.getIntersectionChannels(channelsFromSlack, channelsFromSettings);

			if (channelsFromSlack.isEmpty()) {
				SlackChannel__c[] userList = Util_SlackNotifierHelper.getUserListFromSlack(workspace.Token__c);

				for (SlackChannel__c user : userList) {

					if (!user.Name.equals('slackbot')) {
						channelsFromSlack.add(user);
					}
				}
			}

			for (SlackChannel__c channel : channelsFromSlack) {
				Util_SlackNotifierHelper.sendMessageToChannel(workspace.Token__c, channel.IdChannel__c, plainMessage,
						richMessage);
			}

		}

	}

	/*
	 * @date: 15.08.2019
	 * @description: Wraps broadcastMessageToWorkspace method call in an asynchronous callout
	 * @param: plainMessage - Simple text to display in pop-up notifications
	 * @param: richMessage - Structured rich message in JSON format to display in main slack window
	 * @test: Util_SlackNotifierTest.testBroadcastMessageToWorkspace()
	 */
	@future(callout = true)
	public static void sendMessageCallout(String plainMessage, String richMessage) {

		try{
			broadcastMessageToWorkspace(plainMessage, richMessage);

		}catch(Exception e){
			System.debug(e.getMessage());
		}

	}


}