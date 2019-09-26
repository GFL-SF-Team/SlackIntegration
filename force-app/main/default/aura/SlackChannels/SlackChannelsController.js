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
     * @description: Navigates to the SlackChannelsManager component
     */
    newChannelFromWorkspace: function (cmp, event, helper) {
        $CommonUtils.navigateToComponent('SlackChannelsManager', {});
    },

    /**
     * @description: Navigates to the SlackWorkspacesList component
     */
    manageWorkspaces: function (cmp, event, helper) {
        $CommonUtils.navigateToComponent('SlackWorkspacesList', {});
    },

})