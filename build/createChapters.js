var fs = require('fs');
var _ = require('lodash');  // Alan made me do it.

/**
 * This is the main function.
 */

//var foh = [];

function init(){
  var sections = fs.readdirSync('data/sections/').filter(function (filename) {
   return fs.statSync('data/sections/' + filename).isFile();
  })
  sections = sections.map(function(e, i, a){
    d = JSON.parse(fs.readFileSync('data/sections/' + e, 'utf8'));
    return d;
  });


  var chapters = _.uniq(_.pluck(sections, 'chapter'))

  var foh = _.map(chapters, function(chapter) {
    var mySections = _.filter(sections, function(section) {
      return section.chapter === chapter;
    });
    return {
      chapter: chapter,
      sections: mySections
    };
  });

  fs.writeFileSync('data/master.json', JSON.stringify(foh, indent=2))
}

// getSectionsFromChapter('24')

init();