import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-capturar-foto-caja',
  templateUrl: './dialog-capturar-foto-caja.component.html',
  styleUrls: ['./dialog-capturar-foto-caja.component.scss']
})
export class DialogCapturarFotoCajaComponent implements OnInit {

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  mostrarModal: boolean = false;
  fotoBase64: string = '';
  imagen64: string | null = null;
  facingMode: 'user' | 'environment' = 'environment';
  ll_camara: boolean = true;  //false;  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogCapturarFotoCajaComponent>    
  ) { }

  ngOnInit(): void {
    this.abrirModal()
  }

  submit() :void{
    //this.dialogRef.close(this.fotoBase64);
    this.dialogRef.close(this.imagen64);
  }

  // Guardar Imangen
  onGuardarImagen(event: any){
    const archivoCapturado = event.target.files[0];

    // Preparar imagen a binario para previsualización
    const extraerBase64 = async ($event: any) => new Promise ((resolve) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL($event);
        reader.onload = () => {
          resolve({          
            base: reader.result
          });
        };
        reader.onerror = error => {
          resolve({
            base: null
          });
        };
      }
      catch (e) {
        resolve({
          base: null
        });
      }
    });
  
    // Generar imagen para previsualización
    extraerBase64(archivoCapturado).then((imagen: any) => {
        this.imagen64 = imagen.base;
        //this.formulario.controls['img_Evidencia'].setValue(imagen.base);
    });

    // Preperar imagen string a binario para grabar en servidor
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(archivoCapturado);

    this.ll_camara = true;
  }

  _handleReaderLoaded(readerEvent: any) {
    var binaryString = readerEvent.target.result;
    
    //this.formulario.patchValue({
    //  base64: btoa(binaryString)
    //}); 

  }

  // Capturar Imangen desde camara
  abrirModal() {
    this.mostrarModal = true;
    this.iniciarCamara(this.facingMode);
  }

  async iniciarCamara(facing: 'user' | 'environment') { 
    try { 
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: facing } 
      }); 
      this.video.nativeElement.srcObject = stream; 
    } catch (err) { 
      console.error('Error al iniciar cámara:', err); 
      this.ll_camara = false;
      this.mostrarModal = false;
    } 
  }

  capturarFoto(video: HTMLVideoElement) {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);

    let calidad: number = 0.7;
    let fotoBase64 = canvas.toDataURL('image/jpeg', calidad);

    const calcularPesoKB = (base64: string): number => {
      const stringLength = base64.length - 'data:image/jpeg;base64,'.length;
      const bytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
      return bytes / 1024; // convertir a KB
    };

    while (calcularPesoKB(fotoBase64) > 50 && calidad > 0.1) {
      calidad -= 0.1;
      fotoBase64 = canvas.toDataURL('image/jpeg', calidad);
    }

    this.imagen64 = fotoBase64;
    this.fotoBase64 = fotoBase64.replace(/^data:image\/jpeg;base64,/, "");
    
    //this.formulario.patchValue({
    //  base64: this.fotoBase64
    //});

    //this.cerrarModal();
    this.submit();
  }

  cambiarCamara() { 
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user'; 
    this.detenerCamara(); 
    this.iniciarCamara(this.facingMode); 
  }

  detenerCamara() { 
    const stream = this.video.nativeElement.srcObject as MediaStream; 
    if (stream) { 
      stream.getTracks().forEach(track => track.stop()); 
      this.video.nativeElement.srcObject = null; 
    }
  }

  cerrarModal(){
    this.mostrarModal = false;
    this.detenerCamara();
  }

  buscarImagen(){
    this.cerrarModal();
    this.ll_camara = false;
  }

}
