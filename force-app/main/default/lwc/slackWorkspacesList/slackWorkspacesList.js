import { LightningElement, api } from "lwc";
import deleteWorkspace from "@salesforce/apex/L_SlackWorkspacesListController.deleteWorkspace";
import { navigateToChannels } from "c/slackUtils";
import { navigateToWorkspace, updateData } from "c/slackUtils";

export default class SlackWorkspacesList extends LightningElement( LightningElement) {
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

  editWorkspace(workspace) {
    navigateToWorkspace(this, workspace);
  }

  back() {
    navigateToChannels(this);
  }

  async deleteRecord(workspace) {
    await deleteWorkspace({ workspace });
    updateData(this);
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
}
