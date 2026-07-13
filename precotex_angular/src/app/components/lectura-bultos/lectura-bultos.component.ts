import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { LecturaBultosService } from 'src/app/services/LecturaBultos/lectura-bultos.service';
import { Toast, ToastrService } from 'ngx-toastr';

interface data {
  Num_MovStk: string,
  Cod_Almacen: string,
  esCerrar: string
}

@Component({
  selector: 'app-lectura-bultos',
  templateUrl: './lectura-bultos.component.html',
  styleUrls: ['./lectura-bultos.component.scss']
})
export class LecturaBultosComponent implements OnInit, AfterViewInit {
  @ViewChild('movimientoInput') movimientoInput!: ElementRef;

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
  movimientosOriginales: any[] = [];
  
  filtro = {
    fecha: new Date(),
    almacen: null,
    verPendientes: false,
    movimiento: null,
    area: null
  };

  // almacenes: any[] = [
  //   { id: 1, nombre: 'Almacén Central' },
  //   { id: 2, nombre: 'Almacén Secundario' }
  // ];

  almacenes: {codigo: string, descripcion: string} [] = []

  constructor(
    private router: Router,
    private service: LecturaBultosService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.ListarAlmacenesEnCombo();
    
    //this.buscar();
  }

  ngAfterViewInit(): void {
    this.movimientoInput.nativeElement.focus();
  }

  buscar(): void {
    // this.dataSource.data = [
    //   { fecha: new Date(), nroMov: 248889, bultos: 11, peso: 112, todosLecturados: true },
    //   { fecha: new Date(), nroMov: 248890, bultos: 5, peso: 50, todosLecturados: false }
    // ];
    this.ListarMovimientos(this.filtro.almacen, this.filtro.movimiento, this.filtro.fecha, this.esPendiente, this.filtro.area ?? '');
    console.log(this.filtro.movimiento);
    setTimeout(() => this.movimientoInput.nativeElement.focus(), 0);
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
            //console.log(this.filtro.movimiento);
            let Num_MovStk: string = '';
            let Cod_Almacen: string = '';
            let esCerrar: string = 'N';

            this.route.queryParams.subscribe(params => {
              Num_MovStk = params['Num_MovStk'] !== undefined ? String(params['Num_MovStk']): '';
              Cod_Almacen = params['Cod_Almacen'] !== undefined ? String(params['Cod_Almacen']): '';
              //const fecha = params['Fec_MovStk'];
              esCerrar = params['esCerrar'] !== undefined ? String(params['esCerrar']): 'N';
              console.log(Num_MovStk, Cod_Almacen, esCerrar);
            });

            if (esCerrar === 'S'){
              this.filtro.almacen = Cod_Almacen;
              this.filtro.movimiento = Num_MovStk;
              this.esPendiente = 'N';
              this.ListarMovimientos(this.filtro.almacen, this.filtro.movimiento, this.filtro.fecha, this.esPendiente, this.filtro.area ?? '');
            }else{
              this.ListarMovimientos(this.filtro.almacen, this.filtro.movimiento, this.filtro.fecha, this.esPendiente, this.filtro.area ?? '');
            }
          }
        }
      }, 
      error: (error: any) => {

      }
    });
  }

  ListarMovimientos(Cod_Almacen: string,  Num_MovStk: string, Fec_MovStk: any, Flg_Pendiente: string, Area: string): void {
    //let fec_Movstk: Date = Fec_MovStk;
    // console.log(Cod_Almacen);
    console.log('el numero movimiento al inicio es: ', Num_MovStk);
    // console.log(Fec_MovStk);
    // console.log(Flg_Pendiente);
    this.service.getListarMovimientos(Cod_Almacen, Num_MovStk, Fec_MovStk, Flg_Pendiente, Area).subscribe({
      next: (response: any) => {
        if(response.success) {
          if (response.totalElements > 0) {
              if(Num_MovStk){
                let alerta = response.elements[0].num_MovStk;
                console.log(Num_MovStk);
                console.log(alerta);

                if(alerta === 'NO EXISTE'){
                  this.toastr.error('EL NUMERO DE MOVIMIENTO NO EXISTE', 'ERROR');
                  this.filtro.movimiento = '';
                  this.ListarMovimientos(this.filtro.almacen, this.filtro.movimiento, this.filtro.fecha, this.esPendiente, this.filtro.area ?? '');
                }else{
                  this.movimientosOriginales = response.elements;
                  this.filtrarLocalmente();
                }
              }else{
                this.movimientosOriginales = response.elements;
                this.filtrarLocalmente();
              }
            this.filtro.movimiento = '';
          }else{
            this.movimientosOriginales = [];
            this.filtrarLocalmente();
          }
        }
      }
    });
  }

  filtrarLocalmente(): void {
    if (!this.filtro.area) {
      this.dataSource.data = this.movimientosOriginales;
    } else {
      const areaBusqueda = this.filtro.area.toLowerCase();
      this.dataSource.data = this.movimientosOriginales.filter((m: any) => {
        if (m.area === undefined) {
          return true;
        }
        const areaMov = (m.area || '').toLowerCase();
        return this.normalizarTexto(areaMov).includes(this.normalizarTexto(areaBusqueda));
      });
    }
  }

  normalizarTexto(texto: string): string {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  onTogglePendientes(): void {
    if (this.filtro.verPendientes) {
      this.esPendiente = 'S';
    } else {
      this.esPendiente = 'N';
    }
  }

  onEnter(): void {
    this.ListarMovimientos(this.filtro.almacen, this.filtro.movimiento, this.filtro.fecha, this.esPendiente, this.filtro.area ?? '');
    setTimeout(() => this.movimientoInput.nativeElement.focus(), 0);
    //this.filtro.movimiento = '';
  }

}
