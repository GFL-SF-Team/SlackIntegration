import { LightningElement, api } from "lwc";
import saveWorkspace from "@salesforce/apex/L_SlackWorkspacesListController.saveWorkspace";
import { navigateToWorkspaces } from "c/slackUtils";
import { handleResponse, handleErrors } from "c/utils";

export default class SlackWorkspace extends LightningElement {
  @api workspace;

  async save() {
    const inputName = this.template.querySelector('[data-id="input_name"]');
    const inputToken = this.template.querySelector('[data-id="input_token"]');

    this.workspace = {
      ...this.workspace,
      Name: inputName.value,
      Token__c: inputToken.value
    };

    try {
      let response = await saveWorkspace({ workspace: this.workspace });
      await handleResponse(this, response);
      navigateToWorkspaces(this, true);
    } catch (error) {
      handleErrors(this, error);
    }
  }

  cancel() {
    navigateToWorkspaces(this);
  }
}
