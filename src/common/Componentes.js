'use strict'

export default [
  {
    nombre: 'Texto simple',
    icono: 'sort_by_alpha',
    descripcion: 'Elemento de tipo titulo',
    configuracionJson: {
      uid: '426f9ae3-4fd8-4e68-ace9-3c4ba4256ecc',
      name: 'title',
      type: 'title',
      label: 'titulo',
      active: false,
      visible: true,
      disabled: false,
      readonly: false,
      required: false,
      ariaLabel: null,
      esColumna: false,
      typeInput: 'subtitle',
      customClass: null,
      placeholder: null,
      validations: [],
      autocomplete: null,
      customStyles: null,
      designColumn: 'col-12',
      ariaLabelledBy: null,
      reglas: []
    }
  },
  {
    nombre: 'Mapa',
    icono: 'sort_by_alpha',
    descripcion: 'Mapa configurable',
    configuracionJson: {
      uid: '085cf515-879f-4d64-a73e-cb36b8feb0c5',
      name: 'map',
      type: 'map',
      label: 'mapa',
      marker: {
        icon: 'casa',
        width: 45,
        height: 45
      },
      defaultValue: {},
      active: false,
      visible: true,
      disabled: false,
      readonly: false,
      required: false,
      ariaLabel: null,
      esColumna: false,
      typeInput: 'map',
      customClass: null,
      placeholder: null,
      validations: [],
      autocomplete: null,
      customStyles: null,
      designColumn: 'col-12',
      ariaLabelledBy: null,
      configuration: [
        {
          label: 'Departamento',
          visible: true,
          readonly: false,
          key: 'departamento',
          type: 'select',
          designColumn: 'col-12',
          defaultValue: null,
          required: true,
          nivel: 2
        },
        {
          label: 'Provincia',
          visible: true,
          readonly: false,
          key: 'provincia',
          type: 'select',
          designColumn: 'col-6',
          dependPosition: 0,
          defaultValue: null,
          required: true,
          nivel: 3
        },
        {
          label: 'Municipio',
          visible: true,
          readonly: false,
          key: 'municipio',
          type: 'select',
          designColumn: 'col-6',
          dependPosition: 1,
          defaultValue: null,
          required: true,
          nivel: 4
        },
        {
          label: 'Zona',
          visible: true,
          readonly: false,
          key: 'zona',
          type: 'text',
          designColumn: 'col-5',
          required: true,
          defaultValue: null
        },
        {
          label: 'Calle',
          visible: true,
          readonly: false,
          key: 'calle',
          type: 'text',
          designColumn: 'col-5',
          required: true,
          defaultValue: null
        },
        {
          label: 'Numero',
          visible: true,
          readonly: false,
          key: 'numero',
          type: 'text',
          designColumn: 'col-2',
          required: true,
          defaultValue: null
        }
      ],
      reglas: []
    }
  },
  {
    nombre: 'Campo de texto',
    icono: 'text_fields',
    descripcion: 'Elemento de tipo texto',
    configuracionJson: {
      uid: '8e25ee5d-d31b-4609-bd9d-4278a3171cd6',
      name: 'texto',
      type: 'text',
      label: 'Texto',
      active: false,
      visible: true,
      disabled: false,
      readonly: false,
      required: false,
      ariaLabel: null,
      esColumna: false,
      typeInput: 'text',
      customClass: null,
      placeholder: null,
      validations: [],
      autocomplete: null,
      customStyles: null,
      designColumn: 'col-12',
      ariaLabelledBy: null,
      reglas: []
    }
  },
  {
    nombre: 'Campo de seleccion',
    icono: 'arrow_drop_down_circle',
    descripcion: 'Elemento de tipo select',
    configuracionJson: {
      uid: '3d7a6391-3bdc-42b9-a4a3-943c92b86ef4',
      url: '',
      name: 'select',
      type: 'select',
      label: 'Select',
      query: null,
      active: false,
      options: [],
      filtros: [],
      visible: true,
      disabled: false,
      readonly: false,
      required: false,
      ariaLabel: null,
      esColumna: false,
      typeInput: 'normal',
      customClass: null,
      optionLabel: 'nombre',
      optionValue: 'id',
      placeholder: null,
      validations: [],
      autocomplete: null,
      customStyles: null,
      designColumn: 'col-12',
      ariaLabelledBy: null,
      reglas: []
    }
  },
  {
    nombre: 'Tabla de datos',
    icono: 'grid_on',
    descripcion: 'CRUD básico de registros',
    configuracionJson: {
      uid: '33f04726-d257-42ad-af93-32174b280191',
      name: 'grilla',
      type: 'datagrid',
      label: 'Grilla',
      active: false,
      columns: [],
      options: [
        {
          label: 'Acciones',
          active: false,
          sortable: false
        }
      ],
      visible: true,
      disabled: false,
      readonly: false,
      required: false,
      ariaLabel: null,
      esColumna: false,
      typeInput: 'text',
      customClass: null,
      placeholder: null,
      validations: [],
      autocomplete: null,
      customStyles: null,
      designColumn: 'col-12',
      ariaLabelledBy: null,
      reglas: []
    }
  }
]
