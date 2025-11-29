//TODO ENTFERNE
// Navigation - Wait for DOM to be ready (including dynamically loaded header)
const service_id = "service_cxgpf5t";
const template_id = "template_k0cb54w";

// Navigations-Links holen (wird für die Animation benötigt)
const navLinks = document.querySelectorAll('.nav-links li');

// Funktion zum Zurücksetzen der Animationen beim Schließen
const resetNavLinkFade = (links) => {
    links.forEach(link => {
        link.style.animation = '';
        link.classList.remove('fade'); // Wichtig: Falls die CSS-Klasse .fade verwendet wird
    });
}

// Funktion zur Ausführung der Einschwebe-Animation beim Öffnen
const navLinkFade = (links) => {
    links.forEach((link, index) => {
        // Fügt die CSS-Klasse .fade hinzu, um opacity: 1 zu setzen und die Keyframes zu aktivieren
        link.classList.add('fade');

        // Definiert die Animation mit einem Verzögerungswert, der auf dem Index basiert
        // 0.5s Dauer, ease-in-out Timing, forwards Füllmodus, 0.3s Startverzögerung + Index-Offset
        link.style.animation = `navLinkFade 0.5s ease-in-out forwards ${index / 7 + 0.3}s`;
    });
};

// Navigation - Using event delegation for dynamically loaded header
document.addEventListener('click', (e) => {
    const navLinksContainer = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    const links = document.querySelectorAll('.nav-links li');

    if (!navLinksContainer || !hamburger) return;


    // Handle hamburger click
    if (e.target.closest('.hamburger')) {

        navLinksContainer.classList.toggle('active');
        hamburger.classList.toggle('toggle');

        // Animation Logik
        if (navLinksContainer.classList.contains('active')) {
            // Menü öffnet sich -> Animation starten
            navLinkFade(links);
        } else {
            // Menü schließt sich -> Animationen zurücksetzen
            resetNavLinkFade(links);
        }
    }

    // Handle nav link click (close menu)
    if (e.target.closest('.nav-links a')) {

        navLinksContainer.classList.remove('active');
        hamburger.classList.remove('toggle');

        // Animationen beim Schließen zurücksetzen
        resetNavLinkFade(links);
    }
});


// Audio Player
let currentAudio = null;
let currentBtn = null;
let currentTrack = null;
let updateInterval = null;

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// AKTUALISIERT: Nutzt progress-fill und progress-thumb
function updateTimeline(track, audio) {
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    const currentTimeEl = track.querySelector('.current-time');
    // const totalTimeEl = track.querySelector('.total-time'); // Total time wird nur einmal in loadedmetadata gesetzt

    // NEU/WIEDERHERGESTELLT: Elemente für Progress Bar
    const progressFill = track.querySelector('.progress-fill');
    const progressThumb = track.querySelector('.progress-thumb');

    // Update progress
    const percentage = (currentTime / duration); // Wert zwischen 0 und 1
    const percentageString = `${percentage * 100}%`;

    // Fortschrittsbalken aktualisieren
    if (progressFill) {
        progressFill.style.width = percentageString;
    }
    if (progressThumb) {
        progressThumb.style.left = percentageString;
    }

    // Update current time display
    currentTimeEl.textContent = formatTime(currentTime);

    // Berechne die verbleibende Zeit (WIRD IM LOADEDMETADATA ODER ONENDED KORRIGIERT)
    if (!isNaN(duration)) {
        const remainingTime = duration - currentTime;
        track.querySelector('.total-time').textContent = "-" + formatTime(remainingTime);
    }
}

