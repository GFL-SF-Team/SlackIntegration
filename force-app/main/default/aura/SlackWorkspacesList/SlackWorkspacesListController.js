/**
 * @date: 10.09.19
 */
({

    /**
     * @description: Prepares the table and components
     */
    init: function (cmp, event, helper) {
        helper.init(cmp, event, helper);
    },

    /**
     * @description: Handles the action fired from the row
     */
    handleRowAction: function (cmp, event, helper) {
        helper.handleRowAction(cmp, event, helper);
    },

    /**
     * @description: Navigates to SlackWorkspace component to create new Workspace__c record
     */
    newWorkspace: function (cmp, event, helper) {
        helper.addNewWorkspace();
    },

    /**
     * @description: Navigates to SlackChannels component
     */
    back: function (cmp, event, helper) {
        $CommonUtils.navigateToComponent('SlackChannels', {});
    },
})