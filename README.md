<p align="center">
<h1 align="center">
  tor-detect-middleware
</h1>

<p align="center">
  Tor detect middleware for Express
</p>

<p align="center">
  <a href="https://www.npmjs.org/package/tor-detect-middleware"><img src="https://badgen.net/npm/v/tor-detect-middleware" alt="npm version"/></a>
  <a href="https://www.npmjs.org/package/tor-detect-middleware"><img src="https://badgen.net/npm/license/tor-detect-middleware" alt="license"/></a>
  <a href="https://www.npmjs.org/package/tor-detect-middleware"><img src="https://badgen.net/npm/dt/tor-detect-middleware" alt="downloads"/></a>
  <a href="https://snyk.io/test/github/ulisesgascon/tor-detect-middleware"><img src="https://snyk.io/test/github/ulisesgascon/tor-detect-middleware/badge.svg" alt="Known Vulnerabilities"/></a>
</p>

</p>

# About

Tor detect middleware for Express.

❤️ Awesome Features:

- Easy to redirect Tor or Surface users. 🔥
- Easy to recognize TorUsers at inside the `req` object, `req.isTorUser` 🍺
- No infra required, the database is json based using `lowdb` 🎉
- The `strictMode` won't allow any request to access until the relays IPs are collected 📦
- The `purge` allow you to dump the database at startup ☣️
- `debug` is supported 💪
- Refresh time is customizable 🧐
- Easy to use and great test coverage ✅

```js
const express = require('express');
const torUserHandler = require('tor-detect-middleware')
const app = express();

app.use(torUserHandler())

app.get('/', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  res.send(`Are you (${ip}) a TOR user? ${req.isTorUser}`);
});

app.listen(3000, () => {
  console.log('We are in port 3000!');
});
```

## Usage

### Install

```bash
npm install tor-detect-middleware
```

### simple example

```js
const express = require('express');
const torUserHandler = require('tor-detect-middleware')
const app = express();

app.use(torUserHandler())

app.get('/', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  res.send(`Are you (${ip}) a TOR user? ${req.isTorUser}`);
});

app.listen(3000, () => {
  console.log('We are in port 3000!');
});
```

### Redirect Users

In this example we redirect the surface users to `https://www.nytimes.com` and Tor users to `https://www.nytimes3xbfgragh.onion/`. You can use both ways to redirect.

```js
const express = require('express');
const torUserHandler = require('tor-detect-middleware')
const app = express();

app.use(torUserHandler({
    surface: "https://www.nytimes.com",
    tor: "https://www.nytimes3xbfgragh.onion/"
}))

app.listen(3000, () => {
  console.log('We are in port 3000!');
});
```

### Ban users from surface or TOR

```js
const express = require('express');
const torUserHandler = require('tor-detect-middleware')
const app = express();

app.use(torUserHandler())

app.get('/surface-only', (req, res) => {
  if(req.isTorUser) return res.status(401).send("You can't access from TOR here")
  res.send('Welcome surface user!');
});

app.get('/tor-only', (req, res) => {
  if(!req.isTorUser) return res.status(401).send("You can't access from the surface here")
  res.send('Welcome to the dark side. We have cookies!');
});

app.listen(3000, () => {
  console.log('We are in port 3000!');
});
```

### Custom Cron Jobs

By default we refresh the IP list every hour, but you can modify the ms as you wish.

```js
const express = require('express');
const torUserHandler = require('tor-detect-middleware')
const app = express();

app.use(torUserHandler({refreshMs: 600000}))

//...
```

### Strict Mode

Special behaviour in Strict mode:

- The server will stop at startup if `https://onionoo.torproject.org/details` url is down
- The server will wait until there is a list ready to dispatch requests. (Few seconds)

_Note: if there is a list stored you wont surfer any problem, as we start the service from the previous list._

```js
const express = require('express');
const torUserHandler = require('tor-detect-middleware')
const app = express();

app.use(torUserHandler({
    strictMode: true
}))

//...
```

### Purge list at start

You can purge the list by default at the startup of the service.

```js
const express = require('express');
const torUserHandler = require('tor-detect-middleware')
const app = express();

app.use(torUserHandler({
    purge: true
}))

//...
```

## Built With

Development only:

- [Standard](https://www.npmjs.com/package/standard) - Linting propuses
- [Husky](https://www.npmjs.com/package/husky) - Git Hooks
- [Nodemon](https://www.npmjs.com/package/nodemon) - Reload the process

Production only:

- [debug](https://www.npmjs.com/package/debug) - Debug the app
- [got](https://www.npmjs.com/package/got) - Download TOR infra data
- [ip-regex](https://www.npmjs.com/package/ip-regex) - Validate relays IPs
- [lowdb](https://www.npmjs.com/package/lowdb) - Store and query IPs

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/ulisesGascon/tor-detect-middelware/tags).

## Authors

- **Ulises Gascón** - *Initial work- - [@ulisesGascon](https://github.com/ulisesGascon)

See also the list of [contributors](https://github.com/ulisesGascon/tor-detect-middelware/contributors) who participated in this project.

## License

This project is licensed under the GNU AGPL3.0 License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- This project is under development, but you can help us to improve it! We :heart: FOSS!
