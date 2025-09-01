import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProcesoColgadoresService } from 'src/app/services/proceso-colgadores.service';
import { GlobalVariable } from 'src/app/VarGlobals';

interface data {
  Title : string;
  Accion: string;
  //Datos  : dataIn;
}

@Component({
  selector: 'app-dialog-registrar-ubicaciones',
  templateUrl: './dialog-registrar-ubicaciones.component.html',
  styleUrls: ['./dialog-registrar-ubicaciones.component.scss']
})
export class DialogRegistrarUbicacionesComponent implements OnInit {
  sCod_Usuario  = GlobalVariable.vusu;
  dataTipoUbicaciones       : Array<any> = [];
  dataTipoFamTela           : Array<any> = [];

  btnGuardarDeshabilitado : boolean = true;
  btnImprimirDeshabilitado: boolean = true;
  tituloBtnProceso        : string  = "";
  showItemRepisa          : boolean = false; 
  numeroCorrelativo       : number = 0;

  constructor(
    private SpinnerService    : NgxSpinnerService       ,
    private serviceColgadores : ProcesoColgadoresService,
    private formBuilder       : FormBuilder             ,
    private toastr            : ToastrService           ,
    @Inject(MAT_DIALOG_DATA) public data: data          ,
  ) { }

  ngOnInit(): void {

    if (this.data.Accion == 'I'){
      this.tituloBtnProceso = "Grabar";
    }
    else {
      this.tituloBtnProceso = "Actualizar";
    }

    this.onLoadTipoUbicaciones();
    this.onLoadTipoFamTela();
    this.formulario.get('ctrol_Repisa')?.setValue('REPISA PRINCIPAL');
    this.formulario.get('ctrol_Repisa')?.disable(); 
    this.formulario.get('ctrol_CodigoQR')?.disable(); 
  }

  formulario = this.formBuilder.group({
    ctrol_TipoUbicacion: [''],
    ctrol_Repisa       : [''],
    ctrol_TipoFamTel   : [''],
    ctrol_CodigoQR     : [''],
  });

  onLoadTipoFamTela(){
    this.dataTipoFamTela = [];
    this.SpinnerService.show();
    this.serviceColgadores.getListadoTipoFamTela().subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
              this.dataTipoFamTela = response.elements;
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

  onLoadTipoUbicaciones(){
    this.dataTipoUbicaciones = [];
    this.SpinnerService.show();
    this.serviceColgadores.getListadoTipoUbicacionColgador().subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
              this.dataTipoUbicaciones = response.elements;
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

  onSave(){

    const _id_Tipo_Ubicacion_Colgador = this.formulario.get('ctrol_TipoUbicacion')?.value; 
    const _codigoBarra = this.formulario.get('ctrol_CodigoQR')?.value; 
    const _cod_FamTela = this.formulario.get('ctrol_TipoFamTel')?.value; 

    //Proceso de registrar
    let data: any = {
      "accion"   : this.data.Accion,  
      "id_Tx_Ubicacion_Colgador"    : 0,
      "id_Tipo_Ubicacion_Colgador"  : _id_Tipo_Ubicacion_Colgador ,
      "id_Tipo_Ubicacion_Colgador_Padre" : 0 ,
      "codigoBarra"   : _codigoBarra ,
      "cod_FamTela"   : _cod_FamTela ,
      "correlativo"   : this.numeroCorrelativo,
      "flg_Estatus"   : "S"          ,
      "cod_Usuario"   : this.sCod_Usuario 
    }    

    //Guardar
    this.SpinnerService.show();
    this.serviceColgadores.postCrudUbicacionColgador(data).subscribe({
        next: (response: any)=> {
          if(response.success){
            if (response.codeResult == 200){
              this.toastr.success(response.message, '', {
                timeOut: 2500,
              });

              //Deshabilita Controles
              this.DesHabilitar(true);

              //Deshabilita botones
              this.btnGuardarDeshabilitado = true;
              this.btnImprimirDeshabilitado = false;

            }else if(response.codeResult == 201){
              this.toastr.info(response.message, '', {
                timeOut: 2500,
              });
            }
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


    /*
  "accion": "string",
  "id_Tx_Ubicacion_Colgador": 0,
  "id_Tipo_Ubicacion_Colgador": 0,
  "id_Tipo_Ubicacion_Colgador_Padre": 0,
  "codigoBarra": "string",
  "cod_FamTela": "string",
  "flg_Estatus": "string",
  "cod_Usuario": "string"

    /*
    */

  }

  onPrint(){

    const _codigoBarra = this.formulario.get('ctrol_CodigoQR')?.value; 
    let data: any = {
        "content"   : _codigoBarra,
        //"printName" : "\\\\192.168.7.7\\Planeamiento",
        "printName" : "\\\\prxwind606\\Argox CP-2140EX PPLB",
    };    

    //Imprimir CODE QR
    this.SpinnerService.show();
    this.serviceColgadores.postPrintQRCode2(data).subscribe({
        next: (response: any)=> {
          if(response.success){
            if (response.codeResult == 200){
              this.toastr.success(response.message, '', {
                timeOut: 2500,
              });
            }else if(response.codeResult == 201){
              this.toastr.info(response.message, '', {
                timeOut: 2500,
              });
            }
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

  onChangeTipUbi(event: MatSelectChange){
    const selectedValue = event.value;
    this.formulario.get('ctrol_CodigoQR')?.setValue("");

    //TIPO SECCIÓN 
    if (selectedValue == 1){
      this.showItemRepisa = true;
    }else //OTROS TIPOS
    {
      this.showItemRepisa = false;
      this.onObtenerCorrelativoByTipUbi(selectedValue, "*");

    }
  }

  onChangeFamTela(event: MatSelectChange){
    const selectedValueTipUbi = Number(this.formulario.get('ctrol_TipoUbicacion')?.value);
    const selectedValue = event.value;
    this.onObtenerCorrelativoByTipUbi(selectedValueTipUbi, selectedValue);
  }

  onObtenerCorrelativoByTipUbi(Id_Tipo_Ubicacion_Colgador: number, Cod_FamTela: string){
    this.SpinnerService.show();
    this.serviceColgadores.getObtenerCorrelativo(Id_Tipo_Ubicacion_Colgador, Cod_FamTela).subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
              //MUESTRA CODIGO QR Y OBTIENE NUMERO DE CORRELATIVO
              const _codigoQR = response.elements[0].qR_Correlativo;
              const _numeroCorrelativo = Number(response.elements[0].numero_Correlativo);

              this.formulario.get('ctrol_CodigoQR')?.setValue(_codigoQR);
              this.numeroCorrelativo = _numeroCorrelativo;

              //HABILITA BOTON GUARDAR
              this.btnGuardarDeshabilitado = false;
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

DesHabilitar(sEstado: boolean){
  sEstado?this.formulario.get('ctrol_TipoUbicacion')?.disable():this.formulario.get('ctrol_TipoUbicacion')?.enable();
  sEstado?this.formulario.get('ctrol_TipoFamTel')?.disable():this.formulario.get('ctrol_TipoFamTel')?.enable();
}  


}
