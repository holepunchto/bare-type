#include <assert.h>
#include <bare.h>
#include <js.h>
#include <stdint.h>
#include <utf.h>

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
  bare_type_arguments,
  bare_type_date,
  bare_type_regexp,
  bare_type_error,
  bare_type_promise,
  bare_type_proxy,
  bare_type_generator,
  bare_type_map,
  bare_type_set,
  bare_type_weak_map,
  bare_type_weak_set,
  bare_type_weak_ref,
  bare_type_arraybuffer,
  bare_type_sharedarraybuffer,
  bare_type_typedarray,
  bare_type_dataview,
  bare_type_module_namespace,

  // TypedArray types
  bare_type_int8array = 1 << 16,
  bare_type_uint8array,
  bare_type_uint8clampedarray,
  bare_type_int16array,
  bare_type_uint16array,
  bare_type_int32array,
  bare_type_uint32array,
  bare_type_float32array,
  bare_type_float64array,
  bare_type_bigint64array,
  bare_type_biguint64array,

  // Function types
  bare_type_async_function = 1 << 8,
  bare_type_generator_function = 1 << 9,
} bare_type_t;

static js_value_t *
bare_type (js_env_t *env, js_callback_info_t *info) {
  int err;

  size_t argc = 1;
  js_value_t *argv[1];

  err = js_get_callback_info(env, info, &argc, argv, NULL, NULL);
  assert(err == 0);

  assert(argc == 1);

  js_value_t *value = argv[0];

  uint32_t type;
  err = js_typeof(env, value, (js_value_type_t *) &type);
  assert(err == 0);

  switch (type) {
  case bare_type_number: {
    bool is_int32;
    err = js_is_int32(env, value, &is_int32);
    assert(err == 0);

    if (is_int32) type |= bare_type_int32;

    bool is_uint32;
    err = js_is_uint32(env, value, &is_uint32);
    assert(err == 0);

    if (is_uint32) type |= bare_type_uint32;

    break;
  }
  }

done: {
  js_value_t *result;
  err = js_create_uint32(env, type, &result);
  assert(err == 0);

  return result;
}
}

static js_value_t *
bare_type_exports (js_env_t *env, js_value_t *exports) {
  int err;

#define V(name, fn) \
  { \
    js_value_t *val; \
    err = js_create_function(env, name, -1, fn, NULL, &val); \
    assert(err == 0); \
    err = js_set_named_property(env, exports, name, val); \
    assert(err == 0); \
  }

  V("type", bare_type)
#undef V

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
  V("BIGINT", bare_type_bigint)

  V("INT32", bare_type_int32)
  V("UINT32", bare_type_uint32)
#undef V

  return exports;
}

BARE_MODULE(bare_type, bare_type_exports)
