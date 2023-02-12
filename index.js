import server from './vendor/server.js'

const app = server()

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('\x1b[34m%s\x1b[0m', `server is listening at port ${port}`)
})