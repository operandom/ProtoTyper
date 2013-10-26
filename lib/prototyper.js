/*
 * ProtoTyper
 * https://github.com/operandom/prototyper
 *
 * Copyright (c) 2013 Operandom (Valéry Herlaud)
 * Licensed under the MIT license.
 */

!function() {
	
	'use strict';
	
	var target,
		events = require('events');
	
	exports.setTarget = setTarget;
	exports.simple = simple;
	exports.complex = complex;
	exports.custom = custom;
	exports.verif = verifType;
	exports.PROPERTY_CHANGE = "propertyChange";
	
	
	/**	
	 * Add A target to use with properTyper methods.	
	 * @param {Function} value The target.
	 */
	
	function setTarget(value) {
		target = value;
		
		return this;
	}
	
	
	/**	
	 * Add a property.	
	 * @param {string} property The name of the property to be defined or modified.
	 * @param {Object} value The value associated with the property. Can be any valid JavaScript value (number, object, function, etc) Defaults to undefined.	
	 * @param {Boolean} writable True if and only if the value associated with the property may be changed with an assignment operator. Defaults to false.
	 * @param {Boolean} enumerable True if and only if this property shows up during enumeration of the properties on the corresponding object. Defaults to false.	
	 * @param {Boolean} configurable True if and only if the type of this property descriptor may be changed and if the property may be deleted from the corresponding object. Defaults to false.	
	 */
	
	function simple(property, value, writable, enumerable, configurable) {
		
		Object.defineProperty(target.prototype, property, {
			'value': value,
			'writable': writable,
			'configurable': configurable,
			'enumerable': enumerable
		});
		
		return this;
	}
	
	
	/**	
	 * Add a property.
	 * @param {String} property The name of the property to be defined or modified.	
	 * @param {Object} type The type of the property.	
	 * @param {String} eventType Description	
	 * @param {Boolean} enumerable True if and only if this property shows up during enumeration of the properties on the corresponding object. Defaults to false.	
	 * @param {Boolean} configurable True if and only if the type of this property descriptor may be changed and if the property may be deleted from the corresponding object. Defaults to false.	
	 */
	function complex(property, type, value, eventType, enumerable, configurable) {
		
		if (!verifType(type, value))
			throw typeError(type, value);
		
		var privateKey = '_'+property;
		simple(privateKey, value, true);

		Object.defineProperty(target.prototype, property, {
			'configurable': configurable,
			'enumerable': enumerable,
			get: function() { return this['_'+property] },
			set: defineSetter(property, type, eventType)
		});
		
		return this;
	}
	
	
	function defineSetter(property, type, eventType) {
		
		eventType = verifEventType(eventType);
		
		return setter;
		
		function setter(value) {
			
			var privateKey = '_' + property;
			
			if (target[privateKey] !== value) {
				
				if(verifType(type, value)) {
					
					var oldValue = target[privateKey];
					
					this[privateKey] = value;
					
					if (eventType)
						this.emit(eventType, {
							'type': eventType,
							'property': property,
							'target': this,
							'oldValue': oldValue,
							'newValue': value
						});
				}
				else {
					throw typeError(type, value);
				}	
			}	
		}
	}
	
	function verifEventType(eventType)
	{
		if (typeof eventType === 'boolean' && eventType)
			eventType = 'propertyChange';
		else if (typeof eventType !== 'string' || eventType === "")
			eventType = false;
		
		if (eventType && !(target instanceof events.EventEmitter || target.prototype instanceof events.EventEmitter))
			throw 'The target is not an EventEmitter. Use util.inherits.';
		
		return eventType;
	}
	
	function verifType(type, value) {
		
		var realType = realTypeof(type),
			valueRealType = realTypeof(value);
		
		var primitives = [Boolean, Number, String];
		
		if (!type || type == "" || typeof(value) === 'undefined' || (typeof(value) === 'object' && !value))
			return true;
		
		else if (primitives.indexOf(type) !== -1)
			return (value.constructor === type && value.prototype === undefined) || value instanceof type;
		
		else if (realType === 'string')
			return valueRealType == type;
		
		else if (realType === 'function')
			return value instanceof type;
		
		else
			return valueRealType === realType;
	}
	
	function realTypeof(obj) {
		var rawType = Object.prototype.toString.apply(obj);
		return rawType.slice(8,-1).toLowerCase();
	}

	function typeError(type, value) {
		return 'TypeError: % is not of type %.'.replace('%', value).replace('%', type);
	}
	
	
	/**	
	 * Add a property. For more details see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
	 * @param {string} property The name of the property to be defined or modified.	
	 * @param {Object} options The descriptor for the property being defined or modified.	
	 */
	
	function custom(property, descriptor) {
		Object.defineProperty(target, property, descriptor);
		return this;
	}
	
}();