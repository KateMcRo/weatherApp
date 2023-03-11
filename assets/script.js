const apiKey = "f2ad61c9f71718bba094dc8b0baab3d9"
let cityName = "Sacramento"
const citySearchURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`

// first API call to search by city name
async function handleWeatherData() {
    const response = await fetch(citySearchURL)
    const initialCityData = await response.json()
    const lat = initialCityData.city.coord.lat
    const lon = initialCityData.city.coord.lon
    const finalCityData = await geoWeatherData(lat, lon)
    console.log(finalCityData)
}

// second API call
async function geoWeatherData(lat, lon) {
    const coordSearchURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
    const response = await fetch(coordSearchURL)
    const coordCityData = await response.json()
    return coordCityData 

}

handleWeatherData()