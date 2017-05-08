import React, {Component} from 'react';
import PropTypes from 'prop-types';
import connectInput from './connectInput';

export default class InputCheckbox extends Component {

  static propTypes = {
    value: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  };

  onChange = (ev) => {
    this.props.onChange(ev.target.checked);
  };

  render() {
    return (
      <input
        {...this.props}
        type="checkbox"
        checked={!!this.props.value}
        onChange={this.onChange}
      />
    )
  }
}

export const FormInputCheckbox = connectInput()(InputCheckbox);
