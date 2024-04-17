const test = require('brittle')
const type = require('.')

test('undefined', (t) => {
  t.ok(type(undefined).isUndefined(), 'undefined is undefined')
})

test('null', (t) => {
  t.ok(type(null).isNull(), 'null is null')
})

test('boolean', (t) => {
  t.ok(type(true).isBoolean(), 'true is boolean')
  t.ok(type(false).isBoolean(), 'false is boolean')
})

test('number', (t) => {
  t.ok(type(0).isNumber(), '0 is number')
  t.ok(type(0).isInt32(), '0 is int32')
  t.ok(type(0).isUint32(), '0 is uint32')

  t.ok(type(123).isNumber(), '123 is number')
  t.ok(type(123).isInt32(), '123 is int32')
  t.ok(type(123).isUint32(), '123 is uint32')

  t.ok(type(-123).isNumber(), '-123 is number')
  t.ok(type(-123).isInt32(), '-123 is int32')
  t.absent(type(-123).isUint32(), '-123 is not uint32')

  t.ok(type(12.3).isNumber(), '12.3 is number')
  t.absent(type(12.3).isInt32(), '12.3 is not int32')
  t.absent(type(12.3).isUint32(), '12.3 is not uint32')
})

test('string', (t) => {
  t.ok(type('hello').isString(), '\'hello\' is string')
})

test('symbol', (t) => {
  t.ok(type(Symbol('foo')).isSymbol(), 'Symbol(\'foo\') is symbol')
})

test('object', (t) => {
  t.ok(type({}).isObject(), '{} is object')
})

test('array', (t) => {
  t.ok(type([]).isObject(), '[] is object')
  t.ok(type([]).isArray(), '[] is array')
})

test('date', (t) => {
  t.ok(type(new Date()).isObject(), 'Date() is object')
  t.ok(type(new Date()).isDate(), 'Date() is date')
})

test('regexp', (t) => {
  t.ok(type(/hello/).isObject(), '/hello/ is object')
  t.ok(type(/hello/).isRegExp(), '/hello/ is regexp')
})

test('error', (t) => {
  t.ok(type(new Error()).isObject(), 'Error() is object')
  t.ok(type(new Error()).isError(), 'Error() is error')

  t.ok(type(new TypeError()).isObject(), 'TypeError() is object')
  t.ok(type(new TypeError()).isError(), 'TypeError() is error')

  class FooError extends Error {}

  t.ok(type(new FooError()).isObject(), 'FooError() is object')
  t.ok(type(new FooError()).isError(), 'FooError() is error')
})

test('promise', (t) => {
  t.ok(type(new Promise(noop)).isObject(), 'Promise() is object')
  t.ok(type(new Promise(noop)).isPromise(), 'Promise() is promise')

  t.ok(type(Promise.resolve()).isPromise(), 'Promise.resolve() is promise')
  t.ok(type(Promise.reject(new Error()).catch(noop)).isPromise(), 'Promise.reject() is promise')
})

test('proxy', (t) => {
  t.ok(type(new Proxy({}, {})).isObject(), 'Proxy() is object')
  t.ok(type(new Proxy({}, {})).isProxy(), 'Proxy() is proxy')
})

test('generator', (t) => {
  function * Generator () {}

  t.ok(type(Generator()).isObject(), 'Generator() is object')
  t.ok(type(Generator()).isGenerator(), 'Generator() is generator')
})

test('map', (t) => {
  t.ok(type(new Map()).isObject(), 'Map() is object')
  t.ok(type(new Map()).isMap(), 'Map() is map')
})

test('set', (t) => {
  t.ok(type(new Set()).isObject(), 'Set() is object')
  t.ok(type(new Set()).isSet(), 'Set() is set')
})

test('weak map', (t) => {
  t.ok(type(new WeakMap()).isObject(), 'WeakMap() is object')
  t.ok(type(new WeakMap()).isWeakMap(), 'WeakMap() is weak map')
})

test('weak set', (t) => {
  t.ok(type(new WeakSet()).isObject(), 'WeakSet() is object')
  t.ok(type(new WeakSet()).isWeakSet(), 'WeakSet() is weak set')
})

