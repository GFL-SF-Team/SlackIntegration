# SlackIntegration package

This package allows to send messages from Salesforce to Slack.

Contents:

* [Configuring Slack Integration](https://bitbucket.org/paulr-gflwork/slack-notification-sfdx/overview#markdown-header-configuring-slack-integration)
	* [In Slack](https://bitbucket.org/paulr-gflwork/slack-notification-sfdx/overview#markdown-header-in-slack)
	* [In Salesforce](https://bitbucket.org/paulr-gflwork/slack-notification-sfdx/overview#markdown-header-in-salesforce)
* [Using Slack Integration](https://bitbucket.org/paulr-gflwork/slack-notification-sfdx/overview#markdown-header-using-slack-integration)
	* [In Lightning](https://bitbucket.org/paulr-gflwork/slack-notification-sfdx/overview#markdown-header-in-lightning)
	* [In Apex](https://bitbucket.org/paulr-gflwork/slack-notification-sfdx/overview#markdown-header-in-apex)
	
--------

## Configuring Slack Integration

### In Slack

Go to https://api.slack.com -> Your apps

1. Create a new slack application for current workspace
	Press *Create New App*
	Choose your workspace
	
2. Add permissions for the application
	Features -> QAuth & Permissions -> Scopes
	- admin
	- channels:read
	- channels:write
	- chat:write:bot
	- chat:write:user
	- incoming:webhook
	- users:read
		
3. Get workspace token
	Features -> QAuth & Permissions  -> Install App to Workspace
	Select channel/user -> Allow
	Copy *QAuth Access Token*

### In Salesforce

4. Install the latest version of *SlackIntegration* package
	
	```
	sfdx force:package:install -u MyTP --wait 10 --package SlackIntegration@0.4.0-1 -k test1234 --noprompt
	```
	
	
5. Add your workspace to Salesforce
	Go to Slack Channels Tab -> Manage workspaces -> Add Workspace
	Enter any name for the workspace and paste the *QAuth Access Token*

6. Add channels if needing
	Go back to *Slack channels*
	Press *Add channel*
	Select channels, add them to selected list and press *Save*

	If channels for current workspace weren't added, a message will be sent to each user in workspace from Slackbot.

------------

## Using Slack Integration

### In Lightning

- Place c:SlackNotification component somewhere in your app.

```html
		<c:SlackNotification/>
```

- Include a static resource CommonUtils.js in your component:

```html
		<ltng:require scripts="{!$Resource.CommonUtils}"/>
```

- Send an event using utility function:

```javascript
		$CommonUtils.sendSlackNotification(priority, type, textMessage);
```


### In Apex

Create an instance of `D_SlackMessage.ApexMessage` class, set type event, priority and exception. Then call `broadcast()` method:

```java

	D_SlackMessage.ApexMessage message = new D_SlackMessage.ApexMessage();
	message.setTypeEvent(D_SlackMessage.EventType.INFO);
	message.setPriorityLevel(D_SlackMessage.Priority.MEDIUM);
	message.setThrownException(e);
	message.broadcast();
```
