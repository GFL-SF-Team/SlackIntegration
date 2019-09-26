/*
 * Class: D_SlackMessage
 * Test Class: Util_SlackNotifierTest
 * @date: 15.08.19
 * @description: Data class for composing slack messages. Used by Util_SlackNotifier and L_SlackNotificationController
 */
public class D_SlackMessage {

	public enum EventType {
			ERROR, WARNING, INFO
	}

	public enum Priority {
			HIGH, MEDIUM, LOW
	}

	/*
	 * Class: Message
	 * Test Class: Util_SlackNotifierTest
	 * @date: 15.08.19
	 * @description: Parent class for ApexMessage and LightningMessage, describes general creation of message
	 */
	public abstract class Message{

		private EventType typeEvent = EventType.INFO;
		private Priority priorityLevel = Priority.LOW;
		// Date of the message creation
		private Datetime currentDate;

		// From Apex or Lightning the message has come
		protected String source;
		// A text to display after automatically generated message parts
		protected String notificationText;
		{
			currentDate = DateTime.newInstance(System.currentTimeMillis());
		}

		/*
		 * @date: 15.08.19
		 * @description: Creates common header for plain messages
		 */
		private String createPlainHeader() {

			String GMTDateTime = currentDate.format('dd.MM.yyyy HH:mm:ss', 'Europe/Helsinki');
			String slackMessage = '';
			String priorityText = 'Priority: *' + getPriorityIcon() + priorityLevel + '*';
			slackMessage += priorityText;
			slackMessage += GMTDateTime + '\n';
			slackMessage += this.getSourceIcon() + this.source + ' Message:\n';
			slackMessage += getEventTypeIcon() + ' ' + this.typeEvent + '\n';
			slackMessage += 'From user: ' + UserInfo.getName() + '\n';

			return slackMessage;
		}

		/*
		 * @date: 15.08.19
		 * @description: Creates common header for rich messages
		 */
		private List<Object> createRichHeader() {

			List<Object> blocks = new List<Object>();
			blocks.add(new RichDivider());

			String priorityText = 'Priority: *' + getPriorityIcon() + priorityLevel + '*';
			RichSectionSmall prioritySection = new RichSectionSmall();
			prioritySection.addElement(priorityText);
			blocks.add(prioritySection);

			RichSectionSmall eventDetails = new RichSectionSmall();
			Integer timestamp = Math.round(currentDate.getTime() / 1000);
			String GMTDate = currentDate.format('dd.MM.yyyy', 'Europe/Helsinki');
			String GMTTime = currentDate.format('HH:mm', 'Europe/Helsinki');
			String datetimeTag = '<!date^' + timestamp + '^{date_pretty} at {time}|' + GMTTime + ', ' + GMTDate + '>';
			eventDetails.addElement(datetimeTag);
			eventDetails.addElement('from *' + UserInfo.getName() + '*');
			Id orgId = UserInfo.getOrganizationId();
			Organization org = [SELECT Id, Name, OrganizationType, IsSandbox FROM Organization WHERE Id=:orgId LIMIT 1];
			eventDetails.addElement('Org name : *' + UserInfo.getOrganizationName() + '*');
			eventDetails.addElement('Org type: *' + org.OrganizationType + '*');
			eventDetails.addElement('Source: *' + getSourceIcon() + this.source + '*');

			blocks.add(eventDetails);

			RichSectionSmall typeEvent = new RichSectionSmall();
			typeEvent.addElement(getEventTypeIcon() + ' *' + this.typeEvent + '*');
			blocks.add(typeEvent);

			return blocks;
		}

		/*
		 * @date: 15.08.19
		 * @description: Creates plain message content
		 */
		protected abstract String createPlainBodyMessage();

		/*
		 * @date: 15.08.19
		 * @description: Creates rich message content
		 */
		protected abstract List<Object> createRichBodyMessage();

