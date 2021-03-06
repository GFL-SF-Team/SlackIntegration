/**
 * @File Name          : slackChannelsApp.js
 * @Description        : Basic containter for other components
 * @Author             : Pavel Riabov
 * @Last Modified By   : Pavel Riabov
 * @Last Modified On   : 27.02.2020, 18:09:18
 * Ver       Date            Author      		    Modification
 * 1.0    27.02.2020   Pavel Riabov     Initial Version
**/
import { LightningElement, track } from "lwc";
import getSlackChannels from "@salesforce/apex/L_SlackChannelsController.getSlackChannels";
import getWorkspaces from "@salesforce/apex/L_SlackChannelsController.getWorkspaces";
import {getSObjectsFromApex, handleErrors} from "c/utils";

import {
  CHANNELS_STATE,
  CHANNELS_MANAGER_STATE,
  WORKSPACES_STATE,
  WORKSPACE_STATE
} from "c/slackUtils";

export default class SlackChannelsApp extends LightningElement {
  @track state;

  @track channelsList;
  @track workspacesList;
  @track editingWorkspace;

  constructor() {
    super();

    // updates browser's history to be able to go back and forward
    this.state = CHANNELS_STATE;
    window.history.replaceState(CHANNELS_STATE, null, "");

    window.onpopstate = event => {
      
      if (event.state) {
        this.state = event.state;
      }
    };
  }

  connectedCallback() {
    this.retrieveChannels();
  }

  /**
   * @description: Retrieves channels and workspaces already existing in Custom Settings
   */
  async retrieveChannels() {
    try {
      let workspaces = await getSObjectsFromApex(this, getWorkspaces);
      let channels = await getSObjectsFromApex(this, getSlackChannels);
      let workspacesMap = {};

      for (let workspace of workspaces) {
        workspacesMap[workspace.Id] = workspace;
      }

      // set a name of every workspace to every channel
      channels = channels.map(channel => {
        return {
          ...channel,
          workspaceName: workspacesMap[channel.WorkspaceId__c].Name
        };
      });

      this.workspacesList = workspaces;
      this.channelsList = channels;

    } catch (error) {
      handleErrors(this, error);
    }
  }

  /**
   * @description: Handles an event from other component to update data and/or navigate to other component
   */
  handleNavigate(event) {

    // update data if event's update field is true
    if (event.detail.update) {
      this.retrieveChannels();
    }

    // set the workspace in case of editing workspace
    if (event.detail.workspace) {
      this.editingWorkspace = event.detail.workspace;
    }

    // navigate to other component if the event's state field exists
    if (event.detail.state) {
      this.state = event.detail.state;
      window.history.pushState(event.detail.state, null);
    }
  }

  get isChannels() {
    return this.state === CHANNELS_STATE;
  }

  get isWorkspaces() {
    return this.state === WORKSPACES_STATE;
  }

  get isChannelManager() {
    return this.state === CHANNELS_MANAGER_STATE;
  }

  get isWorkspace() {
    return this.state === WORKSPACE_STATE;
  }
}
