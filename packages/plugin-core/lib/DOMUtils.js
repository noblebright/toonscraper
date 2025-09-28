import { HTMLElement, parse } from "node-html-parser";

/**
 *
 * @param {string} url
 * @param {RequestInit} fetchOpts
 * @returns {Promise<HTMLElement>}
 */
export async function fetchDOM(url, fetchOpts = {}) {
  const rawDocument = await fetch(url, fetchOpts).then((x) => x.text());
  const DOM = parse(rawDocument);
  return DOM;
}

/**
 *
 * @param {string} url
 * @param {string} selector
 * @param {string | ((HTMLElement) => string)} attributeMapperFn
 * @param {RequestInit} fetchOpts
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
