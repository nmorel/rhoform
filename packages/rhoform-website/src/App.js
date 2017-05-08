import React, {Component} from 'react';
import './App.css';
import {Form} from 'rhoform';
import {FormInput, FormCheckbox} from './components';

class App extends Component {
  state = {
    value: null,
  };

  onChange = (value) => {
    this.setState({
      value,
    });
  };

  render() {
    return (
      <div className="App">
        <div className="App--form">
          <Form value={this.state.value} onChange={this.onChange}>
            <FormInput
              description="Simple text property at the root of the form's object"
              name="rootText"
              modelFromForm={this.state.value}
            />

            <FormInput
              description="Text property inside an object"
              name="object.textInObject"
              modelFromForm={this.state.value}
            />

            <FormCheckbox
              description="Boolean property deep inside an object"
              name="object.deep.verydeep.bool"
              modelFromForm={this.state.value}
            />

            <FormInput
              description="Text property inside an object contained in an array at 1st position"
              name="array[0].textInObject"
              modelFromForm={this.state.value}
            />

            <FormInput
              description="Text property contained in an array at 2nd position"
              name="array[1]"
              modelFromForm={this.state.value}
            />
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
