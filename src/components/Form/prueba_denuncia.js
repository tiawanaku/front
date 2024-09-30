export const form = [{
  validations: [],
  label: 'Datos de la Denuncia',
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
  uid: '0d6c0f31-5423-4b73-9ca7-c1214f63b2e2',
  name: 'title1',
  required: false,
  active: false,
  designColumn: 'col-12'
},
{
  validations: [],
  label: 'Fecha',
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
  uid: '80c5dc54-61a6-4c6f-8a79-f616749fabc7',
  name: 'fechaDenuncia',
  required: true,
  active: false,
  designColumn: 'col-4',
  typeInput: 'date'
}, {
  validations: [],
  label: 'Lugar del hecho',
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
      val: '1',
      label: 'Opción 1',
      default: false,
      active: false
    }, {
      val: '2',
      label: 'Opción 2',
      default: false,
      active: false
    }
  ],
  optionValue: 'pais',
  optionLabel: 'nacionalidad',
  typeInput: 'normal',
  type: 'select',
  uid: '395244d8-673b-40b5-987c-4dd041206318',
  name: 'lugarHecho',
  required: true,
  active: false,
  designColumn: 'col-4',
  url: 'https://test.tramites.justicia.gob.bo/backend/public/paises'
},
{
  validations: [],
  label: 'Lugar Registro',
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
      val: '1',
      label: 'Opción 1',
      default: false,
      active: false
    }, {
      val: '2',
      label: 'Opción 2',
      default: false,
      active: false
    }
  ],
  optionValue: 'pais',
  optionLabel: 'nacionalidad',
  typeInput: 'normal',
  type: 'select',
  uid: '395244d8-673b-40b5-987c-4dd041206318',
  name: 'lugarRegistro',
  required: true,
  active: false,
  designColumn: 'col-4',
  url: 'https://test.tramites.justicia.gob.bo/backend/public/paises'
},
{
  validations: [],
  label: 'Denominacion',
  ariaLabel: null,
  ariaLabelledBy: null,
  customClass: null,
  customStyles: null,
  disabled: false,
  placeholder: 'Ingrese la denominacion',
  autocomplete: null,
  readonly: false,
  visible: true,
  type: 'text',
  uid: '304ca105-a630-4aa9-8c0d-58e2d1c6bcd6',
  name: 'denominacion',
  required: true,
  active: false,
  designColumn: 'col-12',
  typeInput: 'textarea',
  maxlength: '2000',
  help: ''
},
{
  validations: [],
  label: 'Delitos',
  ariaLabel: null,
  ariaLabelledBy: null,
  customClass: null,
  customStyles: null,
  disabled: false,
  placeholder: null,
  autocomplete: null,
  readonly: false,
  visible: true,
  options: [
    {
      val: '1',
      label: 'Opción 1',
      default: false,
      active: false
    }, {
      val: '2',
      label: 'Opción 2',
      default: false,
      active: false
    }
  ],
  optionValue: 'id',
  optionLabel: 'nombre',
  typeInput: 'normal',
  type: 'select',
  uid: '65d11053-831a-4ff7-8f25-dfd9404747b0',
  name: 'delitos',
  required: true,
  active: false,
  designColumn: 'col-12',
  multiple: true,
  url: 'http://192.168.3.173:3000/api/system/parametros?grupo=DENUNCIA',
  dependency: {
    name: 'idProceso',
    value: 'idTipoProceso'
  }
},
{
  validations: [],
  label: 'Numero de Caso Fiscalia',
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
  uid: 'd409f7c9-ddbf-49f1-ab8f-87362ee97950',
  name: 'numeroFiscalia',
  required: false,
  active: false,
  designColumn: 'col-6',
  typeInput: 'text'
}, {
  validations: [],
  label: 'NUREJ/Codigo Unico',
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
  uid: 'c76c2401-661d-4e5f-9e89-351f78d2fd2b',
  name: 'nurej',
  required: false,
  active: false,
  designColumn: 'col-6',
  typeInput: 'text'
},
{
  validations: [],
  label: 'Fiscal Asignado',
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
  uid: '096f5223-726b-472e-8886-f23314e18a4a',
  name: 'fiscal',
  required: false,
  active: false,
  designColumn: 'col-6',
  typeInput: 'text'
}, {
  validations: [],
  label: 'Juzgado',
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
  type: 'text',
  uid: '4bd5bd9a-3a86-48d0-a6c9-331283d369f0',
  name: 'juzgado',
  required: false,
  active: false,
  designColumn: 'col-6'
}, {
  validations: [],
  label: 'Policia',
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
  uid: '78d32bfc-795f-49d0-8ca2-5f0d3fecea32',
  name: 'policia',
  required: false,
  active: false,
  designColumn: 'col-6'
},
{
  validations: [],
  label: 'Relacion Sucinta del Hecho ',
  ariaLabel: null,
  ariaLabelledBy: null,
  customClass: null,
  customStyles: null,
  disabled: false,
  placeholder: 'Ingrese el detalle de la relacion del hecho',
  autocomplete: null,
  readonly: false,
  visible: true,
  type: 'text',
  uid: '304ca105-a630-4aa9-8c0d-58e2d1c6bcc6',
  name: 'relacionHecho',
  required: true,
  active: false,
  designColumn: 'col-12',
  typeInput: 'textarea',
  maxlength: '2000',
  help: ''
}
]