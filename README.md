# tart-store

_Stability: 1 - [Experimental](https://github.com/tristanls/stability-index#stability-1---experimental)_

[![NPM version](https://badge.fury.io/js/tart-store.png)](http://npmjs.org/package/tart-store)

Implementation of a simple store for [Tiny Actor Run-Time in JavaScript](https://github.com/organix/tartjs).

## Overview

## Usage

To run the below example run:

    npm run examples-readme

```javascript
var store = require('tart-store'),
    tart = require('tart');

var sponsor = tart.sponsor();

var getBeh = function (value) {
    console.log(value);
};

var putCustomer = sponsor(function (capabilities) {
    var getCustomer = sponsor(getBeh);
    capabilities.get(getCustomer);
});

var storeCapabilities = store(sponsor);
storeCapabilities.put({customer: putCustomer, value: 42});

var deletionAckBeh = function () {
    console.log('deleted');
};

var printAndDelete = function (deleteCapability) {
    return function (value) {
        console.log('got and now deleting', value);
        var delCustomer = sponsor(deletionAckBeh);
        deleteCapability(delCustomer);
    };  
};

var anotherCustomer = sponsor(function (capabilities) {
    var getCustomer = sponsor(printAndDelete(capabilities.delete));
    capabilities.get(getCustomer); 
});

storeCapabilities.put({customer: anotherCustomer, value: "'delete me'"});
```

## Tests

    npm test

## Sources

  * [Tiny Actor Run-Time (JavaScript)](https://github.com/organix/tartjs)