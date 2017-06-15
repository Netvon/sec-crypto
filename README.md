# Sec1 Crypto
Tom van Nimwegen

### Gebruikt
- `Node 7.10.0` + `express`
	- Voor het server van de website en het afhandelen van requests.
- `crypto`
	- node package voor de encrypten/decrypten van tekst aan de hand van een wachtwoord.
	- Algoritme: `aes-256-ctr`
	- zie `scr/models.js` @ line 23~37
- `csurf`
	- CSRF Tokens
	- [https://www.npmjs.com/package/csurf](https://www.npmjs.com/package/csurf)
- `cors`
	- Allen requests toestaan vanaf de eigenhost
	- [https://www.npmjs.com/package/cors](https://www.npmjs.com/package/cors)
	- zie `src/routes.js` @ line 9
- `helmet`
	- voor extra security headers
	- [https://www.npmjs.com/package/helmet](https://www.npmjs.com/package/helmet)
	- zie `src/index.js` @ line 20~22
- `mongoose`
	- voor het opslaan van teksten
	- [https://www.npmjs.com/package/mongoose](https://www.npmjs.com/package/mongoose)
- `node-rate-limiter`
	- voor het limiten van het aantal requests binnen een bepaalde tijd
	- [https://www.npmjs.com/package/node-rate-limiter](https://www.npmjs.com/package/node-rate-limiter)
	- zie `src/limiter.js`