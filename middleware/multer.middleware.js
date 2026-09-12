const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },

  filename: (req, file, cb) => {
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.')
    )

    const name = file.originalname
      .toLowerCase()
      .split(' ')
      .join('-')
      .split('.')[0]

    cb(null, name + Date.now() + extension)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024
  }
})

module.exports = upload