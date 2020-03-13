/*
 * Class: L_SlackWorkspacesListController
 * Test Class: L_SlackWorkspacesListControllerTest
 * @date: 30.08.19
 * @description: Controller class for SlackWorkspacesList Lightning component
 */
global with sharing class L_SlackWorkspacesListController {

	public static final LightningResult RESPONSE = new LightningResult();

	/*
	 * @date: 02.09.19
	 * @description: Gets workspaces from Custom Settings
	 * @test: L_SlackWorkspacesListControllerTest.testGetWorkspaces()
	 */
	@AuraEnabled
	global static LightningResult getWorkspaces() {

		Workspace__c[] workspacesList;

		try{
			workspacesList = Util_SlackSettingsData.getWorkspacesFromSettings();
			RESPONSE.setResult(JSON.serialize(workspacesList));

		} catch(Exception e) {
			RESPONSE.setError(e.getMessage());
		}

		return RESPONSE;
	}

	/*
	 * @date: 02.09.19
	 * @description: Inserts or updates a workspace record
	 * @param: workspace - the workspace record to save
	 * @test: L_SlackWorkspacesListControllerTest.testSaveWorkspace()
	 */
	@AuraEnabled
	global static LightningResult saveWorkspace(String workspace) {

		try{
			Workspace__c workspaceParsed = (Workspace__c)JSON.deserialize(workspace, Workspace__c.class);
			Util_SlackSettingsData.saveWorkspace(workspaceParsed);
			RESPONSE.setResult(JSON.serialize(''));
			
		}catch (ShowMessageException e){
			RESPONSE.setErrorWithShowing(e.getMessage());
			
		} catch(Exception e) {
			RESPONSE.setError(e.getMessage());
		}

		return RESPONSE;
	}

	/*
	 * @date: 02.09.19
	 * @description: Deletes workspace record and all its channels from Custom Settings
	 * @param: workspace - the workspace record to delete
	 * @test: L_SlackWorkspacesListControllerTest.testDeleteWorkspace()
	 */
	@AuraEnabled
	global static LightningResult deleteWorkspace(String workspace) {

		try{
			Workspace__c workspaceParsed = (Workspace__c)JSON.deserialize(workspace, Workspace__c.class);
			Util_SlackSettingsData.deleteWorkspace(workspaceParsed);
			RESPONSE.setResult(JSON.serialize(''));
			
		}catch (ShowMessageException e){
			RESPONSE.setErrorWithShowing(e.getMessage());
			
		} catch(Exception e) {
			RESPONSE.setError(e.getMessage());
		}

		return RESPONSE;
	}
}