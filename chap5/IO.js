// can't use this
// const { partial } = require('lodash');

class IO {
  constructor(effect) {
    if (typeof effect !== 'function') {
      throw new Error('IO Usage: function required');
    }
    this.effect = effect;
  }

  static of(a) {
    return new IO(() => a);
  }

  static from(fn) {
    return new IO(fn);
  }

  map(fn) {
    const self = this;
    return new IO(function() {
      return fn(self.effect());
    });
  }

  // how does it work?
  // chain 完直接返回了一个值啊？
  chain(fn) {
    return fn(this.effect());
  }

  run() {
    return this.effect();
  }
}

// ============== test ============== //
const read = (document, id) => () => {
  return document.querySelector(`#${id}`).innerHTML;
};

const write = (document, id) => (val) => {
  return document.querySelector(`#${id}`).innerHTML = val;
};

const readDom = partial(read, document);
const writeDom = partial(write, document);

// 这里好绕啊
const changeToStartCase = IO.from(readDom('student-name'))
  // IO: { effect: () => html-string }
  .map((str) => {
    return str.replace(/\b([a-zA-Z])/g, function(word) {
      return word.toUpperCase()
    });
  })
  // IO: { effect: () => fn(html-string) }
  .map(writeDom('student-name'));
  // IO: { effect: (string: fn(html-string)) => write string to dom }

// 所以，每次 map 的时候，其实已经把上一个 IO 的结果拿到了，并且用自己的函数包裹里一层
// 最后的 run，就是运行最后一个 effect，拿到最后一个值。

changeToStartCase.run();

function partial(fn, ...rest) {
  // const boundArgs = Array.prototype.slice.call(arguments);
  const placeholder = '_';
  const bound = function() {
    let position = 0;
    const length = rest.length;
    let args = Array(length);
    // fill the args
    for (let i = 0; i < length; i++) {
      // what if there is no arguments??
      args[i] = rest[i] === placeholder ? arguments[position++] : rest[i];
    }
    while (position < arguments.length) {
      args.push(arguments[position++]);
    }
    return fn.apply(this, args);
  };
  return bound;
}