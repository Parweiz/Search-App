import {setSearchFocus, showClearTextButton, clearSearchText, clearPushListener} from './searchbar.js'
import {getSearchTerm, retrieveSearchResult} from './data.js';
import {deleteSearchResult,buildSearchResult , clearStatsLine, setStatsLine} from './searchResult.js';

document.addEventListener("readystatechange", (event) => {
    // If the page is ready and has loaded everything then go ahead and initialize the app
    if (event.target.readyState === "complete") {
        initApp();
    }
});

const initApp = () => {
    // Set the focus on inputfield
    setSearchFocus();

    // 3 listeners that have to do with the clear text btn
    const search = document.getElementById("search");
    const clear = document.getElementById("clearTxt");
    const form = document.getElementById("searchBar");

    search.addEventListener("input", showClearTextButton);
    clear.addEventListener("click", clearSearchText);
    clear.addEventListener("keydown", clearPushListener);
    form.addEventListener("submit", submitTheSearch);
};

const submitTheSearch = (event) => {
    // Prevents the default behaviour of the form for otherwise the form reloads the page
    event.preventDefault();
    deleteSearchResult();
    processTheSearch();
    setSearchFocus();
};

const processTheSearch = async () => {
    clearStatsLine();
    const searchTerm = getSearchTerm();
    if (searchTerm === "") return; //TODO: Come up with better handling for when the search term is empty

    const resultArray = await retrieveSearchResult(searchTerm);
    // If the array isn't empty (aka if there are some results) then go ahead and build / show the result
    if (resultArray.length) {
        buildSearchResult(resultArray);
    }
    setStatsLine(resultArray.length);
};