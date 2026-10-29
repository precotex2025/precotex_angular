import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UbicacionesService } from 'src/app/services/tintoreria/ubicaciones.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reubica-ubica-grupo',
  templateUrl: './reubica-ubica-grupo.component.html',
  styleUrls: ['./reubica-ubica-grupo.component.scss']
})
export class ReubicaUbicaGrupoComponent implements AfterViewInit {
  @ViewChild('inputGrupo') inputGrupo!: ElementRef;
  @ViewChild('inputDestino') inputDestino!: ElementRef;

  Cod_Almacen: string = 'Q2';
  operario: string = GlobalVariable.vusu;

  Codigo_Barra_Grupo: string = '';
  Codigo_Rack_Destino: string = '';
  infoCarga: any = null;

  mostrarExito: boolean = false;
  mensajeExito: string = '';

  constructor(
    private router: Router,
    private ubicacionesService: UbicacionesService,
    private spinnerService: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngAfterViewInit(): void {
    this.inputGrupo.nativeElement.focus();
  }

  consultarGrupo(): void {
    if (!this.Codigo_Barra_Grupo) {
      return;
    }

    this.spinnerService.show();
    this.ubicacionesService.getListaDetalleBultosAgrupados(this.Cod_Almacen, 0, this.Codigo_Barra_Grupo).subscribe({
      next: (response: any) => {
        console.log('Respuesta del servicio getListaDetalleBultosAgrupados:', response);
        this.spinnerService.hide();

        if (response.success && response.totalElements > 0) {
          const primerBulto = response.elements[0];
          this.infoCarga = {
            idAgrupamiento: primerBulto.id_Agrupamiento,
            producto: primerBulto.producto,
            lote: primerBulto.lote,
            ubicacionActual: primerBulto.ubicacion_Actual,
            cantidadBultos: response.totalElements
          };
          setTimeout(() => this.inputDestino.nativeElement.focus(), 0);
        } else {
          this.toastr.warning(response.message || 'No se encontró información para el código escaneado', '', { timeOut: 2500 });
          this.Codigo_Barra_Grupo = '';
          setTimeout(() => this.inputGrupo.nativeElement.focus(), 0);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.spinnerService.hide();

        // Aquí está tu objeto { codeResult, success, message, ... }
        const body = err.error.error || err.error || {};  

        console.error('Error al consultar el grupo:', body);

        const mensaje = body?.message || 'Error al consultar el grupo';

        if (body?.success === false && body?.codeResult === 400) {
          this.toastr.warning(mensaje, '', { timeOut: 2500 });
        } else {
          this.toastr.error(mensaje, '', { timeOut: 2500 });
        }

        this.Codigo_Barra_Grupo = '';
        setTimeout(() => this.inputGrupo.nativeElement.focus(), 0);
      }
    });
  }

  cambiarPaleta(): void {
    this.limpiarPantalla();
  }

  confirmarMovimiento(): void {
    if (!this.infoCarga || !this.Codigo_Rack_Destino) {
      return;
    }

    const data = {
      Accion: 'G',
      Id_Agrupamiento: this.infoCarga.idAgrupamiento,
      Num_Corre: '',
      Codigo_Ubicacion_Dest: this.Codigo_Rack_Destino,
      Cod_Usuario: GlobalVariable.vusu
    };

    this.spinnerService.show();
    this.ubicacionesService.postUbicarGrupoOBulto(data).subscribe({
      next: (response: any) => {
        this.spinnerService.hide();
        if (response.success) {

          if (response.codeTransacc === 1) {
            this.reproducirBeep(false);
            this.toastr.warning(response.message || 'No se pudo reubicar el grupo', '', { timeOut: 2500 });
            this.Codigo_Rack_Destino = '';
            setTimeout(() => this.inputDestino.nativeElement.focus(), 0);
          } else {
            this.reproducirBeep(true);
            this.mostrarNotificacionExito(response.message || 'Grupo reubicado correctamente');
          }

        } else {
          this.reproducirBeep(false);
          this.toastr.error(response.message || 'No se pudo vincular el bulto', '', { timeOut: 2500 });
        }
      },
      error: (error) => {
        this.spinnerService.hide();
        this.reproducirBeep(false);
        this.toastr.error(error.error?.message || 'Error al reubicar el grupo', '', { timeOut: 2500 });
        setTimeout(() => this.inputDestino.nativeElement.focus(), 0);
      }
    });
  }

  private mostrarNotificacionExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    this.mostrarExito = true;
    setTimeout(() => {
      this.mostrarExito = false;
      this.limpiarPantalla();
    }, 2200);
  }

  private limpiarPantalla(): void {
    this.Codigo_Barra_Grupo = '';
    this.Codigo_Rack_Destino = '';
    this.infoCarga = null;
    setTimeout(() => this.inputGrupo.nativeElement.focus(), 0);
  }

  private reproducirBeep(exito: boolean): void {
    try {
      const AudioContextRef = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextRef();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.value = exito ? 880 : 220;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.15);
    } catch {
      // Beep es un extra sonoro; si el navegador lo bloquea, no debe interrumpir el flujo.
    }
  }

  volverAUbicaciones(): void {
    this.router.navigate(['/Ubicaciones']);
  }

}
