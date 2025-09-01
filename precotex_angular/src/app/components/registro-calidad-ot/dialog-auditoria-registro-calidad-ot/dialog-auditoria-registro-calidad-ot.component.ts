import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { IngresoRolloTejidoService } from 'src/app/services/ingreso-rollo-tejido.service';
import { MatTableDataSource } from '@angular/material/table';




interface data_det {
  codigo_rollo: string,
  codigo_defecto: string,
  des_defecto: string,
  cant_defecto: string,
  usuario_defecto: string,
  obs_defecto: string,
  grupo_defecto: string,
  
}


@Component({
  selector: 'app-dialog-auditoria-registro-calidad-ot',
  templateUrl: './dialog-auditoria-registro-calidad-ot.component.html',
  styleUrls: ['./dialog-auditoria-registro-calidad-ot.component.scss']
})
export class DialogAuditoriaRegistroCalidadOtComponent implements OnInit {
  
  
  x_Cliente =''
  x_Articulo =''
  x_Proveedor =''
  x_Os =''
  x_Ot =''
  x_Galga =''
  x_Diametro =''
  x_Titulo =''
  x_Lmalla =''
  x_LmallaReal =''
  x_Lote =''
  x_Acabado =''
  

  // codigo_rollo: string,
  // codigo_defecto: string,
  // des_defecto: string,
  // cant_defecto: string,
  // usuario_defecto: string,
  // obs_defecto: string,
  // grupo_defecto: string,

  displayedColumns: string[] = [
    'codigo_rollo',
    'codigo_defecto',
    'des_defecto',
    'cant_defecto',
    'usuario_defecto',
    'obs_defecto',
    'grupo_defecto',
    
  ];
  dataForExcel:any = [];
  dataSourceExcel:any = [];
  dataSource: MatTableDataSource<data_det> = new MatTableDataSource();
  dataReposiciones = [];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataItems: Array<any> = [];
  local = false;

  displayedColumns_cab: string[] = 
  ['codigo_rollo', 'codigo_defecto', 'des_defecto', 'cant_defecto', 'usuario_defecto','obs_defecto','grupo_defecto']

  //dataSource: MatTableDataSource<data_det>;

  constructor(private matSnackBar: MatSnackBar,  
    private ingresoRolloTejidoService: IngresoRolloTejidoService,
    private SpinnerService: NgxSpinnerService, @Inject(MAT_DIALOG_DATA) public data: any) 
    {
    this.dataSource = new MatTableDataSource();
    }




  ngOnInit(): void {
    this.MostrarDatosOt();
    this.getDetalleDefectos()
  }



  getDetalleDefectos() {
    this.ingresoRolloTejidoService.ShowDetalleDefectos(this.data.datos.Ot).subscribe(
      (result: any) => {
        console.log(result);
        if (result != false) {
          this.dataItems = result;
          //this.dataSource = result;
        } else {
          this.dataItems = [];
        }
      },
      (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
      })
  }

   

  MostrarDatosOt() {
    this.SpinnerService.show();

       this.ingresoRolloTejidoService.MostrarDetalleOt(this.data.datos.Ot, this.data.datos.Sec)  .subscribe(
      (result: any) => {
        if (result.length > 0) {
          console.log(result);
          this.x_Cliente = result[0].Nom_Cliente;
          this.x_Articulo= result[0].Cod_Tela+" - "+result[0].Des_Tela;
          this.x_Proveedor= result[0].Proveedor_Hilado;
          this.x_Os= result[0].Orden_Servicio;
          this.x_Ot= result[0].OT;
          this.x_Galga= result[0].Galga;
          this.x_Diametro= result[0].Diametro;
          this.x_Titulo= result[0].Titulo;
          this.x_Lmalla= result[0].Long_Malla;
          this.x_LmallaReal= result[0].Long_Malla_Real;
          this.x_Lote= result[0].Lote;
          
          

          this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.SpinnerService.hide();
          this.dataSource.data = []
          
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }






}
