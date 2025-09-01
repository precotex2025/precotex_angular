import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from 'src/app/VarGlobals';

@Component({
  selector: 'app-seleccionar-sede-accion',
  templateUrl: './seleccionar-sede-accion.component.html',
  styleUrls: ['./seleccionar-sede-accion.component.scss']
})
export class SeleccionarSedeAccionComponent implements OnInit {
  sede:string = '';
  constructor() { }

  ngOnInit(): void {
    if(GlobalVariable.num_planta == 1){
      this.sede = 'Santa Maria';
    } else if(GlobalVariable.num_planta == 2){
      this.sede = 'Santa Cecilia';
    } else if(GlobalVariable.num_planta == 3){
      this.sede = 'Huachipa Sede I';
    } else if(GlobalVariable.num_planta == 4){
      this.sede = 'Huachipa Sede II';
    } else if(GlobalVariable.num_planta == 5){
      this.sede = 'Independencia';
    } else if(GlobalVariable.num_planta == 14){
      this.sede = 'Independencia II';
    } else if(GlobalVariable.num_planta == 13){
      this.sede = 'Santa Rosa';
    } else if (GlobalVariable.num_planta == 15){
      this.sede = 'Faraday'
    } else if (GlobalVariable.num_planta == 17){
      this.sede = 'Huachipa Sede III'
    } else if(GlobalVariable.num_planta == 11){
      this.sede = 'VyD';
    }
  }

}
