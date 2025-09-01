import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';
import { DialogDefectosEmpaqueCajasComponent } from '../dialog-defectos-empaque-cajas/dialog-defectos-empaque-cajas.component';
import { DialogImagenEmpaqueCajasComponent } from '../dialog-imagen-empaque-cajas/dialog-imagen-empaque-cajas.component';

interface data_det {
  Num_Auditoria?: number; 
  Num_Caja?: string; 
  Cod_Auditor?: string; 
  Nom_Auditor?: string;
  Fec_Ini_Auditoria?: string;
  Fec_Fin_Auditoria?: string;
  Num_Vez?: number;
  Cod_Supervisor?: string;
  Flg_Estado?: string;
  Num_Packing?: number;
  Cod_Modulo?: string;
  Cod_Cliente?: string;
  Des_Modulo?: string;
  Des_Cliente?: string;
  Des_Destino?: string;
  Cod_Usuario?: string;
}

interface componentes {
  COMPONENTE?: string;
  ITEM?: string;
}

interface tallas {
  Cod_Talla?: string;
  Num_Prendas?: number;
  Cod_ColCli?: string;
}

@Component({
  selector: 'app-dialog-registro-empaque-cajas',
  templateUrl: './dialog-registro-empaque-cajas.component.html',
  styleUrls: ['./dialog-registro-empaque-cajas.component.scss']
})
export class DialogRegistroEmpaqueCajasComponent implements OnInit {

  formulario = this.formBuilder.group({
    Num_Auditoria: [0, Validators.required],
    Num_Caja: ['', [Validators.required, Validators.minLength(7)]],
    Num_Packing: [{value:'', disabled: true}],
    Num_Vez: [{value:'', disabled: true}],
    Des_Cliente: [{value:'', disabled: true}],
    Cod_PurOrd: [{value:'', disabled: true}],
    Cod_EstCli: [{value:'', disabled: true}],
    Cod_TemCli: [{value:'', disabled: true}],
    Des_Modulo: [{value:'', disabled: true}],
    Des_Planta: [{value:'', disabled: true}],
    Des_Destino: [{value:'', disabled: true}],
    Fecha: [{value:'', disabled: true}],
    Fec_Ini_Auditoria: [{value:'', disabled: true}],
    Nom_Auditor: [{value:'', disabled: true}],
    Flg_Estado: [''],
    Des_Estado: [{value:'', disabled: true}],
    Cod_Usuario: ['']
  }) 

  displayedColumns: string[] = ['Componente','Item'];
  displayedColumns2: string[] = ['Cod_Talla','Num_Prendas','Cod_ColCli'];

  dataSource: MatTableDataSource<componentes>;
  dataTallaSource: MatTableDataSource<tallas>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  columnsToDisplay2: string[] = this.displayedColumns2.slice();

