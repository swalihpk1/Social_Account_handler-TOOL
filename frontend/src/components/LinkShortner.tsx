
import axios from 'axios';

const API_KEY = 'a0fbb49d0708cc6deb7b0025d496cd48e791556e'

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
    }
};
export default shortenUrl
