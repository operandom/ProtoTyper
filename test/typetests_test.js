'use strict';

var types = require('../lib/typetests.js'),
	values = {
		'boolean':	[true, false],
		'number':	[0, 12, 12.4, -15, -15.4, new Number, Math.LN2],
		'string':	['', 'string', new String, new String('string'), new String(12), new String(Function)],
		'array':	[[], [1, 'a', new Function, {}], new Array, new Array(1, 'a', new Function, {})],
		'regexp':	[/a/, new RegExp, new RegExp('a')],
		'date':		[new Date],
		'function':	[function(){}, new Function],
	};

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
		
		var nbrTests = 0;
		
		for (var key in values)
			nbrTests+= values[key].length * 7;
		
		test.expect(nbrTests);
		
		for (var key in values) {
			for (var key2 in values) {
				for (var i = 0; i < values[key2].length; i++) {
					test.deepEqual(
						types.getTestFor(key)(values[key2][i]),
						key === key2 ? true : key,
						'should be' + (key === key2 ? ' ' : ' NOT ') + 'a ' + key + ' but "' + values[key2][i] + '" given.'
					);
				}
			}
		}
		
		test.done();
	}
};
