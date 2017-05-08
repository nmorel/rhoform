import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FormObjectWrapper from './FormObjectWrapper';
import {get, set} from './tools';

export default class Form extends Component {

  static childContextTypes = {
    rhoform: PropTypes.object
  };

  state = {
    model: {},
  };

  componentWillMount() {
    this.setState({
      model: this.props.value,
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value && this.state.model !== nextProps.value) {
      // TODO Revalidate
      this.setState({
        model: nextProps.value,
      });
    }
  }

  getChildContext() {
    // We reset the context for inner form
    return {
      rhoform: {
        onValueChange: this.onValueChange,
        getValue: this.getValue,
      },
    };
  }

  getValue = (name) => {
    return get(this.state.model, name);
  };

  onValueChange = (name, value) => {
    this.setState(({model}) => ({
      model: set(model, name, value)
    }), () => {
      this.props.onChange && this.props.onChange(this.state.model);
    });
  };

  submit = () => {
    this.onSubmit();
  };

  onSubmit = (event) => {
    event && event.preventDefault();
    // this.setState({
    //   submitted: true,
    // }, () => {
    // if (this.props.onValidSubmit || this.props.onInvalidSubmit) {
    //   const model = this.input.state.model;
    //   const errors = this.getValidations();
    //
    // if (errors && this.props.onInvalidSubmit) {
    //   this.props.onInvalidSubmit(model, errors)
    // } else if (!errors && this.props.onValidSubmit) {
    //   this.props.onValidSubmit(model);
    // }
    // }
    // })
  };

  render() {
    const {children, className, onChange, onValidSubmit, onInvalidSubmit, ...others} = this.props;

    const classNames = 'rhoform' + (className ? ' ' + className : '');
    const content = (
      <FormObjectWrapper name="">
        {children}
      </FormObjectWrapper>
    );

    if (this.context && this.context.rhoform) {
      // Inner form, we use a div to avoid a warning
      // TODO Log explanation to submit the form
      return (
        <div className={classNames} {...others}>
          {content}
        </div>
      );
    } else {
      return (
        <form className={classNames} noValidate {...others} onSubmit={this.onSubmit}>
          {content}
        </form>
      );
    }
  }
}
