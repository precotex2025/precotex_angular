import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';
import { SeguridadVisitasService } from 'src/app/services/seguridad-visitas.service';

@Component({
  selector: 'app-consulta-visita',
  templateUrl: './consulta-visita.component.html',
  styleUrls: ['./consulta-visita.component.scss']
})
export class ConsultaVisitaComponent implements OnInit {

  Tipo_Documento: any = 'DNI';
  Nro_DNI = '';
  Id = '';
  Nombres_Visita: any = '';
  Cod_Empresa: any = '';
  Rh_Cod_Area: any = '';
  Persona_Visitada: any = '';
  Motivo_Visita: any = '';
  Observaciones: any = '';
  Empresa: any = '';
  sede: string = '';
  Area_Visitada: string = '';
  Hora_Ingreso: string = '';
  Hora_Salida: string = '';
  Fec_Registro: string = '';
  Horas_Planta: string = '';

  dataAreas: Array<any> = [];
  dataPersonas: Array<any> = [];


  constructor(private seguridadVisitasService: SeguridadVisitasService, private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    if (GlobalVariable.num_planta == 1) {
      this.sede = 'Santa Maria';
    } else if (GlobalVariable.num_planta == 2) {
      this.sede = 'Santa Cecilia';
    } else if (GlobalVariable.num_planta == 3) {
      this.sede = 'Huachipa Sede I';
    } else if (GlobalVariable.num_planta == 4) {
      this.sede = 'Huachipa Sede II';
    } else if (GlobalVariable.num_planta == 5) {
      this.sede = 'Independencia';
    } else if (GlobalVariable.num_planta == 14) {
      this.sede = 'Independencia II';
    } else if (GlobalVariable.num_planta == 13) {
      this.sede = 'Santa Rosa';
    } else if (GlobalVariable.num_planta == 15) {
      this.sede = 'Faraday'
    } else if (GlobalVariable.num_planta == 17) {
      this.sede = 'Huachipa Sede III'
    } else if (GlobalVariable.num_planta == 11) {
      this.sede = 'VyD';
    }

  }


  guardarVisita() {
    if (GlobalVariable.num_planta > 0) {

      this.SpinnerService.show();
      this.seguridadVisitasService.SEG_CREAR_VISITA_PLANTA(
        'S',
        this.Id,
        this.Cod_Empresa,
        GlobalVariable.num_planta,
        this.Tipo_Documento,
        this.Nro_DNI,
        this.Nombres_Visita,
        this.Empresa,
        '01/01/1990',
        '01/01/1990',
        '',
        this.Rh_Cod_Area,
        this.Area_Visitada,
        this.Motivo_Visita,
        this.Persona_Visitada,
        this.Observaciones,
        '01/01/1990',
        GlobalVariable.vusu
      ).subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res[0].Respuesta == 'OK') {
          this.matSnackBar.open('Se actualizo la hora de salida correctamente.', 'Cerrar', {
            duration: 2500,
          });
          this.changeDni();
        } else {
          this.matSnackBar.open('Ha ocurrido un error al guardar la hora de salida.', 'Cerrar', {
            duration: 2500,
          });
        }
      }, (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        });
      });
    } else {
      this.matSnackBar.open('NO HAS SELECCIONADO LA PLANTA', 'Cerrar', {
        duration: 2500,
      })
    }

  }

  guardarVisitaIngreso() {
    if (GlobalVariable.num_planta > 0) {

      this.SpinnerService.show();
      this.seguridadVisitasService.SEG_CREAR_VISITA_PLANTA(
        'R',
        this.Id,
        this.Cod_Empresa,
        GlobalVariable.num_planta,
        this.Tipo_Documento,
        this.Nro_DNI,
        this.Nombres_Visita,
        this.Empresa,
        '01/01/1990',
        '01/01/1990',
        '',
        this.Rh_Cod_Area,
        this.Area_Visitada,
        this.Motivo_Visita,
        this.Persona_Visitada,
        this.Observaciones,
        '01/01/1990',
        GlobalVariable.vusu
      ).subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res[0].Respuesta == 'OK') {
          this.matSnackBar.open('Se actualizo la hora de ingreso correctamente.', 'Cerrar', {
            duration: 2500,
          });
          this.changeDni();
        } else {
          this.matSnackBar.open('Ha ocurrido un error al guardar la hora de ingreso.', 'Cerrar', {
            duration: 2500,
          });
        }
      }, (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        });
      });
    } else {
      this.matSnackBar.open('NO HAS SELECCIONADO LA PLANTA', 'Cerrar', {
        duration: 2500,
      })
    }

  }

  changeDni() {
    var hora='';
    if (GlobalVariable.num_planta > 0) {
      if (this.Nro_DNI.length >= 8) {
        this.SpinnerService.show();
        this.seguridadVisitasService.SEG_TRAER_DATOS_VISITA('O', this.Nro_DNI, GlobalVariable.num_planta).subscribe((res: any) => {
          console.log(res);
          if (res.length > 0) {

            if(res[0]['Horas_Planta']===null)
              {
                hora='';
              }
              else{ 
                hora=res[0]['Horas_Planta']+' min'

              };
            this.Nombres_Visita = res[0]['Nombres_Visita'];
            this.Cod_Empresa = res[0]['Cod_Empresa'];
            this.Rh_Cod_Area = res[0]['Rh_Cod_Area'];
            this.Persona_Visitada = res[0]['Persona_Visitada'];
            this.Motivo_Visita = res[0]['Motivo_Visita'];
            this.Observaciones = res[0]['Observaciones'];
            this.Empresa = res[0]['Empresa'];
            this.Id = res[0]['Id'];
            this.Area_Visitada = res[0]['Area_Visitada'];
            this.Hora_Ingreso = res[0]['Hora_Ingreso'];
            this.Hora_Salida = res[0]['Hora_Salida'];
            this.Fec_Registro = res[0]['Fec_Registro'];
            this.Horas_Planta = hora;
            this.SpinnerService.hide();
       
          } else {
            this.matSnackBar.open('No se encontró visita del dni el día de Hoy', 'Cerrar', {
              duration: 2500,
            });
            this.SpinnerService.hide();
          }
        }, (err) => {
          this.SpinnerService.hide();
          console.log(err);
        })
      }
    } else {
      this.matSnackBar.open('No has seleccionado la Planta', 'Cerrar', {
        duration: 2500,
      });
    }


  }


}
