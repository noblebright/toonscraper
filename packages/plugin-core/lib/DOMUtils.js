import { HTMLElement, parse } from "node-html-parser";

/**
 *
 * @param {string} url URL of page
 * @param {RequestInit} fetchOpts fetch() options
 * @returns {Promise<HTMLElement>}
 */
export async function fetchDOM(url, fetchOpts = {}) {
  const rawDocument = await fetch(url, fetchOpts).then((x) => {
    if (x.ok) return x.text();
    else {
      console.log("Respnose Headers:");
      x.headers.forEach((v, k) => console.log(`${k}: ${v}`));
      throw new Error(x.statusText);
    }
  });
  const DOM = parse(rawDocument);
  return DOM;
}

/**
 *
 * @param {string} url URL of page
 * @param {string} selector CSS Selector
 * @param {string | ((e: HTMLElement) => string)} attributeMapperFn element.getAttribute() of string, or custom function
 * @param {RequestInit} fetchOpts fetch() options
 * @returns {Promise<string[]>}
 */
export async function fetchList(
  url,
  selector,
  attributeMapperFn,
  fetchOpts = {}
) {
  const DOM = await fetchDOM(url, fetchOpts);
  const childURLs = [];
  const fn =
    typeof attributeMapperFn === "string"
      ? (e) => e.getAttribute(attributeMapperFn)
      : attributeMapperFn;

  DOM.querySelectorAll(selector).forEach((element) => {
    childURLs.push(fn(element));
  });
  return childURLs;
}
