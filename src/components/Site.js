import Component from './component'

export default class Site extends Component {
  constructor(name, id, onPress) {
    super()
    this.name = name;
    this.id = id;
    this.onPress = onPress;
  }

  render() {
    return `
    <div id="bla">
      <p id="${this.id}" onclick="document.registeredComponents[${
      this._id
    }].setBody(this.value)">${this.name}</p>
    </div>
    `;
  }

  setBody(value) {
    const html = `
    <div>
      <h1>${this.name}</h1>
      <p>${this.id}</p>

    </div>
    `;

    this.onPress(html);
  }
}