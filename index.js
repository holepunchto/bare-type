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
    return (this._type & (0xff | t.INT32)) === (t.NUMBER | t.INT32)
  }

  isUint32() {
    return (this._type & (0xff | t.UINT32)) === (t.NUMBER | t.UINT32)
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
    return this._type === (t.OBJECT | t.ARRAY)
  }

  isArguments() {
    return this._type === (t.OBJECT | t.ARGUMENTS)
  }

  isDate() {
    return this._type === (t.OBJECT | t.DATE)
  }

  isRegExp() {
    return this._type === (t.OBJECT | t.REGEXP)
  }

  isError() {
    return this._type === (t.OBJECT | t.ERROR)
  }

  isPromise() {
    return this._type === (t.OBJECT | t.PROMISE)
  }

  isProxy() {
    return this._type === (t.OBJECT | t.PROXY)
  }

  isGenerator() {
    return this._type === (t.OBJECT | t.GENERATOR)
  }

  isMap() {
    return this._type === (t.OBJECT | t.MAP)
  }

  isSet() {
    return this._type === (t.OBJECT | t.SET)
  }

  isWeakMap() {
    return this._type === (t.OBJECT | t.WEAK_MAP)
  }

  isWeakSet() {
    return this._type === (t.OBJECT | t.WEAK_SET)
  }

  isWeakRef() {
    return this._type === (t.OBJECT | t.WEAK_REF)
  }

  isArrayBuffer() {
    return this._type === (t.OBJECT | t.ARRAYBUFFER)
  }

  isSharedArrayBuffer() {
    return this._type === (t.OBJECT | t.SHAREDARRAYBUFFER)
  }

  isTypedArray() {
    return (this._type & 0xffff) === (t.OBJECT | t.TYPEDARRAY)
  }

  isInt8Array() {
    return this._type === (t.OBJECT | t.TYPEDARRAY | t.INT8ARRAY)
  }

  isUint8Array() {
    return this._type === (t.OBJECT | t.TYPEDARRAY | t.UINT8ARRAY)
  }

  isUint8ClampedArray() {
    return this._type === (t.OBJECT | t.TYPEDARRAY | t.UINT8CLAMPEDARRAY)
  }

  isInt16Array() {
    return this._type === (t.OBJECT | t.TYPEDARRAY | t.INT16ARRAY)
  }

  isUint16Array() {
    return this._type === (t.OBJECT | t.TYPEDARRAY | t.UINT16ARRAY)
  }

  isInt32Array() {
    return this._type === (t.OBJECT | t.TYPEDARRAY | t.INT32ARRAY)
  }

  isUint32Array() {
    return this._type === (t.OBJECT | t.TYPEDARRAY | t.UINT32ARRAY)
  }

  isFloat16Array() {
    return this._type === (t.OBJECT | t.TYPEDARRAY | t.FLOAT16ARRAY)
  }

  isFloat32Array() {
    return this._type === (t.OBJECT | t.TYPEDARRAY | t.FLOAT32ARRAY)
  }

  isFloat64Array() {
    return this._type === (t.OBJECT | t.TYPEDARRAY | t.FLOAT64ARRAY)
  }

  isBigInt64Array() {
    return this._type === (t.OBJECT | t.TYPEDARRAY | t.BIGINT64ARRAY)
  }

  isBigUint64Array() {
    return this._type === (t.OBJECT | t.TYPEDARRAY | t.BIGUINT64ARRAY)
  }

  isDataView() {
    return this._type === (t.OBJECT | t.DATAVIEW)
  }

  isModuleNamespace() {
    return this._type === (t.OBJECT | t.MODULE_NAMESPACE)
  }

  isFunction() {
    return (this._type & 0xff) === t.FUNCTION
  }

  isAsyncFunction() {
    return (this._type & (0xff | t.ASYNC_FUNCTION)) === (t.FUNCTION | t.ASYNC_FUNCTION)
  }

  isGeneratorFunction() {
    return (this._type & (0xff | t.GENERATOR_FUNCTION)) === (t.FUNCTION | t.GENERATOR_FUNCTION)
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

module.exports = function type(value) {
  switch (typeof value) {
    case 'undefined':
      return new Type(t.UNDEFINED)
    case 'boolean':
      return new Type(t.BOOLEAN)
    case 'number':
      return new Type(numberType(value))
    case 'string':
      return new Type(t.STRING)
    case 'symbol':
      return new Type(t.SYMBOL)
    case 'object':
      return new Type(value === null ? t.NULL : binding.type(value))
    case 'function':
      return new Type(binding.type(value))
    case 'bigint':
      return new Type(t.BIGINT)
  }
}
