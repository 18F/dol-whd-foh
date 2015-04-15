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
	content = convertChapter(content)
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
	fs.writeFileSync('../_site/chapters/' + h, res);
});

// Helper function
function getTitle (html) {
    $ = cheerio.load(html);
    return $("h1").html();
}

function convertChapter(html) {
	$ = cheerio.load(html);
	$("p > strong").each(function (i, elem) {
		$(this).replaceWith("<h4 class='testClass'>" + $(this).text() + "</h4>");
	})
	return $.html()
}

// Generate the TOC
toc = swig.renderFile('template/toc.html', {
    chapters: titles,
});
fs.writeFileSync('../_site/index.html', toc);


// Load to elasticsearch
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  // log: 'trace'
});

_.forEach(titles, function (t) {
	$ = cheerio.load(t.content)
	subchapter = $("h4")
	subchapter.each(function (i, el){ 
		// console.log("Hello?")
		body = $(this).nextUntil("h4").text()
		if (body != "") {
			client.create({
				index: 'foh',
				type: 'subchapter',
			// 	id: t.src,
				body: {
					chapter: t.src.replace('.html',''),
					subchapter: $(this).text(),
					heading: t.heading,
					body: $(this).nextUntil("h4").text()
				}
			})
		} 
	})
	
})
// client.close()
