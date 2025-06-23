export function el(tag, attrs = {}, ...children) {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    element.setAttribute(key, value);
  }
  children.forEach(child => {
    element.append(typeof child === "string" ? document.createTextNode(child) : child);
  });
  return element;
}
