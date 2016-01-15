var store;
var index;
var data = $.getJSON('/dol-whd-foh/assets/searchIndex.json');

data.then(function(d) {
  store = d.store;
  index = lunr.Index.load(d.index);
}).then(function (){  
  var out = search(getParameterByName('q'),getParameterByName('chapter')).map(function (e){
    return "<p><a href='/chapters/" + e.section.slice(0,2) + "#" + e.section + "'>" + e.title + "</a></p>";
  }).join('')
  $("#searchResults").html(out);
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
// $("#searchbox").keyup(function (e){
//  console.log(search($("#searchbox").val()))
// })

$("#searchForm").submit(function (event){
  event.preventDefault();
  q = $("#searchbox").val();
  url = "/dol-whd-foh/search/?q=" + q
  if ($("#chapterCheckbox").prop("checked")){
    url = url + "&chapter=" + window.location.href.split('#')[0].split('chapters/')[1].slice(0,2)
  }
  window.location.href = url
})

$(document).ready(function(){
  var q = getParameterByName('q');
  if (q) {
    $("#searchbox").val(q)
  }
})

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}