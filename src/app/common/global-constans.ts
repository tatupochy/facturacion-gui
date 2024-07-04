import { Translation } from "primeng/api";

export class GlobalConstans {

    public static readonly NOTIFICATION_DURATION: number = 5000;
    
    public static readonly DATE_FORMAT: string = 'dd/MM/yyyy';

    public static readonly VALIDATORS_LABEL: Record<string, string> = {
        address: 'la dirección',
        addresses: 'las direcciones',
        amount: 'el monto',
        apartment: 'el departamento',
        bank: 'el banco',
        bastidor: 'el Bastidor',
        birthDateStr: 'la fecha de nacimiento',
        block: 'la manzana',
        body: 'el contenido',
        boundaries: 'los linderos',
        boundaryStr: 'el lindero',
        brand: 'la marca',
        cadastralCurrentAccount: 'la cuenta corriente catastral',
        certificateNumber: 'el número de certificado',
        certificateType: 'el tipo de certificado',
        chassisBrand: 'la marca de chasis',
        chassisNumber: 'el número de chasis',
        checkNumber: 'el número de cheque',
        city: 'la ciudad',
        code: 'el código',
        color: 'el color',
        condominiumUnit: 'la unidad propiedad horizontal',
        confirmPassword: 'las contraseñas no coinciden',
        consigned: 'el consignado',
        consignedName: 'el nombre de consignado',
        consignedSerialNumber: 'el N° de serie de consignado',
        country: 'el país',
        creditCardNumber: 'el número de tarjeta de crédito',
        currency: 'la moneda',
        currentPassword: 'la contraseña actual',
        customsBrokerName: 'el nombre de agente aduanero',
        customsBrokerRegistration: 'el registro de agente aduanero',
        dateDeed: 'la Fecha de Escritura',
        department: 'el departamento',
        description: 'la descripción',
        district: 'el distrito',
        documentNumber: 'el número de documento',
        documents: 'los documentos',
        documentType: 'el tipo de documento',
        email: 'el correo electrónico',
        endDate: 'la fecha de fin',
        endDateStr: 'la fecha de fin',
        endValidityDate: 'la fecha de vencimiento',
        engineBrand: 'la marca de motor',
        engineNumber: 'el número de motor',
        entityType: 'el tipo de entidad',
        fantasyName: 'el nombre de fantasía',
        firstName: 'el primer nombre',
        floorName: 'el piso',
        folioDeed: 'el Folio',
        gender: 'el género',
        grantedBy: 'el otorgado por',
        houseNumber: 'el número de casa',
        importClearanceNumber: 'el N° de despacho de importación',
        inscriptionData: 'los datos de inscripción',
        inscriptionDateStr: 'la fecha de inscripción',
        inscriptionNumber: 'el número de inscripción',
        inscriptionPlace: 'el lugar de inscripción',
        issuer: 'el emisor',
        itemNumber: 'el N° de ítem',
        lastName: 'los apellidos',
        licensePlate: 'la matrícula',
        lot: 'el lote',
        maritalStatus: 'el estado civil',
        marriedLastName: 'el apellido de casada',
        middleName: 'el segundo nombre',
        model: 'el modelo',
        modelYear: 'el año del modelo',
        motherLastName: 'el apellido de la madre',
        municipalRegister: 'el registro municipal',
        name: 'el nombre',
        nameTemplate: 'el Nombre de la Plantilla',
        nationality: 'la nacionalidad',
        nationalizationCertificateNumber: 'el N° de certificado de nacionalización/fabricación',
        nationalizationDate: 'la fecha de nacionalización/fabricación',
        nature: 'la naturaleza del trámite',
        natureTemplate: 'Asignar una Naturaleza',
        newPassword: 'la nueva contraseña',
        numberDeed: 'el N° Escritura',
        observation: 'la observación',
        parcel: 'la parcela',
        password: 'la contraseña',
        paymentDate: 'la fecha de pago',
        paymentMethod: 'el método de pago',
        paymentType: 'el tipo de pago',
        personType: 'el tipo de persona',
        procedureNature: 'la naturaleza del trámite',
        procedureNumber: 'el número de trámite',
        productionYear: 'el año de fabricación',
        profession: 'la profesión',
        propertyNumber: 'el número de propiedad',
        protocolDeed: 'el Protocolo',
        recipients: 'los destinatarios',
        registration: 'la matrícula',
        repeatPassword: 'repetir contraseña',
        role: 'el rol',
        ruc: 'el RUC',
        safetySheetNumberDeed: 'el N° Hoja',
        sectionDeed: 'Sección',
        startDate: 'la fecha de inicio',
        startDateStr: 'la fecha de inicio',
        streeName: 'la calle',
        streetName: 'la calle',
        subject: 'el asunto',
        surface: 'la superficie',
        surfaceStr: 'la superficie',
        transferNumber: 'el número de transferencia',
        username: 'el nombre de usuario',
        value: 'el valor',
        vehicleType: 'el tipo de vehículo',
        vin: 'el N° de Chasis',
        zipCode: 'el código postal',
    }

    public static readonly PRIMENG_SPANISH: Translation = {
        accept: 'Aceptar',
        addRule: 'Agregar regla',
        after: 'Después',
        am: 'AM',
        apply: 'Aplicar',
        before: 'Antes',
        cancel: 'Cancelar',
        choose: 'Elegir',
        chooseDate: 'Elegir fecha',
        chooseMonth: 'Elegir mes',
        chooseYear: 'Elegir año',
        clear: 'Limpiar',
        contains: 'Contiene',
        dateAfter: 'Fecha después',
        dateBefore: 'Fecha antes',
        dateFormat: 'dd/mm/yy',
        dateIs: 'Fecha es',
        dateIsNot: 'Fecha no es',
        dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
        dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sa'],
        dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
        emptyFilterMessage: 'No se encontraron opciones',
        emptyMessage: 'No se encontraron resultados',
        emptySearchMessage: 'No se encontraron resultados',
        emptySelectionMessage: 'No hay ninguna selección',
        endsWith: 'Termina con',
        equals: 'Igual',
        fileSizeTypes: ['B','KB','MB','GB','TB','PB','EB','ZB','YB'],
        gt: 'Mayor que',
        gte: 'Mayor o igual que',
        is: 'Es',
        isNot: 'No es',
        lt: 'Menor que',
        lte: 'Menor o igual que',
        matchAll: 'Coincidir todo',
        matchAny: 'Coincidir cualquier',
        medium: 'Medio',
        monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
        monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
        nextDecade: 'Próxima década',
        nextHour: 'Próxima hora',
        nextMinute: 'Próximo minuto',
        nextMonth: 'Próximo mes',
        nextSecond: 'Próximo segundo',
        nextYear: 'Próximo año',
        noFilter: 'Sin filtro',
        notContains: 'No contiene',
        notEquals: 'No es igual',
        passwordPrompt: 'Por favor ingrese la contraseña',
        pending: 'Pendiente',
        pm: 'PM',
        prevDecade: 'Década anterior',
        prevHour: 'Hora anterior',
        prevMinute: 'Minuto anterior',
        prevMonth: 'Mes anterior',
        prevSecond: 'Segundo anterior',
        prevYear: 'Año anterior',
        reject: 'Rechazar',
        removeRule: 'Eliminar regla',
        searchMessage: '{0} resultados encontrados',
        selectionMessage: '{0} items seleccionados',
        startsWith: 'Empieza con',
        strong: 'Fuerte',
        today: 'Hoy',
        upload: 'Subir',
        weak: 'Débil',
        weekHeader: 'Sm',
    }

}
