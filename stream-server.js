const express = require('express');
const fs = require('fs');
const { Transform } = require('stream');
const app = express();
const port = process.env.PORT || 3000;
// todo: write code here

app.get('/truyen-kieu', (req, res) => {
    const regex = /[\w|ă|ắ|â|ấ|ẩ|ả|đ|ê|ể|ỉ|ô|ổ|ơ|ở|ủ|ý|ỷ]/iu;
    let counter = 0;
    let isSix = true;

    const fileName = './truyen-kieu.txt'
    let readStream = fs.createReadStream(fileName)


    const stringToArray = new Transform({
        readableObjectMode: true,

        transform: function (chunk, encoding, callback) {
            this.push(chunk.toString().trim().split(' '));
            callback();
        }
    })

    const transformTo68 = new Transform({
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
    res.set({ 'content-type': 'text/html; charset=utf-8' });
    readStream.pipe(stringToArray).pipe(transformTo68).pipe(arrayToString).pipe(res)
})

app.get('/big-file', (req, res) => {
    const src = fs.createReadStream('./data/bigfile.7z');
    src.pipe(res);
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))