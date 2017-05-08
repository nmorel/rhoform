const arrayRegex = /^(.*)\[([0-9]+)\]$/;

export function get(obj, path) {
  return _get(obj, path.split('.'));
}

function _get(obj, paths) {
  if (!paths.length) {
    return obj;
  }

  if (!obj) {
    return undefined;
  }

  let [head, ...tail] = paths;

  const match = arrayRegex.exec(head);
  if (match && match[2]) {
    const arrayIndex = parseInt(match[2]);
    head = match[1];
    return _get((obj[head] || [])[arrayIndex], tail);
  } else {
    return _get(obj[head], tail);
  }
}

export function set(obj, path, value) {
  if (!path) {
    return value;
  }
  return _assign(obj, path.split('.'), value);
}

function _assign(model, path, value) {
  if (!path.length) {
    return value;
  }

  let [head, ...tail] = path;

  const match = arrayRegex.exec(head);
  if (match && match[2]) {
    const arrayIndex = parseInt(match[2]);
    head = match[1];
    const currentArray = model ? (model[head] || []) : [];
    const newArray = [];
    for (let i = 0; i < Math.max(arrayIndex + 1, currentArray.length); i++) {
      if (i === arrayIndex) {
        newArray[i] = _assign(currentArray[i] || {}, tail, value)
      } else {
        newArray[i] = currentArray[i] || null;
      }
    }
    return Object.assign({}, model || {}, {
      [head]: newArray,
    })
  } else {
    return Object.assign({}, model || {}, {
      [head]: _assign((model || {})[head], tail, value)
    })
  }
}
