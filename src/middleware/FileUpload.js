const { promisify } = require('util');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const mimeType = require('mime-types')

const uploadDir = path.resolve(process.env.UPLOAD_DIR);

let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
            console.log('created directory');
        }
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        console.log(file.originalname);
        return callback(null, moment(new Date()).format('YYYYMMDDHHmmss'));
    }
});

const limits = {
    fileSize: 52428800
};

// const fileFilter = function(req, file, cb) {
//     const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];

//     const mimetype = file.mimetype;

//     if (allowedMimes.includes(mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error('Invalid file type. Only jpg, png and gif image files are allowed.'));
//     }
// };

function _imgFilter (req, file, cb) {
    if (!file.originalname.match(/\.(png|jpeg|jpg|gif|PNG|JPEG|JPG|GIF)/)) {
        cb(new Error('Only images are allowed'), false) // setting the second param
    }
    cb(null, true)
}

const upload = multer({ storage: storage });
const uploadPicture = multer({ storage: storage, fileFilter: _imgFilter });

module.exports = {
    uploadSingle,
    uploadArray,
    uploadFields,
    uploadProfilePic
}
// let uploadFile = multer({
//     storage: storage,
//     imits: limits,
//     fileFilter: fileFilter,
// }).array('files[]');

function uploadSingle () {
    return upload.single('file')
}


function uploadArray () {
    return upload.array('files', 4) // first param is for key against which the multer is expecting files,
                                // other is maxCount allowed
}

function uploadFields () {
    return upload.fields({
        name: 'avatar',
        maxCount: 1
    }, {
        name: 'gallery',
        maxCount: 5
    });
}
  
function uploadProfilePic () {
    return uploadPicture.single('image')
}

// const uploadFilesMiddleware = util.promisify(uploadFile);
// module.exports = uploadFilesMiddleware;