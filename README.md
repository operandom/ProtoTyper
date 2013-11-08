# ProtoTyper [![Build Status](https://travis-ci.org/operandom/ProtoTyper.png?branch=master)](https://travis-ci.org/operandom/ProtoTyper)
ProtoTyper is a utility module for Node.js. Based on `Object.defineProperty`, it allows type verification and event dispatching on property change.

## Getting Started
Install the module with: `npm install proto-typer`

```javascript
var prototyper = require('proto-typer');
```

## Documentation
_(Coming soon)_

## Examples
```javascript
// In Node.js

'use strict';

var prototyper = require('proto-typer'),
	define = prototyper.define,
	util = require('util'),
	Emitter = require('events').EventEmitter;

function User() { this.id = 'User01' }
util.inherits(User, Emitter);

function Pet() {  }
function Dog() { this._type = 'a dog'; }
function Cat() { this._type = 'a cat, but a REALLY big one'; }

util.inherits(Dog, Pet);
util.inherits(Cat, Pet);

function Car() {}


// PROTOTYPES
prototyper

// user
.define(User.prototype)
.c('v', 2.1).nk.f
.p('id').t(String).e('idChange').f
.p('lastName').t(String).e('nameChange').f
.p('firstName').t(String).e('nameChange').f
.p('toString', getFullName).t(Function).nk.f
.p('birthday').type(Date).e().f
.p('pet').t(Pet).e('petChange').f
.p('extensions').e()


// pet
.define(Pet.prototype)
.p('_type', 'an undefined pet').nk.f
.u('type', function() {
	return {
		'get': function() { return this._type; },
		'enumerable': true
	};
});


// METHODS

function getFullName() {
	return (this.firstName || '')  + (this.lastName && this.firstName ? ' ' : '') + (this.lastName || '');
}


// USER

var user = new User;

user.on(prototyper.CHANGE, function(event) {
	// Do something
});

user.on('nameChange', function (event) {
	console.log('User', event.target.id, 'has changed his name to "' + event.target.toString() + '".');
});

user.on('petChange', function(event) {
	console.log(this.toString(), "has a new pet, it's", event.newValue.type, '!');
});

user.on('idChange', function(event) {
	console.log('User "' + event.oldValue + '" change his identity to "' + event.newValue + '".');
});

user.id = ('User02'); // -> User "User01" change his identity to "User02".

user.firstName = 'Jhon'; // -> User User02 has changed his name to "Jhon".
user.lastName = 'Doe'; // -> User User02 has changed his name to "Jhon Doe".

user.pet = new Pet; // -> Jhon Doe has a new pet, it's an undefined pet !
user.pet = new Dog; // -> Jhon Doe has a new pet, it's a dog !
user.pet = new Cat; // -> Jhon Doe has a new pet, it's a cat, but a REALLY big one !

try {
	user.pet = new Car; // -> It's seems that this car is not a pet
}catch(e){
	console.log("It seems that this car is not a pet");
}

console.log('User version:', user.v);
user.v = 2.2; // -> exception
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## Known issues
When event and type are added to property definition, the "private" method automatically created becomes enumerable. (Pull requests are welcome)

## License
Copyright (c) 2013 Valéry Herlaud. Licensed under the MIT license.
See the file LICENSE.md in this distribution for more details.
