import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActasAcuerdosService } from 'src/app/services/actas-acuerdos.service';
interface data {
  data: any

}
export interface PeriodicElement {
  IdParticipante: string;
  Nombres: string;
  Nombre: string;
  Apellidos: string;
  Telefono: string;
  Correo: string;
  Envio_Correo: string;
  Acepto: string;
  Rechazo: string;
  Firma: string;
  Cargo: string;
}


const ELEMENT_DATA: PeriodicElement[] = [

];

@Component({
  selector: 'app-dialog-actas-participantes',
  templateUrl: './dialog-actas-participantes.component.html',
  styleUrls: ['./dialog-actas-participantes.component.scss']
})
export class DialogActasParticipantesComponent implements OnInit {

  displayedColumns: string[] = [
    'Nombres',
    'Telefono',
    'Correo',
    'Cargo',
    'Envio_Correo',
    'Acepto'
  ];

  deshabilitar: boolean = false;

  oc: string = '';
  OP: string = '';
  Fecha_inicio = '';
  Fecha_Fin = '';
  dataTabla:Array<any> = [];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  constructor(private dialogRef: MatDialogRef<DialogActasParticipantesComponent>, private actasAcuerdosService: ActasAcuerdosService,
    @Inject(MAT_DIALOG_DATA) public data: data, private matSnackBar: MatSnackBar) { }

  ngOnInit(): void {
    console.log(this.data.data);
    this.cargarLista();
  }


  closeModal(){
    this.dialogRef.close();
  }

  cargarLista() {
    this.actasAcuerdosService.muestraParticipantesActa(this.data.data.IdActa).subscribe((res:any) => {
      if (res != null) {
        this.dataTabla = res;
        this.dataSource.data = this.dataTabla;
        console.log(this.dataTabla);
      }
    }, (err: HttpErrorResponse) => {
      this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3500 })
    })
  }
}
