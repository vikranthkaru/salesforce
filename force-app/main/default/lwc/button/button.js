import { LightningElement,api } from 'lwc';

export default class Button extends LightningElement {
    @api label;
    @api variant;

    handleClick()
    {
        this.dispatchEvent(new CustomEvent('click'));
    }
}