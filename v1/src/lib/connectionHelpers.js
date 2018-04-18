import axios from 'axios'

// put in env
const ROOT_PATH = 'http://localhost:4000'


/**
 * Logs in a user
 * @param {*} {username, password}
 */
export const getUser = async ({username, password}) => {
  const user = await axios.post(`${ROOT_PATH}/login`, {
    username: username, password: password
  })
  return user
}

/**
 * Retrieves the sites 'belonging to' a user
 * @param {*} {username, token } 
 */
export const getSites = async ({username, token }) => {
  const sites = await axios.get(`${ROOT_PATH}/api/sites?owner=${username}`, { token } )
  return sites.data
}

/**
 * Retrieves devices belonging to a site
 * @param {*} {siteId, token} 
 */
export const getDevices = async({siteId, token}) => {
  const devices = await axios.get(`${ROOT_PATH}/api/devices?site_id=${siteId}`)
  return devices.data 
}