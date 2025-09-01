import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';
import { SeguridadVisitasService } from 'src/app/services/seguridad-visitas.service';

@Component({
  selector: 'app-crear-visita',
  templateUrl: './crear-visita.component.html',
  styleUrls: ['./crear-visita.component.scss']
})
export class CrearVisitaComponent implements OnInit {

  Tipo_Documento: any = 'DNI';
  Nro_DNI = '';
  Nombres_Visita: any = '';
  Cod_Empresa: any = '';
  Rh_Cod_Area: any = '';
  Persona_Visitada: any = '';
  Motivo_Visita: any = '';
  Observaciones: any = '';
  Empresa:any = '';
  sede: string = '';
  Area_Visitada:string = '';

  dataAreas:Array<any> = [];
  dataPersonas:Array<any> = [];
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


  guardarVisita(){
    if(GlobalVariable.num_planta > 0){
      if(this.Nro_DNI != ''){
        if(this.Empresa != ''){
          if(this.Cod_Empresa != ''){
            if(this.Rh_Cod_Area != ''){
              if(this.Motivo_Visita != ''){
                this.SpinnerService.show();
                this.seguridadVisitasService.SEG_CREAR_VISITA_PLANTA(
                  'I',
                  0,
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
                ).subscribe((res:any) => {
                  this.SpinnerService.hide();
                  if(res[0].Respuesta == 'OK'){
                    this.matSnackBar.open('Se guardo correctamente la visita', 'Cerrar', {
                      duration: 2500,
                    });
                    this.Tipo_Documento = 'DNI';
                    this.Nro_DNI = '';
                    this.Nombres_Visita = '';
                    this.Cod_Empresa = '';
                    this.Rh_Cod_Area = '';
                    this.Persona_Visitada = '';
                    this.Motivo_Visita = '';
                    this.Observaciones = '';
                    this.Empresa = '';
                    this.sede = '';
                    this.Area_Visitada = '';
                    this.dataAreas = [];
                    this.dataPersonas = [];
                  }else{
                    this.matSnackBar.open('Ha ocurrido un error al guardar la visita', 'Cerrar', {
                      duration: 2500,
                    });  
                  }
                }, (err: HttpErrorResponse) => {
                  this.SpinnerService.hide();
                  this.matSnackBar.open(err.message, 'Cerrar', {
                    duration: 1500,
                  });
                });
                
  
  
  
              }else{
                this.matSnackBar.open('Debes Seleccionar el Motivo de visita', 'Cerrar', {
                  duration: 2500,
                });    
              }
            }else{
              this.matSnackBar.open('Debes Ingresar el Área', 'Cerrar', {
                duration: 2500,
              });  
            }
          }else{
            this.matSnackBar.open('Debes Ingresar la Empresa', 'Cerrar', {
              duration: 2500,
            })  
          }
        }else{
          this.matSnackBar.open('Debes Ingresar la Empresa Visitante', 'Cerrar', {
            duration: 2500,
          })  
        }
      }else{
        this.matSnackBar.open('Debes Ingresar el DNI', 'Cerrar', {
          duration: 2500,
        })
      }
    }else{
      this.matSnackBar.open('NO HAS SELECCIONADO LA PLANTA', 'Cerrar', {
        duration: 2500,
      })
    }
    
  }


  changeDni(){
      if(this.Nro_DNI.length >= 8){
        this.SpinnerService.show();
        this.seguridadVisitasService.SEG_TRAER_DATOS_VISITA('D', this.Nro_DNI, '').subscribe((res:any) => {
          console.log(res);
          if(res.length > 0){
            this.Nombres_Visita = res[0]['Nombres_Visita'];
            this.Empresa = res[0]['Empresa'];
            this.SpinnerService.hide();
          }else{
            this.Nombres_Visita = '';
            this.seguridadVisitasService.consultaDNI(this.Nro_DNI).subscribe(result => {
              console.log(result);
              this.SpinnerService.hide();
              if(result['response'] == 'true'){
                this.Nombres_Visita = result['result']['Paterno'] + ' '  + result['result']['Materno'] + ' ' + result['result']['Nombres']
              }else{
                this.Nombres_Visita = '';
              }
            }, (err) => {
              console.log(err);
              this.SpinnerService.hide();
              this.Nombres_Visita = '';
            })
          }
        }, (err) => {
          this.SpinnerService.hide();
          console.log(err);
        })
      }
    
  }

  getAreasEmpresa(){
    this.dataAreas = [];
    this.dataPersonas = [];
    this.Persona_Visitada = '';
    this.Rh_Cod_Area = '';
    
    this.SpinnerService.show();
    this.seguridadVisitasService.SEG_OBTENER_AREAS_TRABAJO('A', this.Cod_Empresa, '').subscribe((result:any) => {
      console.log(result);
      this.dataAreas = result;
      this.SpinnerService.hide();
    }, (err:HttpErrorResponse) => {

      console.log(err);
      this.dataAreas = [];
      this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      });
      this.SpinnerService.hide();
      
    })
  }
  
  
  getTrabajadoresArea(event){
    console.log(event);
    this.Area_Visitada = event.Rh_Des_Area;
    this.dataPersonas = [];
    this.SpinnerService.show();
    this.seguridadVisitasService.SEG_OBTENER_AREAS_TRABAJO('T', this.Cod_Empresa, this.Rh_Cod_Area).subscribe((result:any) => {
      console.log(result);
      this.dataPersonas = result;
      this.SpinnerService.hide();
    }, (err:HttpErrorResponse) => {
      console.log(err);
      this.dataPersonas = [];
      this.SpinnerService.hide();
      this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      })      
    })
  }

  
}
