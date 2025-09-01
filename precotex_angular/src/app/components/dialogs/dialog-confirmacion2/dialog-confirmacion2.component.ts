import { Component, OnInit, Inject } from '@angular/core';
import {  MAT_DIALOG_DATA} from '@angular/material/dialog'

interface data{
  TELA: string
  
}
//this.data.TELA

@Component({
  selector: 'app-dialog-confirmacion2',
  templateUrl: './dialog-confirmacion2.component.html',
  styleUrls: ['./dialog-confirmacion2.component.scss']
})
export class DialogConfirmacion2Component implements OnInit {

  titulos:string=''

  constructor(@Inject(MAT_DIALOG_DATA) public data: any
    ) { }
  ngOnInit(): void {
    this.titulos= this.data.TELA;
  }


}