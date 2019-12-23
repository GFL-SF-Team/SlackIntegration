import { LightningElement, track, wire, api } from "lwc";
import getSlackChannels from "@salesforce/apex/L_SlackChannelsController.getSlackChannels";
import getWorkspaces from "@salesforce/apex/L_SlackChannelsController.getWorkspaces";
import {CHANNELS_STATE, CHANNELS_MANAGER_STATE, WORKSPACES_STATE, WORKSPACE_STATE} from "c/slackUtils";

export default class SlackChannelsApp extends LightningElement {
  @track state;

  @track channelsList;
  @track workspacesList;
  @track editingWorkspace;

  constructor() {
    super();
    this.state = "channels";
    window.history.replaceState("channels", null, "");
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
      let workspaces = await getWorkspaces();
      let channels = await getSlackChannels();

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
  }

  handleNavigate(event) {
    if (event.detail.update){
      this.retrieveChannels();
    }
    if (event.detail.state){
      this.state = event.detail.state;
    }
  }

  handleChangeList(event) {
    this.retrieveChannels();
    this.state = "channels";
  }

  handleChangeWorkspace(event) {
    this.retrieveChannels();
    this.state = "workspaces";
  }

  handleEditWorkspace(event) {
    this.editingWorkspace = event.detail.workspace;
    this.state = event.detail.state;
  }

  handleUpdateData(event){
    this.retrieveChannels();
  }

  get isChannels() {
    return this.state === CHANNELS_STATE;
  }

  get isWorkspaces() {
    return this.state === WORKSPACES_STATE
  }

  get isChannelManager() {
    return this.state === CHANNELS_MANAGER_STATE
  }

  get isWorkspace() {
    return this.state === WORKSPACE_STATE;
  }
}
