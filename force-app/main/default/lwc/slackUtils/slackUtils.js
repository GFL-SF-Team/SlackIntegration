import sendSlackNotification from '@salesforce/apex/L_SlackNotificationController.sendSlackNotification';

export function sendNotificationSlack(priority, type, textMessage) {
    sendSlackNotification({priority, type, textMessage})
        .then(result => {
            console.log('The message has been sent')
        })
        .catch(error =>{
            console.log('Error string: ' + JSON.stringify(error) )
        });

}