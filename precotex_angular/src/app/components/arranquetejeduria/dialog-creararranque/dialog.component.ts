import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  template: `
    <h1 mat-dialog-title>{{data.title}}</h1>
    <div mat-dialog-content>
      {{data.message}}
    </div>
    <div mat-dialog-actions>
      
    </div>
  `,
})
export class DialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string, message: string }) {}
}


// <button mat-button mat-dialog-close>Cerrar</button>