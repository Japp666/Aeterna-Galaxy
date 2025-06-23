export function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => e.setAttribute(key, value));
  children.forEach(child => {
    e.append(typeof child === "string" ? document.createTextNode(child) : child);
  });
  return e;
}
