import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { GlobalVariable } from 'src/app/VarGlobals';

interface data {
  Id_Bolsa: number,
  Id_Bolsa_Det: number,
  Cod_OrdPro: string,
  Cod_Present: number,
  Cod_Talla: string,
  Cantidad: number
}

interface data_det {
  Id_Barra: number,
  Des_Present: string,
  Cod_Talla: string
}

@Component({
  selector: 'app-dialog-agregar-talla',
  templateUrl: './dialog-agregar-talla.component.html',
  styleUrls: ['./dialog-agregar-talla.component.scss']
})
export class DialogAgregarTallaComponent implements OnInit {

  Cod_Usuario = GlobalVariable.vusu;
  Id_Bolsa = 0;
  Id_Bolsa_Det = 0;
  Cantidad = 0;
  Cod_Talla = '';
  array: Array<any> = [];

  bloquear: boolean = true;

  displayedColumns_cab: string[] = ['Cantidad'];
  dataSource: MatTableDataSource<data>;
  clickedRows = new Set<data>();

  constructor(
    private dialog: MatDialogRef<DialogAgregarTallaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: data
  ) { }

  ngOnInit(): void {
    this.Cod_Talla = this.data.Cod_Talla
    this.Cantidad = this.data.Cantidad
  }

  capturarCant(data) {

    this.Cod_Talla = this.data.Cod_Talla
    this.data.Cantidad = data.target.value
    this.Cantidad = this.data.Cantidad
    this.bloquear = false
    console.log("Cantidad nueva: ", this.Cod_Talla, this.Cantidad)
  }

  guardarCant() {
    if (Number(this.data.Cantidad) >= 0) {
      this.dialog.close(this.data)
    }else{
      this.dialog.close()
    }

  }
}
