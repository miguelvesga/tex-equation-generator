// test equation: \int_{0}^{\infty}\mathrm{e}^{-x}\mathrm{d}x

var params = { margin: 24, scale: 1.25 };
var data = { in: null, out: null };

function getText() {
  var math = document.getElementById("viewer");
  MathJax.Hub.Queue(["Typeset",MathJax.Hub,math]);
}

function upt(text){
  document.getElementById('viewer').innerHTML = "\\[" + text + "\\]";
}

(function(doc) {
  chrome.tabs.executeScript({code: "window.getSelection().toString();"}, function(result) {
    data.in = (result[0] == null) ? '\\mathrm{No\\,input\\,detected}' : result[0];
    //alert(data.in);
  });

  var math = doc.createElement('script');
  math.type = 'text/javascript';
  math.async = true;
  math.onload = function() {
    upt(data.in);
    getText();
  }
  math.src = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js';
  doc.getElementsByTagName('head')[0].appendChild(math);
}(document));
