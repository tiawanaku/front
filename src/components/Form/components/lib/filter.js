/* eslint no-useless-escape: 0 */

const exceptions = {
  integer: [46, 8, 9, 27, 13, 110, 173, 189, 109],
  natural: [46, 8, 9, 27, 13, 110, 190],
  decimal: [46, 8, 9, 27, 13, 110, 190, 173, 189, 109],
  decimal_positive: [46, 8, 9, 27, 13, 110, 190],
  numeric: [46, 8, 9, 27, 13],
  alpha: [46, 8, 9, 27, 13, 32],
  alpha_dash: [46, 8, 9, 27, 13, 32, 173, 189, 109],
  passport: [46, 8, 9, 27, 13, 32, 173, 189, 109, 190, 0, 192]
}
exceptions.alpha_numeric = exceptions.alpha

const evaluate = {
  numeric: (e) => {
    return (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)
  },
  alpha: (e) => {
    return e.keyCode < 65 || e.keyCode > 90
  }
}
evaluate.integer = evaluate.numeric
evaluate.decimal = evaluate.numeric
evaluate.natural = evaluate.numeric
evaluate.decimal_positive = evaluate.numeric
evaluate.alpha_numeric = (e) => {
  return evaluate.alpha(e) && evaluate.numeric(e)
}
evaluate.alpha_dash = evaluate.alpha_numeric
evaluate.alpha_dash = evaluate.alpha_numeric
evaluate.passport = evaluate.alpha_numeric

