import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, timeout } from 'rxjs';
import { RetiroRepuestosService } from 'src/app/services/RetiroRepuestos/retiro-repuestos.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Result } from '@zxing/library';
import { DialogRetiroRepuestosDetalleComponent } from '../dialog-retiro-repuestos-detalle/dialog-retiro-repuestos-detalle.component';
import { MatSelect, MatSelectChange } from '@angular/material/select';

interface data {
   Title: string,
   Accion: string,
   num_requerimiento: number,
   nro_secuencia: number,
   cod_Item: string,
   des_Item: string
}

@Component({
  selector: 'app-dialog-retiro-repuestos-detalle-nuevo',
  templateUrl: './dialog-retiro-repuestos-detalle-nuevo.component.html',
  styleUrls: ['./dialog-retiro-repuestos-detalle-nuevo.component.scss']
})
export class DialogRetiroRepuestosDetalleNuevoComponent implements OnInit {

  fileName: string = '';
  selectedFile: File | null = null;

  formulario = this.formBuilder.group({
    ctrol_cod_item: [''],
    ctrol_des_item: [''],
    ctrol_uni_med: ['', [Validators.pattern]],
    ctrol_cant: [''],
    ctrol_rpt_cambio: [''],
    ctrol_itm_foto: [''],

    filtroProducto:['']
  });

  getErrorMessage() {
      return this.formulario.get('ctrol_uni_med')?.hasError('pattern') ? 'Ingrese solo números' : '';
  }

