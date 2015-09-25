#!/usr/bin/env node

var fs = require('fs');
var _ = require('lodash');
var execSync = require('child_process').execSync;

// Go to the docx directory
docx = fs.readdirSync(__dirname + '/docx');

// For each file in the docx directory
_.forEach(docx,function(d) {
	outfile = d.replace(".docx", ".html");
	// shell out to pandoc
	execSync("pandoc " + __dirname + "/docx/" + d + " -o " + __dirname + "/html/" + outfile);
});
