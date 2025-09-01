import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import { GlobalVariable } from 'src/app/VarGlobals';

interface data {
  data: any,
  result: Array<any>
}

export interface PeriodicElement {
  Cod_Empresa: string;
  Cod_Rol: string;
  Cod_Opcion: number;
  Des_Opcion: string;
}



const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-detalle-rol-usuario',
  templateUrl: './detalle-rol-usuario.component.html',
  styleUrls: ['./detalle-rol-usuario.component.scss']
})
export class DetalleRolUsuarioComponent implements OnInit {

  displayedColumns: string[] = ['Cod_Rol', 'Cod_Opcion', 'Des_Opcion', 'acciones'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  clickedRows = new Set<PeriodicElement>();
  dataRoles:Array<any> = [];

  opcion:any = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(@Inject(MAT_DIALOG_DATA) public data: data,
  private dialogRef: MatDialogRef<DetalleRolUsuarioComponent>,
  private seguridadControlVehiculoService: SeguridadControlVehiculoService,
  private matSnackBar: MatSnackBar) { }
  row:any = "";
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data.result);
    this.getOpciones();
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

  agregarColumna(row){
    this.row = row;
  }

  cerrarModal(){
    if(this.row != ''){
      this.dialogRef.close(this.row);
    }else{
      this.matSnackBar.open("Debes seleccionar un registro de la tabla..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  EliminarRegistro(data){
    console.log(data);
    let Opcion = 'D';
    var Cod_Empresa = '07';
    var Cod_Rol = data.Cod_Rol;
    var Cod_Opcion = data.Cod_Opcion;
    var Cod_Usuario_Reg = GlobalVariable.vusu;

    if(confirm("Desea eliminar el registro?")){
      this.seguridadControlVehiculoService.seg_insertar_opcion_rol(Opcion, Cod_Empresa, Cod_Rol, Cod_Opcion, Cod_Usuario_Reg).subscribe(res => {
        if(res[0].status == 1){
          this.matSnackBar.open(res[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.updateOpciones();
        }else{
          this.matSnackBar.open(res[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      }, (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
    }
    


  }

  updateOpciones(){
    this.seguridadControlVehiculoService.seg_listar_roles_opciones(
      'D', this.data.data.Cod_Rol
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          console.log(result);
          this.data.result = result;
          this.dataSource.data = this.data.result;
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  agregarOpcion(){
    console.log(this.opcion);
    if(this.opcion != '' && this.opcion != null){
      let Opcion = 'I';
      var Cod_Empresa = '07';
      var Cod_Rol = this.data.data.Cod_Rol;
      var Cod_Opcion = this.opcion;
      var Cod_Usuario_Reg = GlobalVariable.vusu;

      this.seguridadControlVehiculoService.seg_insertar_opcion_rol(Opcion, Cod_Empresa, Cod_Rol, Cod_Opcion, Cod_Usuario_Reg).subscribe(res => {
        if(res[0].status == 1){
          this.matSnackBar.open(res[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.opcion = '';
          this.updateOpciones();
        }else{
          this.matSnackBar.open(res[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      }, (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))

    }else{
      this.matSnackBar.open("Debes seleccionar una opción para agregar..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }
  closeModal(){
    this.dialogRef.close();
  }

  getOpciones(){
    this.seguridadControlVehiculoService.seg_listar_roles_opciones(
      'O', 0
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          console.log(result);
          this.dataRoles = result;
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }
}
