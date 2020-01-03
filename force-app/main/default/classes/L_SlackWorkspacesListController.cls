/*
 * Class: L_SlackWorkspacesListController
 * Test Class: L_SlackWorkspacesListControllerTest
 * @date: 30.08.19
 * @description: Controller class for SlackWorkspacesList Lightning component
 */
public class L_SlackWorkspacesListController {

	/*
	 * @date: 02.09.19
	 * @description: Gets workspaces from Custom Settings
	 * @test: L_SlackWorkspacesListControllerTest.testGetWorkspaces()
	 */
	@AuraEnabled
	public static Workspace__c[] getWorkspaces() {

		return Util_SlackSettingsData.getWorkspacesFromSettings();
	}

	/*
	 * @date: 02.09.19
	 * @description: Inserts or updates a workspace record
	 * @param: workspace - the workspace record to save
	 * @test: L_SlackWorkspacesListControllerTest.testSaveWorkspace()
	 */
	@AuraEnabled
	public static void saveWorkspace(Workspace__c workspace) {

		Util_SlackSettingsData.saveWorkspace(workspace);
	}

	/*
	 * @date: 02.09.19
	 * @description: Deletes workspace record and all its channels from Custom Settings
	 * @param: workspace - the workspace record to delete
	 * @test: L_SlackWorkspacesListControllerTest.testDeleteWorkspace()
	 */
	@AuraEnabled
	public static void deleteWorkspace(Workspace__c workspace) {

		Util_SlackSettingsData.deleteWorkspace(workspace);
	}
}