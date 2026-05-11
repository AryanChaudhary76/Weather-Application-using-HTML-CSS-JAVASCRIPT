const yourweather=document.querySelector('[your-weather]');
 const searchweather=document.querySelector('[search-weather]');
  const weathercontainer=document.querySelector('.weather-container');
const grantlocation=document.querySelector('.grant-location')

const searchform=document.querySelector('[data-searchform]')
const loadingscreen=document.querySelector('.loading-container')
const showweather=document.querySelector('.user-info-container')
//initiall variables???
let currentTab=yourweather;
const API_KEY='79e2fe4528a74049234020fceedd431e';
currentTab.classList.add('current-tab')
getfromsessionStorage();

yourweather.addEventListener('click',function(){
    switchtab(yourweather);
});
searchweather.addEventListener('click',function(){
    switchtab(searchweather)
});
function switchtab(clickedtab){
    if(clickedtab!=currentTab){
        currentTab.classList.remove('current-tab')
         currentTab=clickedtab;
         currentTab.classList.add('current-tab');
         if(!searchform.classList.contains("active")){
            showweather.classList.remove("active");
             grantlocation.classList.remove("active")
            searchform.classList.add("active")

         }
       else{
            
           
            showweather.classList.remove('active');
            searchform.classList.remove('active')
          
            //now to check whether we have saved the the coordinates earlier and granted the location or not 
            getfromsessionStorage();        
         }
    }
}
function getfromsessionStorage(){
    const localcoords=sessionStorage.getItem('user-coordinates')
    if(!localcoords){
        grantlocation.classList.add('active')
    }
    else{
         const cordinates=JSON.parse(localcoords);
         fetchuserweatherinfo(cordinates);
    }
     
} 
 async  function fetchuserweatherinfo(usercordinates){
    const {lat,lon}=usercordinates;
    grantlocation.classList.remove('active')
    //loadingscreeen 
    loadingscreen.classList.add('active')
    //apicall
    try {
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        const weatherinformation= await response.json();
        loadingscreen.classList.remove('active')
        showweather.classList.add('active')
        showweatherinformation(weatherinformation);

        
    } 
    catch (error) {
        
    }


}
function showweatherinformation(weatherinformation){
    //fetching elements 
    const cityName=document.querySelector('[data-cityName]');
    const countryIcon=document.querySelector('[data-country-icon]') 
    const descriptionn=document.querySelector('[data-weatherdescription]');
    const weatherIcon=document.querySelector('[data-weathericon]');
    const temperature=document.querySelector('[data-temperature]');
    const windspeed=document.querySelector('[data-windspeed]');
    const humidity=document.querySelector('[data-humidity]');
    const cloudiness=document.querySelector('[data-cloud]');

    //filling information in ui
    cityName.innerText=weatherinformation?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherinformation?.sys?.country.toLowerCase()}.png`;
    descriptionn.innerText=weatherinformation?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherinformation?.weather?.[0]?.icon}.png`;
    temperature.innerText=weatherinformation?.main?.temp;
    windspeed.innerText=`${weatherinformation?.wind?.speed}m/s`;
    humidity.innerText=`${weatherinformation?.main?.humidity}%` ;
    cloudiness.innerText=`${weatherinformation?.clouds?.all}%` ;  
} 
 const grantaccess=document.querySelector('[data-grantaccess]');
 grantaccess.addEventListener('click',getlocation);

 function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition)

    }
    else{
        alert('no geolocation access available on this browser');
    }
 }
 function showposition(position){
    const usercordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem('user-coordinates',JSON.stringify(usercordinates));
    fetchuserweatherinfo(usercordinates)

 }
 let searchinput=document.querySelector('[data-searchinput]');
 
 searchform.addEventListener('submit',function(event){
    event.preventDefault();
    if(searchinput.value===''){
        return;
    }
    searchweatherinfo(searchinput.value);

 });
 async function searchweatherinfo(cityname){
    loadingscreen.classList.add('active');
    showweather.classList.remove('active');
    grantlocation.classList.remove('active');
    console.log('hogya')
    try {
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_KEY}`);
        const weatherinformation=await response.json();
        loadingscreen.classList.remove('active');
        showweather.classList.add('active');
        showweatherinformation(weatherinformation);
        
    } catch (error) {
        alert('error agya apni ma chudao ab')
        
    }
  

  }




