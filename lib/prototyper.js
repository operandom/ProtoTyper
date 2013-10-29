/*
 * ProtoTyper
 * https://github.com/operandom/prototyper
 *
 * Copyright (c) 2013 Valéry Herlaud
 * Licensed under the MIT license.
 */

'use strict';

var getTestFor = require('./typetests').getTestFor,
	currentTarget,
	eventMethod,
	currentProperty,
	errors = {
		'final': 'The property "%" of "%" is final, you can\'t modify it\'s descriptor.',
		'name': 'The property name can not be "undefined" or "null".',
		'property': 'No property targeted.',
		'decriptor': 'There is a conflict on the descriptor: %',
		'const': 'The property "%" is a constante, you can\'t add event or type',
		'type': 'TypeError: "%" is not of type "%".'
	};



///////////////////
//               //
//    EXPORTS    //
//               //
///////////////////


module.exports = function() {
	definePrototyper();
	return new ProtoTyper;
}();



///////////////////
//               //
//  CONSTRUCTOR  //
//               //
///////////////////


function ProtoTyper() {
	define(this)
	isConstante('CHANGE', ProtoTyper.CHANGE);
}



////////////////////
//                //
//   DEFINITION   //
//                //
////////////////////


function definePrototyper() {
	
	//
	// CONSTRUCTOR
	//
	
	define(ProtoTyper);
	
	// STATIC CONSTANTES
	
	isConstante('CHANGE', 'propertyChange');
	
	//
	// PROTOTYPE
	//
	
	define(ProtoTyper.prototype)
	
	// MAIN
	
	isConstante('define', define);
	
	
	// EVENT PROXY
	
	// TODO isProperty('eventMethod', setEventMethod);
	
	
	// PROPERTIES
	
	isConstante('const', isConstante);
	isConstante('c', isConstante);
	
	isConstante('property', isProperty);
	isConstante('p', isProperty);
	
	isConstante('user', isUser);
	isConstante('u', isUser);
	
	
	// OPTIONS
	
	isConstante('type', hasType);
	isConstante('t', hasType);
	
	isConstante('event', hasEvent);
	isConstante('e', hasEvent);
	
	isUser('nokey', generateTagGetter(isNotkey));
	isUser('nk', generateTagGetter(isNotkey));
	
	isUser('final', generateTagGetter(isFinal));
	isUser('f', generateTagGetter(isFinal));
}



/////////////////
//             //
//    START    //
//             //
/////////////////



/**
 * Set the object to define.
 * @param {Object} target An object to define.
 */
function define(target) {
	currentTarget = target;
	currentProperty = undefined;
	return this;
}



/////////////////
//             //
//    EVENT    //
//             //
/////////////////



/**
 * Description
 * @param {type} value Description
 */
function setEventMethod(value) {
	eventMethod = value;
	return this;
}



////////////////////
//                //
//   PROPERTIES   //
//                //
////////////////////



/**
 * Define a new constante
 * @param {String} name The name of the property to be defined or modified.
 * @param {String} value value The value associated with the property. Can be any valid JavaScript value. Defaults to undefined.
 */
function isConstante(name, value) {
	currentProperty = name;
	updateDescriptor({
		'value': value,
		'writable': false,
		'enumerable': true,
		'configurable': true
	});
	return this;
}


/**
 * Define a new property
 * @param {String} name The name of the property to be defined or modified.
 * @param {String} value The value associated with the property. Can be any valid JavaScript value. Defaults to undefined.
 */
function isProperty(name, value) {
	currentProperty = name;
	updateDescriptor({
		'value': value,
		'writable': true,
		'enumerable': true,
		'configurable': true
	});
	return this;
}


/**
 * Define a new property with custom method.
 * @param {String} name The name of the property to be defined or modified.
 * @param {Function} f A closure method to define descriptor. The custom method has to return a descriptor. (for more details about descriptor, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Description)
 */
function isUser(name, f) {
	currentProperty = name;
	updateDescriptor(f());
	return this;
}



///////////////////
//               //
//    OPTIONS    //
//               //
///////////////////


function hasType(value) {
	updateDescriptor(null, { 'type': value });
	return this;
}

function hasEvent(value) {
	updateDescriptor(null, { 'event': value ? value : true });
	return this;
}

function isNotkey() {
	updateDescriptor(null, { 'notKey': true });
	return this;
}

function isFinal() {
	updateDescriptor(null, { 'final': true });
	return this;
}



//////////////////////
//                  //
//    DESCRIPTOR    //
//                  //
//////////////////////