  dataProductos: any[] = [];
  ProductosFiltrados: any[] = [];
  dataListaRetirosPorNumReqySec: any[] = [];

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private serviceRetiroRepuestos: RetiroRepuestosService,
    @Inject(MAT_DIALOG_DATA) public data: data,
    public dialogRef: MatDialogRef<DialogRetiroRepuestosDetalleNuevoComponent>
  ) { }

  ngOnInit(): void {
    //this.formulario.get('ctrol_cod_item')?.disable();
    this.formulario.get('ctrol_des_item')?.disable();
    this.formulario.get('ctrol_uni_med')?.disable();
    this.formulario.get('ctrol_cant')?.disable();
    // this.getItems();
    
    if(this.data.Accion === 'Insertar'){
      //this.cargarProductos(null);
    }else
    {
      this.formulario.get('ctrol_des_item')?.setValue(this.data.des_Item);
      //this.cargarDatosItem(this.data.num_requerimiento, this.data.nro_secuencia);
      this.DatosCompletos();
    }
  }

  Procesar(){
   if(this.data.Accion === 'Insertar'){
      this.onConfirma();
   }else{
      this.onConfirma();
   } 
  }

  DatosCompletos(){
    this.cargarDatosItem(this.data.num_requerimiento, this.data.nro_secuencia);
    //this.cargarProductos();
  }

  filtrarProductos(){
    const filtrarTexto = this.formulario.get('filtroProducto')?.value?.toLowerCase();
    this.ProductosFiltrados = this.dataProductos.filter(producto =>
      producto.cod_Item.toLowerCase().includes(filtrarTexto) ||
      producto.des_Item.toLowerCase().includes(filtrarTexto)
    );
  }

  

  cargarDatosItem(Num_Req, Nro_Sec){
    this.serviceRetiroRepuestos.getDatosItemPorNumReqySecuencia(Num_Req, Nro_Sec).subscribe(
      (result:any) => {
        if(result.totalElements > 0){
          this.dataListaRetirosPorNumReqySec = result.elements;
          console.log(this.dataListaRetirosPorNumReqySec);
          // this.cargarProductos(this.dataListaRetirosPorNumReqySec[0].cod_Item);
          
          this.formulario.get('ctrol_uni_med')?.setValue(this.dataListaRetirosPorNumReqySec[0].cod_UniMed);
          this.formulario.get('ctrol_cant')?.setValue(this.dataListaRetirosPorNumReqySec[0].can_Requerida);
          this.formulario.get('ctrol_rpt_cambio')?.setValue(this.dataListaRetirosPorNumReqySec[0].rpt_Cambio);
          this.formulario.get('ctrol_itm_foto')?.setValue(this.dataListaRetirosPorNumReqySec[0].itm_Foto);
          
        }else{
          this.matSnackBar.open("No existen registros!", 'Cerrar',{
            horizontalPosition: 'center', verticalPosition: 'top', duration: 1500
          })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar',{
        duration: 1500
      })
    )
  }

  cargarProductos(){
    this.dataProductos = [];
    this.SpinnerService.show();
    this.serviceRetiroRepuestos.getItems().subscribe({
      next: (response: any) => {
        if(response.success){
          if(response.totalElements > 0){
            this.dataProductos = response.elements;
            this.SpinnerService.hide();

            // if (codProducto && codProducto.trim() !== ''){
            //     console.log('1', codProducto);
            //     this.usarProducto(codProducto);
            //   }


          }else{
            this.SpinnerService.hide();
          };
        }
      },
      error: (error) => {
        this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
          timeout:2500
        });
      }
    });
  }

  usarProducto(codigoProducto: string) {

    this.ProductosFiltrados = this.dataProductos.filter(item =>
       item.cod_Item.includes('MA000454')
      
    );

    // Busca si hay coincidencia exacta (opcional)
    const productoExacto = this.dataProductos.find(item =>
      item.cod_Item.trim() === codigoProducto.trim()
    );

    // Asigna el valor al mat-select si encuentra coincidencia
    if (productoExacto) {
      this.formulario.get('ctrol_des_item')?.setValue(productoExacto.cod_Item);
    }    

  }

  onProductoSeleccionado(event: MatSelectChange){
    const Cod_Item = event.value;
    console.log('Valor del evento', Cod_Item);
    if(Cod_Item){
      const productoDest = this.dataProductos.find(p => p.cod_Item === Cod_Item);
      const sProCod = productoDest.cod_Item;
      console.log('codigo', sProCod);
      this.serviceRetiroRepuestos.getDatositem(sProCod).subscribe(
        (result: any) => {
          if(result.totalElements > 0){
            const sProUniMed = result.elements[0].cod_UniMed;
            //this.formulario.get('ctrol_cod_item')?.setValue();
            this.formulario.get('ctrol_uni_med')?.setValue(sProUniMed);
          }else{
            this.formulario.get('ctrol_uni_med')?.setValue('');
            this.matSnackBar.open("No existen registros", 'Cerrar', {
              horizontalPosition: 'center', verticalPosition: 'top', duration: 1500
            })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar',
          {duration: 1500}
        )
      );
    }
  }

  onSave(){
      Swal.fire({
        title: "¿Desea Registrar el Retiro?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor:'#3085d6',
        cancelButtonColor:'#d33',
        confirmButtonText:'Si',
        cancelButtonText: 'No'
      }).then((result) =>{
        if(result.isConfirmed){
          const sCodItm = String(this.formulario.get('ctrol_des_item')?.value);
          //const sDesItm = (this.formulario.get('ctrol_des_item')?.value);
          //const sUniMed = (this.formulario.get('ctrol_uni_med')?.value);
          const sCant = (this.formulario.get('ctrol_cant')?.value);
          const sRptCambio = (this.formulario.get('ctrol_rpt_cambio')?.value);
          
          let data: any = {
            "Num_Requerimiento": this.data.num_requerimiento,
            "Cod_Item": sCodItm,
            "Can_Requerida": sCant,
            "Rpt_Cambio": sRptCambio,
            "Itm_Foto": ""
          };
  
  
          this.SpinnerService.show();
          this.serviceRetiroRepuestos.postRegistrarRequerimientoDetalle(data).subscribe({
            next: (response: any) => {
              if(response.success){
                if(response.codeResult == 200){
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
                  timeOut:2500
                });
                this.SpinnerService.hide();
              }
            },
            error:(error) => {
              this. SpinnerService.hide();
              this.toastr.error(error.message, 'Cerrar', {
                timeOut: 2500
              });
            }
          })
        }
      })
    }

    onEdit(){
      Swal.fire({
        title: "¿Desea Actualizar el Registro?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor:'#3085d6',
        cancelButtonColor:'#d33',
        confirmButtonText:'Si',
        cancelButtonText: 'No'
      }).then((result) =>{
        if(result.isConfirmed){
          //const sCodItm = String(this.formulario.get('ctrol_des_item')?.value);
          const sCant = (this.formulario.get('ctrol_cant')?.value);
          const sRptCambio = (this.formulario.get('ctrol_rpt_cambio')?.value);
          
          let data: any = {
            "Num_Requerimiento": this.data.num_requerimiento,
            //"Cod_Item": sCodItm,
            "Can_Requerida": sCant,
            "Rpt_Cambio": sRptCambio,
            "Itm_Foto": ""
          };
  
  
          this.SpinnerService.show();
          this.serviceRetiroRepuestos.patchActualizarRequerimientoDetalle(data).subscribe({
            next: (response: any) => {
              if(response.success){
                if(response.codeResult == 200){
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
                  timeOut:2500
                });
                this.SpinnerService.hide();
              }
            },
            error:(error) => {
              this. SpinnerService.hide();
              this.toastr.error(error.message, 'Cerrar', {
                timeOut: 2500
              });
            }
          })
        }
      })
    }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name;
      this.selectedFile = file;
    }
  }

  onConfirma(){
      let nombre = (this.formulario.get('ctrol_itm_foto')?.value);
      console.log('selectedFile', String(this.selectedFile).replace(/ /g,'%20'));
      console.log('filename', nombre);
      // let NombreArchivoSinEspacio = String(this.fileName).replace(/ /g, '%20'); 
      if(!this.selectedFile){
        this.selectedFile = nombre;
      }
      
      if (!this.selectedFile) {
          this.matSnackBar.open("No hay archivo seleccionado.", 'Cerrar', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 1500,
        });
        return;    
      }
      Swal.fire({
        title: '¿Actualizar Detalle?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then((result) => {    

        if (result.isConfirmed) {

          const sNum_Req = String(this.data.num_requerimiento);
          const sNum_Seq = String(this.data.nro_secuencia);
          const sCant = (this.formulario.get('ctrol_cant')?.value);
          const sRptCambio = (this.formulario.get('ctrol_rpt_cambio')?.value);

          
          const formData = new FormData();

          formData.append("nNum_Requerimiento", sNum_Req);
          formData.append("nNum_Secuencia", sNum_Seq);
          formData.append("nCan_Requerida", sCant);
          formData.append("sRpt_Cambio", sRptCambio);  
          formData.append("itm_Foto", this.selectedFile); // el archivo real 
          formData.append("sNombre_Archivo", this.selectedFile.name);  

          console.log('formData', formData);     
          
      this.SpinnerService.show();
      this.serviceRetiroRepuestos.patchActualizarRequerimientoDetalle(formData).subscribe({
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
      });
    
  }
}
