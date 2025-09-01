import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalVariable } from 'src/app/VarGlobals';
import { AsignarRolesUsuarioComponent } from '../../accesos-usuarios/asignar-roles-usuario/asignar-roles-usuario.component';
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MemorandumGralService } from 'src/app/services/Memorandum/memorandum-gral.service';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';



interface data_det {
  //codigo       : string,
  //descripcion  : string,
  //cantidad     : number,

  //Id_Memorandum_Detalle: number,
  num_Memo_Detalle: string,
  num_Memo: string,
  //cod_Material_Memo: string,
  glosa: string,
  cantidad: number,
  flg_Estatus: string,
  //fec_Registro: string,
  usu_Registro: string,
  //fec_Modifica: string,
  //usu_Modifica: string,
  //cod_Equipo: string  

}

interface data {
  Title       : string;
  Accion      : string;
  sCod_Usuario: string;
  sNom_Usuario: string;
  sCod_Planta : string;
  Datos       : dataIn;
}

interface dataIn {
  cod_Cliente_Tex : string
}

interface dataDetalle {
      //Id_Memorandum_Detalle: number,
      num_Memo_Detalle: string,
      num_Memo: string,
      //cod_Material_Memo: string,
      glosa: string,
      cantidad: number,
      flg_Estatus: string,
      //fec_Registro: string,
      usu_Registro: string,
      //fec_Modifica: string,
      //usu_Modifica: string,
      //cod_Equipo: string  
}

@Component({
  selector: 'app-dialog-memorandum-gral',
  templateUrl: './dialog-memorandum-gral.component.html',
  styleUrls: ['./dialog-memorandum-gral.component.scss']
})
export class DialogMemorandumGralComponent implements OnInit {

