import { LightningElement, track } from "lwc";
import { sendNotificationSlack } from "c/slackUtils";

export default class SlackSendNotificationExample extends LightningElement {
  priorityOptions = [
    { label: "High", value: "HIGH" },
    { label: "Medium", value: "MEDIUM" },
    { label: "Low", value: "LOW" }
  ];

  @track priority = "MEDIUM";

  typesOptions = [
    { label: "Error", value: "ERROR" },
    { label: "Warning", value: "WARNING" },
    { label: "Info", value: "INFO" }
  ];

  @track type = "WARNING";
  
  @track textMessage = "A message from Lightning...";

  sendNotification(){
      sendNotificationSlack(this.priority, this.type, this.textMessage);
  }
}
