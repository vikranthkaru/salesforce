public with sharing class RelatedListController {

    @AuraEnabled
    public static List<sObject> fetchRecords(string fields,string objectName,string filterCondition,string limitValue){
        try 
        {
            String query = 'SELECT Id, ' + fields + ' FROM ' + objectName;
            query = !string.isBlank(filterCondition) ? query + ' WHERE ' + filterCondition  : query;
            if(!string.isBlank(limitValue))
            {
                query += ' LIMIT ' + limitValue; 
            }
            List<sObject> listRecords = Database.query( query );
          
            return listRecords;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}