interface Type {
  isUndefined(): boolean
  isNull(): boolean
  isBoolean(): boolean
  isNumber(): boolean
  isInt32(): boolean
  isUint32(): boolean
  isString(): boolean
  isSymbol(): boolean
  isObject(): boolean
  isArray(): boolean
  isArguments(): boolean
  isDate(): boolean
  isRegExp(): boolean
  isError(): boolean
  isPromise(): boolean
  isProxy(): boolean
  isGenerator(): boolean
  isMap(): boolean
  isSet(): boolean
  isWeakMap(): boolean
  isWeakSet(): boolean
  isWeakRef(): boolean
  isArrayBuffer(): boolean
  isSharedArrayBuffer(): boolean
  isTypedArray(): boolean
  isInt8Array(): boolean
  isUint8Array(): boolean
  isUint8ClampedArray(): boolean
  isInt16Array(): boolean
  isUint16Array(): boolean
  isInt32Array(): boolean
  isUint32Array(): boolean
  isFloat16Array(): boolean
  isFloat32Array(): boolean
  isFloat64Array(): boolean
  isBigInt64Array(): boolean
  isBigUint64Array(): boolean
  isDataView(): boolean
  isModuleNamespace(): boolean
  isBooleanObject(): boolean
  isNumberObject(): boolean
  isStringObject(): boolean
  isSymbolObject(): boolean
  isBigIntObject(): boolean
  isFunction(): boolean
  isAsyncFunction(): boolean
  isGeneratorFunction(): boolean
  isExternal(): boolean
  isBigInt(): boolean
}

declare class Type {
  constructor(type: number)
}

interface Constants {
  readonly UNDEFINED: number
  readonly NULL: number
  readonly BOOLEAN: number
  readonly NUMBER: number
  readonly STRING: number
  readonly SYMBOL: number
  readonly OBJECT: number
  readonly FUNCTION: number
  readonly EXTERNAL: number
  readonly BIGINT: number
  readonly INT32: number
  readonly UINT32: number
  readonly ARRAY: number
  readonly ARGUMENTS: number
  readonly DATE: number
  readonly REGEXP: number
  readonly ERROR: number
  readonly PROMISE: number
  readonly PROXY: number
  readonly GENERATOR: number
  readonly MAP: number
  readonly SET: number
  readonly WEAK_MAP: number
  readonly WEAK_SET: number
  readonly WEAK_REF: number
  readonly ARRAYBUFFER: number
  readonly SHAREDARRAYBUFFER: number
  readonly TYPEDARRAY: number
  readonly DATAVIEW: number
  readonly MODULE_NAMESPACE: number
  readonly BOOLEAN_OBJECT: number
  readonly NUMBER_OBJECT: number
  readonly STRING_OBJECT: number
  readonly SYMBOL_OBJECT: number
  readonly BIGINT_OBJECT: number
  readonly ASYNC_FUNCTION: number
  readonly GENERATOR_FUNCTION: number
  readonly INT8ARRAY: number
  readonly UINT8ARRAY: number
  readonly UINT8CLAMPEDARRAY: number
  readonly INT16ARRAY: number
  readonly UINT16ARRAY: number
  readonly INT32ARRAY: number
  readonly UINT32ARRAY: number
  readonly FLOAT16ARRAY: number
  readonly FLOAT32ARRAY: number
  readonly FLOAT64ARRAY: number
  readonly BIGINT64ARRAY: number
  readonly BIGUINT64ARRAY: number
}

/**
 * Return a `Type` wrapping `value`, exposing `is*()` predicates to test its runtime type across
 * realms.
 * @param value - The value to wrap and test.
 */
declare function type(value: unknown): Type

declare namespace type {
  /**
   * Return the runtime type of `value` as a number, for callers that would otherwise walk a long
   * chain of predicates and can switch on it instead. Every constant carries its base type, so
   * `constants.ARRAY` matches an array outright.
   * @param value - The value to test.
   */
  function of(value: unknown): number

  /**
   * The type constants that `of()` returns.
   */
  const constants: Constants
}

export = type
