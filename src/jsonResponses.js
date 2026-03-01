
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
const getRegion = (request, response) => {

    //get the selected region from the query
    const selectedRegion = request.query.region;

    const filteredCountries = countries.filter(country => {

        //make sure the country has a region
        if(country.region) {
            return country.region.toLowerCase() === selectedRegion; //if the region matches then return them
        }
        
        return false;
        
    });

    //keep wanted information in a new list
    let responseJSON = filteredCountries.map(country => ({
        name: country.name,
    }));


    return respondJSON(request, response, 200, responseJSON);

};

//gets the requested country and prints out the ocuntry and somoe statistics about it
const getCountry = (request, response) => {

    //get the query of selected country
    const selectedCountry = request.query.name;

    if (!selectedCountry) {

        return respondJSON(request, response, 400, '400 Error: No country name has been entered.');
    }


    //filter the countries to find the matching name
    const filteredCountry = countries.filter(country => {
        return country.name.toLowerCase() === selectedCountry.toLowerCase();
    });

    //if the array is empty, return a 404 because the country doesnt exist
    if (filteredCountry.length === 0) {

        return respondJSON(request, response, 404, '404 Error: This country does not exist.');

    }

    //keep wanted information in a new list
    let responseJSON = filteredCountry.map(country => ({
        name: country.name,
        capital: country.capital,
        nationality: country.nationality,
        currency: country.finance.currency_name,
    }));

    return respondJSON(request, response, 200, responseJSON);

};

//returns the name of all countries in the list with data
const getCountriesByTimezone = (request, response) => {

    //get all the queries
    const countryTZ = request.query.timeZone;

    //if the user enters nothing send a 400
    if (!countryTZ) {
        return respondJSON(request, response, 400, '400 Error: A timezone abbreviation is required.');
    }

    const filteredCountries = countries.filter(country => {

        //check and see if the country has a timezone
        if (country.timezones) {

            //loop through each timezone this country is in and see if they match 
            for (let i = 0; i < country.timezones.length; i++) {
                if (country.timezones[i].abbreviation.toLowerCase() === countryTZ.toLowerCase()) {
                    return true; //return true if it does
                }
            }

        }

        return false;
    });

    //if there are no countries, return a 404 and say there are no countries
    if (filteredCountries.length === 0) {
        return respondJSON(request, response, 404, '404 Error: No found countries exist in that timezone.');
    }

    //if there is, return the names
    let responseJSON = filteredCountries.map(country => ({
        name: country.name,
    }));

    return respondJSON(request, response, 200, responseJSON);
};


//returns all of the currencies used in the world
const getCurrencies = (request, response) => {

    //get the rqueried currency info
    const selectedCurrencyName = request.query.currencyName;
    const selectedCurrencySymbol = request.query.currencySymbol;


    //filter all of the countries by the queries. Make them optional and return the countries that match
    const filteredCountries = countries.filter(country => {

        let matchedName;
        let matchedSymbol;

        if (!selectedCurrencyName || country.finance.currency_name.toLowerCase() === selectedCurrencyName.toLowerCase()) {
            matchedName = true;
        }

        if (!selectedCurrencySymbol || country.finance.currency_symbol === selectedCurrencySymbol) {
            matchedSymbol = true;
        }

        return matchedName && matchedSymbol;
    });

    if (filteredCountries.length === 0) {
        return respondJSON(request, response, 404, '404 Error: No currencies found.');
    }

    //build response with apropriate info
    let responseJSON = filteredCountries.map(country => ({
        name: country.name,
        currency: country.finance.currency_name,
        symbol: country.finance.currency_symbol,
    }));

    return respondJSON(request, response, 200, responseJSON);


};

//if someone wants to add/update the name of a country, they can by providing at least
//the name, capital, and currency
const addCountry = (request, response) => {

    const { name, capital, currency } = request.body;

    if (!name || !capital || !currency) {
        return respondJSON(request, response, 400, '400 Error: Name, Capital, and Currency are all required to create country');
    }

    let responseCode = 204;

    //look through the list of countries and see if it exists
    const filteredCountry = countries.filter(country => {
        return country.name.toLowerCase() === name.toLowerCase();
    });

    //if a country doesn't exist in the file, create a new one
    if (filteredCountry.length === 0) {

        responseCode = 201;

        countries[name] = {
            name: name,
            capital: capital,
            finance: {
                currency_name: currency,
            }
        };

        countries.push(countries[name]);
    }
    else {

        //if the country exists, update the content
        filteredCountry[0].capital = capital;
        filteredCountry[0].finance.currency_name = currency;
    }


    if (responseCode === 201) {
        let responseJSON = {
            name: name,
            capital: capital,
            currency: currency,
        };
        return respondJSON(request, response, responseCode, responseJSON);
    }


    return respondJSON(request, response, responseCode, {});

};

//if someone wants to add/chnage the nationality and national dish of a country, they can do that here
const addNationality = (request, response) => {

    const { name, nationality, dish } = request.body;

    if (!name || !nationality || !dish) {
        return respondJSON(request, response, 400, '400 Error: Name, Nationality, and National Dish are all required.');
    }

    let responseCode = 204;

    //look through the list of countries and see if it exists
    const filteredCountry = countries.filter(country => {
        return country.name.toLowerCase() === name.toLowerCase();
    });


    //if a country doesn't exist in the file, return a 404 saying tyhe country does not exist
    if (filteredCountry.length === 0) {

        return respondJSON(request, response, 404, '404 Error: This country does not exist.');

    }
    filteredCountry[0].nationality = nationality;
    filteredCountry[0].dish = dish;


    if (responseCode === 201) {
        let responseJSON = {
            name: name,
            nationality: nationality,
            dish: dish,
        };
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
    getRegion,
    getCountry,
    getCountriesByTimezone,
    getCurrencies,
    addCountry,
    addNationality,
    notReal,

}


