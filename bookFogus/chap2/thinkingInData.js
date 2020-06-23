const _ = require('lodash');
const __ = require('underscore')

// underscore， lodash 既然移除了 pluck，是不是说明，有其他的替代方案呢？
const res1 = __.pluck([{
    title: 'Chthon', author: 'Anthony'
}, {
    title: 'Gredel', author: 'Gardner'
}, {
    title: 'After Dark'
}], 'author');

console.log(res1);

// demo2
const zombie = {
    name: 'Bub', film: 'Day of the Dead'
};
console.log(__.invert(zombie));

// demo3
const person = {
    name: 'Romy',
    token: 'jsodfh',
    password: 'tigress'
};

// 实现有什么区别呢？
const info = __.pick(person, 'token', 'password');
const info2 = _.pick(person, 'name');

const info3 = __.omit(person, 'name');
const info4 = _.omit(person, 'token');

// demo4, 类 sql 操作，有点意思的
// 需要研究下 lodash，ramda 相应的实现，以及取舍
const lib = [{
    title: 'SICP', isbn: '025123', ed: 1
}, {
    title: 'SICP', isbn: '09170234', ed: 2
}, {
    title: 'Joy of Clojure', isbn: '1204941', ed: 1
}];

console.log(__.where(lib, { title: 'SICP' }));
console.log(__.findWhere(lib, { title: 'SICP', ed: 2 }));
