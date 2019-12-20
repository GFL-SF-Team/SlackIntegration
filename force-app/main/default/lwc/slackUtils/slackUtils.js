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


  export function navigateToChannels(cmp) {
    navigateToState(cmp, CHANNELS_STATE);
  }

  export function navigateToChannelsManager(cmp) {
    navigateToState(cmp, CHANNELS_MANAGER_STATE);
  }

  export function navigateToWorkspaces(cmp) {
    navigateToState(cmp, WORKSPACES_STATE);
  }

  export function navigateToWorkspace(cmp) {
    navigateToState(cmp, WORKSPACE_STATE);
  }

  export function navigateToState(cmp, state) {
    const navigateEvent = new CustomEvent("navigate", {
      detail: {state}
    });
    cmp.dispatchEvent(navigateEvent);
  }