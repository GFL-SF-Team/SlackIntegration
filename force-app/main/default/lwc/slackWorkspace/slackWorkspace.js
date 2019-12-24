import { LightningElement, api, track } from "lwc";
import saveWorkspace from "@salesforce/apex/L_SlackWorkspacesListController.saveWorkspace";
import { navigateToWorkspaces, navigateToWorkspace } from "c/slackUtils";

export default class SlackWorkspace extends LightningElement {
  // @api workspace;

  workspaceEdit;

  @api
  get workspace() {
    return this.workspaceEdit;
  }

  set workspace(value) {
    this.workspaceEdit = value || { Name: "", Token__c: "" };
  }

  async save() {
    const inputName = this.template.querySelector('[data-id="input_name"]');
    const inputToken = this.template.querySelector('[data-id="input_token"]');
    this.workspaceEdit = { ...this.workspaceEdit, Name: inputName.value, Token__c: inputToken.value};
    await saveWorkspace({ workspace: this.workspaceEdit });
    navigateToWorkspaces(this, true);
  }

  cancel() {
    this.back();
  }

  back() {
    navigateToWorkspaces(this); 
  }
}
