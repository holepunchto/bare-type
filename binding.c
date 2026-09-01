#include <assert.h>
#include <bare.h>
#include <js.h>
#include <stdint.h>

typedef enum {
  // Base types
  bare_type_undefined = js_undefined,
  bare_type_null = js_null,
  bare_type_boolean = js_boolean,
  bare_type_number = js_number,
  bare_type_string = js_string,
  bare_type_symbol = js_symbol,
  bare_type_object = js_object,
  bare_type_function = js_function,
  bare_type_external = js_external,
  bare_type_bigint = js_bigint,

  // Number types
  bare_type_int32 = 1 << 8,
  bare_type_uint32 = 1 << 9,

  // Object types
  bare_type_array = 1 << 8,
  bare_type_arguments = 2 << 8,
  bare_type_date = 3 << 8,
  bare_type_regexp = 4 << 8,
  bare_type_error = 5 << 8,
  bare_type_promise = 6 << 8,
  bare_type_proxy = 7 << 8,
  bare_type_generator = 8 << 8,
  bare_type_map = 9 << 8,
  bare_type_set = 10 << 8,
  bare_type_weak_map = 11 << 8,
  bare_type_weak_set = 12 << 8,
  bare_type_weak_ref = 13 << 8,
  bare_type_arraybuffer = 14 << 8,
  bare_type_sharedarraybuffer = 15 << 8,
  bare_type_typedarray = 16 << 8,
  bare_type_dataview = 17 << 8,
  bare_type_module_namespace = 18 << 8,

  // TypedArray types
  bare_type_int8array = 1 << 16,
  bare_type_uint8array = 2 << 16,
  bare_type_uint8clampedarray = 3 << 16,
  bare_type_int16array = 4 << 16,
  bare_type_uint16array = 5 << 16,
  bare_type_int32array = 6 << 16,
  bare_type_uint32array = 7 << 16,
  bare_type_float16array = 12 << 16,
  bare_type_float32array = 8 << 16,
  bare_type_float64array = 9 << 16,
  bare_type_bigint64array = 10 << 16,
  bare_type_biguint64array = 11 << 16,

  // Function types
  bare_type_async_function = 1 << 8,
  bare_type_generator_function = 1 << 9,
} bare_type_t;