// AKTUALISIERT: Fehler in der Reset-Logik behoben
function togglePlay(btn) {
    const track = btn.closest('.track');
    const src = track.getAttribute('data-src');
    const wasPlaying = btn.classList.contains('playing'); // <--- NEU: Zustand vor dem Reset speichern

    // 1. Wenn der Button geklickt wird UND er bereits spielte, stoppen wir ihn nur.
    if (wasPlaying) {
        // Logik zum Stoppen, wenn der aktuell spielende Button erneut geklickt wird
        if (currentAudio && currentAudio !== null) {
            currentAudio.pause();

            // UI-Reset-Logik (muss auf currentTrack zugreifen, bevor es auf null gesetzt wird)
            if (currentTrack) {
                const progressFill = currentTrack.querySelector('.progress-fill');
                const progressThumb = currentTrack.querySelector('.progress-thumb');
                if (progressFill) progressFill.style.width = '0%';
                if (progressThumb) progressThumb.style.left = '0%';

                const currentTimeEl = currentTrack.querySelector('.current-time');
                if (currentTimeEl) currentTimeEl.textContent = '0:00';
                const totalTimeEl = currentTrack.querySelector('.total-time');
                if (totalTimeEl && !isNaN(currentAudio.duration)) {
                    totalTimeEl.textContent = formatTime(currentAudio.duration);
                }

                currentBtn.textContent = '▶';
                currentBtn.classList.remove('playing');
                currentTrack.classList.remove('active-track');
            }

            if (updateInterval) {
                clearInterval(updateInterval);
                updateInterval = null;
            }

            currentAudio.currentTime = 0; // Reset to start
            currentAudio = null;
            currentBtn = null;
            currentTrack = null;
        }
        return; // <--- WICHTIG: Hier beenden, um Doppelausführung zu verhindern
    }

    // 2. Stop any OTHER currently playing audio (Zustand eines anderen Tracks)
    if (currentAudio && currentAudio !== null) {
        currentAudio.pause();

        // UI-Reset-Logik des alten Tracks
        if (currentTrack) {
            const progressFill = currentTrack.querySelector('.progress-fill');
            const progressThumb = currentTrack.querySelector('.progress-thumb');
            if (progressFill) progressFill.style.width = '0%';
            if (progressThumb) progressThumb.style.left = '0%';

            const currentTimeEl = currentTrack.querySelector('.current-time');
            if (currentTimeEl) currentTimeEl.textContent = '0:00';
            const totalTimeEl = currentTrack.querySelector('.total-time');
            if (totalTimeEl && !isNaN(currentAudio.duration)) {
                totalTimeEl.textContent = formatTime(currentAudio.duration);
            }

            currentBtn.textContent = '▶';
            currentBtn.classList.remove('playing');
            currentTrack.classList.remove('active-track');
        }

        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;
        }

        currentAudio.currentTime = 0; // Reset to start
        currentAudio = null;
        currentBtn = null;
        currentTrack = null;
    }


    // 3. Start the new track (dieser Block wird nur erreicht, wenn kein oder ein anderer Track spielte)
    if (src) {
        const audio = new Audio(src);
        audio.volume = 0.5;

        audio.play().then(() => {
            btn.textContent = '⏸';
            btn.classList.add('playing');
            track.classList.add('active-track');

            currentAudio = audio;
            currentBtn = btn;
            currentTrack = track;

            audio.addEventListener('loadedmetadata', function listener() {
                const totalTimeEl = track.querySelector('.total-time');
                if (!isNaN(audio.duration)) {
                    totalTimeEl.textContent = "-" + formatTime(audio.duration);
                } else {
                    totalTimeEl.textContent = "--:--";
                }
                const currentTimeEl = track.querySelector('.current-time');
                if (currentTimeEl) currentTimeEl.textContent = '0:00';
                audio.removeEventListener('loadedmetadata', listener);
            });

            updateInterval = setInterval(() => {
                updateTimeline(track, audio);
            }, 100);

            // Reset UI when audio ends
            audio.onended = () => {
                btn.textContent = '▶';
                btn.classList.remove('playing');
                track.classList.remove('active-track');

                const progressFill = track.querySelector('.progress-fill');
                const progressThumb = track.querySelector('.progress-thumb');
                if (progressFill) progressFill.style.width = '0%';
                if (progressThumb) progressThumb.style.left = '0%';

                const currentTimeEl = track.querySelector('.current-time');
                if (currentTimeEl) currentTimeEl.textContent = '0:00';
                const totalTimeEl = track.querySelector('.total-time');
                if (totalTimeEl && !isNaN(audio.duration)) {
                    totalTimeEl.textContent = formatTime(audio.duration);
                }

                currentAudio = null;
                currentBtn = null;
                currentTrack = null;
                if (updateInterval) {
                    clearInterval(updateInterval);
                    updateInterval = null;
                }
            };
        }).catch(err => {
            console.error("Audio playback failed:", err);
            alert("Playback failed. Please check console.");
        });
    } else {
        console.error("No audio source found for this track.");
    }
}

// WIEDERHERGESTELLT: Zielt auf das Progress-Bar-Element ab
function seekTo(event, progressBarElement) {
    console.log('seekTo called');
    console.log('currentAudio:', currentAudio);
    console.log('currentAudio.duration:', currentAudio?.duration);
    console.log('isNaN(currentAudio.duration):', isNaN(currentAudio?.duration));

    if (!currentAudio || isNaN(currentAudio.duration)) {
        console.log('Exiting seekTo: no audio or invalid duration');
        return;
    }

    const rect = progressBarElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * currentAudio.duration;

    console.log('Seeking to:', newTime, 'seconds');
    currentAudio.currentTime = newTime;
    updateTimeline(currentTrack, currentAudio);
}


