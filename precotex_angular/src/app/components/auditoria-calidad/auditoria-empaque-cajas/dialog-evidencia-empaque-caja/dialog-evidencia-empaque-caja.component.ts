import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from "ngx-spinner";

import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';

@Component({
  selector: 'app-dialog-evidencia-empaque-caja',
  templateUrl: './dialog-evidencia-empaque-caja.component.html',
  styleUrls: ['./dialog-evidencia-empaque-caja.component.scss']
})
export class DialogEvidenciaEmpaqueCajaComponent implements OnInit {
  formulario = this.formBuilder.group({
    Accion: ['', Validators.required],
    Num_Auditoria: [0, Validators.required],
    Num_Caja: [0, Validators.required],
    Peso_Caja: [0, Validators.required],
    Evidencia: ['', Validators.required],
    Cod_Usuario: ['']
  }) 

  lc_Numero: string = '';
  Imagen64: string = '';
  numImg: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private auditoriaAcabadosService: AuditoriaAcabadosService,   
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogEvidenciaEmpaqueCajaComponent>
  ) { }

  ngOnInit(): void {
    console.log(this.data.Num_Auditoria)
    this.formulario.reset();
    this.formulario.patchValue({
      Accion: this.data.Accion,
      Num_Auditoria: this.data.Num_Auditoria,
      Num_Caja: this.data.Num_Caja,
      Peso_Caja: this.data.Peso_Caja,      
      Evidencia: this.data.Evidencia,
      Cod_Usuario: this.data.Cod_Usuario
    });

    this.Imagen64 = this.data.Captura_64 ? this.data.Captura_64 : "";
    this.numImg = this.numImg + (this.data.Evidencia ? 1 : 0);
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
      console.log("aquio")
        this.Imagen64 = imagen.base;
        this.formulario.controls['Evidencia'].setValue(imagen.base);
        this.numImg = this.numImg + 1;
        console.log(this.Imagen64)
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
