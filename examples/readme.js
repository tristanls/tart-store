/*

readme.js - example from the README

The MIT License (MIT)

Copyright (c) 2013 Tristan Slominski

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/
"use strict";

var store = require('../index.js'),
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