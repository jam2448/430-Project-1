const http = require('http');
const responseHandler = require('./jsonResponses.js');
const htmlHandler = require('./htmlResponses.js');


const port = process.env.PORT || process.env.NODE_PORT || 3000;


const parseBody = (request, response, handler) => {

    const body = [];


    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    request.on('data', (chunk) => {
        body.push(chunk);
    });

    request.on('end', () => {
        const bodystring = Buffer.concat(body).toString();
        const type = request.headers['content-type'];

        if (type === 'application/json') {
            request.body = JSON.parse(bodystring);
        }
        else {

            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify({ error: 'invalid data format' }));
            return response.end();

        }

        handler(request, response);
    });
};


//handle all of the post requests here 
const handlePost = (request, response, parsedURL) => {

    if (parsedURL.pathname === '/addCountry') {
        parseBody(request, response, responseHandler.addCountry);
    }
    else if( parsedURL.pathname === '/addNationality'){
        parseBody(request,response, responseHandler.addNationality);
    }
};

//handle all of the get requests here
const handleGet = (request, response, parsedURL) => {

    if (parsedURL.pathname === '/style.css') {
        htmlHandler.getCSS(request, response);
    }
    else if (parsedURL.pathname === '/getRegion') {
        responseHandler.getRegion(request, response);
    }
    else if(parsedURL.pathname === '/getCountry') {
        responseHandler.getCountry(request, response);
    }
    else if(parsedURL.pathname === '/getCountriesByTimezone'){
        responseHandler.getCountriesByTimezone(request, response);
    }
    else if(parsedURL.pathname === '/getCurrencies'){
        responseHandler.getCurrencies(request, response);
    }
    else if(parsedURL.pathname === '/' || parsedURL.pathname === '/client.html'){
        htmlHandler.getIndex(request, response);
    }
    else if (parsedURL.pathname === '/docs.html'){
        htmlHandler.getDocumentation(request, response);
    }
    else if (parsedURL.pathname === '/docsCSS.css'){
        htmlHandler.getDocsCSS(request, response);
    }
    else {
        responseHandler.notReal(request, response);
    }

};

const onRequest = (request, response) => {

    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedURL = new URL(request.url, `${protocol}://${request.headers.host}`);

    request.query = Object.fromEntries(parsedURL.searchParams);

    if (request.method === 'POST') {
        handlePost(request, response, parsedURL);
    }
    else {
        handleGet(request, response, parsedURL);
    }
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
});

