import { LightningElement,api,track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
// import { showToastMessage } from "c/showToastUtils";
import jsFetchDataFromController from '@salesforce/apex/ReusableDataTableController.fetchRecords';
export default class ReusableDataTable extends NavigationMixin(LightningElement) {

    @api sObjName;@api filterCriteria;@api records;  @api recordId;
    @api limitValue = 1000; @api recordPerPage="5,25,50,100"; @api columns; 

    @api showCheckBox; @api showRowNumber;
    @api useDefaultRecordId;
    pageSizeOptions = [];

    @track visibleData = null;
    @track recordsToDisplay = [];
    @track rowNumberOffset; 
    _records;
    sortedBy; defaultSortDirection = 'asc'; sortDirection = 'asc';
    _isLightningPage;

    @api 
    get isLightningPage()
    {
        return this._isLightningPage;
    }

    set isLightningPage(value)
    {
        if(value === false)
        {
            
            if(this.records != undefined)
            {
                this.pageSizeOptions = this.recordPerPage.split(",");
                this.func_processRecords(this.records);
            }
        }
        else
        {
            this.pageSizeOptions = this.recordPerPage.split(",");
            this.func_fetchDataFromController();
        }
    }

    func_fetchDataFromController()
    {

        jsFetchDataFromController({sObjectName:this.sObjName,filterCriteria:this.filterCriteria,recordId:this.recordId,limitValue:this.limitValue})
        .then(result=>{
            this.func_processRecords(result);
        })
        .catch(error=>{
           // let evt = showToastMessage("Error", "Oops looks like not able to fetch records, please contact admin team", error);
           // this.dispatchEvent(evt);
        });
    }

    func_processRecords(value)
    {
        this._records = value.map((assign) => {
            return {
                ...assign,
                recordURL: '/lightning/r/' + assign.Id + '/view'
            };
        });
        this.columns = JSON.parse( this.columns.replace( /([a-zA-Z0-9]+?):/g, '"$1":' ).replace( /'/g, '"' ) );
    }

    func_handlePaginatorChange(event) {
        this.recordsToDisplay = event.detail;
    }

    func_onHandleSort(event) {
         
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.recordsToDisplay];
        cloneData.sort( this.func_sortBy( sortedBy, sortDirection === 'asc' ? 1 : -1 ) );
        this.recordsToDisplay = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }

    func_sortBy( field, reverse, primer ) {
        const key = primer
            ? function( x ) {
                  return primer(x[field]);
              }
            : function( x ) {
                  return x[field];
              };
 
        return function( a, b ) {
            a = key(a);
            b = key(b);
            return reverse * ( ( a > b ) - ( b > a ) );
        };
    }

    func_handleRowAction( event ) {
 
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch ( actionName ) {
            case 'view':
                this[NavigationMixin.GenerateUrl]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        actionName: 'view',
                    },
                }).then(url => {
                     window.open(url);
                });
                break;
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: this.RelatedObject,
                        actionName: 'edit'
                    }
                });
                break;
            default:
        }
 
    }
}