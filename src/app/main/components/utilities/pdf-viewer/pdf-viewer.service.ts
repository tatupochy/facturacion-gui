import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfViewerService {
  
  storePdf(pdf: any, fileName: string) {
    if (typeof pdf === 'string') {
      let pdfObject = {
          name: fileName,
          data: pdf
      };
      localStorage.setItem('pdf', JSON.stringify(pdfObject));
    } else {
      let reader = new FileReader();
      reader.onload = function() {
          let base64String = reader.result as string;
          let pdfObject = {
              name: fileName,
              data: base64String
          };
          localStorage.setItem('pdf', JSON.stringify(pdfObject));
      }
      if (pdf instanceof Blob || pdf instanceof File) {
          reader.readAsDataURL(pdf);
      } else {
          let blob = new Blob([pdf], { type: 'application/pdf' });
          reader.readAsDataURL(blob);
      }
    }
  }

  openPdfViewer() {
    let baseUrl = document.querySelector('base').getAttribute('href');
    let newUrl = baseUrl + '#/home/utilities/view-pdf';
    window.open(newUrl, '_blank');
  }

}