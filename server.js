const express = require('express')
const fetch = require('node-fetch');
const app = express();



app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

require('dotenv').config();
app.set('view engine','ejs');


app.get('/',(req, res)=>{
    const sendData = {location:'Location', country:'CNTRY', temp:'Temp', disc:'Discription', feel:'Feels_Like', humidity:'Humidity', speed:'Speed'}
    // res.sendFile(__dirname +"/index.html");
    res.render("index", {sendData: sendData})
})

app.post('/',async(req, res)=>{
    let location = await req.body.city
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.APIKEY}`;
    const response = await fetch(url);
    const weatherData = await response.json();
        
        /*This comment is for the file index.html*/
    // const temp = Math.floor(weatherData.main.temp);
    // const disc = weatherData.weather[0].description;
    // const icon = weatherData.weather[0].icon;
    // const imageUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    // res.write(`<h1>The current weather in ${location} is ${disc}</h1>`);
    // res.write(`<h1>The current temperature is ${temp} degree celcuis</h1>`);
    // res.write(`<img src='${imageUrl}'>`);

    const sendData = {};
    if (response.status == 200) {      
        sendData.temp = Math.floor(weatherData.main.temp);;
        sendData.disc = weatherData.weather[0].description;
        sendData.location = location;
        sendData.feel = weatherData.main.feels_like;
        sendData.humidity = weatherData.main.humidity;
        sendData.speed = weatherData.wind.speed;
        sendData.country = weatherData.sys.country;
    }else{
        sendData.errorMsg = weatherData;
    }
    res.render("index", {sendData: sendData});

})


app.listen(3000, () => console.log('Server started on port 3000'));