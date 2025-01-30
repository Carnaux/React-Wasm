cmake_minimum_required( VERSION 3.5 )
project( TEST_LIB )

set( CMAKE_CXX_STANDARD 11 )

if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Release)
endif(NOT CMAKE_BUILD_TYPE)

set( CMAKE_CXX_FLAGS_RELEASE "-g -Wall -O3" )

set( JS ${CMAKE_SOURCE_DIR}/dist )
file( MAKE_DIRECTORY ${JS} )
set( CMAKE_RUNTIME_OUTPUT_DIRECTORY ${JS} )

set( BUILD_WASM source/libraries/opencv/build_js )
set( SRC_DIR source/ )

include_directories( source/libraries/opencv/include )
include_directories( ${BUILD_WASM} )

file( GLOB opencv_include_modules "source/libraries/opencv/modules/*/include" )
include_directories( ${opencv_include_modules} )

file( GLOB opencv_js "${BUILD_WASM}/lib/*.a" )

include_directories( ${SRC_DIR} )
file( GLOB WASM_SRCS ${SRC_DIR}/debug.cpp )

add_executable( test_lib ${WASM_SRCS} )
target_link_libraries( test_lib ${opencv_js} )

set_target_properties( test_lib PROPERTIES LINK_FLAGS "-lembind -s EXPORT_NAME='TestLib' -s USE_ZLIB=1 -s MODULARIZE=1 -s ENVIRONMENT='web' -s EXPORT_ES6=1 -s ALLOW_MEMORY_GROWTH=1 -s EXPORTED_FUNCTIONS='['_malloc', '_free']' -s EXPORTED_RUNTIME_METHODS='['ccall', 'cwrap', 'FS', 'stringToUTF8']' -s WASM=1 " )
