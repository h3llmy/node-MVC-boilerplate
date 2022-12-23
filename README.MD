## **`COSTOM COMMAND`**

## **CREATE MODEL**

```
npm run create:model (model file name)
```

to create basic model based on model file name

## **CREATE CONTROLLER**

```
npm run create:controller (controller file name)
```

to create basic CRUD controller based on controller file name

## **CREATE ROUTE**

```
npm run create:route (rute file name)
```

to create basic CRUD route based on route file name

## **`COSTOM FUNCTIONS`**

## **FILE UPLOAD**

```
uploadFile(req.files.(field name), {
  mimeType : mime type,
  filter : file size,
  fileType : file type
  })
```

this function will upload your file to "public/(depends on your file mime type)". this function will return object

_input explanation_

- field mime type is general mimetype `optional`

  - application
  - audio
  - image
  - text
  - video

- filter file size in bytes `optional`

  - gte = greater than equal
  - lte = littleer than equal
  - lt = littleer than
  - gt = greater than
  - eq = equal than

- file type is spesific file type like `optional`

* .mp3
* .mp4
* .wav
* .png
* .jpg
  etc

_output explanation_

- filePath = file location base on env BASE_URL
- fileName = file name stored in public path
- encoding = file encoding
- mimeType = file mime type
- size = file size

## **INPUT CHECK**

```
emailCheck(value to check)
```

this function to check value is email (return Boolean)

```
phoneCheck(value to check)
```

this function to check value is phone number that

- must 11 - 14 char
- must start with 0 / +62
- must number

this function will return Boolean (true/false)

## **JWTTOKEN**

```
generateToken(payload value, duration)
```

this function will generate jwt token base on env ACCESS_TOKEN_SECRET and duration

```
refreshToken(payload value, duration)
```

this function will generate jwt token base on env REFRESH_TOKEN_SECRET and duration

```
decodeToken(jwt token to decode)
```

this function will decode jwt token base on env ACCESS_TOKEN_SECRET

## **NODE MAILLER**

```
nodeMailler({
    from: 'email from',
    to: email for,
    subject: 'add subject',
    html: 'the email message'
})
```

this function will send email base on env

## **UNIQUE ARRAY**

```
uniqueArray(array there has duplicate value)
```

this function will return non duplicate array

## **PAGINATION**

```
mongooseModel.find({you can add fillter here}, {}, paginations(req.query))
```

this function will give pagination base on req.query.page for select current page and req.query.limit for limiting return data.
if there has no req.query this will defalut returning current page = 1 and limit = 10 object

## **PAYMENT GATEWAY WITH MIDTRANS**

```
generatePayment(payload)
```

this function will generate payment with midtrans account base on env.
the payload value can read in midtrans documentation here https://api-docs.midtrans.com/

```
updatePayment({transaction_id})
```

this function will returning payment status by useing web hooks http request post from midtrans.
you can convigure web hooks here https://dashboard.midtrans.com/settings/vtweb_configuration at "Payment Notification URL".

## **RESPONSE**

```
res.status(200).json(successResponse(sending value))
```

this for returning success response when the return is success

```
res.status(some status code).json(errorResponse(error))
```

this for returning error response when the return is error

## **`CORS ORIGIN`**

in env there has "CORS_ORIGIN" this value must be string for allowing what origin can access your api. you can add multiple origin without adding it to array just add it like (`"https://youtube.com, https://google.com"`).
this cors origin useing white list system
