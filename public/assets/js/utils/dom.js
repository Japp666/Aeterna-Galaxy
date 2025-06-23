export function el(tag, attrs = {}, ...children) {
  const element = document.createElement(tag);
  for (const key in attrs) {
    element.setAttribute(key, attrs[key]);
  }
  children.forEach(child => {
    element.append(child instanceof Node ? child : document.createTextNode(child));
  });
  return element;
}
