#!/usr/bin/env node
/* eslint no-console:"off" */
"use strict";

var path = require("path"),

    meow  = require("meow"),
    shell = require("shelljs"),
    parse = require("string-to-regexp"),

    pkg = require("./package.json"),

    cli = meow(`
        Usage
          $ ${pkg.name} <options> <find-regex> <replace-pattern>

        Options
          --dry,     -d    Don't rename files
          --recurse, -r    Recursively search for files

        Examples
          ${pkg.name} --dry ".*\.js" "js-$file"
          ${pkg.name} "wp_(\d{4})(\d{2})(\d{2}).*" "$1-$2-$3/$file"
    `, {
        boolean : [ "dry", "recurse", "d", "r" ],
        string  : [ "_" ],
        alias   : {
            d : "dry",
            h : "help",
            r : "recurse"
        }
    }),
    
    search  = parse(cli.input[0]),
    replace = cli.input[1],
    filer   = /\$file/g,
    
    files;

if(!cli.input.length || cli.input.length < 2 || !search || !replace) {
    cli.showHelp();

    return;
}

if(cli.flags.dry) {
    console.log("DRY RUN - no files will be moved");
}

files = (cli.flags.recurse ? shell.find(".") : shell.ls("-A", "."))
    .filter((f) => (f.search(search) > -1));

if(!files.length) {
    return console.log("No files matched!");
}

files.forEach((f) => {
    var dest = f.replace(search, replace.replace(filer, f));
    
    console.log(`Moving ${f} to ${dest}`);
    
    if(cli.flags.dry) {
        return;
    }
    
    shell.mkdir("-p", path.dirname(dest));
    
    shell.mv(f, dest);
});
