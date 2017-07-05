import _ from 'lodash';
import $ from 'jquery';
function component() {
//   var element = document.createElement('div');
  var element=$('<div></div>')

  // Lodash, currently included via a script, is required for this line to work
  // Lodash, now imported by this script
//   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.html(_.join(['this is test for ','imprt jquery haha test build'],''));
//   return element;
  return element.get(0);
}

document.body.appendChild(component());