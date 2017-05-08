import React, {Component, PropTypes} from 'react';

export default class extends Component {

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
