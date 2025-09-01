import { Injectable } from '@angular/core';
import { Observable  } from 'rxjs';
import { GlobalVariable } from '../VarGlobals';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BrowserQRCodeReader } from '@zxing/browser';
import { BrowserMultiFormatReader } from '@zxing/browser';
//import { Html5Qrcode } from 'html5-qrcode';

@Injectable({
  providedIn: 'root'
})

export class QrReaderService {

  baseUrl  = GlobalVariable.baseUrlProcesoTenido;

      url = this.baseUrl + "CalificacionRollosFinal";
      sCod_Usuario = GlobalVariable.vusu;

      httpOptions = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      constructor(private http: HttpClient) { }
      Header = new HttpHeaders({
        'Content-type': 'application/json'
      });

      private headers = new HttpHeaders({ 'Content-Type': 'application/json' });


  /*decodeFromImage(archivo: File): Observable<any> {
    alert("3333")
        const formData = new FormData();
        formData.append('qr', archivo, archivo.name);
        return this.http.post(`${this.url}/pstQR`, formData);

  }*/

  private reader = new BrowserQRCodeReader();

  async leerQrDesdeArchivo(file: File): Promise<string> {
    const imageUrl = URL.createObjectURL(file);
    const result = await this.reader.decodeFromImageUrl(imageUrl);
    return result.getText();
  }

  async leerQrDesdeCamara(file: File): Promise<any> {
    
    let qrResult: string = ""
    const codeReader = new BrowserMultiFormatReader();
    const videoElement = document.querySelector('video');

    codeReader.decodeFromVideoDevice(null, videoElement, (result, err) => {
      if (result) {
        qrResult = result.getText();
      }
      if (err) {
        console.error(err);
      }

      return qrResult;
    });
    

 }

}