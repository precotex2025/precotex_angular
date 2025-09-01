import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MotivoImproductivo } from 'src/app/models/motivoImproductivo';
import { TelaFicha } from 'src/app/models/telaficha';

import { TiempoImproductivoService } from 'src/app/services/tiempo-improductivo.service';


interface data {
  codMaquina: string;
  desMaquina: string;

  cod_tela: string;
  x: number;
}

@Component({
  selector: 'app-tiempo-improductivo',
  templateUrl: './tiempo-improductivo.component.html',
  styleUrls: ['./tiempo-improductivo.component.scss']
})
export class TiempoImproductivoComponent implements OnInit {

  [x: string]: any;
  codigo: string = ''; descripcion = '';
  motivoProductivo: MotivoImproductivo = new MotivoImproductivo();
  lstMotivosImproductivos: MotivoImproductivo[] = [];
  msgErrorfinal:string='';
  partida: TelaFicha[] = []; displayedPartida: string[] = ['Cod_OrdTra']; selectionPartida = new SelectionModel<TelaFicha>(true, []);

  //horaFin: any = '';
  hoyDia: any = ''; // new Date();
  pipe = new DatePipe('en-US');
  btnInicioHora: boolean = false;
  btnInicioFin: boolean = false;


  observacion: string = '';


  constructor(@Inject(MAT_DIALOG_DATA) public data: any
    , private motivoImproductivoService: TiempoImproductivoService, private matSnackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    console.log("como Recibe id GSrupo")
    console.log(this.data.x)

    console.log("como Recibe Tela")
    console.log(this.data.cod_tela)


    this.codigo = this.data.codMaquina;
    this.descripcion = this.data.desMaquina;
    this.showMotivosImproductivos();
    this.showTelaPartidas();
    this.btnInicioHora = false;
    this.observacion = '';
  }

  showMotivosImproductivos() {
    this.motivoImproductivoService.showMotivosImproductivos().subscribe(data => {
      console.log("motivos improductivos");
      console.log(data);
      this.lstMotivosImproductivos = data;
      this.motivoProductivo = data[0];

    })
  }




  showTelaPartidas() {

    this.motivoImproductivoService.showTelaFichas(this.data.x, this.data.cod_tela).subscribe(
      data => {
        console.log("Fichas en Tiempos Improductivos");
        console.log(data);
        this.partida = data;

      }
    )

  }

  isAllSelectedPartida() {
    return this.selectionPartida.selected.length == this.partida.length;
  }


  tiempoInicio() {
    this.hoyDia = this.pipe.transform(Date.now(), 'dd/MM/yyyy hh:mm:ss a');
    this.btnInicioHora = true

  }

  tiempoTerminar() {


    let isFinal = confirm("¿Esta Seguro de Finalizar ?")
    if (isFinal) {
//fechaconvertido:Date;
  //    this.horaFin = this.pipe.transform(Date.now(), 'dd/MM/yyyy hh:mm:ss');
  
this.partida=[];
      this.motivoImproductivoService.saveTiemposImproductivos(this.partida,"I",this.codigo,0,this.motivoProductivo.Cod_Motivo_Impr,this.hoyDia,this.observacion).subscribe(data => {
        console.log(data);
        if(data==true){
          this.matSnackBar.open("Se grabó correctamente", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1000 })  
          this.btnInicioFin=false;
        }
      },
      error => {
        this.msgErrorfinal = error;
        this.matSnackBar.open("SaveRollos " + this.msgErrorfinal, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 })
      }
      
      )

    }

  }



}
