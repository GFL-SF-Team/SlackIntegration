/**
 * @date: 10.09.19
 */
({
    /**
     * @description: Inserts or updates current workspace
     */
    saveWorkspace: function (cmp, event, helper) {
        let workspaceAttribute = cmp.get('v.workspace');
        let { Id, Name, Token__c } = workspaceAttribute;
        let workspace = { Id, Name, Token__c };

        $CommonUtils.sendPromiseRequest(cmp, 'saveWorkspace', { workspace })
            .then(response => {
                helper.backToList();
            })
            .catch((error) => {
                $CommonUtils.handleErrorInPromiseCatch(error);
            });
    },

    /**
     * @description: Navigates back to SlackWorkspacesList component
     */
    backToList: function () {
        $CommonUtils.navigateToComponent('SlackWorkspacesList');
    }

})