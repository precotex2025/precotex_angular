import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from 'src/app/VarGlobals';

@Component({
  selector: 'app-seguridad-control-movimientos-jabas-accion',
  templateUrl: './seguridad-control-movimientos-jabas-accion.component.html',
  styleUrls: ['./seguridad-control-movimientos-jabas-accion.component.scss']
})
export class SeguridadControlMovimientosJabasAccionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  SetAccion(Accion: string){
    console.log(Accion)
    GlobalVariable.Accion = Accion
  }
}
