export const UploadFileSystem = (file) => {
  try {
    if (!file) {
      throw 'file not uploaded'
    }
    const mime = file.mimetype.split("/")[0]
    file.mv(`public/${mime}/` + file.name)
    return 'file uploaded'
  } catch (error) {
    throw error
  }
}
