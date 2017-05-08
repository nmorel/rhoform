import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Checkbox extends Component {

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
