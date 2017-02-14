"use strict";
var path = require('path');
require('mocha');
var chai_1 = require('chai');
var docgenConverter_1 = require('../docgenConverter');
var parser_1 = require('../parser');
describe('converter to react-docgen syntax', function () {
    it('Should convert component with interface', function () {
        var fileName = path.join(__dirname, '../../src/__tests__/data/Column.tsx'); // it's running in ./temp
        var result = docgenConverter_1.convertToDocgen(parser_1.getDocumentation(fileName));
        chai_1.assert.ok(result);
        chai_1.assert.equal(4, Object.keys(result.props).length);
    });
    it('Should convert component without interface', function () {
        var fileName = path.join(__dirname, '../../src/__tests__/data/WithStyledComponent.tsx'); // it's running in ./temp
        var result = docgenConverter_1.convertToDocgen(parser_1.getDocumentation(fileName));
        chai_1.assert.ok(result);
        chai_1.assert.equal(0, Object.keys(result.props).length);
    });
});
//# sourceMappingURL=converter.js.map