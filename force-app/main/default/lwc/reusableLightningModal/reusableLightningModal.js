import { api } from 'lwc';
import LightningModal from 'lightning/modal';
export default class ReusableLightningModal extends LightningModal {
    @api componentName;
    childProps; ctx; label;

    handleOkay() {
        this.close('okay');
    }

    _runtimevalue;

    @api 
    get runtimevalue()
    {
        return this._runtimevalue;
    }
    set runtimevalue(val)
    {
        if(val != undefined)
        {
            const componentName = `c/${val.name}`;
            this.childProps = val.childProps;
            this.label = val.label;
            import(componentName).then(({default : ctx}) =>{
              this.ctx = ctx; 
            });
        }
    }

    renderedCallback() {
        // this.refs.myCmp will be available on the next rendering cycle after the constructor is set
        if (this.refs.myCmp) {
          // this.refs.myCmp will contain a reference to the DOM node
          console.log(this.refs.myCmp);
        }
    }
}