//-----------------UN EVENEMENT POUR LA RECHERCHE DE NOTRE BUTTON-----------------------------------------
document.getElementById('searchButton').addEventListener('click', function() {
    // Récupère la valeur de l'input pour la ville, en retirant les espaces en début et fin
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
      // Si une ville est entrée, appelle la fonction getWeather avec cette ville
      getWeather(city);
    } else {
      // Sinon, affiche un message demandant d'entrer le nom d'une ville
      document.getElementById('weatherResult').innerHTML = '<p>Veuillez entrer le nom d\'une ville.</p>';
    }
  });
  // ---------------------FONCTION QUI NOUS PERMETTRA DE RECUPERER LES DONNEES METEO --------------------------------------------
  function getWeather(city) {
    // entrer notre clé API réelle
    const apiKey = '2da5aff47581a3bf67e75ffb06714208'; 
    // Encode le nom de la ville pour une utilisation sûre dans une URL
    const encodedCity = encodeURIComponent(city);
    // URL pour récupérer les données météo actuelles
    const apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${apiKey}&units=metric&lang=fr`;
    // URL pour récupérer les prévisions météorologiques
    const apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&appid=${apiKey}&units=metric&lang=fr`;
  
    console.log('Fetching current weather data from:', apiUrlCurrent);
  
    // Effectue une requête pour les données météo actuelles
    fetch(apiUrlCurrent)
      .then(response => {
        console.log('Received response for current weather:', response);
        if (!response.ok) {
          // Si la réponse n'est pas OK, affiche un message d'erreur détaillé
          return response.json().then(err => {
            throw new Error(`Erreur lors de la récupération des données météo actuelles: ${err.message}`);
          });
        }
        // Retourne les données JSON si la réponse est OK
        return response.json();
      })
      .then(data => {
        console.log('Current weather data:', data);
        if (data.cod === 200) {
          // Si les données sont récupérées avec succès, affiche les données météo
          displayWeather(data);
          console.log('Fetching weather forecast data from:', apiUrlForecast);
          // Effectue une requête pour les prévisions météo
          return fetch(apiUrlForecast);
        } else {
          // Si le code de réponse n'est pas 200, lance une erreur indiquant que la ville n'a pas été trouvée
          throw new Error('Ville non trouvée.');
        }
      })
      .then(response => {
        console.log('Received response for weather forecast:', response);
        if (!response.ok) {
          // Si la réponse pour les prévisions n'est pas OK, affiche un message d'erreur détaillé
          return response.json().then(err => {
            throw new Error(`Erreur lors de la récupération des prévisions météorologiques: ${err.message}`);
          });
        }
        // Retourne les données JSON des prévisions si la réponse est OK
        return response.json();
      })
      .then(forecastData => {
        console.log('Weather forecast data:', forecastData);
        if (forecastData && forecastData.list) {
          // Si les données de prévisions sont récupérées avec succès, les affiche
          displayForecast(forecastData);
        }
      })
      .catch(error => {
        // En cas d'erreur, affiche le message d'erreur dans la page
        document.getElementById('weatherResult').innerHTML = `<p>${error.message}</p>`;
        console.error('Erreur:', error);
      });
  }
  
  function displayWeather(data) {
    // Crée le HTML pour afficher les données météo actuelles
    const weatherResult = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>Température: ${data.main.temp}°C</p>
      <p>Météo: ${data.weather[0].description}</p>
      <p>Humidité: ${data.main.humidity}%</p>
      <p>Vent: ${data.wind.speed} m/s</p>
    `;
    // Injecte le HTML dans l'élément avec l'id 'weatherResult'
    document.getElementById('weatherResult').innerHTML = weatherResult;
  }
  
  function displayForecast(data) {
    // Initialise le HTML pour afficher les prévisions
    let forecastHTML = '<h3>Prévisions sur 5 jours</h3>';
    // Parcourt les données de prévisions et ajoute des entrées pour chaque période
    data.list.forEach(item => {
      forecastHTML += `
        <div>
          <p>${new Date(item.dt_txt).toLocaleDateString()} ${new Date(item.dt_txt).toLocaleTimeString()}</p>
          <p>Température: ${item.main.temp}°C</p>
          <p>Météo: ${item.weather[0].description}</p>
        </div>
      `;
    });
    // Ajoute le HTML des prévisions au contenu existant de l'élément avec l'id 'weatherResult'
    document.getElementById('weatherResult').innerHTML += forecastHTML;
  }
  