import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from 'src/app/VarGlobals';

import { SeguridadControlGuiaService } from '../../../services/seguridad-control-guia.service';

import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-seguridad-control-jabas',
  templateUrl: './seguridad-control-jabas.component.html',
  styleUrls: ['./seguridad-control-jabas.component.scss']
})
export class SeguridadControlJabasComponent implements OnInit {
  result: boolean = false;
  mostrar_sede_1: boolean = false;
  mostrar_sede_2: boolean = false;
  mostrar_sede_3: boolean = false;
  mostrar_sede_4: boolean = false;
  mostrar_sede_5: boolean = false;
  mostrar_sede_6: boolean = false;
 
  constructor(private seguridadControlGuiaService: SeguridadControlGuiaService) { }

  ngOnInit(): void { 
    // this.HabilitarNum_Planta_1(1)
    // // this.mostrar_sede_1 = this.result

    // this.HabilitarNum_Planta_2(2)
    // //this.mostrar_sede_2 = this.result

    // this.HabilitarNum_Planta_3(3)
    // //this.mostrar_sede_3 = this.result

    // this.HabilitarNum_Planta_4(4)
    // //this.mostrar_sede_4 = this.result

    // this.HabilitarNum_Planta_5(5)
    // //this.mostrar_sede_5 = this.result

    // this.HabilitarNum_Planta_6(6)
    // //this.mostrar_sede_6 = this.result
  }

  ActualizarPlanta(xNum_Planta: number){
    GlobalVariable.num_planta = xNum_Planta
  }

  HabilitarNum_Planta_1(xNum_Planta: number) {
    this.mostrar_sede_1 = false;
    this.seguridadControlGuiaService.HabilitarNum_Planta(xNum_Planta).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK'){

          this.mostrar_sede_1 = true;

        }
      },
      (err: HttpErrorResponse) => console.log(err.message) )
  }  

  HabilitarNum_Planta_2(xNum_Planta: number) {
    this.mostrar_sede_2 = false;
    this.seguridadControlGuiaService.HabilitarNum_Planta(xNum_Planta).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK'){

          this.mostrar_sede_2 = true;

        }
      },
      (err: HttpErrorResponse) => console.log(err.message) )
  }  

  HabilitarNum_Planta_3(xNum_Planta: number) {
    this.mostrar_sede_3 = false;
    this.seguridadControlGuiaService.HabilitarNum_Planta(xNum_Planta).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK'){

          this.mostrar_sede_3 = true;

        }
      },
      (err: HttpErrorResponse) => console.log(err.message) )
  }  
  
  HabilitarNum_Planta_4(xNum_Planta: number) {
    this.mostrar_sede_4 = false;
    this.seguridadControlGuiaService.HabilitarNum_Planta(xNum_Planta).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK'){

          this.mostrar_sede_4 = true;

        }
      },
      (err: HttpErrorResponse) => console.log(err.message) )
  }  
  
  HabilitarNum_Planta_5(xNum_Planta: number) {
    this.mostrar_sede_5 = false;
    this.seguridadControlGuiaService.HabilitarNum_Planta(xNum_Planta).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK'){

          this.mostrar_sede_5 = true;

        }
      },
      (err: HttpErrorResponse) => console.log(err.message) )
  }  
  
  HabilitarNum_Planta_6(xNum_Planta: number) {
    this.mostrar_sede_6 = false;
    this.seguridadControlGuiaService.HabilitarNum_Planta(xNum_Planta).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK'){

          this.mostrar_sede_6 = true;

        }
      },
      (err: HttpErrorResponse) => console.log(err.message) )
  }    
 
}
