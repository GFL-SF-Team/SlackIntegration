/**
 * @date: 11.09.19
 * @description: Class with common utility methods
 */
class CommonUtils {

    /**
     * @author: Dmytro Lambru
     * @description: method to send request to server using Promise object
     * @param {Object} cmp: - component object
     * @param {String} apexMethodName: - server-side method name
     * @param {Object} apexParams: - params for server-side method e.g. {param1: 'some string', param2: ['some', 'array']}
     * @return {Object}: new Promise() and request result on resolve
     */
    sendPromiseRequest(cmp, apexMethodName, apexParams) {

        return new Promise((resolve, reject) => {

            if (!apexMethodName) {
                reject(new Error('No method name supplied'));
            }

            const action = cmp.get('c.' + apexMethodName);

            if ($A.util.isObject(apexParams) && Object.keys(apexParams).length !== 0) {
                action.setParams(apexParams);
            }

            action.setCallback(this, (response) => {

                if (response.getState() === 'SUCCESS') {
                    resolve(response.getReturnValue());

                } else if (response.getState() === 'INCOMPLETE') {
                    reject(new Error('Response status is "INCOMPLETE"'));

                } else if (response.getState() === 'ERROR') {
                    reject(response.getError());
                }
            });

            $A.enqueueAction(action);
        });
    }

    handleErrorInPromiseCatch(error) {

        if (!$A.util.isEmpty(error)) {
            console.log('Error string: ' + JSON.stringify(error));
            console.error('ERROR', Object.assign({}, error));
        }
    }

    /**
     * @date: 10.09.19
     * @description: Navigates to the given component and sets component attributes
     * @param {String} componentName: a name of the component
     * @param {Object} params: names and values of attributes to be set in the component
     */
    navigateToComponent(componentName, params) {
        let evt = $A.get('e.force:navigateToComponent');

        evt.setParams({
            componentDef: 'c:' + componentName,
            componentAttributes: params
        });

        evt.fire();
    }

    /**
     * @date: 13.09.19
     * @description: Fires SlackNotificateEvent event to send a message to Slack
     * @param {String} priority: Priority of the message
     * @param {String} type: Type of the message
     * @param {String} textMessage: Text of the message
     */
    sendSlackNotification(priority, type, textMessage){
        let slackNotificationEvent = $A.get("e.c:SlackNotificateEvent");

        slackNotificationEvent.setParams({priority, type, textMessage});
        slackNotificationEvent.fire();
    }

}

window.$CommonUtils = new CommonUtils();
