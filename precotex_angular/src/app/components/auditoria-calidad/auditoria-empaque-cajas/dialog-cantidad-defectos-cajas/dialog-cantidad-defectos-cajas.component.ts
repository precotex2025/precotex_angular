import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface defecto {
  Cantidad: number;
}

@Component({
  selector: 'app-dialog-cantidad-defectos-cajas',
  templateUrl: './dialog-cantidad-defectos-cajas.component.html',
  styleUrls: ['./dialog-cantidad-defectos-cajas.component.scss']
})
export class DialogCantidadDefectosCajasComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: defecto) { }

  ngOnInit(): void {
   
  }


}
