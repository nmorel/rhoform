import React, {Component, PropTypes} from 'react';

export default class Input extends Component {

  static propTypes = {
    type: PropTypes.string.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    type: 'text',
  };

  onChange = (ev) => {
    this.props.onChange(ev.target.value);
  };

  render() {
    return (
      <input
        {...this.props}
        value={this.props.value || ''}
        onChange={this.onChange}
      />
    )
  }
}
