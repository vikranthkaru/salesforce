import { ShowToastEvent } from "lightning/platformShowToastEvent";

export function showToastMessage( title,message,variant ) {
    var evt;
    return evt = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
      });
}