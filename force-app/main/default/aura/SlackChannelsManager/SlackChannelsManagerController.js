/**
 * @date: 10.09.19
 */
({
    /**
     * @description: Prepares the attributes and component elements
     */
    init: function (cmp, event, helper) {
        helper.getWorkspacesList(cmp, event, helper);
    },

    /**
     * @description: Returns back to SlackChannels component
     */
    cancel: function (cmp, event, helper) {
        helper.backToList();
    },

    /**
     * @description: Saves selected channels
     */
    save: function (cmp, event, helper) {
        helper.saveChannels(cmp, event, helper);
    },

    /**
     * @description: Updates current channels list from the given slack workspace
     */
    updateChannels: function (cmp, event, helper) {
        let selectedWorkspace = cmp.get('v.selectedWorkspace');

        helper.getWorkspaceChannels(cmp, helper, selectedWorkspace);
    }
})