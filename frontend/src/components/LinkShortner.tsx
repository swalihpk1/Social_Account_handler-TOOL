
import axios from 'axios';

const API_KEY = '7c1ee9b67d78d2cf153ca95629ee06198b32b06a'

const shortenUrl = async (url: string) => {
    try {
        const response = await axios.post(
            'https://api-ssl.bitly.com/v4/shorten',
            {
                long_url: url
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.link;
    } catch (error) {
        console.error('Error shortening URL:', error);
        return url;
    }
};

export default shortenUrl