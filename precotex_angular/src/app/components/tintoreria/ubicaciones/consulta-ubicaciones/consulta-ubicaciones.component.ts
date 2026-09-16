import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UbicacionesService } from 'src/app/services/tintoreria/ubicaciones.service';
import { GlobalVariable } from 'src/app/VarGlobals';

const ETIQUETAS_OPERACION: { [key: string]: string } = {
  'REUBICACION_GRUPO': 'REUBICACIÓN',
  'AGRUPAMIENTO': 'AGRUPAMIENTO',
  'INGRESO': 'INGRESO'
};

@Component({
  selector: 'app-consulta-ubicaciones',
  templateUrl: './consulta-ubicaciones.component.html',
  styleUrls: ['./consulta-ubicaciones.component.scss']
})
export class ConsultaUbicacionesComponent implements AfterViewInit {
  @ViewChild('inputScan') inputScan!: ElementRef;

  Cod_Almacen: string = 'Q2';
  operario: string = GlobalVariable.vusu;

  Codigo_Escaneado: string = '';
  resultado: any = null;

  constructor(
    private router: Router,
    private ubicacionesService: UbicacionesService,
    private spinnerService: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngAfterViewInit(): void {
    this.inputScan.nativeElement.focus();
  }

  consultarKardex(): void {
    if (!this.Codigo_Escaneado) {
      return;
    }

    this.spinnerService.show();
    this.ubicacionesService.getConsultaKardexPda(this.Cod_Almacen, this.Codigo_Escaneado).subscribe({
      next: (response: any) => {
        this.spinnerService.hide();
        if (response.success && response.element) {
          this.resultado = response.element;
        } else {
          this.toastr.warning(response.message || 'No se encontró información para el código escaneado', '', { timeOut: 2500 });
          this.Codigo_Escaneado = '';
          setTimeout(() => this.inputScan.nativeElement.focus(), 0);
        }
      },
      error: (error) => {
        this.spinnerService.hide();
        const body = error.error;
        const mensaje = body?.message || 'Error al consultar el kárdex';
        if (body?.success === false && body?.codeResult === 400) {
          this.toastr.warning(mensaje, '', { timeOut: 2500 });
        } else {
          this.toastr.error(mensaje, '', { timeOut: 2500 });
        }
        this.Codigo_Escaneado = '';
        setTimeout(() => this.inputScan.nativeElement.focus(), 0);
      }
    });
  }

  nuevaConsulta(): void {
    this.Codigo_Escaneado = '';
    this.resultado = null;
    setTimeout(() => this.inputScan.nativeElement.focus(), 0);
  }

  etiquetaOperacion(tipo: string): string {
    return ETIQUETAS_OPERACION[tipo] || tipo;
  }

  volverAUbicaciones(): void {
    this.router.navigate(['/Ubicaciones']);
  }

}
