import { fetchCityData, fetchWeatherData } from "./api.js";
import { populateCityDropdown, filterAndPopulateDropdown, displayWeather } from "./dom.js";

document.addEventListener("DOMContentLoaded", async () => {
    const cityDropdown = document.getElementById("city-dropdown");
    const citySearchInput = document.getElementById("city-search");
    const forecastContainer = document.getElementById("weather-forecast");
    const unitToggle = document.getElementById("unit-toggle");
    const spinner = document.getElementById("loading-spinner");
    const citySpinner = document.getElementById("city-loading-spinner");
    const summary = document.getElementById("weekly-summary");
    const lastUpdated = document.getElementById("last-updated");
    let isCelsius = true;
    let cities = [];

    try {
        citySpinner.style.display = "block"; // Show spinner
        cities = await fetchCityData("city_coordinates.csv");
        populateCityDropdown(cityDropdown, cities);
    } catch (error) {
        console.error("Error loading cities:", error);
    } finally {
        citySpinner.style.display = "none"; // Hide spinner
    }

    unitToggle.addEventListener("click", () => {
        isCelsius = !isCelsius;
        unitToggle.textContent = isCelsius ? "Switch to °F" : "Switch to °C";
        if (cityDropdown.value) updateWeather();
    });

    cityDropdown.addEventListener("change", () => {
        if (cityDropdown.value) updateWeather();
    });

    citySearchInput.addEventListener("input", () => {
        const filter = citySearchInput.value;
        filterAndPopulateDropdown(cityDropdown, cities, filter);
    });

    async function updateWeather() {
        const [lat, lon] = cityDropdown.value.split(",");
        spinner.style.display = "block";
        forecastContainer.innerHTML = "";
        summary.textContent = "";

        try {
            const data = await fetchWeatherData(lat, lon);
            displayWeather(data, forecastContainer, summary, isCelsius, lastUpdated);
        } catch (error) {
            forecastContainer.innerHTML = `<p>${error.message}. Please try again later.</p>`;
        } finally {
            spinner.style.display = "none";
        }
    }
});