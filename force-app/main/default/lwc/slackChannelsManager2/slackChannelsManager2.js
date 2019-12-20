import { LightningElement, api, track } from "lwc";
import getExistingSlackChannels from "@salesforce/apex/L_SlackChannelsController.getExistingSlackChannels";
import saveChannelsFromWorkspace from "@salesforce/apex/L_SlackChannelsController.saveChannelsFromWorkspace";

export default class SlackChannelsManager2 extends LightningElement {

  @api workspacesList;
  @api channelsList;

  @track
  channelsFromSlack = [];

  @track
  channelsSelectedIds = [];
  // workspaces = [];
  // @track
  // selectedWorkspace;

  @track
  selectedWorkspaceValue;


  connectedCallback(){
    this.workspacesList = this.workspacesList.map(workspace => {
      return {label:workspace.Name, value:workspace.Token__c, ...workspace};
    });
    // console.log('workspacesList',JSON.stringify(this.workspacesList));
    if (!this.selectedWorkspaceValue){
      this.selectedWorkspaceValue = this.workspacesList[0].Token__c;
    }
    this.getWorkspaceChannels();
    
  }
  async getWorkspaceChannels(){
    let selectedWorkspace = this.workspacesList.filter(workspace => workspace.Token__c === this.selectedWorkspaceValue)[0];
    let workspaceId = selectedWorkspace.Id;
    this.channelsFromSlack = await getExistingSlackChannels({workspaceToken: selectedWorkspace.Token__c});
    this.channelsFromSlack = this.channelsFromSlack.map(channel => {
      return {label:channel.Name, value:channel.IdChannel__c, WorkspaceId__c: workspaceId, workspaceName: selectedWorkspace.Name, ...channel };
    });
    
    // console.log('selectedWorkspace',JSON.stringify(this.selectedWorkspace));
    // console.log('channelsFromSlack', JSON.stringify(this.channelsFromSlack));
    let workspaceChannelsIds = this.channelsList.filter(channel => channel.WorkspaceId__c == workspaceId).map(channel => channel.IdChannel__c);
    let selectedChannels = this.channelsFromSlack.filter(channel => workspaceChannelsIds.includes(channel.IdChannel__c));
    this.channelsSelectedIds = selectedChannels.map(channel => channel.IdChannel__c);
    // console.log('channelsSelectedIds', JSON.stringify(this.channelsSelectedIds));

  }

  // get selectedWorkspaceValue(){
  //   return this.selectedWorkspace.Token__c;
  // }


  cancel() {
    this.back();
  }

  async save() {
    // this.back();
    let selectedWorkspace = this.workspacesList.filter(workspace => workspace.Token__c === this.selectedWorkspaceValue)[0];
    let workspaceId = selectedWorkspace.Id;
    let selectedChannels = this.channelsFromSlack.filter(channel => this.channelsSelectedIds.includes(channel.IdChannel__c));
      selectedChannels = selectedChannels.map(channel => {
        let {Id, Name, IdChannel__c, WorkspaceId__c} = channel;
        return {Id, Name, IdChannel__c, WorkspaceId__c};
      });
    await saveChannelsFromWorkspace({selectedChannels, workspaceId});

    // let workspaceChannels= this.channelsList.filter(channel => channel.WorkspaceId__c != workspaceId);
    // workspaceChannels.push(...selectedChannels);
    // this.channelsList = workspaceChannels;

    const changeEvent = new CustomEvent("changelist", {
      // detail: { channelsList: this.channelsList}
      // detail: {selectedChannels, workspaceId}
    });
    this.dispatchEvent(changeEvent);
    
    // this.back();


    // console.log('channels list', JSON.stringify(this.channelsList));
  }

  handleListboxChange(event){
    this.channelsSelectedIds = event.detail.value;

  }

  updateChannels(event) {
    this.selectedWorkspaceValue = event.detail.value;
    this.getWorkspaceChannels();

  }
  back() {
    const navigateEvent = new CustomEvent("navigate", {
      detail: { state: "channels" }
    });
    this.dispatchEvent(navigateEvent);
  }
}
