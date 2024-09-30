'use strict'

export default {
  correo: v => {
    const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    return re.test(String(v).toLowerCase()) || 'El correo no es valido.'
  },
  contrasena: v => v.length >= 6 || 'Debe tener al menos 6 caracteres.',
  requerido: v => !!v || 'El campo es requerido.',
  minimoOcho: v => v.length > 8 || 'Debe tener mas de 8 caracteres.',
  minimoUno: v => v.length >= 1 || 'Select at least 1 option.',
  maximoDos: v => v.length < 3 || 'Select max 3 choices.',
  telefono: v => {
    const re = /^[0-9]/
    return (re.test(String(v).toLowerCase()) && v.length === 8) || 'Introduzca un numero de celular valido.'
  },
  letras: v => {
    const re = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
    return re.test(String(v).toLowerCase()) || 'El campo solo permite letras.'
  },
  alfanumerico: v => {
    const re = /^[a-zA-Z0-9]+$/
    return re.test(String(v).toLowerCase()) || 'El campo solo permite letras y numeros.'
  },
  numeros: v => {
    const re = /^\d+$/g
    return re.test(String(v)) || 'El campo solo permite numeros enteros positivos.'
  },
  decimales: v => {
    const re = /^\d+(\.\d{2})?$/g
    return re.test(String(v)) || !v || 'El campo solo permite números con 2 decimales.'
  },
  longitudMinima: (v, longitudMinima) => v.length >= longitudMinima || `Debe tener al menos ${longitudMinima} caracteres.`,
  longitudMaxima: (v, longitudMaxima) => v.length <= longitudMaxima || `Debe tener menos de  ${longitudMaxima} caracteres.`,
  formatoCorrecto: v => {
    const re = /^[a-zA-Z.]+$/
    return re.test(String(v)) || 'El formato no es correcto.'
  }
}

// PARA las validaciones
// numero entero, fracciones
// subcadenas