		/*
		 * @date: 15.08.19
		 * @description: Creates a plain message with header and body
		 */
		private String createPlainMessage() {

			String slackMessage = createPlainHeader();
			slackMessage += createPlainBodyMessage();

			return slackMessage;
		}

		/*
		 * @date: 15.08.19
		 * @description: Creates a rich message with header and body
		 */
		private String createRichMessage() {

			List<Object> wrapperList = createRichHeader();
			wrapperList.addAll(createRichBodyMessage());

			return JSON.serialize(wrapperList, true);
		}

		/*
		 * @date: 15.08.19
		 * @description: Creates message text and sends it to slack
		 */
		public void broadcast() {

			String plainMessage = this.createPlainMessage();
			String richMessage = this.createRichMessage();
			Util_SlackNotifier.sendMessageCallout(plainMessage, richMessage);
		}


		// getters and setters

		/*
		 * @date: 15.08.19
		 * @description: Returns an icon for current priority level
		 */
		private String getPriorityIcon() {

			switch on this.priorityLevel {
				when HIGH{
					return ':small_red_triangle:';
				}
				when MEDIUM{
					return ':small_orange_diamond:';
				}
				when LOW{
					return ':small_blue_diamond:';
				}
			}

			return '';
		}

		/*
		 * @date: 15.08.19
		 * @description: Returns an icon for current event type
		 */
		private String getEventTypeIcon() {

			switch on this.typeEvent {
				when ERROR{
					return ':red_circle:';
				}
				when WARNING{
					return ':warning:';
				}
				when INFO{
					return ':information_source:';
				}
			}

			return '';
		}

		/*
		 * @date: 16.08.19
		 * @description: Returns an icon for current source message type
		 */
		protected virtual String getSourceIcon() {

			return '';
		}

		/*
		 * @date: 15.08.19
		 * @description: Sets current event type from given string
		 * @param: typeEvent - String event type
		 */
		public void setTypeEvent(String typeEvent) {

			switch on typeEvent {
				when 'ERROR'{
					this.typeEvent = EventType.ERROR;
				}
				when 'WARNING'{
					this.typeEvent = EventType.WARNING;
				}
				when else{
					this.typeEvent = EventType.INFO;
				}
			}

		}

		/*
		 * @date: 15.08.19
		 * @description: Sets current priority level from given string
		 * @param: priorityLevel - String priority level
		 */
		public void setPriorityLevel(String priorityLevel) {

			switch on priorityLevel {
				when 'HIGH'{
					this.priorityLevel = Priority.HIGH;
				}
				when 'MEDIUM'{
					this.priorityLevel = Priority.MEDIUM;
				}
				when else{
					this.priorityLevel = Priority.LOW;
				}
			}

		}


		public void setTypeEvent(EventType typeEvent) {

			this.typeEvent = typeEvent;
		}


		public void setPriorityLevel(Priority priorityLevel) {

			this.priorityLevel = priorityLevel;
		}


		public void setNotificationText(String notificationText) {

			this.notificationText = notificationText;
		}
	}

	/*
	 * Class: ApexMessage
	 * Test Class: Util_SlackNotifierTest
	 * @date: 15.08.19
	 * @description: Defines a message from Apex (back-end)
	 */
	public class ApexMessage extends Message{

		private String className;
		private String methodName;
		private Integer lineNumber;
		private Exception thrownException;


		public ApexMessage() {
			this.source = 'Apex';
		}

		/*
		 * @date: 15.08.19
		 * @description: Creates an Apex plain message body
		 */
		protected override String createPlainBodyMessage() {

			String slackMessage = '';

			if (thrownException != null) {
				slackMessage += '*An exception was thrown:*' + '\n';
				retrieveExceptionInfo();
			} else {
				slackMessage += '*A message from code:*' + '\n';
			}

			if (className != null) {
				slackMessage += 'Class: `' + className + '`\n';
			}

			if (methodName != null) {
				slackMessage += 'Method: `' + methodName + '`\n';
			}

			if (lineNumber != null) {
				slackMessage += 'Error Line: `' + lineNumber + '`\n';
			}

			if (thrownException != null) {
				slackMessage += 'Exception Type: `' + thrownException.getTypeName() + '`\n';
				slackMessage += 'Error message: `' + thrownException.getMessage() + '`\n';
			}

			if ((notificationText != null) && (!notificationText.equals(''))) {
				slackMessage += ' ' + notificationText + ' \n';
			}

			return slackMessage;
		}

