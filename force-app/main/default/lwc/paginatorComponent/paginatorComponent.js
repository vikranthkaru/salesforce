import { LightningElement,api,track } from 'lwc';
const pageNumber = 1;
const showIt = 'visibility:visible';
const hideIt = 'visibility:hidden'; 
export default class PaginatorComponent extends LightningElement {
@api showPagination; 
    @api pageSizeOptions; 
    @api totalRecords; 
    @api records;  
    @track pageSize; 
    @track totalPages; 
    @track pageNumber = pageNumber; 
    @track controlPagination = showIt;
    @track controlPrevious = hideIt; 
    @track controlNext = showIt; 
    recordsToDisplay = [];
     connectedCallback() {
        if (this.pageSizeOptions && this.pageSizeOptions.length > 0)
            this.pageSize = this.pageSizeOptions[0];
        else {
            this.pageSize = this.totalRecords;
            this.showPagination = false;
        }
        this.controlPagination = this.showPagination === false ? hideIt : showIt;
        this.setRecordsToDisplay();
    }

    handleRecordsPerPage(event) {
        this.pageSize = event.target.value;
        this.setRecordsToDisplay();
    }
    handlePageNumberChange(event) {
        if (event.keyCode === 13) {
            this.pageNumber = event.target.value;
            this.setRecordsToDisplay();
        }
    }
    previousPage() {
        this.pageNumber = this.pageNumber - 1;
        this.setRecordsToDisplay();
    }
    nextPage() {
        this.pageNumber = this.pageNumber + 1;
        this.setRecordsToDisplay();
    }
    setRecordsToDisplay() {
        this.recordsToDisplay = [];
        if (!this.pageSize)
            this.pageSize = this.totalRecords;

        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

        this.setPaginationControls();

        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecords) break;
            this.recordsToDisplay.push(this.records[i]);
        }
        this.dispatchEvent(new CustomEvent('paginatorchange', { detail: this.recordsToDisplay })); //Send records to display on table to the parent component
    }
    setPaginationControls() {
        if (this.totalPages === 1) {
            this.controlPrevious = hideIt;
            this.controlNext = hideIt;
        } else if (this.totalPages > 1) {
            this.controlPrevious = showIt;
            this.controlNext = showIt;
        }
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
            this.controlPrevious = hideIt;
        } else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
            this.controlNext = hideIt;
        }
        if (this.controlPagination === hideIt) {
            this.controlPrevious = hideIt;
            this.controlNext = hideIt;
        }
        
    }
}