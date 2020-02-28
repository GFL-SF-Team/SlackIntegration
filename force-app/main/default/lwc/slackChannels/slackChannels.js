/**
 * @File Name          : slackChannels.js
 * @Description        : A list of slack channels to send messages
 * @Author             : Pavel Riabov
 * @Last Modified By   : Pavel Riabov
 * @Last Modified On   : 27.02.2020, 18:00:17
 * Ver       Date            Author      		    Modification
 * 1.0    27.02.2020   Pavel Riabov     Initial Version
**/
import { LightningElement, api } from "lwc";
import deleteChannel from "@salesforce/apex/L_SlackChannelsController.deleteChannel";
import {
  navigateToChannelsManager,
  navigateToWorkspaces,
  updateData
} from "c/slackUtils";
import {
  showNotifyWithError,
  handleResponse,
  handleErrors
} from "c/utils";

export default class SlackChannels extends LightningElement {
  // information for creating the table
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

  /**
   * @description: Navigates to the slackChannelsManager component
   */
  manageChannels() {
    // if any workspace exists
    if (this.workspacesList.length > 0) {
      navigateToChannelsManager(this);

    } else {
      showNotifyWithError(this, "Add a workspace first!");
    }
  }

  /**
   * @description: Navigates to the slackWorkspacesList component
   */
  manageWorkspaces() {
    navigateToWorkspaces(this);
  }

  /**
   * @description: Handles an action with slack channel
   */
  handleRowAction(event) {
    let action = event.detail.action;
    let slackChannel = event.detail.row;

    switch (action.name) {

      case "delete":
        this.deleteRecord(slackChannel);
        break;
    }
  }

  /**
   * @description: Deletes a channel
   */
  async deleteRecord(channel) {

    try {
      let response = await deleteChannel({ channel });
      await handleResponse(this, response);

      // remove selected channel from the table
      this.channelsList = this.channelsList.filter(
        channelEl => channelEl.Id !== channel.Id
      );

      updateData(this);
      
    } catch (error) {
      handleErrors(this, error);
    }
  }

  get isEmptyChannelsList() {
    return this.channelsList && this.channelsList.length == 0;
  }
}
