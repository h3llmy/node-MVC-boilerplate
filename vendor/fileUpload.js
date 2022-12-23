import dotenv from 'dotenv'
dotenv.config()

export const uploadFile = (file, mimetypes, filesize, filetype) => {
  try {
    if (!file) {
      throw 'file not uploaded'
    }
    if (filesize) {      
      if (filesize.gte) {
        if (file.size >= filesize.gte) {
          throw 'file size not allowed'
        }
      }
      if (filesize.gt) {
        if (file.size > filesize.gt) {
          throw 'file size not allowed'
        }
      }
      if (filesize.lte) {
        if (file.size <= filesize.lte) {
          throw 'file size not allowed'
        }
      }
      if (filesize.lt) {
        if (file.size < filesize.lt) {
          throw 'file size not allowed'
        }
      }
      if (filesize.eq) {
        if (file.size == filesize.eq) {
          throw 'file size not allowed'
        }
      }
    }
    if (mimetypes) {      
      if (!file.mimetype.split("/")[0].includes(mimetypes)) {
        throw 'mime type not allowd'
      }
    }
    if (filetype) {
      if (!file.name.includes('.' + filetype.split('.').pop())) {
        throw 'file type not allowed'
      }
    }
    const mime = file.mimetype.split("/")[0]
    const fileName = + Date.now() + '-' + file.name
    const filePath = process.env.BASE_URL + `${mime}/` + fileName
    file.mv(`public/${mime}/` + fileName)

    return {
      filePath : filePath,
      fileName : file.name,
      encoding : file.encoding,
      mimeType : file.mimetype,
      size : file.size
    }
  } catch (error) {
    throw error
  }
}
