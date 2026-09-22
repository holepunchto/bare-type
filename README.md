# bare-type

Cross-realm type predicates for Bare.

```
npm i bare-type
```

## Usage

```js
const type = require('bare-type')

if (type(123).isNumber()) {
  console.log(123, 'is a number')
}
```

To test a value against many types at once, switch on `type.of()` rather than walking the predicates. Every constant carries its base type, so each one matches outright:

```js
const type = require('bare-type')

const { ARRAY, DATE, MAP } = type.constants

switch (type.of(value)) {
  case ARRAY:
    return value.length
  case DATE:
    return value.getTime()
  case MAP:
    return value.size
}
```

## API

See the [`bare-type` reference](https://docs.pears.com/reference/bare/modules/bare-type).

## Threat model

`bare-type` is one of the addons Bare compiles into its binary, so it inherits [Bare's threat model](https://github.com/holepunchto/bare/blob/main/docs/threat-model.md). See [`docs/threat-model.md`](docs/threat-model.md) for where this addon sits in it.

## License

Apache-2.0
