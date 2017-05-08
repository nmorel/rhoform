import React, {Component} from 'react';
import './App.css';
import {Form, FormInputText, FormInputCheckbox} from 'rhoform';
import {FormInputWrapper} from './components';

class App extends Component {
  state = {
    value: null,
  };

  onChange = (value) => {
    this.setState({
      value,
    });
  };

  onValidSubmit = (model) => {
    window.alert('Success!');
  };

  onInvalidSubmit = () => {
    window.alert('Please fix the errors before submitting');
  };

  render() {
    return (
      <div className="App">
        <div className="App--form">
          <Form value={this.state.value} onChange={this.onChange} onValidSubmit={this.onValidSubmit}
                onInvalidSubmit={this.onInvalidSubmit}>

            <FormInputWrapper
              label="Simple text property at the root of the form's object"
              name="rootText"
            >
              <FormInputText required/>
            </FormInputWrapper>

            <FormInputWrapper
              label="Text property inside an object"
              name="object.textInObject"
            >
              <FormInputText required/>
            </FormInputWrapper>

            <FormInputWrapper
              label="Boolean property deep inside an object"
              name="object.deep.verydeep.bool"
            >
              <FormInputCheckbox required defaultValue={false}/>
            </FormInputWrapper>

            <FormInputWrapper
              label="Text property inside an object contained in an array at 1st position"
              name="array[0].textInObject"
            >
              <FormInputText required minLength={2} maxLength={4}/>
            </FormInputWrapper>

            {
              !!this.state.value && this.state.value.object.deep.verydeep.bool && (
                <FormInputWrapper
                  label="Text property contained in an array at 2nd position"
                  name="array[1]"
                >
                  <FormInputText required/>
                </FormInputWrapper>
              )
            }

            <button type="submit">Submit</button>
          </Form>
        </div>
        <div className="App--result">
          {JSON.stringify(this.state.value, null, 2)}
        </div>
      </div>
    );
  }
}

export default App;
