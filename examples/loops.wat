(module
  (func $log (import "imports" "log") (param i32))
  (func (export "runLoop")
    (local $iteration i32)

    i32.const 1
    local.set $iteration

    loop
      local.get $iteration
      call $log

      (br_if 1 (i32.eq (local.get $iteration) (i32.const 100)))

      i32.const 1
      local.get $iteration
      i32.add
      local.set $iteration

      br 0
    end
  )
)
