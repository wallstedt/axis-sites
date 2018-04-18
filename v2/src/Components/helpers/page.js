export const Page = container => {
  const template = document.querySelectorAll('#page template')[0];
  const content = document.importNode(template.content.firstElementChild, true);
  return content;
};
