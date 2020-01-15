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
				Token__c = 'xoxp-012345678901-012345678901-012345678901-testexampleoftoken12345678901234');
		Workspace__c workspace2 = new Workspace__c(Name = 'my workspace 2',
				Token__c = 'xoxp-987654321098-012345678901-012345678901-anotherexampleoftoken45678901234');
		insert new Workspace__c[]{workspace1, workspace2};
	}


	@IsTest static void testGetWorkspaces() {

		LightningResult response = L_SlackWorkspacesListController.getWorkspaces();
		Workspace__c[] workspaces = (List<Workspace__c>)JSON.deserialize(response.data, List<Workspace__c>.class);

		System.assert(response.success);
		System.assertEquals(2, workspaces.size());
	}


	@IsTest static void testSaveWorkspace() {

		Workspace__c workspace3 = new Workspace__c(Name = 'my workspace 3',
				Token__c = 'xoxp-567890123456-012345678901-012345678901-thethirdtokenexample123456789012');
		LightningResult response = L_SlackWorkspacesListController.saveWorkspace(workspace3);
		Workspace__c[] workspaces = [SELECT Id FROM Workspace__c LIMIT 1000];
		System.assert(response.success);
		System.assertEquals(3, workspaces.size());
	}

	@IsTest static void testSaveInvalidWorkspace() {

		Workspace__c workspace3 = new Workspace__c(Name = 'my workspace 3',
				Token__c = '');

		Test.startTest();
		LightningResult response = L_SlackWorkspacesListController.saveWorkspace(workspace3);
		Test.stopTest();

		System.assert(!response.success);
	}

	@IsTest static void testSaveInvalidWorkspace2() {

		Workspace__c workspace3;
		Test.startTest();
		LightningResult response = L_SlackWorkspacesListController.saveWorkspace(workspace3);
		Test.stopTest();

		System.assert(!response.success);
	}

	@IsTest static void testDeleteWorkspace() {

		Workspace__c workspaceToDelete = [SELECT Id, Name, Token__c FROM Workspace__c LIMIT 1];

		Test.startTest();
		LightningResult response = L_SlackWorkspacesListController.deleteWorkspace(workspaceToDelete);
		Test.stopTest();

		Workspace__c[] workspaces = [SELECT Id FROM Workspace__c LIMIT 1000];
		System.assert(response.success);
		System.assertEquals(1, workspaces.size());
	}

	@IsTest static void testDeleteInvalidWorkspace() {

		Workspace__c workspaceToDelete = new Workspace__c(Name='Some name', Token__c='some token');
		Test.startTest();
		LightningResult response = L_SlackWorkspacesListController.deleteWorkspace(workspaceToDelete);
		Test.stopTest();

		System.assert(!response.success);
	}
}