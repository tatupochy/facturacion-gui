import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    standalone: true,
    imports: [
        RouterLink
    ],
    selector: 'app-notfound',
    templateUrl: './notfound.component.html',
})
export class NotfoundComponent { }