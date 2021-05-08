(module
  (func $log (import "imports" "log") (param i32))
  (func (export "logValue")
    i32.const 42
    call $log))
