# ProtoTyper [![Build Status](https://secure.travis-ci.org/operandom/prototyper.png?branch=master)](http://travis-ci.org/operandom/prototyper)
ProtoTyper is a utility module for Node.js. Based on `Object.defineProperty`, it allows type verification and event dispatching on property change.

## Getting Started
Install the module with: `npm install prototyper`

```javascript
var prototyper = require('prototyper');
```

## Documentation
_(Coming soon)_

## Examples
```javascript
var EventEmitter = require('events').EventEmitter,
	util = require('util'),
	protoTyper = require('prototyper');
	
function MyClass () {
	// Do something
}

function MyOtherClass(){
	// Do something
}

// Extend EventEmitter if events needed.
util.inherits(Test, EventEmitter);

protoTyper.setTarget(Myclass)

		  // a const
		  .simple('MY_CONST', "myConstValue")
		  
		  // a variable with initial value and enumerable
		  .simple('myVar01', 'myInitialValue', true, true)
		  
		  // a typed variable with initial value
		  .complex('myVar02', String, 'myInitialValue')
		  
		  // a variable dispatching event on change
		  .complex('myVar03', null, false, true)
		  
		  // a typed variable with initial value, dispatching custom event on change, enumerable and configurable
		  .complex('myVar04', MyOtherClass, 'myInitialValue', 'myEventType', true, true);
		  
var myClass = new MyClass;
myClass.on(prototyper.PROPERTY_CHANGE, function(event) {
	// Do something
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Valéry Herlaud. Licensed under the MIT license.
See the file LICENSE.md in this distribution for more details.
