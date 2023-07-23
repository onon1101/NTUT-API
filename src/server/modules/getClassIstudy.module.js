import cheerio from 'cheerio';
import NTUTRequest from './getLoginPage.module';

class NTUTIstudy extends NTUTRequest {
  constructor(username, password) {
    super(username, password);
    this.cache = {};
  }

  static content() {
    return {
      personOfNumbers: 
    };
  }
}

// this is main of program
function main() {

}

export default main;
