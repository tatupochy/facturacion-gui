import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { firstValueFrom, Subscription } from 'rxjs';

import { format, parse } from 'date-fns';

import { ConfirmationService, MessageService } from 'primeng/api';

import { GlobalConstans as gc } from 'src/app/common/global-constans';
import { UtilsService } from 'src/app/main/service/utils.service';

import { HttpError } from 'src/app/main/models/http.error';
import { Transfer } from 'src/app/main/models/transfer';
import { Entity } from 'src/app/main/models/entity';
import { TransferDetail } from 'src/app/main/models/transfer-detail';

import { TransferService } from 'src/app/main/service/transfer.service';
import { EntityService } from 'src/app/main/service/entity.service';
import { DocumentarySerieService } from 'src/app/main/service/documentary-serie.service';
import { DocumentarySerie } from 'src/app/main/models/documentary-serie';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.scss'],
})
export class TransfersComponent implements OnInit, OnDestroy {

  isSearchingTransfers: boolean = false;

  colsTransfer: any[] = [];
  transfers: Transfer[] = [];
  selectedTransfer: Transfer = new Transfer();
  transferForm: FormGroup = new FormGroup({});
  displayNewTransferDialog: boolean = false;

  filterForm: FormGroup = new FormGroup({});

  entities: Entity[] = [];
  documentarySeries: DocumentarySerie[] = [];
  addDocumentarySeries: DocumentarySerie[] = [];
  isLoadingNewTransfer: boolean = false;

  currentDate: Date = new Date();

  colsNewTransferDetails: any[] = [];

