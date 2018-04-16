var jsonServer = require('json-server');
var server = jsonServer.create();
var router = jsonServer.router('api/db.json');
var middlewares = jsonServer.defaults();

/* const parseFile = async file => {
  try {
    const file = await JSON.parse(readFileAsync(file, { encoding: 'utf8' }));
    console.log(file);
  } catch (e) {
    console.log(e);
    return null;
  }
}; */

// read file, parse users
const fs = require('fs')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)

// read in sync to ensure that it's read before staring...
const db = JSON.parse(fs.readFileSync('./api/db.json', 'UTF-8'));

console.log(db.users.length);

const users = db.users.map(user => user)
console.log(users);

// const users = _.filter(db.users,  'id')


server.use(middlewares);
server.use(jsonServer.bodyParser)
server.use('/api', router); // Rewrite routes to appear after /api
server.post('/login', (req, res, next) => {
  console.log(req.body)
  const { username, password } = req.body
  const authed = isAuthed(username, password)

  if (authed.length) {
    const userid = authed
    return res.status(200).json({username, userid}) 
  }

  res.sendStatus(401)
})
server.listen(4000, function() {
  console.log('JSON Server is running');
});

server.get('/api/users', (req, res) =>{
  console.log('in api');
  res.sendStatus(204)
})
server.get('/login', (req, res) => {
  console.log('redirerct?');
  res.redirect(200, '/')
})
function isAuthed(username, password) {
  // if user exist filter him out. Then return the id, then join to string
  const authed = users.filter(user => {
    return user.username === username && user.password === password
  })
  .map(user => user.id)
  .join()

  return authed
}