static inline uint32_t
bare_type_classify(js_env_t *env, js_value_t *value) {
  int err;

  js_value_type_t base;
  err = js_typeof(env, value, &base);
  assert(err == 0);

  uint32_t type = base;

  switch (type) {
  case bare_type_number: {
#define V(t) \
  bool is_##t; \
  err = js_is_##t(env, value, &is_##t); \
  assert(err == 0); \
  if (is_##t) type |= bare_type_##t;

    V(int32)
    V(uint32)
#undef V

    break;
  }

  case bare_type_object: {
#define V(t) \
  bool is_##t; \
  err = js_is_##t(env, value, &is_##t); \
  assert(err == 0); \
  if (is_##t) { \
    type |= bare_type_##t; \
    break; \
  }

    V(array)
    V(typedarray)
    V(date)
    V(map)
    V(set)
    V(regexp)
    V(error)
    V(arraybuffer)
    V(dataview)
    V(promise)
    V(proxy)
    V(sharedarraybuffer)
    V(arguments)
    V(generator)
    V(weak_map)
    V(weak_set)
    V(weak_ref)
    V(module_namespace)
#undef V

    break;
  }

  case bare_type_function: {
#define V(t) \
  bool is_##t; \
  err = js_is_##t(env, value, &is_##t); \
  assert(err == 0); \
  if (is_##t) type |= bare_type_##t;

    V(async_function)
    V(generator_function)
#undef V

    break;
  }
  }

  if (type == (bare_type_object | bare_type_typedarray)) {
    js_typedarray_type_t element = (js_typedarray_type_t) -1;
    err = js_get_typedarray_info(env, value, &element, NULL, NULL, NULL, NULL);
    assert(err == 0);

    switch (element) {
    case js_int8array:
      type |= bare_type_int8array;
      break;
    case js_uint8array:
      type |= bare_type_uint8array;
      break;
    case js_uint8clampedarray:
      type |= bare_type_uint8clampedarray;
      break;
    case js_int16array:
      type |= bare_type_int16array;
      break;
    case js_uint16array:
      type |= bare_type_uint16array;
      break;
    case js_int32array:
      type |= bare_type_int32array;
      break;
    case js_uint32array:
      type |= bare_type_uint32array;
      break;
    case js_float16array:
      type |= bare_type_float16array;
      break;
    case js_float32array:
      type |= bare_type_float32array;
      break;
    case js_float64array:
      type |= bare_type_float64array;
      break;
    case js_bigint64array:
      type |= bare_type_bigint64array;
      break;
    case js_biguint64array:
      type |= bare_type_biguint64array;
      break;
    default:
      break;
    }
  }

  return type;
}

static js_value_t *
bare_type(js_env_t *env, js_callback_info_t *info) {
  int err;

  size_t argc = 1;
  js_value_t *argv[1];

  err = js_get_callback_info(env, info, &argc, argv, NULL, NULL);
  assert(err == 0);

  js_value_t *result;
  err = js_create_uint32(env, bare_type_classify(env, argv[0]), &result);
  assert(err == 0);

  return result;
}

static uint32_t
bare_type_typed(js_value_t *receiver, js_value_t *value, js_typed_callback_info_t *info) {
  int err;

  js_env_t *env;
  err = js_get_typed_callback_info(info, &env, NULL);
  assert(err == 0);

  return bare_type_classify(env, value);
}

static js_value_t *
bare_type_exports(js_env_t *env, js_value_t *exports) {
  int err;

  js_callback_signature_t signature = {
    .version = 0,
    .result = js_uint32,
    .args_len = 2,
    .args = (int[]){
      js_object,
      js_object,
    },
  };

  js_value_t *fn;
  err = js_create_typed_function(env, "type", -1, bare_type, &signature, bare_type_typed, NULL, &fn);
  assert(err == 0);

  err = js_set_named_property(env, exports, "type", fn);
  assert(err == 0);

  js_value_t *constants;
  err = js_create_object(env, &constants);
  assert(err == 0);

  err = js_set_named_property(env, exports, "constants", constants);
  assert(err == 0);

#define V(name, n) \
  { \
    js_value_t *val; \
    err = js_create_uint32(env, n, &val); \
    assert(err == 0); \
    err = js_set_named_property(env, constants, name, val); \
    assert(err == 0); \
  }

  V("UNDEFINED", bare_type_undefined)
  V("NULL", bare_type_null)
  V("BOOLEAN", bare_type_boolean)
  V("NUMBER", bare_type_number)
  V("STRING", bare_type_string)
  V("SYMBOL", bare_type_symbol)
  V("OBJECT", bare_type_object)
  V("FUNCTION", bare_type_function)
  V("EXTERNAL", bare_type_external)
  V("BIGINT", bare_type_bigint)

  V("INT32", bare_type_int32)
  V("UINT32", bare_type_uint32)

  V("ARRAY", bare_type_array)
  V("ARGUMENTS", bare_type_arguments)
  V("DATE", bare_type_date)
  V("REGEXP", bare_type_regexp)
  V("ERROR", bare_type_error)
  V("PROMISE", bare_type_promise)
  V("PROXY", bare_type_proxy)
  V("GENERATOR", bare_type_generator)
  V("MAP", bare_type_map)
  V("SET", bare_type_set)
  V("WEAK_MAP", bare_type_weak_map)
  V("WEAK_SET", bare_type_weak_set)
  V("WEAK_REF", bare_type_weak_ref)
  V("ARRAYBUFFER", bare_type_arraybuffer)
  V("SHAREDARRAYBUFFER", bare_type_sharedarraybuffer)
  V("TYPEDARRAY", bare_type_typedarray)
  V("DATAVIEW", bare_type_dataview)
  V("MODULE_NAMESPACE", bare_type_module_namespace)

  V("INT8ARRAY", bare_type_int8array)
  V("UINT8ARRAY", bare_type_uint8array)
  V("UINT8CLAMPEDARRAY", bare_type_uint8clampedarray)
  V("INT16ARRAY", bare_type_int16array)
  V("UINT16ARRAY", bare_type_uint16array)
  V("INT32ARRAY", bare_type_int32array)
  V("UINT32ARRAY", bare_type_uint32array)
  V("FLOAT16ARRAY", bare_type_float16array)
  V("FLOAT32ARRAY", bare_type_float32array)
  V("FLOAT64ARRAY", bare_type_float64array)
  V("BIGINT64ARRAY", bare_type_bigint64array)
  V("BIGUINT64ARRAY", bare_type_biguint64array)

  V("ASYNC_FUNCTION", bare_type_async_function)
  V("GENERATOR_FUNCTION", bare_type_generator_function)
#undef V

  return exports;
}

BARE_MODULE(bare_type, bare_type_exports)
