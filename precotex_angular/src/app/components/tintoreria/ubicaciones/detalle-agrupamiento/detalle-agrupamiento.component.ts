import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UbicacionesService } from 'src/app/services/tintoreria/ubicaciones.service';
import { GlobalVariable } from 'src/app/VarGlobals';

@Component({
  selector: 'app-detalle-agrupamiento',
  templateUrl: './detalle-agrupamiento.component.html',
  styleUrls: ['./detalle-agrupamiento.component.scss']
})
export class DetalleAgrupamientoComponent implements OnInit, AfterViewInit {
  @ViewChild('bultoInputAgregar') bultoInputAgregar!: ElementRef;
  @ViewChild('bultoInputEliminar') bultoInputEliminar!: ElementRef;

  esNuevo: boolean = true;
  Cod_Almacen: string = '';
  operario: string = GlobalVariable.vusu;
  Id_Agrupamiento: string = '';
  Codigo_Barra_Grupo: string = '';
  Codigo_Barra_Bulto_Agregar: string = '';
  Codigo_Barra_Bulto_Eliminar: string = '';

  displayedColumns: string[] = ['num_Corre', 'producto', 'lote', 'peso_Neto', 'flg_Status', 'fec_Creacion'];
  columnLabels: { [key: string]: string } = {
    num_Corre: 'Bultos',
    producto: 'Producto',
    lote: 'Lote',
    peso_Neto: 'P. Neto',
    //ubicacion: 'Ubicación'
    flg_Status: 'Estado',
    fec_Creacion: 'F. Creación'
  };
  dataSource = new MatTableDataSource<any>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ubicacionesService: UbicacionesService,
    private spinnerService: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.Id_Agrupamiento = params['Id_Agrupamiento'] !== undefined ? String(params['Id_Agrupamiento']) : '';
      this.Cod_Almacen = params['Cod_Almacen'] !== undefined ? String(params['Cod_Almacen']) : 'Q2';
      this.Codigo_Barra_Grupo = params['Codigo_Barra_Grupo'] !== undefined ? String(params['Codigo_Barra_Grupo']) : '';
      this.esNuevo = !this.Id_Agrupamiento;
      this.dataSource.data = [];

      if (this.esNuevo) {
        console.log(`Creando nuevo grupo en el almacen ${this.Cod_Almacen} con operario ${this.operario}`);
        this.crearGrupo();
      } else {
        console.log(`Cargando detalle del grupo ${this.Codigo_Barra_Grupo} en el almacen ${this.Cod_Almacen}`);
        this.cargarDetalle();
      }
    });
  }

  ngAfterViewInit(): void {
    this.bultoInputAgregar.nativeElement.focus();
  }

  crearGrupo(): void {
    this.spinnerService.show();
    const data = {
      Accion: 'C',
      Id_Bulto_Hilado_Grupo: 0,
      Num_Corre: '',
      Cod_Usuario: GlobalVariable.vusu
    };

    this.ubicacionesService.postInsertarBultoGrupo(data).subscribe({
      next: (response: any) => {
        this.spinnerService.hide();
        if (response.success) {
          this.Id_Agrupamiento = response.element.idAgrupamiento;
          this.Codigo_Barra_Grupo = response.element.codigoBarraGrupo;
          this.esNuevo = false;
          this.toastr.success(response.message || 'Grupo creado correctamente', '', { timeOut: 2500 });

          //Carga el detalle del grupo recién creado
          this.cargarDetalle();

        } else {
          this.toastr.error(response.message || 'No se pudo crear el grupo', '', { timeOut: 2500 });
        }
      },
      error: (error) => {
        this.spinnerService.hide();
        this.toastr.error(error.error?.message || 'Error al crear el grupo', '', { timeOut: 2500 });
      }
    });
  }

  cargarDetalle(): void {
    this.spinnerService.show();
    this.ubicacionesService.getListaBultoUbicaciones(this.Cod_Almacen, this.Codigo_Barra_Grupo).subscribe({
      next: (response: any) => {
        this.spinnerService.hide();
        if (response.success && response.totalElements > 0) {
          this.dataSource.data = response.elements;
        } else {
          this.dataSource.data = [];
        }
      },
      error: (error) => {
        this.spinnerService.hide();
        this.dataSource.data = [];
        this.toastr.error(error.error?.message || 'Error al consultar el detalle del grupo', '', { timeOut: 2500 });
      }
    });
  }

  vincularBulto(): void {
    if (!this.Codigo_Barra_Bulto_Agregar) {
      return;
    }
              console.log('Id Agrupamiento desde vincularbulto',this.Id_Agrupamiento);
    const data = {
      Accion: 'I',
      Id_Bulto_Hilado_Grupo : this.Id_Agrupamiento,
      Num_Corre: this.Codigo_Barra_Bulto_Agregar,
      Cod_Usuario: GlobalVariable.vusu
    };

    this.ubicacionesService.postInsertarBultoGrupo(data).subscribe({
      next: (response: any) => {
        if (response.success) {
          if (response.codeTransacc === 1) {
            this.toastr.warning(response.message || 'No se pudo vincular el bulto', '', { timeOut: 2500 });
          } else {
            this.toastr.success(response.message || 'Bulto vinculado correctamente', '', { timeOut: 2500 });
            this.Codigo_Barra_Bulto_Agregar = '';
            this.cargarDetalle();
          }
        } else {
          this.toastr.error(response.message || 'No se pudo vincular el bulto', '', { timeOut: 2500 });
        }
        setTimeout(() => this.bultoInputAgregar.nativeElement.focus(), 0);
      },
      error: (error) => {
        this.toastr.error(error.error?.message || 'Error al vincular el bulto', '', { timeOut: 2500 });
        setTimeout(() => this.bultoInputAgregar.nativeElement.focus(), 0);
      }
    });
  }

  desvincularBulto(): void {
    if (!this.Codigo_Barra_Bulto_Eliminar) {
      return;
    }

    const data = {
      Accion: 'D',
      Id_Bulto_Hilado_Grupo : this.Id_Agrupamiento,
      Num_Corre: this.Codigo_Barra_Bulto_Eliminar,
      Cod_Usuario: GlobalVariable.vusu
    };

    this.ubicacionesService.postInsertarBultoGrupo(data).subscribe({
      next: (response: any) => {
        if (response.success) {
          if (response.codeTransacc === 1) {
            this.toastr.warning(response.message || 'No se pudo desvincular el bulto', '', { timeOut: 2500 });
          } else {
            this.toastr.success(response.message || 'Bulto desvinculado correctamente', '', { timeOut: 2500 });
            this.Codigo_Barra_Bulto_Eliminar = '';
            this.cargarDetalle();
          }
        } else {
          this.toastr.error(response.message || 'No se pudo desvincular el bulto', '', { timeOut: 2500 });
        }
        setTimeout(() => this.bultoInputEliminar.nativeElement.focus(), 0);
      },
      error: (error) => {
        this.toastr.error(error.error?.message || 'Error al desvincular el bulto', '', { timeOut: 2500 });
        setTimeout(() => this.bultoInputEliminar.nativeElement.focus(), 0);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/CrearAgrupamiento']);
  }

}
