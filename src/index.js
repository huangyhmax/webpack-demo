import _ from 'lodash';
import j from 'jquery';
import foo from './foo';

function component() {
  // var element = document.createElement('div');
  var element = j('<div></div>');

  // Lodash, currently included via a script, is required for this line to work
  // Lodash, now imported by this script
  // element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.html(_.join(['Hello','test jquery haha'], ' '))

  // return element;
  return element.get(0);
}

document.body.appendChild(component());
console.log(foo)
console.log(foo())