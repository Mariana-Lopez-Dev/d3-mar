const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

export const fetchCountries = async () => {
  const response = await fetch(
    'https://restcountries.com/v3.1/all?fields=name,flags,capital,latlng,languages,currencies,translations,region,cca2'
  );

  if (!response.ok) {
    throw new Error('Error al obtener países');
  }

  return response.json();
};

export const fetchWeather = async (capital) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      capital
    )}&appid=${WEATHER_API_KEY}&units=metric&lang=es`
  );

  if (!response.ok) {
    throw new Error('Error al obtener clima');
  }

  return response.json();
};