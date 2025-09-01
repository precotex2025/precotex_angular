import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Reproceso } from 'src/app/models/reproceso';
import { ReprocesoService } from 'src/app/services/reproceso.service';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { DialogConfirmacion2Component } from 'src/app/components/dialogs/dialog-confirmacion2/dialog-confirmacion2.component';
import { MotivoReproceso } from 'src/app/models/motivosReproceso';

@Component({
  selector: 'app-reproceso-partida',
  templateUrl: './reproceso-partida.component.html',
  styleUrls: ['./reproceso-partida.component.scss']
})
export class ReprocesoPartidaComponent implements OnInit {

  motivo: string = ''
  msgErrorfinal: string = ''
  lstReproceso: Reproceso[] = [];
  observacionReproceso: string = '';

  codigoMotivo: string = ''
  lstMotivosReprocesos: MotivoReproceso[] = []


  pipe = new DatePipe('en-US');
  dataSource = new MatTableDataSource<Reproceso>(this.lstReproceso);
  displayedColumns: string[] = ['select', 'Fecha_Registro', 'IdGrupo', 'Cod_Ordtra', 'Num_Secuencia', 'Cod_Tela', 'Cod_Comb', 'Kgs_Crudo', 'Flg_Principal'];
  selection = new SelectionModel<Reproceso>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  tituloDialogo: string = ''



  constructor(private reprocesoService: ReprocesoService, private matSnackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.observacionReproceso = ''
    /*
    this.reprocesoService.showPartidasReproceso().subscribe(
      data => {

        this.dataSource.data = data;
      },
      error => {
        this.matSnackBar.open("SaveRollos " + error, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
      }
    );

    */
    this.showPartidasSinReproceso();
    this.showMotivosReproceso();

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'items por pagina';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1}  - ${endIndex} de ${length}`;
    };

  }

  onProcesoSelectedPartidas(reproceso: Reproceso) {
    this.selection.toggle(reproceso);
    console.log(this.selection.selected);

  }

  saveReprocesos() {
    this.tituloDialogo = '¿Está Seguro de Grabar el Reproceso (SI/NO)?';
    let dialogRef = this.dialog.open(DialogConfirmacion2Component, { disableClose: true, data: { TELA: this.tituloDialogo } });
    dialogRef.afterClosed().subscribe(result => {
      if (this.selection.selected.length == 0) {
        this.matSnackBar.open("Debe Seleccionar al menos un Registro", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
      }
      if (result == 'true') {
        console.log("mandar parametros el motivo")
        console.log(this.codigoMotivo)

        this.reprocesoService.guardarReproceso(this.selection.selected, this.observacionReproceso, this.codigoMotivo).subscribe(
          data => {
            if (data == true) {
              this.observacionReproceso = '';
              this.showPartidasSinReproceso();
              this.matSnackBar.open("Se Grabó " + this.selection.selected.length + " Registro(s) Correctamente ", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
            }
          },
          error => {
            this.matSnackBar.open("Error Grabar Reproceso " + error, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
          }
        )
      }
      else {
        this.matSnackBar.open("Ud. Canceló la operación", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1000 })
      }
    })
  }


  showPartidasSinReproceso() {
    this.reprocesoService.showPartidasReproceso().subscribe(
      data => {

        this.dataSource.data = data;
      },
      error => {
        this.matSnackBar.open("Cargar Partidas " + error, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
      }
    );
  }

  onSubmit() { }

  showMotivosReproceso() {
    this.reprocesoService.motivosReprocesos().subscribe(data => {
      this.lstMotivosReprocesos = data;
      this.codigoMotivo = data[0].Cod_Motivo_Reproceso;
    })
  }


  Filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



}
