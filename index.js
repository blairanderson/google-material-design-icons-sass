/**
 * Created by blairanderson on 3/25/2015.
 */


String.prototype.toCamelCase = function() {
  return this.replace(/^([A-Z])|\s(\w)/g, function(match, p1, p2, offset) {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
};
String.prototype.toDash = function(){
  return this.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
};

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var url = 'http://google.github.io/material-design-icons/';

var ICON_PREFIX = ".g-icon";
var PROD = "cdn.";
var DEV = '';
var ENV = PROD;
var OUTPUT_CSSFILE = "./dist/google-material-design-icons-sass.css";
var OUTPUT_SCSSFILE = "./dist/google-material-design-icons-sass.scss";
var HEADER_DATA = "// Base Class Definition \n \n \n"+ICON_PREFIX+":after {display: block;content: ' ';width: 24px;height: 24px;margin: 9px 5px;float: left;} \n \n \n";


fs.writeFileSync(OUTPUT_CSSFILE, '');
fs.writeFileSync(OUTPUT_SCSSFILE, '');
request(url, function(error, response, html) {
  if (!error) {
    var $ = cheerio.load(html);

    fs.appendFileSync(OUTPUT_CSSFILE, HEADER_DATA);
    fs.appendFileSync(OUTPUT_SCSSFILE, HEADER_DATA);

    $('div').each(function() {
      var data = $(this),
        class_name = data.text(),
        className = ICON_PREFIX+"-"+class_name.toCamelCase().toDash(),
        img = data.children()['0'].attribs;
        imgURL = img.src.replace("./", "https://"+ENV+"rawgit.com/google/material-design-icons/gh-pages/"),
        result = className + ":after{background:url(" + imgURL + ");}\n";

      fs.appendFileSync(OUTPUT_CSSFILE, result)
      fs.appendFileSync(OUTPUT_SCSSFILE, result)
    });

  }
});
