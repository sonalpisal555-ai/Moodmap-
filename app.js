// map start

const map=L.map("map").setView([20,0],2);

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{maxZoom:19}
).addTo(map);


// mood stats

const stats={
Happy:0,
Sad:0,
Angry:0,
Excited:0,
Love:0,
Stressed:0,
Calm:0
};


// monthly stats

const monthlyStats={
Jan:0,
Feb:0,
Mar:0,
Apr:0,
May:0,
Jun:0
};


// city stats

const cityStats={};


// emoji function

function getEmoji(mood){

switch(mood){

case "Happy": return "😊";
case "Sad": return "😢";
case "Angry": return "😡";
case "Excited": return "🤩";
case "Love": return "❤️";
case "Stressed": return "😰";
case "Calm": return "😌";

default: return "🙂";

}

}


// share mood

function shareMood(){

const name=document.getElementById("name").value || "Anonymous";

const mood=document.getElementById("mood").value;

const reason=document.getElementById("reason").value || "No reason";


navigator.geolocation.getCurrentPosition(function(pos){

const lat=pos.coords.latitude;
const lng=pos.coords.longitude;

addMarker(name,mood,reason,lat,lng);

updateStats(mood);

updateMonthly();

detectCity(lat,lng);

map.setView([lat,lng],4);

});

}


// marker

function addMarker(name,mood,reason,lat,lng){

const emoji=getEmoji(mood);

const icon=L.divIcon({

html:"<div style='font-size:30px'>"+emoji+"</div>",

className:"",

iconSize:[30,30]

});

const marker=L.marker([lat,lng],{icon:icon}).addTo(map);

marker.bindPopup(

"<b>"+name+"</b><br>"+emoji+" "+mood+"<br>Reason: "+reason

);

}


// update stats

function updateStats(mood){

stats[mood]++;

document.getElementById(mood).innerText=stats[mood];

}


// monthly update

function updateMonthly(){

const month=new Date().getMonth();

const months=["Jan","Feb","Mar","Apr","May","Jun"];

if(month<6){

monthlyStats[months[month]]++;

}

updateChart();

}


// detect city

function detectCity(lat,lng){

fetch(
"https://nominatim.openstreetmap.org/reverse?format=json&lat="+lat+"&lon="+lng
)

.then(res=>res.json())

.then(data=>{

let city="Unknown";

if(data.address){

city=
data.address.city||
data.address.town||
data.address.village||
data.address.state||
"Unknown";

}

updateCity(city);

});

}


// update city

function updateCity(city){

if(!cityStats[city]) cityStats[city]=0;

cityStats[city]++;

showCities();

}


// show top cities

function showCities(){

const sorted=Object.entries(cityStats)
.sort((a,b)=>b[1]-a[1]);

let html="";

sorted.slice(0,10).forEach(c=>{

html+="<div>"+c[0]+" ("+c[1]+")</div>";

});

document.getElementById("cities").innerHTML=html;

}


// chart

const ctx=document.getElementById("moodChart");

const moodChart=new Chart(ctx,{

type:"line",

data:{

labels:Object.keys(monthlyStats),

datasets:[{

label:"Mood Activity",

data:Object.values(monthlyStats),

borderWidth:3

}]

}

});


// update chart

function updateChart(){

moodChart.data.datasets[0].data=
Object.values(monthlyStats);

moodChart.update();

}
