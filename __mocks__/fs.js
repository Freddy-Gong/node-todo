const fs = jest.genMockFromModule('fs')
const _fs = jest.requireActual('fs')

Object.assign(fs, _fs)

let mocks = {

}

fs.setMock = (path, error, data) => {
    mocks[path] = [error, data]
}
fs.readFile = (path, options, callback) => {
    if (callback === undefined) {
        callback = options
    }
    if (path in mocks) {
        callback(...mocks[path])
    } else {
        _fs.readFile(path, options, callback)
    }
}

let writeMocks = {}

fs.setWriteMock = (path, fn) => {
    writeMocks[path] = fn
}
fs.writeFile = (file, data, options, callback) => {
    if (callback === undefined) {
        callback = options
    }
    if (file in writeMocks) {
        writeMocks[file](file, data, options, callback)
    } else {
        _fs.writeFile(file, data, options, callback)
    }
}

fs.clearMocks = () => {
    mocks = {}
    writeMocks = {}
}

module.exports = fs 