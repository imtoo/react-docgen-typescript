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
        chai_1.assert.equal(4, Object.keys(result.props).length);
    });
    it('Should convert component without interface', function () {
        var fileName = path.join(__dirname, '../../src/__tests__/data/WithStyledComponent.tsx'); // it's running in ./temp
        var result = docgenConverter_1.convertToDocgen(parser_1.getDocumentation(fileName));
        chai_1.assert.equal(0, Object.keys(result.props).length);
    });
    it('Should convert component with OneOf prop', function () {
        var fileName = path.join(__dirname, '../../src/__tests__/data/OneOfComponent.tsx'); // it's running in ./temp
        var result = docgenConverter_1.convertToDocgen(parser_1.getDocumentation(fileName));
        chai_1.assert.equal('enum', result.props['oneOfProp'].type.name);
        chai_1.assert.equal(3, result.props['oneOfProp'].type.value.length);
        chai_1.assert.equal('"option1"', result.props['oneOfProp'].type.value[0].value);
    });
});
//# sourceMappingURL=converter.js.map