import React, {Component, PropTypes} from 'react';
import {connectInput, Checkbox} from 'rhoform';
import decorateInput from './decorateInput';

export default connectInput()(
  decorateInput()(Checkbox)
)
