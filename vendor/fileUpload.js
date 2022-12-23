import dotenv from 'dotenv'
dotenv.config()

export const uploadFile = (file, filters) => {
  try {
    if (!file) {
      throw 'file not uploaded'
    }
    if (filters) {      
      if (filters.gte) {
        if (file.size <= filters.gte) {
          throw 'file size not allowed'
        }
      }
      if (filters.gt) {
        if (file.size < filters.gt) {
          throw 'file size not allowed'
        }
      }
      if (filters.lte) {
        if (file.size >= filters.lte) {
          throw 'file size not allowed'
        }
      }
      if (filters.lt) {
        if (file.size > filters.lt) {
          throw 'file size not allowed'
        }
      }
      if (filters.eq) {
        if (file.size == filters.eq) {
          throw 'file size not allowed'
        }
      }
      if (filters.ne) {
        if (file.size != filters.ne) {
          throw 'file size not allowed'
        }
      }
    }
    if (filters.mimeType) {   
      if (!file.mimetype.split("/")[0].includes(filters.mimeType)) {
        throw 'mime type not allowd'
      }
    }
    if (filters.fileType) {
      if (!filters.fileType.includes('.' + file.name.split('.').pop())) {
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