// Lightbox and Hero Slideshow - Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    if (lightbox && lightboxImg) {
        // Make functions global so they can be called from HTML onclick attributes
        window.openLightbox = function (element) {
            const img = element.querySelector('img');
            // FIX: Prüfen, ob `img` existiert
            if (img) {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        };

        window.closeLightbox = function () {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        };

        // Close lightbox with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                window.closeLightbox();
            }
        });

        // Close lightbox on click outside image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                window.closeLightbox();
            }
        });
    }

    // NEU: Event-Delegation für die Play-Buttons im Audio-Player
    document.querySelector('.audio-list')?.addEventListener('click', (e) => {
        const playBtn = e.target.closest('.play-btn');
        if (playBtn) {
            togglePlay(playBtn);
        }

        // Event-Delegation für Seeking auf dem Progress-Bar-Element
        const progressBar = e.target.closest('.progress-bar');
        if (progressBar && currentTrack && currentAudio) {
            // Only allow seeking if there's an active track
            const clickedTrack = progressBar.closest('.track');
            const trackTitle = clickedTrack?.querySelector('.track-title')?.textContent;
            console.log('Clicked track:', trackTitle);
            console.log('Current track title:', currentTrack?.querySelector('.track-title')?.textContent);
            console.log('Are they the same element?', clickedTrack === currentTrack);

            if (clickedTrack === currentTrack) {
                seekTo(e, progressBar);
            }
        }
    });

    // Hero Slideshow
    const slides = document.querySelectorAll('.hero-bg .slide');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    const dotsContainer = document.querySelector('.slide-dots');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0 && dotsContainer && prevBtn && nextBtn) {
        // Initialize Dots
        dotsContainer.innerHTML = ''; // Ensure container is empty
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        // Initialize first slide
        slides[0].classList.add('active');
        slides.forEach((slide, index) => {
            if (index !== 0) slide.style.transform = 'translateX(100%)';
        });

        function goToSlide(index, direction = 'next') {
            if (index === currentSlide) return;

            const outgoingSlide = slides[currentSlide];
            const incomingSlide = slides[index];
            const outgoingDot = dots[currentSlide];
            const incomingDot = dots[index];

            // Update Dots
            outgoingDot.classList.remove('active');
            incomingDot.classList.add('active');

            // Determine animation direction
            if (direction === 'next') {
                // Moving Forward: Out goes Left, In comes from Right
                outgoingSlide.classList.remove('active');
                outgoingSlide.classList.add('exit'); // Moves to -100%

                incomingSlide.classList.add('no-transition');
                incomingSlide.classList.remove('exit');
                incomingSlide.style.transform = 'translateX(100%)'; // Start at Right
            } else {
                // Moving Backward: Out goes Right, In comes from Left
                outgoingSlide.classList.remove('active');
                outgoingSlide.style.transform = 'translateX(100%)'; // Manually move to Right

                incomingSlide.classList.add('no-transition');
                incomingSlide.classList.remove('exit');
                incomingSlide.style.transform = 'translateX(-100%)'; // Start at Left
            }

            // Force reflow
            void incomingSlide.offsetWidth;

            // Animate In
            incomingSlide.classList.remove('no-transition');
            incomingSlide.style.transform = ''; // Clear inline styles
            incomingSlide.classList.add('active'); // Moves to 0%

            // Clean up outgoing slide styles after transition (optional but good for state)
            setTimeout(() => {
                outgoingSlide.classList.remove('exit');
                // Set non-active slides back to their default non-active position (right side)
                if (!outgoingSlide.classList.contains('active')) {
                    outgoingSlide.style.transform = 'translateX(100%)';
                }
            }, 1200); // Match transition duration

            currentSlide = index;
            resetInterval();
        }

        function nextSlide() {
            const newIndex = (currentSlide + 1) % slides.length;
            goToSlide(newIndex, 'next');
        }

        function prevSlide() {
            const newIndex = (currentSlide - 1 + slides.length) % slides.length;
            goToSlide(newIndex, 'prev');
        }

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }

        // Event Listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Start Auto-play
        resetInterval();
    }
});


