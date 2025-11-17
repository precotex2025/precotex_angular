import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-capturar-foto-caja',
  templateUrl: './dialog-capturar-foto-caja.component.html',
  styleUrls: ['./dialog-capturar-foto-caja.component.scss']
})
export class DialogCapturarFotoCajaComponent implements OnInit {

  @ViewChild('video', { static: true }) video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  videoDevices: MediaDeviceInfo[] = [];
  selectedDeviceId: string | null = null;
  capturedImage: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogCapturarFotoCajaComponent>    
  ) { }

  ngOnInit(): void {
    this.checkPermission();
  }

  submit() :void{
    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const canvas64 = <HTMLCanvasElement> document.getElementById('canvasId');
      const image = canvas64.toDataURL();
      this.capturedImage = image;

      //this.capturedImage = canvas.toDataURL('image/png');
      
      this.dialogRef.close(this.capturedImage);
    }    
  }

  iniciarCamara() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        this.video.nativeElement.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error al acceder a la cámara:', error);
      });
  }



  async getVideoDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.videoDevices = devices.filter(device => device.kind === 'videoinput');
      if (this.videoDevices.length > 0) {
        this.selectedDeviceId = this.videoDevices[1].deviceId; // Selecciona la primera cámara por defecto
        this.startVideoStream(this.selectedDeviceId);
      }
    } catch (error) {
      console.error('Error al obtener dispositivos:', error);
    }
  }

  async checkPermission(){
    navigator.mediaDevices.getUserMedia({video:{width:500,height:500}})
      .then((response) => {
        console.log(response)
        this.getVideoDevices();
      }).catch(err => {
        console.log("Error al acceder a la cámara")
      })
  }

  async startVideoStream(deviceId: string | null) {
    try {
      const constraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoElement = document.querySelector('video') as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = stream;
      }
    } catch (error) {
      console.error('Error al iniciar el video:', error);
    }
  }

  onDeviceSelect(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedDeviceId = selectElement.value;
    this.startVideoStream(this.selectedDeviceId);
  }


}
