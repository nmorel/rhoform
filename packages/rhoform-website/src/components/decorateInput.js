import React from 'react';
import './decorateInput.css';
import _ from 'lodash';

export default (options = {}) => {
  const {wrapWithLabel = true} = options;

  return (Child) => {
    const result = ({description, modelFromForm, ...others}) => {
      if (wrapWithLabel) {
        return (
          <label className="decoratedInput">
            <div className="decoratedInput--description">
              {description}
            </div>
            <div className="decoratedInput--wrapper">
              <div className="decoratedInput--name">{others.name}</div>
              <div className="decoratedInput--input">
                <Child {...others} />
              </div>
              <div className="decoratedInput--result">
                {JSON.stringify(_.get(modelFromForm, others.name), null, 2)}
              </div>
            </div>
          </label>
        )
      } else {
        return (
          <div className="decoratedInput">
            <div className="decoratedInput-description">
              {description}
            </div>
            <div className="decoratedInput--wrapper">
              <div className="decoratedInput--name">{others.name}</div>
              <div className="decoratedInput--input">
                <Child {...others} />
              </div>
              <div className="decoratedInput--result">
                {JSON.stringify(_.get(modelFromForm, others.name), null, 2)}
              </div>
            </div>
          </div>
        )
      }
    };
    result.displayName = `DecorateInput(${Child.displayName || Child.name || 'Component'})`;
    return result;
  }
}
