import sendSlackNotification from '@salesforce/apex/L_SlackNotificationController.sendSlackNotification';

export const CHANNELS_STATE = 'channels';
export const CHANNELS_MANAGER_STATE = 'channelManager';
export const WORKSPACES_STATE = 'workspaces';
export const WORKSPACE_STATE = 'workspace';


export function sendNotificationSlack(priority, type, textMessage) {
    sendSlackNotification({priority, type, textMessage})
        .then(result => {
            console.log('The message has been sent')
        })
        .catch(error =>{
            console.log('Error string: ' + JSON.stringify(error) )
        });

}


  export function navigateToChannels(cmp, update=false) {
    navigateToState(cmp, CHANNELS_STATE, update);
  }

  export function navigateToChannelsManager(cmp, update=false) {
    navigateToState(cmp, CHANNELS_MANAGER_STATE, update);
  }

  export function navigateToWorkspaces(cmp, update=false) {
    navigateToState(cmp, WORKSPACES_STATE, update);
  }

  export function navigateToWorkspace(cmp, update=false) {
    navigateToState(cmp, WORKSPACE_STATE, update);
  }

  export function updateData(cmp) {
    navigateToState(cmp, false, true);
  }

  export function navigateToState(cmp, state, update) {
    const navigateEvent = new CustomEvent("navigate", {
      detail: {state, update}
    });
    cmp.dispatchEvent(navigateEvent);
  }
