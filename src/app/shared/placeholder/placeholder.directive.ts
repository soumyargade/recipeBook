import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appPlaceholder]'
})
export class PlaceholderDirective {

    // Gives access to a pointer at the place where this directive is used
    constructor(public viewContainerRef: ViewContainerRef) { }
}