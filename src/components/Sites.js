import Component from './component'
import { saveState, loadState } from '../localStorage';
import Site from './Site'
import Device from './Device'
import * as connectionHelpers from '../lib/connectionHelpers'

export default class Sites extends Component {
  constructor(props) {
    super()

    console.log(props)

    this.history = props.history;
    this.username = props.username
    this.token = props.token;
    this.activeSite = '';
    this.renderSites = props.renderSites 
  }

  async getSites(username, token){
    const sites = await connectionHelpers.getSites({username, token})

    const deviceList = {};
    // recator to own func (buildSitesList)
    const devices = await Promise.all(sites.map( async site => {
      
      const device = await connectionHelpers.getDevices({siteId: site.id, token})
      
      
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
      //return sitesDevices
    }))

    // console.log(devices);
    console.log(deviceList);
    const siteComponents = sites.map(site => new Site(site.title, site.id, deviceList[site.id], (value) => {this.setActiveSite(value)}))

    console.log('site Components ', siteComponents);
    return siteComponents 
  }

  async getDevices(siteId, token) {
    const devices = await connectionHelpers.getDevices({siteId, token})
    console.log(devices)
  }

  setActiveSite(site){
    this.activeSite = site
    this.renderSites(this)
  }

  async render() {
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

  logout() {
    // remove the session
    //window.localStorage.clear();
    localStorage.removeItem('state')
    // send the user to the rootpath
    this.history.replace('/');
  }
}
