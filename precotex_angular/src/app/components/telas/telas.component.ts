import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Maquina } from 'src/app/models/maquina';
import { MaquinaProcesos } from 'src/app/models/maquinaProcesos';
import { Tela } from 'src/app/models/tela';

import { TelaFicha } from 'src/app/models/telaficha';

import { MatTableDataSource } from '@angular/material/table';

import { TelasService } from 'src/app/services/telas.service';
import { Telapartidas } from 'src/app/models/telaPartidas';

//import { MatSelect } from '@angular/material/select';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { Subscribable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';



import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmacion2Component } from 'src/app/components/dialogs/dialog-confirmacion2/dialog-confirmacion2.component'
import { Proceso } from 'src/app/models/proceso';
import { IfStmt, ThisReceiver } from '@angular/compiler';
import { ThemePalette } from '@angular/material/core';
import { TiempoImproductivoComponent } from '../tiempo-improductivo/tiempo-improductivo.component';
import { GlobalVariable } from 'src/app/VarGlobals';



@Component({
  selector: 'app-telas',
  templateUrl: './telas.component.html',
  styleUrls: ['./telas.component.scss']
})
export class TelasComponent implements OnInit {

  [x: string]: any;

  color: ThemePalette;

  hoyDia: Date = new Date();
  horaInicioProceso: any = null;
  msgErrorfinal: string = ''
  colores: string = 'black'

  pipe = new DatePipe('en-US');
  todayWithPipe: any = null;
  nombreUsuario: any = '';
  codUsuario: any = '';

  selectedValue: string = ''; desMaquina: string = '';
  selectedValue1: string = '';
  codBarra: string = '';
  idGrupo: number = 0;

  cod_tela: string = '';
  desc_tela: string = '';
  tela_principal: string = ''
  partidasfichas: string = '';


  maquina: Maquina[] = [];
  telaficha: TelaFicha[] = [];
  maquinaProcesos: MaquinaProcesos[] = [];
  tela: Tela = new Tela;
  telapartidas: Telapartidas[] = [];
  lstProcesosIdGrupo: Proceso[] = [];

  num_secuencia_Proceso: number = 0; fechaFinal: string = 'N';


  valorProceso: number = 0; listar_operacionColor: Telapartidas[] = [];

  //desMaquina: string = ""; codMaquina: string = '';

  lstRollosConCheck: Telapartidas[] = [];
  dataSourceRollosConCheck = new MatTableDataSource<Telapartidas>(this.lstRollosConCheck);

  array: Telapartidas = new Telapartidas();
  sOpcionGrabar = "I";

  dataSource = new MatTableDataSource<Telapartidas>(this.listar_operacionColor);

  Secuencia: number = 0;
  displayedColumns: string[] = ['select', 'Cod_OrdTra', 'Cod_tela', 'Des_Tela', 'Crudo'];
  //displayedColumnsRollo: string[] = ['select', 'Cod_OrdTra', 'Num_Secuencia', 'Cod_Tela', 'Des_Tela', 'kgs_crudo', 'Rollo', 'Sel'];
  //displayedColumnsRollo: string[] = ['select', 'Cod_OrdTra', 'Num_Secuencia', 'Cod_Tela', 'Des_Tela', 'kgs_crudo', 'Rollo'];
  //displayedColumnsRollo: string[] = ['select', 'Cod_OrdTra', 'Num_Secuencia', 'Cod_Tela', 'Des_Tela', 'kgs_crudo', 'Rollo', 'Sel'];
  displayedColumnsRollo: string[] = ['select', 'Cod_OrdTra', 'Num_Secuencia', 'Cod_Tela', 'Des_Tela', 'kgs_crudo', 'Sel'];
  //displayedColumnsRollo: string[] = ['select', 'Cod_OrdTra', 'Num_Secuencia', 'Cod_Tela', 'Des_Tela', 'kgs_crudo', 'Sel'];

  selection = new SelectionModel<TelaFicha>(true, []);
  selectionRollo = new SelectionModel<Telapartidas>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //deshabilitar boton de iniciar
  public btnIniciar: boolean = true; public btnImproductivo: boolean = true; public btnFinalizar:boolean = true; 

