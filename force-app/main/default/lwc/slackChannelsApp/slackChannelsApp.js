import { LightningElement, track, wire, api } from "lwc";
import getSlackChannels from "@salesforce/apex/L_SlackChannelsController.getSlackChannels";
import getWorkspaces from "@salesforce/apex/L_SlackChannelsController.getWorkspaces";
import saveChannelsFromWorkspace from "@salesforce/apex/L_SlackChannelsController.saveChannelsFromWorkspace";

export default class SlackChannelsApp extends LightningElement {
  @track state;

  @track channelsList;
  @track workspacesList;
  @track editingWorkspace;

  // channelsList;
  // workspacesList;
  // editingWorkspace;

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
    // return new Promise(async (resolve, reject) => {
      let workspaces = await getWorkspaces();
      let channels = await getSlackChannels();
      // workspaces = workspaces.map(workspace => {
      //   let {Id, Name, Token__c} = workspace;
      //   return {Id, Name, Token__c};
      // });
      // channels = channels.map(channel => {
      //   let {Id, Name, IdChannel__c, WorkspaceId__c} = channel;
      //   return {Id, Name, IdChannel__c, WorkspaceId__c};
      // });
    // console.log("channels List: ", JSON.stringify(workspaces));
    // console.log("channels List obj: ", workspaces);

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
      // resolve({ workspaces, channels });
    // });
  }

  handleNavigate(event) {
    this.state = event.detail.state;
    // this.retrieveChannels();
  }

  async handleChangeList(event) {
    // this.channelsList = event.detail.channelsList;
    // let {selectedChannels, workspaceId} = event.detail;
    // await saveChannelsFromWorkspace({selectedChannels, workspaceId});

    // let { workspaces, channels } = await this.retrieveChannels();
    this.retrieveChannels();

    // debugger;
    // this.channelsList = channels;
    // this.workspacesList = workspaces;

    console.log("channelsList: ", JSON.stringify(this.channelsList));
    this.state = "channels";
  }

  async handleChangeWorkspace(event) {
    // let workspaceChanged = event.detail.workspace;
    // // // console.log('changed workspace', JSON.stringify(this.editingWorkspace));
    // // // console.log('event: ', JSON.stringify(event));




    // let workspacesListCopy = [...this.workspacesList];
    // workspacesListCopy = workspacesListCopy.filter(
    //   workspace => workspace.Token__c !== workspaceChanged.Token__c
    // );
    // workspacesListCopy.push(workspaceChanged);
    // // console.log("workspaceList: ", JSON.stringify(workspacesListCopy));

    // let workspacesMap = {};

    // for (let workspace of workspacesListCopy) {
    //   workspacesMap[workspace.Id] = workspace;
    // }

    // let channels = this.channelsList.map(channel => {
    //   return {
    //     ...channel,
    //     workspaceName: workspacesMap[channel.WorkspaceId__c].Name
    //   };
    // });

    // // console.log("channels: ", channels);

    // this.workspacesList = workspacesListCopy;
    // this.channelsList = channels;



    this.retrieveChannels();


    // this.editingWorkspace = workspaceChanged;
    // await this.retrieveChannels();
    // let { workspaces, channels } = await this.retrieveChannels();
    // this.workspacesList = workspaces;
    // this.channelsList = channels;

    // console.log("channels List: ", JSON.stringify(this.channelsList));
    // console.log("channels List: ", JSON.stringify(channels));
    // console.log("workspaces: ", JSON.stringify(workspacesListCopy));
    // console.log("workspaces: ", JSON.stringify(workspaces));

    // console.log("workspace changed: ", JSON.stringify(workspaceChanged));
    this.state = "workspaces";
  }

  handleEditWorkspace(event) {
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
