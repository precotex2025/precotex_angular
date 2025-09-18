import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from "ngx-spinner";
import { HttpErrorResponse } from '@angular/common/http';

import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';

@Component({
  selector: 'app-dialog-evidencia-packing-caja',
  templateUrl: './dialog-evidencia-packing-caja.component.html',
  styleUrls: ['./dialog-evidencia-packing-caja.component.scss']
})
export class DialogEvidenciaPackingCajaComponent implements OnInit {

  formulario = this.formBuilder.group({
    Accion: [''],
    Num_Packing: [0, Validators.required],
    Num_SecPacking: [0, Validators.required],
    Num_Auditoria: [{value:0, disabled: true}],
    Num_Caja: [{value:0, disabled: true}],
    Carton_Label: [''],
    Peso_Caja: [0],
    Evidencia: ['', Validators.required],
    Fec_Evidencia: [''],
    Cod_Usuario: ['']
  }) 

  lc_Numero: string = '';
  Imagen64: string = '';
  numImg: number = 0;
  ll_nuevo: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private auditoriaAcabadosService: AuditoriaAcabadosService,   
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogEvidenciaPackingCajaComponent>
  ) { }

  ngOnInit(): void {
    //console.log(this.data)
    this.formulario.controls['Num_Packing'].setValue(this.data.Num_Packing);
    this.formulario.controls['Cod_Usuario'].setValue(this.data.Cod_Usuario);
  }

  submit(formDirective) :void{
    const formData = new FormData();
    formData.append('Accion', 'G');
    formData.append('Num_Packing', this.formulario.get('Num_Packing')?.value);
    formData.append('Num_SecPacking', this.formulario.get('Num_SecPacking')?.value);
    formData.append('Num_Auditoria', this.formulario.get('Num_Auditoria')?.value);
    formData.append('Carton_Label', this.formulario.get('Carton_Label')?.value);
    formData.append('Peso_Caja', '0');
    formData.append('Evidencia', this.formulario.get('Evidencia')?.value);
    formData.append('Cod_Usuario', this.formulario.get('Cod_Usuario')?.value);
    
    this.spinnerService.show();
    this.auditoriaAcabadosService.Mant_EvidenciaEmpaque (formData)
      .subscribe((result: any) => {
        if (result.length > 0) {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.onLimpiarRegistro();
          this.spinnerService.hide();
        } else {
          this.matSnackBar.open('Error en el registro de la evidencia!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );    

  }

  onLimpiarRegistro(){
    this.formulario.patchValue({
      Num_SecPacking: 0,
      Num_Auditoria: 0,
      Num_Caja: 0,
      Peso_Caja: 0,
      Carton_Label: '',
      Evidencia: ''
    });
    this.Imagen64 = '';
  }

  onValidarSecuencia(){
    let numPack: number = this.formulario.get('Num_Packing')?.value;
    let numSec: number = this.formulario.get('Num_SecPacking')?.value;

    if(numPack>0 && numSec>0){

      const formData = new FormData();
      formData.append('Accion', 'B');
      formData.append('Num_Packing', numPack.toString());
      formData.append('Num_SecPacking', numSec.toString());
      formData.append('Num_Auditoria', '');
      formData.append('Carton_Label', '');
      formData.append('Peso_Caja', '0');
      formData.append('Evidencia', '');
      formData.append('Cod_Usuario', '');
      
      this.spinnerService.show();
      this.auditoriaAcabadosService.Mant_EvidenciaEmpaque (formData)
        .subscribe((result: any) => {
          if (result.length > 0) {
            //console.log(result)
            this.formulario.controls['Num_Auditoria'].setValue(result[0].Num_Auditoria);
            this.formulario.controls['Num_Caja'].setValue(result[0].Num_Caja);

            this.spinnerService.hide();
          } else {
            this.matSnackBar.open('Error en el registro de la evidencia!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.spinnerService.hide();
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      );

    }

  }

  onGuardarImagen(event: any){
    const archivoCapturado = event.target.files[0];

    // Preparar imagen a binario para previsualización
    const extraerBase64 = async ($event: any) => new Promise ((resolve) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL($event);
        reader.onload = () => {
          resolve({          
            base: reader.result
          });
        };
        reader.onerror = error => {
          resolve({
            base: null
          });
        };
      }
      catch (e) {
        resolve({
          base: null
        });
      }
    });
  
    // Generar imagen para previsualización
    extraerBase64(archivoCapturado).then((imagen: any) => {
        this.Imagen64 = imagen.base;
        this.formulario.controls['Evidencia'].setValue(imagen.base);
        this.numImg = this.numImg + 1;
        //console.log(this.Imagen64)
    });

    // Preperar imagen string a binario para grabar en servidor
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(archivoCapturado);

  }

  _handleReaderLoaded(readerEvent: any) {
    var binaryString = readerEvent.target.result;

    this.formulario.patchValue({
      imgbase64: btoa(binaryString)
    }); 

  }


}
