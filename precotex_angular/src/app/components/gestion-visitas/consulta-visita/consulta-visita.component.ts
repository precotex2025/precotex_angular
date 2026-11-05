import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';
import { SeguridadVisitasService } from 'src/app/services/seguridad-visitas.service';
import { MatDialog } from '@angular/material/dialog';

import { DialogFirmaDigitalComponent } from 'src/app/components/auditoria-externa/registro-firmas-auditoria/dialog-firma-digital/dialog-firma-digital.component';

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

  lc_img64: string = "";

  constructor(private seguridadVisitasService: SeguridadVisitasService, private matSnackBar: MatSnackBar, private dialog: MatDialog,
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


      const formData = new FormData();
                formData.append('Opcion', 'S');
                formData.append('Id', this.Id);
                formData.append('Cod_Empresa', this.Cod_Empresa);
                formData.append('Num_Planta', GlobalVariable.num_planta.toString());
                formData.append('Tipo_Documento', this.Tipo_Documento);
                formData.append('Nro_DNI', this.Nro_DNI);
                formData.append('Nombres_Visita', this.Nombres_Visita);
                formData.append('Empresa', this.Empresa);
                formData.append('Hora_Ingreso', '01/01/1990');
                formData.append('Hora_Salida', '01/01/1990');
                formData.append('Horas_Planta', '');
                formData.append('RH_Cod_Area', this.Rh_Cod_Area);
                formData.append('Area_Visitada', this.Area_Visitada);
                formData.append('Motivo_Visita', this.Motivo_Visita);
                formData.append('Persona_Visitada', this.Persona_Visitada);
                formData.append('Observaciones', this.Observaciones);
                formData.append('Fec_Registro', '01/01/1990');
                formData.append('Cod_Usuario', GlobalVariable.vusu);
                formData.append('Imagen64', this.lc_img64);

      /*this.seguridadVisitasService.SEG_CREAR_VISITA_PLANTA(
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
        GlobalVariable.vusu)*/
      this.seguridadVisitasService.SEG_CREAR_VISITA_PLANTA2(formData)
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res[0].Respuesta == 'OK') {
          this.matSnackBar.open('Se actualizo la hora de salida correctamente.', 'Cerrar', {
            duration: 2500,
          });

          this.onLimpiarFirma();
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

  // Registro de firmar

  onRegistrarFirma(){
        //console.log(window.innerWidth)
        //console.log(window.innerHeight)
        let ln_width: number = 500;
        let ln_height: number = 350;
        //this.ln_cols = 3;
    
    
        let dialogRef = this.dialog.open(DialogFirmaDigitalComponent, {
          disableClose: true,
          data: {Nombre: 'firma', Width: ln_width, Height: ln_height}
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log(result)
          this.lc_img64 = result;      
        });
      }
  
    onLimpiarFirma(){
      this.lc_img64 = '';
  //    this.ll_nuevo = false;
    }


}
