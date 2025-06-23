export function el(tag, attrs = {}, ...children) {
  const element = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  children.forEach(child => {
    element.append(typeof child === "string" ? document.createTextNode(child) : child);
  });
  return element;
}
