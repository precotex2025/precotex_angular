import { Component, Inject, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LecturaBultosService } from 'src/app/services/LecturaBultos/lectura-bultos.service';

interface data {
  Num_MovStk: string,
  Cod_Almacen: string
}

@Component({
  selector: 'app-lectura-bultos-det',
  templateUrl: './lectura-bultos-det.component.html',
  styleUrls: ['./lectura-bultos-det.component.scss']
})
export class LecturaBultosDetComponent implements OnInit {

  displayedColumns: string[] = ['num_Corre', 'peso_Neto', 'fec_Registro', 'cod_Usuario', 'flg_Lecturado'];
  dataSource = new MatTableDataSource<any>([]);
  movimiento: any = {};
  totalBultos: number = 0;
  lecturados: number = 0;
  pendientes: number = 0;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: data,
    private service: LecturaBultosService
  ) { }

  ngOnInit(): void {
    this.onGetParams();
  }

  onGetParams(): void {
    this.route.queryParams.subscribe(params => {
      this.data = {
        Num_MovStk: params['Num_MovStk'] ?? '',
        Cod_Almacen: params['Cod_Almacen'] !== undefined ? String(params['Cod_Almacen']) : ''
      };
    })

    this.movimiento.almacen = this.data.Cod_Almacen + '-' + this.data.Num_MovStk;
    console.log(this.data);
    console.log(this.movimiento.almacen);
    this.cargarDetalle(this.data.Num_MovStk, this.data.Cod_Almacen);
  }

  cargarDetalle(Num_MovStk: string, Cod_Almacen: string): void {
    this.service.getListarBultos(Num_MovStk, Cod_Almacen).subscribe({
      next: (response: any) => {
        if (response.success) {
          if (response.totalElements > 0){
            this.dataSource.data = response.elements;
            this.recalcularTotales();
          }else{
            this.dataSource.data = [];
            this.recalcularTotales();
          }
        }
      }
    });
  }

  onEnter(): void {
    this.actualizarLectura(this.data.Num_MovStk, this.data.Cod_Almacen, this.movimiento.nroMov);
  }

  actualizarLectura(Num_MovStk: string, Cod_Almacen: string, Num_Corre: string): void {
    const data = {
      Num_MovStk: Num_MovStk,
      Cod_Almacen: Cod_Almacen,
      Num_Corre: Num_Corre
    }

    this.service.patchLecturarBulto(data).subscribe({
      next: (response: any) => {
        this.cargarDetalle(this.data.Num_MovStk, this.data.Cod_Almacen);
        this.movimiento.nroMov = '';
      },
      error: (error: any) => {

      }
    });
  }

  private recalcularTotales(): void {
    this.totalBultos = this.dataSource.data.length;
    this.lecturados = this.dataSource.data.filter((d: any) => d.flg_Lecturado === 'S').length;
    this.pendientes = this.totalBultos - this.lecturados;
  }


  cerrar(): void {
    this.router.navigate(['/LecturaBultosListado']);
  }


}
