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

	const downloadBtn = document.getElementById("download-html-btn");
    const goTopBtn = document.getElementById("go-top-btn");
	const refreshBtn = document.getElementById("refresh-btn");
    const searchInput = document.getElementById("search-input");
	const overlay = document.getElementById('overlay');
	
	const MovieImgForm = document.getElementById('show-movie');
	const showMovieImg = document.querySelectorAll('.show-image'); 

	const deleteMovieForm = document.getElementById("delete-movie");
    const deleteButton = document.getElementById("delete-b"); 
	const defaultImage = "https://github.com/hiro011/movies-list/blob/main/default-movie.jpg?raw=true"; 

    // Track currently editing movie
	let currentEditingMovie = null;
    
    loadMovies(); // Load saved movies/ Initialize
	updateMovieCounts(); // Call this after loading movies

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
        if (window.scrollY > 250) {
            goTopBtn.style.display = "block";
        } else {
            goTopBtn.style.display = "none";
        } 
		if (window.scrollY > 130) {
			document.getElementById("nav-bar").style.position = "fixed";
        } else {
			document.getElementById("nav-bar").style.position = "static";
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

		if (name === "") {
			alert("Please enter a movie name!");
			return;
		}
		
		if (link === "") {
			link = "https://ww1.goojara.to/";
		}
		
		// Ensure movieId is unique and persistent
		let movieId = localStorage.getItem("movieId") ? Number(localStorage.getItem("movieId")) : 5;
		let imgPath = "";
		
		// Handle image upload
		if (file) {
			reader.onload = function (event) {
				imgPath = event.target.result;
			addMovieToList(movieId, imgPath, name, link, category);
			saveMovie(movieId, imgPath, name, link, category);
			};
			
			reader.readAsDataURL(file);
		} else { 
			imgPath = defaultImage; // defualt image
			addMovieToList(movieId, imgPath, name, link, category);
			saveMovie(movieId, imgPath, name, link, category);
		}
		
		// Instead of storing Base64, save the file path or filename
		//let imgPath = file ? `images/${file.name}` : "images/default-movie.jpg";
		
		//addMovieToList(movieId, imgPath, name, link, category);
		//saveMovie(movieId, imgPath, name, link, category);

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
					<option value="completed">Completed</option>
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
        const completedCountSpan = document.getElementById('completed-count');
        const totalCountSpan = document.getElementById('total-count');

        const watchingCount = document.getElementById('watching-list').children.length;
        const planToCount = document.getElementById('plan-to-list').children.length;
        const onHoldCount = document.getElementById('on-hold-list').children.length;
        const maybeCount = document.getElementById('maybe-list').children.length;
        const completedCount = document.getElementById('completed-list').children.length;
        const totalCount = watchingCount + planToCount + onHoldCount + completedCount + maybeCount;

        watchingCountSpan.textContent = watchingCount;
        planToCountSpan.textContent = planToCount;
        onHoldCountSpan.textContent = onHoldCount;
        maybeCountSpan.textContent = maybeCount;
        completedCountSpan.textContent = completedCount;
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
                imgElement.src = newImg;
                imgElement.alt = newName; // Update alt text for accessibility
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
                return { ...movie, imgPath: newImg, name: newName, link: newLink };
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
        document.getElementById('completed-list').innerHTML = '';

		movies.forEach(movie => {
            // Ensure valid data before adding
            if (movie && movie.id != null && movie.name && movie.category) {
                 addMovieToList(movie.id, movie.imgPath || defaultImage, movie.name, movie.link || "#", movie.category);
            } else {
                console.warn("Skipping invalid movie data from localStorage:", movie);
            }
        });
        updateMovieCounts(); // Call updateMovieCounts here
	}

    // Download Updated HTML File
	downloadBtn.addEventListener("click", function () {
        let movies = JSON.parse(localStorage.getItem("movies")) || [];

        // Generate updated HTML content
        let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Movies</title>
    <link rel="stylesheet" href="styles.css">
	<link rel="icon" type="image" href="images/cinema_1655698.png">
</head>

<body>
    <header>
        <h1>Movies - <span class="movie-count" id="total-count">0</span></h1>
		<div class="search-container">
            <input type="text" id="search-input" placeholder="🔍 Search movies...">
            <button id="clear-search" >clear</button>
        </div>
        <nav id="nav-bar">
            <ul>
                <li><a href="#watching">Watching</a></li>
                <li><a href="#plan-to">Plan To</a></li>
                <li><a href="#on-hold">On Hold</a></li>
                <li><a href="#maybe">Maybe</a></li>
                <li><a href="#completed">Completed</a></li>
            </ul>
        </nav>
    </header>

    <main>		
		<!-- Overlay (background) -->
		<div class="overlay" id="overlay"></div>
		
        <section id="show-movie">
			<span class="close-btn">&times;</span>
			<div class="preview-image">
 				<img id="previewMovieImage" src="${defaultImage}" alt="Show image">
			</div>
			<h2>Movie Name</h2>
		</section>
		
        <section id="watching" class="movie-container">
			<div class="movie-section">
				<h2>Watching - <span class="movie-count" id="watching-count">0</span></h2>
				<ul class="movie-list" id="watching-list">
					${movies.filter(g => g.category === "watching").map(g => `
					<li data-movie-name="${g.name}">
						<div class="movie-image">
							<img class="show-image" src="${g.imgPath}" alt="${g.name}">
						</div>
						<div class="movie-names">
							<a href="${g.link}" target="_blank">${g.name}</a>
						</div>
					</li>
					`).join("")}
				</ul>
			</div>
        </section>

        <section id="plan-to" class="movie-container">
			<div class="movie-section">
				<h2>Plan To - <span class="movie-count" id="plan-to-count">0</span></h2>
				<ul class="movie-list" id="plan-to-list">
					${movies.filter(g => g.category === "plan-to").map(g => `
					<li data-movie-name="${g.name}">
						<div class="movie-image">
							<img class="show-image" src="${g.imgPath}" alt="${g.name}">
						</div>
						<div class="movie-names">
							<a href="${g.link}" target="_blank">${g.name}</a>
						</div>
					</li>
					`).join("")}
				</ul>
			</div>
        </section>
		
        <section id="on-hold" class="movie-container">
			<div class="movie-section">
				<h2>On Hold - <span class="movie-count" id="on-hold-count">0</span></h2>
				<ul class="movie-list" id="on-hold-list">
					${movies.filter(g => g.category === "on-hold").map(g => `
					<li data-movie-name="${g.name}">
						<div class="movie-image">
							<img class="show-image" src="${g.imgPath}" alt="${g.name}">
						</div>
						<div class="movie-names">
							<a href="${g.link}" target="_blank">${g.name}</a>
						</div>
					</li>
					`).join("")}
				</ul>
			</div>
        </section>

        <section id="maybe" class="movie-container">
			<div class="movie-section">
				<h2>Maybe - <span class="movie-count" id="maybe-count">0</span></h2>
				<ul class="movie-list" id="maybe-list">
					${movies.filter(g => g.category === "maybe").map(g => `
					<li data-movie-name="${g.name}">
						<div class="movie-image">
							<img class="show-image" src="${g.imgPath}" alt="${g.name}">
						</div>
						<div class="movie-names">
							<a href="${g.link}" target="_blank">${g.name}</a>
						</div>
					</li>
					`).join("")}
				</ul>
			</div>
        </section>

        <section id="completed" class="movie-container">
			<div class="movie-section">
				<h2>Completed - <span class="movie-count" id="completed-count">0</span></h2>
				<ul class="movie-list" id="completed-list">
					${movies.filter(g => g.category === "completed").map(g => `
					<li data-movie-name="${g.name}">
						<div class="movie-image">
							<img class="show-image" src="${g.imgPath}" alt="${g.name}">
						</div>
						<div class="movie-names">
							<a href="${g.link}" target="_blank">${g.name}</a>
						</div>
					</li>
					`).join("")}
				</ul>
			</div>
        </section>
		
		<button id="refresh-btn" class="refresh-btn" >Refresh</button>
        <button id="go-top-btn" class="go-top-btn">↑ Go to Top</button>
    </main>
	
	<footer>
		<p>&copy; 2025 Ahmed Mehamedyesuf. All rights reserved.</p>
	</footer>
	
    <script src="script2.js"></script>
</body>
</html>
	`;

        // Create a Blob and trigger download
        const blob = new Blob([htmlContent], { type: "text/html" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "movies-data.html";
        document.body.prepend(a);
        a.click();
        document.body.removeChild(a);
    });
	
});