  displayTransferDetailsDialog: boolean = false;
  transferDetails: TransferDetail[] = []
  colsTransferDetails: any[] = [];
  isLoadingTransferDetails: boolean = false;
  isLoadingTransferDetailsIndex: number = 0;

  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private transferService: TransferService,
    private entityService: EntityService,
    private documentarySerieService: DocumentarySerieService,
    public utils: UtilsService,
  ) {}
    
  ngOnInit() {
      
    this.titleService.setTitle('SDA - Transferencias');
    
    this.colsTransfer = [
      { field: 'index', header: 'N°', width: '5%', order: false, center: true },
      { field: 'transferNumber', header: 'N° de Acta', width: '25%', order: true, center: true },
      { field: 'transferDateStr', header: 'Fecha de Creación', width: '25%', order: true, center: true },
      { field: 'updateUser', header: 'Usuario', width: '20%', order: true, center: true },
      { field: 'state.name', header: 'Estado', width: '25%', order: true, center: true },
      { field: 'actions', header: '', width: '100px', order: false, center: false },
    ];

    this.colsNewTransferDetails = [
      { field: 'index', header: 'N°', width: '5%', order: false, center: true },
      { field: 'identifier', header: 'N° de Documento', width: '25%', order: true, center: true },
      { field: 'updateDateStr', header: 'Fecha de Documento', width: '25%', order: true, center: true },
      { field: 'stored', header: 'Inventariado', width: '25%', order: true, center: true },
      { field: 'box.number', header: 'N° de Caja', width: '20%', order: true, center: true },
      { field: 'actions', header: '', width: '100px', order: false, center: false },
    ];

    this.colsTransferDetails = [
      { field: 'index', header: 'N°', width: '5%', order: false, center: true },
      { field: 'identifier', header: 'N° de Documento', width: '25%', order: true, center: true },
      { field: 'updateDateStr', header: 'Fecha de Documento', width: '25%', order: true, center: true },
      { field: 'stored', header: 'Inventariado', width: '25%', order: true, center: true },
      { field: 'box.number', header: 'N° de Caja', width: '20%', order: true, center: true },
    ];

    this.loadDataFromApi();

    this.initFilterForm();

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  loadDataFromApi() {

    this.getEntities();
    
  }
  // Forms

  initFilterForm() {
    const monthDate = new Date();
    monthDate.setDate(1);

    this.filterForm = this.fb.group({
      entity: [this.entities[0], [Validators.required]],
      documentarySerie: [null],
      identifier: [null],
      transferDateStart: [format(monthDate, 'dd/MM/yyyy')],
      transferDateEnd: [format(this.currentDate, 'dd/MM/yyyy')],
    });

    this.filterForm.disable({emitEvent: false});

    const entityChangeSubscription = this.filterForm.get('entity')?.valueChanges.subscribe({
      next: async (entity) => {
        if (entity) {
          await this.onEntityChange(this.documentarySeries, entity);
          if (this.documentarySeries.length > 0) {
            this.filterForm.get('documentarySerie')?.setValue(this.documentarySeries[0]);
            this.filterForm.get('documentarySerie')?.enable();
          } else {
            this.filterForm.get('documentarySerie')?.setValue(null);
            this.filterForm.get('documentarySerie')?.disable();
          }
        }
      }
    });

    this.subscriptions.push(entityChangeSubscription);

  }

  initTransferForm() {
    const data = this.filterForm.value

    this.transferForm = this.fb.group({
      id: [null],
      transferNumber: [null],
      transferDate: [null],
      entity: [data.entity || this.entities[0], [Validators.required]],
      state: [null],
      documentarySerie: [this.addDocumentarySeries[0] || null, Validators.required],
      updateUser: ['admin'],
      updateDate: [null],
      transferDetails: [[]],
      identifier: [null],
    });

    const entityChangeSubscription = this.transferForm.get('entity')?.valueChanges.subscribe({
      next: async (entity) => {
        if (entity) {
          await this.onEntityChange(this.addDocumentarySeries, entity);
          if (this.addDocumentarySeries.length > 0) {
            this.transferForm.get('documentarySerie')?.setValue(this.addDocumentarySeries[0]);
          } else {
            this.transferForm.get('documentarySerie')?.setValue(null);
          }
        }
      }
    });

    this.subscriptions.push(entityChangeSubscription);

  }

  async onEntityChange(documentarySeries: DocumentarySerie[], entity: Entity) {
    try {
      const response = await firstValueFrom(this.documentarySerieService.getDocumentarySeriesByEntityId(entity.id));
      if (response.responseObject && response.responseObject.length > 0) {
        documentarySeries.length = 0;
        response.responseObject.forEach((docSerie) => documentarySeries.push(docSerie));
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Transfer

  searchFilterTransfers() {
    const data = this.filterForm.value;

    let filter = {
      entity: new Entity(data.entity.id),
      documentarySerie: new DocumentarySerie(data?.documentarySerie?.id),
      identifier: data.identifier,
      transferDateStart: format(parse(data.transferDateStart, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd'),
      transferDateEnd: format(parse(data.transferDateEnd, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd'),
    };

    this.isSearchingTransfers = true;

    this.transferService.getTransfersByFilter(filter).subscribe({
      next: (response) => {
        this.transfers = response.responseObject;
      },
      error: (error: HttpError) => {
        console.error(error);
        if (error instanceof HttpError) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
        }
        this.isSearchingTransfers = false;
      },
      complete: () => {
        this.isSearchingTransfers = false;
      }
    });
  }

  async showNewTransferDialog() {

    this.isLoadingNewTransfer = true;

    try {

      const responseDocumentarySeries = await firstValueFrom(this.documentarySerieService.getDocumentarySeriesByEntityId(this.filterForm.value?.entity?.id || this.entities[0]?.id));

      if (responseDocumentarySeries && responseDocumentarySeries.responseObject !== null) {
        this.addDocumentarySeries = responseDocumentarySeries.responseObject;
        this.initTransferForm();
        this.displayNewTransferDialog = true;
        this.isLoadingNewTransfer = false;
      } else {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se han podido cargar las series documentales', life: gc.NOTIFICATION_DURATION});
        return;
      }
    } catch (error) {
      console.error(error);
      if (error instanceof HttpError) {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
      }
      this.displayNewTransferDialog = false;
      this.isLoadingNewTransfer = false;
    }
  }

  closeNewTransferDialog() {
    this.displayNewTransferDialog = false;
  }

  setTransferData() {

    const data = this.transferForm.value;

    let transfer = new Transfer();

    transfer.id = data.id;
    transfer.transferNumber = data.transferNumber;
    transfer.entity = data.entity;
    transfer.state = data.state;
    transfer.documentarySerie = data.documentarySerie;
    transfer.updateUser = data.updateUser;
    transfer.transferDetails = data.transferDetails;

    return transfer;

  }

  saveTransfer() {

    const transfer = this.setTransferData();

    this.transferService.saveTransfer(transfer).subscribe({
      next: (response) => {
        let responseTransfer = response.responseObject;

        if (responseTransfer.id === null) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido crear la transferencia', life: gc.NOTIFICATION_DURATION});
          return;
        }

        let index = this.transfers.findIndex((transfers) => transfers.id === responseTransfer.id);
        if (index !== -1) {
          this.transfers[index] = responseTransfer;
        } else {
          this.transfers.push(responseTransfer);
        }
        this.transfers = [...this.transfers];
        this.closeNewTransferDialog();
        this.messageService.add({severity: 'success', summary: 'Datos Guardados', detail: 'Se ha creado correctamente la transferencia', life: gc.NOTIFICATION_DURATION});
      },
      error: (error: HttpError) => {
        console.error(error);
        if (error instanceof HttpError) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
        }
      }
    });
  }

  deleteTransfer(transfer: Transfer, index: number) {
    this.transferService.deleteTransfer(transfer).subscribe({
      next: (response) => {
        if (response.responseObject !== 1) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido eliminar el transfer', life: gc.NOTIFICATION_DURATION});
          return;
        }

        this.transfers.splice(index, 1);
        this.transfers = [...this.transfers];
        this.messageService.add({ severity: 'success', summary: 'Datos Eliminados', detail: 'Se ha eliminado correctamente el transfer', life: gc.NOTIFICATION_DURATION });
      },
      error: (error: HttpError) => {
        console.error(error);
        if (error instanceof HttpError) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
        }
      }
    });
  }

  showConfirmSaveNewTransfer() {

    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe completar todos los campos requeridos', life: gc.NOTIFICATION_DURATION });
      return;
    }

    this.confirmationService.confirm({
      key: 'saveConfirm',
      message: '¿Está seguro/a que desea guardar la transferencia?',
      accept: () => {
        this.saveTransfer()
      },
      reject: () => {
      }
    });
  }

  showConfirmDeleteTransfer(transfer: Transfer, index: number) {
    this.confirmationService.confirm({
      key: 'deleteConfirm',
      message: '¿Está seguro/a que desea eliminar la transferencia?',
      accept: () => {
        this.deleteTransfer(transfer, index);
      },
      reject: () => {
      }
    });
  }

  showConfirmCancelNewTransfer() {
    if (this.transferForm.value?.transferDetails?.length <= 0) {
      this.closeNewTransferDialog();
      return;
    }

    this.confirmationService.confirm({
      key: 'cancelConfirm',
      message: '¿Está seguro/a que desea cancelar?',
      accept: () => {
        this.closeNewTransferDialog();
      },
      reject: () => {
      }
    });
  }

  updateDate() {
    this.currentDate = new Date();
  }

  // Transfer Detail

  async showTransferDetailsDialog(transfer: Transfer, index: number) {

    this.isLoadingTransferDetails = true;
    this.isLoadingTransferDetailsIndex = index;

    if (!transfer) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se ha podido cargar la transferencia', life: gc.NOTIFICATION_DURATION});
      this.isLoadingTransferDetails = false;
      this.isLoadingTransferDetailsIndex = 0;
      return;
    }

    try {
      const responseTransfer = await firstValueFrom(this.transferService.getTransferById(transfer?.id));
      if (responseTransfer && responseTransfer.responseObject !== null) {
        this.selectedTransfer = responseTransfer.responseObject;
        this.initTransferForm();
        this.displayTransferDetailsDialog = true;
      }
    } catch (error) {
      console.error(error);
      if (error instanceof HttpError) {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
      }
    }

    this.isLoadingTransferDetails = false;
    this.isLoadingTransferDetailsIndex = 0;

  }

  closeTransferDetailsDialog() {

    this.displayTransferDetailsDialog = false;

    this.selectedTransfer = new Transfer();

  }

  addTransferDetail() {

    if (this.transferForm.invalid) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Debe completar todos los campos requeridos', life: gc.NOTIFICATION_DURATION});
      return;
    }

    let transferDetail = new TransferDetail();

    transferDetail.id = null;
    transferDetail.identifier = this.transferForm.value.identifier;
    transferDetail.updateUser = 'admin';
    transferDetail.updateDateStr = format(new Date(), 'dd/MM/yyyy HH:mm:ss');

    if (!this.transferForm.value.transferDetails) {
      this.transferForm.value.transferDetails = [];
    }

    this.transferForm.value.transferDetails.push(transferDetail);

    this.transferForm.value.transferDetails = [...this.transferForm.value.transferDetails];
  }

  deleteTransferDetail(index: number) {
    this.transferForm.value.transferDetails.splice(index, 1);
    this.transferForm.value.transferDetails = [...this.transferForm.value.transferDetails];
  }

  // Api Calls

  getTransfers(update?: boolean) {
    this.isSearchingTransfers = true;

      this.transferService.getAllTransfers().subscribe({
        next: (response) => {
          if (update) {
            this.messageService.add({severity: 'success', summary: 'Datos Actualizados', detail: 'Se han actualizado los datos de las transferencias', sticky: true});
          }
          this.transfers = response.responseObject;
        },
        error: (error: HttpError) => {
          console.error(error);
          if (error instanceof HttpError) {
            this.messageService.add({severity: 'error', summary: 'Error', detail: error.message, life: gc.NOTIFICATION_DURATION});
          }
          this.isSearchingTransfers = false
        },
        complete: () => {
          this.isSearchingTransfers = false
        }
     });

  }

  getEntities() {
    this.entityService.getAllEntitities().subscribe({
      next: (response) => {
        this.entities = response.responseObject;
        this.filterForm.get('entity')?.setValue(this.entities[0]);
        this.filterForm.enable({emitEvent: false});
      },
      error: (error: HttpError) => {
        console.error(error);
      }
    });
  }

  getDocumentarySeriesByEntityId(entityId: number) {
    this.documentarySerieService.getDocumentarySeriesByEntityId(entityId).subscribe({
      next: (response) => {
        if (response.responseObject.length > 0) {
          this.documentarySeries = response.responseObject;
          this.filterForm.get('documentarySerie')?.setValue(this.documentarySeries[0]);
        } else {
          this.documentarySeries = [];
          this.filterForm.get('documentarySerie')?.setValue(null);
          this.filterForm.get('documentarySerie')?.disable();
        }
      },
      error: (error: HttpError) => {
        console.error(error);
      }
    });
  }

}
