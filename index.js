const binding = require('./binding')

const t = binding.constants

class Type {
  constructor (type) {
    this._type = type
  }

  isUndefined () {
    return this._type === t.UNDEFINED
  }

  isNull () {
    return this._type === t.NULL
  }

  isBoolean () {
    return this._type === t.BOOLEAN
  }

  isNumber () {
    return (this._type & 0xff) === t.NUMBER
  }

  isInt32 () {
    return (this._type & 0xff) === t.NUMBER && ((this._type & 0xff00) & t.INT32) !== 0
  }

  isUint32 () {
    return (this._type & 0xff) === t.NUMBER && ((this._type & 0xff00) & t.UINT32) !== 0
  }
}

module.exports = exports = function type (value) {
  return new Type(binding.type(value))
}
