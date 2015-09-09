var fs = require('fs');

/**
 * This is the main function.
 */

var foh = [];

function init(){
  var sections = fs.readdirSync('../data/sections/').filter(function (filename) {
   return fs.statSync('../data/sections/' + filename).isFile();
  })
  sections.map(function(e, i, a){
    d = fs.readFileSync('../data/sections/' + e, 'utf8')
    foh.push(JSON.parse(d));
    return true
  })
  fs.writeFileSync('../data/master.json', JSON.stringify(foh, indent=2))
}

// getSectionsFromChapter('24')


init();