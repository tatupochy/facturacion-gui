import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { NgxExtendedPdfViewerService, NgxExtendedPdfViewerModule, pdfDefaultOptions } from 'ngx-extended-pdf-viewer';

import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgxExtendedPdfViewerModule, CommonModule]
})
export class PdfViewerComponent {

  pdf: any | null = null;

  constructor(
    private layoutService: LayoutService,
    private titleService: Title,
  ) {
    this.layoutService.disableSidebar();

    if (localStorage.getItem('pdf') != null) {
      sessionStorage.setItem('pdf', localStorage.getItem('pdf'));
    }

    this.pdf = JSON.parse(sessionStorage.getItem('pdf'));
    localStorage.removeItem('pdf');
    localStorage.removeItem('pdfjs.history')

    this.titleService.setTitle('SDA - Visualizador de PDF');

    pdfDefaultOptions.doubleTapZoomFactor = '150%'; // The default value is '200%'
    pdfDefaultOptions.maxCanvasPixels = 4096 * 4096 * 5; // The default value is 4096 * 4096 pixels,
  }

}
