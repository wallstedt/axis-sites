export const renderPage = async (page, target) => {
  const rootElement = await page();
  renderElement(target, rootElement);
};
