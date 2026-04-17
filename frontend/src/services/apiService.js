import axios from 'axios';
import { ENTERPRISE_CONFIG } from '../config/enterpriseKeys';

/**
 * SERVICE: Real-World Environment Risk (Air Quality Index)
 */
export const fetchLiveRealWorldData = async (city = "New Delhi") => {
    try {
        // Step 1: Get Lat/Lon for the city
        const geoRes = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${ENTERPRISE_CONFIG.OPENWEATHER_KEY}`);
        if (!geoRes.data || geoRes.data.length === 0) return null;
        
        const { lat, lon } = geoRes.data[0];
        
        // Step 2: Get Air Pollution Data (PM2.5, NO2, etc.)
        const pollRes = await axios.get(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${ENTERPRISE_CONFIG.OPENWEATHER_KEY}`);
        
        return {
            city,
            aqi: pollRes.data.list[0].main.aqi, // 1=Good, 5=Very Poor
            components: pollRes.data.list[0].components,
            updatedAt: new Date().toISOString()
        };
    } catch (err) {
        console.error("Weather Service Error:", err);
        return null;
    }
};

/**
 * SERVICE: WhatsApp Meta Cloud OTP
 */
export const sendWhatsAppOTP = async (recipientNumber, otpCode) => {
    const url = `https://graph.facebook.com/v17.0/${ENTERPRISE_CONFIG.WHATSAPP.PHONE_NUMBER_ID}/messages`;
    
    // Formatting recipient number (ensure it starts with +91 or required country code)
    const formattedNumber = recipientNumber.startsWith('+') ? recipientNumber.substring(1) : recipientNumber;

    try {
        const response = await axios.post(url, {
            messaging_product: "whatsapp",
            to: formattedNumber,
            type: "template",
            template: {
                name: "hello_world", // Using the default 'hello_world' template for demo if no custom template exists
                language: { code: "en_US" }
            }
        }, {
            headers: {
                'Authorization': `Bearer ${ENTERPRISE_CONFIG.WHATSAPP.ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log("WhatsApp message initiated:", response.data);
        return response.data;
    } catch (err) {
        console.error("WhatsApp Service Error:", err.response?.data || err.message);
        
        // Fallback: If it's a template error, send it as a regular message (requires 24h window or special permissions)
        try {
            const textResponse = await axios.post(url, {
                messaging_product: "whatsapp",
                to: formattedNumber,
                type: "text",
                text: { body: `[Priocardix AI] Your unique 6-digit access code is: ${otpCode}. Valid for 10 minutes.` }
            }, {
                headers: {
                    'Authorization': `Bearer ${ENTERPRISE_CONFIG.WHATSAPP.ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });
            return textResponse.data;
        } catch (innerErr) {
            const errorReason = innerErr.response?.data?.error?.message || innerErr.message;
            console.error("WhatsApp Fallback failed:", errorReason);
            throw new Error(errorReason);
        }
    }
};
