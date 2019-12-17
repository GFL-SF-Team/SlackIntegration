import { LightningElement, track, wire, api } from "lwc";
import getSlackChannels from "@salesforce/apex/L_SlackChannelsController.getSlackChannels";
import getWorkspaces from "@salesforce/apex/L_SlackChannelsController.getWorkspaces";

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
      return {workspaceName : workspacesMap[channel.WorkspaceId__c].Name, ...channel};
    });

    this.workspacesList = workspaces;
    this.channelsList = channels;
  }

  handleNavigate(event) {
    this.state = event.detail.state;
    // this.retrieveChannels();
  }

  handleChangeList(event) {
    this.channelsList = event.detail.channelsList;
    // this.retrieveChannels();
    console.log(JSON.stringify(this.channelsList));
    this.state="channels";
  }

  handleChangeWorkspace(event) {
    this.editingWorkspace = event.detail.workspace;
    // console.log('changed workspace', JSON.stringify(this.editingWorkspace));
    // console.log('event: ', JSON.stringify(event));
    let workspacesListCopy = [...this.workspacesList];
    workspacesListCopy = workspacesListCopy.filter(workspace=>workspace.Token__c!==this.editingWorkspace.Token__c);
    workspacesListCopy.push(this.editingWorkspace);
    console.log('workspaceList: ', JSON.stringify(workspacesListCopy));
    this.workspacesList = workspacesListCopy;
    // this.retrieveChannels();
    this.state="workspaces";

  }

  handleEditWorkspace(event){
    this.editingWorkspace = event.detail.workspace;
    this.state = event.detail.state;
    // console.log(JSON.stringify(this.editingWorkspace));
  }

  get isChannels() {
    return this.state === "channels";
  }

  get isWorkspaces() {
    return this.state === "workspaces";
  }

  get isChannelManager() {
    return this.state === "channelManager";
  }

  get isWorkspace() {
    return this.state === "workspace";
  }
}
