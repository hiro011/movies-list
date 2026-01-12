document.addEventListener("DOMContentLoaded", function () {
	const closeFormButton = document.querySelectorAll('.close-btn'); 
    const goTopBtn = document.getElementById("go-top-btn");
	const refreshBtn = document.getElementById("refresh-btn");
    const searchInput = document.getElementById("search-input");
	const overlay = document.getElementById('overlay');
	
	const MovieImgForm = document.getElementById('show-movie');
	const showMovieImg = document.querySelectorAll('.show-image'); 

    // Initialize
	movieCounts()
	
	// show movie popup images
    function openImgPopup(imageSrc, movieName) {
		document.getElementById('previewMovieImage').src = imageSrc;
		document.querySelector('#show-movie h2').textContent = movieName;
		MovieImgForm.style.display = 'block';
		overlay.style.display = 'block';
		document.body.classList.add('overlay-active');
    }
	
	showMovieImg.forEach(img => {
		img.addEventListener('click', function() {
			const imgSrc = this.src;
			const movieName = this.alt;
			
            openImgPopup(imgSrc, movieName);
        });
    });

    // Close the popup form 
    closeFormButton.forEach(button => {
        button.addEventListener('click', hideForms);  
    });
    overlay.addEventListener('click', () => { hideForms(); });
	
	function hideForms() {
		MovieImgForm.style.display = 'none';
        overlay.style.display = 'none';
		document.body.classList.remove('overlay-active');
    }
	
	document.addEventListener('keydown', function(event) {
		if (event.key === 'Escape') {
			hideForms(); 
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
	
	// Function to update the movie counts in the UI
    function movieCounts() {
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
});
