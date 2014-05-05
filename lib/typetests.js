/*
 * ProtoTyper
 * https://github.com/operandom/prototyper
 *
 * Copyright (c) 2013 Valéry Herlaud
 * Licensed under the MIT license.
 */
	
'use strict';


exports.getTestFor = function (type) {
	
	var registry = {
		'boolean': isBoolean,
		'number': isNumber,
		'string': isString,
		'array': isArray,
		'regexp': isRegExp,
		'date': isDate,
		'function': isFunction
	};

	registry[Boolean] = isBoolean;
	registry[Number] = isNumber;
	registry[String] = isString;
	registry[Array] = isArray;
	registry[RegExp] = isRegExp;
	registry[Date] = isDate;
	registry[Function] = isFunction;
	
	return registry[type] || isInstanceOf(type);
};

exports.isBoolean	 = isBoolean;
exports.isNumber	 = isNumber;
exports.isString	 = isString;
exports.isArray		 = isArray;
exports.isRegExp	 = isRegExp;
exports.isDate		 = isDate;
exports.isFunction	 = isFunction;
exports.isInstanceOf = isInstanceOf;

function isBoolean(value) {
	return (typeof value === 'boolean' || value.constructor === Boolean) ? true : 'boolean';
}
	
function isNumber(value) {
	return (typeof value === 'number' || value.constructor === Number) ? true : 'number';
}

function isString(value) {
	return (typeof value === 'string' || value.constructor === String) ? true : 'string';
}

function isArray(value) {
	return (value.constructor === Array || value instanceof Array) ? true : 'array';
}

function isRegExp(value) {
	return (value.constructor === RegExp || value instanceof RegExp) ? true : 'regexp';
}

function isDate(value) {
	return (value.constructor === Date || value instanceof Date) ? true : 'date';
}

function isFunction(value) {
	return (typeof value === 'function' || value.constructor === Function) ? true : 'function';
}

function isInstanceOf(type) {
	
	if (Object.prototype.toString.apply(type) !== '[object Function]') {
		throw 'TypeError: The ask type can be an Object';
	}
	
	return function (value) {
		return (value instanceof type) ? true : realTypeOf(type);
	};
}

function realTypeOf(obj) {
	var rawType = Object.prototype.toString.apply(obj);
	return rawType.slice(8, -1).toLowerCase();
}


