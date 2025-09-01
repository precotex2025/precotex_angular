import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface valor {
  medida: string;
}

@Component({
  selector: 'app-dialog-encogimiento-prenda-valor',
  templateUrl: './dialog-encogimiento-prenda-valor.component.html',
  styleUrls: ['./dialog-encogimiento-prenda-valor.component.scss']
})
export class DialogEncogimientoPrendaValorComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: valor) { }

  ngOnInit(): void {
  }

}
