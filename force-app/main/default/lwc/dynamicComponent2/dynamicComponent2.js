import { LightningElement } from 'lwc';
export default class DynamicComponent2 extends LightningElement {
    componentConstructor;

    connectedCallback()
    {
        import("c/dynamicComponent")
        .then(({default:ctx}) => (this.componentConstructor = ctx))
        .catch((err)=> console.log("Error importing component"));
    }
}