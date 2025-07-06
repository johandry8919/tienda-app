import { useState, useCallback } from 'react';

export const useProductos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tasav, setTasa] = useState( 0 );
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    
    const API_URL = 'https://comunajoven.com.ve/api/listar_productos';
    const bcv = 'https://ve.dolarapi.com/v1/dolares';
    const TOKEN = '5c0d5fe9-b3ae-4e09-b754-f7bf8f9023ac';

  
    const fetchProductos = useCallback(async () => {
      try {
        setError(null);
        setRefreshing(true);
        const [productResponse, tasaResponse] = await Promise.all([
          fetch(API_URL, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${TOKEN}`,
              'X-Requested-With': 'XMLHttpRequest'
            }
          }),
          fetch(bcv, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          })
        ]);

        const [BCV, responseText] = await Promise.all([
          tasaResponse.json(),
          productResponse.text()
        ]);


     
        
        setTasa(BCV[0].promedio);
        const cleanedResponse = responseText.trim();
        
        let data = { success: false, data: [] };
        if (cleanedResponse) {
          data = JSON.parse(cleanedResponse);
        }
  
        if (!productResponse.ok || !data.success) {
          throw new Error(data.message || 'Error al obtener los productos');
        }
  
        setProductos(data.data);
      } catch (err) {
        setError(err.message || 'Error de conexión');
        console.error('Error fetching productos:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, []);

    return {
        productos,
        tasav,
        refreshing,
        error,
        TOKEN,
        loading,
        setRefreshing,
        setLoading,
        fetchProductos
    };


    
};



 