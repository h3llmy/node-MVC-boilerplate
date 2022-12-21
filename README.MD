FILE UPLOAD WITH MULTER

"npm run add:imageUpload (controller file name)"
to create image upload controller if file not exsit or add image upload function when file is exsit based on controller file name.
don't forget to add the middleware

CREATE MODEL

"npm run create:model (model file name)"
to create basic CRUD model based on model file name

CREATE CONTROLLER

"npm run create:controller (controller file name)"
to create basic CRUD controller based on controller file name

CREATE ROUTE

"npm run create:route (rute file name)"
to create basic CRUD route based on route file name

INPUT CHECK

"emailCheck(value to check)"
this function to check value is email (return Boolean)

"phoneCheck(value to check)"
this function to check value is phone number that

- must 11 - 14 char
- can start with 0 / +62
- must number

(return Boolean)

JWTTOKEN

"generateToken(payload value, duration)"
this function will generate jwt token base on env ACCESS_TOKEN_SECRET and duration

"refreshToken(payload value, duration)"
this function will generate jwt token base on env REFRESH_TOKEN_SECRET and duration

"decodeToken(jwt token to decode)"
this function will decode jwt token base on env ACCESS_TOKEN_SECRET

NODE MAILLER

nodeMailler({
from: 'email from',
to: email for,
subject: 'add subject',
html: 'the email message'
})
this function will send email base on env

PAGINATION

"mongooseModel.find({you can add fillter here}, {}, paginations(req.query))"
this function will give pagination base on req.query.page for select current page and req.query.limit for limiting return data.
if there has no req.query this will defalut returning current page = 1 and limit = 10 object

PAYMENT GATEWAY WITH MIDTRANS

"generatePayment(payload)"
this function will generate payment with midtrans account base on env.
the payload you can read midtrans documentation here https://api-docs.midtrans.com/

"updatePayment({transaction_id})"
this function will returning payment status by useing web hooks http req request post from midtrans.
you can convigure web hooks here https://dashboard.midtrans.com/settings/vtweb_configuration at "Payment Notification URL".

RESPONSE

"res.status(200).json(successResponse(sending value))"
this for returning success response when the return is success

"res.status(some status code).json(errorResponse(error))"
this for returning error response when the return is error

CORS ORIGIN

in env there has "CORS_ORIGIN" this value must be array of string for allowing what domain can access your api.
this cors origin useing white list system
