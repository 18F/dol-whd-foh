#!/usr/bin/env node

var swig = require('swig');
var fs = require('fs');
var _ = require('lodash');
var cheerio = require('cheerio');
var Citation = require('citation');

html = fs.readdirSync('html')
var titles = [];

// Main function
_.forEach(html, function (h) {
	content = fs.readFileSync('html/' + h, encoding="utf-8")
	c = Citation.find(content, {
		types: ["usc","cfr"],
		replace: function(cite) {
			if (cite.type == "usc") {
			    var url = "http://www.law.cornell.edu/uscode/text/" + cite.usc.title + "/" + cite.usc.section;
			    return "<a href='" + url + "'>" + cite.match + "</a>";
			}
			else {
				var url = "http://www.law.cornell.edu/uscode/text/" + cite.cfr.title + "/" + cite.cfr.section;
			    return "<a href='" + url + "'>" + cite.match + "</a>";	
			}
		}
	})
	// console.log(c)
	title = getTitle(content)
	titles.push({src: h, heading: title, content: c.text})
	res = swig.renderFile('template/chapter.html', {
	    content: c.text,
	    title: title
	});
	fs.writeFileSync('../_site/chapters/' + h, res)
})

// Helper function
function getTitle (html) {
    $ = cheerio.load(html);
    return $("h1").html()
}

// Generate the TOC
toc = swig.renderFile('template/toc.html', {
    chapters: titles,
});
fs.writeFileSync('../_site/index.html', toc)


// Load to elasticsearch
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  // log: 'trace'
});

// console.log(titles, client)
_.forEach(titles, function (t) {
	// console.log(typeof(t.content))
	client.create({
		index: 'foh',
		type: 'chapter',
	// 	id: t.src,
		body: {
			chapter: t.src.replace('.html',''),
			heading: t.heading,
			body: t.content
		}
	}, function (err) {
		if (err) {
			console.log(err)		
		}
	})
})
// client.close()