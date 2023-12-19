public class GetRecordCounts {
    @AuraEnabled(cacheable=true)
    public static object fetchRecordCount() {
        String baseUrl = URL.getOrgDomainUrl().toExternalForm();
        String endpoint = '/services/data/v58.0/limits/recordCount';
        
        String url = baseUrl + endpoint;
        
        HttpRequest request = new HttpRequest();
        request.setEndpoint(url);
        request.setMethod('GET');
        
        // Set the necessary headers if required (e.g., authorization headers)
		request.setHeader('Authorization', 'Bearer ' + Utils.getSessionIdFromVFPage(Page.SessionId));
        HttpResponse response = new Http().send(request);
        
        if (response.getStatusCode() == 200) {
            System.debug('Response: ' + response.getBody());
            return response.getBody();
        } else {
            // Handle errors or other statuses
            System.debug('Error: ' + response.getStatusCode() + ' ' + response.getStatus());
            return null;
        }
    }
}