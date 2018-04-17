import Component from './component'
import { saveState, loadState } from '../localStorage';
import Site from './Site'
import Device from './Device'
import * as connectionHelpers from '../lib/connectionHelpers'

export default class Sites extends Component {
  constructor(props) {
    super()
    this.history = props.history;
    this.token = props.token;
    this.activeSite = '';
    this.renderSites = props.renderSites 

    

    // mock data
    this.mockSites = [
      { id: 1, title: 'Demo site 1', owner: 'demouser1' },
      { id: 2, title: 'Demo site 2', owner: 'demouser1' },
      { id: 3, title: 'Demo site 3', owner: 'demouser2' }
    ];

    this.sites = this.mockSites.map(site => new Site(site.title, site.id, (value) => {this.setActiveSite(value)}))


    /* this.siteList = this.getSites("demouser1", this.token).then(sites => sites.map(site => new Site(site.title, site.id, (value) => {this.setActiveSite(value)})))


    console.log(this.siteList) */

    this.getDevices("1", this.token)
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
    const sites = await this.getSites('demouser1', this.token).then(sites => {
      return Promise.all(sites.map(site => site.render()));
    })

    /* const s = await sites.map(async site => await site.render())
    const t = sites.map(async site => await site.render());
    const u = sites.map(site => site.render())
    const u1 = Promise.all(sites.map(async site => await site.render()))
    const v = await Promise.all(sites.map(async site => await site.render()))
    const w = await Promise.all(sites.map(site => site.render()))
    const x = w.map(elem => {
      console.log(Array.isArray(elem))
      console.log(typeof elem);
      return elem
    })

    console.log(typeof u1)
    u1.then(resp => console.log(resp));
    console.log(s);
    console.log(t);
    console.log(u);
    console.log(u1)
    console.log(v);
    console.log(w);
    console.log(x);

    console.log(typeof x);
    console.log(Array.isArray(x));

    console.log(w.join('')) */

    return `
    <div>
    <h1 onclick="document.registeredComponents[${this._id}].showMe()">The user is logged in.</h1>
      <a id="logout" href="/logout" onclick="document.registeredComponents[${this._id}].logout()">Logout</a>
      ${sites.join('')}
      
      ${this.activeSite}
    </div>
    `;
  }

  logout() {
    // remove the session
    window.localStorage.clear();

    // send the user to the rootpath
    this.history.replace('/');
  }
}
/* 
${this.getSites('demouser1', this.token).then(sites =>
        sites.map(
          site =>
            new Site(site.title, site.id, value => {
              this.setActiveSite(value);
            })
        )
        .map(s => s.render()).join('')
      )}
      ${this.sites.map(site => site.render()).join('')} */