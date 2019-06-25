const fs = require('fs')
const { Transform } = require('stream')

const fileName = './truyen-kieu.txt'
let readStream = fs.createReadStream(fileName)

const regex = /[\w|ă|ắ|â|ấ|ẩ|ả|đ|ê|ể|ỉ|ô|ổ|ơ|ở|ủ|ý|ỷ]/iu;
let counter = 0;
let isSix = true;
const stringToArray = new Transform({
    readableObjectMode: true,

    transform: function (chunk, encoding, callback) {
        this.push(chunk.toString().trim().split(' '));
        callback();
    }
})

const separateToSixEight = new Transform({
    writableObjectMode: true,
    readableObjectMode: true,

    transform: function (chunk, encoding, callback) {
        this.push(chunk.map(x => {
            if (!!x.match(regex)) {
                counter++;
            }
            if (counter == 6 && isSix) {
                counter = 0;
                isSix = false;
                return `${x}\n`
            }
            if (counter == 8 && !isSix) {
                counter = 0;
                isSix = true;
                return `${x}\n`
            }
            return x
        }))
        callback()
    }
})

const arrayToString = new Transform({
    writableObjectMode: true,

    transform(chunk, encoding, callback) {
        this.push(chunk.join(" ").replace(/\n /gu, '\n'))
    }
});

readStream.pipe(stringToArray).pipe(separateToSixEight).pipe(arrayToString).pipe(process.stdout)