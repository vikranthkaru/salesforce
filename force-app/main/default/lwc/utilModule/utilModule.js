import { ShowToastEvent } from "lightning/platformShowToastEvent";

export function showToastMessage( title,message,variant ) {
    var evt;
    return evt = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
      });
}

export function handleErrors(errors) {
  if (!Array.isArray(errors)) {
    errors = [errors];
}

return (
    errors
        // Remove null/undefined items
        .filter((error) => !!error)
        // Extract an error message
        .map((error) => {
            // UI API read errors
            if (Array.isArray(error.body)) {
                return error.body.map((e) => e.message);
            }
            // Page level errors
            else if (
                error?.body?.pageErrors &&
                error.body.pageErrors.length > 0
            ) {
                return error.body.pageErrors.map((e) => e.message);
            }
            // Field level errors
            else if (
                error?.body?.fieldErrors &&
                Object.keys(error.body.fieldErrors).length > 0
            ) {
                const fieldErrors = [];
                Object.values(error.body.fieldErrors).forEach(
                    (errorArray) => {
                        fieldErrors.push(
                            ...errorArray.map((e) => e.message)
                        );
                    }
                );
                return fieldErrors;
            }
            // UI API DML page level errors
            else if (
                error?.body?.output?.errors &&
                error.body.output.errors.length > 0
            ) {
                return error.body.output.errors.map((e) => e.message);
            }
            // UI API DML field level errors
            else if (
                error?.body?.output?.fieldErrors &&
                Object.keys(error.body.output.fieldErrors).length > 0
            ) {
                const fieldErrors = [];
                Object.values(error.body.output.fieldErrors).forEach(
                    (errorArray) => {
                        fieldErrors.push(
                            ...errorArray.map((e) => e.message)
                        );
                    }
                );
                return fieldErrors;
            }
            // UI API DML, Apex and network errors
            else if (error.body && typeof error.body.message === 'string') {
                return error.body.message;
            }
            // JS errors
            else if (typeof error.message === 'string') {
                return error.message;
            }
            // Unknown error shape so try HTTP status text
            return error.statusText;
        })
        // Flatten
        .reduce((prev, curr) => prev.concat(curr), [])
        // Remove empty strings
        .filter((message) => !!message)
);
}