		/*
		 * @date: 15.08.19
		 * @description: Creates an Apex rich message body
		 */
		protected override List<Object> createRichBodyMessage() {

			List<Object> sectionsArray = new List<Object>();
			sectionsArray.add(new RichSection(createPlainBodyMessage()));

			return sectionsArray;
		}

		/*
		 * @date: 16.08.19
		 * @description: Returns an icon for current source message type
		 */
		protected override String getSourceIcon() {

			return ':computer:';
		}

		/*
		 * @date: 15.08.19
		 * @description: Parses a stackTrace from thrownException field and retrieves the info into some fields
		 */
		private void retrieveExceptionInfo() {

			String stackTrace = thrownException.getStackTraceString();

			if (stackTrace.startsWith('Class.')) {
				this.className = stackTrace.substringAfter('Class.');
				this.className = className.substringBefore(':').substringBeforeLast('.');
				this.methodName = stackTrace.substringBefore(':').substringAfterLast('.') ;
				this.lineNumber = thrownException.getLineNumber();
			}
		}


		//setters

		public void setClassName(String className) {

			this.className = className;
		}


		public void setMethodName(String methodName) {

			this.methodName = methodName;
		}


		public void setLineNumber(Integer lineNumber) {

			this.lineNumber = lineNumber;
		}


		public void setThrownException(Exception thrownException) {

			this.thrownException = thrownException;
		}

	}

	/*
	 * Class: LightningMessage
	 * Test Class: Util_SlackNotifierTest
	 * @date: 15.08.19
	 * @description: Defines a message from Lightning (front-end)
	 */
	public class LightningMessage extends Message{

		public LightningMessage() {
			this.source = 'Lightning';
		}

		/*
		 * @date: 15.08.19
		 * @description: Creates Lightning plain message body
		 */
		protected override String createPlainBodyMessage() {

			String slackMessage = '';

			if ((notificationText != null) && (!notificationText.equals(''))) {
				slackMessage += ' ' + notificationText + ' \n';
			}

			return slackMessage;
		}

		/*
		 * @date: 15.08.19
		 * @description: Creates Lightning rich message body
		 */
		protected override List<Object> createRichBodyMessage() {

			List<Object> sectionsArray = new List<Object>();
			sectionsArray.add(new RichSection(this.notificationText));

			return sectionsArray;
		}

		/*
		 * @date: 16.09.19
		 * @description: Returns an icon for current source message type
		 */
		protected override String getSourceIcon() {

			return ':lightning:';
		}
	}

	// Helper data classes for making JSON rich message data structure

	/*
	 * Class: RichSection
	 * @date: 15.08.19
	 * @description: A base slack message section
	 */
	private class RichSection{

		public String type = 'section';
		public Object text;


		public RichSection(String textString) {
			this.text = new Map<String, String>{
			'type'=>'mrkdwn', 'text' => textString
			};
		}
	}


	/*
	 * Class: RichSectionSmall
	 * @description: A slack message section named 'context' with small grey font
	 */
	private class RichSectionSmall{

		public String type = 'context';
		public List<Object> elements;


		public RichSectionSmall() {
			this.elements = new List<Object>();
		}


		/*
		 * @description: Adds a text element to the section
		 * @param: textString - a text to add
		 */
		public void addElement(String textString) {

			this.elements.add(new Map<String, String>{
			'type'=>'mrkdwn', 'text' => textString
			});
		}
	}


	/*
	 * Class: RichDivider
	 * @description: A simple horizontal line
	 */
	private class RichDivider{

		String type = 'divider';

	}

}