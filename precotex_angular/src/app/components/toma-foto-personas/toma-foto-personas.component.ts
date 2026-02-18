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
    if (this.dni.length >= 8) {
      // this.nombres = "Dominic Ayala Dávila";
      this.getObtenerNombre(this.dni);
    }else if(this.dni.length === 0){
      this.nombres = "";
      this.foto = "";
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

    this.foto = fotoBase64;
    this.fotoBase64 = fotoBase64.replace(/^data:image\/jpeg;base64,/, "");

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
        if(response.success){
          console.log('-------------------------', response);
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
    if(this.dni === ''){
      this.toastr.warning('INGRESE DOCUMENTO DE IDENTIDAD', 'Alerta', {
        timeOut: 2500
      });
      return;
    }

    if(this.fotoBase64 === ''){
      this.fotoBase64 = this.foto.replace(/^data:image\/jpeg;base64,/, "");
    }

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
          
          this.toastr.warning('LA PERSONA YA CUENTA CON FOTO REGISTRADA', 'Alerta', {
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
                    this.dni = '';
                    this.nombres = '';
                    this.foto = '';
                    this.fotoBase64 = '';
                    this.toastr.success('DATOS GUARDADOS', 'Exito', {
                      timeOut: 2500
                    });
                  }
              });
        }else{
          this.dni = '';
          this.nombres = '';
          this.foto = '';
          this.fotoBase64 = '';
          this.toastr.success('DATOS GUARDADOS', 'Exito', {
            timeOut: 2500
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

