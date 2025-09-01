import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from '../../../VarGlobals';

import { SeguridadControlVehiculoService } from '../../../services/seguridad-control-vehiculo.service';

import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-seguridad-control-vehiculo',
  templateUrl: './seguridad-control-vehiculo.component.html',
  styleUrls: ['./seguridad-control-vehiculo.component.scss']
})
export class SeguridadControlVehiculoComponent implements OnInit {

  result: boolean = false;
  mostrar_sede_1: boolean = false; 
  mostrar_sede_2: boolean = false;
  mostrar_sede_3: boolean = false;
  mostrar_sede_4: boolean = false;
  mostrar_sede_5: boolean = false;
  mostrar_sede_6: boolean = false;

  constructor(private seguridadControlVehicularService: SeguridadControlVehiculoService) { }

  ngOnInit(): void { 
  } 
 
  ActualizarPlanta(xNum_Planta: number){
    GlobalVariable.num_planta = xNum_Planta
  }

  HabilitarNum_Planta_1(xNum_Planta: number) {
    this.mostrar_sede_1 = false;
    this.seguridadControlVehicularService.HabilitarNum_Planta(xNum_Planta).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK'){

          this.mostrar_sede_1 = true;

        }
      },
      (err: HttpErrorResponse) => console.log(err.message) )
  }  

  HabilitarNum_Planta_2(xNum_Planta: number) {
    this.mostrar_sede_2 = false;
    this.seguridadControlVehicularService.HabilitarNum_Planta(xNum_Planta).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK'){

          this.mostrar_sede_2 = true;

        }
      },
      (err: HttpErrorResponse) => console.log(err.message) )
  }  

  HabilitarNum_Planta_3(xNum_Planta: number) {
    this.mostrar_sede_3 = false;
    this.seguridadControlVehicularService.HabilitarNum_Planta(xNum_Planta).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK'){

          this.mostrar_sede_3 = true;

        }
      },
      (err: HttpErrorResponse) => console.log(err.message) )
  }  
  
  HabilitarNum_Planta_4(xNum_Planta: number) {
    this.mostrar_sede_4 = false;
    this.seguridadControlVehicularService.HabilitarNum_Planta(xNum_Planta).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK'){

          this.mostrar_sede_4 = true;

        }
      },
      (err: HttpErrorResponse) => console.log(err.message) )
  }  
  
  HabilitarNum_Planta_5(xNum_Planta: number) {
    this.mostrar_sede_5 = false;
    this.seguridadControlVehicularService.HabilitarNum_Planta(xNum_Planta).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK'){

          this.mostrar_sede_5 = true;

        }
      },
      (err: HttpErrorResponse) => console.log(err.message) )
  }  
  
  HabilitarNum_Planta_6(xNum_Planta: number) {
    this.mostrar_sede_6 = false;
    this.seguridadControlVehicularService.HabilitarNum_Planta(xNum_Planta).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK'){

          this.mostrar_sede_6 = true;

        }
      },
      (err: HttpErrorResponse) => console.log(err.message) )
  }    


}
 