// See https://css-tricks.com/snippets/javascript/get-url-variables
export default function getQueryVariable(variable, _window=window) {
  var query = _window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
};
