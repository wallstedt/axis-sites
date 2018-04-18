import Component from './component'
import { saveState, loadState } from '../localStorage';
import Site from './Site'
import Device from './Device'
import * as connectionHelpers from '../lib/connectionHelpers'

export default class Sites extends Component {
  constructor(props) {
    super()

    this.history = props.history;
    this.username = props.username
    this.token = props.token;
    this.activeSite = '';
    this.renderSites = props.renderSites 
  }

  /**
   * creates a list of sites populated by the devices beloning to that site
   * @param {*} username 
   * @param {*} token 
   * @return - promise 
   */
  async getSites(username, token){
    const sites = await connectionHelpers.getSites({username, token})

    const deviceList = {};
    
    const devices = await Promise.all(sites.map( async site => {
      
      const device = await connectionHelpers.getDevices({siteId: site.id, token})
      
      // iterate the lite of devices and add devices to the correct site
      deviceList[site.id] = []
      const sitesDevices = device.map(d => {

        console.log(d.storages)
        return new Device(
          d.id,
          d.site_id,
          d.title,
          d.description,
          d.model,
          d.version,
          d.enabled,
          d.connected,
          d.timezone,
          d.storages,
          value => {
            this.setActiveDevice(value);
          }
        );
      })
      deviceList[site.id].push(sitesDevices)
    }))

    // iterate the array of sites and create an array of Site objects, each Site containing the 
    // devices for that site. 
    const siteComponents = sites.map(site => new Site(site.title, site.id, deviceList[site.id], (value) => {this.setActiveSite(value)}))

    return siteComponents 
  }

  // get devices belonging to a site 
  async getDevices(siteId, token) {
    const devices = await connectionHelpers.getDevices({siteId, token})
    console.log(devices)
  }

  // render the currently selected site view
  setActiveSite(site){
    this.activeSite = site
    this.renderSites(this)
  }

  // render the view
  async render() {

    // create a list of sites 
    const sites = await this.getSites(this.username, this.token).then(sites => {
      return Promise.all(sites.map(site => site.render()));
    })

    return `
    <div id="flexContainer">
    <h1 onclick="document.registeredComponents[${this._id}].showMe()">The user is logged in.</h1>
      <a id="logout" href="/logout" onclick="document.registeredComponents[${this._id}].logout()">Logout</a>
      <div id="sites-container">
      ${sites.join('')}
      
      ${this.activeSite}
      </div>
    </div>
    `;
  }

  // logout the user
  logout() {
    // remove the session
    localStorage.removeItem('state')
    // send the user to the rootpath
    this.history.replace('/');
  }
}
