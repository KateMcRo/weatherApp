const apiKey = "f2ad61c9f71718bba094dc8b0baab3d9"
let cityName = "Sacramento"
const citySearchURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`

// first API call to search by city name
async function handleWeatherData() {
    const response = await fetch(citySearchURL)
    const initialCityData = await response.json()
    const lat = initialCityData.city.coord.lat
    const lon = initialCityData.city.coord.lon
    geoWeatherData(lat, lon)
}

// second API call
async function geoWeatherData(lat, lon) {
    const coordSearchURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    const response = await fetch(coordSearchURL)
    const coordCityData = await response.json()
    manipulateData(coordCityData)
}

// function to use the API data
function manipulateData(finalCityData){
    const cityDataArray = finalCityData.list
    console.log(cityDataArray)
    const {day, temperature, icon, wind, humidity} = handleVariables(cityDataArray[0])
    const currentCard = generateCard(day, temperature, icon, wind, humidity)
    return currentCard
}

// Creates a data object
function handleVariables(cityDataObj) {
    const weekday = dayjs(cityDataObj.dt_txt).format('dddd')
    const dtFormat = dayjs(cityDataObj.dt_txt).format('MMM. DD, YYYY')
    console.log(dtFormat)
    const {temp, humidity} = cityDataObj.main
    const {icon} = cityDataObj.weather[0]
    const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`
    const windSpeed = cityDataObj.wind.speed
    const currentWeatherObj = {
        day: weekday,
        date: dtFormat,
        temperature: temp,
        icon: iconURL,
        wind: windSpeed,
        humidity: humidity,
    }
    return currentWeatherObj
}


// generates cards for dashboard
function generateCard (day, date, temp, iconURL, windSpeed, humidity) {

    return ` 
        <div class="custom-card">
            <div class="custom-card-header">
                <h1 class="card-title">${day}</h1>
                <p class="card-subtext">${date}</p>
            </div>
            <div class="custom-card-body">
                <h2 class="card-text">${temp} ℉</h2>
                <h3 class="card-text weather-icon"><img src="${iconURL}" /></h3>
                <h4 class="card-text">${windSpeed} MPH</h4>
                <h5 class="card-text">${humidity}</h5>
            </div>
        </div>
    `
}

// Set current card
function setCurrentCard (cardHTML) {

    document.getElementById("cardContainer").innerHTML = cardHTML
}

handleWeatherData()
setCurrentCard()