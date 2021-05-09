(module
  (func (export "isEqual") (param $first i32) (param $second i32) (result i32)
    (local $result i32)

    local.get $first
    local.get $second
    i32.eq
    if
      i32.const 1
      local.set $result
    else
      i32.const 0
      local.set $result
    end

    local.get $result
  )
)
