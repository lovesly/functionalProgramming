const _ = require('lodash');
const R = require('ramda');
const { join } = require('lodash');
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
