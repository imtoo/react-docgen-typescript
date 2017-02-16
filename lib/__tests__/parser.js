"use strict";
var path = require("path");
require("mocha");
var chai_1 = require("chai");
var parser_1 = require("../parser");
var find = function (members, name) {
    return members.reduce(function (acc, member) { return (member.name === name ? member : acc); }, null);
};
describe('getDocumentation (parser) ', function () {
    it('Should parse component with interface', function () {
        var fileName = path.join(__dirname, '../../src/__tests__/data/Column.tsx'); // it's running in ./temp
        var result = parser_1.getDocumentation(fileName);
        chai_1.assert.ok(result.classes);
        chai_1.assert.ok(result.interfaces);
        chai_1.assert.equal(1, result.classes.length);
        chai_1.assert.equal(1, result.interfaces.length);
        var c = result.classes[0];
        chai_1.assert.equal('Column', c.name);
        chai_1.assert.equal('Form column.', c.comment);
        var i = result.interfaces[0];
        chai_1.assert.equal('IColumnProps', i.name);
        chai_1.assert.equal('Column properties.', i.comment);
        chai_1.assert.equal(4, i.members.length);
        chai_1.assert.equal('prop1', i.members[0].name);
        chai_1.assert.equal('prop1 description', i.members[0].comment);
        chai_1.assert.equal('prop2', i.members[1].name);
        chai_1.assert.equal('prop2 description', i.members[1].comment);
        chai_1.assert.equal('prop3', i.members[2].name);
        chai_1.assert.equal('prop3 description', i.members[2].comment);
        chai_1.assert.equal('prop4', i.members[3].name);
        chai_1.assert.equal('prop4 description', i.members[3].comment);
    });
    it('Should parse component without interface', function () {
        var fileName = path.join(__dirname, '../../src/__tests__/data/WithStyledComponent.tsx'); // it's running in ./temp
        var result = parser_1.getDocumentation(fileName);
        chai_1.assert.equal(1, result.classes.length);
        chai_1.assert.equal(0, result.interfaces.length);
    });
    it('Should parse component with StyledComponent', function () {
        var fileName = path.join(__dirname, '../../src/__tests__/data/StyledComponent.tsx'); // it's running in ./temp
        var result = parser_1.getDocumentation(fileName);
        chai_1.assert.equal('React', result.classes[0].extends);
    });
    it('Should parse component with OneOf prop', function () {
        var fileName = path.join(__dirname, '../../src/__tests__/data/OneOfComponent.tsx'); // it's running in ./temp
        var result = parser_1.getDocumentation(fileName);
        var i = result.interfaces[0];
        var oneOfProp = find(i.members, 'oneOfProp');
        chai_1.assert.equal('string', find(i.members, 'name').type, 'name should be string');
        chai_1.assert.equal('any', find(i.members, 'remover').type, 'remover should be any -> because null used');
        chai_1.assert.equal('string', find(i.members, 'additional').type, 'removadditionaler should be string -> choosing first');
        chai_1.assert.equal('string', find(i.members, 'removerNotRequired').type, 'removerNotRequired should be string -> because ?');
        chai_1.assert.equal('void', find(i.members, 'voidProp').type, 'voidProps should be void');
        chai_1.assert.equal('unknown', find(i.members, 'undefinedProp').type, 'undefinedProp should be unknown');
        chai_1.assert.equal('unknown', find(i.members, 'nullProp').type, 'nullProp should be unknown');
        chai_1.assert.equal('enum', oneOfProp.type);
        chai_1.assert.equal(3, oneOfProp.values.length);
    });
    it('Should parse component with custom type prop', function () {
        var fileName = path.join(__dirname, '../../src/__tests__/data/GenericTypes.tsx'); // it's running in ./temp
        var result = parser_1.getDocumentation(fileName);
        var i = result.interfaces[0];
        chai_1.assert.equal('age', i.members[0].name);
        chai_1.assert.equal('number', find(i.members, 'age').type);
        chai_1.assert.equal('firstName', i.members[1].name);
        chai_1.assert.equal('string', find(i.members, 'firstName').type);
        chai_1.assert.equal('gender', i.members[2].name);
        chai_1.assert.deepEqual(['male', 'female'], find(i.members, 'gender').values);
    });
});
//# sourceMappingURL=parser.js.map