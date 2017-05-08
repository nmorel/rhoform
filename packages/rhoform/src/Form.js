import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FormObjectWrapper from './FormObjectWrapper';
import {contextPropTypes} from './context';
import {get, set, setDefault} from './tools';

export default class Form extends Component {

  static childContextTypes = contextPropTypes;

  state = {
    model: {},
    pristine: true,
    pending: false,
    inputStatuses: {},
    submitting: false,
    submitted: false,
  };

  // To avoid setting state when the component is unmounted
  unmounted = false;

  inputs = {};

  pendingValidation = false;
  revalidate = false;

  getChildContext() {
    // We reset the context for inner form
    return {
      rhoform: {
        getName: this.getInputName,
        getValue: this.getInputValue,
        onValueChange: this.onInputValueChange,
        getStatus: this.getInputStatus,
        register: this.registerInput,
        unregister: this.unregisterInput,
        updateValidators: this.updateInputValidators,
      },
    };
  }

  componentWillMount() {
    this.setState({
      model: this.props.value,
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value && this.state.model !== nextProps.value) {
      this.setState({
        model: nextProps.value,
        pending: true,
      });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.pending && !this.state.pending && !nextState.submitting) {
      this.validate(nextState);
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  getInputName = (name) => name;

  getInputValue = (name) => {
    return get(this.state.model, name);
  };

  onInputValueChange = (name, value) => {
    this.setState(({model, inputStatuses}, {onChange}) => {
      const newModel = set(model, name, value);
      onChange && onChange(newModel);
      return {
        model: newModel,
        pending: true,
        pristine: false,
        inputStatuses: {
          ...inputStatuses,
          [name]: {
            ...inputStatuses[name],
            pristine: false,
          }
        }
      };
    });
  };

  getInputStatus = (name) => {
    const inputStatus = this.state.inputStatuses[name] || {};
    return {
      name,
      pending: this.state.pending,
      pristine: !!inputStatus.pristine,
      dirty: !inputStatus.pristine,
      value: this.getInputValue(name),
      errors: inputStatus.errors,
      submitted: this.state.submitted,
    }
  };

  registerInput = (name, input) => {
    this.inputs[name] = input;
    this.setState(({model, inputStatuses}, {onChange}) => {
      const newModel = input.defaultValue ===
      undefined ? model : setDefault(model, name, input.defaultValue);
      if (model !== newModel) {
        onChange && onChange(newModel);
      }
      return {
        model: newModel,
        pending: true,
        inputStatuses: {
          ...inputStatuses,
          [name]: {
            pristine: true,
            pending: false,
            errors: null,
          },
        },
      }
    });
  };

  unregisterInput = (name) => {
    delete this.inputs[name];
    this.setState((state) => {
      const inputStatuses = {...state.inputStatuses};
      delete inputStatuses[name];
      return {
        pending: true,
        inputStatuses,
      };
    });
  };

  updateInputValidators = (name, validators) => {
    if (validators) {
      this.inputs[name].validators = validators;
    } else {
      delete this.inputs[name].validators;
    }
    this.setState({
      pending: true,
    });
  };

  validate = ({model}) => {
    if (this.pendingValidation) {
      this.revalidate = true;
      return this.pendingValidation;
    }

    const promises = [];
    for (let path in this.inputs) {
      if (!this.inputs.hasOwnProperty(path)) continue;

      const input = this.inputs[path];
      const pathValidators = input.validators;
      const pathPromises = [];
      const value = get(model, path);

      for (let validatorName in pathValidators) {
        if (!pathValidators.hasOwnProperty(validatorName)) continue;

        const validator = pathValidators[validatorName];
        pathPromises.push(
          Promise.resolve(validator.isValid(value, validator.props))
            .then(result => result ? false : validator)
            .catch(err => {
              console.error(`An error occured during the validation of ${path}.${validatorName}`, err);
              return validator;
            })
        )
      }
      promises.push(
        Promise.all(pathPromises)
          .then(errors => {
            if (this.unmounted) {
              return false;
            }

            errors = errors.filter(validator => !!validator);
            if (errors.length) {
              const errorsAsObj = {};
              errors.forEach(error => errorsAsObj[error.name] = error);
              this.setState(({inputStatuses}) => ({
                inputStatuses: {
                  ...inputStatuses,
                  [path]: {
                    ...inputStatuses[path],
                    errors: errorsAsObj,
                  }
                }
              }));
              return true;
            } else {
              this.setState(({inputStatuses}) => ({
                inputStatuses: {
                  ...inputStatuses,
                  [path]: {
                    ...inputStatuses[path],
                    errors: null,
                  }
                }
              }));
              return false;
            }
          })
      )
    }

    this.pendingValidation = Promise.all(promises)
      .then((errors) => {
        if (this.unmounted) {
          return false;
        }

        if (this.revalidate) {
          this.revalidate = false;
          return this.validate(this.state);
        } else {
          this.pendingValidation = null;
          this.setState({
            pending: false,
          });

          let inError;
          for (let i = 0; i < errors.length; i++) {
            if (errors[i]) {
              inError = true;
              break;
            }
          }

          return inError;
        }
      });

    return this.pendingValidation;
  };

  submit = () => {
    this.onSubmit();
  };

  onSubmit = (event) => {
    event && event.preventDefault();
    this.setState({
      submitting: true,
      pending: true,
    }, () => {
      this.validate(this.state)
        .then((hasErrors) => {
          this.setState((state, props) => {
            const {onValidSubmit, onInvalidSubmit} = props;
            if (hasErrors) {
              onInvalidSubmit && onInvalidSubmit();
            } else {
              onValidSubmit && onValidSubmit(state.model);
            }
            return {
              submitting: false,
              pending: false,
              submitted: true,
            };
          })
        })
    });
  };

  render() {
    const {children, className, onChange, onValidSubmit, onInvalidSubmit, ...others} = this.props;

    const classNames = 'rhoform' + (className ? ' ' + className : '');
    const content = (
      <FormObjectWrapper>
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
