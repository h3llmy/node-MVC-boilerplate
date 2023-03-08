import dotenv from 'dotenv'
import cors from 'cors'
import CustomError from '../vendor/customError.js'

dotenv.config()

let appOrigin = process.env.CORS_ORIGIN
if (appOrigin) {
    appOrigin = appOrigin.replace(' ', '').split(',')
}
if (!appOrigin || appOrigin == '' || appOrigin.length <= 0) {
    console.log('\x1b[34m%s\x1b[0m', 'all origin is allowed');
} else {
    console.log('\x1b[34m%s\x1b[0m', 'allowed origin : ', appOrigin);
}

export default cors({
    origin: function (origin, callback) {
        if (appOrigin.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new CustomError('The CORS policy for this site does not allow access from this Origin.Not allowed by CORS', 403))
        }
    }
});
