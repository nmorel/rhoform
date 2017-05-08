import React from 'react';
import {connectStatus} from 'rhoform';
import './FormInputWrapper.css';

const errorMessages = {
  required: () => 'This field is required',
  minLength: ({minLength}) => `Minimum length : ${minLength}`,
  maxLength: ({maxLength}) => `Maximum length : ${maxLength}`,
};

function FormInputWrapper({htmlFor, name, label, status, children, className, ...others}) {
  // By default, we use the full name of the input as id for the label
  const id = htmlFor ? htmlFor : (htmlFor === undefined ? status.name : htmlFor);

  // Errors are shown if the form has been submitted or the input is dirty
  const showErrors = (status.submitted || status.dirty) && !!status.errors;
  let error;
  if (showErrors) {
    for (let errorKey in status.errors) {
      if (!status.errors.hasOwnProperty(errorKey)) continue;

      error = status.errors[errorKey];
      break;
    }
  }

  return (
    <div
      className={`FormInputWrapper${showErrors ? ' inError' : ''}${className ? ' ' + className : ''}`} {...others}>
      {label && (
        <label className={`FormInputWrapper--label`} htmlFor={id}>{label}</label>
      )}
      <div className={`FormInputWrapper--input`}>
        {React.cloneElement(React.Children.only(children), {id, name})}
      </div>
      {
        showErrors && (
          <label className={`FormInputWrapper--error`} htmlFor={id}>
            {errorMessages[error.name] ? errorMessages[error.name](error.props) : error.name}
          </label>
        )
      }
    </div>
  )
}

export default connectStatus()(FormInputWrapper);
