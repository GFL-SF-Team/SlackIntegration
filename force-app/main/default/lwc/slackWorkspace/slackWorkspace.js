/**
 * @File Name          : slackWorkspace.js
 * @Description        : Adds new slack workspace or edits existing
 * @Author             : Pavel Riabov
 * @Last Modified By   : Pavel Riabov
 * @Last Modified On   : 28.02.2020, 12:52:06
 * Ver       Date            Author      		    Modification
 * 1.0    28.02.2020   Pavel Riabov     Initial Version
**/
import { LightningElement, api } from "lwc";
import saveWorkspace from "@salesforce/apex/L_SlackWorkspacesListController.saveWorkspace";
import { navigateToWorkspaces } from "c/slackUtils";
import { handleResponse, handleErrors } from "c/utils";

export default class SlackWorkspace extends LightningElement {
  @api workspace;

  /**
   * @description: Inserts or updates current workspace
   */
  async save() {
    const inputName = this.template.querySelector('[data-id="input_name"]');
    const inputToken = this.template.querySelector('[data-id="input_token"]');

    this.workspace = {
      ...this.workspace,
      Name: inputName.value,
      slackMsg2__Token__c: inputToken.value,
    };

    // let workspaceParam = 'name: '+this.workspace.Name+', token: '+this.workspace.slackMsg2__Token__c;
    let workspace = JSON.stringify(this.workspace);
    try {
      let response = await saveWorkspace({ workspace });
      await handleResponse(this, response);
      navigateToWorkspaces(this, true);

    } catch (error) {
      handleErrors(this, error);
    }
  }

  /**
   * @description: Returns back to slackWorkspacesList component without saving
   */
  cancel() {
    navigateToWorkspaces(this);
  }
}
