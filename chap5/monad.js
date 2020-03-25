// Empty structure
const R = require('ramda');
const { wrap, plus3 } = require('./functor');

// 空容器？
const Empty = function(_) {}
Empty.prototype.map = function() { return this; }
Empty.prototype.fmap = function() { return this; }
const empty = () => new Empty();

const isEven = (n) => Number.isFinite(n) && (n%2 == 0);
const half = (val) => isEven(val) ? wrap(val/2) : empty();

console.log('==========================');
console.log(half(4).map(R.identity));
console.log(half(3).map(R.identity));

const res1 = half(4).fmap(plus3).map(R.identity);
console.log(res1);

const res2 = half(3).fmap(plus3).map(R.identity);
console.log(res2);

// 其他的 Monad，以及更深入的概念 Monadic ？