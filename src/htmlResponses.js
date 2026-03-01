const fs = require('fs'); 

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const docs = fs.readFileSync(`${__dirname}/../client/docs.html`);
const docsCss = fs.readFileSync(`${__dirname}/../client/docsCSS.css`);


const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};


const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getDocumentation = (request, response) => {

  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(docs);
  response.end();

}

const getDocsCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(docsCss);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
  getDocumentation,
  getDocsCSS,
};