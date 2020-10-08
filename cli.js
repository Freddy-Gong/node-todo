#!/usr/bin/env node

const { program } = require('commander');
const api = require('./index.js')

program
    .option('-x, --xxx', 'what is x')


if (process.argv.length === 2) {
    //说明用户直接运行 node cli.js
    void api.showAll()
} else {
    program
        .command('add <taskName>')
        .description('add a task into dir')
        .action((...args) => {
            const world = args[1].args.join(' ')
            api.add(world).then(() => { console.log('添加成功') }, () => { console.log('添加失败') })
        });

    program
        .command('clear')
        .description('clean all tasks')
        .action(() => {
            api.clear().then(() => { console.log('清除成功') }, () => { console.log('清除失败') })
        })

    program.parse(process.argv);

}



