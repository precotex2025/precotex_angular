import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';


interface data {
  data:      string, 
}

@Component({
  selector: 'app-dialog-ver-auditoria-final',
  templateUrl: './dialog-ver-auditoria-final.component.html',
  styleUrls: ['./dialog-ver-auditoria-final.component.scss']
})
export class DialogVerAuditoriaFinalComponent implements OnInit {
  mostrarImagen = String;
  constructor(@Inject(MAT_DIALOG_DATA) public data: data) { 
    this.mostrarImagen = this.data.data["imagen"]; 
  }

  ngOnInit(): void {
  }

}
