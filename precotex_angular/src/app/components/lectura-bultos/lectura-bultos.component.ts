import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { LecturaBultosService } from 'src/app/services/LecturaBultos/lectura-bultos.service';

@Component({
  selector: 'app-lectura-bultos',
  templateUrl: './lectura-bultos.component.html',
  styleUrls: ['./lectura-bultos.component.scss']
})
export class LecturaBultosComponent implements OnInit {
  esPendiente: string = 'N';
  displayedColumns: string[] = [
    'detalle',
    'fecha',
    'movimiento',
    'bultos',
    'canLecturados',
    'peso',
    'lecturado'
  ];

  dataSource = new MatTableDataSource<any>([]);
  
  filtro = {
    fecha: new Date(),
    almacen: null,
    verPendientes: false,
    movimiento: null
  };

  // almacenes: any[] = [
  //   { id: 1, nombre: 'Almacén Central' },
  //   { id: 2, nombre: 'Almacén Secundario' }
  // ];

  almacenes: {codigo: string, descripcion: string} [] = []

  constructor(
    private router: Router,
    private service: LecturaBultosService
  ) {}

  ngOnInit(): void {
    this.ListarAlmacenesEnCombo();
    
    //this.buscar();
  }

  buscar(): void {
    // this.dataSource.data = [
    //   { fecha: new Date(), nroMov: 248889, bultos: 11, peso: 112, todosLecturados: true },
    //   { fecha: new Date(), nroMov: 248890, bultos: 5, peso: 50, todosLecturados: false }
    // ];
    this.ListarMovimientos(this.filtro.movimiento, this.filtro.almacen, this.filtro.fecha, this.esPendiente);
  }

  abrirDetalle(movimiento: any): void {
    let num_Mov: string = movimiento.num_MovStk;
    let cod_Alm: string = this.filtro.almacen;
    this.router.navigate(['/LecturaBultosListadoDetalle'], {
      queryParams: {
        Num_MovStk: num_Mov,
        Cod_Almacen: cod_Alm
      }
    });
  }

  ListarAlmacenesEnCombo(): void {
    this.service.getListarAlmacenesDisponibles().subscribe({
      next: (response: any) => {
        if(response.success) {
          if(response.totalElements > 0) {
            this.almacenes = response.elements.map((a: any) => ({
              codigo: a.codigo,
              descripcion: a.descripcion
            }));

            this.filtro.almacen = this.almacenes[0].codigo;
            
            this.ListarMovimientos(this.filtro.movimiento, this.filtro.almacen, this.filtro.fecha, this.esPendiente);
          }
        }
      }, 
      error: (error: any) => {

      }
    });
  }

  ListarMovimientos(Cod_Almacen: string,  Num_MovStk: string, Fec_MovStk: any, Flg_Pendiente: string): void {
    //let fec_Movstk: Date = Fec_MovStk;
    console.log(Cod_Almacen);
    console.log(Num_MovStk);
    console.log(Fec_MovStk);
    console.log(Flg_Pendiente);
    this.service.getListarMovimientos(Cod_Almacen, Num_MovStk, Fec_MovStk, Flg_Pendiente).subscribe({
      next: (response: any) => {
        if(response.success) {
          if (response.totalElements > 0) {
            this.dataSource.data = response.elements;
            // this.dataSource.sort = this.sort;
          }else{
            this.dataSource.data = [];
          }
        }
      }
    });
  }

  onTogglePendientes(): void {
    if (this.filtro.verPendientes) {
      this.esPendiente = 'S';
    } else {
      this.esPendiente = 'N';
    }
  }


}
