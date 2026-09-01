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
  isFunction(): boolean
  isAsyncFunction(): boolean
  isGeneratorFunction(): boolean
  isExternal(): boolean
  isBigInt(): boolean
}

declare class Type {
  constructor(type: number)
}

/**
 * Return a `Type` wrapping `value`, exposing `is*()` predicates to test its runtime type across
 * realms.
 * @param value - The value to wrap and test.
 */
declare function type(value: unknown): Type

export = type
