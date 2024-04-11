cmake_minimum_required(VERSION 3.25)

project(bare_type C)

include(bare)

add_bare_module(bare_type)

target_sources(
  ${bare_type}
  PRIVATE
    binding.c
)
