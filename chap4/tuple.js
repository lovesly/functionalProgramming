const R = require('ramda');

const checkType = R.curry(function(typeDef, obj) {
  if (!R.is(typeDef, obj)) {
    let type = typeof obj;
    throw new TypeError(`Type mismatch. Expected [${typeDef}] but found [${type}]`)
  }
  return obj;
});

const Tuple = function(...rest) {
  // const typeInfo = Array.prototype.slice.call(arguments, 0);
  const typeInfo = rest;
  const isNull = (val) => {
    return val === null || val === undefined;
  };

  const _T = function(...values) {
    if (values.some(isNull)) {
      throw new ReferenceError('Tuples may not have any null values')
    }
    if (values.length !== typeInfo.length) {
      throw new TypeError('Tuple arity does not match its prototype');
    }
    values.map((val, index) => {
      this[`_${index + 1}`] = checkType(typeInfo[index], val);
    });
    Object.freeze(this);
  };

  _T.prototype.values = function() {
    return Reflect.ownKeys(this).map((k) => {
      return this[k];
    });
  };

  return _T;
};

// test
const Status = Tuple(Boolean, String);
const trim = (str) => str.replace(/^\s*|\s*$/g, '');
const normalize = (str) => str.replace(/\-/g, ''); 
const isValid = function(str) {
  if (str.length === 0) {
    return new Status(false, 'Invalid input. Expected non-empty value');
  } else {
    return new Status(true, 'Success!')
  }
};

const res = isValid(normalize(trim('444-44-4444')));
console.log(res);
console.log(res.values());