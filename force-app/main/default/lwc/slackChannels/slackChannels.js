import { LightningElement, wire, track, api } from "lwc";
import deleteChannel from "@salesforce/apex/L_SlackChannelsController.deleteChannel";
import { navigateToChannelsManager, navigateToWorkspaces } from "c/slackUtils";

export default class SlackChannels extends LightningElement {
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

  manageChannels() {
    // const navigateEvent = new CustomEvent("navigate", {
    //   detail: { state: "channelManager" }
    // });
    // this.dispatchEvent(navigateEvent);
    navigateToChannelsManager(this);
  }

  manageWorkspaces() {
    // const navigateEvent = new CustomEvent("navigate", {
    //   detail: { state: "workspaces" }
    // });
    // this.dispatchEvent(navigateEvent);
    navigateToWorkspaces(this);
  }

  handleRowAction(event) {
    let action = event.detail.action;
    let slackChannel = event.detail.row;

    switch (action.name) {
      case "delete":
        this.deleteRecord(slackChannel);
        break;
    }
  }

  updateData() {
    const navigateEvent = new CustomEvent("updatedata", {});
    this.dispatchEvent(navigateEvent);
  }

  async deleteRecord(channel) {
    try {
      await deleteChannel({channel:{Id:channel.Id}});
      this.updateData();
      
    } catch (error) {
      console.log("error:", error);
    }
  }
}
