import React, {Component, PropTypes} from 'react';

export default class FormObjectWrapper extends Component {
  static contextTypes = {
    rhoform: PropTypes.object,
  };

  static childContextTypes = {
    rhoform: PropTypes.object
  };

  static propTypes = {
    name: PropTypes.string.isRequired,
  };

  getChildContext() {
    return {
      rhoform: {
        onValueChange: this.onValueChange,
        getValue: this.getValue,
        getName: this.getInputName
      }
    };
  }

  getValue = (name) => {
    return this.context.rhoform.getValue(this.getInputName(name));
  };

  onValueChange = (name, value) => {
    return this.context.rhoform.onValueChange(this.getInputName(name), value);
  };

  getInputName = (name) => {
    return this.props.name ? this.props.name + (name ? '.' + name : '') : name || '';
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
