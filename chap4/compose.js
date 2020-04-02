const partial = require('./partial');

function compose(...args) {
  let start = args.length - 1;
  return function() {
    let i = start;
    let result = args[start].apply(this, arguments);
    while (i--) {
      result = args[i].call(this, result);
    }
    return result;
  }
}

// something is wrong.
// compose 的时候，顺序很关键。
// 函数 f: A -> B
// 函数 g: B -> C
// 那么组合的顺序，必须是 先 f 后 g，所以这里必须用 reduceRight
function compose2(...args) {
  // could use reduce
  return function(...innerArgs) {
    const res = args.reduceRight((prev, curr) => {
      if (!Array.isArray(prev)) prev = [prev];
      return curr.apply(this, prev);
    }, innerArgs);
    return res;
  };
}

const trim = str => str.replace(/^\s*|\s*$/g, '');
const normalize = str => str.replace(/\-/g, '');
const validLength = (param, str) => str.length === param;
const checkLengthSSN = partial(validLength, 9);

const cleanInput = compose2(normalize, trim);
const isValidSSN = compose2(checkLengthSSN, cleanInput);

console.log(cleanInput(' 444-44-4444 '));
console.log(isValidSSN(' 444-44-4444 '));

module.exports = {
  cleanInput,
}