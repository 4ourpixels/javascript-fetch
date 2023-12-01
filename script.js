const rapidApiKey = "485377d487msh108c692813b6e2ap1203a3jsn23084661da34";
const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const rootElement = document.getElementById("root");
const searched = document.getElementById("searched");
const loadingText = document.getElementById("loading-text");

let keyword = "";
let page = 1;

// Function to create a news item element
function createNewsItem(post) {
  const item = document.createElement("div");
  item.classList.add(
    "list-group-item",
    "list-group-item-action",
    "d-flex",
    "gap-3",
    "py-3"
  );

  const contentContainer = document.createElement("div");
  contentContainer.classList.add(
    "d-flex",
    "gap-2",
    "w-100",
    "justify-content-between"
  );

  const title = document.createElement("h6");
  title.id = "heading";
  title.classList.add("mb-0");
  title.innerHTML = post.title;

  const link = document.createElement("a");
  link.id = "news_url";
  link.classList.add("mb-0", "opacity-75");
  link.href = post.longURL;
  link.innerHTML = "Click here to read";

  // Appending elements to the item
  contentContainer.appendChild(title);
  contentContainer.appendChild(link);
  item.appendChild(contentContainer);

  return item;
}

// Function to fetch Bloomberg news
async function fetchBloombergNews() {
  try {
    const apiUrl = `https://bloomberg-market-and-financial-news.p.rapidapi.com/market/auto-complete?query=${keyword}`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "X-RapidAPI-Host": "bloomberg-market-and-financial-news.p.rapidapi.com",
        "X-RapidAPI-Key": rapidApiKey,
      },
    });

    if (!response.ok) {
      alert(
        "Failed to load, restart the browser or check for internet connection."
      );
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Clear existing news items
    rootElement.innerHTML = "";

    var numResults = 25;
    if (data.news.length == 0) {
      loadingText.innerHTML = `We've got nothing on "${keyword}"`;
    } else {
      // Hide loading text after the request is complete
      loadingText.innerHTML = `Here's what we have on "${keyword}"`;
    }

    // Display the first 10 news items
    for (let i = 0; i < Math.min(numResults, data.news.length); i++) {
      console.log("Data: ", data);
      const post = data.news[i];
      const newsItem = createNewsItem(post);
      rootElement.appendChild(newsItem);
    }

    // Process data as needed
  } catch (error) {
    console.error("Error fetching Bloomberg news:", error);
  }
}

// Query search event listener function
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (searchBox.value == "") {
    alert("Enter a word to search");
  } else {
    keyword = searchBox.value;
    loadingText.innerHTML = `Getting "${keyword}"`;
    fetchBloombergNews();
  }
});

fetchBloombergNews();
