import { LightningElement, api } from "lwc";
import deleteChannel from "@salesforce/apex/L_SlackChannelsController.deleteChannel";
import {
  navigateToChannelsManager,
  navigateToWorkspaces,
  updateData
} from "c/slackUtils";
import {
  handleErrorInResponse,
  showNotifyWithError,
  handleErrorInResponseFromApex
} from "c/utils";

export default class SlackChannels extends LightningElement {
  columns = [
    { label: "Channel name", fieldName: "NameChannel__c", type: "text" },
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
    if (this.workspacesList.length > 0) {
      navigateToChannelsManager(this);
    } else {
      showNotifyWithError(this, "Add a workspace first!");
    }
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
      let response = await deleteChannel({ channel });
      if (response.success) {
        this.channelsList = this.channelsList.filter(
          channelEl => channelEl.Id !== channel.Id
        );
        updateData(this);
      } else if (!response.success && response.code === 1001) {
        showNotifyWithError(this, response.message);
      } else {
        handleErrorInResponseFromApex(this, response);
      }
    } catch (error) {
      handleErrorInResponse(this, error);
    }
  }

  get isEmptyChannelsList() {
    return this.channelsList && this.channelsList.length == 0;
  }
}
