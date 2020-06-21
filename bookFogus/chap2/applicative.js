const _ = require('lodash');
const R = require('ramda');
/**
 * reduceRight
 * find
 * reject, against filter
 * all
 * any
 * sortBy, groupBy, countBy
 */

// 你说 lodash 和 ramda 实现有什么优劣吗？
// 1. reduceRight
function allOf() {
    return _.reduceRight(arguments, function(truth, f) {
        return truth && f();
    }, true);
}

function anyOf() {
    return _.reduceRight(arguments, function(truth, f) {
        return truth || f();
    }, false);
}

// 2. reject
function complement(pred) {
    return function() {
        // _.arguments ? 没必要吧，arguments 本来就是类数组
        return !pred.apply(null, arguments);
    }
}

// 利用 complement，反向实现 reject
_.filter(['a', 'b', 'c', 3], complement(_.isNumber));

// 3. sortBy, groupBy, countBy
const albums = [{
    title: 'Sabbath Bloddy Sabbath', 
    genre: 'Metal'
}, {
    title: 'Scientist', 
    genre: 'Dub'
}, {
    title: 'Undertow', 
    genre: 'Metal'
}];

const group = _.groupBy(albums, (a) => a.genre)
console.log(group)

console.log(_.countBy(albums, (a) => a.genre))

// example
function cat() {
    const head = _.first(arguments);
    if (head && typeof Array.isArray(head)) {
        return head.concat.apply(head, Array.prototype.slice.call(arguments, 1));
    } else {
        return [];
    }
}

function construct(head, tail) {
    return cat([head], _.toArray(tail))
}

// 有点抽象啊
// 实际做的就是个展平，flat，搞这么抽象
function mapcat(fn, arr) {
    return cat.apply(null, _.map(arr, fn));
}

function butLast(arr) {
    return _.toArray(arr).slice(0, -1);
}

function interpose(inter, arr) {
    return butLast(mapcat(function(e) {
        return construct(e, [inter]);
    }, arr));
}

// test
console.log(cat([1,2,3], [4, 5], [6, 7]));
console.log(construct(42, [1, 2, 3]));
console.log(mapcat(function(e) {
    return construct(e, ['Yo']);
}, [1, 2, 3]));
console.log(interpose('GWY', [1, 2, 1]));
