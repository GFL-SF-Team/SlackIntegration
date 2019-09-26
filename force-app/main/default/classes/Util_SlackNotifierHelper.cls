/*
 * Class: Util_SlackNotifierHelper
 * Test Class: Util_SlackNotifierTest
 * @date: 15.08.19
 * @description: Helper for Util_SlackNotifier class
 */
public class Util_SlackNotifierHelper {

	/*
	 * @date: 15.08.2019
	 * @description: Sends a message to a slack channel
	 * @param: token - Security token from existing slack workspace
	 * @param: channelId - String Id of the slack channel
	 * @param: plainMessage - Simple text to display in pop-up notifications
	 * @param: richMessage - Structured rich message in JSON format to display in main slack window
	 * @test: Util_SlackNotifierTest.testBroadcastMessageToWorkspace()
	 */
	public static void sendMessageToChannel(String token, String channelId, String plainMessage, String richMessage) {

		String username = 'Salesforce Notificator';
		String emoji = ':bell:';
		String url = 'https://slack.com/api/chat.postMessage';

		Map<String, String> paramsMap = new Map<String, String>();
		paramsMap.put('token', token);
		paramsMap.put('channel', channelId);
		paramsMap.put('blocks', richMessage);
		paramsMap.put('text', plainMessage);
		paramsMap.put('username', username);
		paramsMap.put('icon_emoji', emoji);
		paramsMap.put('mrkdwn', 'true');
		paramsMap.put('as_user', 'false');
		makeHttpRequest(url, paramsMap);
	}

	/*
	 * @date: 15.08.2019
	 * @description: Finds all slack channels in current slack workspace
	 * @param: token - Security token from existing slack workspace
	 * @test: Util_SlackNotifierTest.testBroadcastMessageToWorkspace()
	 */
	public static SlackChannel__c[] getWorkspaceChannelsFromSlack(String token) {

		String url = 'https://slack.com/api/conversations.list';
		Map<String, String> paramsMap = new Map<String, String>();
		paramsMap.put('token', token);
		Workspace workspaceParsed;

		try {
			String resultJSON = makeHttpRequest(url, paramsMap);
			workspaceParsed = (Workspace)JSON.deserialize(resultJSON, Workspace.class);
		} catch (Exception e) {
			System.debug(e.getMessage());
		}

		SlackChannel__c[] channels = new SlackChannel__c[]{};

		for (SlackChannel channel : workspaceParsed.channels) {
			channels.add(new SlackChannel__c(Name = channel.name, IdChannel__c = channel.id));
		}

		return channels;
	}

	/*
	 * @date: 04.09.19
	 * @description: Returns common channels from two lists by matching IdChannel__c
	 * @param: channelsFromSlack - list of channels from existing Slack workspace
	 * @param: channelsFromSlack - list of channels from Custom Settings
	 * @test: Util_SlackNotifierTest.test()
	 */
	public static SlackChannel__c[] getIntersectionChannels(SlackChannel__c[] channelsFromSlack,
															SlackChannel__c[] channelsFromSettings) {

		SlackChannel__c[] resultList = new SlackChannel__c[]{};
		Map<String, SlackChannel__c> channelsFromSettingsMap = new Map<String, SlackChannel__c>();

		for (SlackChannel__c channelSettings : channelsFromSettings) {
			channelsFromSettingsMap.put(channelSettings.IdChannel__c, channelSettings);
		}

		for (SlackChannel__c channelSlack : channelsFromSlack) {

			if (channelsFromSettingsMap.containsKey(channelSlack.IdChannel__c)) {
				resultList.add(channelSlack);
			}
		}

		return resultList;
	}

	/*
	 * @date: 15.08.2019
	 * @description: Finds all slack users in current slack workspace
	 * @param: token - Security token from existing slack workspace
	 * @test: Util_SlackNotifierTest.testBroadcastMessageToWorkspaceUsers()
	 */
	public static SlackChannel__c[] getUserListFromSlack(String token) {

		String url = 'https://slack.com/api/users.list';
		Map<String, String> paramsMap = new Map<String, String>();
		paramsMap.put('token', token);
		SlackChannel[] channelsParsed;

		try {
			String resultJSON = makeHttpRequest(url, paramsMap);
			Map<String, Object> parsedMap = (Map<String, Object>)JSON.deserializeUntyped(resultJSON);
			String channelsJSON = JSON.serialize((List<Object>)parsedMap.get('members'));
			channelsParsed = (SlackChannel[])JSON.deserialize(channelsJSON, List<SlackChannel>.class);
		} catch (Exception e) {
			System.debug(e.getMessage());
		}

		SlackChannel__c[] channels = new SlackChannel__c[]{};

		for (SlackChannel channel : channelsParsed) {
			channels.add(new SlackChannel__c(Name = channel.name, IdChannel__c = channel.id));
		}

		return channels;
	}

	/*
	 * @date: 15.08.2019
	 * @description: Makes a HTTP POST request to given url with the parameters
	 * @param: endpointUrl - A url of the request
	 * @param: bodyParams - A map of parameters to be sent in request body
	 * @test: Util_SlackNotifierTest.testBroadcastMessageToWorkspace()
	 */
	public static String makeHttpRequest(String endpointUrl, Map<String, String> bodyParams) {

		HttpRequest request = new HttpRequest();
		request.setMethod('POST');
		request.setEndpoint(endpointUrl);
		request.setHeader('Content-Type', 'application/x-www-form-urlencoded');
		String paramsString = '';

		for (String paramName : bodyParams.keySet()) {
			String paramValue = bodyParams.get(paramName);
			paramsString += '&' + paramName + '=' + paramValue;
		}

		paramsString = paramsString.replaceFirst('&', '');
		request.setBody(paramsString);

		Http http = new Http();
		HTTPResponse response = http.send(request);
		String resultJSON;

		if (response.getStatusCode() == 200) {
			resultJSON = response.getBody();
		}

		return resultJSON;
	}


	/*
	 * Class: Workspace
	 * @date: 15.08.19
	 * @description: Data class for parsing slack workspace information from HTTP request
	 */
	private class Workspace{

		public String token;
		public SlackChannel[] channels;
	}

	/*
	 * Class: SlackChannel
	 * @date: 15.08.19
	 * @description: Data class for parsing slack channels information from HTTP request
	 */
	private class SlackChannel{

		public String id;
		public String name;
	}


}