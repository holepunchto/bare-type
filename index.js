const binding = require('./binding')

const t = binding.constants

class Type {
  constructor(type) {
    this._type = type
  }

  isUndefined() {
    return this._type === t.UNDEFINED
  }

  isNull() {
    return this._type === t.NULL
  }

  isBoolean() {
    return this._type === t.BOOLEAN
  }

  isNumber() {
    return (this._type & 0xff) === t.NUMBER
  }

  isInt32() {
    return (this._type & (0xff | t.INT32)) === t.INT32
  }

  isUint32() {
    return (this._type & (0xff | t.UINT32)) === t.UINT32
  }

  isString() {
    return this._type === t.STRING
  }

  isSymbol() {
    return this._type === t.SYMBOL
  }

  isObject() {
    return (this._type & 0xff) === t.OBJECT
  }

  isArray() {
    return this._type === t.ARRAY
  }

  isArguments() {
    return this._type === t.ARGUMENTS
  }

  isDate() {
    return this._type === t.DATE
  }

  isRegExp() {
    return this._type === t.REGEXP
  }

  isError() {
    return this._type === t.ERROR
  }

  isPromise() {
    return this._type === t.PROMISE
  }

  isProxy() {
    return this._type === t.PROXY
  }

  isGenerator() {
    return this._type === t.GENERATOR
  }

  isMap() {
    return this._type === t.MAP
  }

  isSet() {
    return this._type === t.SET
  }

  isWeakMap() {
    return this._type === t.WEAK_MAP
  }

  isWeakSet() {
    return this._type === t.WEAK_SET
  }

  isWeakRef() {
    return this._type === t.WEAK_REF
  }

  isArrayBuffer() {
    return this._type === t.ARRAYBUFFER
  }

  isSharedArrayBuffer() {
    return this._type === t.SHAREDARRAYBUFFER
  }

  isTypedArray() {
    return (this._type & 0xffff) === t.TYPEDARRAY
  }

  isInt8Array() {
    return this._type === t.INT8ARRAY
  }

  isUint8Array() {
    return this._type === t.UINT8ARRAY
  }

  isUint8ClampedArray() {
    return this._type === t.UINT8CLAMPEDARRAY
  }

  isInt16Array() {
    return this._type === t.INT16ARRAY
  }

  isUint16Array() {
    return this._type === t.UINT16ARRAY
  }

  isInt32Array() {
    return this._type === t.INT32ARRAY
  }

  isUint32Array() {
    return this._type === t.UINT32ARRAY
  }

  isFloat16Array() {
    return this._type === t.FLOAT16ARRAY
  }

  isFloat32Array() {
    return this._type === t.FLOAT32ARRAY
  }

  isFloat64Array() {
    return this._type === t.FLOAT64ARRAY
  }

  isBigInt64Array() {
    return this._type === t.BIGINT64ARRAY
  }

  isBigUint64Array() {
    return this._type === t.BIGUINT64ARRAY
  }

  isDataView() {
    return this._type === t.DATAVIEW
  }

  isModuleNamespace() {
    return this._type === t.MODULE_NAMESPACE
  }

  isBooleanObject() {
    return this._type === t.BOOLEAN_OBJECT
  }

  isNumberObject() {
    return this._type === t.NUMBER_OBJECT
  }

  isStringObject() {
    return this._type === t.STRING_OBJECT
  }

  isSymbolObject() {
    return this._type === t.SYMBOL_OBJECT
  }

  isBigIntObject() {
    return this._type === t.BIGINT_OBJECT
  }

  isFunction() {
    return (this._type & 0xff) === t.FUNCTION
  }

  isAsyncFunction() {
    return (this._type & (0xff | t.ASYNC_FUNCTION)) === t.ASYNC_FUNCTION
  }

  isGeneratorFunction() {
    return (this._type & (0xff | t.GENERATOR_FUNCTION)) === t.GENERATOR_FUNCTION
  }

  isExternal() {
    return this._type === t.EXTERNAL
  }

  isBigInt() {
    return this._type === t.BIGINT
  }
}

// Classifies a number the way the engine does, but without crossing into the
// addon. A number is an `int32` or a `uint32` if it is an integer within the
// respective range, with negative zero being representable as neither.
function numberType(value) {
  if (!Number.isInteger(value)) return t.NUMBER

  // Negative zero passes both range checks below, so exclude it up front.
  if (value === 0 && 1 / value < 0) return t.NUMBER

  let type = t.NUMBER

  if (value >= -0x80000000 && value <= 0x7fffffff) type |= t.INT32
  if (value >= 0 && value <= 0xffffffff) type |= t.UINT32

  return type
}

function of(value) {
  switch (typeof value) {
    case 'undefined':
      return t.UNDEFINED
    case 'boolean':
      return t.BOOLEAN
    case 'number':
      return numberType(value)
    case 'string':
      return t.STRING
    case 'symbol':
      return t.SYMBOL
    case 'object':
      return value === null ? t.NULL : binding.type(value)
    case 'function':
      return binding.type(value)
    case 'bigint':
      return t.BIGINT
  }
}

module.exports = exports = function type(value) {
  return new Type(of(value))
}

exports.of = of

exports.constants = t
