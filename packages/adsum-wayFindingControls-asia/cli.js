#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

let cmdValue = '';
const program = require('commander');

program
    .usage('npx @adactive/arc-wayFindingControls-asia copy')
    .option('--no-install', 'npx option')
    .option('--less-only', 'just copy the style')
    .action((cmd) => {
        cmdValue = cmd;
    })
    .parse(process.argv);

if (cmdValue === 'copy') {
    if (program.lessOnly) {
        fs.copy(`${__dirname}/src/WayFindingControls.less`, path.resolve('src/components/adsum-wayFindingControls/WayFindingControls.less'))
            .then(() => console.log(chalk.green('Success!')))
            .catch(console.error);
    } else {
        fs.copy(`${__dirname}/index.js`, path.resolve('src/components/adsum-wayFindingControls/index.js'))
            .then(() => fs.copy(`${__dirname}/src`, path.resolve('src/components/adsum-wayFindingControls/src')))
            .then(() => console.log(chalk.green('Success!')))
            .catch(console.error);
    }
}
