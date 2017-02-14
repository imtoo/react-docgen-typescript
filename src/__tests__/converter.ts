import * as path from 'path';
import 'mocha';
import { assert } from 'chai';
import { convertToDocgen } from '../docgenConverter';
import { getDocumentation } from '../parser';

describe('converter to react-docgen syntax', () => {
    it('Should convert component with interface', () => {
        const fileName = path.join(__dirname, '../../src/__tests__/data/Column.tsx'); // it's running in ./temp
        const result = convertToDocgen(getDocumentation(fileName));
        assert.ok(result);
        assert.equal(4, Object.keys(result.props).length)
    });

    it('Should convert component without interface', () => {
        const fileName = path.join(__dirname, '../../src/__tests__/data/WithStyledComponent.tsx'); // it's running in ./temp
        const result = convertToDocgen(getDocumentation(fileName));
        assert.ok(result);
        assert.equal(0, Object.keys(result.props).length)
    });
});
