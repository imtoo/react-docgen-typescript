import * as React from 'react';
import { Component } from 'react';

export interface OneOfComponentProps {
    name: string;
    additional: string | number;
    remover: string | null;
    voidProp: void;
    oneOfProp: "option1" | "option2" | "option3";
    undefinedProp: undefined;
}

export class OneOfComponent extends Component<OneOfComponentProps, {}> {

    render() {
        return <div>Test</div>;
    }
}

export default OneOfComponent;
