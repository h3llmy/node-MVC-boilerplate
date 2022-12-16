import multer from 'multer'

// storage
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/image')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '.' + file.originalname.split(".").slice(-1)[0]);
  }
});

const audioStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/audio')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '.' + file.originalname.split(".").slice(-1)[0]);
    }
});

const applicationStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/application')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '.' + file.originalname.split(".").slice(-1)[0]);
    }
});

const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/video')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '.' + file.originalname.split(".").slice(-1)[0]);
    }
});

const textStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/text')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '.' + file.originalname.split(".").slice(-1)[0]);
    }
});

// upload functions

export const uploadImage = multer({
    fileFilter: (req, file, cb) => {
      if (file.mimetype.split("/")[0] == "image") {
        cb(null, true);
    } else {
        cb(null, false);
      }
    },
    storage: imageStorage
  });

export const uploadAudio = multer({
    fileFilter: (req, file, cb) => {
      if (file.mimetype.split("/")[0] == "audio") {
        cb(null, true);
    } else {
        cb(null, false);
      }
    },
    storage: audioStorage
  });

export const uploadApplication = multer({
    fileFilter: (req, file, cb) => {
      if (file.mimetype.split("/")[0] == "audio") {
        cb(null, true);
    } else {
        cb(null, false);
      }
    },
    storage: applicationStorage
  });
  
export const uploadVideo = multer({
    fileFilter: (req, file, cb) => {
      if (file.mimetype.split("/")[0] == "video") {
        cb(null, true);
    } else {
        cb(null, false);
      }
    },
    storage: videoStorage
  });
  
export const uploadText = multer({
    fileFilter: (req, file, cb) => {
      if (file.mimetype.split("/")[0] == "text") {
        cb(null, true);
    } else {
        cb(null, false);
      }
    },
    storage: textStorage
  });
  