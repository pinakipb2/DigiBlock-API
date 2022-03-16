<h1 align="center">
  <br>
  <img src="./src/assets/images/digiBlock.png" alt="DigiBlock API" width="500">
  <br>
  DigiBlock API
  <br>
</h1>

<h4 align="center">REST API which Powers DigiBlock</h4>
<p align="center">
  <a href="#file-structure">File Structure</a> •
  <a href="#environment-configurations">Environment Configurations</a>
</p>

## File Structure

```
digiblock_api\
│
├── src\
│   ├── api_v1\
│   │   ├── config\
│   │   │   ├── env.config.js
│   │   │   └── init_mongodb.config.js
│   │   │
│   │   ├── controllers\
│   │   │   ├── admin.controller.js
│   │   │   ├── index.js
│   │   │   └── issuer.controller.js
│   │   │
│   │   ├── dtos\
│   │   │   ├── index.js
│   │   │   ├── IssuerDto.dto.js
│   │   │   └── StatusData.dto.js
│   │   │
│   │   ├── log\
│   │   │   └── logger.js
│   │   │
│   │   ├── middlewares\
│   │   │   └── index.js
│   │   │
│   │   ├── models\
│   │   │   ├── admin.model.js
│   │   │   ├── index.js
│   │   │   └── issuer.model.js
│   │   │
│   │   ├── routes\
│   │   │   ├── Admin.route.js
│   │   │   ├── index.js
│   │   │   └── Issuer.route.js
│   │   │
│   │   ├── services\
│   │   │   ├── generateMasterKey.service.js
│   │   │   ├── hash.service.js
│   │   │   ├── index.js
│   │   │   └── mail.service.js
│   │   │
│   │   └── validations\
│   │       ├── addressSchema.validation.js
│   │       ├── index.js
│   │       ├── issuerSchema.validation.js
│   │       ├── masterKeySchema.validation.js
│   │       └── userSendEmailSchema.validation.js
│   │
│   │
│   ├── assets\
│   │   ├── images\
│   │   │   └── digiBlock.png
│   │   │
│   │   └── static\
│   │       └── masterKey.html
│   │
│   │
│   ├── keys\
│   │   └── generateKeys.js
│   │
│   └── app.js
│
├── .env.development
├── .eslintrc.json
├── .gitignore
├── LICENSE
├── package-lock.json
├── package.json
└── README.md
```

## Environment Configurations

```
PORT=<PORT>
MONGODB_URI=<MONGODB_URI>
DB_NAME=<DB_NAME>
FRONTEND_URL=<FRONTEND_URL>
GMAIL=<GMAIL>
SENDGRID_API=<SENDGRID_API>
ADMIN_MASTER_KEY_SECRET=<ADMIN_MASTER_KEY_SECRET>
ISSUER_MASTER_KEY_SECRET=<ISSUER_MASTER_KEY_SECRET>
UNSAFE_HASH_SECRET=<UNSAFE_HASH_SECRET>
```
