/**
 * @File Name          : slackUtils.js
 * @Description        : Contains some common methods for navigating between components and sending a message
 * @Author             : Pavel Riabov
 * @Last Modified By   : Pavel Riabov
 * @Last Modified On   : 28.02.2020, 12:43:00
 * Ver       Date            Author      		    Modification
 * 1.0    28.02.2020   Pavel Riabov     Initial Version
**/
import sendSlackNotification from "@salesforce/apex/L_SlackNotificationController.sendSlackNotification";

export const slackNotificationPriorities = {HIGH: 'HIGH', MEDIUM: 'MEDIUM', LOW: 'LOW'}; 
export const slackNotificationTypes = {ERROR:'ERROR', WARNING:'WARNING', INFO:'INFO'}; 

export const CHANNELS_STATE = "channels";
export const CHANNELS_MANAGER_STATE = "channelManager";
export const WORKSPACES_STATE = "workspaces";
export const WORKSPACE_STATE = "workspace";

/**
 * @description: Performs sending a message to Slack with priority, type and text of the message
 */
export async function sendNotificationSlack(priority, type, textMessage) {

  try{
    await sendSlackNotification({ priority, type, textMessage });

  }catch(error){
      console.log("Error while sending to Slack: " + JSON.stringify(error));
  }
}

/**
 * @description: Navigates to slackChannels component
 */
export function navigateToChannels(cmp, update = false) {
  navigateToState(cmp, CHANNELS_STATE, update);
}

/**
 * @description: Navigates to slackChannelsManager component
 */
export function navigateToChannelsManager(cmp, update = false) {
  navigateToState(cmp, CHANNELS_MANAGER_STATE, update);
}

/**
 * @description: Navigates to slackWorkspaces component
 */
export function navigateToWorkspaces(cmp, update = false) {
  navigateToState(cmp, WORKSPACES_STATE, update);
}

/**
 * @description: Navigates to slackWorkspace component
 */
export function navigateToWorkspace( cmp, workspace = { Name: "", slackMsg2__Token__c: "" }) {
  navigateToState(cmp, WORKSPACE_STATE, false, { workspace });
}

/**
 * @description: Updates a list of workspaces and channels without navigating
 */
export function updateData(cmp) {
  navigateToState(cmp, false, true);
}

/**
 * @description: Common function to navigate to component and/or update data
 */
export function navigateToState(cmp, state, update, param = {}) {
  
  const navigateEvent = new CustomEvent("navigate", {
    detail: { state, update, ...param }
  });

  cmp.dispatchEvent(navigateEvent);
}

