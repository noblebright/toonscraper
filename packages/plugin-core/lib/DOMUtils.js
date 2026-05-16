import { HTMLElement, parse } from "node-html-parser";

class DomHolder {
  constructor(DOM) {
    this.DOM = DOM;
  }
  /**
   *
   * @param {string} selector CSS Selector
   * @param {string | ((e: HTMLElement) => string)} attributeMapperFn element.getAttribute() of string, or custom function
   * @returns {string[]}
   */
  fetchList(selector, attributeMapperFn) {
    const results = [];
    const fn =
      typeof attributeMapperFn === "string"
        ? (e) => e.getAttribute(attributeMapperFn)
        : attributeMapperFn;

    this.DOM.querySelectorAll(selector).forEach((element) => {
      results.push(fn(element));
    });
    return results;
  }

  /**
   *
   * @param {string} selector CSS Selector
   * @param {(e: string) => string} [transform] transform function, if any
   * @returns {string} Returns the innerText of the Element
   */
  getText(selector, transform) {
    const element = this.DOM.querySelector(selector);
    if (!element)
      throw new Error(`Expected element matching selector '${selector}'`);
    return transform ? transform(element.innerText) : element.innerText;
  }

  /**
   *
   * @param {string} selector CSS Selector
   * @param {RegExp} pattern pattern to match
   * @param {(e: string) => string} [transform] transform function, if any
   * @returns {string} Returns the innerText of the Element
   */
  getElementText(selector, pattern, transform) {
    const element = [...this.DOM.querySelectorAll(selector)].find((x) =>
      pattern.exec(x.innerText),
    );
    if (!element)
      throw new Error(
        `getElementByText: Expected element matching selector '${selector}' containing pattern '${pattern.toString()}'`,
      );
    return transform ? transform(element.innerText) : element.innerText;
  }
}

/**
 *
 * @param {string} url URL of page
 * @param {RequestInit} fetchOpts fetch() options
 * @returns {Promise<DomHolder>}
 */
export async function fetchDOM(url, fetchOpts = {}) {
  const rawDocument = await fetch(url, fetchOpts).then((x) => {
    if (x.ok) return x.text();
    else {
      console.log("Response Headers:");
      x.headers.forEach((v, k) => console.log(`${k}: ${v}`));
      throw new Error(x.statusText);
    }
  });
  const DOM = parse(rawDocument);
  return new DomHolder(DOM);
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
  fetchOpts = {},
) {
  const DOM = await fetchDOM(url, fetchOpts);
  return DOM.fetchList(selector, attributeMapperFn);
}
