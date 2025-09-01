import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProcesoColgadoresService } from 'src/app/services/proceso-colgadores.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';

interface data_det {
  id_Tx_Ubicacion_Colgador     : number,
  codigoBarra                   : string,
  flg_Estatus                 : string,
  fec_Registro              : string,
  nTotalColgadores          : number,
}

interface data_det_grupo {
  id_Tx_Colgador_Registro_Cab         : string,
  cod_Tela: string,
  cod_OrdTra: string,
  flg_Estatus: string,
  fec_registro  : Date,
}

@Component({
  selector: 'app-cnf-reubicacion-colgadores',
  templateUrl: './cnf-reubicacion-colgadores.component.html',
  styleUrls: ['./cnf-reubicacion-colgadores.component.scss']
})
export class CnfReubicacionColgadoresComponent implements OnInit {

    //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    ubicacion_añadir:   [''],
    grupo_añadir:       [''],
    grupo_añadir_btn:   [''],
  })

  id = 0;
  isDisabled_BtnGrupo = true;
  codUbicacionDestino: string = "";

  @ViewChild('myinputAddUbi') inputAddUbi!: ElementRef;
  @ViewChild('myinputAddGru') inputAddGru!: ElementRef;
  @ViewChild('mybtnAddGru') btnAddGru!: ElementRef;  

  displayedColumns: string[] = ['tipUbi','totCol','fecha','estado']
  dataSource: MatTableDataSource<data_det>;

  displayedColumnsUbi: string[] = ['codigo', 'tela','partida','estado','fecha']
  dataSourceUbi: MatTableDataSource<data_det_grupo>;  

  sCod_Usuario = GlobalVariable.vusu;

  constructor(private formBuilder : FormBuilder,
              private router      : Router,
              private serviceColgadores: ProcesoColgadoresService,
              private toastr        : ToastrService     ,
              private SpinnerService: NgxSpinnerService,
  ) { this.dataSource = new MatTableDataSource();
      this.dataSourceUbi = new MatTableDataSource(); 
   }

  ngOnInit(): void {

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css';
    document.head.appendChild(link);   
    
    this.formulario.get('grupo_añadir')?.disable();
  }

  applyEnterAddUbi(event: any) {
    this.AnadirUbicacion()
  }

  AnadirUbicacion(){

    const codigoUbica: string = this.formulario.get('ubicacion_añadir')?.value!;
    if(codigoUbica.length==0){
      this.toastr.info('Escanee codigo QR destino!', 'Cerrar', {
        timeOut: 2500,
         });   
         return;   
    }    

    this.onObtieneInformacionUbicacionCaja(codigoUbica);
  }

  applyEnterAddGru(event: any) {
    this.AnadirGrupo();
  }

  AnadirGrupo(){

    const codigoGrupo: string | null = this.formulario.get('grupo_añadir')?.value ?? null;

    if(!codigoGrupo || codigoGrupo.trim() === ''){
      this.toastr.info('Escanee codigo QR!', 'Cerrar', {
        timeOut: 2500,
         });
         return;
    } 
    
    //var codUsuario = localStorage.getItem('codUsuario');
    let data: any = {
      "id_Tx_Ubicacion_Colgador_Items"  : 0,
      "id_Tx_Ubicacion_Colgador"        : this.id,
      "id_Tx_Colgador_Registro_Cab"     : 0,
      "accion"                          : "R",
      "codigoBarra"                     : codigoGrupo,
      "flg_Estatus"                     : "",
      "cod_Usuario"                     : this.sCod_Usuario,
      "id_Tx_Ubicacion_Fisica"          : 0
    };   
    
    this.SpinnerService.show();
    this.serviceColgadores.postCrudUbicacionColgadorItems(data).subscribe({
        next: (response: any)=> {
          if(response.success){
            if (response.codeResult == 200){
              this.toastr.success(response.message, '', {
                timeOut: 2500,
              });

              //Listar
              //this.onObtenerColgadoresxTipUbi(this.id);
              this.AnadirUbicacion();
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

  onObtieneInformacionUbicacionCaja(codigoBarra: string){
    this.SpinnerService.show();
    this.serviceColgadores.getListadoTotalColgadoresxCodigoBarra(codigoBarra).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
            this.dataSource.data = response.elements;

            //Obtiene codigo ID
            this.id = response.elements[0].id_Tx_Ubicacion_Colgador;

            //Activa los botones de Ubicar - Reubicar
            this.formulario.get('grupo_añadir')?.enable();
            this.isDisabled_BtnGrupo = !this.isDisabled_BtnGrupo;
            this.inputAddGru.nativeElement.focus();   
            
            //Aqui debe de Listar u Obtener los grupos que estan agrupados en la Ubicación
            this.onObtenerColgadoresxTipUbi(this.id);

            this.SpinnerService.hide();
          }
          else{

            this.formulario.get('ubicacion_añadir')?.patchValue('');
            this.formulario.get('grupo_añadir')?.disable();
            this.isDisabled_BtnGrupo = true;
            this.inputAddUbi.nativeElement.focus();

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

  onObtenerColgadoresxTipUbi(id:number){
    this.SpinnerService.show();
    this.serviceColgadores.getListadoColgadoresxUbicacion(id).subscribe({
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

  Regresar(){
    this.router.navigate(['/CnfRegistroPresentacion']);
  }

}
