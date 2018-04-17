import Component from './component'
import Device from './Device'

export default class Site extends Component {
  constructor(name, id, devices, onPress) {
    super()
    this.name = name;
    this.id = id;
    this.devices = devices;
    this.onPress = onPress;

    console.log(this.devices);
  }

  /**
   * Renders container for 'expandable' link to site details 
   */
  async render() {
    return `
    <div id="site-header">
      <p id="${this.id}" onclick="document.registeredComponents[${
      this._id
    }].showDevices()">${this.name}</p>
    </div>
    `;
  }


  /**
   * Creates <th> tags for the device tables
   */
  async setTableHeaders(){
    let headers = []
    let model = this.devices[0][0]
    
    // ignore cbs and the object id
    Object.keys(model).forEach(key => {
      if (typeof model[key] != "function" && key != '_id') {
        headers.push(key)
      }
    })
    

    const html = `
    <tr>
      ${headers.map(h => `<th>${h}</th>`).join('')}
    </tr>
    `

    return html
  }

  /**
   * Arranges HTML for a table of devices using stored devices as source
   * 
   * Is used by a cb passed to the object from its containing element (Sites in this case)
   */
  async showDevices() {
    const headers = await this.setTableHeaders()
    const devices = await Promise.all(this.devices[0].map(d => d.render()))
    
    const html = `
    <div>
      <h1>${this.name}</h1>
      <p>${this.id}</p>
      <table>
        <thead>
          ${headers}
        </thead>
        ${devices.join('')}
      </table>
      <p>hoho </p>
    </div>
    `;

    this.onPress(html);
  }
}