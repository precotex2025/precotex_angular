import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';


interface data {
  data:      string, 
}

@Component({
  selector: 'app-dialog-ver-imagen',
  templateUrl: './dialog-ver-imagen.component.html',
  styleUrls: ['./dialog-ver-imagen.component.scss']
})
export class DialogVerImagenComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: data) {

    console.log(this.data);
  }

  ngOnInit(): void {
  }

}
