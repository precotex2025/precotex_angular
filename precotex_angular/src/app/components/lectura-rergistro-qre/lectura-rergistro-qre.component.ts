import { Component, OnInit  } from '@angular/core';
import { BrowserQRCodeReader } from '@zxing/browser';
import { QrReaderService } from 'src/app/services/lectura-registro-qre.service';



@Component({
  selector: 'app-lectura-rergistro-qre',
  templateUrl: './lectura-rergistro-qre.component.html',
  styleUrls: ['./lectura-rergistro-qre.component.scss']
})

export class LecturaRergistroQreComponent implements OnInit {

  private qrReader = new BrowserQRCodeReader();

  tipoOperacion: string = 'Mantenimiento';
  codigo: string = '';
  camaraActiva: boolean = true;
  qrValor: string = '';
  selectedDevice: MediaDeviceInfo | undefined;
  dispositivosDisponibles: MediaDeviceInfo[] = [];

  constructor(private LecturaRergistroQre: QrReaderService) { }

  ngOnInit(): void {

    this.obtenerDispositivos();
  }

  obtenerDispositivos() {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        this.dispositivosDisponibles = devices.filter(
          (d) => d.kind === 'videoinput'
        );
        if (this.dispositivosDisponibles.length > 0) {
          this.selectedDevice = this.dispositivosDisponibles[0];
        }
      })
      .catch((err) => {
        console.error('Error al obtener cámaras:', err);
      });
  }

  onScanSuccess(resultado: string) {
    this.codigo = resultado;
    console.log('QR leído:', resultado);
    // Puedes llamar automáticamente a registrar() si deseas:
    // this.registrar();
  }


  registrar() {
    if (!this.codigo) {
      alert('No se ha leído ningún código QR.');
      return;
    }

    const data = {
      tipoOperacion: this.tipoOperacion,
      codigo: this.codigo,
      fecha: new Date(),
    };

    console.log('Registro enviado:', data);
    // Aquí puedes llamar a un servicio para guardar
    // this.miServicio.guardarQR(data).subscribe(...)
  }

  toggleCamara() {
    this.camaraActiva = !this.camaraActiva;
    if (!this.camaraActiva) {
      this.selectedDevice = undefined;
    } else if (this.dispositivosDisponibles.length > 0) {
      this.selectedDevice = this.dispositivosDisponibles[0];
    }
  }

  cancelar() {
    this.codigo = '';
    this.camaraActiva = false;
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      try {
        const valor = await this.LecturaRergistroQre.leerQrDesdeArchivo(file);
        this.qrValor = valor;
        console.log('QR leído:', valor);
      } catch (error) {
        console.error('No se pudo leer el QR:', error);
        this.qrValor = 'Error al leer el QR.';
      }
    }
  }
}
