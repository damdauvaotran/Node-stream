const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;
// todo: write code here

app.get('/truyen-kieu', (req, res) => {
    const filePath = './truyen-kieu.txt';
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) throw err;
        let result = data.replace(/\d+ /g, "").split(/\s+/g);
        let counter = 0;
        let isSix = true;
        const regex = /[\w|ă|ắ||â|ấ|ẩ|ả|đ|ê|ể|ỉ|ô|ổ|ơ|ở|ủ|ý|ỷ]/iu;
        for (let i = 0; i < result.length; i++) {
            if (!!result[i].match(regex)) {
                counter++;
                // console.log(result[i])
            }
            if (counter == 6 && isSix) {
                counter = 0;
                isSix = false;
                result.splice(i-1, 0, "\n");
                continue;
            }


            if (counter == 8 && !isSix) {
                counter = 0;
                isSix = true;
                result.splice(i-1, 0, "\n");
            }
        }
        result = result.join(" ").replace(/\n\s/g, "\n");
        res.send(result);
        console.log(result);
    });
})

app.get('/big-file', (req, res) => {
    fs.readFile('./data/banlinh.mp4', (err, data) => {
        if (err) throw err;
        res.send(data);
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))