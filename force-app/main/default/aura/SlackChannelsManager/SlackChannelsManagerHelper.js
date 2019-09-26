/**
 * @date: 10.09.19
 */
({

    /**
     * @description: Performs a request to get all slack workspaces from Custom Settings
     */
    getWorkspacesList: function (cmp, event, helper) {
        $CommonUtils.sendPromiseRequest(cmp, 'getWorkspaces')
            .then(response => {
                let workspaces = JSON.parse(response);
                let selectedWorkspace = workspaces[0];
                let workspaceToken = selectedWorkspace.Token__c;

                cmp.set('v.workspaces', workspaces);
                cmp.set('v.selectedWorkspace', workspaceToken);
                return workspaceToken;
            })
            .then(workspaceToken => {
                helper.getWorkspaceChannels(cmp, helper, workspaceToken);
            })
            .catch((error) => {
                $CommonUtils.handleErrorInPromiseCatch(error);
            });
    },

    /**
     * @description: Performs a request to get all channels from the current workspace from Slack
     * @param {Object} cmp: component object
     * @param {Object} helper: helper object
     * @param {String} workspaceToken: a token of slack workspace
     */
    getWorkspaceChannels: function (cmp, helper, workspaceToken) {
        $CommonUtils.sendPromiseRequest(cmp, 'getExistingSlackChannels', { workspaceToken })
            .then(response => {
                let channels = JSON.parse(response);

                channels.forEach((channel) => {
                    channel.label = channel.Name;
                    channel.value = channel.IdChannel__c;
                });
                cmp.set('v.channelsFromSlack', channels);
            })
            .then(response => {
                return helper.getChannelsFromSettings(cmp);
            })
            .then(response => {
                let channelsFromSettings = cmp.get('v.channelsFromSettings');
                let channelsFromSlack = cmp.get('v.channelsFromSlack');
                let workspaces = cmp.get('v.workspaces');
                let workspaceToken = cmp.get('v.selectedWorkspace');
                let workspaceId = workspaces.filter(workspace => workspace.Token__c == workspaceToken)[0].Id;
                let workspaceChannelsIds = channelsFromSettings.filter(channel => channel.WorkspaceId__c == workspaceId).map(channel => channel.IdChannel__c);
                let selectedChannels = channelsFromSlack.filter(channel => workspaceChannelsIds.includes(channel.IdChannel__c));

                cmp.set('v.channelsSelectedIds', selectedChannels.map(channel => channel.IdChannel__c));
            })
            .catch((error) => {
                $CommonUtils.handleErrorInPromiseCatch(error);
            });
    },

    /**
     * @description: Performs a request to get all channels from Custom Settings
     * @param {Object} cmp: component object
     */
    getChannelsFromSettings: function (cmp) {
        return $CommonUtils.sendPromiseRequest(cmp, 'getSlackChannels', {})
            .then(response => {
                let channels = JSON.parse(response);

                channels.forEach((channel) => {
                    channel.label = channel.Name;
                    channel.value = channel.IdChannel__c;
                });
                cmp.set('v.channelsFromSettings', channels);
            })
            .catch((error) => {
                $CommonUtils.handleErrorInPromiseCatch(error);
            });
    },

    /**
     * @description: Saves the selected channels in Custom Settings
     */
    saveChannels: function (cmp, event, helper) {
        let channelsSelectedIds = cmp.get('v.channelsSelectedIds');
        let channelsFromSlack = cmp.get('v.channelsFromSlack');
        let selectedChannels = channelsFromSlack.filter((channel) => channelsSelectedIds.includes(channel.IdChannel__c));
        let workspaceToken = cmp.get('v.selectedWorkspace');
        let workspaces = cmp.get('v.workspaces');
        let workspaceId = workspaces.filter((workspace) => workspace.Token__c == workspaceToken)[0].Id;

        selectedChannels.forEach(channel => channel.WorkspaceId__c = workspaceId);

        selectedChannels = selectedChannels.map(channel => {
            return {
                Id: channel.Id,
                IdChannel__c: channel.IdChannel__c, Name: channel.Name, WorkspaceId__c: channel.WorkspaceId__c
            };
        });

        $CommonUtils.sendPromiseRequest(cmp, 'saveChannelsFromWorkspace', {
            selectedChannels,
            workspaceId
        })
            .then(response => {
                helper.backToList();
            })
            .catch((error) => {
                $CommonUtils.handleErrorInPromiseCatch(error);
            });
    },

    /**
     * @description: Navigates back to SlackChannels component
     */
    backToList: function () {
        $CommonUtils.navigateToComponent('SlackChannels');
    },

});