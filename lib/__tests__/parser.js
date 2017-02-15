"use strict";
var path = require("path");
require("mocha");
var chai_1 = require("chai");
var parser_1 = require("../parser");
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
    it('Should prase component with OneOf prop', function () {
        var fileName = path.join(__dirname, '../../src/__tests__/data/OneOfComponent.tsx'); // it's running in ./temp
        var result = parser_1.getDocumentation(fileName);
        var i = result.interfaces[0];
        chai_1.assert.equal('enum', i.members[1].type);
        chai_1.assert.equal(3, i.members[1].values.length);
    });
    it('Should prase component with custom type prop', function () {
        var fileName = path.join(__dirname, '../../src/__tests__/data/GenericTypes.tsx'); // it's running in ./temp
        var result = parser_1.getDocumentation(fileName);
        var i = result.interfaces[0];
        chai_1.assert.equal('age', i.members[0].name);
        chai_1.assert.equal('number', i.members[0].type);
        chai_1.assert.equal('firstName', i.members[1].name);
        chai_1.assert.equal('string', i.members[1].type);
        chai_1.assert.equal('gender', i.members[2].name);
        chai_1.assert.deepEqual(['"male"', '"female"'], i.members[2].values);
    });
});
//# sourceMappingURL=parser.js.map