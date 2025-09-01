import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProcesoColgadoresService } from 'src/app/services/proceso-colgadores.service';
import { GlobalVariable } from 'src/app/VarGlobals';

interface data_det {
  descripcion     : string,
  flg_Estatus     : string,
  fec_Registro    : string,
  nTotalCajas     : number,
}

interface data_det_grupo {
  codigoBarra: string,
  nTotalColgadores: number,
  flg_Estatus: string,
  fec_registro  : Date,
}

@Component({
  selector: 'app-cnf-reubicacion-cajas',
  templateUrl: './cnf-reubicacion-cajas.component.html',
  styleUrls: ['./cnf-reubicacion-cajas.component.scss']
})
export class CnfReubicacionCajasComponent implements OnInit {

    //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    ubicacion_añadir:   [''],
    grupo_añadir:       [''],
    grupo_añadir_btn:   [''],
    ctrol_UbicacionFisico: [''],
  })  

  id = 0;
  isDisabled_BtnGrupo = true;
  codUbicacionDestino: string = "";
  dataUbicacionFisico       : Array<any> = [];

  IdUbicacionFisico = 0;

  @ViewChild('myinputAddUbi') inputAddUbi!: ElementRef;
  @ViewChild('myinputAddGru') inputAddGru!: ElementRef;
  @ViewChild('mybtnAddGru') btnAddGru!: ElementRef;  

  displayedColumns: string[] = ['tipUbi','totCaj','fecha','estado']
  dataSource: MatTableDataSource<data_det>;

  displayedColumnsUbi: string[] = ['tipUbi', 'totCol','fecha','estado']
  dataSourceUbi: MatTableDataSource<data_det_grupo>;   

  sCod_Usuario = GlobalVariable.vusu;

  constructor(
    private serviceColgadores: ProcesoColgadoresService,
    private SpinnerService: NgxSpinnerService ,
    private formBuilder: FormBuilder          ,
    private toastr     : ToastrService        ,
    private router      : Router,

  ) { this.dataSource = new MatTableDataSource(); 
     this.dataSourceUbi = new MatTableDataSource();
  }

  ngOnInit(): void {

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css';
    document.head.appendChild(link);  

    this.formulario.get('grupo_añadir')?.disable();

    //this.formulario.get('grupo_añadir')?.disable();
    this.onLoadUbicacionFisica();
  }

  applyEnterAddGru(event: any) {
    this.AnadirGrupo();
  }

  AnadirGrupo(){

    const codigoUbica: string = this.formulario.get('grupo_añadir')?.value!;
    if(codigoUbica.length==0){
      this.toastr.info('Escanee codigo QR Caja!', 'Cerrar', {
        timeOut: 2500,
         });   
         return;   
    }    
    
    //var codUsuario = localStorage.getItem('codUsuario');
    let data: any = {
      "id_Tx_Ubicacion_Colgador_Items"  : 0,
      "id_Tx_Ubicacion_Colgador"        : this.id,
      "id_Tx_Colgador_Registro_Cab"     : 0,
      "accion"                          : "X",
      "codigoBarra"                     : codigoUbica,
      "flg_Estatus"                     : "",
      "cod_Usuario"                     : this.sCod_Usuario,
      "id_Tx_Ubicacion_Fisica"          : this.IdUbicacionFisico
    };    

    /*
    console.log('data');
    console.log(data);
    return;
    */

    this.SpinnerService.show();
    this.serviceColgadores.postCrudUbicacionColgadorItems(data).subscribe({
        next: (response: any)=> {
          if(response.success){
            if (response.codeResult == 200){
              this.toastr.success(response.message, '', {
                timeOut: 2500,
              });

              //Listar
              this.onLoadTotalCajasxUbicacion(this.IdUbicacionFisico);
            }else if(response.codeResult == 201){
              this.toastr.info(response.message, '', {
                timeOut: 2500,
              });
            }

            this.formulario.get('grupo_añadir')?.patchValue('');
            this.inputAddGru.nativeElement.focus();

            this.SpinnerService.hide();
          }else{
            this.toastr.error(response.message, 'Cerrar', {
              timeOut: 2500,
            });
            this.SpinnerService.hide();
          }
        },
        error: (error) => {
          this.SpinnerService.hide();
          this.toastr.error(error.message, 'Cerrar', {
          timeOut: 2500,
           });
        }      
    });    

  }

  onLoadUbicacionFisica(){
    this.dataUbicacionFisico = [];
    this.SpinnerService.show();
    this.serviceColgadores.getListadoUbicacioFisica().subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
              this.dataUbicacionFisico = response.elements;
              this.SpinnerService.hide();
          }
          else{
            this.SpinnerService.hide();
          };
        }
      },
      error: (error) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });   
  }

  onLoadTotalCajasxUbicacion(IdUbicacionFisico: number){

    //const IdUbicacionFisico : number = this.formulario.get('ctrol_UbicacionFisico')?.value!;
    this.SpinnerService.show();
    this.serviceColgadores.getObtenerInformacionTotalCajasxUbicacion(IdUbicacionFisico).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
            this.dataSource.data = response.elements;

            
            //Obtiene codigo ID
            this.id = response.elements[0].id_Tx_Ubicacion_Colgador;

            //Activa los botones de Ubicar - Reubicar
            this.formulario.get('grupo_añadir')?.enable();
            this.isDisabled_BtnGrupo = false;
            this.inputAddGru.nativeElement.focus();
            
            //Aqui debe de Listar u Obtener los grupos que estan agrupados en la Ubicación
            this.onLoadInformacionCajasxUbicacion(IdUbicacionFisico);
            

            this.SpinnerService.hide();
          }
          else{

            
            this.formulario.get('ubicacion_añadir')?.patchValue('');
            this.formulario.get('grupo_añadir')?.enable();
            this.isDisabled_BtnGrupo = false;
            this.inputAddGru.nativeElement.focus();

            //Limpia las Tablas 
            this.dataSource.data = [];
            this.dataSourceUbi.data = [];
            

            //Muestra mensaje que no hay datos
            this.toastr.info(response.message, 'Cerrar', {
              timeOut: 2500,
            });               
            this.dataSource.data = []
          }
          this.SpinnerService.hide();
        }        
      },
      error: (error) => {
        this.toastr.error(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });  
  }

  onLoadInformacionCajasxUbicacion(IdUbicacionFisico: number){
    this.SpinnerService.show();
    this.serviceColgadores.getObtenerInformacionCajasxUbicacion(IdUbicacionFisico).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
            this.dataSourceUbi.data = response.elements;
            this.SpinnerService.hide();
          }
          else{
            this.dataSourceUbi.data = []
          }
          this.SpinnerService.hide();
        }        
      },
      error: (error) => {
        this.toastr.error(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });     
  }

  onUbicacionChange(event: MatSelectChange){
    const selectedValue = event.value;
    this.IdUbicacionFisico = selectedValue;
    console.log('Ubicación física seleccionada:', selectedValue);
    this.onLoadTotalCajasxUbicacion(selectedValue);
  }

  Regresar(){
    this.router.navigate(['/CnfRegistroPresentacion']);
  }  

}
