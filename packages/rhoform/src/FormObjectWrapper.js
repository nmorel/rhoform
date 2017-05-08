import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {contextPropTypes} from './context';

export default class FormObjectWrapper extends Component {
  static contextTypes = contextPropTypes;

  static childContextTypes = contextPropTypes;

  static propTypes = {
    name: PropTypes.string,
  };

  getChildContext() {
    return {
      rhoform: {
        getName: this.getInputName,
        getValue: this.getInputValue,
        onValueChange: this.onInputValueChange,
        getStatus: this.getInputStatus,
        register: this.registerInput,
        unregister: this.unregisterInput,
        updateValidators: this.updateInputValidators,
      }
    };
  }

  getInputName = (name) => {
    return this.props.name ? this.props.name + (name ? '.' + name : '') : name || '';
  };

  getInputValue = (name) => {
    return this.context.rhoform.getValue(this.getInputName(name));
  };

  onInputValueChange = (name, value) => {
    return this.context.rhoform.onValueChange(this.getInputName(name), value);
  };

  getInputStatus = (name) => {
    return this.context.rhoform.getStatus(this.getInputName(name));
  };

  registerInput = (name, input) => {
    this.context.rhoform.register(this.getInputName(name), input);
  };

  unregisterInput = (name) => {
    this.context.rhoform.unregister(this.getInputName(name));
  };

  updateInputValidators = (name, validators) => {
    this.context.rhoform.updateValidators(this.getInputName(name), validators);
  };

  render() {
    const {children, name, ...others} = this.props;
    return (
      <div {...others}>
        {children}
      </div>
    )
  }
}
