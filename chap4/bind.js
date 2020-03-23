// lodash bind
const partial = require('./partial');

// 2020/3/23
// lodash 实现有点绕，还要再研究一下
// 似乎除了支持类似 partial 的 placeholder 占位功能
// 还支持 new 调用？？
function bind() {

}

// 有点 R.curry 的意思啊，很像。
const Scheduler = (function() {
  const delayedFn = bind(setTimeout, undefined, '_', '_');
  return {
    delay5: partial(delayedFn, '_', 5000),
    delay10: partial(delayedFn, '_', 1000),
    delay: partial(delayedFn, '_', '_'),
  };
})();

// createBind
function createBind(func, bitmask, thisArg) {
  var isBind = bitmask & WRAP_BIND_FLAG,
      Ctor = createCtor(func);

  function wrapper() {
    // 这里是干嘛呢？
    var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, arguments);
  }
  return wrapper;
}