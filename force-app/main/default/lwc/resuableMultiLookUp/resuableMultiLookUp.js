import { LightningElement, api, track } from 'lwc';
import search from '@salesforce/apex/ReusableMultiLookUpController.search';

export default class ReusableMultiSelectLookup extends LightningElement {
    @api objectname = 'Account';
    @api fieldnames = 'Id, Name ';
    @api searchValue;
    @api Label;
    @track searchRecords = [];
    @track selectedRecords = [];
    @api iconName = 'standard:account'
    @track messageFlag = false;
    @track isSearchLoading = false;
    @api placeholder = 'Search..';
    @track searchKey;
    delayTimeout;

    searchField() {   
        var selectedRecordIds = [];
        this.selectedRecords.forEach(ele=>{
            selectedRecordIds.push(ele.Id);
        });
        let sQuery = 'Select ' + this.fieldnames + ' from ' + this.objectname;
        let sFilter = (this.searchKey != undefined) ? 
        (this.selectedRecords.length > 0)  ? ' WHERE ' + this.searchValue + ' LIKE \'%' + this.searchKey.trim() + '%\''  + ' AND Id NOT IN: selectedRecords': ' WHERE ' + this.searchValue + ' LIKE \'%' + this.searchKey.trim() + '%\''  : 
        (this.selectedRecords.length > 0) ? ' WHERE Id NOT IN:selectedRecords ORDER BY LastViewedDate DESC LIMIT 5'
        : ' ORDER BY LastViewedDate DESC LIMIT 5';
        sQuery = sQuery + sFilter;
        search({ sQuery:sQuery, selectedRecords : selectedRecordIds })
            .then(result => {
                this.searchRecords = result;
                this.isSearchLoading = false;
                const lookupInputContainer = this.template.querySelector('.lookupInputContainer');
                const clsList = lookupInputContainer.classList;
                clsList.add('slds-is-open');

                if (this.searchKey.length > 0 && result.length == 0) {
                    this.messageFlag = true;
                } else {
                    this.messageFlag = false;
                }
            }).catch(error => {
                console.log(error);
            });
    }

    // update searchKey property on input field change  
    handleKeyChange(event) {
        console.log('handleKeyChange--?>'+event.target.value);
        // Do not update the reactive property as long as this function is
        this.isSearchLoading = true;
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
            this.searchField();
        }, 300);
    }

    // method to toggle lookup result section on UI 
    toggleResult(event) {
        const lookupInputContainer = this.template.querySelector('.lookupInputContainer');
        const clsList = lookupInputContainer.classList;
        const whichEvent = event.target.getAttribute('data-source');

        switch (whichEvent) {
            case 'searchInputField':
                clsList.add('slds-is-open');
                this.searchField();
                break;
            case 'lookupContainer':
                clsList.remove('slds-is-open');
                break;
        }
    }

    setSelectedRecord(event) {
        var recId = event.target.dataset.id;
        var selectName = event.currentTarget.dataset.name;
        let newsObject = this.searchRecords.find(data => data.Id === recId);
        this.selectedRecords.push(newsObject);
        this.template.querySelector('.lookupInputContainer').classList.remove('slds-is-open');
        let selRecords = this.selectedRecords;
        this.template.querySelectorAll('lightning-input').forEach(each => {
            each.value = '';
        });

        console.log(this.selectedRecords);
        const selectedEvent = new CustomEvent('selected', { detail: { selRecords }, });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }

    removeRecord(event) {
        let selectRecId = [];
        for (let i = 0; i < this.selectedRecords.length; i++) {
            console.log('event.detail.name--------->' + event.detail.name);
            console.log('this.selectedRecords[i].Id--------->' + this.selectedRecords[i].Id);
            if (event.detail.name !== this.selectedRecords[i].Id)
                selectRecId.push(this.selectedRecords[i]);
        }

        this.selectedRecords = [...selectRecId];
        console.log('this.selectedRecords----------->' + this.selectedRecords);
        let selRecords = this.selectedRecords;
        const selectedEvent = new CustomEvent('selected', { detail: { selRecords }, });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }
}