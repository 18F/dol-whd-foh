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
  var content = fs.readFileSync('../src/nativehtml/' + f, 'utf8');
  console.log('parsing: ' + f)
  // Load the file into a DOM and let jquery work its magic...
  jsdom.env(
    content,
    ["https://code.jquery.com/jquery.js"],
    function (err, window) {

      var $ = window.jQuery;

      var sectionPattern = /^\s?\d+[a-zA-Z]\d+/
      
      // STILL A WIP: THE TITLES ARE _WRONG_
      var toc = genTOC($("div[class=WordSection1]").children().text())
      fs.writeFileSync('../data/toc/' + chapter + '.json', JSON.stringify(toc,null,2))

      $("div[class=WordSection1]").remove();  //Eliminate the Table of Contents from the DOM
      

      // First, filter for section headers
      var sections = $('div').children().filter(function (){
        return $(this).text().search(sectionPattern) == 0;
      })
      // Next, look for the next section header and grab all text/html in bewtween
      .map(function (){
        var text = '';
        var html = '';
        var out = $(this).nextAll().filter(function (){
          m = this.textContent.search(sectionPattern)
          return m == 0
        }).first()

        if (out.index() != -1) {
          array = $(this).nextAll().slice(0, out.index()-$(this).index()-1)
        }
        else {
          array = $(this).nextAll()
        }

        text += array.text()
        array.each(function (){
          html += $(this)[0].outerHTML;
        })
          
          // Define the sectionName, used as metadata and the filename
        sectionName = $(this).text().trim().match(sectionPattern)[0]
          // Add all of the data into an object for file write
        results = {section: sectionName, chapter: chapter.replace('.htm',''), title: $(this).text().trim(), text: text.trim(), html: cleanHTML(html)}

        fs.writeFileSync('../data/sections/' + sectionName + '.json', JSON.stringify(results, null, 2), encoding="utf8")
          // Write to file
        return results;
      })
      return true;
    }
  );
  return true;
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
 * This function cleans HTML from wacky tags.
 * @param {html} The dirty HTML string.
 * @returns {html} A cleaned-up HTML string.
 */
function genTOC(toc){
  toc = toc.replace(/\n/g, ' ').replace(/·/g,'')
  subchapterPattern = /(\d{1,2}[A-Za-z] -.*?)(?=\d{1,2}[A-Za-z] .*?)/g
  sectionsPattern = /(\d{1,2}[A-Za-z]\d{1,2}.*?)(?=\d{1,2}[A-Za-z]\d{1,2}.*?)/g
  var subs = toc.split(subchapterPattern);
  var res = subs.map(function (d){return d.split(sectionsPattern).map(function (d){return d.trim()}).filter(function (d){return d != ''})}).filter(function (d){return d != ''})
  var chapter = res[0].pop(0).replace(" Table of Contents","")
  var subchapters = res.map(function (d){var subchapter = d.shift();return {subchapter: subchapter, sections: d}})
  return {chapter: chapter, results: subchapters}
}


/**
 * This is the main function.
 */

function init(){
  var html = fs.readdirSync('../src/nativehtml/').filter(function (filename) {
   return fs.statSync('../src/nativehtml/' + filename).isFile();
  })
  html.map(function(e, i, a){
    return getSectionsFromChapter(e.replace('.htm',''))
  })
}

// getSectionsFromChapter('24')


init();