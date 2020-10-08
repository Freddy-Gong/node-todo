const db = require('../db.js')
const fs = require('fs')
jest.mock('fs')

describe('db', () => {
    afterEach(() => {
        fs.clearMocks()
    })
    it('can read', async () => {
        fs.setMock('/xxx', null, '[{"title":"hi","done":true}]')
        const list = await db.read('/xxx')
        expect(list).toStrictEqual([{ "title": "hi", "done": true }])
    })
    it('can write', async () => {
        let fakeFile
        fs.setWriteMock('/yyy', (path, data, callback) => {
            fakeFile = data
            callback(null)
        })
        const list = [{ title: 'xxx', done: true }]
        await db.write(list, '/yyy')
        expect(fakeFile).toBe(JSON.stringify(list) + '\n')
    })
})