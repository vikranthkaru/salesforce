@RestResource(urlMapping='/api/menuItem/*')
global class reactNativeMenuScreenAPIController {
    
    @HttpGet
    global static list<WrapperData> doGet() {
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        list<WrapperData> result = new list<WrapperData>();
        for(Folder__c folder : [select id,name,contact__c from Folder__c where contact__c =: '0035i00000PH4g2AAD'])
        {
            WrapperData wd = new WrapperData();
            wd.wName = folder.name;
            wd.wId = folder.id;
            wd.wType = 'Folder';
            result.add(wd);
        }
        map<id,Document__c> mDocument = new map<Id,Document__c>();
        for(Document__c document : [select id,name,contact__c from Document__c where contact__c =: '0035i00000PH4g2AAD'])
        {
            mDocument.put(document.id,document);
        }
        map<id,id> mCD = new map<Id,id>();
        for(ContentDocumentLink cdl : [SELECT LinkedEntityId, ContentDocument.LatestPublishedVersionId
                                       FROM ContentDocumentLink  where LinkedEntityId IN: mDocument.keySet()])
        {
            mCD.put(cdl.ContentDocument.LatestPublishedVersionId,cdl.LinkedEntityId);
        }
        for(ContentVersion  cv : [select id,versionData from ContentVersion where id IN: mCD.keySet()])
        {
            if(mDocument.containskey(mCD.get(cv.id))){
                Blob versionDataBlob = cv.VersionData;
                String versionDataString = EncodingUtil.base64Encode(versionDataBlob);
                WrapperData wd = new WrapperData();
                wd.wName = mDocument.get(mCD.get(cv.id)).name;
                wd.wId = mDocument.get(mCD.get(cv.id)).id;
                wd.wType = 'Document';
                wd.wUrl = versionDataString;
                result.add(wd);
                
            }
        }
        system.debug('result-->'+result.size());
        return result;
    }
    
    global class WrapperData {
        global string wName;
        global string wId;
        global string wType;
        global string wUrl;
        
    }
}