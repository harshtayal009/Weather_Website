// async function 
async function getweather()
{
    // try catch block
    try {
        let city = document.getElementById("city_input").value;
        let pop=document.getElementById("popup");
        // if condition for if user enter empty input then popup msg show
        if(city.trim()=="")
        {
            pop.style.display="block";
            setTimeout(()=>{
                pop.style.display="none"
            },3000);
        }
        // operweathermap api url
        let url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c07aabbdcff4e34c9266fb1d043ad86c&units=metric`;
        let response = await fetch(url);
        let data = await response.json();//convert into object
        //if city not found error msg show       
        if (data.cod==404)
            {
                showerror("Invalid location! City not found");
                return;
            }     
        console.log(data);
        let cityName = data.name;
        let weatherDesc = data.weather[0].description;
        let humidity = data.main.humidity;
        let windSpeed = data.wind.speed;
        let dateObj = new Date();
        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let dateStr = dateObj.toLocaleDateString(undefined, options);
        document.getElementById("date").innerText = dateStr;
        let pressure = data.main.pressure;
        let iconCode = data.weather[0].icon;
        let temp = data.main.temp; 
        //if temp goes above from 40 then alert msg show
        if (temp > 40) 
        {
            alert("It's too hot outside! Stay hydrated and avoid going out during peak hours.");
        }
        document.getElementById("city_name").innerText = cityName;
        document.getElementById("temp").innerHTML ="Temp<br> "+ temp + "°C";
        document.getElementById("weather_desc").innerText = weatherDesc;
        document.getElementById("imgbox").innerHTML=`<img src=https://openweathermap.org/img/wn/${iconCode}@2x.png>`
        document.getElementById("humidity").innerHTML = "Humidity<br> "+ humidity + "%";
        document.getElementById("wind_speed").innerHTML = "Wind<br> " + windSpeed + " m/s";
        document.getElementById("pressure").innerHTML = "Pressure<br> " + pressure + " hPa";
        document.getElementById("tempcard").classList.add("card");
        document.getElementById("humidity").classList.add("card");
        document.getElementById("wind_speed").classList.add("card");
        document.getElementById("pressure").classList.add("card");
        let status = data.weather[0].main;
        //getForecast fxn use for 5 day forecast weather
        getForecast(city);
        //changeBg fxn use to change bg of body as per weather condition
        changeBg(status);
        //reset fxn use to reset input value
        reset();
        
    } catch (error) {
        console.log('There has been a problem with your fetch operation:', error);
    }    
}   
// this function changes the background image based on the weather status
function changeBg(status) {
    if (status === 'Clouds') {
        document.body.style.backgroundImage = 'url(img/cloud.webp)';
    } else if (status === 'Rain') {
        document.body.style.backgroundImage = 'url(img/rain.webp)';
    } else if (status === 'Clear') {
        document.body.style.backgroundImage = 'url(img/clear.webp)';
    }
    else if (status === 'Snow') {
        document.body.style.backgroundImage = 'url(img/snow.webp)';
    }
    else if (status === 'Sunny') {
        document.body.style.backgroundImage = 'url(img/sunny.webp)';
    } else if (status === 'Thunderstorm') {
        document.body.style.backgroundImage = 'url(img/thunderstrom.webp)';
    } else if (status === 'Drizzle') {
        document.body.style.backgroundImage = 'url(img/drizzle.webp)';
    } else if (status === 'Mist' || status === 'Haze' || status === 'Fog' || status === 'Smoke' || status === 'Dust' || status === 'Sand') {
        document.body.style.backgroundImage = 'url(img/fog.webp)';
    }

    else {
        document.body.style.backgroundImage = 'url(img/bg.jpg)';
    }
}  
// this function resets the input field after fetching the weather data
function reset() {
    let input = document.getElementById('city_input');
    input.value = "";
}  
function showerror(message) 
{
    let errbox=document.getElementById("errorbox");
    errbox.style.display="block";
    errbox.innerText=message;
    setTimeout(() => {
        errbox.style.display="none";
    }, 3000);
}
// This function fetches the 5-day weather forecast for the given city
function getForecast(city)
{
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=c07aabbdcff4e34c9266fb1d043ad86c&units=metric`)
    .then(res => res.json())
    .then(data => {
      console.log(data);

      const castDiv = document.getElementById("castdiv");
      castDiv.innerHTML = ""; // clear previous data

      // Group 40 items by date
      let dailyData = {};

      data.list.forEach(item => {
        let date = item.dt_txt.split(" ")[0]; // "2024-04-24"
        if (!dailyData[date]) {
          dailyData[date] = [];
        }
        dailyData[date].push(item);
      });

      // Now pick 5 days
      let days = Object.keys(dailyData).slice(0, 5);
      let container=document.getElementsByClassName('container')[0];
      let div =document.getElementById("castdiv");
      let head=document.createElement("h2");
      head.innerHTML="5 Day Forecast";
      head.style.cssText=`font:weight:bold;
      font-size:20px;`;
      container.insertBefore(head,div);
      days.forEach(date => {
        // find data close to 12:00:00
        let dayItems = dailyData[date];
        let best = dayItems.find(item => item.dt_txt.includes("12:00:00")) || dayItems[0];

        let icon = best.weather[0].icon;
        let temp = best.main.temp;
        let wind = best.wind.speed;
        let humidity = best.main.humidity;

        let card = `
          <div class="castcard">
            <h4>${date}</h4>
            <img src="https://openweathermap.org/img/wn/${icon}.png" />
            <p>Temp: ${temp}°C</p>
            <p>Wind: ${wind} M/S</p>
            <p>Humidity: ${humidity}%</p>
          </div>
        `;

        castDiv.innerHTML += card;
      });
    })
}