import sendSlackNotification from "@salesforce/apex/L_SlackNotificationController.sendSlackNotification";

export const PRIORITY_HIGH = "HIGH";
export const PRIORITY_MEDIUM = "MEDIUM";
export const PRIORITY_LOW = "LOW";

export const TYPE_ERROR = "ERROR";
export const TYPE_WARNING = "WARNING";
export const TYPE_INFO = "INFO";

export const CHANNELS_STATE = "channels";
export const CHANNELS_MANAGER_STATE = "channelManager";
export const WORKSPACES_STATE = "workspaces";
export const WORKSPACE_STATE = "workspace";

export async function sendNotificationSlack(priority, type, textMessage) {

  try{
    await sendSlackNotification({ priority, type, textMessage });

  }catch(error){
      console.log("Error while sending to Slack: " + JSON.stringify(error));
  }
}

export function navigateToChannels(cmp, update = false) {
  navigateToState(cmp, CHANNELS_STATE, update);
}

export function navigateToChannelsManager(cmp, update = false) {
  navigateToState(cmp, CHANNELS_MANAGER_STATE, update);
}

export function navigateToWorkspaces(cmp, update = false) {
  navigateToState(cmp, WORKSPACES_STATE, update);
}

export function navigateToWorkspace( cmp, workspace = { Name: "", Token__c: "" }) {
  navigateToState(cmp, WORKSPACE_STATE, false, { workspace });
}

export function updateData(cmp) {
  navigateToState(cmp, false, true);
}

export function navigateToState(cmp, state, update, param = {}) {
  
  const navigateEvent = new CustomEvent("navigate", {
    detail: { state, update, ...param }
  });

  cmp.dispatchEvent(navigateEvent);
}

