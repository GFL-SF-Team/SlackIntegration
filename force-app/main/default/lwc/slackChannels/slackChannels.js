import { LightningElement, wire, track, api } from "lwc";
import deleteChannel from "@salesforce/apex/L_SlackChannelsController.deleteChannel";
import { navigateToChannelsManager, navigateToWorkspaces, updateData } from "c/slackUtils";

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
    navigateToChannelsManager(this);
  }

  manageWorkspaces() {
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

  async deleteRecord(channel) {
    try {
      await deleteChannel({channel:{Id:channel.Id}});
      updateData(this);
      
    } catch (error) {
      console.log("error:", error);
    }
  }
}
