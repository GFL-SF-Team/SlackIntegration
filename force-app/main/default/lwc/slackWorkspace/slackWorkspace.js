import { LightningElement, api } from "lwc";
import saveWorkspace from "@salesforce/apex/L_SlackWorkspacesListController.saveWorkspace";
import { navigateToWorkspaces } from "c/slackUtils";
import {
  handleValidationError,
  handleErrorInResponse,
  handleErrorInResponseFromApex,
  showNotifyWithError
} from "c/utils";

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
      if (!inputName.value) throw new Error("Name is empty");

      if (!inputToken.value) throw new Error("Token is empty");

      try {
        let response = await saveWorkspace({ workspace: this.workspace });
        if (response.success) {
          navigateToWorkspaces(this, true);
        } else if (!response.success && response.code === 1001) {
          showNotifyWithError(this, response.message);
        } else {
          handleErrorInResponseFromApex(this, response);
        }
      } catch (error) {
        handleErrorInResponse(this, error);
      }
    } catch (error) {
      handleValidationError(this, error);
    }
  }

  cancel() {
    navigateToWorkspaces(this);
  }
}
