const isExist = (value) => value !== undefined && value !== null;

export const defaultValidators = {
  required(value) {
    return value !== undefined && value !== null && value !== '';
  },
  minLength(value, props) {
    return !isExist(value) || value.length >= props.minLength;
  },
  maxLength(value, props) {
    return !isExist(value) || value.length <= props.maxLength;
  },
};

export const calculateValidators = (props, prevProps = {}, cb) => {
  let changed;
  let validators = null;
  for (let validatorName in defaultValidators) {
    if (!defaultValidators.hasOwnProperty(validatorName)) continue;

    const wasActive = !!prevProps[validatorName] || prevProps[validatorName] === 0;
    const isActive = !!props[validatorName] || props[validatorName] === 0;
    changed = wasActive !== isActive;
    if (isActive) {
      validators = validators || {};
      validators[validatorName] = {
        name: validatorName,
        isValid: defaultValidators[validatorName],
        props,
      };
    }
  }

  cb(validators, changed);
};
