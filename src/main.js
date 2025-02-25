import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { getImg } from "./js/pixabay-api";
import { ShowGLR } from "./js/render-functions";

const form = document.querySelector(".form");
const input = document.querySelector(".input-search");
const waitMsg = document.querySelector(".wait-msg");
const loadMoreBtn = document.querySelector(".load-more-btn");
let currentPage = 1; 
let searchQuery = ''; 

loadMoreBtn.style.display = 'none';

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  searchQuery = input.value.trim();  

  if (!searchQuery) {
    iziToast.show({
      backgroundColor: 'rgba(239, 64, 64, 1)',
      messageColor: 'rgba(255, 255, 255, 1)',
      position: "topRight",
      title: 'Error',
      titleColor: '#fff',
      message: 'Please enter a search query'
    });
    return;
  }

  waitMsg.innerHTML = 'Loading images... <span class="loader"></span>';


  document.querySelector(".gallery").innerHTML = '';

  currentPage = 1;
  
  try {
    const data = await getImg(searchQuery, currentPage);

    if (data.hits.length === 0) {
      iziToast.show({
        backgroundColor: 'rgba(239, 64, 64, 1)',
        messageColor: 'rgba(255, 255, 255, 1)',
        position: "topRight",
        title: 'Error',
        titleColor: '#fff',
        message: 'No images found, please try another search!'
      });
      return;
    }

    ShowGLR(data.hits);  
    waitMsg.textContent = '';  

    if (data.totalHits > currentPage * 40) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';  
    }

  } catch (error) {
    waitMsg.textContent = 'Oops... something went wrong.';
    console.error(error);
  }
  form.reset();  
});

loadMoreBtn.addEventListener("click", async () => {
 
  waitMsg.innerHTML = 'Loading more images... <span class="loader"></span>';
  
  currentPage += 1; 

  try {
    const data = await getImg(searchQuery, currentPage);
    ShowGLR(data.hits);  
    waitMsg.textContent = ''; 

    if (data.totalHits <= currentPage * 40) {
      loadMoreBtn.style.display = 'none';
      iziToast.show({
        backgroundColor: 'rgba(239, 64, 64, 1)',
        messageColor: 'rgba(255, 255, 255, 1)',
        position: "topRight",
        title: 'End of results',
        titleColor: '#fff',
        message: "We're sorry, but you've reached the end of search results"
      });
    }
    const cardHeight = document.querySelector('.gallery-item').getBoundingClientRect().height;
    window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });

  } catch (error) {
    waitMsg.textContent = 'Oops... something went wrong.';
    console.error(error);
  }
});

