import PropTypes from 'prop-types';

export const contextPropTypes = {
  rhoform: PropTypes.shape({
    onValueChange: PropTypes.func.isRequired,
    getValue: PropTypes.func.isRequired,
    getName: PropTypes.func.isRequired,
    getStatus: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    unregister: PropTypes.func.isRequired,
    updateValidators: PropTypes.func.isRequired,
  }).isRequired,
};
