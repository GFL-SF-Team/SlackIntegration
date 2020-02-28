/**
 * @File Name          : slackWorkspacesList.js
 * @Description        : Performs actions on a list of workspaces
 * @Author             : Pavel Riabov
 * @Last Modified By   : Pavel Riabov
 * @Last Modified On   : 28.02.2020, 12:54:58
 * Ver       Date            Author      		    Modification
 * 1.0    28.02.2020   Pavel Riabov     Initial Version
**/
import { LightningElement, api } from "lwc";
import deleteWorkspace from "@salesforce/apex/L_SlackWorkspacesListController.deleteWorkspace";
import { navigateToChannels, navigateToWorkspace, updateData } from "c/slackUtils";
import { handleResponse, handleErrors } from "c/utils";

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

  /**
   * @description: Navigates to slackWorkspace component with new empty workspace
   */
  newWorkspace() {
    navigateToWorkspace(this);
  }

  /**
   * @description: Navigates back to slackChannels component
   */
  back() {
    navigateToChannels(this);
  }

  /**
   * @description: Handles and action on selected workspace
   */
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

  /**
   * @description: Navigates to slackWorkspace component with selected workspace
   */
  editWorkspace(workspace) {
    navigateToWorkspace(this, workspace);
  }

  /**
   * @description: Deletes given workspace and updates data
   */
  async deleteRecord(workspace) {

    try {
      let response = await deleteWorkspace({ workspace });

      await handleResponse(this, response);

      this.workspacesList = this.workspacesList.filter(
        workspaceEl => workspaceEl.Id !== workspace.Id
      );
      updateData(this);

    } catch (error) {
      handleErrors(this, error);
    }
  }

  /**
   * @description: Checks if the workspace list is empty
   */
  get isEmptyWorkspacesList() {
    return this.workspacesList && this.workspacesList.length == 0;
  }
}
