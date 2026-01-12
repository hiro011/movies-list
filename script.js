document.addEventListener("DOMContentLoaded", function () {
    const addMovieBtn = document.getElementById("add-movie-btn");
    const movieNameInput = document.getElementById("movie-name");
    const movieLinkInput = document.getElementById("movie-link");
    const movieCategorySelect = document.getElementById("movie-category");
    const toggleFormBtn = document.getElementById("toggle-form-btn");
    const addMovieForm = document.getElementById("add-movie");
	const imageUpload = document.getElementById('imageUpload');
    const previewImage = document.getElementById('previewAddImage');
	
	const closeFormButton = document.querySelectorAll('.close-btn'); 

    const editMovieForm = document.getElementById("edit-movie");
	const editMovieBtn = document.getElementById('edit-movie-btn');
    const editNameInput = document.getElementById('edit-name');
    const editLinkInput = document.getElementById('edit-link');
    const editImageUpload = document.getElementById('editImageUpload');
    const previewEditImage = document.getElementById('previewEditImage');
    const toggleEditForm = document.querySelectorAll(".edit-btn");

    const goTopBtn = document.getElementById("go-top-btn");
	const refreshBtn = document.getElementById("refresh-btn");
    const searchInput = document.getElementById("search-input");
	const overlay = document.getElementById('overlay');
	
	const MovieImgForm = document.getElementById('show-movie');
	const showMovieImg = document.querySelectorAll('.show-image'); 

	const exportMovieForm = document.getElementById("export-movie");
	const deleteMovieForm = document.getElementById("delete-movie");
    const deleteButton = document.getElementById("delete-b"); 
	const headerBg = document.querySelector("header");


	// Create hidden file input for JSON import
	const importInput = document.createElement('input');
	importInput.type = 'file';
	importInput.accept = '.json';
	importInput.style.display = 'none';
	document.body.appendChild(importInput);

	// Import button event listener
	document.getElementById('import-btn').addEventListener('click', () => {
	  importInput.click();
	});
	
	// Handle file selection
	importInput.addEventListener('change', (event) => {
	  const file = event.target.files[0];
	  if (!file) return;

	  const reader = new FileReader();
	  reader.onload = (e) => {
		try {
		  const importedMovies = JSON.parse(e.target.result);
		  let movies = JSON.parse(localStorage.getItem('movies')) || [];

		  // Merge imported movies, avoiding duplicates by ID
		  importedMovies.forEach((importedMovie) => {
			const existingIndex = movies.findIndex((movie) => movie.id === importedMovie.id);
			if (existingIndex > -1) {
			  // Update existing movie
			  movies[existingIndex] = importedMovie;
			} else {
			  // Add new movie
			  movies.push(importedMovie);
			}
			// Add to UI
			addMovieToList(
			  importedMovie.id,
			  importedMovie.imgPath,
			  importedMovie.name,
			  importedMovie.link,
			  importedMovie.category
			);
		  });

		  // Save merged movies to localStorage
		  localStorage.setItem('movies', JSON.stringify(movies));

		  // Update movie ID counter
		  const maxId = Math.max(...movies.map((movie) => movie.id), 5);
		  localStorage.setItem('movieId', maxId + 1);

		  // Update UI counts
		  updateMovieCounts();

		  // Reset file input
		  importInput.value = '';
		} catch (error) {
		  alert('Error importing JSON: Invalid file format');
		  console.error(error);
		}
	  };
	  reader.readAsText(file);
	});
	
	// show export popup
	document.getElementById('export-btn').addEventListener('click', () => {
		exportMovieForm.style.display = 'block';
		overlay.style.display = 'block';
		document.getElementById("export-b").focus();
		document.body.classList.add('overlay-active'); 
	});
	//hide export popup
	document.getElementById('cancel-e').addEventListener('click', () => {
		hideForms();
	});
	
	// export the data
	document.getElementById('export-b').addEventListener('click', () => {
	  const movies = JSON.parse(localStorage.getItem('movies')) || [];
	  const jsonStr = JSON.stringify(movies, null, 2);
	  const blob = new Blob([jsonStr], { type: 'application/json' });
	  const url = URL.createObjectURL(blob);
	  const a = document.createElement('a');
	  a.href = url;
	  a.download = 'movies-list.json';
	  a.click();
	  URL.revokeObjectURL(url);
	  hideForms();
	});

    // Track currently editing movie
	let currentEditingMovie = null;
    
    loadMovies(); // Load saved movies/ Initialize
	updateMovieCounts(); // Call this after loading movies

	// Load images 
	navImageInit();
	function navImageInit() {
		const settings = JSON.parse(localStorage.getItem("settings_movie")) || {};
		const bg = settings.navBg || "images/background-img5.png";
		headerBg.style.backgroundImage = `url("${bg}")`;
	}
	
	// initialise the theme
	themeInit();
	function themeInit(){
	  const settings = JSON.parse(localStorage.getItem("settings_movie")) || {};
	  const themeValue = settings.theme || "purple";
	  
	  const body = document.getElementById('main-body');
	  
	  // Remove any existing theme classes
	  body.classList.remove('theme-green', 'theme-dark', 'theme-orange', 'theme-blue');
	  
	  if (themeValue === 'purple') {
		body.classList.remove('theme-green', 'theme-dark', 'theme-orange', 'theme-blue');
	  }
	  
	  // Add the selected theme
	  if (themeValue === 'green') {
		body.classList.add('theme-green');
	  } else if (themeValue === 'dark') {
		body.classList.add('theme-dark');
	  } else if (themeValue === 'orange') {
		body.classList.add('theme-orange');
	  }else if (themeValue === 'blue') {
		body.classList.add('theme-blue');
	  }else if (themeValue === 'red') {
		body.classList.add('theme-red');
	  }
	}
	
	// Show delete popup form 
	function showDeletePopup() {
		deleteMovieForm.style.display = 'block';
		overlay.style.display = 'block';
		document.getElementById("delete-b").focus();
		document.body.classList.add('overlay-active'); 
	};
	
	// Show add popup form 
	toggleFormBtn.addEventListener('click', () => {
		addMovieForm.style.display = 'block';
		overlay.style.display = 'block';
		movieNameInput.focus();
		document.body.classList.add('overlay-active'); 
	});

	// show movie popup images
    function openImgPopup(imageSrc) {
		document.getElementById('previewMovieImage').src = imageSrc;
		MovieImgForm.style.display = 'block';
		overlay.style.display = 'block';
		document.body.classList.add('overlay-active');
    }
	
	showMovieImg.forEach(img => {
		img.addEventListener('click', function() {
            openImgPopup(this.src);
        });
    });

    // Close the popup form 
    closeFormButton.forEach(button => {
        button.addEventListener('click', hideForms);  
    });
    overlay.addEventListener('click', () => { hideForms(); });
	
	function hideForms() {
        addMovieForm.style.display = 'none';
        editMovieForm.style.display = 'none';
		exportMovieForm.style.display = 'none';
		deleteMovieForm.style.display = 'none';
		MovieImgForm.style.display = 'none';
        overlay.style.display = 'none';
		document.body.classList.remove('overlay-active');
		
		editNameInput.value = '';
        editLinkInput.value = '';
        editImageUpload.value = '';
		previewEditImage.src = '';

        currentEditMovie = null;
    }
	
	function getRelativePath(fullPath) {
		const index = fullPath.indexOf('images/');
		return index !== -1 ? fullPath.substring(index) : fullPath;
	}


	// Load stored image on page load
    document.addEventListener('DOMContentLoaded', function() {
        const storedImage = localStorage.getItem('uploadedImage');
        if (storedImage) {
            previewImage.src = storedImage;
        }
    });
		
	document.addEventListener('keydown', function(event) {
		if (event.key === 'Escape') {
			hideForms(); 
		}
	});

    // image preview
    imageUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
              previewImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            previewImage.src = ""; // Clear preview if no file selected
        }
    });
	
	editImageUpload.addEventListener('change', function(event) {
         const file = event.target.files[0];
         if (file) {
             const reader = new FileReader();
             reader.onload = function(e) {
                 previewEditImage.src = e.target.result;
             };
             reader.readAsDataURL(file);
         } else {
             // reset to the original image if file input cleared
             if (currentEditingMovie) {
                 previewEditImage.src = currentEditingMovie.imgPath;
             } else {
                 previewEditImage.src = "";
             }
         }
     });
	
	// search filtering function  
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const allMovieItems = document.querySelectorAll(".movie-list li"); 

        allMovieItems.forEach(movieLi => {
            // Make sure the movieLi has the dataset attribute
            const movieName = movieLi.dataset.movieName ? movieLi.dataset.movieName.toLowerCase() : '';

            // Check if the movie name includes the search term
            const isMatch = movieName.includes(searchTerm);

            // Show or hide the list item based on match
            movieLi.style.display = isMatch ? 'flex' : 'none';
        });
    }

    // search input event listener
    searchInput.addEventListener("input", handleSearch); // triggers on any change
	
	document.getElementById("clear-search").addEventListener("click", function () {
		searchInput.value = '';
		handleSearch();
	});
	refreshBtn.addEventListener("click", function () {
		// Refresh the page
		location.reload();
	});
	
    goTopBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener("scroll", function () {
		const navBar = document.getElementById("nav-bar");
		const settings = JSON.parse(localStorage.getItem("settings_movie")) || {};
		const bg = settings.navBg || "images/background-img5.png";
		
        if (window.scrollY > 250) {
            goTopBtn.style.display = "block";
        } else {
            goTopBtn.style.display = "none";
        } 
		
		if (window.scrollY > 130) {
			navBar.style.position = "fixed";
			navBar.style.backgroundImage = `url("${bg}")`;
        } else {
			navBar.style.position = "static";
			navBar.style.backgroundImage = "none";
        }
    });
 
	// Function to handle Enter key submission
	function handleEnterKey(event, button) {
		if (event.key === "Enter") {
			event.preventDefault(); // Prevent form submission (if in a form)
			button.click(); // Trigger the respective button's click event
		}
	}
	
	// Attach event listeners to input fields in the "Add Movie" form
	movieNameInput.addEventListener("keydown", function(event) {
		handleEnterKey(event, addMovieBtn);
	});
	movieLinkInput.addEventListener("keydown", function(event) {
		handleEnterKey(event, addMovieBtn);
	});

	// Attach event listeners to input fields in the "Edit Movie" form
	editNameInput.addEventListener("keydown", function(event) {
		handleEnterKey(event, editMovieBtn);
	});
	editLinkInput.addEventListener("keydown", function(event) {
		handleEnterKey(event, editMovieBtn);
	});

	// Add movie event
	addMovieBtn.addEventListener("click", function () {
		const name = movieNameInput.value.trim();
		let link = movieLinkInput.value.trim();
		const category = movieCategorySelect.value;
		const reader = new FileReader();
		const file = imageUpload.files[0];
		const settings = JSON.parse(localStorage.getItem("settings_movie")) || {};
		const defImage = settings.defImg || "images/default-movie.jpg";
		const defLnk = settings.defLink || "https://ww1.goojara.to/";
		
		if (name === "") {
			alert("Please enter a movie name!");
			return;
		}
		
		if (link === "") {
			link = defLnk;
		}
		
		// Ensure movieId is unique and persistent
		let movieId = localStorage.getItem("movieId") ? Number(localStorage.getItem("movieId")) : 5;
		
		// Instead of storing Base64, save the file path or filename
		let imgPath = file ? `images/${file.name}` : defImage;
		
		addMovieToList(movieId, imgPath, name, link, category);
		saveMovie(movieId, imgPath, name, link, category);

		// Increment and store new movieId
		movieId++;
		localStorage.setItem("movieId", movieId);
		updateMovieCounts();
		
		// Reset form fields
		movieNameInput.value = "";
		movieLinkInput.value = "";
		addMovieForm.style.display = 'none';
		overlay.style.display = 'none';
		previewImage.src = "";
		imageUpload.value = '';
		document.body.classList.remove('overlay-active'); 
	});

    function addMovieToList(id, imgPath, name, link, category) {
        const list = document.querySelector(`#${category} .movie-list`);
        const li = document.createElement("li");
		
		li.dataset.movieId = id; // Store the movie ID
		li.dataset.movieName = name; // Keep movie name
        li.dataset.movieCategory = category;

		li.innerHTML = `
			<div class="movie-image">
				<img class="show-image" src="${imgPath}" alt="${name}">
			</div>
			<div class="movie-names">
				<a href="${link}" target="_blank">${name}</a>
			</div>
			
			<div class="movie-btn">
				<select class="move-dropdown">
					<option value="">Move to...</option>
					<option value="watching">Watching</option>
					<option value="plan-to">Plan To</option>
					<option value="on-hold">On Hold</option>
					<option value="maybe">Maybe</option>
					<option value="watched">Watched</option>
				</select>
				<button class="edit-btn">✏️</button>
				<button class="delete-btn">🗑</button>
			</div>
			`;
		   
		list.prepend(li);  // Adds the new movie at the start of the list

        // Attach event listener for image popup to the newly created image
        const movieImage = li.querySelector('.movie-image img');
		const movieNameToShow = li.querySelector('.movie-names a').textContent;
		const movieNameText = document.querySelector('#show-movie h2');

        if (movieImage) {
            movieImage.addEventListener('click', function() {

			if (movieNameText) { // Check if the element exists
				movieNameText.textContent = movieNameToShow;
			} else {
				console.error("Popup heading element '#delete-movie h3' not found!");
			}
                openImgPopup(this.src);
            });
        }
		
		// move dropdown listener
        li.querySelector(".move-dropdown").addEventListener("change", function (e) {
            const newCategory = e.target.value;
			if (newCategory) {
                removeMovie(id);
                addMovieToList(id, imgPath, name, link, newCategory);
                saveMovie(id, imgPath, name, link, newCategory);
                li.remove();
				updateMovieCounts(); // Update counts after moving
            }
			e.target.value = "";
        });
		
		// Edit movie 
		li.querySelector(".edit-btn").addEventListener("click", function() {
            const currentId = li.dataset.movieId; 
            const currentName = li.querySelector('.movie-names a').textContent; 
            const currentLink = li.querySelector('.movie-names a').href;
            const currentImgPath = li.querySelector('.movie-image img').src;
            const currentCategory = li.dataset.movieCategory; 
			
			currentEditingMovie = {
                id: currentId,
                imgPath: currentImgPath,
                name: currentName,
                link: currentLink,
                category: currentCategory 
            };
			
            // Populate edit form with current values
            editNameInput.value = currentName;
            editLinkInput.value = currentLink;
            previewEditImage.src = currentImgPath;
			editImageUpload.value = '';

            // Show edit form
            editMovieForm.style.display = 'block';
            overlay.style.display = 'block';
			editNameInput.focus();
			document.body.classList.add('overlay-active');
        });
		
		// Delete movie		
        li.querySelector(".delete-btn").addEventListener("click", function () {
			const movieNameToDelete = li.querySelector('.movie-names a').textContent;
			const popupHeading = document.querySelector('#delete-movie h3');

			if (popupHeading) { // Check if the element exists
				popupHeading.textContent = `Are you sure you want to delete "${movieNameToDelete}"?`;
			} else {
				console.error("Popup heading element '#delete-movie h3' not found!");
			}
			showDeletePopup();
			
			const deleteButton = document.getElementById("delete-b");
			const cancelButton = document.getElementById("cancel-b");

			// Define handler functions
			const handleDelete = () => {
				removeMovie(id); 
				li.remove();
				hideForms();
                updateMovieCounts(); // Update counts after deleting
			};

			const handleCancel = () => {
				hideForms();
			};

			// Add listeners that only fire once per popup display
			deleteButton.addEventListener('click', handleDelete, { once: true });
			cancelButton.addEventListener('click', handleCancel, { once: true });
        });
		
        handleSearch(); // Re-apply search filter after adding
        updateMovieCounts(); // Update counts after adding to list
    }
	
	// Function to update the movie counts in the UI
    function updateMovieCounts() {
        const watchingCountSpan = document.getElementById('watching-count');
        const planToCountSpan = document.getElementById('plan-to-count');
        const onHoldCountSpan = document.getElementById('on-hold-count');
        const maybeCountSpan = document.getElementById('maybe-count');
        const watchedCountSpan = document.getElementById('watched-count');
        const totalCountSpan = document.getElementById('total-count');

        const watchingCount = document.getElementById('watching-list').children.length;
        const planToCount = document.getElementById('plan-to-list').children.length;
        const onHoldCount = document.getElementById('on-hold-list').children.length;
        const maybeCount = document.getElementById('maybe-list').children.length;
        const watchedCount = document.getElementById('watched-list').children.length;
        const totalCount = watchingCount + planToCount + onHoldCount + watchedCount + maybeCount;

        watchingCountSpan.textContent = watchingCount;
        planToCountSpan.textContent = planToCount;
        onHoldCountSpan.textContent = onHoldCount;
        maybeCountSpan.textContent = maybeCount;
        watchedCountSpan.textContent = watchedCount;
        totalCountSpan.textContent = totalCount;
    }
	
	// Event listener for the edit form submission
	editMovieBtn.addEventListener('click', function() {
		if (!currentEditingMovie) return;
		
		const newName = editNameInput.value.trim();
		let newLink = editLinkInput.value.trim();
		const file = editImageUpload.files[0];
		
		if (!newName) {
			alert("Please enter a movie name!");
			return;
		}
		// Default link if empty
		if (newLink === "") {
			newLink = "https://ww1.goojara.to/";
		}
		 
		// Determine the image path
		let newImgPath = currentEditingMovie.imgPath; // Keep old image by default
		if (file) {
			newImgPath = `images/${file.name}`;
		}
		// Ensure relative path
		newImgPath = getRelativePath(newImgPath);


        updateMovie(currentEditingMovie, newImgPath, newName, newLink);
	});
	
	// Update a movie in the list and localStorage
	function updateMovie(oldMovie, newImg, newName, newLink) {
        const movieLiElement = document.querySelector(`.movie-list li[data-movie-id='${oldMovie.id}']`);
        // Check if the element was actually found in the DOM
        if (movieLiElement) {
            // Update the dataset for search functionality
            movieLiElement.dataset.movieName = newName;

            // Find the image and link elements 
            const imgElement = movieLiElement.querySelector('.movie-image img');
            const linkElement = movieLiElement.querySelector('.movie-names a');

            // Update the image source and alt text
			if (imgElement) {
				imgElement.src = getRelativePath(newImg);
				imgElement.alt = newName;
			}


            // Update the link href and text content
            if (linkElement) {
                linkElement.href = newLink;
                linkElement.textContent = newName;
            }
        } else {
            console.error(`Movie element with ID ${oldMovie.id} not found in the DOM for updating.`);
            // If this happens often, your old method might be safer,
        }

        // Update the movie in localStorage
        let movies = JSON.parse(localStorage.getItem("movies")) || [];
		movies = movies.map(movie => {
			if (movie.id === Number(oldMovie.id)) {
				return { ...movie, imgPath: getRelativePath(newImg), name: newName, link: newLink };
			}
			return movie;
		});

        localStorage.setItem("movies", JSON.stringify(movies));

        // Re-apply the current search filter  
        handleSearch();

        // Close the edit form and reset state
        hideForms();
        currentEditingMovie = null;
    }
    
	function saveMovie(id, imgPath, name, link, category) {
		let movies = JSON.parse(localStorage.getItem("movies")) || [];
        // Check if movie already exists
        const existingIndex = movies.findIndex(movie => movie.id === id);
        if (existingIndex > -1) {
            movies[existingIndex] = { id, imgPath, name, link, category };
        } else {
            movies.push({ id, imgPath, name, link, category });
        }
        localStorage.setItem("movies", JSON.stringify(movies));
	}

    function removeMovie(id) {
        let movies = JSON.parse(localStorage.getItem("movies")) || [];
        movies = movies.filter(movie => movie.id !== id);
        localStorage.setItem("movies", JSON.stringify(movies));
		handleSearch();
		updateMovieCounts();
    }
	
	function loadMovies() {
		let movies = JSON.parse(localStorage.getItem("movies")) || [];
		document.getElementById('watching-list').innerHTML = '';
        document.getElementById('plan-to-list').innerHTML = '';
        document.getElementById('on-hold-list').innerHTML = '';
        document.getElementById('maybe-list').innerHTML = '';
        document.getElementById('watched-list').innerHTML = '';

		movies.forEach(movie => {
            // Ensure valid data before adding
            if (movie && movie.id != null && movie.name && movie.category) {
                 addMovieToList(movie.id, movie.imgPath || "images/default-movie.jpg", movie.name, movie.link || "#", movie.category);
            } else {
                console.warn("Skipping invalid movie data from localStorage:", movie);
            }
        });
        updateMovieCounts(); // Call updateMovieCounts here
	}
 
});