test('weak ref', (t) => {
  t.ok(type(new WeakRef(t)).isObject(), 'WeakRef() is object')
  t.ok(type(new WeakRef(t)).isWeakRef(), 'WeakRef() is weak ref')
})

test('arraybuffer', (t) => {
  t.ok(type(new ArrayBuffer(16)).isObject(), 'ArrayBuffer() is object')
  t.ok(type(new ArrayBuffer(16)).isArrayBuffer(), 'ArrayBuffer() is arraybuffer')
})

test('sharedarraybuffer', (t) => {
  t.ok(type(new SharedArrayBuffer(16)).isObject(), 'ArrayBuffer() is object')
  t.ok(type(new SharedArrayBuffer(16)).isSharedArrayBuffer(), 'SharedArrayBuffer() is sharedarraybuffer')
})

test('typedarray', (t) => {
  t.ok(type(new Uint8Array(16)).isObject(), 'Uint8Array() is object')
  t.ok(type(new Uint8Array(16)).isTypedArray(), 'Uint8Array() is typedarray')
  t.ok(type(new Uint8Array(16)).isUint8Array(), 'Uint8Array() is uint8array')

  t.ok(type(new Int8Array(16)).isObject(), 'Int8Array() is object')
  t.ok(type(new Int8Array(16)).isTypedArray(), 'Int8Array() is typedarray')
  t.ok(type(new Int8Array(16)).isInt8Array(), 'Int8Array() is int8array')
})

test('dataview', (t) => {
  t.ok(type(new DataView(new ArrayBuffer(16))).isObject(), 'DataView() is object')
  t.ok(type(new DataView(new ArrayBuffer(16))).isDataView(), 'DataView() is dataview')
})

test('function', (t) => {
  t.ok(type(function () {}).isFunction(), 'function(){} is function')
  t.ok(type(() => {}).isFunction(), '()=>{} is function')

  t.ok(type(function * () {}).isFunction(), 'function*(){} is function')
  t.ok(type(function * () {}).isGeneratorFunction(), 'function*(){} is generator function')
  t.absent(type(function * () {}).isAsyncFunction(), 'function*(){} is not async function')

  t.ok(type(async function () {}).isFunction(), 'async function(){} is function')
  t.ok(type(async function () {}).isAsyncFunction(), 'async function(){} is async function')
  t.absent(type(async function () {}).isGeneratorFunction(), 'async function(){} is not generator function')

  t.ok(type(async () => {}).isFunction(), 'async ()=>{} is function')
  t.ok(type(async () => {}).isAsyncFunction(), 'async ()=>{} is async function')
  t.absent(type(async () => {}).isGeneratorFunction(), 'async ()=>{} is not generator function')

  t.ok(type(async function * () {}).isFunction(), 'async function*(){} is function')
  t.ok(type(async function * () {}).isAsyncFunction(), 'async function*(){} is async function')
  t.ok(type(async function * () {}).isGeneratorFunction(), 'async function*(){} is generator function')
})

test('bigint', (t) => {
  t.ok(type(0n).isBigInt(), '0n is bigint')

  t.ok(type(1234n).isBigInt(), '1234n is bigint')
  t.ok(type(-1234n).isBigInt(), '-1234n is bigint')

  t.ok(type(BigInt(1234)).isBigInt(), 'BigInt() is bigint')
})

test('tag', (t) => {
  const a = type.createTag(1, 2, 3, 4)
  const b = type.createTag(5, 6, 7, 8)

  const obj = {}

  type.addTag(obj, a)

  t.ok(type.checkTag(obj, a))
  t.absent(type.checkTag(obj, b))
})

test('tag, attempt overwrite', (t) => {
  const a = type.createTag(1, 2, 3, 4)
  const b = type.createTag(5, 6, 7, 8)

  const obj = {}

  type.addTag(obj, a)

  try {
    type.addTag(obj, b)
    t.fail()
  } catch (err) {
    t.comment(err.message)
  }
})

function noop () {}
