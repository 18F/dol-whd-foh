---
---

var store;
var index;
var data = $.getJSON('{{ site.baseurl }}/assets/searchIndex.json');

data.then(function(d) {
  store = d.store;
  index = lunr.Index.load(d.index);
})

/**
 * searches the index for the query, optionally filtered by chapter
 * @param {query} the search query
 * @param {chapter} OPTIONAL: the chapter to filter on
 * @return {results} an array of results 
 */
function search(query, chapter) {
  var results = index.search(query).filter(function (d){
    return (chapter ? d.ref.slice(0,2) == chapter.toString() : true)
  });
  return mapResultsToStore(results);
}

/**
 * maps the results of a search query to the store
 *  
 */
function mapResultsToStore(results) {
  return results.map(function (e,i,a){
    return {'section': e.ref, 'title':store[e.ref].title.trim()}
  })
}

// Bind search to the searchbox... 
$("#searchbox").keyup(function (e){
  console.log(search($("#searchbox").val()))
})

$("#searchButton").on("click", function (e){
  console.log("You clicked me!")
})