jQuery(function($) {
    var index,
        store,
        data = $.getJSON(searchIndexUrl);

    data.then(function(data){
        store = data.store,
        // create index
        index = lunr.Index.load(data.index)
    });

    $('.search-field').keyup(function() {
        var query = $(this).val();
        if(query === ''){
            jQuery('.search-results').empty();
        }
        else {
            // perform search
            var results = index.search(query);
            data.then(function(data) {
                $('.search-results').empty().append(
                    results.length ?
                    results.map(function(result){
                        var el = $('<p>')
                            .append($('<a>')
                                .attr('href', result.ref)
                                .text(store[result.ref].title)
                            );
                        if(store[result.ref].abstract){
                            el.after($('<p>').text(store[result.ref].abstract));
                        }
                        return el;
                    }) : $('<p><strong>No results found</strong></p>')
                );
            }); 
        }
    }); 
});