var store;
var index;
var data = $.getJSON('./assets/searchIndex.json');

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

/*
  $('.search-field').keyup(function() {
    var query = $(this).val();
    if (query === '') {
      jQuery('.search-results').empty();
    } else {
    // perform search
      var results = index.search(query);
      data.then(function(data) {
      $('.search-results').empty().append(
        results.length ?
        results.map(function(result) {
          var el = $('<p>')
            .append($('<a>')
            .attr('href', result.ref)
            .text(store[result.ref].title)
          );
          if (store[result.ref].abstract) {
            el.after($('<p>').text(store[result.ref].abstract));
          }
          return el;
        }) : $('<p><strong>No results found</strong></p>')
        );
      });
    }
  });
});
*/
