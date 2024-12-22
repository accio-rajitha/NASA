// script.js

const API_KEY = '3VYQaQ9KdJywJ0315CL6OoBsuTIEuel8uqHFYjjH';  // Your API Key
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

// Function to fetch the current image of the day
async function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    try {
        const response = await fetch(`${BASE_URL}?api_key=${API_KEY}&date=${currentDate}`);
        const data = await response.json();
        displayImage(data, currentDate);  // Display the image and show "Picture on YYYY-MM-DD"
    } catch (error) {
        console.error("Error fetching current image:", error);
    }
}

// Function to fetch image of the day for a selected date
async function getImageOfTheDay(date) {
    try {
        const response = await fetch(`${BASE_URL}?api_key=${API_KEY}&date=${date}`);
        const data = await response.json();
        displayImage(data, date);  // Display the image and show the selected date
        saveSearch(date);
        addSearchToHistory(date);
    } catch (error) {
        console.error("Error fetching image for date:", error);
    }
}

// Function to display the image and its details in the UI
function displayImage(data, date) {
    const imageContent = document.getElementById('image-content');
    const heading = document.querySelector('#current-image-container h2');
    
    // Update the heading to reflect the selected date
    heading.textContent = `Picture on ${date}`;  // Display the selected date
    
    imageContent.innerHTML = `
        <img src="${data.url}" alt="${data.title}">
        <h3>${data.title}</h3>
        <p>${data.explanation}</p>
    `;
}

// Function to save the search date to local storage
function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem('searches', JSON.stringify(searches));
    }
}

// Function to add the selected date to the search history list
function addSearchToHistory(date) {
    const searchHistory = document.getElementById('search-history');
    const li = document.createElement('li');
    li.textContent = date;
    li.addEventListener('click', () => getImageOfTheDay(date));  // Fetch data for clicked date
    searchHistory.appendChild(li);
}

// Function to load the search history from local storage
function loadSearchHistory() {
    const searches = JSON.parse(localStorage.getItem('searches')) || [];
    searches.forEach(addSearchToHistory);
}

// Event listener for form submission
document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('search-input').value;
    getImageOfTheDay(date);  // Fetch image for the selected date
});

// Initial load to display today's image
getCurrentImageOfTheDay();

// Load the search history when the page loads
loadSearchHistory();
