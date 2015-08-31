var fs = require('fs');
var lunr = require('lunr');

var store = {};

searchIndex = lunr(function () {
  this.field('title', { boost: 10 });
  this.field('body');
  this.ref('ref');
  // this.ref('href');
});

function init(){
  var f = fs.readdirSync('../_site/data/sections');
  var d = f.map(function(e, i, a){
    return loadToIndex(e);
  })
  fs.writeFileSync('../_site/assets/searchIndex.json',JSON.stringify({'index':searchIndex.toJSON(),'store':store}));
  console.log("Index written to file...");
}

/**
 * This function loads the section from JSON into the search index.
 * @param {filename} the filename containing the text to be loaded
 */
function loadToIndex(d) {
  f = fs.readFileSync('../_site/data/sections/' + d, 'utf8');
  data = JSON.parse(f);
  var doc = {
    'title': data["title"],
    'body': data["text"],
    'ref': data["section"]
  };
  store[data.section] = {
    'title': data["title"]
  };
  searchIndex.add(doc);
  return true
}

init();
