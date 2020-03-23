// lodash partial
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
// wow
String.prototype.first = partial(String.prototype.substring, 0, '_');
const res = 'Functional Programming'.first(3);
console.log(res);

String.prototype.asName = partial(String.prototype.replace, /(\w+)\s(\w+)/, '$2 $1');
console.log('Alonzo Church'.asName());
// ?? why use [\w]?
String.prototype.explode = partial(String.prototype.match, /[\w]/gi);
console.log('ABC'.explode);

module.exports = partial;