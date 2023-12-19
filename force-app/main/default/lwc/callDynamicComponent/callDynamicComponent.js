import { LightningElement } from 'lwc';
import MyModal from 'c/reusableLightningModal';
export default class CallDynamicComponent extends LightningElement {
    columns = [{label:'Name', fieldName:'Name', sortable:true}, {label:'Phone',fieldName:'Phone'}, {label:'Account Source',fieldName:'AccountSource'}, {label:'Rating',fieldName:'Rating'},{type:'action',typeAttributes:{rowActions:[{label:'View',name:'view'},{label:'Edit',name:'edit'}]}}];
    async handleclick()
    {
        const childProps = {
            sObjName : 'Account',
            limitValue : 1000,
            recordPerPage : '3,5,15',
            columns : JSON.stringify(this.columns),
            isLightningPage : true
        }
        const runtimeload = {
            name:'reusableDataTable',
            label:'Data Table',
            childProps : childProps
        }
        const result = await MyModal.open({
            size: 'large',
            description: 'Accessible description of modal\'s purpose',
            runtimevalue: runtimeload
        });
        console.log(result);
    }
}