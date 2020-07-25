#!/usr/bin/env node
import * as commander from "commander";
import * as process from "process";
import {translate} from "./main";

const program=new commander.Command()
program.version('0.0.1')
    .name('trans')
    .usage('<english>')
    .arguments('<english>')
    .action(function (english) {
        translate(english)
    })

program.parse(process.argv)