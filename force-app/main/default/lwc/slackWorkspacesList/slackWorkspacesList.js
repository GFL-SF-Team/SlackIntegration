import { LightningElement, api } from "lwc";
import deleteWorkspace from "@salesforce/apex/L_SlackWorkspacesListController.deleteWorkspace";
import {
  navigateToChannels,
  navigateToWorkspace,
  updateData
} from "c/slackUtils";
import {
  handleErrorInResponse,
  showNotifyWithError,
  handleErrorInResponseFromApex
} from "c/utils";

export default class SlackWorkspacesList extends LightningElement(
  LightningElement
) {
  @api workspacesList = [];

  columns = [
    { label: "Workspace name", fieldName: "Name", type: "text" },
    { label: "token", fieldName: "Token__c", type: "text" },
    {
      type: "action",
      typeAttributes: {
        rowActions: [
          { label: "Edit", name: "edit" },
          { label: "Delete", name: "delete" }
        ]
      }
    }
  ];

  newWorkspace() {
    navigateToWorkspace(this);
  }

  back() {
    navigateToChannels(this);
  }

  handleRowAction(event) {
    let action = event.detail.action;
    let workspace = event.detail.row;

    switch (action.name) {
      case "edit":
        this.editWorkspace(workspace);
        break;
      case "delete":
        this.deleteRecord(workspace);
        break;
    }
  }

  editWorkspace(workspace) {
    navigateToWorkspace(this, workspace);
  }

  async deleteRecord(workspace) {
    try {
      let response = await deleteWorkspace({ workspace });
      if (response.success) {
        this.workspacesList = this.workspacesList.filter(
          workspaceEl => workspaceEl.Id !== workspace.Id
        );
        updateData(this);
      } else if (!response.success && response.code === 1001) {
        showNotifyWithError(this, response.message);
      } else {
        handleErrorInResponseFromApex(this, response);
      }
    } catch (error) {
      handleErrorInResponse(this, error);
    }
  }

  get isEmptyWorkspacesList() {
    return this.workspacesList && this.workspacesList.length == 0;
  }
}
