public class ReusableDataTableController {
    @AuraEnabled
    public static list<sObject> fetchRecords(string sObjectName,string sObjectFields, string filterCriteria,string recordId,integer limitValue,integer offsetValue)
    {
        try
        {
            string sQuery = sObjectFields;
            if(!string.isBlank(filterCriteria))
            {
                sQuery += ' ' + filterCriteria;
            }
            sQuery += ' LIMIT '+limitValue + ' OFFSET ' + offsetValue;
            return DataBase.Query(sQuery);
        }
        catch(Exception e)
        {
            throw new AuraHandledException(LightningErrorFrameWork.handleErrorMessage(e.getMessage()));
        }
    }
}