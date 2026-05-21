// ============================================================
// DETAIL SCREEN COMPLETO CORREGIDO
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Image,
  Platform
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';

import { fetchWeather } from '../services/api';

// ============================================================
// BANDERAS
// ============================================================

function getFlagcdnUrl(countryCode) {

  try {

    const code = countryCode?.toLowerCase();

    if (!code) {
      return 'https://flagcdn.com/w640/un.png';
    }

    return `https://flagcdn.com/w640/${code}.png`;

  } catch (e) {

    return 'https://flagcdn.com/w640/un.png';
  }
}

function FlagImage({ countryCode, style }) {

  const [source, setSource] = useState({
    uri: getFlagcdnUrl(countryCode)
  });

  return (
    <Image
      source={source}
      style={style}
      onError={() =>
        setSource({
          uri: 'https://flagcdn.com/w640/un.png'
        })
      }
    />
  );
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function DetailScreen({ route }) {

  const {
    countryName,
    capital,
    latlng,
    flag,
    languages,
    currency
  } = route.params;

  const [weather, setWeather] = useState(null);

  const [loadingWeather, setLoadingWeather] = useState(true);

  const [weatherError, setWeatherError] = useState(false);

  const latitude =
    latlng && latlng[0] != null
      ? latlng[0]
      : 0;

  const longitude =
    latlng && latlng[1] != null
      ? latlng[1]
      : 0;

  // ============================================================
  // CLIMA
  // ============================================================

  const getWeather = useCallback(async () => {

    try {

      setLoadingWeather(true);
      setWeatherError(false);

      const data = await fetchWeather(capital);

      setWeather(data);

    } catch (err) {

      setWeatherError(true);

    } finally {

      setLoadingWeather(false);
    }

  }, [capital]);

  useEffect(() => {
    getWeather();
  }, [getWeather]);

  // ============================================================
  // GOOGLE MAPS
  // ============================================================

  const openExternalMaps = () => {

    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q='
    });

    const coords = `${latitude},${longitude}`;

    const label = encodeURIComponent(
      `Capital: ${capital}`
    );

    const url = Platform.select({
      ios: `${scheme}${label}@${coords}`,
      android: `${scheme}${coords}(${label})`
    });

    Linking.openURL(url).catch(() => {

      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      );
    });
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* ============================================================
          INFO PAÍS
      ============================================================ */}

      <View style={styles.card}>

        <FlagImage
          countryCode={flag}
          style={styles.bannerFlag}
        />

        <Text style={styles.countryTitle}>
          {countryName}
        </Text>

        <View style={styles.line} />

        <View style={styles.rowInfo}>

          <Text style={styles.labelField}>
            📍 Capital:
          </Text>

          <Text style={styles.valueField}>
            {capital ?? 'No registra'}
          </Text>

        </View>

        <View style={styles.rowInfo}>

          <Text style={styles.labelField}>
            🗣️ Idiomas:
          </Text>

          <Text style={styles.valueField}>
            {languages ?? 'No registra'}
          </Text>

        </View>

        <View style={styles.rowInfo}>

          <Text style={styles.labelField}>
            💵 Moneda:
          </Text>

          <Text style={styles.valueField}>
            {currency ?? 'No registra'}
          </Text>

        </View>

      </View>

      {/* ============================================================
          MAPA
      ============================================================ */}

      <View style={styles.cardMap}>

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 5.0,
            longitudeDelta: 5.0
          }}
        >

          <Marker
            coordinate={{
              latitude,
              longitude
            }}
            title={capital}
            description={`Capital de ${countryName}`}
          />

        </MapView>

        <TouchableOpacity
          style={styles.mapsButton}
          activeOpacity={0.8}
          onPress={openExternalMaps}
        >

          <Text style={styles.mapsButtonText}>
            🗺️ Abrir en Google Maps Externo
          </Text>

        </TouchableOpacity>

      </View>

      {/* ============================================================
          CLIMA
      ============================================================ */}

      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          🌤️ Condiciones Climáticas
        </Text>

        <View style={styles.line} />

        {loadingWeather ? (

          <ActivityIndicator
            size="small"
            color="#6366F1"
            style={{ marginVertical: 10 }}
          />

        ) : weatherError ? (

          <View style={{ alignItems: 'center' }}>

            <Text style={styles.errorText}>
              No se pudieron obtener datos del clima.
            </Text>

            <TouchableOpacity
              style={styles.retryMinButton}
              onPress={getWeather}
            >

              <Text style={styles.retryMinButtonText}>
                Reintentar
              </Text>

            </TouchableOpacity>

          </View>

        ) : weather ? (

          <View style={styles.gridClima}>

            <View style={styles.weatherBox}>

              <Text style={styles.weatherIcon}>
                🌡️
              </Text>

              <Text style={styles.weatherLabel}>
                Temp.
              </Text>

              <Text style={styles.weatherValue}>
                {weather?.main?.temp ?? '--'} °C
              </Text>

            </View>

            <View style={styles.weatherBox}>

              <Text style={styles.weatherIcon}>
                ☁️
              </Text>

              <Text style={styles.weatherLabel}>
                Estado
              </Text>

              <Text style={styles.weatherValueCaps}>
                {weather?.weather?.[0]?.description ?? '--'}
              </Text>

            </View>

            <View style={styles.weatherBox}>

              <Text style={styles.weatherIcon}>
                💧
              </Text>

              <Text style={styles.weatherLabel}>
                Humedad
              </Text>

              <Text style={styles.weatherValue}>
                {weather?.main?.humidity ?? '--'} %
              </Text>

            </View>

            <View style={styles.weatherBox}>

              <Text style={styles.weatherIcon}>
                💨
              </Text>

              <Text style={styles.weatherLabel}>
                Viento
              </Text>

              <Text style={styles.weatherValue}>
                {weather?.wind?.speed ?? '--'} m/s
              </Text>

            </View>

          </View>

        ) : (

          <Text style={styles.infoText}>
            Módulo no disponible.
          </Text>
        )}

      </View>

    </ScrollView>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingTop: 12
  },

  card: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 4
  },

  cardMap: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    marginBottom: 16,
    elevation: 4,
    overflow: 'hidden'
  },

  bannerFlag: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: 'cover'
  },

  countryTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 8
  },

  rowInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
    alignItems: 'flex-start'
  },

  labelField: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    width: '30%'
  },

  valueField: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
    width: '70%',
    textAlign: 'right'
  },

  map: {
    width: '100%',
    height: 220
  },

  mapsButton: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    alignItems: 'center'
  },

  mapsButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC'
  },

  line: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12
  },

  gridClima: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },

  weatherBox: {
    width: '47%',
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 6
  },

  weatherIcon: {
    fontSize: 22,
    marginBottom: 4
  },

  weatherLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    textTransform: 'uppercase'
  },

  weatherValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: 2
  },

  weatherValueCaps: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: 2,
    textAlign: 'center',
    textTransform: 'capitalize'
  },

  errorText: {
    color: '#EF4444',
    marginBottom: 10,
    fontSize: 14,
    textAlign: 'center'
  },

  retryMinButton: {
    backgroundColor: '#334155',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15
  },

  retryMinButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600'
  },

  infoText: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 8
  }
});