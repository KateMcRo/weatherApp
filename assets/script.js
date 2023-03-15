const apiKey = "f2ad61c9f71718bba094dc8b0baab3d9"
const searchBtnEl = document.getElementById("searchBtn")
const cityInputEl = document.getElementById("cityInput")
let cityName = "Sacramento"

let cardsHTMLArray = []

// funtion for user input
function handleSubmit (event) {
    event.preventDefault ()
    if (cityInputEl.value === "") {
        return handleError ("Please input a city name.")
    } else {
        cityName = cityInputEl.value
        console.log(cityName)
        sauron()
    }
}

async function sauron() {
   
    const {lat, lon} = await handleWeatherData()
    const cityData = await geoWeatherData(lat, lon)
    const {day, date, temperature, icon, wind, humidity} = handleVariables(cityData.list[0])
    const currentDayHTML = generateCard(day, date, temperature, icon, wind, humidity)
    cardsHTMLArray = []
    cardsHTMLArray.push(currentDayHTML)
    forcastCards(cityData.list)
    setCardContainer(cardsHTMLArray)
}

// first API call to search by city name
async function handleWeatherData() {
    const citySearchURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial&`
    const response = await fetch(citySearchURL)
    const initialCityData = await response.json()
    const lat = initialCityData.city.coord.lat
    const lon = initialCityData.city.coord.lon
    return {lat, lon}
}

// second API call
async function geoWeatherData(lat, lon) {
    const coordSearchURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    const response = await fetch(coordSearchURL)
    const coordCityData = await response.json()
    return coordCityData
}

// Generate forcast cards
function forcastCards(cityList) {
    for (let i = 1; i < 40; i += 8) {
        const {day, date, temperature, icon, wind, humidity} = handleVariables(cityList[i])    
        const currentDayHTML = generateCard(day, date, temperature, icon, wind, humidity)
        cardsHTMLArray.push(currentDayHTML)
    }
}

// Creates a data object
function handleVariables(cityDataObj) {
    const weekday = dayjs(cityDataObj.dt_txt).format('dddd')
    const dtFormat = dayjs(cityDataObj.dt_txt).format('MMM. DD, YYYY')
    const {temp, humidity} = cityDataObj.main
    const {icon} = cityDataObj.weather[0]
    const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`
    const windSpeed = cityDataObj.wind.speed
    const indexWeatherObj = {
        day: weekday,
        date: dtFormat,
        temperature: temp,
        icon: iconURL,
        wind: windSpeed,
        humidity: humidity,
    }
    return indexWeatherObj
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
                <h5 class="card-text">${humidity} %</h5>
            </div>
        </div>
    `
}

// Set current card
function setCardContainer (cardHTMLArray) {
    document.getElementById("cardContainer").innerHTML = cardHTMLArray.join("")
}

// Error Function
function handleError (message) {
    alert(message)
}

// Event Listeners
searchBtnEl.addEventListener ("click", (e)=> handleSubmit(e))