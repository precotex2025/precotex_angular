
import { Component, OnInit, ViewChild, OnDestroy  } from '@angular/core';
import { FormBuilder,FormGroup  } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmacionComponent } from '../dialogs/dialog-confirmacion/dialog-confirmacion.component';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { CortesEncogimientoService } from 'src/app/services/corte-encogimiento.service';
import { CortesMedidasComponent} from './cortes-medidas/cortes-medidas.component';
import { Subscription } from 'rxjs';
import { GlobalVariable } from 'src/app/VarGlobals';
import { Console } from 'console';


export interface CortesEncogimiento {
  id_Corte: string;
  nom_Cliente: string;
  cod_Partida: string;
  num_Secuencia: string;
  cod_Tela: string;
  des_Tela: string;
  des_Color: string;
  ancho_Real_cm: number;
  encogimiento_AnchoA: number;
  encogimiento_LargoA: number;
  encogimiento_Ancho_Lab: number;
  encogimiento_Largo_Lab: number;
  ancho_Antes_Lav: number;
  alto_Antes_Lav: number;
  ancho_Despues_Lav: number;
  alto_Despues_Lav: number;
  fecha_Creacion: Date;
  check_Seleccionado: boolean;
  Sesgadura: string;
  encogimiento_Ancho: number;
  encogimiento_Largo: number;
  estado_Medida_Antes: boolean;
  estado_Medida_Despues: Boolean;
}

export class VersionPrograma{
  Version: string = '';
}

@Component({
  selector: 'app-cortes-encogimiento',
  templateUrl: './cortes-encogimiento.component.html',
  styleUrls: ['./corte-encogimiento1.component.scss']
})
export class CortesEncogimientoComponent implements OnInit, OnDestroy {
      icon: string = 'edit';
      filtroVersion: Observable<VersionPrograma[]> | undefined;
      miFormulario: FormGroup;
      private subscription!: Subscription;
      //* Declaramos formulario para obtener los controles */
      formulario = this.formBuilder.group({
      Programa: [''],
      Cod_Ordtra: [''],
      Tip_Pasta: ['']
    })
    listaParida: any[] = [];
    Opcion = '';
    Tipo = '';
    Cod_Ordtra = '';
    Version_B = '';
    PerfilUsuario: number;
    sCod_Usuario = GlobalVariable.vusu;

    CambiarVersion(Version: string) {
      this.Version_B = Version

    }

    mostrarFornulario: boolean = false; // Condición para mostrar la columna

    displayedColumns: string[] = ['Check_Seleccionado','Nom_Cliente', 'Cod_Partida', 'Des_Tela',
      'Des_Color', 'Ancho_Real_cm', 'Encogimiento_AnchoA', 'Encogimiento_LargoA', 'Encogimiento_Ancho_Lab', 'Encogimiento_Largo_Lab'
      ,'Ancho_Antes_Lav_cm', 'Largo_Antes_Lav_cm',
      'Ancho_Despues_Lav_cm','Largo_Despues_Lav_cm','Sesgadura','Encogimiento_Ancho', 'Encogimiento_Largo','Acciones']

    // Método para actualizar columnas dinámicamente
    actualizarColumnas() {
      this.displayedColumns = ['Check_Seleccionado', 'Nom_Cliente', 'Cod_Partida', 'Des_Tela',
        'Des_Color', 'Ancho_Real_cm',
        'Ancho_Antes_Lav_cm','Largo_Antes_Lav_cm',
        'Ancho_Despues_Lav_cm', 'Largo_Despues_Lav_cm','Acciones'
      ];
    }

    dataSource: MatTableDataSource<CortesEncogimiento>;

    constructor(  private formBuilder: FormBuilder,
                  public dialog: MatDialog,
                  private toastr: ToastrService,
                  private matSnackBar: MatSnackBar,
                  private CortesEncogimientoService: CortesEncogimientoService,
                  private SpinnerService: NgxSpinnerService) { this.dataSource = new MatTableDataSource()}



    @ViewChild('table', { static: true }) table: MatTable<CortesEncogimiento>;

