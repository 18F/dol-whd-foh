#!/usr/bin/env node

var swig = require('swig');
var fs = require('fs');
var _ = require('lodash');
var cheerio = require('cheerio');
var Citation = require('citation');

html = fs.readdirSync(__dirname + '/html');
var titles = [];

function cleanTitle(title) {
  return title
    .trim()
    .replace(/\s+/, '-')
    .replace(/[^\w-]/g, '')
    .toLowerCase();
}

// Main function
_.forEach(html, function (h) {
    var content = fs.readFileSync(__dirname + '/html/' + h, encoding="utf-8");
    var title = getTitle(content);
    content = convertChapter(content);
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
    });
    titles.push({src: h, heading: title, content: c.text});
    res = swig.renderFile(__dirname + '/template/chapter.html', {
        content: c.text,
        title: title
    });
    fs.writeFileSync(__dirname + '/../_site/chapters/' + h, res);
});

// Helper function
function getTitle (html) {
    $ = cheerio.load(html);
    return $('h1').html();
}

function convertSubchapter(idx, elm) {
    var $elm = $(elm);
    var text = $elm.text();
    var subchapterId = cleanTitle(text);
    $elm.replaceWith('<h4 class="testClass"><a style="top: -60px; display: block; position: relative;" name="' + subchapterId + '"></a>' + text + '</h4>');
}
function convertChapter(html) {
    var $elm, text, subchapterId;
    $ = cheerio.load(html);
    $('h2[id^="chapter-"]').nextAll('h4').each(convertSubchapter);
    $('p > strong').each(convertSubchapter);
    $('h4 > strong').each(convertSubchapter);
    return $.html();
}

// Generate the TOC
toc = swig.renderFile(__dirname + '/template/toc.html', {
    chapters: titles,
});
fs.writeFileSync(__dirname + '/../_site/index.html', toc);


// Load to elasticsearch
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  // log: 'trace'
});

var records = [];

_.forEach(titles, function (t) {
    var $ = cheerio.load(t.content);
    var chapter = t.src.replace('.html', '');
    var subchapter = $('h4');
    subchapter.each(function (i, el){
        records.push({index: {_index: 'foh', _type: 'subchapter'}});
        records.push({
            chapter: chapter,
            subchapter: $(this).text(),
            subchapterId: cleanTitle($(this).text()),
            heading: t.heading,
            body: $(this).nextUntil('h4').text()
        });
    });
});

client.indices.delete({index: 'foh'}, function() {
  client.bulk({body: records}, function() {
    client.close();
  });
});
