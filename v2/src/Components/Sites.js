import * as connectionHelpers from '../lib/connectionHelpers'
import * as util from './helpers/pageHelpers'
import Login from './Login'
import { app } from '../index'

const Sites = async container => {
  
  const getSites = async () => {
    const user = JSON.parse(localStorage.getItem('state'));

    // get sites for user
    const sites = await connectionHelpers.getSites({
      username: user.username,
      token: user.token
    });

    // make a list of devices
    const deviceList = {};

    // get devices
    const devices = await Promise.all(
      sites.map(async site => {
        // get devices for a site
        const device = await connectionHelpers.getDevices({
          siteId: site.id,
          token: user.token
        });
        // create object entry for the site
        deviceList[site.id] = device; // changed this from []
      })
    );

    const siteComponents = sites.map(site => {
      return {
        title: site.title,
        id: site.id,
        deviceList: deviceList[site.id]
      };
    });

    return siteComponents;
  }; // end getSites

  /**
   *
   * @param {*} site - object
   */
  const createRows = site => {
    const rows = site.deviceList.map(d => {
      const tr = document.createElement('tr');
      // let tr = tableDiv.firstElementChild.lastElementChild.firstElementChild.cloneNode(false);
      Object.keys(d).forEach(key => {
        if (typeof d[key] != 'function' && key != '_id') {
          const td = document.createElement('td');
          // let td = tableDiv.firstElementChild.firstElementChild.lastElementChild.firstElementChild.cloneNode(false);

          // loop arrays
          if (Array.isArray(d[key])) {
            d[key].forEach(elem => {
              Object.keys(elem).forEach(key => {
                td.appendChild(document.createTextNode(`${elem[key]} `));
              });
            });
          } else {
            td.appendChild(document.createTextNode(d[key]));
          }

          tr.appendChild(td);
        }
      });

      return tr;
    });

    return rows;
  };

  /**
   * Create table headers from the list provided 
   * @param {*} site - array
   */
  const getHeaders = site => {
    console.log(site[0].deviceList[0]);
    let o = site[0].deviceList[0];

    const tr = document.createElement('tr');
    // const tr = tableDiv.firstElementChild.lastElementChild.firstElementChild.cloneNode(false);
    Object.keys(o).forEach(item => {
      const th = document.createElement('th');
      // const th = tableDiv.firstElementChild.lastElementChild.firstElementChild.firstElementChild.cloneNode(false);
      th.appendChild(document.createTextNode(item));
      tr.appendChild(th);
    });

    return tr;
  };

  /**
   * Creates table elements and populates a table for a site with device data
   * @param {*} site - array
   */
  const renderTable = async site => {

    let target = tableDiv.firstElementChild;

    while (target.firstElementChild) {
      target.removeChild(target.firstChild);
    }

    // get the table headers
    const headers = getHeaders(site);
    tableDiv.firstElementChild.appendChild(headers);
    const rows = site.map(device => createRows(device));

    rows[0].forEach(row => {
      tableDiv.firstElementChild.appendChild(row);
    });

    
  };

  // All DOM-retrieval stuff here
  const template = document.querySelectorAll('#screen template')[0];
  const sitesContainer = document.importNode(
    template.content.firstElementChild,
    true
  );
  const linksDiv = sitesContainer.firstElementChild;
  const tableDiv = sitesContainer.lastElementChild;

  let page = util.Page();
  page.firstElementChild.firstElementChild.appendChild(
    document.createTextNode('Sites')
  );
  page.firstElementChild.nextElementSibling.appendChild(sitesContainer);
  
  // End retrieving DOM

  // get sites and populate nodes with site names
  const sites = await getSites();
  sites.forEach(site => {
    let node = linksDiv.firstElementChild.cloneNode(false);
    node.appendChild(document.createTextNode(site.title));
    let url = site.title.replace(/\s/g, '-');
    node.setAttribute('href', `#!${url}`);
    node.setAttribute('id', `site-${site.id}`);
    node.classList.add('site-selector');
    linksDiv.appendChild(node);
  });

  // get a list of all the links to sites and add eventlisteners
  const siteSelectors = linksDiv.getElementsByClassName('site-selector');

  // 'for-of' does not work here because...?
  for (let i = 0; i < siteSelectors.length; i++) {
    siteSelectors[i].addEventListener('click', function(e) {
      e.preventDefault();

      document.querySelector('#table').classList.remove('hidden')

      const siteId = siteSelectors[i].getAttribute('id');
      const id = siteId.split('-').pop();

      let site = sites.filter(s => s.id == id);
      renderTable(site);
    });
  }

  const user = JSON.parse(localStorage.getItem('state'));

  // logout node
  const logoutLink = linksDiv.firstElementChild.cloneNode(false);
  console.log(linksDiv);
  logoutLink.appendChild(document.createTextNode(`Logout ${user.username}`));
  logoutLink.setAttribute('href', '#!logout');
  logoutLink.setAttribute('id', 'logout');
  linksDiv.appendChild(logoutLink);

  logoutLink.addEventListener('click', async e => {
    e.preventDefault()

    localStorage.removeItem('state')
    await util.renderPage(Login, container);
  })
  console.log('getting here?')
  return page;
};

export default Sites