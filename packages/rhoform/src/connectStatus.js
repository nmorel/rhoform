import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {contextPropTypes} from './context';

export default () => (Child) => {
  class ConnectStatus extends Component {
    static contextTypes = contextPropTypes;

    static propTypes = {
      name: PropTypes.string,
    };

    render() {
      return (
        <Child
          {...this.props}
          status={this.context.rhoform.getStatus(this.props.name)}
        />
      )
    }
  }
  ConnectStatus.displayName = `ConnectStatus(${Child.displayName || Child.name || 'Component'})`;
  return ConnectStatus;
}
