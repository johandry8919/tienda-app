import { useState, useCallback } from 'react';


const API_TOKEN = '5c0d5fe9-b3ae-4e09-b754-f7bf8f9023ac';
const API_BASE_URL = 'https://comunajoven.com.ve/api';

export const useProdu_vendido = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
     const [refreshing1, setRefreshing1] = useState(false);

    const produ_vendido = useCallback(async (id , precio) => {
        setError(null);
        setLoading(true);
        setRefreshing1(true);


        try {
            const response = await fetch(
                `${API_BASE_URL}/produ_vendido/?id=${id}&precio=${precio}`, 
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_TOKEN}`,
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                }
            );
        
             
         
                const [responseText] = await Promise.all([
                    response.text()
                    ]);
        
    
        const cleanedResponse = responseText.trim();
        
        let data = { success: false, data: [] };
        if (cleanedResponse) {
          data = JSON.parse(cleanedResponse);
        }



             

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // If you need to process the response data:
            //  const data = await response.json();

            
            // return data;

        } catch (err) {
            setError(err.message || 'Error de conexión');
            console.error('Error in produ_vendido:', err);
            throw err; // Re-throw if you want to handle the error in the component
        } finally {
            setLoading(false);
            setRefreshing1(false)
        }
    }, []); // Added dependencies

    return {
        produ_vendido,
        loading,
        error,
        refreshing1,
        setRefreshing1
    };
};