import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default () => (Child) => {
  const result = class extends Component {
    static contextTypes = {
      rhoform: PropTypes.object.isRequired
    };

    static propTypes = {
      name: PropTypes.string.isRequired,
    };

    state = {
      value: null,
    };

    componentWillMount() {
      this.setState({
        value: this.context.rhoform.getValue(this.props.name),
      })
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        value: this.context.rhoform.getValue(nextProps.name),
      })
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
  result.displayName = `ConnectInput(${Child.displayName || Child.name || 'Component'})`;
  return result;
}
