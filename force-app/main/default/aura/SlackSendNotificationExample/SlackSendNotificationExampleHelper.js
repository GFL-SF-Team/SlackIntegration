/**
 * @date: 10.09.19
 */
({

    sendMessage: function (cmp, helper) {
        let priority = cmp.find('priority').get('v.value');
        let type = cmp.find('type').get('v.value');
        let textMessage = cmp.find('message').get('v.value');

        $CommonUtils.sendSlackNotification(priority, type, textMessage);
    },

})