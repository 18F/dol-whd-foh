var fs = require('fs');
var jsdom = require("node-jsdom");
var sanitizeHtml = require('sanitize-html');


/**
 * This function takes a chapter number and writes all sections in the chapter to file.
 * @param {chapter} input any number
 */
function getSectionsFromChapter(chapter){
  f = chapter + '.htm'
  var toc = []

  // Read the Chapter file
  var content = fs.readFileSync('src/nativehtml/' + f, 'utf8');
  console.log('parsing: ' + f)
  // Load the file into a DOM and let jquery work its magic...
  jsdom.env(
    content,
    ["https://code.jquery.com/jquery.js"],
    function (err, window) {

      var $ = window.jQuery;

      var sectionPattern = /^\s?\d+[a-zA-Z]\d+/
      
      // STILL A WIP: THE TITLES ARE _WRONG_
      var toc = $("div[class=WordSection1]").find('h1').text().replace(/\n/g, ' ')
      fs.writeFileSync('data/toc/' + chapter + '.json', JSON.stringify({chapter:toc},null,2))
  })
}

/**
 * This function cleans HTML from wacky tags.
 * @param {html} The dirty HTML string.
 * @returns {html} A cleaned-up HTML string.
 */
function cleanHTML(html){
  return sanitizeHtml(html);
}

/**
 * This is the main function.
 */

function init(){
  var html = fs.readdirSync('src/nativehtml/').filter(function (filename) {
   return fs.statSync('src/nativehtml/' + filename).isFile();
  })
  html.map(function(e, i, a){
    return getSectionsFromChapter(e.replace('.htm',''))
  })
}

// getSectionsFromChapter('24')


init();