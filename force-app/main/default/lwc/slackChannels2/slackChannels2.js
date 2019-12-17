import { LightningElement, wire, track, api } from "lwc";
import deleteChannel from "@salesforce/apex/L_SlackChannelsController.deleteChannel";

export default class SlackChannels2 extends LightningElement {
  columns = [
    { label: "Channel name", fieldName: "Name", type: "text" },
    { label: "Channel Id", fieldName: "IdChannel__c", type: "text" },
    { label: "Workspace Name", fieldName: "workspaceName", type: "text" },
    {
      type: "action",
      typeAttributes: { rowActions: [{ label: "Delete", name: "delete" }] }
    }
  ];

  @api channelsList;
  @api workspacesList;

  newChannelFromWorkspace() {
    const navigateEvent = new CustomEvent("navigate", {
      detail: { state: "channelManager" }
    });
    this.dispatchEvent(navigateEvent);
  }

  manageWorkspaces() {
    const navigateEvent = new CustomEvent("navigate", {
      detail: { state: "workspaces" }
    });
    this.dispatchEvent(navigateEvent);
  }

  handleRowAction(event) {
    let action = event.detail.action;
    let slackChannel = event.detail.row;

    switch (action.name) {
      case "delete":
        this.deleteRecord(slackChannel);
        // helper.deleteRecord(cmp, slackChannel);
        break;
    }
  }

  async deleteRecord(channel) {
    console.log(JSON.stringify(channel));
    try {
      await deleteChannel({channel:{Id:channel.Id}});
    } catch (error) {
      console.log("error:", error);
    }
  }
}
