/*
 * Class: Util_SlackNotifierMock
 * @date: 16.08.19
 * @description: Class for making fake HTTP Callout for testing
 */
@IsTest
global class Util_SlackNotifierMock implements HttpCalloutMock{

	public System.HttpResponse respond(System.HttpRequest request) {

		HttpResponse response = new HttpResponse();
		response.setHeader('Content-Type', 'application/json');
		String body = '';
		String endpoint = request.getEndpoint();

		if (endpoint == 'https://slack.com/api/conversations.list') {
			body = '{"ok":true,"channels":[' +
					'{"id":"CLK7XH57T","name":"notifications","is_channel":true,"is_group":false,"is_im":false,' +
					'"created":1564047466,"is_archived":false,"is_general":false,"unlinked":0,' +
					'"name_normalized":"notifications","is_shared":false,"parent_conversation":null,"creator":"ULTDQ0QUX",' +
					'"is_ext_shared":false,"is_org_shared":false,"shared_team_ids":["TLR44R0MA"],"pending_shared":[],' +
					'"pending_connected_team_ids":[],"is_pending_ext_shared":false,"is_member":true,"is_private":false,' +
					'"is_mpim":false,"topic":{"value":"","creator":"","last_set":0},"purpose":{"value":"","creator":"",' +
					'"last_set":0},"previous_names":[],"num_members":2}],"response_metadata":{"next_cursor":""}}';

		} else if (endpoint == 'https://slack.com/api/users.list') {
			body = '{"ok":true,"members":[' +
					'{"id":"USLACKBOT","team_id":"TLR44R0MA","name":"slackbot","deleted":false,"color":"757575","real_name":"Slackbot",' +
					'"tz":null,"tz_label":"Pacific Daylight Time","tz_offset":-25200,"profile":{"title":"",' +
					'"phone":"","skype":"","real_name":"Slackbot","real_name_normalized":"Slackbot","display_name":"Slackbot",' +
					'"display_name_normalized":"Slackbot","fields":null,"status_text":"","status_emoji":"","status_expiration":0,' +
					'"avatar_hash":"sv41d8cd98f0","always_active":true,"first_name":"slackbot","last_name":"","status_text_canonical":"",' +
					'"team":"TLR44R0MA"},"is_admin":false,"is_owner":false,"is_primary_owner":false,"is_restricted":false,' +
					'"is_ultra_restricted":false,"is_bot":false,"is_app_user":false,"updated":0},' +
					'{"id":"ULTDQ0QUX","team_id":"TLR44R0MA","name":"paulriabov","deleted":false,' +
					'"color":"9f69e7","real_name":"Paul R","tz":"Asia/Jerusalem","tz_label":"Israel Daylight Time",' +
					'"tz_offset":10800,"profile":{"title":"","phone":"","skype":"","real_name":"Paul R",' +
					'"real_name_normalized":"Paul R","display_name":"","display_name_normalized":"","status_text":"",' +
					'"status_emoji":"","status_expiration":0,"avatar_hash":"g4d9d5a9e829","email":"paulriabov@gmail.com",' +
					'"first_name":"Paul","last_name":"R","status_text_canonical":"","team":"TLR44R0MA"},' +
					'"is_admin":true,"is_owner":true,"is_primary_owner":true,"is_restricted":false,' +
					'"is_ultra_restricted":false,"is_bot":false,"is_app_user":false,"updated":1564063520,"has_2fa":false}],' +
					'"cache_ts":1565355166,"response_metadata":{"next_cursor":""}}';

		} else if (endpoint == 'https://slack.com/api/chat.postMessage') {
			body = '{"ok":true,"channel":"CLK7XH57T","ts":"1565355527.000200",' +
					'"message":{"type":"message","subtype":"bot_message","text":"My test message","ts":"1565355527.000200",' +
					'"username":"Test User","bot_id":"BLR4D1S0L"}}';
		}else{
			body = '{result : success}';
		}

		response.setBody(body);
		response.setStatusCode(200);
		return response;
	}

}