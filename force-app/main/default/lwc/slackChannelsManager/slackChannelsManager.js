import { LightningElement, api, track } from "lwc";
import getExistingSlackChannels from "@salesforce/apex/L_SlackChannelsController.getExistingSlackChannels";
import saveChannelsFromWorkspace from "@salesforce/apex/L_SlackChannelsController.saveChannelsFromWorkspace";
import { navigateToChannels } from "c/slackUtils";
import { handleErrorInResponse, handleErrorInResponseFromApex, showNotifyWithError } from "c/utils";

export default class SlackChannelsManager extends LightningElement {
  @api workspacesList;
  @api channelsList;

  @track channelsFromSlack = [];
  @track channelsSelectedIds = [];
  @track selectedWorkspaceValue;

  connectedCallback() {
    this.workspacesList = this.workspacesList.map(workspace => {
      return { label: workspace.Name, value: workspace.Token__c, ...workspace };
    });

    let selectedWorkspace = this.workspacesList[0];

    if (!this.selectedWorkspaceValue) {
      this.selectedWorkspaceValue = selectedWorkspace.Token__c;
    }
    this.getWorkspaceChannels(selectedWorkspace);
  }

  async getWorkspaceChannels(selectedWorkspace) {

    try {
      this.channelsFromSlack = await this.getExistingSlackChannelsFromApex(this, selectedWorkspace.Token__c);

      let workspaceId = selectedWorkspace.Id;

      this.channelsFromSlack = this.channelsFromSlack.map(channel => {
        return {
          label: channel.NameChannel__c,
          value: channel.IdChannel__c,
          WorkspaceId__c: workspaceId,
          workspaceName: selectedWorkspace.Name,
          ...channel
        };
      });

      let workspaceChannelsIds = this.channelsList
        .filter(channel => channel.WorkspaceId__c == workspaceId)
        .map(channel => channel.IdChannel__c);

      let selectedChannels = this.channelsFromSlack.filter(channel =>
        workspaceChannelsIds.includes(channel.IdChannel__c)
      );

      this.channelsSelectedIds = selectedChannels.map(
        channel => channel.IdChannel__c
      );

    } catch (error) {
      console.log(error);
      // handleErrorInResponse(this, error);
    }
  }

  async getExistingSlackChannelsFromApex(cmp, workspaceToken) {
      let result;

      try {
        let response = await getExistingSlackChannels({workspaceToken});
        if (response.success) {
          result = JSON.parse(response.data);
          result.forEach(elem => {
            delete elem.attributes;
          });
          // this.handleResponseWithComponentData(cmp, response.data);
        } else if (!response.success && response.code === 1001) {
          // console.log('Notify With Error');
          showNotifyWithError(cmp, response.message);
        } else {
          handleErrorInResponseFromApex(cmp, response);
        }
      } catch (error) {
        handleErrorInResponse(cmp, error);
      }
      return result;
  }
  cancel() {
    navigateToChannels(this, false);
  }

  async save() {
    let selectedWorkspace = this.workspacesList.filter(
      workspace => workspace.Token__c === this.selectedWorkspaceValue
    )[0];

    let selectedChannels = this.channelsFromSlack.filter(channel =>
      this.channelsSelectedIds.includes(channel.IdChannel__c)
    );

    let workspaceId = selectedWorkspace.Id;

    try {
      let response = await saveChannelsFromWorkspace({ selectedChannels, workspaceId });
      if (response.success) {
        navigateToChannels(this, true);
      } else if (!response.success && response.code === 1001) {
        showNotifyWithError(this, response.message);
      } else {
        handleErrorInResponseFromApex(this, response);
      }
    } catch (error) {
      handleErrorInResponse(this, error);
    }
  }

  handleListboxChange(event) {
    this.channelsSelectedIds = event.detail.value;
  }

  updateChannels(event) {
    this.selectedWorkspaceValue = event.detail.value;

    let selectedWorkspace = this.workspacesList.filter(
      workspace => workspace.Token__c === event.detail.value
    )[0];
    this.getWorkspaceChannels(selectedWorkspace);
  }
}
