import Component from './component';

export default class Device extends Component {
  constructor(id, siteId, title, description, model, version, enabled, connected, timezone, storages, onPress) {
    super();

    this.id = id;
    this.siteId = siteId;
    this.title = title;
    this.description = description;
    this.model = model;
    this.version = version;
    this.enabled = enabled;
    this.connected = connected;
    this.timezone = timezone;
    this.storages = storages;
    this.onPress = onPress;
  }

  /**
   * Renders HTML
   */
  async render () {
    const html = `
      <tr>

        <td>${this.id}</td>
        <td>${this.siteId}</td>
        <td>${this.title}</td>
        <td>${this.description}</td>
        <td>${this.model}</td>
        <td>${this.version}</td>
        <td>${this.enabled}</td>
        <td>${this.connected}</td>
        <td>${this.timezone}</td>
        <td>
        ${this.printStorage()}
        </td>
      </tr>
      `;

      return html
  }

  /**
   * expands 'storage' objects 
   */
  printStorage() {
    console.log(this.storages);
    const txt = this.storages.map(store => `id: ${store.id}, state: ${store.state}`)
    return txt.join('')
  }
}
