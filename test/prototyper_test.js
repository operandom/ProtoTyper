'use strict';

var prototyper = require('../lib/prototyper.js'),
	util = require('util'),
	events = require('events'),
	instance;


function ClassTest() {}


exports['prototyper'] = {
	setUp: function(done) {
		
		
		util.inherits(ClassTest, events.EventEmitter);
		
		prototyper
		.d(ClassTest.prototype)
		.c('CONST', 'const')
		.p('var', 'var')
		.p('bool', true).type(Boolean)
		.p('boolE', true).type(Boolean).e()
		.p('number', 3.14).type(Number)
		.p('numberE', 3.14).type(Number).e()
		.p('string', 'string').type(String)
		.p('stringE', 'stringE').type(String).e()
		;
		
		instance = new ClassTest;
		
		done();
	},
	'no args': function(test) {
		
		test.expect(17);
		
		
		// BASE
		test.ok(instance);
		test.strictEqual(instance.CONST, 'const');
		test.strictEqual(instance.var, 'var');
		
		
		// BOOLEAN
		test.strictEqual(instance.bool, true);
		test.doesNotThrow(
			function() {
				instance.bool = false;
				instance.bool = true;
			},
			'A boolean should be assigned.'
		);
		test.throws(
			function() {
				instance.bool = 0;
			},
			"A Number shouldn't be assigned to a Boolean."
		);
		
		test.strictEqual(instance.boolE, true);
		test.doesNotThrow(
			function() {
				instance.boolE = false;
			},
			'A boolean should be assigned.'
		);
		test.strictEqual(instance.boolE, false);
		test.throws(
			function() {
				instance.boolE = 0;
			},
			"A Number shouldn't be assigned to a Boolean."
		);
		
		
		// NUMBER
		var number = 3.14;
		test.strictEqual(instance.number, number, instance.number + ' should be equal to ' + number);
		
		number = new Number(Math.LN2);
		test.doesNotThrow(
			function() {
				instance.number = number;
			},
			number + ' should be assigned to instance.number.'
		);
		test.strictEqual(instance.number, number, instance.number + ' should be equal to ' + number);
		test.throws(
			function() {
				instance.number = true;
			},
			"A Boolean shouln't be assigned to instance.number"
		);
		
		
		// STRING
		var string = 'string2';
		test.strictEqual(instance.string, 'string', instance.string + ' should be equal to "string".');
		test.doesNotThrow(
			function() {
				instance.string = string;
			},
			string + ' should be assigned to instance.string'
		);
		test.strictEqual(instance.string, string, instance.string + ' should be equal to ' + string);
		
		test.done();
	}
};
