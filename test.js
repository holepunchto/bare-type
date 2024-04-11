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
