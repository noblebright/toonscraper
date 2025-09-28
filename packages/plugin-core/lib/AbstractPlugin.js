/** @interface */
export class AbstractPlugin {
  name = "AbstractPlugin";
  /**
   * @abstract
   * @description Returns true if this plugin can handle this url.
   *
   * @param {string} url
   * @returns {boolean}
   */
  handles(url) {
    return false;
  }

  /**
   * @abstract
   * @description Fetches the title of the toon series.
   *
   * @param {string} url Url of the title to download
   * @returns {Promise<string>}
   */
  async fetchTitle(url) {
    return Promise.resolve("Unimplemented");
  }

  /**
   * @abstract
   * @description Fetches a list of urls which correspond to each title.
   *
   * @param {string} url Url of the title to download
   * @returns {Promise<string[]>}
   */
  async fetchIndex(url) {
    return Promise.resolve([]);
  }

  /**
   * @abstract
   * @description Fetches a list of urls which correspond to the images in a chapter.
   *
   * @param {string} url Url of the chapter to get images from
   * @returns {Promise<string[]>}
   */
  async fetchChapter(url) {
    return Promise.resolve([]);
  }

  /**
   * Get the local dir name of the chapter
   * @param {string} url
   * @returns string
   */
  async getChapterName(url) {
    return "";
  }

  /**
   * @abstract
   * @description Fetches a single image.
   *
   * @param {string} url Url of the image
   * @param {string} outDirName path to store the image
   * @param {number} idx sequential index of the image
   */
  async downloadImage(url, outDirName, idx) {}
}
