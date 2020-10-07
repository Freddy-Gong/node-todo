const db = require('./db.js')
const inquirer = require('inquirer');

module.exports.add = async (title) => {
    //读取之前的任务
    const list = await db.read()
    //添加一个title任务
    list.push({ title, done: false })
    //存储任务到文件
    await db.write(list)
}

module.exports.clear = async () => {
    await db.write([])
}

module.exports.showAll = async () => {
    const list = await db.read()
    inquirer
        .prompt(
            {
                type: 'list',
                name: 'index',
                message: '请选择你想操作的任务',
                choices: [{ name: '退出', value: '-1' }, ...list.map((task, index) => {
                    return { name: `${task.done ? "[x]" : "[_]"} ${index + 1}-${task.title}`, value: index.toString() }
                }), { name: '+新增任务', value: '-2' }]
            },
        )
        .then((answer) => {
            const index = parseInt(answer.index)
            if (index >= 0) {
                inquirer.prompt({
                    type: 'list', name: 'action',
                    message: '请选择操作',
                    choices: [
                        { name: '退出', value: 'quit' },
                        { name: '已完成', value: 'markAsDone' },
                        { name: '未完成', value: 'markAsUndone' },
                        { name: '改标题', value: 'update' },
                        { name: '删除', value: 'remove' }
                    ]
                }).then((answer2) => {
                    switch (answer2.action) {
                        case 'markAsDone':
                            list[index].done = true
                            db.write(list)
                            break;
                        case 'markAsUndone':
                            list[index].done = false
                            db.write(list)
                            break;
                        case 'update':
                            inquirer.prompt({
                                type: 'input',
                                name: 'title',
                                message: '新的标题',
                                default: list[index].title
                            }).then((answer3) => {
                                list[index].title = answer3.title;
                                db.write(list)
                            });
                            break;
                        case 'remove':
                            list.splice(index, 1)
                            db.write(list)
                            break;

                    }
                })
            } else if (index === -2) {
                inquirer.prompt({
                    type: 'input',
                    name: 'title',
                    message: '输入标题',
                }).then((answer4) => {
                    list.push({ title: answer4.title, done: false })
                    db.write(list)
                });
            };
        });
}