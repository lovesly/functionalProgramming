const R = require('ramda');
// 组合子
// identity
const identity = (a) => a;
// tap, confused? 有点费解
// what about the context??
const tap = (fn) => {
  return (param) => {
    fn.call(null, param);
    return param;
  };
};

// alt
const alt = (fn1, fn2) => {
  return function(val) {
    return func1(val) || func2(val);
  }
};

// wow, it's cleaner
const alt2 = R.curry((fn1, fn2, val) => fn1(val) || fn2(val));

// seq
// 遍历执行, 用 function 和 箭头函数有什么区别吗？
const seq = function(...fns) {
  return function(val) {
    fns.forEach((fn) => {
      fn(val);
    })
  }
};

const seq2 = (...fns) => (val) => {
  fns.forEach((fn) => {
    fn(val);
  });
};

// fork
const fork = function(join, fn1, fn2) {
  return function(val) {
    return join(fn1(val), fn2(val));
  };
};

// wow
const eqMedianAverage = fork(R.equals, R.median, R.mean);
eqMedianAverage([80, 90, 100]);
eqMedianAverage([81, 90, 100]);