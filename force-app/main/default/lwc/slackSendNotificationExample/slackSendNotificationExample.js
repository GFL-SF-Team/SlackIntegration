/**
 * @File Name          : slackSendNotificationExample.js
 * @Description        : Allows to send a test message to slack
 * @Author             : Pavel Riabov
 * @Last Modified By   : Pavel Riabov
 * @Last Modified On   : 28.02.2020, 12:39:59
 * Ver       Date            Author      		    Modification
 * 1.0    28.02.2020   Pavel Riabov     Initial Version
**/
import { LightningElement, track } from "lwc";
import {slackNotificationPriorities, slackNotificationTypes, sendNotificationSlack} from "c/slackUtils";

export default class SlackSendNotificationExample extends LightningElement {
  
  priorityOptions = [
    { label: "High", value: slackNotificationPriorities.HIGH },
    { label: "Medium", value: slackNotificationPriorities.MEDIUM },
    { label: "Low", value: slackNotificationPriorities.LOW }
  ];

  @track priority = slackNotificationPriorities.MEDIUM;

  typesOptions = [
    { label: "Error", value: slackNotificationTypes.ERROR },
    { label: "Warning", value: slackNotificationTypes.WARNING },
    { label: "Info", value: slackNotificationTypes.INFO }
  ];

  @track type = slackNotificationTypes.WARNING;
  
  @track textMessage = "A message from Lightning...";

  handleChangePriority(event){
    this.priority = event.target.value;
  }

  handleChangeType(event){
    this.type = event.target.value;
  }

  handleChangeMessage(event){
    this.textMessage = event.target.value;
  }

  /**
   * @description: Performs sending a message to Slack with priority, type and text of the message
   */
  sendNotification(){
      sendNotificationSlack(this.priority, this.type, this.textMessage);
  }
  
}
