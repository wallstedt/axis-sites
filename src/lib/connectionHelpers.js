import axios from 'axios'

// put in env
const ROOT_PATH = 'http://localhost:4000'


export const getUser = async ({username, password}) => {
  const user = await axios.post(`${ROOT_PATH}/login`, {
    username: username, password: password
  })
  return user
}

export const getSites = async ({username, token }) => {
  const sites = await axios.get(`${ROOT_PATH}/api/sites?owner=${username}`, { token } )
  return sites.data
}

export const getDevices = async({siteId}) => {
  const devices = await axios.get(`${ROOT_PATH}/api/devices?site_id=${siteId}`)
  return devices.data 
}