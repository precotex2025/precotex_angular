import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from 'src/app/VarGlobals';

@Component({
  selector: 'app-seguridad-control-guia-accion',
  templateUrl: './seguridad-control-guia-accion.component.html',
  styleUrls: ['./seguridad-control-guia-accion.component.scss']
})
export class SeguridadControlGuiaAccionComponent implements OnInit {

  Num_Planta = GlobalVariable.num_planta
  
  constructor() {
  }

  ngOnInit(): void {
  }
 

}
 