import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {contextPropTypes} from './context';
import {calculateValidators} from './validators';

export default (options = {}) => (Child) => {
  class ConnectInput extends Component {
    static contextTypes = contextPropTypes;

    static propTypes = {
      name: PropTypes.string,
    };

    state = {
      value: null,
    };

    componentWillMount() {
      this.setState({
        value: this.context.rhoform.getValue(this.props.name),
      });

      calculateValidators(this.props, undefined, (validators) => {
        this.context.rhoform.register(this.props.name, {
          defaultValue: this.props.hasOwnProperty('defaultValue') ? this.props.defaultValue : options.defaultValue,
          validators,
        });
      });
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        value: this.context.rhoform.getValue(nextProps.name),
      });

      calculateValidators(nextProps, this.props, (validators, changed) => {
        if (changed) {
          this.context.rhoform.updateValidators(nextProps.props.name, validators);
        }
      });
    }

    componentWillUnmount() {
      this.context.rhoform.unregister(this.props.name);
    }

    onChange = (value) => {
      this.context.rhoform.onValueChange(this.props.name, value);
    };

    render() {
      const {value} = this.state;

      return (
        <Child
          {...this.props}
          name={this.context.rhoform.getName(this.props.name)}
          value={value}
          onChange={this.onChange}
        />
      )
    }
  }
  ConnectInput.displayName = `ConnectInput(${Child.displayName || Child.name || 'Component'})`;
  return ConnectInput;
}
