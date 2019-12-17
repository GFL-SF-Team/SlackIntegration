import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class SlackWorkspacesList2 extends NavigationMixin(
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
  // workspaceMap = {};

  newWorkspace(workspace = {}) {
    const navigateEvent = new CustomEvent("editworkspace", {
      detail: { state: "workspace", workspace }
    });
    this.dispatchEvent(navigateEvent);
  }

  back() {
    const navigateEvent = new CustomEvent("navigate", {
      detail: { state: "channels" }
    });
    this.dispatchEvent(navigateEvent);
  }

  deleteRecord(workspace) {
    console.log(JSON.stringify(workspace));
  }

  handleRowAction(event) {
    let action = event.detail.action;
    let workspace = event.detail.row;
    switch (action.name) {
      case "edit":
        this.newWorkspace(workspace);
        break;
      case "delete":
        this.deleteRecord(workspace);
        break;
    }
  }
}
