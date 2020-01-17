# SlackIntegration package

This package allows to send messages from Salesforce to Slack.

Contents:

* [Configuring Slack Integration](#configuring-slack-integration)
	* [In Slack](#in-slack)
	* [In Salesforce](#in-salesforce)
* [Using Slack Integration](#using-slack-integration)
	* [In Lightning](#in-lightning)
	* [In Apex](#in-apex)	
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
	sfdx force:package:install -u DevHub --wait 10 --package SlackIntegration@0.4.0-1 -k test1234 --noprompt
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

#### LWC

- import `sendNotificationSlack` method, `slackNotificationPriorities` and `slackNotificationTypes` objects from `slackUtils` component:

```javascript
	import { sendNotificationSlack, slackNotificationPriorities, slackNotificationTypes } from "c/slackUtils";
```

- get priority and type values from `slackNotificationPriorities` and `slackNotificationTypes` objects. Set a notification message:

```javascript
	let priority = slackNotificationPriorities.MEDIUM;
	let type = slackNotificationTypes.WARNING;
	let textMessage = 'Some message to Slack';
```

- invoke `sendNotificationSlack` method with given parameters:

```javascript
	sendNotificationSlack(priority, type, textMessage);
```

#### Aura

- Place `c:slackUtils` component somewhere in your component.

```html
	<c:slackUtils aura:id="slackUtils"/>
```

- get priority and type values from `slackNotificationPriorities` and `slackNotificationTypes` objects. Set a notification message:

```javascript
	let utils= cmp.find('slackUtils');
	let priority = utils.slackNotificationPriorities.MEDIUM;
	let type = utils.slackNotificationTypes.WARNING;
	let textMessage = 'Some message to Slack';
```

- Use `sendNotificationSlack` method of this component.

```javascript
	utils.sendNotificationSlack(priority, type, textMessage);
```


### In Apex

Create an instance of `D_SlackMessage.ApexMessage` class, set type event, priority and exception. 
Then call `broadcast()` method:

```java

	D_SlackMessage.ApexMessage message = new D_SlackMessage.ApexMessage();
	message.setTypeEvent(D_SlackMessage.EventType.INFO);
	message.setPriorityLevel(D_SlackMessage.Priority.MEDIUM);
	message.setThrownException(e);
	message.broadcast();
```

You can also provide an additional text of the message (`notificationText`).
Setting event type and priority can be omitted with the default values (EventType = INFO, Priority = LOW).
Also you may omit an exception and set manually the class, method name and line number:

```java
	D_SlackMessage.ApexMessage message = new D_SlackMessage.ApexMessage();
	message.setClassName('MyClass');
	message.setMethodName('myMethod');
	message.setLineNumber(62);
	message.setNotificationText('Some notification...');
	message.broadcast();
```