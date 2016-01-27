"use strict";

const stackTrace = require('stack-trace');

module.exports = function logError(error) {
    console.error('');

    var stack = stackTrace.parse(error);
    console.error(error.toString());
    stack.forEach(function (trace, index) {
        console.error(`${index}: ${trace.getFileName()}:${trace.getLineNumber()}:in \`${trace.getFunctionName()}'`);
    });

    console.error('');
};
