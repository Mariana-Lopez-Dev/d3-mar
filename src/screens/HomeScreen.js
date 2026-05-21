import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  ScrollView
} from 'react-native';

import { fetchCountries } from '../services/api';

// ============================================================
// BANDERAS
// ============================================================

function getFlagcdnUrl(countryCode) {
  try {
    const code = countryCode?.toLowerCase();

    if (!code) {
      return 'https://flagcdn.com/w160/un.png';
    }

    return `https://flagcdn.com/w160/${code}.png`;

  } catch (e) {
    return 'https://flagcdn.com/w160/un.png';
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
          uri: 'https://flagcdn.com/w160/un.png'
        })
      }
    />
  );
}

export default function HomeScreen({ navigation }) {

  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState('');
  const [continenteActivo, setContinenteActivo] = useState('Todos');

  const continentes = [
    'Todos',
    'Americas',
    'Europe',
    'Asia',
    'Africa',
    'Oceania'
  ];

  const nombreContinenteES = (cont) => {
    const nombres = {
      Todos: '🌍 Todos',
      Americas: '🏔️ América',
      Europe: '🏰 Europa',
      Asia: '⛩️ Asia',
      Africa: '🦁 África',
      Oceania: '🏄 Oceanía'
    };

    return nombres[cont] || cont;
  };

  const traducirIdioma = (idiomaIngles) => {
    const diccionario = {
      Spanish: 'Español',
      English: 'Inglés',
      French: 'Francés',
      German: 'Alemán',
      Portuguese: 'Portugués',
      Italian: 'Italiano',
      Dutch: 'Holandés',
      Russian: 'Ruso',
      Chinese: 'Chino',
      Arabic: 'Árabe',
      Japanese: 'Japonés',
      Korean: 'Coreano',
      Swedish: 'Sueco',
      Greek: 'Griego',
      Turkish: 'Turco',
      Hebrew: 'Hebreo'
    };

    return diccionario[idiomaIngles] || idiomaIngles;
  };

  const traducirMoneda = (monedaIngles) => {
    const diccionario = {
      'United States dollar': 'Dólar estadounidense',
      Euro: 'Euro',
      'Pound sterling': 'Libra esterlina',
      'Canadian dollar': 'Dólar canadiense',
      'Australian dollar': 'Dólar australiano',
      'Swiss franc': 'Franco suizo',
      'Japanese yen': 'Yen japonés',
      'Chinese yuan': 'Yuan chino',
      'Mexican peso': 'Peso mexicano',
      'Argentine peso': 'Peso argentino',
      'Brazilian real': 'Real brasileño',
      'Colombian peso': 'Peso colombiano',
      'New Zealand dollar': 'Dólar neozelandés'
    };

    return diccionario[monedaIngles] || monedaIngles;
  };

  const getCountries = async () => {

    try {

      setLoading(true);
      setError(false);

      const data = await fetchCountries();

      const countriesFiltrados = data.filter(country =>
        country.capital &&
        country.capital.length > 0 &&
        country.cca2 &&
        country.name?.common !== 'Antarctica'
      );

      const sortedData = countriesFiltrados.sort((a, b) => {

        const nameA =
          a.translations?.spa?.common ||
          a.name.common;

        const nameB =
          b.translations?.spa?.common ||
          b.name.common;

        return nameA.localeCompare(nameB);
      });

      setCountries(sortedData);
      setFilteredCountries(sortedData);

    } catch (err) {

      setError(true);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    getCountries();
  }, []);

  const aplicarFiltros = (textoBusqueda, continente) => {

    setSearch(textoBusqueda);

    let resultado = countries;

    if (continente !== 'Todos') {
      resultado = resultado.filter(
        c => c.region === continente
      );
    }

    if (textoBusqueda.trim() !== '') {

      resultado = resultado.filter(c => {

        const nombreES = (
          c.translations?.spa?.common ||
          c.name.common
        ).toLowerCase();

        return nombreES.includes(
          textoBusqueda.toLowerCase()
        );
      });
    }

    setFilteredCountries(resultado);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#6366F1"
        />

        <Text style={styles.loadingText}>
          Iniciando sistemas de navegación...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>

        <Text style={styles.errorIcon}>📡</Text>

        <Text style={styles.errorText}>
          Fallo en la conexión orbital.
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={getCountries}
        >
          <Text style={styles.retryButtonText}>
            Reintentar enlace
          </Text>
        </TouchableOpacity>

      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.bannerContainer}>

        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=600&auto=format&fit=crop'
          }}
          style={styles.bannerImage}
        />

        <View style={styles.bannerOverlay}>

          <Text style={styles.bannerTitle}>
            PLANETA TIERRA
          </Text>

          <Text style={styles.bannerSubtitle}>
            Sistema de exploración de países y clima- Mariana López 
          </Text>

        </View>
      </View>

      <View style={styles.searchSection}>

        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Buscar destino o territorio..."
          placeholderTextColor="#64748B"
          value={search}
          onChangeText={(text) =>
            aplicarFiltros(text, continenteActivo)
          }
        />
      </View>

      <View style={styles.scrollContinentesContainer}>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollContinentes}
        >

          {continentes.map((cont) => (

            <TouchableOpacity
              key={cont}
              style={[
                styles.chip,
                continenteActivo === cont &&
                styles.chipActivo
              ]}
              onPress={() => {
                setContinenteActivo(cont);
                aplicarFiltros(search, cont);
              }}
            >

              <Text
                style={[
                  styles.chipText,
                  continenteActivo === cont &&
                  styles.chipTextActivo
                ]}
              >
                {nombreContinenteES(cont)}
              </Text>

            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredCountries}
        keyExtractor={(item) => item.name.common}
        showsVerticalScrollIndicator={false}

        ListEmptyComponent={
          <Text style={styles.emptyText}>
            🛸 Ningún cuadrante coincide con la búsqueda.
          </Text>
        }

        renderItem={({ item }) => {

          const nombreEnEspanol =
            item.translations?.spa?.common ||
            item.name.common;

          const listaIdiomas = item.languages
            ? Object.values(item.languages)
                .map(traducirIdioma)
                .join(', ')
            : 'No registra';

          let textoMoneda = 'No registra';

          if (item.currencies) {

            const infoMoneda =
              Object.values(item.currencies)[0];

            textoMoneda =
              `${traducirMoneda(infoMoneda.name)} ${
                infoMoneda.symbol
                  ? `(${infoMoneda.symbol})`
                  : ''
              }`;
          }

          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('Detail', {
                  countryName: nombreEnEspanol,
                  capital: item.capital[0],
                  latlng: item.latlng,
                  flag: item.cca2,
                  languages: listaIdiomas,
                  currency: textoMoneda
                })
              }
            >

              <FlagImage
                countryCode={item.cca2}
                style={styles.flag}
              />

              <View style={styles.infoContainer}>

                <Text style={styles.countryName}>
                  {nombreEnEspanol}
                </Text>

                <Text style={styles.countrySubtitle}>
                  Sede: {item.capital[0]}
                </Text>

              </View>

              <Text style={styles.arrow}>➔</Text>

            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D1A',
    paddingHorizontal: 16
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#090D1A'
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6366F1',
    fontWeight: '600',
    letterSpacing: 1
  },

  errorIcon: {
    fontSize: 40,
    marginBottom: 10
  },

  errorText: {
    color: '#94A3B8',
    marginBottom: 20,
    fontSize: 15,
    textAlign: 'center'
  },

  retryButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25
  },

  retryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15
  },

  bannerContainer: {
    height: 130,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 15,
    marginBottom: 15,
    position: 'relative'
  },

  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },

  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9,13,26,0.65)',
    justifyContent: 'center',
    paddingLeft: 20
  },

  bannerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#6366F1',
    letterSpacing: 3
  },

  bannerSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '500'
  },

  searchSection: {
    marginBottom: 12
  },

  searchInput: {
    backgroundColor: '#151D33',
    color: '#F8FAFC',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#223054',
    fontWeight: '500'
  },

  scrollContinentesContainer: {
    height: 45,
    marginBottom: 15
  },

  scrollContinentes: {
    flexDirection: 'row'
  },

  chip: {
    backgroundColor: '#151D33',
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#223054'
  },

  chipActivo: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1'
  },

  chipText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600'
  },

  chipTextActivo: {
    color: '#FFF',
    fontWeight: '700'
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#111A30',
    padding: 16,
    marginVertical: 6,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E2C4F'
  },

  flag: {
    width: 55,
    height: 38,
    borderRadius: 6,
    marginRight: 16,
    resizeMode: 'cover'
  },

  infoContainer: {
    flex: 1
  },

  countryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC'
  },

  countrySubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3
  },

  arrow: {
    fontSize: 16,
    color: '#6366F1',
    paddingRight: 4
  },

  emptyText: {
    color: '#64748B',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 15,
    fontWeight: '500'
  }
});