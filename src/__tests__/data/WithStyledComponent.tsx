import * as Radium from 'radium';
import * as React from 'react';
import { Component } from 'react';

@Radium
export default class Container extends Component<{}, {}> {
  render() {
    return (
      <div>
        <div>Test</div>
      </div>
    );
  }
}