  constructor(private telaservice: TelasService, private matSnackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy hh:mm:ss');
    this.nombreUsuario = GlobalVariable.vusu
    this.codUsuario = GlobalVariable.vusu
    this.btnImproductivo = true;
    this.btnFinalizar=true;
    document.getElementById("idGrupo")?.focus();
    this.showMaquina();

    this.btnIniciar = false;
   


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

  revisar() {
    const tela = new Tela();
    tela.Cod_Tela = this.cod_tela;
    tela.Des_Tela = this.desc_tela;
    this.telaservice.showTelas(tela).subscribe(data => {
      this.desc_tela = data.Des_Tela;
    }
    )


  }

  onToggle() {
    if (this.codBarra.length >= 5) {
      let cadena = this.codBarra.split("'");
      this.idGrupo = Number(cadena[0]);
      this.cod_tela = cadena[1];
      this.revisar();
      this.showTelasfichas();
      this.onshowTelaPrincipal();
      this.showMaquina();



    }
  }

  showMaquina() {
    this.telaservice.showMaquina(this.codUsuario).subscribe(
      data => {
        this.maquina = data;
        this.selectedValue = data[0].Cod_Maquina;
        this.desMaquina = data[0].Des_Maquina;

      }
    )
    this.showMaquinaProcesos(this.selectedValue);
  }



  showMaquinaProcesos(codMaquina: string) {
    //console.log(codMaquina);
    this.telaservice.showMaquinaProcesos(codMaquina).subscribe(data => {
      console.log("showmaquina  ")
      console.log(data)
      this.maquinaProcesos = data;
      this.selectedValue1 = data[0].Cod_Proceso_Tinto;


      //this.showPartidas();// mostrar las partidas que estan idgrupo
      this.showRollosPartida();
      // this.validarReproceso()
    })

  }

  showTelasfichas() {
    this.telaservice.showTelaFichas(this.idGrupo, this.cod_tela).subscribe(
      data => {
        //  console.log(data);
        this.telaficha = data;
      }
    )

  }

  showRollosPartida() {


    this.selectionRollo.clear

    this.showProcesoIdGrupo();

    this.validarReproceso()



    if (this.valorProceso == 1) {
      this.sOpcionGrabar = 'U'
      this.btnIniciar = true
    }
    else {
      this.sOpcionGrabar = 'I'
      this.btnIniciar = false

    }
    console.log("para ver Numero de proceso despues")
    console.log(this.num_secuencia_Proceso)
    console.log("secuencia despues")
    console.log(this.Secuencia)


    this.color = "primary";
    this.dataSourceRollosConCheck.data = []// = new MatTableDataSource<Telapartidas>(this.lstRollosConCheck);
    this.dataSource.data = [];
    this.telaservice.showRollosPartidas(this.idGrupo, this.cod_tela, this.selectedValue1, this.num_secuencia_Proceso).subscribe(
      data => {

        console.log(" los datos a mostrar validar con los rollos")
        console.log(data)
        var contadorrollos = 0;
        this.dataSource.data = data;
        for (let index = 0; index < data.length; index++) {
          /** Calcular los seleccionados si Graba o Actualiza */
          if (data[index].Sel == -1) {
            const element = data[index];
            this.dataSourceRollosConCheck.data.push(element);
            console.log("para cambiar la opcion")
            console.log(this.valorProceso)
            // this.sOpcionGrabar = "U";
            contadorrollos = contadorrollos + 1
          }
          console.log("contador")
          console.log(contadorrollos)
          console.log("longitud data ")
          console.log(data.length)
          console.log("valor del proceso")
          console.log(this.valorProceso)



        }
        if (contadorrollos != data.length && this.valorProceso == 1) {
          this.btnIniciar = false
        }


      }
    )
    // se comenta xq valida desde el sql server 
    //this.validarBoton()
  }

  /*Partida */
  isAllSelectedPartida() {
    return this.selection.selected.length == this.telaficha.length;
  }


  toggleAllPartida() {
    if (this.isAllSelectedPartida()) {
      this.selection.clear();
      return;
    } else {
      this.selection.select(...this.telaficha);

    }
  }
  onProcesoSelectedPartida(telaficha: TelaFicha) {
    this.selection.toggle(telaficha);
    console.log(this.selection.selected);

  }

  /**
   * Rollos
   **/
  isAllSelectedRollos() {
    return this.selectionRollo.selected.length == this.dataSource.data.length;
  }

  toggleAllRollos() {
    if (this.isAllSelectedRollos()) {
      this.selectionRollo.clear();
      return;
    } else {
      this.selectionRollo.select(...this.dataSource.data);
    }
  }

  onProcesoSelectedRollos(telapartidas: Telapartidas) {
    this.selectionRollo.toggle(telapartidas);
    console.log(this.selectionRollo.selected);
  }

  /**
   * Tela Principal
   */

  onshowTelaPrincipal() {
    this.telaservice.showTelaPrincipal(this.idGrupo).subscribe(
      data => {
        this.tela_principal = data.Cod_Tela + ": " + data.Des_Tela;
      }
    );
  }


  newEscaner() {
    this.codBarra = '';
    document.getElementById("idGrupo")?.focus();
    // this.LimpiarRollos;

    this.btnImproductivo = true;
    this.btnFinalizar=true;
    this.btnIniciar = false;
  }

  showPartidas() {
    this.telaservice.showPartidas(this.idGrupo).subscribe(
      data => {
        this.partidasfichas = data.Resultado;
        /*console.log("componentes partidas");
        console.log(data);*/
      }
    )

  }

  SaveRollos() {
    console.log(" seleccion de rollos para grabar")
    console.log(this.selectionRollo.selected.length)

    let dialogRef = this.dialog.open(DialogConfirmacion2Component, { disableClose: true, data: { TELA: "Esta Seguro de Grabar SI/NO" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        /*
        if (this.selectionRollo.selected.length == 0) {
          this.matSnackBar.open("Debe Seleccionar al meno un Registro", 'Verifique', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
          return;
        }

        */
        // this.validarReproceso();

        console.log("a grabar elementos")
        console.log(this.selectionRollo.selected)
        console.log("para grabar o modificar")
        console.log(this.valorProceso)

        console.log("eligio a Opcion")
        console.log(this.sOpcionGrabar)
        /*
                this.telaservice.savePartidaRollos(this.selectionRollo.selected, this.selectedValue1, this.selectedValue, this.num_secuencia_Proceso, this.sOpcionGrabar, 'N', this.idGrupo).subscribe(
                  data => {
                    if (data == true) {
        
                      //Actualizar la lista
                      this.showRollosPartida();
                      this.matSnackBar.open("Se grabo " + this.selectionRollo.selected.length + " Registro(s) correctamente !!!...............", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
                    } else {
                      this.matSnackBar.open("error al Grabar", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
                    }
                  }
                  ,
                  error => {
                    this.msgErrorfinal = error;
                    this.matSnackBar.open("SaveRollos " + this.msgErrorfinal, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
                  }
                );
                */

        /** Limpiar */
        //      this.LimpiarRollos();
        this.horaInicioProceso = this.pipe.transform(Date.now(), 'dd/MM/yyyy HH:mm:ss');
        this.btnIniciar = true;
        this.btnImproductivo = false;
        this.btnFinalizar=false;

      }
    })
  }

  showProcesoIdGrupo() {
    this.telaservice.showProcesoIdGrupo(this.idGrupo).subscribe(
      data => {
        this.lstProcesosIdGrupo = data;

        for (let index = 0; index < data.length; index++) {
          if (data[index].Proceso.trim() == this.selectedValue1.trim()) {
            this.num_secuencia_Proceso = data[index].Secuencia;
          }
        }
        this.Secuencia = this.num_secuencia_Proceso
        console.log("tener la secuencia")
        console.log(this.Secuencia)
      }

    )
  }

  validarBoton() {
    //this.dataSource.data
    this.btnIniciar = true;
    for (let index = 0; index < this.dataSource.data.length; index++) {

      var conta = 0;
      console.log(this.dataSource.data[index].Sel)
      if (this.dataSource.data[index].Sel == 0) {
        this.btnIniciar = false;
      }
      if (this.dataSource.data[index].Sel == -1) {
        conta = conta + 1;
      }
      if (this.dataSource.data.length == conta) {
        this.fechaFinal = 'S'
      }
    }

  }

  /**Limpiar */
  LimpiarRollos() {
    this.codBarra = '0000-0000';
    this.cod_tela = '';
    this.maquinaProcesos = []
    this.telaficha = []
    this.idGrupo = 0
    this.cod_tela = ''
    this.dataSource.data = []
    this.telapartidas = []
    this.listar_operacionColor = []
    this.codBarra = '';
    document.getElementById("idGrupo")?.focus();
    this.btnIniciar = false
    this.selectionRollo.clear
  }


  visualizar() {
    this.telaservice.visualizarComentario().subscribe(
      data => {
        console.log("ver los comentarios")
        console.log(data)
      }
    )
  }


  TerminaProceso() {

    console.log("datos para ver los registros");
    console.log(this.dataSource.data);

    console.log("paso x alui en terminar")
    console.log(this.num_secuencia_Proceso)


    let dialogRef = this.dialog.open(DialogConfirmacion2Component, { disableClose: true, data: { TELA: "Esta Seguro de Final Proceso Si/No" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        var conta = 0;
        for (let index = 0; index < this.dataSource.data.length; index++) {

          if (this.dataSource.data[index].Sel == -1) {
            conta = conta + 1;
          }
        }

        this.fechaFinal = 'S'
        this.selectionRollo.select(...this.dataSource.data)
        this.telaservice.savePartidaRollos(this.selectionRollo.selected, this.selectedValue1, this.selectedValue, this.num_secuencia_Proceso, 'I', this.fechaFinal, this.idGrupo, this.horaInicioProceso, this.codUsuario).subscribe(
          data => {
            if (data == true) {
              this.matSnackBar.open("Se Finalizó el Proceso Correctamente !!!...............", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
            } else {
              this.matSnackBar.open("error al Finalizar el Proceso", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
            }

            this.btnFinalizar=true;
            this.btnImproductivo=true;
          }
          ,
          error => {
            this.msgErrorfinal = error;
            this.matSnackBar.open("funcion: savePartidaRollos  " + this.msgErrorfinal, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
          }
        );

      }
    })


    /*
        let dialogRef = this.dialog.open(DialogConfirmacionComponent, { disableClose: true, data: { TELA: "Esta Seguro de Final Proceso Si/No" } });
        dialogRef.afterClosed().subscribe(result => {
          if (result == 'true') {
            var conta = 0;
            for (let index = 0; index < this.dataSource.data.length; index++) {
         
              if (this.dataSource.data[index].Sel == -1) {
                conta = conta + 1;
              }
            }
            if (this.dataSource.data.length == conta) {
              this.fechaFinal = 'S'
              this.selectionRollo.select(...this.dataSource.data)
              this.telaservice.savePartidaRollos(this.selectionRollo.selected, this.selectedValue1, this.selectedValue, this.num_secuencia_Proceso, 'U', this.fechaFinal, this.idGrupo).subscribe(
                data => {
                  if (data == true) {
                    this.matSnackBar.open("Se Finalizó el Proceso Correctamente !!!...............", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
                  } else {
                    this.matSnackBar.open("error al Finalizar el Proceso", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
                  }
                }
                ,
                error => {
                  this.msgErrorfinal = error;
                  this.matSnackBar.open("funcion: savePartidaRollos  " + this.msgErrorfinal, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
                }
              );
            }
          }
        })
    
    
        */
  }

  validarReproceso() {


    for (let index = 0; index < this.telaficha.length; index++) {

      const element = this.telaficha[index];
      /*
      console.log(" numero de Secuenciaproceso")
      console.log(this.num_secuencia_Proceso)
      
           console.log("idGrupo")
           console.log(this.idGrupo)
           console.log("cod_tela")
           console.log(this.cod_tela)
           console.log("Cod_OrdTra")
           console.log(element.Cod_OrdTra)
           console.log("proceso")
           console.log(this.selectedValue1)
     */

      this.telaservice.validarReproceso(this.idGrupo, this.cod_tela, element.Cod_OrdTra, this.selectedValue1, this.num_secuencia_Proceso).subscribe(
        data => {
          console.log("valor de Reproceso")
          console.log(data)
          if (data > 0) {
            this.valorProceso = data;
            // this.sOpcionGrabar = 'I'
            //  this.btnIniciar = false;
          }
        }
      )
    }


  }

  /** Tiempos Improductivos  **/
  ProcesoImproductivo() {
    console.log(" lo que se envia en el improductivo")
    console.log(this.idGrupo);
    console.log(" Envia Tela")
    console.log(this.cod_tela);

    const dialogRef = this.dialog.open(TiempoImproductivoComponent,
      {
        disableClose: true, data: { codMaquina: this.selectedValue, desMaquina: this.desMaquina, cod_tela: this.cod_tela, x: this.idGrupo }
        , panelClass: 'color'
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log("paso el otro nivel")
      console.log(result)
    });
  }



}
