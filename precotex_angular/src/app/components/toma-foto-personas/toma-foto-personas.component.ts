import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TomaFotoService } from '../../services/toma-foto/toma-foto.service';
import { GlobalVariable } from '../../VarGlobals';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-toma-foto-personas',
  templateUrl: './toma-foto-personas.component.html',
  styleUrls: ['./toma-foto-personas.component.scss']
})
export class TomaFotoPersonasComponent implements OnInit {

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  
  dni: string = '';
  nombres: string = '';
  foto: string | null = null;
  mostrarModal: boolean = false;
  fotoBase64: string = '';
  usuario: string = GlobalVariable.vusu;
  foto_Ruta: string = '';
  facingMode: 'user' | 'environment' = 'environment';

  constructor(
    private service: TomaFotoService,
    private toastr: ToastrService

  ){}

  ngOnInit(): void {}

  onDniChange() {
    console.log('-----------------------', this.dni.length);
    console.log('-----------------------', this.dni);
    if (this.dni.length >= 8) {
      // this.nombres = "Dominic Ayala Dávila";
      this.getObtenerNombre(this.dni);
    }else if(this.dni.length === 0){
      this.nombres = "";
    }
  }

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
    } 
  }


  capturarFoto(video: HTMLVideoElement) {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');

    ctx?.drawImage(video, 0, 0);

    this.foto = canvas.toDataURL('image/jpg');

    this.fotoBase64 = canvas.toDataURL('image/jpg');

    this.fotoBase64 = this.fotoBase64.replace(/^data:image\/jpg;base64,/, "");

    this.cerrarModal();
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

  cerrarModal() {
    this.mostrarModal = false;
    this.detenerCamara();
  }

  getObtenerNombre(Nro_Dni: string): void {
    this.service.getObtenerNombre(Nro_Dni).subscribe({
      next: (response: any) => {
        console.log('----------------', response);
        if(response.success){
          if(response.totalElements > 0){
            this.nombres = response.elements[0].descripcion;
            this.foto = response.elements[0].fotoBase64 || "";
            this.foto_Ruta = response.elements[0].foto_Ruta || "";
          }
        }
      },
      error: (error: any) => {

      }
    });
  }

  registrarDniFoto() {
    console.log('-----', this.foto);
    if(this.fotoBase64 === ''){
      this.fotoBase64 = this.foto.replace(/^data:image\/jpg;base64,/, "");
    }

    console.log('--------', this.fotoBase64);

    const data = {
      Foto_Nro_Dni: this.dni,
      Usr_Reg: this.usuario,
      FotoBase64: this.fotoBase64
    };

    let codeTransacc: number = 0;
    this.service.postRegistrarDniFoto(data).subscribe({
      next: (response: any) => {
        codeTransacc = response.codeTransacc;
        
        if(codeTransacc === 2){
          
          this.toastr.warning('LA PERSONA YA CUENTA CON FOTO REGISTRADA', 'ALERTA', {
            timeOut: 2500
          });

          Swal.fire({
                title: "¿Desea Cambiar La Foto?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor:'#3085d6',
                cancelButtonColor:'#d33',
                confirmButtonText:'Si',
                cancelButtonText: 'No'
              }).then((result: any) =>{
                  if(result.isConfirmed){
                    this.actualizarDniFoto();
                  }
              });
        }
      },
      error: (err: any) => {
        console.error('Error al registrar:', err);
      }
    });
  }

  actualizarDniFoto() {
    const data = {
      Foto_Nro_Dni: this.dni,
      Usr_Mod: this.usuario,
      FotoBase64: this.fotoBase64,
      Foto_Ruta: this.foto_Ruta
    };

    this.service.patchActualizarDniFoto(data).subscribe({
      next: (response: any) => {
        console.log('Actualización exitosa:', response);
      },
      error: (err: any) => {
        console.error('Error al actualizar:', err);
      }
    });
  }

}

