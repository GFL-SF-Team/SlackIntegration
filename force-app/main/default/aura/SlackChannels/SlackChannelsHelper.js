/**
 * @date: 10.09.19
 */
({

    /**
     * @description: Prepares the channels table header, actions and fills it with data
     */
    init: function (cmp, event, helper) {
        let actions = [{ label: 'Delete', name: 'delete' }];

        cmp.set('v.columns', [
            { label: 'Channel name', fieldName: 'Name', type: 'text' },
            { label: 'Channel Id', fieldName: 'IdChannel__c', type: 'text' },
            { label: 'Workspace Name', fieldName: 'workspaceName', type: 'text' },
            { type: 'action', typeAttributes: { rowActions: actions } }
        ]);
        helper.getChannelsData(cmp, event, helper);
    },

    /**
     * @description: Gets channels and workspaces from Custom Settings and sets channelsList attribute
     */
    getChannelsData: function (cmp, event, helper) {
        $CommonUtils.sendPromiseRequest(cmp, 'getSlackChannels', {})
            .then(response => {
                cmp.set('v.channelsList', JSON.parse(response));
            })
            .then(response => {
                return helper.getWorkspacesMap(cmp, event, helper);
            })
            .then(workspacesMap => {
                let channelsList = cmp.get('v.channelsList');

                channelsList.forEach((channel) => {
                    channel.workspaceName = workspacesMap[channel.WorkspaceId__c].Name;
                });
                cmp.set('v.channelsList', channelsList);
            })
            .catch((error) => {
                $CommonUtils.handleErrorInPromiseCatch(error);
            });
    },

    /**
     * @description: Handles an action of the table's row
     */
    handleRowAction: function (cmp, event, helper) {
        let action = event.getParam('action');
        let slackChannel = event.getParam('row');

        switch (action.name) {
            case 'delete':
                helper.deleteRecord(cmp, slackChannel);
                break;
        }
    },

    /**
     * @description: Performs a request to delete the given channel
     * @param {Object} cmp: component object
     * @param {SlackChannel__c} channelToDelete: a channel to delete
     */
    deleteRecord: function (cmp, channelToDelete) {
        $CommonUtils.sendPromiseRequest(cmp, 'deleteChannel', { channel: { Id: channelToDelete.Id } })
            .then(response => {
                let channelsList = cmp.get('v.channelsList');

                channelsList = channelsList.filter(channel => channel.IdChannel__c != channelToDelete.IdChannel__c);
                cmp.set('v.channelsList', channelsList);
            })
            .catch((error) => {
                $CommonUtils.handleErrorInPromiseCatch(error);
            });
    },

    /**
     * @description: Performs a request to get workspaces from Custom Settings
     */
    getWorkspacesMap: function (cmp, event, helper) {
        return $CommonUtils.sendPromiseRequest(cmp, 'getWorkspaces')
            .then(response => {
                let workspaces = JSON.parse(response);
                let workspacesMap = {};

                workspaces.forEach(workspace => {
                    workspacesMap[workspace.Id] = workspace;
                });
                cmp.set('v.workspaceMap', workspacesMap);
                return workspacesMap;
            })
            .catch((error) => {
                $CommonUtils.handleErrorInPromiseCatch(error);
            });
    },


})