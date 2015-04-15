var express = require('express');
var app = express();

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200'  
  // log: 'trace'
});

app.get('/api/search', function (req, res) {
	client.search({
		index: 'foh',
		type: 'subchapter',
		body: {
			query: {
				match: {
					body: req.query.q
				}
			},
			highlight: {
				fields: {body: {fragment_size: 250}}
			}
		}

	}, function (err, response) {
		res.json(err||response.hits.hits);
	});
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;	
	console.log('Example app listening at http://%s:%s', host, port);
});
