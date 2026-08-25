import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../VarGlobals';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  baseUrl: string = GlobalVariable.baseUrl;

  constructor(private httpClient: HttpClient) { }

  consutarFirmaColaborador(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${this.baseUrl}/app_Man_RH_SignaturaColaborador.php`, data);
  }

  registrarFirmaColaborador(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${this.baseUrl}/app_Man_RH_RegistrarSignatura.php`, data);
  }

  registroEventosColaborador(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${this.baseUrl}/app_Man_RH_RegistroEventos.php`, data);
  }

  entregasEventoColaborador(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${this.baseUrl}/app_Man_RH_EntregasEventos.php`, data);
  }

  tipoEventosColaborador(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/app_Man_RH_TipoEventos.php`);
  }

  listaPlantaEventos(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/app_Lg_Man_Planta_Web.php`);
  }

  listaVale(tipo: number, numAno: number, numDni: string, estado: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/app_Get_RH_ConsultaVales.php?tipo=${tipo}&numAno=${numAno}&numDni=${numDni}&estado=${estado}`);
  }

  // listaOPContratos(numeroOp: string): Observable<any[]> {
  //   return this.httpClient.get<any[]>(`${this.baseUrl}/spring/app_Usp_ConsultarPOGestion.php?numeroOp=${numeroOp}`);
  // }

  listaEmpleados(): Observable<any[]> {
    return this.httpClient.get<any[]>(
      `${this.baseUrl}/spring/app_Usp_ListarEmpleados.php`
    );
  }

  listaOPContratos(
    empleado: string |number | null,
    fechaDesde: string | null,
    fechaHasta: string | null
  ): Observable<any[]> {

    let params = new HttpParams();

      // Empleado es opcional
  if (
    empleado !== null &&
    empleado !== undefined &&
    empleado !== ''
  ) {
    params = params.set(
      'empleado',
      empleado.toString()
    );
  }

  // Fecha desde es opcional
  if (fechaDesde) {
    params = params.set(
      'fechaDesde',
      fechaDesde
    );
  }

  // Fecha hasta es opcional
  if (fechaHasta) {
    params = params.set(
      'fechaHasta',
      fechaHasta
    );
  }

  console.log('Parámetros enviados:', params.toString());

    return this.httpClient.get<any[]>(
      `${this.baseUrl}/spring/app_Usp_ConsultarPOGestion.php`,
      { params }
    );
  }

}
