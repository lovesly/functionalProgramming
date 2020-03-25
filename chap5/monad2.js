// Wrapper monad
const R = require('ramda');

class Wrapper {
  constructor(value) {
    this._value = value;
  }

  // ? 像是挂在自身上的工厂函数一样
  static of(a) {
    return new Wrapper(a);
  }

  map(f) {
    return Wrapper.of(f(this._value));
  }

  // 压平嵌套的 Wrapper？
  join() {
    if (!(this._value instanceof Wrapper)) {
      return this;
    }
    return this._value.join();
  }

  toString() {
    return  `Wrapper (${this._value})`;
  }
}

// test 1
const res1 = Wrapper.of('Hello Monads').map(R.toUpper).map(R.identity);
console.log('res1: ', res1);
// test 2, use join to flat the nested wrapper
const tmp = Wrapper.of(new Wrapper('Inner'));
console.log(tmp);
console.log(tmp.join());

