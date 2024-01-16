public with sharing class ReusableMultiLookUpController {
    @AuraEnabled
    public static List<sObject> search(String sQuery, list<String> selectedRecords){
        try 
        {
            return Database.Query(sQuery);
        } 
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}