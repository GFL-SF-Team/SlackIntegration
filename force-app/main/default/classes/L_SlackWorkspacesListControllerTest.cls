/*
 * Class: L_SlackWorkspacesListControllerTest
 * @date: 02.09.19
 * @description: Test class for L_SlackWorkspacesListController
 */
@IsTest
private class L_SlackWorkspacesListControllerTest {

	@TestSetup
	static void insertCustomSettings() {

		Workspace__c workspace1 = new Workspace__c(Name = 'my workspace 1',
				Token__c = 'xoxp-705140850724-707466024983-694209657490-a9f2e6c503f81df23a699ebf46b73492');
		Workspace__c workspace2 = new Workspace__c(Name = 'my workspace 2',
				Token__c = 'xoxp-712336800246-698776935266-703931230881-26615b907970cc43db3dbefeaf5c1891');
		insert new Workspace__c[]{workspace1, workspace2};
	}


	@IsTest static void testGetWorkspaces() {

		String jsonResult = L_SlackWorkspacesListController.getWorkspaces().data;
		Workspace__c[] workspaces = (List<Workspace__c>)JSON.deserialize(jsonResult, List<Workspace__c>.class);
		System.assertEquals(2, workspaces.size());
	}


	@IsTest static void testSaveWorkspace() {

		Workspace__c workspace3 = new Workspace__c(Name = 'my workspace 3',
				Token__c = 'xoxp-334655462536-675435434466-703931230881-26615b907970cc43db3dbefeaf5c1891');
		L_SlackWorkspacesListController.saveWorkspace(workspace3);
		Workspace__c[] workspaces = [SELECT Id FROM Workspace__c LIMIT 1000];
		System.assertEquals(3, workspaces.size());
	}


	@IsTest static void testDeleteWorkspace() {

		Workspace__c workspaceToDelete = [SELECT Id, Name, Token__c FROM Workspace__c LIMIT 1];
		L_SlackWorkspacesListController.deleteWorkspace(workspaceToDelete);
		Workspace__c[] workspaces = [SELECT Id FROM Workspace__c LIMIT 1000];
		System.assertEquals(1, workspaces.size());
	}
}