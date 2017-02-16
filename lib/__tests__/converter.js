"use strict";
var path = require("path");
require("mocha");
var chai_1 = require("chai");
var docgenConverter_1 = require("../docgenConverter");
var parser_1 = require("../parser");
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
        chai_1.assert.equal('string', result.props['name'].type.name, 'name.type !== string');
        chai_1.assert.equal('string', result.props['additional'].type.name, 'additional.type !== string');
        chai_1.assert.equal('any', result.props['remover'].type.name, 'remover.type !== any');
        chai_1.assert.equal('string', result.props['removerNotRequired'].type.name, 'removerNotRequired.type !== string');
        chai_1.assert.equal('func', result.props['voidProp'].type.name, 'voidProp.type !== func');
        chai_1.assert.equal('enum', result.props['oneOfProp'].type.name, 'oneOfProp.type !== enum');
        chai_1.assert.equal('unknown', result.props['nullProp'].type.name, 'nullProp type !== unknown');
        chai_1.assert.equal('unknown', result.props['undefinedProp'].type.name, 'undefinedProp type !== unknown');
        chai_1.assert.equal(3, result.props['oneOfProp'].type.value.length);
        chai_1.assert.deepEqual(['option1', 'option2', 'option3'], result.props['oneOfProp'].type.value.map(function (o) { return o.value; }));
        chai_1.assert.equal(false, result.props['removerNotRequired'].required, 'removerNotRequired should not be required');
        chai_1.assert.equal(true, result.props['name'].required, 'name should be required');
        chai_1.assert.equal(true, result.props['additional'].required, 'additional should be required');
        chai_1.assert.equal(true, result.props['remover'].required, 'remover should be required');
        chai_1.assert.equal(true, result.props['nullProp'].required, 'nullProp should be required');
        chai_1.assert.equal(true, result.props['voidProp'].required, 'voidProp should be required');
        chai_1.assert.equal(true, result.props['undefinedProp'].required, 'undefinedProp should be required');
        chai_1.assert.equal(true, result.props['oneOfProp'].required, 'oneOfProp should be required');
    });
});
//# sourceMappingURL=converter.js.map