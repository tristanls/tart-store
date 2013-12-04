/*

lifecycle.js - store lifecycle test script

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

var test = module.exports = {};    

test['put should respond with get and delete capabilities'] = function (test) {
    test.expect(4);
    var sponsor = tart.sponsor();

    var verifyPutThenGetBeh = function (capabilities) {
        test.ok(capabilities.get);
        test.ok(capabilities.delete);
        this.behavior = verifyGetThenDelete(capabilities);
        capabilities.get(this.self);
    };

    var verifyGetThenDelete = function (capabilities) {
        return function (value) {
            test.equal(value, 42);
            this.behavior = verifyDeleteThenGet(capabilities.get);
            capabilities.delete(this.self);
        };
    };

    var verifyDeleteThenGet = function (getCapability) {
        return function (message) {
            test.ok(true); // delete ack
            this.behavior = failBeh; // no more messages expected
            getCapability(this.self);
            var finish = this.sponsor(function () {
                test.done();
            });
            finish();
        };
    };

    var failBeh = function (message) {
        test.equal(true, "should not receive response");
    };

    var customer = sponsor(verifyPutThenGetBeh);

    var capabilities = store(sponsor);
    capabilities.put({customer: customer, value: 42});
};