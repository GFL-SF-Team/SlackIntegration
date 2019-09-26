/**
 * @date: 10.09.19
 */
({
    /**
     * @description: Returns back to SlackWorkspacesList component
     */
    cancel: function (cmp, event, helper) {
        helper.backToList();
    },

    /**
     * @description: Saves current workspace
     */
    save: function (cmp, event, helper) {
        helper.saveWorkspace(cmp, event, helper);
    }
})