  step = 0;
  lc_Numero: string = '';
  lc_Estado: string = '';
  ld_Fecha = new Date();
  lc_Img64: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar, 
    private spinnerService: NgxSpinnerService,
    private auditoriaAcabadosService: AuditoriaAcabadosService,   
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: data_det,
    private dialogRef: MatDialogRef<DialogRegistroEmpaqueCajasComponent>
  ) {
    this.dataSource = new MatTableDataSource();
    this.dataTallaSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    console.log(this.data)
    this.lc_Numero = this.data.Num_Auditoria.toString();
    this.lc_Estado = this.data.Flg_Estado;

    this.formulario.reset();
    this.formulario.patchValue({
      Num_Auditoria: this.data.Num_Auditoria,
      Num_Caja: this.data.Num_Caja,
      Num_Packing: this.data.Num_Packing,
      Num_Vez: this.data.Num_Vez,
      Des_Cliente: this.data.Des_Cliente,
      Des_Modulo: this.data.Des_Modulo,
      Des_Destino: this.data.Des_Destino,
      Fecha: this.data.Num_Auditoria != 0 ? this.data.Fec_Ini_Auditoria : this.ld_Fecha.toLocaleDateString(),
      Fec_Ini_Auditoria: this.data.Num_Auditoria != 0 ? this.data.Fec_Ini_Auditoria : this.ld_Fecha.toDateString(),
      Nom_Auditor: this.data.Nom_Auditor,
      Flg_Estado: this.data.Flg_Estado,
      Des_Estado: this.data.Flg_Estado == 'A' ? 'APROBADO' : this.data.Flg_Estado == 'R' ? 'RECHAZADO' : 'PENDIENTE',
      Cod_Usuario: this.data.Cod_Usuario
    });

    if(this.data.Num_Caja != ''){
      if(this.data.Num_Auditoria > 0){
        this.onCargarCaja(this.data.Num_Caja);
        this.formulario.controls['Num_Caja'].disable();
      } else {
        this.onValidarNumeroCaja();
      }
        
    }

  } 

  onIniciarAuditoria(formDirective): void{
    let numCaja: string = this.formulario.get('Num_Caja')?.value;

    if(numCaja.toString().length > 0){
      let data_det: data_det = {Num_Auditoria: this.formulario.get('Num_Auditoria')?.value, Num_Caja: this.formulario.get('Num_Caja')?.value, Fec_Ini_Auditoria: this.ld_Fecha.toUTCString(), Num_Vez: this.formulario.get('Num_Vez')?.value, Cod_Auditor: this.data.Cod_Auditor, Flg_Estado: this.formulario.get('Flg_Estado')?.value};
    
      let dialogRef = this.dialog.open(DialogDefectosEmpaqueCajasComponent, {
        disableClose: true,
        width: "700px",
        data: data_det
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          data_det = result.value;
          //console.log(data_det)
          if(data_det.Num_Auditoria != 0){
            this.formulario.patchValue({
              Num_Auditoria: data_det.Num_Auditoria,
              Flg_Estado: data_det.Flg_Estado,
              Des_Estado: data_det.Flg_Estado == 'A' ? 'APROBADO' : data_det.Flg_Estado == 'R' ? 'RECHAZADO' : 'PENDIENTE',
            });
    
            this.lc_Numero = data_det.Num_Auditoria.toString();
            this.lc_Estado = data_det.Flg_Estado;  
          }
        }
      });  
    }
  }

  onValidarNumeroCaja(){
    let numCaja: string = this.formulario.get('Num_Caja')?.value;
    //cambiar8
    if(numCaja.toString().length >= 8){
      this.auditoriaAcabadosService.Mant_AuditoriaEmpaqueCajas('V', 0, parseInt(numCaja), 0, '', '', '', 0, '', '')
        .subscribe((res: any) => {
          this.formulario.patchValue({
            Num_Vez: parseInt(res[0].Num_Vez) + 1
          });

          this.onCargarCaja(numCaja)
        });
    }
  }

  onCargarCaja(numCaja: string){
    this.auditoriaAcabadosService.Get_DetalleCajaEmpaque(numCaja)
    .subscribe((res: any) => {
      if(res[0].Num_Caja != 0){
        this.dataTallaSource = new MatTableDataSource(res);

        this.formulario.patchValue({
          Num_Packing: res[0].Num_Packing,
          Des_Cliente: res[0].Des_Cliente,
          Des_Modulo: res[0].Des_Modulo,
          Cod_PurOrd: res[0].Cod_PurOrd,
          Cod_EstCli: res[0].Cod_EstCli,
          Cod_TemCli: res[0].Cod_TemCli,
          Des_Planta: res[0].Des_Planta,
          Des_Destino: res[0].Des_Destino
        });

        this.lc_Img64 = res[0].Img64;

        this.auditoriaAcabadosService.Get_ComponenteCajaEmpaque(res[0].Cod_EstPro, res[0].Cod_Version)
          .subscribe((res: any) => {
            this.dataSource = res;
          });
      } else {
        this.formulario.patchValue({
          Num_Caja: '',
          Num_Packing: '',
          Des_Cliente: '',
          Des_Modulo: '',
          Cod_PurOrd: '',
          Cod_EstCli: '',
          Cod_TemCli: '',
          Des_Planta: '',
          Des_Destino: ''
        });

        this.lc_Img64 = "";
        this.dataSource = new MatTableDataSource([]);
        this.dataTallaSource = new MatTableDataSource([]);

        //this.matSnackBar.open(res[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
        Swal.fire(res[0].Respuesta, '', 'warning')
      }
    });

  }

  onVerImagen(){
    let data_img: any = {Img64: this.lc_Img64};
    
    let dialogRef = this.dialog.open(DialogImagenEmpaqueCajasComponent, {
      //disableClose: true,
      width: "900px",
      data: data_img
    });

    dialogRef.afterClosed().subscribe(result => {

    });

  }

  getTotal(){
    return this.dataTallaSource.data.map(t => t.Num_Prendas).reduce((acc, value) => acc + value, 0);
  }

  //Acordion

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  //-

}
