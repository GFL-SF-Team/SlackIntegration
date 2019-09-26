/**
 * @date: 10.09.19
 */
({

    /**
     * @description: Performs a request to send a message to Slack
     * @param {Object} cmp: component object
     * @param {String} priority: Priority of the message
     * @param {String} type: Type of the message
     * @param {String} textMessage: User text to display in the message
     */
    sendNotificationToSlack: function (cmp, priority, type, textMessage) {

        $CommonUtils.sendPromiseRequest(cmp, 'sendSlackNotification', { type, priority, textMessage })
            .then(response => {
                console.log('The message has been sent');
            })
            .catch((error) => {
                $CommonUtils.handleErrorInPromiseCatch(error);
            });
    },
})