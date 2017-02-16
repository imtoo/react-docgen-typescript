import * as path from 'path';
import 'mocha';
import { assert } from 'chai';
import { convertToDocgen } from '../docgenConverter';
import { getDocumentation } from '../parser';
import multifieldData from './MultifieldShape';

describe('converter to react-docgen syntax', () => {
    it('Should convert component with interface', () => {
        const fileName = path.join(__dirname, '../../src/__tests__/data/Column.tsx'); // it's running in ./temp
        const result = convertToDocgen(getDocumentation(fileName));
        assert.equal(4, Object.keys(result.props).length)
    });

    it('Should convert component without interface', () => {
        const fileName = path.join(__dirname, '../../src/__tests__/data/WithStyledComponent.tsx'); // it's running in ./temp
        const result = convertToDocgen(getDocumentation(fileName));
        assert.equal(0, Object.keys(result.props).length)
    });

    it('Should convert component with OneOf prop', () => {
        const fileName = path.join(__dirname, '../../src/__tests__/data/OneOfComponent.tsx'); // it's running in ./temp
        const result = convertToDocgen(getDocumentation(fileName));
        assert.equal('string', result.props['name'].type.name, 'name.type !== string')
        assert.equal('string', result.props['additional'].type.name, 'additional.type !== string')
        assert.equal('any', result.props['remover'].type.name, 'remover.type !== any')
        assert.equal('string', result.props['removerNotRequired'].type.name, 'removerNotRequired.type !== string')
        assert.equal('func', result.props['voidProp'].type.name, 'voidProp.type !== func')
        assert.equal('enum', result.props['oneOfProp'].type.name, 'oneOfProp.type !== enum')
        assert.equal('unknown', result.props['nullProp'].type.name, 'nullProp type !== unknown')
        assert.equal('unknown', result.props['undefinedProp'].type.name, 'undefinedProp type !== unknown')
        assert.equal(3, result.props['oneOfProp'].type.value.length)
        assert.deepEqual(['option1', 'option2', 'option3'], result.props['oneOfProp'].type.value.map(o => o.value))

        assert.equal(false, result.props['removerNotRequired'].required, 'removerNotRequired should not be required')
        assert.equal(true, result.props['name'].required, 'name should be required')
        assert.equal(true, result.props['additional'].required, 'additional should be required')
        assert.equal(true, result.props['remover'].required, 'remover should be required')
        assert.equal(true, result.props['nullProp'].required, 'nullProp should be required')
        assert.equal(true, result.props['voidProp'].required, 'voidProp should be required')
        assert.equal(true, result.props['undefinedProp'].required, 'undefinedProp should be required')
        assert.equal(true, result.props['oneOfProp'].required, 'oneOfProp should be required')
    });

    it('Should convert component with nested interface', () => {
        const fileName = path.join(__dirname, '../../src/__tests__/data/Multifield.tsx'); // it's running in ./temp
        const result = convertToDocgen(getDocumentation(fileName));
        assert.deepEqual(result.props, multifieldData)
    });
});

