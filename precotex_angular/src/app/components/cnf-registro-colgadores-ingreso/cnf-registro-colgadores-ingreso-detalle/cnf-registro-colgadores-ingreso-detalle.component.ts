import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProcesoColgadoresService } from 'src/app/services/proceso-colgadores.service';
import { GlobalVariable } from 'src/app/VarGlobals';

interface data_det {
  id_Tx_Colgador_Registro_Cab         : string,
  cod_Tela: string,
  cod_OrdTra: string,
  flg_Estatus: string,
  fec_registro  : Date,
}

@Component({
  selector: 'app-cnf-registro-colgadores-ingreso-detalle',
  templateUrl: './cnf-registro-colgadores-ingreso-detalle.component.html',
  styleUrls: ['./cnf-registro-colgadores-ingreso-detalle.component.scss']
})
export class CnfRegistroColgadoresIngresoDetalleComponent implements OnInit {

  displayedColumns: string[] = ['codigo', 'tela','partida','estado','fecha']
  dataSource: MatTableDataSource<data_det>;

  @ViewChild('myinputAdd') inputAdd!: ElementRef;
  @ViewChild('myinputDel') inputDel!: ElementRef;  

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    Num_corre:   [''],
    colgador_añadir:     [''],
    colgador_eliminar:   [''],
    Codigo_QR:   [''] ,
  });
  
  id = 0;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private formBuilder : FormBuilder   ,
              private route       : ActivatedRoute,
              private router      : Router        ,
              private SpinnerService    : NgxSpinnerService       ,
              private serviceColgadores : ProcesoColgadoresService,
              private toastr      : ToastrService,
  ) { 
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit() {
    this.inputAdd.nativeElement.focus();
  } 

  ngOnInit(): void {

    // const link = document.createElement('link');
    // link.rel = 'stylesheet';
    // link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css';
    // document.head.appendChild(link);

    //Deshabilita control de titulo de Numero de Grupo
    this.formulario.get('Codigo_QR')?.disable();     
    
    //Obtiene Parametros
    this.route.queryParams.subscribe(params => {
      //this.grupo = params['codigoGrupo']; 
      this.id = params['id'];  // Obtener el parámetro 'id' de la ruta
    });     

    //Obtiene datos de la Ubicacion
    this.onObtenerDatosUbicacionColgador(this.id);
    this.onObtenerColgadoresxTipUbi(this.id);
  }

  onObtenerColgadoresxTipUbi(id:number){
    this.SpinnerService.show();
    this.serviceColgadores.getListadoColgadoresxUbicacion(id).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
            this.dataSource.data = response.elements;
            this.SpinnerService.hide();
          }
          else{
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

  onObtenerDatosUbicacionColgador(id:number)
  {
    this.SpinnerService.show();
    this.serviceColgadores.getObtenerUbicacionColgadorById(id).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
              //const id: string = response.elements[0].id_Tx_Ubicacion_Colgador;
              const _Descripcion = response.elements[0].descripcion;
              const _CodigoBarra = response.elements[0].codigoBarra;
              this.formulario.controls['Codigo_QR'].setValue(_Descripcion + ": " + _CodigoBarra);
              this.SpinnerService.hide();
          }
          else{
            this.formulario.controls['Codigo_QR'].setValue('');
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

  applyEnterAdd(event: any) {
    this.onAnadir()
  }  

  applyEnterDel(event: any) {
    this.onRetirar()
  }

  onAnadir() {

    const codigoColgador: string = this.formulario.get('colgador_añadir')?.value!;
    if(codigoColgador.length==0){
      this.toastr.info('Escanee codigo QR de Colgador!', 'Cerrar', {
        timeOut: 2500,
         });   
         return;   
    };

    //var codUsuario = localStorage.getItem('codUsuario');
    let data: any = {
      "id_Tx_Ubicacion_Colgador_Items"  : 0,
      "id_Tx_Ubicacion_Colgador"        : this.id,
      "id_Tx_Colgador_Registro_Cab"     : 0,
      "accion"                          : "I",
      "codigoBarra"                     : codigoColgador,
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
              this.onObtenerColgadoresxTipUbi(this.id);
            }else if(response.codeResult == 201){
              this.toastr.info(response.message, '', {
                timeOut: 2500,
              });
            } 

            this.SpinnerService.hide();
            this.formulario.get('colgador_añadir')?.patchValue('');
            this.inputAdd.nativeElement.focus();   

          }else{
            this.toastr.error(response.message, 'Cerrar', {
              timeOut: 2500,
            });
            this.SpinnerService.hide();
            this.formulario.get('colgador_añadir')?.patchValue('');
            this.inputAdd.nativeElement.focus();               
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

  onRetirar(){

    const codigoColgador: string = this.formulario.get('colgador_eliminar')?.value!;
    if(codigoColgador.length==0){
      this.toastr.info('Escanee codigo QR de Colgador!', 'Cerrar', {
        timeOut: 2500,
         });   
         return;   
    };

    //var codUsuario = localStorage.getItem('codUsuario');
    let data: any = {
      "id_Tx_Ubicacion_Colgador_Items"  : 0,
      "id_Tx_Ubicacion_Colgador"        : this.id,
      "id_Tx_Colgador_Registro_Cab"     : 0,
      "accion"                          : "E",
      "codigoBarra"                     : codigoColgador,
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
              this.onObtenerColgadoresxTipUbi(this.id);
            }else if(response.codeResult == 201){
              this.toastr.info(response.message, '', {
                timeOut: 2500,
              });
            }
            this.SpinnerService.hide();
            this.formulario.get('colgador_eliminar')?.patchValue('');
            this.inputDel.nativeElement.focus();    
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

  Regresar(){
    this.router.navigate(['/CnfRegistroColgadoresIngreso']);
  }


}
