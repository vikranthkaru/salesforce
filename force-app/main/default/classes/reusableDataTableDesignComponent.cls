global class reusableDataTableDesignComponent extends VisualEditor.DynamicPickList {
    global override VisualEditor.DataRow getDefaultValue(){
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow('Account', 'Account');
        return defaultValue;
    }
    
    global override VisualEditor.DynamicPickListRows getValues() {
        VisualEditor.DynamicPickListRows  objValues = new VisualEditor.DynamicPickListRows();
        Map<string, Schema.SObjectType> sobj = Schema.getGlobalDescribe();
        for(schema.SObjectType thisobj : sobj.values()){
            Schema.DescribeSObjectResult objResult = thisobj.getDescribe();
            if(objResult.isQueryable()==true)
            {
                VisualEditor.DataRow value = new VisualEditor.DataRow(objResult.getName(), objResult.getName());
                objValues.addRow(value);
            }            
        }   
        return objValues;
    }
}