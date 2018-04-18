var jsonServer = require('json-server');
var server = jsonServer.create();
var router = jsonServer.router('api/db.json');
var middlewares = jsonServer.defaults();

// read file, parse users
const fs = require('fs')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)

// read in sync to ensure that it's read before staring...
const db = JSON.parse(fs.readFileSync('./api/db.json', 'UTF-8'));

const users = db.users.map(user => user)

server.use(middlewares);
server.use(jsonServer.bodyParser)
server.use('/api', router); // Rewrite routes to appear after /api
server.post('/login', (req, res, next) => {
  const { username, password } = req.body
  const authed = isAuthed(username, password)
  const token = "very fake"
  if (authed.length) {
    const userid = authed
    return res.status(200).json({username, userid, token: token}) 
  }

  res.sendStatus(401)
})
server.listen(4000, function() {
  console.log('JSON Server is running');
});

server.get('/api/users', (req, res) =>{
  res.sendStatus(204)
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


