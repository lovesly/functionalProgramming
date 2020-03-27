const R = require('ramda');

class Either {
  constructor(value) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  static left(a) {
    return new Left(a);
  }

  static right(a) {
    return new Right(a);
  }

  static fromNullable(val) {
    // very similar
    // return a !== null ? Maybe.just(a) : Maybe.nothing();
    return val !== null ? Either.right(val) : Either.left(val);
  }

  static of(a) {
    // 简直一毛一样
    // return Maybe.just(a);
    return Either.right(a);
  }
}

class Left extends Either {
  map(_) {
    return this;// noop
  }

  get value() {
    throw new TypeError(`Can't extract the value of a Left(a).`)
  }

  getOrElse(other) {
    return other;
  }

  // 书上完全是乱套的，太差劲了。
  orElse(f) {
    return this;
  }

  chain(f) {
    return this;
  }

  // wtf is this?
  getOrElseThrow(a) {
    throw new Error(a);
  }

  filter(f) {
    return this;
  }

  // ??
  toString() {
    return `Either.Left(), find nothing, stupid translator.`;
  }
}

class Right extends Either {
  map(f) {
    // return Either.of(f(this._value));
    return Either.fromNullable(f(this._value));
  }

  getOrElse(other) {
    // value is awlays valid, right?
    return this._value;
  }

  chain(f) {
    // 如果 f 运行后，产生了非法值呢？是不是用 fromNullable 包裹一下
    return f(this._value);
  }

  getOrElseThrow() {
    return this._value;
  }

  filter(f) {
    return Either.fromNullable(f(this._value) ? this._value : null);
  }

  toString() {
    return `Either.Right(${this._value})`;
  }
}

/**
 * 在我看来，几乎没有什么区别啊，为什么要搞个 Either 出来，为什么不用 just 和 nothing？
 */

// ====================================== //
// ================ test ================ //
