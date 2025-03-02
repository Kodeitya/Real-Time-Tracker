 
const socket = io();

// console.log("Hello World");


if(navigator.geolocation){

    navigator.geolocation.watchPosition((position)=>{
        const {latitude,longitude} = position.coords;
        socket.emit('sendLocation',{latitude,longitude});
    },
    (error)=>{
        console.log(error);
    },
{
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000
});
}


const map = L.map("map").setView([0,0],16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"OpenStreetMap"
}).addTo(map);

const markers = {}

socket.on("receiveLocation",function(data){
    const {id,latitude,longitude} = data;
    map.setView([latitude,longitude],10);

    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }
    else{
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
});


socket.on("user-disconnect",(id)=>{

    map.removeLayer(markers[id]);
    delete markers[id];
})