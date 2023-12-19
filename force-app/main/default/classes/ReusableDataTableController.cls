public class ReusableDataTableController {
    @AuraEnabled
    public static list<sObject> fetchRecords(string sObjectName, string filterCriteria,string recordId,integer limitValue)
    {
        try
        {
            string sQuery = createDynamicQuery(sObjectName);
            if(!string.isBlank(filterCriteria))
            {
                sQuery += ' ' + filterCriteria;
            }
            if(limitValue != null) 
            sQuery += ' LIMIT '+limitValue;
            return DataBase.Query(sQuery);
        }
        catch(Exception e)
        {
            throw new AuraHandledException(LightningErrorFrameWork.handleErrorMessage(e.getMessage()));
        }
    }

    public static string createDynamicQuery(string sObjectName)
    {
        List<String> fieldNames = new List<String>();
        Schema.SObjectType objType = Schema.getGlobalDescribe().get(sObjectName);
        Schema.DescribeSObjectResult objDescribe = objType.getDescribe();
        Map<String, Schema.SObjectField> fieldMap = objDescribe.fields.getMap();
        fieldNames.addAll(fieldMap.keySet());
        return 'Select ' + String.join(fieldNames, ',')+ ' from '+ sObjectName;
    }
}