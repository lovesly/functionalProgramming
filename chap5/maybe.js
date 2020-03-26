const R = require('ramda');
// 不是很懂为什么要这么设计
// Maybe 上挂载了两个自己子类的实例？
class Maybe {
  static just(a) {
    return new Just(a); 
  }

  static nothing() {
    return new Nothing();
  }

  // what about undefined?
  static fromNullable(a) {
    return a !== null ? Maybe.just(a) : Maybe.nothing();
  }

  // similar with Wrapper
  static of(a) {
    return Maybe.just(a);
  }

  get isNothing() {
    return false;
  }

  get isJust() {
    return false;
  }
};

class Just extends Maybe {
  constructor(value) {
    super();
    this._value = value;
  }

  get value() {
    return this._value;
  }

  // 这里改动了一下，书上是返回的 Maybe.of(f(this._value))
  map(f) {
    return Maybe.fromNullable(f(this._value));
  }

  chain(f) {
    return f(this._value);
  }

  // ? wtf is this?
  getOrElse(other) {
    return this._value || other;
  }

  // ? no return?
  // missing a return here I think
  filter(f) {
    return Maybe.fromNullable(f(this._value) ? this._value : null);
  }

  get isJust() {
    return true;
  }

  toString() {
    return `Maybe.Just(${this._value})`;
  }
};

class Nothing extends Maybe {
  map(f) {
    return this;
  }
  
  chain(f) {
    return this;
  }
  
  get value() {
    throw new TypeError("Cant't extract the value of a Nothing.");
  }

  getOrElse(other) {
    return other;
  }

  // there is no _value
  filter() {
    return this._value;
  }

  get isNothing() {
    return true;
  }

  toString() {
    return 'Maybe.Nothing'
  }
};

// ================================== //
// =============== test ============= //

// fake data. 
const obj1 = {
  school: {
    address: {
      country: 'US'
    }
  }
};
// fake data with no country
const obj2 = {
  school: {
    address: {
      // country: 'US'
    }
  }
};
// fake data with no address;
const obj3 = {
  school: {}
};
// fake data with no school
const obj4 = {};
const safeFindObject = R.curry((db, id) => {
  // no find function, we'll create later.
  // return Maybe.fromNullable(find(db, id));
  return Maybe.fromNullable(obj2);
});
// curry 过的函数，意思是从 student 这张表里查找
// const safeFindStudent = safeFindObject(DB('student'));
const safeFindStudent = safeFindObject('student');

// 理论上，中间任何一步为空，则返回一个 nothing，可以继续 chain 下去，不会干掉这个链式调用
// 但是没有值，最后用 getOrElse 检测一下。
// 优化方向，是不是可以考虑如何把错误信息传递出去，让后面知道是哪一个 functor 失败的？
const getCountry = (student) => student
      .map(R.prop('school'))
      .map(R.prop('address'))
      .map(R.prop('country'))
      .getOrElse('Country does not exist');

const country = R.compose(getCountry, safeFindStudent);
console.log(country('id'));

// page 119, function lift
// confused...
const lift = R.curry((f, value) => {
  return Maybe.fromNullable(value).map(f);
});

const findObject2 = R.curry((db, id) => {
  return obj1;
});
// 书上真是错漏百出，lift 接受两个参数，这里只有一个，f 去哪了？？？卧槽他妈的瞎逼写
const safeFindObject2 = R.compose(lift, findObject2);
safeFindObject2('student', 'id');

module.exports = {
  Maybe, 
  Just,
  Nothing
};

