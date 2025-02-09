export const form = [
  {
    validations: [],
    label: 'Datos de Participantes',
    ariaLabel: null,
    ariaLabelledBy: null,
    customClass: null,
    customStyles: null,
    disabled: false,
    placeholder: null,
    autocomplete: null,
    readonly: false,
    visible: true,
    type: 'title',
    typeInput: 'subtitle',
    uid: '426f9ae3-4fd8-4e68-ace9-3c4ba4256ecc',
    name: 'title2',
    required: false,
    active: false,
    designColumn: 'col-12'
  }, {
    visible: true,
    validations: [],
    label: 'Lista de Participantes del Proceso',
    ariaLabel: null,
    ariaLabelledBy: null,
    customClass: null,
    customStyles: null,
    disabled: false,
    placeholder: null,
    autocomplete: null,
    readonly: false,
    type: 'datagrid',
    name: 'participantes',
    required: false,
    designColumn: 'col-12',
    typeInput: 'text',
    active: false,
    uid: '33f04726-d257-42ad-af93-32174b280191',
    columns: [],
    options: [
      {
        label: 'Acciones',
        sortable: false,
        active: false
      },
      {
        validations: [],
        label: 'Tipo Participante',
        ariaLabel: null,
        ariaLabelledBy: null,
        customClass: null,
        customStyles: null,
        disabled: false,
        placeholder: null,
        autocomplete: null,
        readonly: false,
        visible: true,
        query: null,
        options: [
          {
            val: 'DENUNCIANTE',
            label: 'DENUNCIANTE',
            default: false
          }, {
            val: 'DENUNCIADO',
            label: 'DENUNCIADO',
            default: false
          }, {
            value: '',
            label: 'VICTIMA',
            default: false,
            val: 'VICTIMA'
          }
        ],
        optionValue: 'id',
        optionLabel: 'nombre',
        typeInput: 'normal',
        type: 'select',
        uid: '54024c45-c6cd-4c8d-bcb6-22681276e843',
        name: 'idTipoParticipante',
        required: true,
        active: false,
        designColumn: 'col-4',
        url: 'http://192.168.3.173:3000/api/system/parametros?grupo=TIPO_PARTICIPANTE',
        dependency: {
          name: 'idProceso',
          value: 'idTipoProceso'
        }
      }, {
        validations: [],
        label: 'Tipo documento',
        ariaLabel: null,
        ariaLabelledBy: null,
        customClass: null,
        customStyles: null,
        disabled: false,
        placeholder: null,
        autocomplete: null,
        readonly: false,
        visible: true,
        query: null,
        options: [
          {
            val: 'CEDULA DE IDENTIDAD',
            label: 'CEDULA DE IDENTIDAD',
            default: false
          }, {
            val: 'NIT',
            label: 'NIT',
            default: false
          }
        ],
        optionValue: 'id',
        optionLabel: 'nombre',
        typeInput: 'normal',
        type: 'select',
        uid: '3d7a6391-3bdc-42b9-a4a3-943c92b86ef4',
        name: 'idTipoDocumento',
        required: true,
        active: false,
        designColumn: 'col-4',
        url: 'http://192.168.3.173:3000/api/system/parametros?grupo=TIPO_DOCUMENTO'
      }, {
        validations: [],
        label: 'Numero Documento',
        ariaLabel: null,
        ariaLabelledBy: null,
        customClass: null,
        customStyles: null,
        disabled: false,
        placeholder: null,
        autocomplete: null,
        readonly: false,
        visible: true,
        type: 'text',
        uid: 'f0469ce8-e624-4d1f-9ae6-73e7672c5cb3',
        name: 'numeroDocumento',
        required: true,
        active: false,
        designColumn: 'col-4',
        typeInput: 'text'
      }, {
        validations: [],
        label: 'Nombre Completo',
        ariaLabel: null,
        ariaLabelledBy: null,
        customClass: null,
        customStyles: null,
        disabled: false,
        placeholder: null,
        autocomplete: null,
        readonly: false,
        visible: true,
        type: 'text',
        uid: '8e25ee5d-d31b-4609-bd9d-4278a3171cd6',
        name: 'nombreRazonSocial',
        required: true,
        active: false,
        designColumn: 'col-12',
        typeInput: 'text'
      }, {
        validations: [],
        label: 'Direccion',
        ariaLabel: null,
        ariaLabelledBy: null,
        customClass: null,
        customStyles: null,
        disabled: false,
        placeholder: null,
        autocomplete: null,
        readonly: false,
        visible: true,
        type: 'text',
        uid: 'ffb518bd-662f-48b4-a2c4-8ffd694e7bbb',
        name: 'direccion',
        required: true,
        active: false,
        designColumn: 'col-12',
        typeInput: 'text'
      }, {
        validations: [],
        label: 'Ocupacion',
        ariaLabel: null,
        ariaLabelledBy: null,
        customClass: null,
        customStyles: null,
        disabled: false,
        placeholder: null,
        autocomplete: null,
        readonly: false,
        visible: true,
        type: 'text',
        uid: 'fa0fec0d-ffe7-405d-9911-7158df69b956',
        name: 'ocupacion',
        required: false,
        active: false,
        designColumn: 'col-4',
        typeInput: 'text'
      }, {
        validations: [],
        label: 'Genero',
        ariaLabel: null,
        ariaLabelledBy: null,
        customClass: null,
        customStyles: null,
        disabled: false,
        placeholder: null,
        autocomplete: null,
        readonly: false,
        visible: true,
        query: null,
        options: [
          {
            val: 'FEMENINO',
            label: 'FEMENINO',
            default: false
          }, {
            val: 'MASCULINO',
            label: 'MASCULINO',
            default: false
          }
        ],
        optionValue: 'id',
        optionLabel: 'nombre',
        typeInput: 'normal',
        type: 'select',
        uid: '7a52742d-1a85-481b-ad3f-233df84d51b0',
        name: 'idGenero',
        required: false,
        active: false,
        designColumn: 'col-4',
        url: 'http://192.168.3.173:3000/api/system/parametros?grupo=GENERO'
      }, {
        validations: [],
        label: 'Edad',
        ariaLabel: null,
        ariaLabelledBy: null,
        customClass: null,
        customStyles: null,
        disabled: false,
        placeholder: null,
        autocomplete: null,
        readonly: false,
        visible: true,
        type: 'text',
        uid: '4bd00ae6-ce86-47a9-952f-103a720efe97',
        name: 'edad',
        required: false,
        active: false,
        designColumn: 'col-4',
        typeInput: 'number',
        maxlength: '3',
        min: '0',
        max: '100'
      }
    ]
  }
]
