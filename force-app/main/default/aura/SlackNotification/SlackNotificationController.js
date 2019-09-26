/**
 * @date: 10.09.19
 */
({

    /**
     * @description: Handles SlackNotificate event and sends a message to Slack
     */
    handleSlackNotificationEvent: function (cmp, event, helper) {
        let { priority, type, textMessage } = event.getParams();

        helper.sendNotificationToSlack(cmp, priority, type, textMessage);
    }

})