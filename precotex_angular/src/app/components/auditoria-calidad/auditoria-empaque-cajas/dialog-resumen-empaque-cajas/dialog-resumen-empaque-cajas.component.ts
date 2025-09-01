import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface resumen {
  Can_Cajas: number;
  Num_Prendas: number;
  Can_Cajas_Def: number;
  Can_Defectos: number;
}

@Component({
  selector: 'app-dialog-resumen-empaque-cajas',
  templateUrl: './dialog-resumen-empaque-cajas.component.html',
  styleUrls: ['./dialog-resumen-empaque-cajas.component.scss']
})
export class DialogResumenEmpaqueCajasComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: resumen) { }

  ngOnInit(): void {
  }

}
