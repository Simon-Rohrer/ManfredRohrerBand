//TODO ENTFERNE
// Navigation - Wait for DOM to be ready (including dynamically loaded header)
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure components are loaded
    setTimeout(() => {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const links = document.querySelectorAll('.nav-links li');

        if (hamburger && navLinks && links.length > 0) {
            hamburger.addEventListener('click', () => {
                // Toggle Nav
                navLinks.classList.toggle('open');

                // Animate Links
                links.forEach((link, index) => {
                    if (link.style.animation) {
                        link.style.animation = '';
                    } else {
                        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                    }
                });

                // Hamburger Animation
                //Test

                hamburger.classList.toggle('toggle');
            });

            // Close nav when clicking a link
            links.forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('open');
                    hamburger.classList.remove('toggle');
                    links.forEach(link => {
                        link.style.animation = '';
                    });
                });
            });
        }
    }, 100); // Small delay to ensure components are loaded
});

// Audio Player
let currentAudio = null;
let currentBtn = null;
let currentTrack = null;
let updateInterval = null;

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateTimeline(track, audio) {
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    const progressFill = track.querySelector('.progress-fill');
    const progressThumb = track.querySelector('.progress-thumb');
    const currentTimeEl = track.querySelector('.current-time');

    // Update progress bar
    const percentage = (currentTime / duration) * 100;
    progressFill.style.width = `${percentage}%`;

    // Update thumb position
    if (progressThumb) {
        progressThumb.style.left = `${percentage}%`;
    }

    // Update current time display
    currentTimeEl.textContent = formatTime(currentTime);
}

function togglePlay(btn) {
    const track = btn.closest('.track');
    const src = track.getAttribute('data-src');
    const isPlaying = btn.classList.contains('playing');

    // 1. Stop any currently playing audio
    if (currentAudio && currentAudio !== null) {
        currentAudio.pause();
        currentAudio.currentTime = 0; // Reset to start
        if (currentBtn) {
            currentBtn.textContent = '▶';
            currentBtn.classList.remove('playing');
            currentBtn.closest('.track').classList.remove('active-track');
        }
        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;
        }
    }

    // 2. If the clicked button was NOT playing, start the new track
    if (!isPlaying) {
        // Create new audio instance
        if (src) {
            const audio = new Audio(src);
            audio.volume = 0.5; // Set a reasonable default volume

            audio.play().then(() => {
                btn.textContent = '⏸';
                btn.classList.add('playing');
                track.classList.add('active-track');

                currentAudio = audio;
                currentBtn = btn;
                currentTrack = track;

                // Update total time when metadata is loaded
                audio.addEventListener('loadedmetadata', () => {
                    const totalTimeEl = track.querySelector('.total-time');
                    totalTimeEl.textContent = formatTime(audio.duration);
                });

                // Update timeline continuously
                updateInterval = setInterval(() => {
                    updateTimeline(track, audio);
                }, 100);

                // Reset UI when audio ends
                audio.onended = () => {
                    btn.textContent = '▶';
                    btn.classList.remove('playing');
                    track.classList.remove('active-track');
                    currentAudio = null;
                    currentBtn = null;
                    currentTrack = null;
                    if (updateInterval) {
                        clearInterval(updateInterval);
                        updateInterval = null;
                    }
                    // Reset progress bar
                    const progressFill = track.querySelector('.progress-fill');
                    progressFill.style.width = '0%';
                    const currentTimeEl = track.querySelector('.current-time');
                    currentTimeEl.textContent = '0:00';
                };
            }).catch(err => {
                console.error("Audio playback failed:", err);
                alert("Playback failed. Please check console.");
            });
        } else {
            console.error("No audio source found for this track.");
        }
    } else {
        // If it WAS playing, we just paused/stopped it in step 1.
        // So we just clear the state.
        currentAudio = null;
        currentBtn = null;
        currentTrack = null;
    }
}

function seekTo(event, progressBar) {
    if (!currentAudio) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * currentAudio.duration;

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
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
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
    }

    // Glitch Effect Removed

    // Hero Slideshow
    const slides = document.querySelectorAll('.hero-bg .slide');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    const dotsContainer = document.querySelector('.slide-dots');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0 && dotsContainer && prevBtn && nextBtn) {
        // Initialize Dots
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
                if (direction === 'prev') {
                    // For prev, outgoing needs to stay at right (100%), which is default for non-active
                    outgoingSlide.style.transform = '';
                } else {
                    outgoingSlide.classList.remove('exit');
                    outgoingSlide.style.transform = 'translateX(-100%)'; // Keep it at left until reused
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
        galleryPages.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('gallery-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToGalleryPage(index));
            galleryDotsContainer.appendChild(dot);
        });

        const galleryDots = document.querySelectorAll('.gallery-dot');

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

if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Gather Data
        let eventType = document.getElementById('event-type').value;
        if (eventType === 'other') {
            eventType = `Sonstiges: ${document.getElementById('other-event').value}`;
        }

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            eventDate: document.getElementById('event-date').value,
            eventType: eventType,
            message: document.getElementById('message').value,
            recipient: 'test@test.de' // Placeholder email
        };

        // 2. Simulate Sending (Console Log)
        console.group('📧 Sending Email...');
        console.log('To:', formData.recipient);
        console.log('Payload:', formData);
        console.groupEnd();

        // 3. Visual Feedback
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'WIRD GESENDET...';
        submitBtn.disabled = true;

        // Simulate network delay
        setTimeout(() => {
            submitBtn.textContent = 'ANFRAGE GESENDET! ✓';
            submitBtn.style.backgroundColor = '#4CAF50'; // Green success color
            submitBtn.style.borderColor = '#4CAF50';
            submitBtn.style.color = '#fff';

            // Reset form
            bookingForm.reset();

            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.borderColor = '';
                submitBtn.style.color = '';
            }, 3000);
        }, 1500);
    });
}

// Member Slider
function prevMemberSlide(btn) {
    const container = btn.parentElement;
    const images = container.querySelectorAll('img');
    let activeIndex = Array.from(images).findIndex(img => img.classList.contains('active'));

    images[activeIndex].classList.remove('active');

    let newIndex = activeIndex - 1;
    if (newIndex < 0) newIndex = images.length - 1;

    images[newIndex].classList.add('active');
}

function nextMemberSlide(btn) {
    const container = btn.parentElement;
    const images = container.querySelectorAll('img');
    let activeIndex = Array.from(images).findIndex(img => img.classList.contains('active'));

    images[activeIndex].classList.remove('active');

    let newIndex = activeIndex + 1;
    if (newIndex >= images.length) newIndex = 0;

    images[newIndex].classList.add('active');
}
