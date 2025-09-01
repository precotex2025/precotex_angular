import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';


interface data {
  data:      string, 
}

@Component({
  selector: 'app-dialog-ver-imagen-inspeccion',
  templateUrl: './dialog-ver-imagen-inspeccion.component.html',
  styleUrls: ['./dialog-ver-imagen-inspeccion.component.scss']
})
export class DialogVerImagenInspeccionComponent implements OnInit {
  mostrarImagen = String;
  constructor(@Inject(MAT_DIALOG_DATA) public data: data) {

    console.log("data de dialog ver: ",this.data);
    this.mostrarImagen = this.data.data["imagen"];
    console.log("this.mostrarImagen;", this.mostrarImagen );
  }

  ngOnInit(): void {
  }

}
