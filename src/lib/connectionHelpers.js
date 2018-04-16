import axios from 'axios'

// put in env
const ROOT_PATH = 'http://localhost:4000'


export const getUser = async ({username, password}) => {
  const user = await axios.post(`${ROOT_PATH}/login`, {
    username: username, password: password
  })

  console.log(user)
  return user
}