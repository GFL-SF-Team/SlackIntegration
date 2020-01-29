/*
 * Class: Util_SlackSettingsData
 * Test Class: L_SlackChannelsControllerTest, L_SlackWorkspacesListControllerTest
 * @date: 30.08.19
 * @description: Helper data class for L_SlackChannelsController and L_SlackWorkspacesListController classes
 */
public class Util_SlackSettingsData {

	/*
	 * @date: 02.09.19
	 * @description: Retrieves all workspaces from Custom Settings
	 * @test: L_SlackWorkspacesListControllerTest.testGetWorkspaces()
	 */
	public static Workspace__c [] getWorkspacesFromSettings() {

		return [SELECT Id, Name, Token__c FROM Workspace__c LIMIT 1000];
	}

	/*
	 * @date: 02.09.19
	 * @description: inserts or updates a workspace
	 * @param: wokspace - a workspace to save
	 * @test: L_SlackWorkspacesListControllerTest.testSaveWorkspace()
	 */
	public static void saveWorkspace(Workspace__c workspace) {

		if(workspace.Name == '') {
			throw new ShowMessageException('Name is empty!');
		}

		if(workspace.Token__c == '') {
			throw new ShowMessageException('Token is empty!');
		}

		if (Schema.SObjectType.Workspace__c.fields.Name.isCreateable() && Schema.SObjectType.Workspace__c.fields.Name.isUpdateable() &&
		 	Schema.SObjectType.Workspace__c.fields.Token__c.isCreateable() && Schema.SObjectType.Workspace__c.fields.Token__c.isUpdateable()){
			upsert workspace;
		}else{
			throw new ShowMessageException('You are not allowed to change a workspace');
		}

	}

	/*
	 * @date: 02.09.19
	 * @description: deletes a workspace
	 * @param: wokspace - a workspace to delete
	 * @test: L_SlackWorkspacesListControllerTest.testDeleteWorspace()
	 */
	public static void deleteWorkspace(Workspace__c workspace) {

		SlackChannel__c[] channelsFromWorkspace =
		Util_SlackSettingsData.getWorkspaceChannelsFromSettings(workspace.Id);

		if (Schema.SObjectType.Workspace__c.isDeletable() && Schema.SObjectType.SlackChannel__c.isDeletable()){
			delete channelsFromWorkspace;
			delete workspace;
		} else{
			throw new ShowMessageException('You are not allowed to delete a workspace');
		}

	}

	/*
	 * @date: 02.09.19
	 * @description: Gets slack channels associated with a given workspace
	 * @param: workspaceId - an Id of a workspace record from Custom Settings
	 * @test: L_SlackWorkspaceListControllerTest.testDeleteWorkspace()
	 */
	private static SlackChannel__c [] getWorkspaceChannelsFromSettings(String workspaceId) {
		
		String queryString = 'SELECT Id, Name, NameChannel__c, IdChannel__c, WorkspaceId__c FROM SlackChannel__c';

		if(workspaceId != '') {
			queryString += ' WHERE WorkspaceId__c=\'' + String.escapeSingleQuotes(workspaceId) + '\'';
		}
		queryString += ' LIMIT 1000';
		SlackChannel__c[] result = new SlackChannel__c [] {};

		result = Database.query(queryString);

		return result;
	}

	/*
	 * @date: 02.09.19
	 * @description: Gets slack channels from all workspaces
	 * @param: workspaceId - an Id of a workspace record from Custom Settings
	 * @test: L_SlackChannelsControllerTest.testGetSlackChannels()
	 */
	public static SlackChannel__c [] getChannelsFromSettings() {

		return getWorkspaceChannelsFromSettings('');
	}

	/*
	 * @date: 02.09.19
	 * @description: Retains only selectedChannels Custom Settings records associated with a current workspace
	 * @param: selectedChannels - a list of channels selected for a current workspace
	 * @param: workspaceId - an Id of a workspace record from Custom Settings
	 * @test: L_SlackChannelsControllerTest.testSaveChannelsFromWorkspace()
	 */
	public static void saveChannelsFromWorkspace(SlackChannel__c [] selectedChannels, String workspaceId) {

		SlackChannel__c[] workspaceChannelsFromSettings =
		Util_SlackSettingsData.getWorkspaceChannelsFromSettings(workspaceId);

		for (SlackChannel__c channel :selectedChannels) {
			channel.Name = channel.IdChannel__c;
			channel.WorkspaceId__c = workspaceId;
		}   

		if (Schema.SObjectType.SlackChannel__c.isDeletable()&&Schema.SObjectType.SlackChannel__c.isCreateable()){
			delete workspaceChannelsFromSettings;
			insert selectedChannels;
		} else{
			throw new ShowMessageException('You are not allowed to change channels');
		}

	}

	/*
	 * @date: 02.09.19
	 * @description: Deletes a specified channel from Custom Settings records
	 * @param: channel - a channel to delete
	 * @test: L_SlackChannelsControllerTest.testDeleteChannel()
	 */
	public static void deleteChannel(SlackChannel__c channel) {

		if (Schema.SObjectType.SlackChannel__c.isDeletable()){
			delete channel;
		} else{
			throw new ShowMessageException('You are not allowed to delete a channel');
		}

	}


}