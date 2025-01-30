#include <iostream>
#include <vector>
#include "opencv2/core.hpp"
#include <emscripten.h>
#include <emscripten/bind.h>

using namespace emscripten;
using namespace cv;

class TestLib {
public:
  TestLib(int x, std::string y)
    : x(x)
    , y(y)
  {}

  void incrementX() {
    ++x;
  }

  int getX() const { return x; }
  void setX(int x_) { x = x_; }

private:
  int x;
  std::string y;
  Mat cameraP;
  Mat cameraK;

  
};

// Binding code
EMSCRIPTEN_BINDINGS(my_class_example) {
  class_<TestLib>("TestLib")
    .constructor<int, std::string>()
    .function("incrementX", &TestLib::incrementX, allow_raw_pointers())
    .property("x", &TestLib::getX, &TestLib::setX)
    ;
}