// Gallery Slider
document.addEventListener('DOMContentLoaded', () => {
    const galleryPages = document.querySelectorAll('.gallery-page');
    const galleryPrev = document.querySelector('.gallery-prev');
    const galleryNext = document.querySelector('.gallery-next');
    const galleryDotsContainer = document.querySelector('.gallery-dots');
    let currentGalleryPage = 0;

    if (galleryPages.length > 0 && galleryDotsContainer && galleryPrev && galleryNext) {
        // Create dots
        galleryDotsContainer.innerHTML = ''; // Ensure container is empty
        galleryPages.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('gallery-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToGalleryPage(index));
            galleryDotsContainer.appendChild(dot);
        });

        const galleryDots = document.querySelectorAll('.gallery-dot');

        // Initial state
        galleryPages.forEach((page, index) => {
            if (index === 0) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });


        function goToGalleryPage(index) {
            if (index === currentGalleryPage) return;

            // Remove active class from current page and dot
            galleryPages[currentGalleryPage].classList.remove('active');
            galleryDots[currentGalleryPage].classList.remove('active');

            // Add active class to new page and dot
            galleryPages[index].classList.add('active');
            galleryDots[index].classList.add('active');

            currentGalleryPage = index;
        }

        function nextGalleryPage() {
            const newIndex = (currentGalleryPage + 1) % galleryPages.length;
            goToGalleryPage(newIndex);
        }

        function prevGalleryPage() {
            const newIndex = (currentGalleryPage - 1 + galleryPages.length) % galleryPages.length;
            goToGalleryPage(newIndex);
        }

        // Event Listeners
        galleryNext.addEventListener('click', nextGalleryPage);
        galleryPrev.addEventListener('click', prevGalleryPage);
    }
});


// Booking Form Handling
const bookingForm = document.getElementById('bookingForm');
const eventTypeSelect = document.getElementById('event-type');
const otherEventGroup = document.getElementById('other-event-group');

if (eventTypeSelect && otherEventGroup) {
    // Set minimum date to today
    const dateInput = document.getElementById('event-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Initial check (falls "other" im HTML vorausgewählt ist)
    if (eventTypeSelect.value === 'other') {
        otherEventGroup.style.display = 'block';
        document.getElementById('other-event').required = true;
    } else {
        otherEventGroup.style.display = 'none';
        document.getElementById('other-event').required = false;
    }

    eventTypeSelect.addEventListener('change', (e) => {
        if (e.target.value === 'other') {
            otherEventGroup.style.display = 'block';
            document.getElementById('other-event').required = true;
        } else {
            otherEventGroup.style.display = 'none';
            document.getElementById('other-event').required = false;
        }
    });
}

if (bookingForm && typeof emailjs !== 'undefined') {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // 1. Gather Data
        let eventType = document.getElementById('event-type').value;
        if (eventType === 'other') {
            eventType = `Sonstiges: ${document.getElementById('other-event').value}`;
        }

        const templateParams = {
            from_name: document.getElementById('name').value,
            from_email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            event_date: document.getElementById('event-date').value,
            event_type: eventType,
            message: document.getElementById('message').value,
            to_email: 'Simon.rohrer04@web.de'
        };

        // 2. Visual Feedback - Loading
        submitBtn.textContent = 'WIRD GESENDET...';
        submitBtn.disabled = true;

        // 3. Send Email via EmailJS
        emailjs.send(service_id, template_id, templateParams)
            .then(() => {
                // Success
                submitBtn.textContent = 'ANFRAGE GESENDET! ✓';
                submitBtn.style.backgroundColor = '#4CAF50';
                submitBtn.style.borderColor = '#4CAF50';
                submitBtn.style.color = '#fff';

                bookingForm.reset();

                // Setzt das "Other Event" Feld zurück
                if (eventTypeSelect && otherEventGroup) {
                    otherEventGroup.style.display = 'none';
                    document.getElementById('other-event').required = false;
                }

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.style.color = '';
                }, 3000);
            })
            .catch((error) => {
                // Error
                console.error('FAILED...', error);
                submitBtn.textContent = 'FEHLER BEIM SENDEN';
                submitBtn.style.backgroundColor = '#f44336';
                submitBtn.style.borderColor = '#f44336';

                alert('Es gab einen Fehler beim Senden der Nachricht. Bitte versuchen Sie es später erneut oder schreiben Sie uns direkt eine E-Mail.');

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.borderColor = '';
                }, 3000);
            });
    });
} else if (bookingForm) {
    console.warn("EmailJS library not loaded. Form submission will not work.");
    // Optional: Formular-Fallback oder Fehlermeldung
}


