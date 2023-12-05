import { LightningElement,api,wire } from 'lwc';
import fetchData from '@salesforce/apex/RelatedListController.fetchRecords';
import { NavigationMixin } from 'lightning/navigation';
export default class RelatedList extends LightningElement {
    @api recordId;
    @api LabelName;
    @api Fields;
    @api Object; 
    @api Filter
    showData;
    @wire(fetchData, {fields: '$Fields', objectName: '$Object', filterCondition: '$Filter'})
    wiredData ({error,data})
    {
        if(data)
        {
            
        }
        else if(error)
        {

        }
    }

    connectedCallback()
    {

    }
}