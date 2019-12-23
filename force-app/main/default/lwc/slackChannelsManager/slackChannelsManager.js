import { LightningElement, api, track } from "lwc";
import getExistingSlackChannels from "@salesforce/apex/L_SlackChannelsController.getExistingSlackChannels";
import saveChannelsFromWorkspace from "@salesforce/apex/L_SlackChannelsController.saveChannelsFromWorkspace";
import { navigateToChannels, updateData } from "c/slackUtils";

export default class SlackChannelsManager extends LightningElement {

  @api workspacesList;
  @api channelsList;

  @track
  channelsFromSlack = [];

  @track
  channelsSelectedIds = [];

  @track
  selectedWorkspaceValue;


  connectedCallback(){
    this.workspacesList = this.workspacesList.map(workspace => {
      return {label:workspace.Name, value:workspace.Token__c, ...workspace};
    });
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
    
    let workspaceChannelsIds = this.channelsList.filter(channel => channel.WorkspaceId__c == workspaceId).map(channel => channel.IdChannel__c);
    let selectedChannels = this.channelsFromSlack.filter(channel => workspaceChannelsIds.includes(channel.IdChannel__c));
    this.channelsSelectedIds = selectedChannels.map(channel => channel.IdChannel__c);

  }

  cancel() {
    navigateToChannels(this, false);
  }

  async save() {
    let selectedWorkspace = this.workspacesList.filter(workspace => workspace.Token__c === this.selectedWorkspaceValue)[0];
    let workspaceId = selectedWorkspace.Id;
    let selectedChannels = this.channelsFromSlack.filter(channel => this.channelsSelectedIds.includes(channel.IdChannel__c));
      selectedChannels = selectedChannels.map(channel => {
        let {Id, Name, IdChannel__c, WorkspaceId__c} = channel;
        return {Id, Name, IdChannel__c, WorkspaceId__c};
      });
    await saveChannelsFromWorkspace({selectedChannels, workspaceId});
    navigateToChannels(this, true);

  }

  handleListboxChange(event){
    this.channelsSelectedIds = event.detail.value;
  }

  updateChannels(event) {
    this.selectedWorkspaceValue = event.detail.value;
    this.getWorkspaceChannels();
  }
  
}
