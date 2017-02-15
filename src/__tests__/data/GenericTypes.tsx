import * as React from 'react';
import { Age, Person } from './types';

type Name = string;

export interface GenericTypesProps extends Person {
    age: Age;
    firstName: Name;
}

export default class GenericTypes extends React.Component<GenericTypesProps, {}> {

    render() {
        return <div>Test</div>;
    }
}
