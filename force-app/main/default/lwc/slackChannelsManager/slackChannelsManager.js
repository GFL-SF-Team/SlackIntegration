/**
 * @File Name          : slackChannelsManager.js
 * @Description        : Changes a list of channels to which a message will be sent
 * @Author             : Pavel Riabov
 * @Last Modified By   : Pavel Riabov
 * @Last Modified On   : 27.02.2020, 18:17:16
 * Ver       Date            Author      		    Modification
 * 1.0    27.02.2020   Pavel Riabov     Initial Version
**/
import { LightningElement, api, track } from "lwc";
import getExistingSlackChannels from "@salesforce/apex/L_SlackChannelsController.getExistingSlackChannels";
import saveChannelsFromWorkspace from "@salesforce/apex/L_SlackChannelsController.saveChannelsFromWorkspace";
import { navigateToChannels } from "c/slackUtils";
import { getSObjectsFromApex, handleResponse, handleErrors } from "c/utils";

export default class SlackChannelsManager extends LightningElement {
  @api workspacesList;
  @api channelsList;

  @track channelsFromSlack = [];
  @track channelsSelectedIds = [];
  @track selectedWorkspaceValue;

  connectedCallback() {

    // set label and value for correct rendering
    this.workspacesList = this.workspacesList.map(workspace => {
      return { label: workspace.Name, value: workspace.slackMsg2__Token__c, ...workspace };
    });

    // select the first workspace and load its channels
    let selectedWorkspace = this.workspacesList[0];

    if (!this.selectedWorkspaceValue) {
      this.selectedWorkspaceValue = selectedWorkspace.slackMsg2__Token__c;
    }
    this.getWorkspaceChannels(selectedWorkspace);
  }

  /**
   * @description: Gets all channels from Slack and select those which are set in Custom Settings
   */
  async getWorkspaceChannels(selectedWorkspace) {

    try {
      let workspaceToken = selectedWorkspace.slackMsg2__Token__c;
      this.channelsSelectedIds = [];
      this.channelsFromSlack = [];
      // get all existing channels from Slack workspace
      this.channelsFromSlack = await getSObjectsFromApex(this, getExistingSlackChannels,{workspaceToken});

      let workspaceId = selectedWorkspace.Id;

      // add some fields for every channel for correct rendering
      this.channelsFromSlack = this.channelsFromSlack.map(channel => {

        return {
          label: channel.slackMsg2__NameChannel__c,
          value: channel.slackMsg2__IdChannel__c,
          slackMsg2__WorkspaceId__c: workspaceId,
          workspaceName: selectedWorkspace.Name,
          ...channel
        };

      });

      let workspaceChannelsIds = this.channelsList
        .filter(channel => channel.slackMsg2__WorkspaceId__c == workspaceId)
        .map(channel => channel.slackMsg2__IdChannel__c);

      let selectedChannels = this.channelsFromSlack.filter(channel =>
        workspaceChannelsIds.includes(channel.slackMsg2__IdChannel__c)
      );

      // set selected channels that are already exist in Custom Settigs
      this.channelsSelectedIds = selectedChannels.map(
        channel => channel.slackMsg2__IdChannel__c
      );

    } catch (error) {
      handleErrors(this, error);
    }
  }

  /**
   * @description: Moves back to slackChannels component without saving
   */
  cancel() {
    navigateToChannels(this, false);
  }

  /**
   * @description: Saves selected channels and returns to slackChannels component
   */
  async save() {

    let selectedWorkspace = this.workspacesList.filter(
      workspace => workspace.slackMsg2__Token__c === this.selectedWorkspaceValue
    )[0];

    let selectedChannels = this.channelsFromSlack.filter(channel =>
      this.channelsSelectedIds.includes(channel.slackMsg2__IdChannel__c)
    );

    let workspaceId = selectedWorkspace.Id;

    selectedChannels = JSON.stringify(selectedChannels);
    try {
      let response = await saveChannelsFromWorkspace({ selectedChannels, workspaceId });

      handleResponse(this, response);
      navigateToChannels(this, true);

    } catch (error) {
      handleErrors(this, error);
    }
  }

  /**
   * @description: Sets Ids of selected channels to component's variable
   */
  handleListboxChange(event) {
    this.channelsSelectedIds = event.detail.value;
  }

  /**
   * @description: Updates channels list from selected workspace
   */
  updateChannels(event) {
    this.selectedWorkspaceValue = event.detail.value;

    let selectedWorkspace = this.workspacesList.filter(
      workspace => workspace.slackMsg2__Token__c === event.detail.value
    )[0];
    
    this.getWorkspaceChannels(selectedWorkspace);
  }
}
