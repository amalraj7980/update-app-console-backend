const express = require('express');
const app = express();
const fsPromise = require('fs/promises')
// var fs = require('fs');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());
app.use('/upload-form', express.static('./public/upload.html'))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../feddy-react-native-app/src/assets')
    },
    filename: function (req, file, cb) {
        console.log("file================>", file.fieldname);
        cb(null, file.originalname)
    }
})


const upload = multer({ storage: storage })

app.post('/upload/images', upload.array('uploaded_file', 12), async (req, res) => {
    const fileDestination = path.resolve('../feddy-react-native-app/src/Styles/BaseImages.js');
    console.log("called", fileDestination)
    console.log("req==============>", req.files[1])
    console.log("name==============>", req.body.name)
    console.log("multer =================>", multer.prototype)
    console.log("headers =============>", req.headers)
    const appLoginLogo = req.headers['x-apploginlogo'] && JSON.parse(req.headers['x-apploginlogo']);
    const appchatbackground = req.headers['x-appchatbackground'] && JSON.parse(req.headers['x-appchatbackground'])
    console.log("appChatBackground =================>", appchatbackground);
    console.log("appLoginLogo =====================>", appLoginLogo);
    let filenames = {}
    let length = req.body.name.length === req.files.length ? req.body.name.length : 0;
    console.log("length ==================>", length)
    let results = '{\n';
    for (let i = 0; i < length; i++) {
        console.log("file name form ===============>", req.files[i].originalname)
        // filenames[req.body.name[i]] = `require('../assets/${req.files[i].originalname}')`
        // filenames[req.body.name[i]] = "require('../assets/'" + req.files[i].originalname + "')"
        results = results + req.body.name[i] + ':' + "require('../assets/" + req.files[i].originalname + "')" + ',\n'
    }
    console.log("results============>", results)
    let addCaptch = {
        "appCaptchaIcon": "require('../assets/captcha.jpg')"
    }
    results = results + ''

    // let combine = { ...addCaptch, ...filenames };
    if (appLoginLogo && appchatbackground) {
        // combine = { ...addCaptch, ...filenames, ...appLoginLogo, ...appchatbackground }
        results = results + 'appCaptchaIcon : require(\'../assets/captcha.jpg\')' + ',\n' +
            'appChatBackground : require(\'../assets/bg.png\')' + ',\n' +
            'appLoginLogo : require(\'../assets/feddyman.png\')' + ',\n'
    }
    else if (appchatbackground) {
        // combine = { ...addCaptch, ...filenames, ...appchatbackground }
        results = results + 'appCaptchaIcon : require(\'../assets/captcha.jpg\')' + ',\n' +
            'appChatBackground : require(\'../assets/bg.png\')' + ',\n'
    } else {
        // combine = { ...addCaptch, ...filenames, ...appLoginLogo }
        results = results + 'appCaptchaIcon : require(\'../assets/captcha.jpg\')' + ',\n' +
            'appLoginLogo : require(\'../assets/feddyman.png\')' + ',\n'
    }
    // console.log("filenames ==================>", combine)
    results = results + '}'

    res.json("Success")
    let addString = `export default `;
    fsPromise.writeFile(fileDestination, addString + results);
})

app.post('/change/fontcolour', async (req, res) => {
    console.log("req.file===============>", req.body)
    try {
        const fileDestination = path.resolve('../feddy-react-native-app/src/Styles/Colors.js');
        let addString = `export default`
        await fsPromise.writeFile(fileDestination, addString + JSON.stringify(req.body));
        res.json({
            message: 'Theme updated'
        });
    } catch (error) {
        console.log("something happen==============>", error)
    }
})
const port = 8000

app.listen(port, () => {
    console.log("server running port 8000")
})
