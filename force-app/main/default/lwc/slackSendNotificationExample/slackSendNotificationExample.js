import { LightningElement, track } from "lwc";
import { sendNotificationSlack } from "c/slackUtils";
import {PRIORITY_HIGH, PRIORITY_MEDIUM, PRIORITY_LOW} from "c/slackUtils";
import {TYPE_ERROR, TYPE_WARNING, TYPE_INFO} from "c/slackUtils";

export default class SlackSendNotificationExample extends LightningElement {
  
  priorityOptions = [
    { label: "High", value: PRIORITY_HIGH },
    { label: "Medium", value: PRIORITY_MEDIUM },
    { label: "Low", value: PRIORITY_LOW }
  ];

  @track priority = PRIORITY_MEDIUM;

  typesOptions = [
    { label: "Error", value: TYPE_ERROR },
    { label: "Warning", value: TYPE_WARNING },
    { label: "Info", value: TYPE_INFO }
  ];

  @track type = TYPE_WARNING;
  
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

  sendNotification(){
      sendNotificationSlack(this.priority, this.type, this.textMessage);
  }
  
}
