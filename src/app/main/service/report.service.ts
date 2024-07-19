import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';

import { HttpArrayResponse } from '../models/http-array.response';
// import { Report } from '../models/report';
import { HttpObjectResponse } from '../models/http-object-response';
import { tr } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) {}

    // call to the api to get the reports, it returns one report pdf file
    getReport(report: string, desde: Date, hasta: Date ): Observable<Blob> {
        let endpoint: string;
        let body = {
            "desde": desde,
            "hasta": hasta
        };

        console.log('body', body);
        
        switch (report) {
        case 'Inventario de productos':
            endpoint = '/productos/reporte/';
            break;
        case 'Reporte de compras':
            endpoint = '/compras/reporte/';
            break;
        case 'Reporte de ventas':
            endpoint = '/ventas/reporte/';
            break;
        case 'Productos más vendidos':
            endpoint = '/productos/reporte/mas-vendidos/';
            break;
        case 'Top 15 de clientes':
            endpoint = '/clientes/reporte/';
            break;
        case 'Top 15 de proveedores':
            endpoint = '/proveedores/reporte/';
            break;
        case 'Reporte de Utilidades':
            endpoint = '/productos/reporte/utilidades/';
            break;
        default:
            throw new Error(`Reporte inválido: ${report}`);
        }
    
        return this.http.post(`${environment.apiUrl}${endpoint}`, body, {
            responseType: 'blob'
        });
    }
}
