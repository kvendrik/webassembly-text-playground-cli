(module
  (func $add (param $1 i32) (param $2 i32) (result i32)
	local.get $1
	local.get $2
	i32.add)
	(export "addTwo" (func $add)))
