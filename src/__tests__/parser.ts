import * as path from 'path';
import 'mocha';
import { assert } from 'chai';
import { getDocumentation } from '../parser';

describe('getDocumentation (parser) ', () => {
    it('Should parse component with interface', () => {
        const fileName = path.join(__dirname, '../../src/__tests__/data/Column.tsx'); // it's running in ./temp
        const result = getDocumentation(fileName);
        assert.ok(result.classes);
        assert.ok(result.interfaces);
        assert.equal(1, result.classes.length);
        assert.equal(1, result.interfaces.length);

        const c = result.classes[0];
        assert.equal('Column', c.name);
        assert.equal('Form column.', c.comment);

        const i = result.interfaces[0];
        assert.equal('IColumnProps', i.name);
        assert.equal('Column properties.', i.comment);
        assert.equal(4, i.members.length);
        assert.equal('prop1', i.members[0].name);
        assert.equal('prop1 description', i.members[0].comment);
        assert.equal('prop2', i.members[1].name);
        assert.equal('prop2 description', i.members[1].comment);
        assert.equal('prop3', i.members[2].name);
        assert.equal('prop3 description', i.members[2].comment);
        assert.equal('prop4', i.members[3].name);
        assert.equal('prop4 description', i.members[3].comment);
    });

    it('Should parse component without interface', () => {
        const fileName = path.join(__dirname, '../../src/__tests__/data/WithStyledComponent.tsx'); // it's running in ./temp
        const result = getDocumentation(fileName);
        assert.equal(1, result.classes.length);
        assert.equal(0, result.interfaces.length);
    });

    it('Should parse component with StyledComponent', () => {
        const fileName = path.join(__dirname, '../../src/__tests__/data/StyledComponent.tsx'); // it's running in ./temp
        const result = getDocumentation(fileName);
        assert.equal('React', result.classes[0].extends);
    });
});
