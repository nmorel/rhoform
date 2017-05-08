import {connectInput, Input} from 'rhoform';
import decorateInput from './decorateInput';

export default connectInput()(
  decorateInput()(Input)
)
