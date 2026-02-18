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

const handlePost = (request, response, parsedURL) => {

    if (parsedURL.pathname === '/addUser') {
        parseBody(request, response, responseHandler.addUser);
    }
};

const handleGet = (request, response, parsedURL) => {

    if (parsedURL.pathname === '/style.css') {
        htmlHandler.getCSS(request, response);
    }
    else if (parsedURL.pathname === '/getUsers') {
        responseHandler.getUsers(request, response);
    }
    else {
        htmlHandler.getIndex(request, response);
    }
    // else if(parsedURL.pathname === '/notReal'){
    //     responseHandler.notReal(request, response);
    // }
    // else {
    //     responseHandler.notReal(request, response);
    // }

};

const onRequest = (request, response) => {

    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedURL = new URL(request.url, `${protocol}://${request.headers.host}`);

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

