document.addEventListener("DOMContentLoaded", function () {
  // Select elements
  let items = document.querySelectorAll('.slider .list .item');
  let next = document.getElementById('next');
  let prev = document.getElementById('prev');
  let thumbnails = document.querySelectorAll('.thumbnail .item');
  let searchInput = document.getElementById('searchInput');
  let searchButton = document.getElementById('searchButton');

  let originalSliderItems; // Store the original slider items

  // Fetch data from db.json file
  fetch('db.json')
    .then(response => response.json())
    .then(data => {
      originalSliderItems = data.sliderItems.slice(); // Make a copy of the original slider items
      let sliderItems = originalSliderItems;

      // Update slider items function
      function updateSliderItems(itemsData) {
        items.forEach((item, index) => {
          const sliderItem = itemsData[index];
          item.innerHTML = `
            <img src="${sliderItem.imgSrc}">
            <div class="content">
              <p>design</p>
              <h2>${sliderItem.title}</h2>
              <p>${sliderItem.description}</p>
            </div>
          `;
        });
      }

      // Update thumbnails function
      function updateThumbnails(thumbnailsData) {
        thumbnails.forEach((thumbnail, index) => {
          const sliderItem = thumbnailsData[index];
          thumbnail.innerHTML = `
            <img src="${sliderItem.imgSrc}">
            <div class="content">
              ${sliderItem.title}
            </div>
          `;
        });
      }

      // Initial rendering of slider items and thumbnails
      updateSliderItems(sliderItems);
      updateThumbnails(sliderItems);

      // Function to filter items by title
      function filterItemsByTitle(title) {
        const searchTerm = title.toLowerCase().trim(); // Convert search term to lowercase and trim whitespace
        return originalSliderItems.filter(item => item.title.toLowerCase().includes(searchTerm));
      }

      // Event listener for search button click
      searchButton.addEventListener('click', () => {
        let searchTerm = searchInput.value;
        if (searchTerm) {
          let filteredItems = filterItemsByTitle(searchTerm);
          updateSliderItems(filteredItems);
          updateThumbnails(filteredItems);
        } else {
          // If search term is empty, reset to original slider items
          updateSliderItems(originalSliderItems);
          updateThumbnails(originalSliderItems);
        }
      });
    })
    .catch(error => console.error('Error fetching data:', error));

  // Config params
  let countItem = items.length;
  let itemActive = 0;

  // Event next click
  next.onclick = function () {
    itemActive = itemActive + 1;
    if (itemActive >= countItem) {
      itemActive = 0;
    }
    showSlider();
  }

  // Event prev click
  prev.onclick = function () {
    itemActive = itemActive - 1;
    if (itemActive < 0) {
      itemActive = countItem - 1;
    }
    showSlider();
  }

  // Auto run slider
  let refreshInterval = setInterval(() => {
    next.click();
  }, 5000)

  // Function to show slider
  function showSlider() {
    // Remove item active old
    let itemActiveOld = document.querySelector('.slider .list .item.active');
    let thumbnailActiveOld = document.querySelector('.thumbnail .item.active');
    itemActiveOld.classList.remove('active');
    thumbnailActiveOld.classList.remove('active');

    // Active new item
    items[itemActive].classList.add('active');
    thumbnails[itemActive].classList.add('active');

    // Clear auto time run slider
    clearInterval(refreshInterval);
    refreshInterval = setInterval(() => {
      next.click();
    }, 5000)
  }

  // Click thumbnail
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      itemActive = index;
      showSlider();
    })
  });
});
