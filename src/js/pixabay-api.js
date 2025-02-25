import axios from 'axios';

const baseUrl = "https://pixabay.com/api";
const apiKey = '49031681-364093aaa4634c3b7924c5e31'; 

export async function getImg(searchName, page = 1) {
  const params = new URLSearchParams({
    key: apiKey,
    q: searchName,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: 40, 
  });

  try {
    const response = await axios.get(`${baseUrl}?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw new Error('Failed to fetch images');
  }
}
