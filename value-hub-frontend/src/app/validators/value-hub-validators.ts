import { ValidationErrors, FormControl } from '@angular/forms';

export class ValueHubValidators {

    static notOnlyWhitespace(control : FormControl) : ValidationErrors{

        if((control.value != null) && control.value.trim().length === 0){
             return {'notOnlyWhitespace' : true};
        }
        return null;
        
    }
}
