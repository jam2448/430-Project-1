
const fs = require('fs');

//get the file of countries
const countriesData = fs.readFileSync(`${__dirname}/../dataSets/countries.json`);

const countries = JSON.parse(countriesData);


const respondJSON = (request, response, status, object) => {

    const content = JSON.stringify(object);

    response.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });


    if (request.method !== 'HEAD' && status !== 204) {
        response.write(content);
    }

    response.end();

};



//gets the requested continent that the user wants 
//  and returns all of the counties within that continent 
const getReigon = (request, response) => {

    const responseJSON = {
    };

};

//gets the requested country and prints out the ocuntry and somoe statistics about it
const getCountry = (request, response) => {

    const responseJSON = {};

};

//returns the name of all countries in the list with data
const getAllCountries = (request, response) => {

    const respondJSON = {
        countries,

    }

    return respondJSON(request, response, 200, responseJSON);
};


//returns all of the currencies used in the world
const getCurrencies = (request, response) => {


};

//if someone wants to add/update the name of a country, they can by providing at least
//the name, capital, and currency
const addCountry = (request, response) => {

    const responseJSON = {
        message: 'Name, Capital, and Currency are all required to create country',

    };

    const { name, capital, currency } = request.body;

    if (!name || !capital || !currency) {
        responseJSON.id = 'missingParams';
        return respondJSON(request, response, 400, responseJSON);
    }

    let responseCode = 204;

    //if a country doesn't exist in the file, create a new one
    if (!countries[name]) {

        responseCode = 201;

        countries[name] = {
            name: name,
            finance: {},
        };

    }
    countries[name].capital = capital;
    countries[name].finance.currency = currency;

    if (responseCode === 201) {
        responseJSON.message = 'Country Added Successfully';
        return respondJSON(request, response, responseCode, responseJSON);
    }


    return respondJSON(request, response, responseCode, {});

};

//if someone wants to add/chnage the nationality and national dish of a country, they can do that here
const addNationality = (request, response) => {

     const responseJSON = {
        message: 'Name, Nationality, and National Dish are all required to create country',

    };

    const { name, nationality, dish } = request.body;

    if (!name || !nationality || !dish) {
        responseJSON.id = 'missingParams';
        return respondJSON(request, response, 400, responseJSON);
    }

    let responseCode = 204;

    //if a country doesn't exist in the file, create a new one
    if (!countries[name]) {

        responseCode = 201;

        countries[name] = {
            name: name,
        };

    }
    countries[name].nationality = nationality;
    countries[name].favorite_dish = dish;

    if (responseCode === 201) {
        responseJSON.message = 'Nationality & Dish Added Successfully';
        return respondJSON(request, response, responseCode, responseJSON);
    }


    return respondJSON(request, response, responseCode, {});

};

const notReal = (request, response) => {
    const responseJSON = {
        message: 'The page you were looking for was not found',
        id: 'notFound',
    };

    respondJSON(request, response, 404, responseJSON);
}


module.exports = {
    getReigon,
    getCountry,
    getAllCountries,
    getCurrencies,
    addCountry,
    addNationality,
    notReal,

}


