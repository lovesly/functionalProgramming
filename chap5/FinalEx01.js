// ====================================== //
// example 5.8
const _ = require('lodash');
const R = require('ramda');
const { Maybe } = require('./maybe');
const { Either } = require('./either');
const { cleanInput } = require('../chap4/compose');
const { append } = require('./IO');

const validLength = (len, str) => str.length === len;
// 感觉有点问题
const checkLengthSSN = function(ssn) {
  return Either.of(ssn).filter(_.bind(validLength, undefined, 9))
    // .getOrElseThrow(`Input: ${ssn} is not a valid SSN number`);
};

// fake db method?
const safeFindObject = R.curry(function(db, id) {
  const validObj = {
    ssn: '444444444',
    firstname: 'z',
    lastname: 'l',
  };
  const invalidObj = null;
  return Either.fromNullable(validObj)
  // .getOrElseThrow(`Object not found with ID: ${id}`);
});

// fake
const findStudent = safeFindObject('db');

const csv = arr => arr.join(',');

// logger?
// logger 是个 Log4j 的方法，操
const logger = () => {};
const debugLog = _.partial(logger, 'console', 'basic', 'Monad Example', 'Trace');
const errorLog = _.partial(logger, 'console', 'basic', 'Monad Example', 'Error');

// 如果 curry 函数里面包裹的东西，也是一个 curry 函数，会不会有嵌套太多的性能问题呢？
const trace = R.curry((msg, val) => debugLog(`${msg}: ${val}`));

// ====================================== //
// example 5.9
// need append and cleanInput
const showStudent = (ssn) => {
  return Maybe.fromNullable(ssn)
    .map(cleanInput)
    .chain(checkLengthSSN) // returns a Either, but could throw out an error
    .chain(findStudent) // returns a Either, but could throw out an error
    .map(R.props(['ssn', 'firstname', 'lastname']))
    .map(csv)
    .map(R.tap(console.log))
    .map(append('student-name'))
};

console.log('Example is running...')
// showStudent('444-44-4444').orElse(errorLog);
showStudent('444-44-4444').getOrElse();
// returns a Left()? wtf?