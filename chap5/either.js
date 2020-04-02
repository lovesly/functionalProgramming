const R = require('ramda');
// import * as R from 'ramda';
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
    return val !== null && val !== undefined ? Either.right(val) : Either.left(val);
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
  // Left could have a value?
  orElse(f) {
    return f(this._value);
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

  get isRight() {
    return false;
  }

  get isLeft() {
    return true;
  }

  // ?? 错误信息？
  toString() {
    return `Either.Left(${this._value})`;
  }
}

class Right extends Either {
  map(f) {
    return Either.of(f(this._value));
    // 为什么不是这个呢？这样就有可能包裹一个错误值比如 null
    // return Either.fromNullable(f(this._value));
  }

  getOrElse(other) {
    // value is awlays valid, right?
    return this._value;
  }

  orElse() {
    return this;
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

  get isRight() {
		return true;
	}

	get isLeft() {
		return false;
	}

  toString() {
    return `Either.Right(${this._value})`;
  }
}

/**
 * 在我看来，几乎没有什么区别啊，为什么要搞个 Either 出来，为什么不用 just 和 nothing？
 * 和 maybe 有点区别，maybe 感觉是侧重于无效数据的检测，包裹在 maybe 里，无限取值没有问题
 * 而 Either 如书上所说，左值包含一个可能的错误信息，可以为失败提供更多信息。。。
 * 哇，需要多研究看几遍
 * 还是感觉很像，empty 也可以保存个错误信息啊？
 */

// ====================================== //
// ================ test ================ //

const safeFindObject = R.curry(function(db, id) {
  // hmm...
  const obj = find(db, id);
  if (obj) {
    return Either.of(obj);
  }
  // Left can contain a value??
  return Either.Left(`Object not found iwth ID: ${id}`);
});

function find(db, id) {
  return {
    Yo: 'Shit'
  };
}

const res = safeFindObject('db', 'id');
// 这里有点体会了
res.getOrElse('if not found, return a new student.');
// 有点意思，Right 会返回自身。Left 会把 函数作用在 错误信息上。可以直接 log
res.orElse(console.log);

console.log(res);
// wait, what?
let tmp = res.map((obj) => {
  obj.plus = 'Fuck';
  return obj;
});

console.log(tmp.toString())
console.log(tmp.value);

module.exports = {
  Either, 
  Left, 
  Right
};