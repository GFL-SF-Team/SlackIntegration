/**
 * @date: 10.09.19
 */
({
    /**
     * @description: Prepares the workspace table header, actions and fills it with data
     */
    init: function (cmp, event, helper) {
        let actions = [{ label: 'Edit', name: 'edit' }, { label: 'Delete', name: 'delete' }];

        cmp.set('v.columns', [
            { label: 'Workspace name', fieldName: 'Name', type: 'text' },
            { label: 'token', fieldName: 'Token__c', type: 'text' },
            { type: 'action', typeAttributes: { rowActions: actions } }
        ]);
        helper.getWorkspaceData(cmp, event, helper);
    },

    /**
     * @description: Performs a request to get all workspaces from Custom Settings
     */
    getWorkspaceData: function (cmp, event, helper) {
        $CommonUtils.sendPromiseRequest(cmp, 'getWorkspaces', {})
            .then(response => {
                cmp.set('v.workspacesList', JSON.parse(response));
            })
            .catch((error) => {
                $CommonUtils.handleErrorInPromiseCatch(error);
            });
    },

    /**
     * @description: Handles an action from workspaces table row
     */
    handleRowAction: function (cmp, event, helper) {
        let action = event.getParam('action');
        let workspace = event.getParam('row');

        switch (action.name) {
            case 'edit':
                helper.navigateToWorkspace(workspace);
                break;
            case 'delete':
                helper.deleteRecord(cmp, workspace);
                break;
        }
    },

    /**
     * @description: Navigates to SlackWorkspaces component to edit selected workspace
     * @param {Workspace__c} workspace: selected workspace to edit
     */
    navigateToWorkspace: function (workspace) {
        $CommonUtils.navigateToComponent('SlackWorkspace', { workspace });
    },

    /**
     * @description: Performs a request to delete given workspace
     * @param {Object} cmp: component object
     * @param {Workspace__c} workspaceToDelete: the workspace to delete
     */
    deleteRecord: function (cmp, workspaceToDelete) {
        $CommonUtils.sendPromiseRequest(cmp, 'deleteWorkspace', { workspace: { Id: workspaceToDelete.Id } })
            .then(response => {
                let workspacesList = cmp.get('v.workspacesList');

                workspacesList = workspacesList.filter(workspace => workspace.Id != workspaceToDelete.Id);
                cmp.set('v.workspacesList', workspacesList);
            })
            .catch((error) => {
                $CommonUtils.handleErrorInPromiseCatch(error);
            });
    },

    /**
     * @description: Navigates to SlackWorkspace component to add new workspace to Custom Settings
     */
    addNewWorkspace: function () {
        let workspace = {
            attributes: {
                Type: 'Workspace__c',
                Id: '',
                Name: '',
                Token__c: ''
            }
        };

        $CommonUtils.navigateToComponent('SlackWorkspace', { workspace });
    },

})