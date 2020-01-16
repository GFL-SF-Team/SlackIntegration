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

  async retrieveChannels() {
    try {
      let workspaces = await getSObjectsFromApex(this, getWorkspaces);
      let channels = await getSObjectsFromApex(this, getSlackChannels);
      let workspacesMap = {};

      for (let workspace of workspaces) {
        workspacesMap[workspace.Id] = workspace;
      }

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

  handleNavigate(event) {

    if (event.detail.update) {
      this.retrieveChannels();
    }

    if (event.detail.workspace) {
      this.editingWorkspace = event.detail.workspace;
    }

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
