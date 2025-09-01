import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReposicionesService } from 'src/app/services/reposiciones/reposiciones.service';

@Component({
  selector: 'app-dialog-detalle-reposicion',
  templateUrl: './dialog-detalle-reposicion.component.html',
  styleUrls: ['./dialog-detalle-reposicion.component.scss']
})
export class DialogDetalleReposicionComponent implements OnInit {
  dataItems: Array<any> = [];
  local = false;
  constructor(private reposicionesService: ReposicionesService, private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService, @Inject(MAT_DIALOG_DATA) public data: any) {
    var cadena = document.location.href;
    console.log(document.location.href);

    var nueva = cadena.substring(0, 9);
    console.log(nueva);
    if (nueva == 'http://lo' || nueva == 'http://19') {
      this.local = true;
    } else {
      this.local = false;
    }
  }

  ngOnInit(): void {
    console.log(this.data.datos);
    this.getDetalles();
  }

  imprimirReposicion() {
    if (this.local == true) {
      window.open(`http://192.168.1.36/ws_android/app_CF_OBTENER_REPOSICION_CAB_IMP.php?Num_Solicitud=${this.data.datos.Num_Solicitud}`, '_blank');
    } else {
      window.open(`https://gestion.precotex.com/ws_android/app_CF_OBTENER_REPOSICION_CAB_IMP.php?Num_Solicitud=${this.data.datos.Num_Solicitud}`, '_blank');
    }
  }

  getDetalles() {
    this.reposicionesService.getReposiciones('O', this.data.datos.Num_Solicitud, '', '').subscribe(
      (result: any) => {
        console.log(result);
        if (result != false) {
          this.dataItems = result;
        } else {
          this.dataItems = [];
        }
      },
      (err: HttpErrorResponse) => {
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
      })
  }
}
