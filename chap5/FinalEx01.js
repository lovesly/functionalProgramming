// ====================================== //
// example 5.8
const _ = require('lodash');
const R = require('ramda');
const { Maybe } = require('./maybe');
const { Either } = require('./either');
const { cleanInput } = require('../chap4/compose');
const { append, IO } = require('./IO');
const { db } = require('../helper/helper');

const validLength = (len, str) => str.length === len;
// 感觉有点问题
const checkLengthSSN = function(ssn) {
  return Either.of(ssn).filter(_.bind(validLength, undefined, 9))
    // .getOrElseThrow(`Input: ${ssn} is not a valid SSN number`);
};

// fake db method?
const safeFindObject = R.curry(function(db, id) {
  return Either.fromNullable(db.find(id));
  // .getOrElseThrow(`Object not found with ID: ${id}`);
});

// fake
const findStudent = safeFindObject(db);

const csv = arr => arr.join(',');

// logger?
// logger 是个 Log4j 的方法，操
const logger = () => {};
const debugLog = _.partial(logger, 'console', 'basic', 'Monad Example', 'Trace');
const errorLog = _.partial(logger, 'console', 'basic', 'Monad Example', 'Error');

// 如果 curry 函数里面包裹的东西，也是一个 curry 函数，会不会有嵌套太多的性能问题呢？
const trace = R.curry((msg, val) => console.log(`${msg}: ${val}`));

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

// ================================================== //
// 5.10
const map = R.curry(function(f, container) {
  return container.map(f);
});

const chain = R.curry(function(f, container) {
  return container.chain(f);
});

const lift = R.curry((f, obj) => Maybe.fromNullable(f(obj)));
/**
 * 个人感觉这里有个问题，R.tap，虽然的确会显示 trace 信息，但是不要忘记，monad 的核心就是异常值不会影响函数链的调用
 * 中间任何一步有问题，除非是抛出错误，才会打断 trace，否则 Either.empty, Maybe.Left 并不会组织异常信息的打印
 * 除非我在 trace 信息中进行判断
 * 
 */

// ===================================================== //
// improve with IO monad

const liftIO = function(val) {
  return IO.of(val);
};

const showStudent2 = R.compose(
  R.tap(trace('Student added to HTML page')),
  map(append('student-name')),
  R.tap(trace('weird, not showing the class, but [object Object]')),
  liftIO,
  R.tap(trace('Student info converted to CSV')),
  map(csv),
  map(R.props(['ssn', 'firstname', 'lastname'])),
  R.tap(trace('Record fetched successfully')),
  chain(findStudent),
  R.tap(trace('Input was valid')),
  chain(checkLengthSSN),
  lift(cleanInput)
);
console.log('Example2 is running...')
// IO monad 上没有 getOrElse 这个方法
// let result = showStudent2('444-44-4444').getOrElse('Student not found!');
let result = showStudent2('444-44-4444');
console.log('before run: ', result);
result = result.run();
console.log('after run: ', result);


