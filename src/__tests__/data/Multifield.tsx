import * as React from 'react';
import { Component } from 'react';
import { Field } from './types';

interface MultifieldProps {
  delimiter?: string;
  error?: string;
  fields?: Field[];
  inheritedStyle?: Object;
  label: string;
  name: string[];
  onBlur?: void;
  onChange?: void;
  value?: string;
}

export class Multifield extends Component<MultifieldProps, {}> {
  static defaultProps = {
    delimiter: '-',
    error: 'Default error message',
    fields: [
      {length: 1, type: 'text'},
      {length: 1, type: 'text'},
      {length: 1, type: 'text'},
      {length: 1, type: 'text'}
    ]
  };

  render() {
    return <div>Test</div>;
  }
}

export default Multifield;
