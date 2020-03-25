const R = require('ramda');
class Wrapper{
  constructor(value) {
    this._value = value;
  }

  // map 就是一个暴露出的接口，对 value 进行转换
  map(f) {
    return f(this._value);
  }

  toString() {
    return `Wrapper (${this._value})`;
  }

  // 返回一个 wrapper
  fmap(f) {
    return wrap(f(this._value))
  }
}

const wrap = (val) => new Wrapper(val);

// 这是个容器，理应包裹这个值，但是 javascript 其实可以直接访问到 value。
const val1 = wrap('Get Functional');
console.log(val1.value);

const res = val1.map(R.identity);
console.log(res);

const res2 = val1.map(R.toUpper);
console.log(res2);

// functor
// fmap:: (a -> b) -> Wrapper(A) -> Wrapper(B)
const plus = R.curry((a, b) => a + b);
const plus3 = plus(3);
const plus10 = plus(10);

const two = wrap(2);
const five = two.fmap(plus3);
const res5 = five.map(R.identity());
console.log('5: ', res5);
// 如何实现私有属性？对外隐藏 value？除了下划线
console.log('5: ', five.value)
const res15 = two.fmap(plus3).fmap(plus10).map(R.identity);
console.log(res15);

// 链式调用？
const infoLogger = (val) => {console.log('logging value: ', val)};
const afterLog = two.fmap(plus3).fmap(R.tap(infoLogger));
// 有点意思，这样调用完之后，仍然是这个值，不过换了个 Wrapper
// 我在想，有没有复用的可能呢？如果值不变的话
console.log(afterLog.map(R.identity));

// two cranky examples
// 朦胧中有一点体会，functor 这种数据结构，其实是保存自己的值，然后允许中间函数来对值进行转换
// 并传递给下一个函数。那么问题就简化为，能否保证一系列的函数，输入输出的值符合链条中的要求。
// map，filter 就是 Functor 的应用。返回新数组
// 无副作用
wrap('Get Functional').fmap(R.identity); // -> Wraper('Get Functional')
// 必须是可组合的，分开 fmap 和 compose 后fmap 是一个结果。。。
const finalRes = two.fmap(R.compose(plus3, R.tap(infoLogger))).map(R.identity);
console.log('Final result: ', finalRes);

// 最后一个问题，就是，性能。每调用一次，就返回个新的数据结构，效率感觉不咋地
// immutable 是怎么做的？
// 以及会不会不经意间造成垃圾永远不会回收的问题？

module.exports = {
  Wrapper,
  wrap,
  plus3,
};