function updateDescriptor(newDescriptor, options) {

	var descriptor,
		typeTest,
		eventType;
	
	if (newDescriptor) {
		if (!currentProperty)
			throw exception('name');
		
		descriptor = newDescriptor;
	}
	
	if (options) {
		if (!currentProperty)
			throw exception('property');
		
		descriptor = getCurrentDescriptor();
		
		if (options.type)
			typeTest = getTestFor(options.type);
		
		if (options.event)
			eventType = options.event === true ? ProtoTyper.CHANGE : options.event;
		
		if (descriptor.hasOwnProperty('value') && (typeTest || eventType)) {
			// We need to define a "private" variable.
			push(currentTarget, '_'+currentProperty, {
				'value': descriptor.value,
				'enumerable': false,
				'writable': true
			});
			delete descriptor.value;
		}
		
		if (descriptor.hasOwnProperty('writable') && (typeTest || eventType))
			delete descriptor.writable;
		
		if (typeTest || eventType) {
			descriptor.get = generateGet(currentProperty);
			descriptor.set = generateSet(currentTarget, descriptor.set, currentProperty, typeTest, eventType);
		}
		
		if (options.notKey)
			descriptor.enumerable = false;
		
		if (options.final)
			descriptor.configurable = false;
	}
	
	
	push(currentTarget, currentProperty, descriptor);
}


function getCurrentDescriptor() {
	var d = Object.getOwnPropertyDescriptor(currentTarget, currentProperty) || {};
	
	if (d.hasOwnProperty('configurable') && !d.configurable)
		throw exception('final', currentProperty, currentTarget);
		
	return d;
}

function push(target, property, descriptor) {
	Object.defineProperty(target, property, descriptor);	
}



/////////////////////////
//                     //
//  GETTERS & SETTERS  //
//                     //
/////////////////////////


function generateGet(property) {
	return function() {
		return this["_"+property];
	}
}

function generateSet(target, previousSet, property, typeMethod, eventType) {
	
	var key = '_'+property,
		setters = [null, setT, setE, setTE],
		index = 0;
	
	// Needed because previousSet is never equal to setT, setE or setTE. Don't know why. Push request welcome....
	if (!setT.hasOwnProperty('_name')) {
		Object.defineProperty(setT, '_name', { value: 'setT', configurable: false });
		Object.defineProperty(setE, '_name', { value: 'setE', configurable: false });
		Object.defineProperty(setTE, '_name', { value: 'setTE', configurable: false });
	}
	
	if (previousSet) {
		if (previousSet._name === 'setT' || previousSet._name === 'setTE' || typeMethod)
			index+=1;
		if (hasEvent = previousSet._name === 'setE' || previousSet._name === 'setTE' || previousSet)
			index+=2;
	} else {
		if (typeMethod)
			index+=1;
		if (eventType)
			index+=2;
	}
	
	if (index === 3) {
		if (!typeMethod)
			typeMethod = previousSet(undefined, true);
		if (!eventType)
			eventType = previousSet(undefined, true);
	}
		
	function setT(value, getCache) {
		
		var cache = typeMethod,
			typeResult;
		if (getCache) return cache;
		
		if (this[key] !== value) {
			typeResult = typeMethod(value)
			
			if (typeResult === true)
				this[key] = cache(value);
			else
				throw exception('type', value, typeResult);
		}
	}
	
	function setE(value, getCache) {
		
		var cache = eventType;
		if (getCache) return cache;
		
		if (this[key] !== value) {
			var oldValue = this[key];
			this[key] = value;
			this.emit(eventType, {
				'type': eventType,
				'target': target,
				'property': property,
				'oldValue': oldValue,
				'newValue': value
			});
		}
	}

	function setTE(value) {
		if (this[key] !== value)
		{
			var oldValue = this[key],
				typeResult = typeMethod(value);
			if (typeResult === true)
				this[key] = value;
			else
				throw exception('type', value, typeResult);
			
			this.emit(eventType, {
				'type': eventType,
				'target': target,
				'property': property,
				'oldValue': oldValue,
				'newValue': value
			});
		}
	}
	
	return setters[index];
}



/////////////////////
//                 //
//      TOOLS      //
//                 //
/////////////////////


function exception(type) {
	
	var message = errors[type];
	
	for(var i = 1; i < arguments.length; i++)
		message = message.replace('%', arguments[i].toString().replace(/\((.|\r\n|\n|\r)*/gm, ''));
	
	return "Exception: " + message;
}

function generateTagGetter(getf) {
	return function() {
		return {
			'get': getf
		};
	}
}