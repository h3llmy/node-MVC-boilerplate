import dotenv from 'dotenv'
import cors from 'cors'

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
    origin: (origin, callback) => {
        if (!appOrigin || appOrigin == "[]") return callback(null, true);
        if (appOrigin.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from this Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
});