    ngOnInit(): void {
      this.ListarCorteEncogimiento();
      this.subscription = this.CortesEncogimientoService.actualizarVista$.subscribe(() => {
        this.ListarCorteEncogimiento();
      });
      this.BuscarUsuario();
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

    drop(event: CdkDragDrop<string>) {
      const previousIndex = this.dataSource.data.findIndex(d => d === event.item.data);
      moveItemInArray(this.dataSource.data, previousIndex, event.currentIndex);
      //this.SaveSecuenciaPrograma(previousIndex.toString(), event.currentIndex.toString())
      this.table.renderRows();
    }


    ListarCorteEncogimiento() {
      this.CortesEncogimientoService.listarCorteEncogimeinto(
      ).subscribe({
        next: (response: any)=> {
          if(response.success){
            if (response.totalElements > 0){
              console.log(response.elements);
              this.dataSource.data = response.elements;
              this.SpinnerService.hide();
            }
            else{
              this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.dataSource.data = []
              this.SpinnerService.hide();
            }
          }
        },
        error: (error) => {
          this.SpinnerService.hide();
          this.toastr.error(error.error.message, 'Cerrar', {
          timeOut: 2500,
          });
        }
      });
    }

    AgregaItem(Item: string) {

      const partida = this.formulario.get('Cod_Ordtra')?.value;

      if ((partida.length > 0 && partida.length < 6 && Item == 'I') || Item =='L') {

        let dialogRef = this.dialog.open(DialogConfirmacionComponent, { disableClose: true, data: {} });
        dialogRef.afterClosed().subscribe(result => {
          if (result == 'true') {
            this.Opcion = Item
            this.Cod_Ordtra = partida

            this.CortesEncogimientoService.insertCorteEncogimeinto(
              this.Opcion,
              this.Cod_Ordtra,
              ).subscribe(
                (result: any) => {

                  if(result.totalElements == 0){
                    this.matSnackBar.open('La partida se registro correctamente.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
                    this.ListarCorteEncogimiento();
                    this.formulario.get('Cod_Ordtra')?.setValue("");
                  }
                  else {
                    this.matSnackBar.open('La partida ya existe.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
                    this.ListarCorteEncogimiento();
                  }

                  /*else {
                    this.matSnackBar.open('Ha ocurrido un error al insertar partida.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
                  }*/
                  this.ListarCorteEncogimiento();
                  this.formulario.get('Cod_Ordtra')?.setValue("");
                },
                (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
                  duration: 1500,
                }))
          }
        })
      }
    }

    BuscarDatos() {

      const partida = this.formulario.get('Programa')?.value;

      if ((partida.length > 0)) {

        this.CortesEncogimientoService.buscarCorteEncogimiento(partida
        ).subscribe(
          (result: any) => {
            this.dataSource.data = result.elements;
            console.log(result.elements);
            console.log(result.elements);
            this.SpinnerService.hide();
            //this.formulario.get('Programa')?.setValue("");
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))
      }
      else{
        this.ListarCorteEncogimiento();
      }
    }

     // Variable para guardar los detalles seleccionados
    selectedRow: any;

    ModificarObs(row: any) {
        let dialogRef = this.dialog.open(CortesMedidasComponent, {
          data: {
            datos:row
          }
          ,position: {
            top: '0px'
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result == 'false') {
            this.ListarCorteEncogimiento();
          }
        })
    }

    ChangeAprobacion(event, cod_Partida,num_Secuencia,encogimiento_Ancho_Lab,encogimiento_Largo_Lab,ancho_Antes_Lav,alto_Antes_Lav,ancho_Despues_Lav,alto_Despues_Lav) {
      console.log("event");
      console.log(event);
      console.log( cod_Partida,num_Secuencia,encogimiento_Ancho_Lab,encogimiento_Largo_Lab,ancho_Antes_Lav,alto_Antes_Lav,ancho_Despues_Lav,alto_Despues_Lav);

      if (ancho_Antes_Lav != 0 && alto_Antes_Lav != 0 && ancho_Despues_Lav != 0 && alto_Despues_Lav != 0) {
        console.log('Acceso concedido');
        this.listaParida.push({cod_Partida,num_Secuencia});
      } else {
        console.log('Acceso denegado');
        this.matSnackBar.open('No puede aprobar si la medida es igual a 0!!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
        this.ListarCorteEncogimiento();
        this.listaParida = [];
      }
    }

    GrabarData() {
      this.listaParida;
      if (this.listaParida.length > 0) {
        console.log("this.listaParida");
        console.log(this.listaParida);
        this.CortesEncogimientoService.updateMedidasTablaMaestra(this.listaParida).subscribe(
          (res: any) => {
            console.log("res");
            console.log(res.success);
            if (res.success == true) {
              this.matSnackBar.open('Se actualizo las medidas correctamente', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
              this.ListarCorteEncogimiento();
              this.listaParida = [];
            } else {
              this.matSnackBar.open('Ha ocurrido un error al actualizar las medidas.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
            }
          },
          (err: HttpErrorResponse) => {
            this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
          })

      } else {
        this.ListarCorteEncogimiento();
      }
    }

    EliminarRegistro(event, cod_Partida,num_Secuencia,check_Seleccionado) {
      const sOpcion : string = "D";

      const sAncho_Antes_Lav      : number = 0;
      const sAlto_Antes_Lav    : number = 0;
      const sAncho_Despues_Lav      : number = 0;
      const sAlto_Despues_Lav    : number = 0;
      const sSesgadura    : number = 0;

      if (check_Seleccionado == 1) {
        this.CortesEncogimientoService.listarCorteEncogimeintoDet(sOpcion, num_Secuencia, cod_Partida,sAncho_Antes_Lav,sAlto_Antes_Lav,sAncho_Despues_Lav,sAlto_Despues_Lav, sSesgadura).subscribe(
          (res: any) => {
            if (res.success == true) {
              this.matSnackBar.open('Se elimino registro correctamente', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
              this.ListarCorteEncogimiento();
            } else {
              this.matSnackBar.open('Ha ocurrido un error al eliminar registro.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
            }
          },
          (err: HttpErrorResponse) => {
            this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
          })

      } else {
        this.ListarCorteEncogimiento();
      }

    }

    BuscarUsuario() {

      this.CortesEncogimientoService.buscarUsuario(this.sCod_Usuario
      ).subscribe(
        (result: any) => {

          this.PerfilUsuario = result.elements[0].id_Corte;
          if(this.PerfilUsuario == 2){
              this.actualizarColumnas();
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
    }
}
