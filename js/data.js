export const getSearchTerm = () => {
    // Grabs the value of the inputfield and then trims the whitespaces from both ends
    const rawSearchTerm = document.getElementById("search").value.trim();
    // Creating a search pattern (Looking for spaces within the inputfield- Looking for more than 1 space)
    const regex = /[ ]{2,}/gi;
    const searchTerm = rawSearchTerm.replaceAll(regex, " ");
    return searchTerm;
};

export const retrieveSearchResult = async (searchTerm) => {
    const wikiSearchString = getWikiSearchString(searchTerm);
    const wikiSearchResult = await requestData(wikiSearchString);
    let resultArray = [];
    // If wikiSearchResult variable has the property query, then pass in all data under the "pages" object into the array
    if (wikiSearchResult.hasOwnProperty("query")) {
        resultArray = processWikiResults(wikiSearchResult.query.pages);
    }
    return resultArray;
};

// With this function we can specify the specific uri for the term that is being searched on
const getWikiSearchString = (searchTerm) => {
    const maxCharacters = getMaxCharacters();
    const rawSearchString = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchTerm}&gsrlimit=20&prop=pageimages|extracts&exchars=${maxCharacters}&exintro&explaintext&exlimit=max&format=json&origin=*`;
    const uri = encodeURI(rawSearchString);
    return uri;
};

// With this function we can define how many characters we would like to receive back from Wiki API
const getMaxCharacters = () => {
    const width = window.innerWidth || document.body.clientWidth;
    let maxCharacters;
    if (width < 414) {
        maxCharacters = 65;
    } else if (width >= 414 && width < 1400) {
        maxCharacters = 100;
    } else if (width >= 1400) {
        maxCharacters = 130;
    }
    return maxCharacters;
};

// With this function we fetch the uri that is passed on and return the response back in JSON-format
const requestData = async (searchString) => {
    try {
        const response = await fetch(searchString);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(err);
    }
};

const processWikiResults = (result) => {
    const resultArray = [];
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    Object.keys(result).forEach((key) => {
        const id = key;
        const title = result[key].title;
        const text = result[key].extract;
        const img = result[key].hasOwnProperty("thumbnail") ?
            result[key].thumbnail.source :
            null;
        // The actual object that is being passing on 
        const item = {
            id: id,
            title: title,
            img: img,
            text: text
        };
        resultArray.push(item);
    });
    return resultArray;
};