const Filter = {
  nit () {
    const nit = {
      verhoeff: (x, y) => {
        const m = ['0123456789', '1234067895', '2340178956', '3401289567', '4012395678', '5987604321', '6598710432', '7659821043', '8765932104', '9876543210']
        if (m[x] && m[x][y]) {
          return parseInt(m[x][y])
        }
        return -1
      },

      permutations: (x, y) => {
        const m = ['0123456789', '1576283094', '5803796142', '8916043527', '9453126870', '4286573901', '2793806415', '7046913258']
        if (m[x] && m[x][y]) {
          return parseInt(m[x][y])
        }
        return -1
      },

      evaluate: (num) => {
        let check = 0
        let x
        let y
        let z

        if (typeof num === 'string' && isNaN(num)) {
          return false
        }
        num = parseInt(num)
        for (let i = 0, l = num.toString().length; i < l; i++) {
          x = i % 8
          y = num % 10
          num = Math.floor(num / 10)
          z = nit.permutations(x, y)
          check = nit.verhoeff(check, z)
        }

        return check === 0
      }
    }

    return nit
  },

  filterBase (e, type) {
    if (e.altKey === true && e.keyCode >= 96 && e.keyCode <= 105) {
      e.preventDefault()
    }
    if (exceptions[type].indexOf(e.keyCode) !== -1 || (e.keyCode === 86 && e.ctrlKey === true) || (e.keyCode === 65 && e.ctrlKey === true) || (e.keyCode >= 35 && e.keyCode <= 39)) {
      return
    }
    if (evaluate[type](e)) {
      if (type.indexOf('alpha') === 0) {
        if (!(e.key === 'ñ' || e.key === 'Ñ')) {
          e.preventDefault()
        }
      } else {
        e.preventDefault()
      }
    }
  },

  isNumber (o) {
    return typeof o === 'number' && isFinite(o)
  },

  isFloat (value) {
    return value % 1 !== 0
  },

  integer (e) {
    this.filterBase(e, 'integer')
  },

  isInteger (value) {
    if (/[a-zA-Z]+/g.test(value) || !/^-?[0-9.]*$/g.test(value)) {
      return false
    }
    value = this.convert(value)
    if (value === 'NaN' || !this.isNumber(value)) {
      return false
    }
    return !this.isFloat(value)
  },

  decimal (e) {
    this.filterBase(e, 'decimal')
  },

  isDecimal (value) {
    if (/[a-zA-Z]+/g.test(value) || !/^-?[0-9.]+,?[0-9]*$/g.test(value)) {
      return false
    }
    value = this.convert(value)
    if (value === 'NaN') {
      return false
    }
    return this.isNumber(value)
  },

  decimalPositive (e) {
    this.filterBase(e, 'decimal_positive')
  },

  isDecimalPositive (value) {
    if (/[a-zA-Z]+/g.test(value) || !/^[0-9.]+,?[0-9]*$/g.test(value)) {
      return false
    }
    value = this.convert(value)
    if (value === 'NaN') {
      return false
    }
    return this.isNumber(value)
  },

  decimalFormat (e) {
    this.decimalPositive(e)

    const valor = e.target.value
    const exceptions = [37, 39, 46, 8, 9]
    const t = e.keyCode ? e.keyCode : e.which
    const target = e.target

    if (valor.match(/\./g)) {
      if (t === 190 || t === 110) {
        e.preventDefault()
      }
      const char = t >= 96 && t <= 105 ? t - 96 : String.fromCharCode(t)
      const newValue = valor.substring(0, target.selectionStart) + char + valor.substring(target.selectionEnd)
      if (!/^(\d+(?:\.?\d{0,2})?)?$/g.test(newValue) && exceptions.indexOf(t) === -1) {
        e.preventDefault()
      }
    } else {
      if (t === 190 || t === 110) {
        let decimal = valor.substring(target.selectionEnd)
        if (decimal.length > 2) {
          decimal = decimal.substring(0, 2)
          e.target.value = valor.substring(0, target.selectionStart) + '.' + decimal
          e.preventDefault()
        }
        if (valor.length === 0) {
          e.target.value = '0'
        }
      }
    }
  },

  isDecimalFormat (value) {
    return /^(\d+(?:\.?\d{0,2})?)?$/g.test(value)
  },

  natural (e) {
    this.filterBase(e, 'natural')
  },

  isNatural (value) {
    if (/[a-zA-Z]+/g.test(value) || !/^[0-9]*$/g.test(value)) {
      return false
    }
    value = this.convert(value)
    if (value === 'NaN' || !this.isNumber(value)) {
      return false
    }
    return !this.isFloat(value) && value >= 0
  },

  numeric (e) {
    this.filterBase(e, 'numeric')
  },

  isNumeric (value) {
    return /^([0-9])*$/.test(value)
  },

  alpha (e) {
    this.filterBase(e, 'alpha')
  },

  isAlpha (value) {
    return /^[\u00D1\u00F1A-Z a-z]*$/.test(value)
  },

  alphaNumeric (e) {
    this.filterBase(e, 'alpha_numeric')
  },

  isAlphaNumeric (value) {
    return /^[\u00D1\u00F1A-Z a-z0-9]*$/.test(value)
  },

  alphaDash (e) {
    this.filterBase(e, 'alpha_dash')
  },

  isAlphaDash (value) {
    return /^[\u00D1\u00F1A-Z a-z-_0-9]*$/.test(value)
  },

  passport (e) {
    this.filterBase(e, 'passport')
  },

  isPassport (value) {
    return /^[\u00D1\u00F1A-Z a-z-_0-9.]*$/.test(value)
  },

  isPhone (value) {
    return /^(?:(?:\(?(?:00|\+)([1-e]\d\d|[1-9]\d?)\)?)?[-.\ \\\/]?)?((?:\(?\d{1,}\)?[-.\ \\\/]?){0,})(?:[-.\ \\\/]?(?:#|ext.?|extension|x)[-.\ \\\/]?(\d+))?$/i.test(value)
  },

  removeTagHTML (text) {
    return text.replace(/<([^ >]+)[^>]*>.*?<\/\1>|<[^\/]+\/>/gi, '')
  },

  empty (value) {
    return value === undefined || value === null || value.length === 0 || /^\s+$/.test(value)
  },

  isEmail (value) {
    return /^(([^<>()[\]\\.,:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
  },

  convert (value) {
    return parseFloat(isNaN(value) ? value.replace(/\./g, '').replace(',', '.') : value)
  },

  isNit (value) {
    return this.nit().evaluate(value)
  },

  characters (input, chars, breakOnWord) {
    if (isNaN(chars)) return input
    if (chars <= 0) return ''
    if (input && input.length > chars) {
      input = input.substring(0, chars).replace(/(<([^>]+)>)/ig, '')

      if (!breakOnWord) {
        const lastspace = input.lastIndexOf(' ')

        if (lastspace !== -1) {
          input = input.substr(0, lastspace)
        }
      } else {
        while (input.charAt(input.length - 1) === ' ') {
          input = input.substr(0, input.length - 1)
        }
      }
      return input + '…'
    }
    return input
  },

  splitcharacters (input, chars) {
    if (isNaN(chars)) return input
    if (chars <= 0) return ''
    if (input && input.length > chars) {
      input = input.replace(/(<([^>]+)>)/ig, '')
      const prefix = input.substring(0, chars / 2)
      const postfix = input.substring(input.length - chars / 2, input.length)
      return prefix + '...' + postfix
    }
    return input
  },

  words (input, words) {
    if (isNaN(words)) return input
    if (words <= 0) return ''
    if (input) {
      input = input.replace(/(<([^>]+)>)/ig, '')
      const inputWords = input.split(/\s+/)
      if (inputWords.length > words) {
        input = inputWords.slice(0, words).join(' ') + '…'
      }
    }
    return input
  }
}

export default Filter

export const normalize = (function () {
  const from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç'
  const to = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc'
  const mapping = {}

  for (let i = 0, j = from.length; i < j; i++) {
    mapping[from.charAt(i)] = to.charAt(i)
  }

  return function (str) {
    const ret = []
    for (let i = 0, j = str.length; i < j; i++) {
      const c = str.charAt(i)
      if (Object.prototype.hasOwnProperty.call(mapping, str.charAt(i))) {
        ret.push(mapping[c])
      } else {
        ret.push(c)
      }
    }
    return ret.join('')
  }
})()