// Member Slider Logic
document.addEventListener('DOMContentLoaded', () => {
    const prevBtns = document.querySelectorAll('.member-slider-prev');
    const nextBtns = document.querySelectorAll('.member-slider-next');

    // Initialize sliders: Ensure first image is active if none are
    document.querySelectorAll('.member-img').forEach(card => {
        const images = card.querySelectorAll('img');
        if (images.length > 0) {
            const hasActive = Array.from(images).some(img => img.classList.contains('active'));
            if (!hasActive) {
                images[0].classList.add('active');
            }
        }
    });

    function updateSlide(btn, direction) {
        const card = btn.closest('.member-img');
        const images = card.querySelectorAll('img');
        let activeIndex = 0;

        images.forEach((img, index) => {
            if (img.classList.contains('active')) {
                activeIndex = index;
                img.classList.remove('active');
            }
        });

        let newIndex;
        if (direction === 'prev') {
            newIndex = activeIndex - 1;
            if (newIndex < 0) {
                newIndex = images.length - 1;
            }
        } else {
            newIndex = activeIndex + 1;
            if (newIndex >= images.length) {
                newIndex = 0;
            }
        }

        images[newIndex].classList.add('active');
    }

    prevBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            updateSlide(btn, 'prev');
        });
    });

    nextBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            updateSlide(btn, 'next');
        });
    });
});


// Genre Slider Logic
document.addEventListener('DOMContentLoaded', () => {
    const genreSlides = document.querySelectorAll('.genre-slide');
    const genrePrev = document.querySelector('.genre-prev');
    const genreNext = document.querySelector('.genre-next');
    const genreDotsContainer = document.querySelector('.genre-dots');
    let currentGenreIndex = 0;

    if (genreSlides.length > 0 && genreDotsContainer && genrePrev && genreNext) {
        // Create dots
        genreDotsContainer.innerHTML = '';
        genreSlides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot'); // Reusing existing dot class
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToGenreSlide(index));
            genreDotsContainer.appendChild(dot);
        });

        const genreDots = genreDotsContainer.querySelectorAll('.dot');

        function goToGenreSlide(index) {
            if (index === currentGenreIndex) return;

            // Remove active class from current
            genreSlides[currentGenreIndex].classList.remove('active');
            genreDots[currentGenreIndex].classList.remove('active');

            // Add active class to new
            genreSlides[index].classList.add('active');
            genreDots[index].classList.add('active');

            currentGenreIndex = index;
        }

        function nextGenreSlide() {
            const newIndex = (currentGenreIndex + 1) % genreSlides.length;
            goToGenreSlide(newIndex);
        }

        function prevGenreSlide() {
            const newIndex = (currentGenreIndex - 1 + genreSlides.length) % genreSlides.length;
            goToGenreSlide(newIndex);
        }

        // Event Listeners
        genreNext.addEventListener('click', nextGenreSlide);
        genrePrev.addEventListener('click', prevGenreSlide);
    }
});


// Video Slider Logic
document.addEventListener('DOMContentLoaded', () => {
    const videoSlides = document.querySelectorAll('.video-slide');
    const videoPrev = document.querySelector('.video-prev');
    const videoNext = document.querySelector('.video-next');
    const videoDotsContainer = document.querySelector('.video-dots');
    let currentVideoIndex = 0;

    if (videoSlides.length > 0 && videoDotsContainer && videoPrev && videoNext) {
        // Create dots
        videoDotsContainer.innerHTML = '';
        videoSlides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToVideoSlide(index));
            videoDotsContainer.appendChild(dot);
        });

        const videoDots = videoDotsContainer.querySelectorAll('.dot');

        function goToVideoSlide(index) {
            if (index === currentVideoIndex) return;

            // Pause current video
            const currentVideo = videoSlides[currentVideoIndex].querySelector('video');
            if (currentVideo) currentVideo.pause();

            // Remove active class from current
            videoSlides[currentVideoIndex].classList.remove('active');
            videoDots[currentVideoIndex].classList.remove('active');

            // Add active class to new
            videoSlides[index].classList.add('active');
            videoDots[index].classList.add('active');

            currentVideoIndex = index;
        }

        function nextVideoSlide() {
            const newIndex = (currentVideoIndex + 1) % videoSlides.length;
            goToVideoSlide(newIndex);
        }

        function prevVideoSlide() {
            const newIndex = (currentVideoIndex - 1 + videoSlides.length) % videoSlides.length;
            goToVideoSlide(newIndex);
        }

        // Event Listeners
        videoNext.addEventListener('click', nextVideoSlide);
        videoPrev.addEventListener('click', prevVideoSlide);
    }
});