#!/usr/bin/env node
/* eslint no-console:"off" */
"use strict";

var path = require("path"),
    
    date  = require("dateformat"),
    exif  = require("jpeg-exif"),
    meow  = require("meow"),
    parse = require("string-to-regexp"),
    shell = require("shelljs"),

    cli = meow(`
        Usage
        $ rmv <options> find replace

        Options
        --dry,     -d    Don't rename files
        --exif,    -e    Attempt to parse EXIF data from matching files
        --recurse, -r    Recursively search for files
    `, {
        boolean : [ "dry", "exif", "recurse", "d", "e", "r" ],
        string  : [ "_" ],
        alias   : {
            d : "dry",
            e : "exif",
            h : "help",
            r : "recurse"
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
    console.log("DRY RUN - no files will be moved");
}

files = (cli.flags.recurse ? shell.find(".") : shell.ls("-A", "."))
    .filter((f) => (f.search(search) > -1));

if(!files.length) {
    return console.log("No files matched!");
}

files.forEach((f) => {
    var dest, time;
    
    if(cli.flags.exif) {
        try {
            time = exif.parseSync(f).DateTime.split(" ");
            time = time.map((t) => t.split(":"));
            time = new Date(time[0][0], parseInt(time[0][1]) - 1, time[0][2]);
        } catch(e) {
            console.log(`Invalid EXIF data in ${f}`);

            time = false;
        }
    }
    
    dest = replace.replace(filer, f).replace(dater, (match, fmt) => date(time, fmt));
    dest = f.replace(search, dest);
    
    console.log(`Moving ${f} to ${dest}`);
     
    if(!cli.flags.dry) {
        shell.mkdir("-p", path.dirname(dest));
        
        shell.mv(f, dest);
    }
});
