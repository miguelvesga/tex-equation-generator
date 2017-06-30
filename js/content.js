//var alert = prompt("???");
var texin;

var params = { margin: 24, scale: 1.25 };

window.MathJax = {
  jax: ["input/TeX", "output/SVG"],
  extensions: ["tex2jax.js", "MathMenu.js", "MathZoom.js"],
  showMathMenu: false,
  showProcessingMessages: false,
  messageStyle: "none",
  SVG: {
    useGlobalCache: false,
  },
  TeX: {
    extensions: ["AMSmath.js", "AMSsymbols.js", "autoload-all.js"]
  },
  AuthorInit: function() {
    MathJax.Hub.Register.StartupHook("End", function() {
      var mj2img = function(texstring, callback) {
        var input = texstring;
        var wrapper = document.createElement("div");
        wrapper.innerHTML = input;
        var output = { svg: "", img: ""};
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, wrapper]);
        MathJax.Hub.Queue(function() {
          var mjOut = wrapper.getElementsByTagName("svg")[0];
          mjOut.setAttribute("xmlns", "http://www.w3.org/2000/svg");
          // thanks, https://spin.atomicobject.com/2014/01/21/convert-svg-to-png/
          output.svg = mjOut.outerHTML;
          var image = new Image();
          image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(output.svg)));
          image.onload = function() {
            var canvas = document.createElement('canvas');
            canvas.width = (image.width * params.scale) + (params.margin * 2);
            canvas.height = (image.height * params.scale) + (params.margin * 2);
            //canvas.width = 384;
            //canvas.height = 384;
            var context = canvas.getContext('2d');

            var x = canvas.width / 2 - (image.width * params.scale)/ 2;
            var y = canvas.height / 2 - (image.height * params.scale) / 2;
            context.fillStyle = "white";
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.drawImage(image, x, y, (image.width * params.scale), (image.height * params.scale));
            output.img = canvas.toDataURL('image/png');
            callback(output);
          };
        });
      }
      mj2img("\\[" + texin + "\\]", function(output){
        //document.getElementById("target").innerText = output.img;
        var target = document.getElementById('img');
        target.setAttribute( 'src', output.img);
        target.focus();
      });
    });
  }
};

(function(d) {
  chrome.tabs.executeScript({code: "window.getSelection().toString();"}, function(result) {
      texin = result[0];
      if (texin == null || texin == '' || texin == undefined) {
        texin = '\\mathrm{No\\,input\\,detected}';
        params.scale = 0.75;
        params.margin = 8;
      }
  });

  //if (localStorage.margin == null) localStorage.margin = 24;
  //if (localStorage.scale == null) localStorage.scale = 4.0;

  var script = d.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.onload = function() {
    // remote script has loaded
  };
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js';
  d.getElementsByTagName('head')[0].appendChild(script);

}(document));