  range = new FormGroup({
      //start: new FormControl(new Date),
      start: new FormControl(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
      end: new FormControl(new Date),
  });  

  Id_Usuario: string = "";
  Num_Planta_Ori: number = 0;
  Num_Planta_Des: number = 0;
  //cod_Material_Memo: string = "";
  //des_Material_Memo: string = "";
  sUsuario  = GlobalVariable.vusu;

  formulario = this.formBuilder.group({
      ctrol_memo: [''],
      ctrol_fecha: [''],
      ctrol_user_ori: [''],
      ctrol_planta_ori: [''],
      ctrol_user_des: [''],
      ctrol_planta_des: [''],      
      ctrol_cantidad: [''],
      ctrol_material: [''],
      ctrol_tip_memo: [''],
      ctrol_motivo: [''],
      ctrol_glosa: ['']
  });  

  dataUsuarios  : Array<any> = [];
  dataPlantasOri: Array<any> = [];
  dataPlantas   : Array<any> = [];
  dataMateriales: Array<any> = [];
  dataMotivos   : Array<any> = [];
  dataDetalles: dataDetalle[] = [];
  dataTipoMemo  : Array<any> = [];

  //filtros
  filtroUsuarioCtrl = new FormControl('');
  usuariosFiltrados: any[] = [];  


  constructor(
    private formBuilder       : FormBuilder,
    private serviceSeguridad  : SeguridadControlVehiculoService,
    private serviceMemorandum : MemorandumGralService,
    private matSnackBar       : MatSnackBar,
    private datePipe          : DatePipe,
    private SpinnerService    : NgxSpinnerService,
    private toastr            : ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: data,
    public dialogRef: MatDialogRef<DialogMemorandumGralComponent>,
  ) { }

  ngOnInit(): void {
      const sFecActual       : string =  this.range.get('end').value;
      const fechaFormateada = this.datePipe.transform(sFecActual, 'dd/MM/yyyy');

      //Deshabilita Controles
      this.formulario.get('ctrol_user_ori')?.disable();
      this.formulario.get('ctrol_memo')?.disable();
      this.formulario.get('ctrol_fecha')?.disable();
      //this.formulario.get('ctrol_planta_ori')?.disable();
      //this.formulario.get('ctrol_planta_des')?.disable();

      //Setea Valores
      this.formulario.get('ctrol_fecha')?.setValue(fechaFormateada);
      this.formulario.get('ctrol_user_ori')?.setValue(this.data.sNom_Usuario);
      this.formulario.get('ctrol_planta_ori')?.setValue(this.data.sCod_Planta);
      this.getListaUsuarios();
      this.getPlantas();
      this.getTipoMemo();
      this.getMotivos();      
      this.getMateriales();

      // Escucha los cambios del input de búsqueda
      this.filtroUsuarioCtrl.valueChanges.subscribe(valor => {
        this.filtrarUsuarios(valor);
      });      
  }


  displayedColumns: string[] = [
    //'codigo'          ,
    'descripcion'     ,
    'cantidad'        ,
    'opciones'        
  ];

  listaDetalle: data_det[] = [];
  dataSource=new  MatTableDataSource<data_det>(this.listaDetalle);
  columnsToDisplay: string[] = this.displayedColumns.slice();
  //dataListadoMateriales: Array<any> = []; 

filtrarUsuarios(valor: string) {
  const filtro = valor.toLowerCase();
  this.usuariosFiltrados = this.dataUsuarios.filter(usuario =>
    usuario.Nom_usuario.toLowerCase().includes(filtro)
  );
}

  getListaUsuarios(){
    this.serviceSeguridad.mantenimientoUsuariosService(
      ""
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          this.dataUsuarios = result;
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  getTipoMemo(){
    this.serviceMemorandum.getTipoMemorandum().subscribe(
      (result: any) => {
        if (result.totalElements > 0) {
          this.dataTipoMemo = result.elements.filter((item:any)=> item.cod_Tipo_Memo !== '03');
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))       
  }

  getPlantas(){
    this.serviceMemorandum.getPlantas().subscribe(
      (result: any) => {
        if (result.totalElements > 0) {
          this.dataPlantasOri = result.elements;
          this.dataPlantas = result.elements;

          this.formulario.get('ctrol_user_ori')?.setValue(this.data.sNom_Usuario);
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))    
  } 

  getMateriales(){
    this.serviceMemorandum.getMateriales().subscribe(
      (result: any) => {
        if (result.totalElements > 0) {
          this.dataMateriales = result.elements;
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))      
  }

  getMotivos(){
    this.serviceMemorandum.getMotivos().subscribe(
      (result: any) => {
        if (result.totalElements > 0) {
          this.dataMotivos = result.elements;
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))      
  }

  onSave(){

    Swal.fire({
      title: '¿Desea Registrar Memorandum?, Confirme',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {

        const sUserReceptor = String(this.formulario.get('ctrol_user_des')?.value);
        const sPlantaOri    =  this.formulario.get('ctrol_planta_ori')?.value;
        const sPlantaDes    = this.formulario.get('ctrol_planta_des')?.value;
        const sTipMemo      = this.formulario.get('ctrol_tip_memo')?.value;
        const sCodMotivo   = this.formulario.get('ctrol_motivo')?.value;

        /********************/
        //Memorandum Detalle
        /********************/
        // this.listaDetalle.forEach(element => {

        //   const nuevoDetalle: dataDetalle = {
        //     Id_Memorandum_Detalle: 0,
        //     num_Memo: '',
        //     glosa: element.descripcion,
        //     cantidad: element.cantidad,
        //     flg_Estatus: '1', //No recepcionado
        //     usu_Registro: this.sUsuario
        //   };

        //   //Agregar a la lista
        //   this.dataDetalles.push(nuevoDetalle);
        // });

        /********************/
        //Memorandum Detalle
        /********************/
        let data: any = {
          "num_Memo": "",
          "cod_Usuario_Emisor"  : this.data.sCod_Usuario,
          "cod_Usuario_Receptor": sUserReceptor,
          "num_Planta_Origen": sPlantaOri,
          "num_Planta_Destino": sPlantaDes,
          "cod_Usuario_Seguridad_Emisor": "",
          "cod_Usuario_Seguridad_Receptor": "",
          "cod_Tipo_Memo": sTipMemo,
          "cod_Motivo_Memo": sCodMotivo,
          "accion": "I",
          "detalle": this.dataDetalles
        };

        //console.log('onSave-data', data);
        //return;

        //GUARDAR
        this.SpinnerService.show();
        this.serviceMemorandum.postProcesoMntoMemorandum(data).subscribe({
            next: (response: any)=> {
              if(response.success){
                if (response.codeResult == 200){
                  this.toastr.success(response.message, '', {
                    timeOut: 2500,
                  });
                  this.dialogRef.close();

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
    })
  }

  onAddMaterial(){

    const sPlantaDes    = this.formulario.get('ctrol_planta_des')?.value || '';
    //const sCodMaterial  = this.formulario.get('ctrol_material')?.value || '';
    const sCodArt       = this.formulario.get('ctrol_glosa')?.value;
    const sCantMaterial = this.formulario.get('ctrol_cantidad')?.value || 0;
    const sCodMotivo    = this.formulario.get('ctrol_motivo')?.value || '';

    if (!sPlantaDes || sPlantaDes.trim() === '') {
      this.matSnackBar.open("¡Importante seleccionar al Usuario Destino Correcto!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }

    if (!sCodMotivo || sCodMotivo.trim() === '') {
      this.matSnackBar.open("¡Importante seleccionar el Motivo!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }

    // if (!sCodMaterial || sCodMaterial.trim() === '') {
    //   this.matSnackBar.open("¡Importante seleccionar Material!", 'Cerrar', {
    //     horizontalPosition: 'center',
    //     verticalPosition: 'top',
    //     duration: 1500,
    //   });
    //   return;
    // }    

    if (!sCodArt || sCodArt.trim() === '') {
      this.matSnackBar.open("¡Importante Ingresar el descripción de lo requerido !", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;      
    }

    if (!sCantMaterial || sCantMaterial == 0) {
      this.matSnackBar.open("¡Importante Ingresar Cantidad Material!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }

    // Verifica que el item no exista ya por el código
    const existe = this.listaDetalle.some(item => item.glosa === sCodArt);
    if (existe) {
      this.matSnackBar.open("¡Importante ya fue agregado!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });

      this.formulario.get('ctrol_glosa')?.setValue('');
      this.formulario.get('ctrol_cantidad')?.setValue('');      
      return;
    }

    //Agregamos Información del material seleccionado
    const nuevoItem: data_det = {
      num_Memo_Detalle: this.generarCorrelativo() ,
      num_Memo        : ''  ,
      glosa           : String(sCodArt)      ,
      cantidad        : Number(sCantMaterial)   ,
      flg_Estatus     : '0'                       ,
      usu_Registro    : this.sUsuario 
    };    
    // let nuevoItem: data_det = {
    //   //codigo        : sCodMaterial,
    //   descripcion   : sCodArt,
    //   cantidad      : sCantMaterial
    // }

    //this.listaDetalle.push({ ...nuevoItem });
    //this.dataSource.data = [...this.listaDetalle]; 
    //nuevoItem = { descripcion: '', cantidad: 0 }; // Limpiar

    this.dataDetalles.push(nuevoItem);
    this.dataSource.data = [...this.dataDetalles]; // Refrescar la tabla  

    //Limpia el detalle
    this.formulario.get('ctrol_glosa')?.setValue('');
    this.formulario.get('ctrol_cantidad')?.setValue('');
  }

  // Para eliminar un detalle por índice
  quitarDetalle(index: number) {
    this.dataDetalles.splice(index, 1);
    this.recalcularCorrelativos();
    this.dataSource.data = [...this.dataDetalles]; // refresca tabla

    console.log('this.dataDetalles', this.dataDetalles);
  }
  
  // Si quieres mantener correlativos al eliminar
  private recalcularCorrelativos() {
    this.dataDetalles.forEach((item, idx) => {
      item.num_Memo_Detalle = (idx + 1).toString().padStart(3, '0');
    });
  }    

  private generarCorrelativo(): string {
    const correlativo = (this.dataDetalles.length + 1).toString().padStart(3, '0');
    return correlativo;
  }    

  onUsuarioSeleccionado(event: MatSelectChange){
    const id = event.value;

    if(id){

      const usuarioDest = this.dataUsuarios.find(u => u.Cod_Usuario === id);

      const sCodTrab = usuarioDest.Cod_Trabajador;
      const sTipTrab = usuarioDest.Tip_Trabajador;

      this.serviceMemorandum.getUsuario(sCodTrab, sTipTrab).subscribe(
        (result: any) => {
          if (result.totalElements > 0) {
            const sCodPlantaDes = result.elements[0].cod_Planta;
            this.formulario.get('ctrol_planta_des')?.setValue(sCodPlantaDes);
          }
          else {
            this.formulario.get('ctrol_planta_des')?.setValue('');
            this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
      }));   
    }     
  }

  // onMaterialSeleccionado(event: MatSelectChange){
  //   const id = event.value;
  //   const material = this.dataMateriales.find(u => u.cod_Material_Memo === id);

  //   this.des_Material_Memo = material.descripcion; 
  // }
}
