'use strict';

var gtf = require('../lib/typetests.js').getTestFor,
	values = {
		'boolean':	[true, false],
		'number':	[0, 12, 12.4, -15, -15.4, new Number, Math.LN2],
		'string':	['', 'string', new String, new String('string'), new String(12), new String(Function)],
		'array':	[[], [1, 'a', new Function, {}], new Array, new Array(1, 'a', new Function, {})],
		'regexp':	[/a/, new RegExp, new RegExp('a')],
		'date':		[new Date],
		'function':	[function(){}, new Function],
	},
	TestClass = function () { this.test = "test" },
	testClassInstance = new TestClass,
	temp;

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['typetests'] = {
	setUp: function(done) {
		
		done();
	},
	'no args': function(test) {
		
		var nbrTests = 3;
		
		for (var key in values)
			nbrTests+= values[key].length * 7;
		
		test.expect(nbrTests);
		
		for (var key in values) {
			for (var key2 in values) {
				for (var i = 0; i < values[key2].length; i++) {
					test.strictEqual(
						gtf(key)(values[key2][i]),
						key === key2 ? true : key,
						'should' + (key === key2 ? ' ' : ' NOT ') + 'be a ' + key + ' but "' + values[key2][i] + '" given.'
					);
				}
			}
		}
		
		
		test.deepEqual(temp = gtf(TestClass)(testClassInstance), true, 'should be a ' + temp + ' but "' + testClassInstance + '" given.');
		test.deepEqual(temp = gtf(TestClass)(new Date), temp, 'should NOT be a ' + temp + ' but "' + testClassInstance + '" given.');
		test.deepEqual(temp = gtf(TestClass)(true), temp, 'should NOT be a ' + temp + ' but "' + true + '" given.');
		
		test.done();
	}
};
