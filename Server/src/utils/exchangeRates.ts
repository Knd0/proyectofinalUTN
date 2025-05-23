import axios from 'axios';

const API_KEY = 'cur_live_5jkcaHmfOjUYaYuokyl4Z8NsWFOPibneBtiBIWpX';

export async function getExchangeRate(from: string, to: string): Promise<number> {
  try {
    const url = `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}&base_currency=${from}&currencies=${to}`;

    const response = await axios.get(url);
    // La estructura es: response.data.data[to].value
    const rate = response.data.data[to].value;

    if (!rate) throw new Error('No se encontró la tasa de cambio');

    return rate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw new Error('No se pudo obtener el tipo de cambio');
  }
}
