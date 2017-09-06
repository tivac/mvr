#!/usr/bin/env node
/* eslint no-console:"off" */
"use strict";

var fs   = require("fs"),
    path = require("path"),
    
    date  = require("dateformat"),
    exif  = require("jpeg-exif"),
    meow  = require("meow"),
    parse = require("string-to-regexp"),
    shell = require("shelljs"),

    cli = meow(`
        Usage
        $ mvr <options> find replace
        
        Examples
        $ mvr "(\d\d\d)\.jpg" "file$1.jpg"
        $ mvr -e ".*" "{{datetime yyyy-mm-dd}}/$file"
        $ mvr --attr=c ".*" "{{datetime yyyy-mm-dd}}/$file"

        Options
        --dry,     -d    Don't rename files
        --exif,    -e    Attempt to parse EXIF data for use with {{datetime <format>}}
        --attr,    -a    Select an attribute for use with {{datetime <format>}}: (c)reated, (m)odified, or (a)ccessed
        --recurse, -r    Recursively search for files
    `, {
        boolean : [ "dry", "exif", "recurse" ],
        string  : [ "_" ],
        alias   : {
            d : "dry",
            e : "exif",
            h : "help",
            r : "recurse",
            a : "attr"
        }
    }),
    
    search  = parse(cli.input[0]),
    replace = cli.input[1],
    filer   = /\$file/g,
    dater   = /\{\{datetime (.+?)\}\}/,
    
    files;

if(!cli.input.length || cli.input.length < 2 || !search || !replace) {
    cli.showHelp();

    return;
}

if(cli.flags.dry) {
    console.warn("DRY RUN - no files will be moved");
}

files = (cli.flags.recurse ? shell.find(".") : shell.ls("-A", "."))
    .filter((f) => (f.search(search) > -1));

if(!files.length) {
    return console.error("No files matched!");
}

if(cli.flags.attr && [ "a", "c", "m" ].indexOf(cli.flags.attr.toLowerCase()) === -1) {
    return console.error("Unknown argument for --attr");
}

files.forEach((f) => {
    var dest, time, stat;
    
    if(cli.flags.exif) {
        try {
            time = exif.parseSync(f).DateTime.split(" ");
            time = time.map((t) => t.split(":"));
            time = new Date(time[0][0], parseInt(time[0][1]) - 1, time[0][2]);
        } catch(e) {
            console.log(`Invalid EXIF data in ${f}`);

            return;
        }
    }

    if(cli.flags.attr) {
        stat = fs.lstatSync(f);

        time = stat[`${cli.flags.attr.toLowerCase()}time`];
    }
    
    dest = replace.replace(filer, f).replace(dater, (match, fmt) => date(time, fmt));
    dest = f.replace(search, dest);
    
    console.log(`Moving ${f} to ${dest}`);
     
    if(!cli.flags.dry) {
        shell.mkdir("-p", path.dirname(dest));
        
        shell.mv(f, dest);
    }
});