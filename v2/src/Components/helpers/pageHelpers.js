export const renderElement = (target, element) => {
  while (target.firstChild) {
    target.removeChild(target.firstChild);
  }

  target.appendChild(element);
};

export const renderPage = async (page, target) => {
  const rootElement = await page(target);
  renderElement(target, rootElement);
};

export const Page = container => {
  const template = document.querySelectorAll('#page template')[0];
  const content = document.importNode(template.content.firstElementChild, true);
  return content;
};
