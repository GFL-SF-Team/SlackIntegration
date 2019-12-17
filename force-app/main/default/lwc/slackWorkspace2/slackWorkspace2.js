import { LightningElement, api, track } from "lwc";
import saveWorkspace from "@salesforce/apex/L_SlackWorkspacesListController.saveWorkspace";

export default class SlackWorkspace2 extends LightningElement {

  // @api workspace;

  // @track workspaceEdit;
  workspaceEdit;



  @api
  get workspace(){
    return this.workspaceEdit;
  }
  set workspace(value){
    this.workspaceEdit=value;

  }
  // changeName(event){
  //   this.workspaceEdit.Name = event.detail.value;

  // }

  // changeToken(event){
  //   this.workspaceEdit.Token__c = event.detail.value;

  // }
  async save() {

    const inputName = this.template.querySelector('[data-id="input_name"]');
    const inputToken = this.template.querySelector('[data-id="input_token"]');
    let workspaceCopy = {...this.workspaceEdit, Name: inputName.value, Token__c: inputToken.value};
    console.log('klj',JSON.stringify(workspaceCopy));
    await saveWorkspace({workspace: workspaceCopy});
    const changeEvent = new CustomEvent('changeworkspace', {
      detail: { workspace: workspaceCopy}
    });
    this.dispatchEvent(changeEvent);
    // this.back();
  }

  cancel() {
    this.back();
  }

  back() {

    const navigateEvent = new CustomEvent('navigate', {
      detail: { state : 'workspaces'}
    });
    this.dispatchEvent(navigateEvent);
  }
}
