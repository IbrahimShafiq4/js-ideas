// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function () {
    // ======================
    // DOM ELEMENT SELECTORS
    // ======================
    // Select all necessary DOM elements for the video player controls
    const video = document.querySelector('video'); // Main video element
    const volumeChangerDiv = document.querySelector('.volume-changer'); // Volume control container
    const volumeChangerIcon = volumeChangerDiv?.querySelector('i'); // Volume icon element
    const orangeBar = document.querySelector('.orange-bar'); // Progress bar fill element
    const progressContainer = orangeBar.parentElement; // Container for progress bar
    const currentTimeEl = document.querySelector('.current-time'); // Current time display
    const durationTimeEl = document.querySelector('.duration-time'); // Total duration display
    const playBtn = document.querySelector('.play-btn i'); // Main play button
    const playPauseBtn = document.querySelector('.play-pause i'); // Secondary play button
    const volumeInput = document.querySelector('input[type="range"]'); // Volume slider input
    const captionIcon = document.querySelector('.caption i'); // Captions button
    const speedIcon = document.querySelector('.speed i'); // Speed control button
    const pictureInPicture = document.querySelector('.picture-in-picture i'); // PiP button
    const theaterMode = document.querySelector('.theater-mode i'); // Theater mode button
    const fullscreen = document.querySelector('.fullscreen i'); // Fullscreen button
    const settingsIcon = document.querySelector('.settings i'); // Settings button
    const speedList = document.querySelector('.speed-list'); // Speed options dropdown
    const videoResolution = document.querySelector('.video-resolution'); // Quality options dropdown
    const container = document.querySelector('.container'); // Main container
    const cVideo = document.querySelector('.c-video'); // Video wrapper

    // ======================
    // STATE VARIABLES
    // ======================
    let isDragging = false; // Tracks if user is dragging progress bar
    let isTheaterMode = false; // Tracks theater mode state
    let isFullscreen = false; // Tracks fullscreen state
    let currentSpeed = 1; // Current playback speed (1 = normal)
    let currentQuality = '720'; // Current quality setting
    let targetFPS = null; // Target FPS when simulating lower quality
    let lastFrameTime = 0; // Timestamp of last frame update

    // ======================
    // INITIALIZATION
    // ======================
    /**
     * Initializes all video controls when page loads
     * - Sets default quality
     * - Updates play/pause icons
     * - Updates volume icon
     * - Initializes time displays
     * - Hides dropdown menus
     */
    function initVideoState() {
        changeQuality('720'); // Set default quality
        updatePlayPauseIcons(); // Set initial play/pause state
        updateVolumeIcon(); // Set initial volume icon
        updateVideoTime(0); // Initialize time displays

        // Hide dropdown menus initially
        speedList.style.display = 'none';
        videoResolution.style.display = 'none';
    }

    // ======================
    // ICON UPDATE FUNCTIONS
    // ======================
    /**
     * Updates play/pause icons based on video state
     * - Checks if video is playing or ended
     * - Updates all play/pause buttons
     */
    function updatePlayPauseIcons() {
        const isPlaying = !video.paused && !video.ended; // Check if video is currently playing
        const isEnded = video.ended; // Check if video has ended

        /**
         * Helper function to update individual buttons
         * @param {Element} button - The button element to update
         */
        const updateButton = (button) => {
            if (!button) return; // Exit if button doesn't exist

            // Clear all state classes
            button.classList.remove('fa-play', 'fa-pause', 'fa-rotate-right');

            // Apply appropriate class based on state
            if (isEnded) {
                button.classList.add('fa-rotate-right'); // Show replay icon when ended
            } else {
                button.classList.add(isPlaying ? 'fa-pause' : 'fa-play'); // Show pause or play icon
            }
        };

        // Update all play/pause buttons
        updateButton(playBtn);
        updateButton(playPauseBtn);
    }

    /**
     * Updates volume icon based on current volume level
     * - Shows mute icon when volume is 0 or muted
     * - Shows low volume icon when volume < 0.5
     * - Shows high volume icon when volume >= 0.5
     */
    function updateVolumeIcon() {
        if (!volumeChangerIcon) return; // Exit if icon doesn't exist

        // Clear all volume icon classes
        volumeChangerIcon.classList.remove(
            'fa-volume-xmark', // Muted icon
            'fa-volume-low', // Low volume icon
            'fa-volume-high' // High volume icon
        );

        // Apply appropriate volume icon
        if (video.muted || video.volume === 0) {
            volumeChangerIcon.classList.add('fa-volume-xmark'); // Muted icon
        } else if (video.volume < 0.5) {
            volumeChangerIcon.classList.add('fa-volume-low'); // Low volume icon
        } else {
            volumeChangerIcon.classList.add('fa-volume-high'); // High volume icon
        }
    }

    // ======================
    // VIDEO CONTROL FUNCTIONS
    // ======================
    /**
     * Toggles between muted and unmuted states
     * - Switches video.muted property
     * - Updates volume slider position
     * - Updates volume icon
     */
    function toggleMute() {
        if (!video) return; // Exit if no video element

        video.muted = !video.muted; // Toggle mute status

        // Update volume slider to reflect current state
        if (volumeInput) {
            volumeInput.value = video.muted ? 0 : video.volume;
        }

        updateVolumeIcon(); // Update the volume icon
    }

    /**
     * Toggles between play and pause states
     * - Plays video if paused/ended
     * - Pauses video if playing
     */
    function togglePlayPause() {
        if (video.paused || video.ended) {
            playVideo();
        } else {
            pauseVideo();
        }
    }

    /**
     * Starts video playback
     * - Attempts to play video
     * - Updates UI on success
     * - Logs errors if playback fails
     */
    function playVideo() {
        video.play()
            .then(() => {
                updatePlayPauseIcons(); // Update UI on success
            })
            .catch(error => {
                console.error("Playback error:", error);
            });
    }

    /**
     * Pauses video playback
     * - Pauses the video
     * - Updates UI
     */
    function pauseVideo() {
        video.pause();
        updatePlayPauseIcons(); // Update UI
    }

    /**
     * Toggles theater mode
     * - Adds/removes theater mode class
     * - Updates theater mode button state
     */
    function toggleTheaterMode() {
        isTheaterMode = !isTheaterMode; // Toggle state
        const container = document.querySelector('.container');
        container.classList.toggle('theater', isTheaterMode); // Apply CSS class
        theaterMode.classList.toggle('active', isTheaterMode); // Update button state
    }

    /**
     * Toggles fullscreen mode
     * - Uses Fullscreen API
     * - Handles both entering and exiting fullscreen
     */
    async function toggleFullscreen() {
        try {
            if (!document.fullscreenElement) {
                await cVideo.requestFullscreen(); // Enter fullscreen
                isFullscreen = true;
            } else {
                await document.exitFullscreen(); // Exit fullscreen
                isFullscreen = false;
            }
            fullscreen.classList.toggle('active', isFullscreen); // Update button state
        } catch (err) {
            console.error('Fullscreen error:', err);
        }
    }

    /**
     * Toggles captions
     * - Shows/hides available text tracks
     * - Updates caption button state
     */
    function toggleCaptions() {
        // Loop through all text tracks (captions/subtitles)
        const tracks = video.textTracks;
        for (let i = 0; i < tracks.length; i++) {
            // Toggle between showing and hiding
            tracks[i].mode = tracks[i].mode === 'showing' ? 'hidden' : 'showing';
        }
        captionIcon.classList.toggle('active'); // Update button state
    }

    /**
     * Toggles settings menu
     * - Shows/hides quality options
     * - Updates settings button state
     */
    function toggleSettings() {
        const isVisible = videoResolution.style.display === 'block';
        videoResolution.style.display = isVisible ? 'none' : 'block';
        settingsIcon.classList.toggle('active', !isVisible);

        // Hide speed list if showing
        if (!isVisible) {
            speedList.style.display = 'none';
        }
    }

    /**
     * Toggles speed options menu
     * - Shows/hides speed options
     * - Updates speed button state
     */
    function toggleSpeedList() {
        const isVisible = speedList.style.display === 'block';
        speedList.style.display = isVisible ? 'none' : 'block';
        speedIcon.classList.toggle('active', !isVisible);

        // Hide settings if showing
        if (!isVisible) {
            videoResolution.style.display = 'none';
        }
    }

    /**
     * Changes playback speed
     * @param {number} speed - The playback speed (0.25-2)
     */
    function changeSpeed(speed) {
        currentSpeed = parseFloat(speed);
        video.playbackRate = currentSpeed; // Set playback rate

        // Update active state in speed list
        speedList.querySelectorAll('li').forEach(li => {
            li.classList.toggle('active', parseFloat(li.textContent) === currentSpeed);
        });

        toggleSpeedList(); // Close dropdown
    }

    /**
     * Changes video quality (simulated)
     * @param {string} quality - The quality level (144-1080)
     */
    function changeQuality(quality) {
        currentQuality = quality;

        // Update active state in quality list
        videoResolution.querySelectorAll('li').forEach(li => {
            li.classList.toggle('active', li.textContent === currentQuality);
        });

        // Apply quality effects
        switch (quality) {
            case '144':
                video.style.filter = "blur(2px) brightness(0.8) contrast(1.2)";
                targetFPS = 15;
                break;
            case '240':
                video.style.filter = "blur(1px) brightness(0.9) contrast(1.1)";
                targetFPS = 20;
                break;
            case '360':
                video.style.filter = "blur(0.5px)";
                targetFPS = 24;
                break;
            case '480':
                video.style.filter = "none";
                targetFPS = 30;
                break;
            case '720':
            case '1080':
                video.style.filter = "none";
                targetFPS = null; // Original FPS
                break;
        }

        toggleSettings(); // Close dropdown
    }

    /**
     * Limits FPS updates for simulated quality
     * @param {number} timestamp - Current timestamp
     * @returns {boolean} Whether to update the frame
     */
    function limitFPS(timestamp) {
        if (!targetFPS) return true; // No FPS limit

        const frameInterval = 1000 / targetFPS; // Calculate interval between frames
        if (timestamp - lastFrameTime >= frameInterval) {
            lastFrameTime = timestamp;
            return true; // Allow this frame
        }
        return false; // Skip this frame
    }

    // ======================
    // PROGRESS BAR FUNCTIONS
    // ======================
    /**
     * Updates progress bar width
     * @param {number} time - Current time in seconds
     */
    function updateProgressBar(time) {
        const barPosition = (time / video.duration) * 100; // Calculate percentage
        orangeBar.style.width = `${barPosition}%`; // Update width
    }

    /**
     * Updates time displays
     * @param {number} time - Current time in seconds
     */
    function updateVideoTime(time) {
        if (currentTimeEl && durationTimeEl) {
            currentTimeEl.textContent = formatTime(time); // Update current time
            durationTimeEl.textContent = formatTime(video.duration); // Update duration
        }
    }

    /**
     * Formats time as MM:SS
     * @param {number} time - Time in seconds
     * @returns {string} Formatted time
     */
    function formatTime(time) {
        if (isNaN(time)) return "00:00"; // Handle invalid time
        const minutes = Math.floor(time / 60); // Get minutes
        const seconds = Math.floor(time % 60); // Get seconds
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Format with leading zero
    }

    /**
     * Calculates new time based on click position
     * @param {Event} e - Mouse event
     * @returns {number} New time in seconds
     */
    function setVideoTime(e) {
        const rect = progressContainer.getBoundingClientRect(); // Get bar dimensions
        const clickX = e.clientX - rect.left; // Get click position
        const barWidth = rect.width; // Get total width
        const newTime = (clickX / barWidth) * video.duration; // Calculate new time

        updateProgressBar(newTime); // Update progress bar
        updateVideoTime(newTime); // Update time display
        return newTime;
    }

    // ======================
    // EVENT LISTENERS
    // ======================
    // Keyboard controls
    document.addEventListener('keyup', (e) => {
        switch (e.key.toLowerCase()) {
            case ' ':
            case 'k':
                togglePlayPause();
                e.preventDefault(); // Prevent default spacebar behavior
                break;
            case 'm':
                toggleMute();
                break;
            case 't':
                toggleTheaterMode();
                break;
            case 'f':
                toggleFullscreen();
                break;
            case 'c':
                toggleCaptions();
                break;
            case 's':
                toggleSettings();
                break;
        }
    });

    // Video state events
    video.addEventListener('play', updatePlayPauseIcons);
    video.addEventListener('pause', updatePlayPauseIcons);
    video.addEventListener('ended', updatePlayPauseIcons);
    video.addEventListener('volumechange', updateVolumeIcon);
    video.addEventListener('timeupdate', () => {
        // Only update if not dragging and FPS limit allows
        if (!isDragging && (!targetFPS || limitFPS(performance.now()))) {
            updateProgressBar(video.currentTime);
            updateVideoTime(video.currentTime);
        }
    });

    // Progress bar interaction
    progressContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        document.body.style.cursor = 'grabbing';
        video.currentTime = setVideoTime(e);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            video.currentTime = setVideoTime(e);
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.cursor = 'default';
        }
    });

    // Button click handlers
    playBtn.addEventListener('click', togglePlayPause);
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
    video.addEventListener('click', togglePlayPause);

    // Volume control
    volumeChangerIcon.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent event bubbling
        video.muted = !video.muted; // Toggle mute

        // Update slider position
        if (video.muted) {
            volumeInput.value = 0;
        } else {
            volumeInput.value = video.volume > 0 ? video.volume : 1;
            video.volume = volumeInput.value;
        }

        updateVolumeIcon(); // Update icon
    });

    // Volume control implementation using 'change' event as you originally wanted
    volumeInput.addEventListener('change', function () {
        // Convert the string value to a number
        const newVolume = parseFloat(this.value);

        // Ensure the value is a valid number between 0 and 1
        if (!isNaN(newVolume) && newVolume >= 0 && newVolume <= 1) {
            // Unmute if we're increasing volume from 0 while muted
            if (newVolume > 0 && video.muted) {
                video.muted = false;
            }

            // Set the new volume
            video.volume = newVolume;

            // Update the volume icon
            updateVolumeIcon();
        }
    });

    // Mute/unmute toggle when clicking the volume icon
    volumeChangerIcon.addEventListener('click', function (e) {
        e.stopPropagation();

        // Toggle mute state
        video.muted = !video.muted;

        // Update the input slider position
        if (video.muted) {
            volumeInput.value = 0;
        } else {
            // When unmuting, restore to previous volume or default to 0.7
            volumeInput.value = video.volume > 0 ? video.volume : 0.7;
            video.volume = parseFloat(volumeInput.value);
        }

        updateVolumeIcon();
    });

    // Initialize volume settings
    function initVolume() {
        // Set initial volume from input value
        video.volume = parseFloat(volumeInput.value);
        updateVolumeIcon();
    }

    // Feature controls
    theaterMode.addEventListener('click', toggleTheaterMode);
    fullscreen.addEventListener('click', toggleFullscreen);
    captionIcon.addEventListener('click', toggleCaptions);
    settingsIcon.addEventListener('click', toggleSettings);
    speedIcon.addEventListener('click', toggleSpeedList);
    pictureInPicture.addEventListener('click', () => video.requestPictureInPicture());

    // Speed list items
    speedList.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => changeSpeed(li.textContent));
    });

    // Quality list items
    videoResolution.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => changeQuality(li.textContent));
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!speedList.contains(e.target) && e.target !== speedIcon) {
            speedList.style.display = 'none';
            speedIcon.classList.remove('active');
        }
        if (!videoResolution.contains(e.target) && e.target !== settingsIcon) {
            videoResolution.style.display = 'none';
            settingsIcon.classList.remove('active');
        }
    });

    // ======================
    // INITIAL SETUP
    // ======================
    video.addEventListener('loadedmetadata', initVideoState);
    initVideoState(); // Initialize on page load
});