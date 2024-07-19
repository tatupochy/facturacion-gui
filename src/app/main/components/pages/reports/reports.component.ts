import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';

import { GlobalConstans as gc } from 'src/app/common/global-constans';
import { UtilsService } from 'src/app/main/service/utils.service';

import { HttpError } from 'src/app/main/models/http.error';
import { ReportService } from 'src/app/main/service/report.service';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {

  colsReport: any[] = [];
  reportForm: FormGroup = new FormGroup({});

  reports: string[] = ['Inventario de productos', 'Reporte de compras', 'Reporte de ventas', 'Productos más vendidos', 'Top 15 de clientes', 'Top 15 de proveedores', 'Reporte de Utilidades']
  isLoadingTable: boolean = false;
  displayReportDialog: boolean = false;
  currentDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private reportService: ReportService,
    public utils: UtilsService,
  ) {}
    
  ngOnInit() {
      
    this.titleService.setTitle('Reportes');

    this.loadDataFromApi();

    this.initReportForm();

  }

  loadDataFromApi() {
    
  }

  // Forms

  initReportForm() {
    this.reportForm = this.fb.group({
        report: [null, Validators.required],
        desde: [null],
        hasta: [null]
    });
  }

  showReportDialog() {

    this.displayReportDialog = true;

  }

  hideReportDialog() {
    this.displayReportDialog = false;
  }

  updateDate() {
    this.currentDate = new Date();
  }

  // Actions

  generateReport() {
    this.displayReportDialog = false;
    const desde = this.reportForm.value.desde;
    const hasta = this.reportForm.value.hasta;
    const report = this.reportForm.value.report;

    if (desde && hasta && desde > hasta) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La fecha de inicio no puede ser mayor a la fecha final' });
      return;
    }


    this.reportService.getReport(report, desde, hasta).subscribe(
      (response) => {
        this.downloadReport(response, report);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Reporte generado correctamente' });
        this.reportForm.reset();
      },
      (error: HttpError) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      }
    );
  }
  
  downloadReport(blob: Blob, report: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report}.pdf`; 
    a.click();
    window.URL.revokeObjectURL(url); // Limpieza de la URL objeto
  }

}
