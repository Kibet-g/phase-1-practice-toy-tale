let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  
  // Show and hide form
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch and display toys on page load
  getToys();

  // Add event listener for toy form submission
  const form = document.querySelector('.add-toy-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const toyData = {
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0
    };

    // Submit the new toy
    createNewToy(toyData);

    // Clear the form
    form.reset();
  });
});

// Fetch toys from the API and render them
const getToys = () => {
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => renderToy(toy));
    });
};

// Create new toy and send it to the server
const createNewToy = (toyData) => {
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(toyData)
  })
    .then(response => response.json())
    .then(newToy => {
      renderToy(newToy);  // Render the newly created toy
    });
};

// Render a single toy
const renderToy = (toy) => {
  const toyCollection = document.querySelector('#toy-collection');

  const toyCard = document.createElement('div');
  toyCard.className = 'card';

  const toyName = document.createElement('h2');
  toyName.innerText = toy.name;

  const toyImage = document.createElement('img');
  toyImage.src = toy.image;
  toyImage.className = 'toy-avatar';

  const toyLikes = document.createElement('p');
  toyLikes.innerText = `${toy.likes} Likes`;

  const likeButton = document.createElement('button');
  likeButton.className = 'like-btn';
  likeButton.innerText = 'Like ❤️';
  likeButton.id = toy.id;

  // Event listener to increase likes
  likeButton.addEventListener('click', () => {
    increaseLikes(toy, toyLikes);
  });

  toyCard.append(toyName, toyImage, toyLikes, likeButton);
  toyCollection.appendChild(toyCard);
};

// Increase likes for a toy and update the server
const increaseLikes = (toy, toyLikesElement) => {
  toy.likes += 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ likes: toy.likes })
  })
    .then(response => response.json())
    .then(() => {
      toyLikesElement.innerText = `${toy.likes} Likes`;  // Update likes on the DOM
    });
};
