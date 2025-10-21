document.addEventListener("DOMContentLoaded", () => {
    const successSound = document.createElement('audio');
successSound.src = 'sounds/success.mp3'; 
successSound.preload = 'auto';

const errorSound = document.createElement('audio');
errorSound.src = 'sounds/error.mp3'; 
errorSound.preload = 'auto';

document.body.appendChild(successSound);
document.body.appendChild(errorSound);

function playSuccessSound() {
    successSound.currentTime = 0; 
    successSound.play().catch(err => console.log('Audio play failed:', err));
}

function playErrorSound() {
    errorSound.currentTime = 0; 
    errorSound.play().catch(err => console.log('Audio play failed:', err));
}

function playClickSound() {
    errorSound.currentTime = 0;
    errorSound.play().catch(err => console.log('Audio play failed:', err));
}

    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);

    const themeToggle = document.createElement("button");
    themeToggle.innerHTML = currentTheme === 'dark' ? 'Day Mode' : 'Night Mode';
    themeToggle.classList.add("btn", "theme-toggle-btn");
    themeToggle.style.position = "fixed";
    themeToggle.style.top = "80px";
    themeToggle.style.right = "20px";
    themeToggle.style.zIndex = "1000";
    themeToggle.style.padding = "10px 20px";
    themeToggle.style.border = "none";
    themeToggle.style.borderRadius = "25px";
    themeToggle.style.cursor = "pointer";
    themeToggle.style.fontWeight = "bold";
    themeToggle.style.fontSize = "16px";
    themeToggle.style.transition = "all 0.3s ease";
    themeToggle.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
    document.body.appendChild(themeToggle);

    themeToggle.addEventListener("click", () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.setAttribute('data-theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? 'Day Mode' : 'Night Mode';
        
        updateThemeMessage(newTheme);
    });

    const themeMessage = document.createElement("div");
    themeMessage.classList.add("theme-message");
    themeMessage.style.position = "fixed";
    themeMessage.style.top = "140px";
    themeMessage.style.right = "20px";
    themeMessage.style.padding = "15px 25px";
    themeMessage.style.borderRadius = "10px";
    themeMessage.style.fontWeight = "bold";
    themeMessage.style.opacity = "0";
    themeMessage.style.transition = "opacity 0.3s ease";
    themeMessage.style.zIndex = "999";
    themeMessage.style.maxWidth = "300px";
    themeMessage.style.textAlign = "center";
    document.body.appendChild(themeMessage);

    const ratingContainer = document.createElement("div");
    ratingContainer.classList.add("star-rating-container");
    ratingContainer.style.position = "fixed";
    ratingContainer.style.bottom = "120px";
    ratingContainer.style.right = "20px";
    ratingContainer.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
    ratingContainer.style.padding = "20px";
    ratingContainer.style.borderRadius = "15px";
    ratingContainer.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
    ratingContainer.style.zIndex = "998";
    ratingContainer.style.minWidth = "200px";
    
    const ratingTitle = document.createElement("p");
    ratingTitle.textContent = "Rate Our Service:";
    ratingTitle.style.margin = "0 0 10px 0";
    ratingTitle.style.fontWeight = "bold";
    ratingTitle.style.textAlign = "center";
    ratingContainer.appendChild(ratingTitle);

    const starsWrapper = document.createElement("div");
    starsWrapper.classList.add("stars-wrapper");
    starsWrapper.style.display = "flex";
    starsWrapper.style.justifyContent = "center";
    starsWrapper.style.gap = "8px";
    starsWrapper.style.fontSize = "30px";
    starsWrapper.style.cursor = "pointer";
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.classList.add("star");
        star.setAttribute("data-rating", i);
        star.innerHTML = "★";
        star.style.color = "#ddd";
        star.style.transition = "color 0.2s ease, transform 0.2s ease";
        starsWrapper.appendChild(star);
    }
    
    ratingContainer.appendChild(starsWrapper);
    
    const ratingMessage = document.createElement("p");
    ratingMessage.classList.add("rating-message");
    ratingMessage.textContent = "Click a star to rate";
    ratingMessage.style.margin = "10px 0 0 0";
    ratingMessage.style.textAlign = "center";
    ratingMessage.style.fontSize = "14px";
    ratingMessage.style.minHeight = "20px";
    ratingContainer.appendChild(ratingMessage);
    
    document.body.appendChild(ratingContainer);

    const stars = document.querySelectorAll(".star");
    let selectedRating = 0;

    stars.forEach((star, index) => {
        star.addEventListener("mouseenter", () => {
            highlightStars(index + 1, false);
        });
        
        star.addEventListener("mouseleave", () => {
            highlightStars(selectedRating, true);
        });
        
        star.addEventListener("click", () => {
            selectedRating = index + 1;
            highlightStars(selectedRating, true);
            updateRatingMessage(selectedRating);
            
            star.style.transform = "scale(1.3)";
            setTimeout(() => {
                star.style.transform = "scale(1)";
            }, 200);
        });
    });

    function highlightStars(count, isSelected) {
        stars.forEach((star, index) => {
            if (index < count) {
                star.style.color = isSelected ? "#FFD700" : "#FFA500";
            } else {
                star.style.color = "#ddd";
            }
        });
    }

    function updateRatingMessage(rating) {
        const messages = [
            "Click a star to rate",
            " Poor, we'll do better!",
            " Fair, room for improvement",
            " Good, thank you!",
            " Very Good, we're pleased!",
            " Excellent, you're amazing!"
        ];
        ratingMessage.innerHTML = messages[rating];
        ratingMessage.style.fontWeight = "bold";
        ratingMessage.style.color = rating >= 4 ? "#28a745" : rating >= 3 ? "#ffc107" : "#dc3545";
    }

    const isCatalogPage = window.location.pathname.includes('catalog.html');
    
    if (isCatalogPage) {
        const hasGreeted = document.body.getAttribute('data-greeted');
        
        if (!hasGreeted) {
            const greetingModal = document.createElement("div");
            greetingModal.classList.add("greeting-modal");
            greetingModal.style.display = "flex";
            greetingModal.style.position = "fixed";
            greetingModal.style.top = "0";
            greetingModal.style.left = "0";
            greetingModal.style.width = "100%";
            greetingModal.style.height = "100%";
            greetingModal.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
            greetingModal.style.justifyContent = "center";
            greetingModal.style.alignItems = "center";
            greetingModal.style.zIndex = "10000";
            greetingModal.style.animation = "fadeIn 0.3s ease";
            
            const modalContent = document.createElement("div");
            modalContent.style.backgroundColor = "white";
            modalContent.style.padding = "40px";
            modalContent.style.borderRadius = "20px";
            modalContent.style.boxShadow = "0 10px 40px rgba(0, 0, 0, 0.3)";
            modalContent.style.textAlign = "center";
            modalContent.style.minWidth = "350px";
            modalContent.style.maxWidth = "500px";
            modalContent.style.animation = "slideUp 0.4s ease";
            
            const modalTitle = document.createElement("h2");
            modalTitle.textContent = "Welcome to Timeless!";
            modalTitle.style.margin = "0 0 15px 0";
            modalTitle.style.color = "#1976d2";
            modalTitle.style.fontSize = "28px";
            modalContent.appendChild(modalTitle);
            
            const modalText = document.createElement("p");
            modalText.textContent = "We'd love to personalize your experience";
            modalText.style.margin = "0 0 25px 0";
            modalText.style.color = "#555";
            modalText.style.fontSize = "16px";
            modalContent.appendChild(modalText);
          
            const inputLabel = document.createElement("label");
            inputLabel.textContent = "What's your name?";
            inputLabel.style.display = "block";
            inputLabel.style.margin = "0 0 10px 0";
            inputLabel.style.fontWeight = "bold";
            inputLabel.style.color = "#333";
            inputLabel.style.fontSize = "16px";
            modalContent.appendChild(inputLabel);
        
            const userNameField = document.createElement("input");
            userNameField.type = "text";
            userNameField.id = "userNameInput";
            userNameField.placeholder = "Enter your name";
            userNameField.classList.add("form-control");
            userNameField.style.padding = "12px";
            userNameField.style.fontSize = "16px";
            userNameField.style.marginBottom = "20px";
            userNameField.style.textAlign = "center";
            userNameField.style.border = "2px solid #90caf9";
            userNameField.style.borderRadius = "10px";
            modalContent.appendChild(userNameField);
            
            const submitButton = document.createElement("button");
            submitButton.textContent = "Continue";
            submitButton.classList.add("btn", "btn-primary");
            submitButton.style.padding = "12px 40px";
            submitButton.style.fontSize = "16px";
            submitButton.style.fontWeight = "bold";
            submitButton.style.borderRadius = "10px";
            submitButton.style.width = "100%";
            modalContent.appendChild(submitButton);
            
            const skipButton = document.createElement("button");
            skipButton.textContent = "Skip for now";
            skipButton.classList.add("btn", "btn-link");
            skipButton.style.marginTop = "10px";
            skipButton.style.color = "#888";
            skipButton.style.textDecoration = "none";
            skipButton.style.fontSize = "14px";
            modalContent.appendChild(skipButton);
            
            greetingModal.appendChild(modalContent);
            document.body.appendChild(greetingModal);
            
            function updateNavbarGreeting(userName) {
                const currentHour = new Date().getHours();
                let timeGreeting;
                
                if (currentHour < 12) {
                    timeGreeting = "Good Morning";
                } else if (currentHour < 18) {
                    timeGreeting = "Good Afternoon";
                } else {
                    timeGreeting = "Good Evening";
                }
                
                const navbar = document.querySelector('.navbar .container-fluid');
                
                if (navbar) {
                    const navbarGreeting = document.createElement("div");
                    navbarGreeting.id = "navbarGreeting";
                    navbarGreeting.style.position = "absolute";
                    navbarGreeting.style.left = "50%";
                    navbarGreeting.style.transform = "translateX(-50%)";
                    navbarGreeting.style.color = "white";
                    navbarGreeting.style.fontWeight = "bold";
                    navbarGreeting.style.fontSize = "18px";
                    navbarGreeting.style.whiteSpace = "nowrap";
                    navbarGreeting.style.textAlign = "center";
                    
                    navbarGreeting.textContent = `${timeGreeting}, ${userName}!`;
                    
                    navbar.style.position = "relative";
                    navbar.appendChild(navbarGreeting);
                    
                    navbarGreeting.style.opacity = "0";
                    navbarGreeting.style.transition = "opacity 0.5s ease";
                    setTimeout(() => {
                        navbarGreeting.style.opacity = "1";
                    }, 100);
                }
            }
            
            submitButton.addEventListener("click", () => {
                const userNameInput = document.getElementById("userNameInput");
                const userName = userNameInput.value.trim();
                
                if (userName) {
                    updateNavbarGreeting(userName);
                    
                    greetingModal.style.opacity = "1";
                    greetingModal.style.transition = "opacity 0.3s ease";
                    greetingModal.style.opacity = "0";
                    
                    setTimeout(() => {
                        greetingModal.remove();
                    }, 300);
                    
                    document.body.setAttribute('data-greeted', 'true');
                    
                    showValidationMessage(`Welcome, ${userName}! Enjoy browsing our collection.`, "success");
                } else {
                    userNameInput.style.borderColor = "#dc3545";
                    userNameInput.focus();
                    showValidationMessage("Please enter your name", "error");
                    
                    setTimeout(() => {
                        userNameInput.style.borderColor = "#90caf9";
                    }, 2000);
                }
            });
            
            skipButton.addEventListener("click", () => {
                greetingModal.style.opacity = "1";
                greetingModal.style.transition = "opacity 0.3s ease";
                greetingModal.style.opacity = "0";
                
                setTimeout(() => {
                    greetingModal.remove();
                }, 300);
                
                document.body.setAttribute('data-greeted', 'true');
            });
            
            userNameField.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    submitButton.click();
                }
            });
            
            setTimeout(() => {
                userNameField.focus();
            }, 400);
        }
    }


    const loginForm = document.querySelector(".login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const loginInput = document.getElementById("login");
            const passwordInput = document.getElementById("password");

            if (!loginInput.value.trim()) {
                showValidationMessage("Please enter your login.", "error");
                loginInput.focus();
                return;
            }

            if (passwordInput.value.length < 6) {
                showValidationMessage("Password must be at least 6 characters long.", "error");
                passwordInput.focus();
                return;
            }

            showValidationMessage("Login successful! Redirecting...", "success");
            setTimeout(() => {
                window.location.href = "catalog.html";
            }, 1000);
        });
    }

    function showValidationMessage(message, type) {
        const existingMsg = document.querySelector(".validation-message");
        if (existingMsg) existingMsg.remove();

        const msgDiv = document.createElement("div");
        msgDiv.classList.add("validation-message");
        msgDiv.textContent = message;
        msgDiv.style.position = "fixed";
        msgDiv.style.top = "50%";
        msgDiv.style.left = "50%";
        msgDiv.style.transform = "translate(-50%, -50%)";
        msgDiv.style.padding = "20px 30px";
        msgDiv.style.borderRadius = "10px";
        msgDiv.style.fontWeight = "bold";
        msgDiv.style.zIndex = "10000";
        msgDiv.style.backgroundColor = type === "success" ? "#28a745" : "#dc3545";
        msgDiv.style.color = "white";
        msgDiv.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
        
        document.body.appendChild(msgDiv);
        
        setTimeout(() => {
            msgDiv.style.opacity = "0";
            msgDiv.style.transition = "opacity 0.3s ease";
            setTimeout(() => msgDiv.remove(), 300);
        }, 2000);
    }

    const accordionHeaders = document.querySelectorAll(".accordion-header");
    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const content = header.nextElementSibling;
            const isOpen = content.classList.contains("show");
            
            const headerText = header.querySelector("span") || header;
            if (isOpen) {
                content.classList.remove("show");
                content.style.maxHeight = null;
                if (headerText.tagName === "SPAN") {
                    headerText.textContent = headerText.textContent.replace("▼", "▶");
                }
            } else {
                content.classList.add("show");
                content.style.maxHeight = content.scrollHeight + "px";
                if (headerText.tagName === "SPAN") {
                    headerText.textContent = headerText.textContent.replace("▶", "▼");
                }
            }
        });
    });

    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = `
        <div class="popup-content">
            <span class="close-btn">&times;</span>
            <h3 class="mb-3 text-center">Subscribe to Timeless</h3>
            <form id="subscribeForm">
                <input type="email" id="email" class="form-control mb-2" placeholder="Enter your email" required>
                <button type="submit" class="btn btn-primary w-100">Subscribe</button>
            </form>
        </div>
    `;
    document.body.appendChild(popup);

    const subscribeBtn = document.createElement("button");
    subscribeBtn.textContent = "Subscribe";
    subscribeBtn.classList.add("btn", "btn-outline-primary", "subscribe-btn");
    subscribeBtn.style.position = "fixed";
    subscribeBtn.style.bottom = "70px";
    subscribeBtn.style.right = "20px";
    document.body.appendChild(subscribeBtn);

    const closeBtn = popup.querySelector(".close-btn");

    subscribeBtn.addEventListener("click", () => {
        popup.style.display = "flex";
    });

    closeBtn.addEventListener("click", () => {
        popup.style.display = "none";
    });

    popup.addEventListener("click", (e) => {
        if (e.target === popup) popup.style.display = "none";
    });

    document.getElementById("subscribeForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const emailInput = document.getElementById("email");
        showValidationMessage(`Thank you for subscribing with ${emailInput.value}!`, "success");
        popup.style.display = "none";
        emailInput.value = "";
    });

    if (!window.location.href.includes("catalog.html")) return;

    const productGroups = document.querySelectorAll(".card-group");
    if (productGroups.length <= 2) return; 
    for (let i = 2; i < productGroups.length; i++) {
        productGroups[i].style.display = "none";
    }

    const loadMoreBtn = document.createElement("button");
    loadMoreBtn.textContent = "Load More";
    loadMoreBtn.classList.add("btn", "btn-primary", "load-more-btn");
    loadMoreBtn.style.display = "block";
    loadMoreBtn.style.margin = "40px auto";
    loadMoreBtn.style.backgroundColor = "#0a4cb0";
    loadMoreBtn.style.border = "none";
    loadMoreBtn.style.padding = "12px 35px";
    loadMoreBtn.style.fontSize = "17px";
    loadMoreBtn.style.fontWeight = "600";
    loadMoreBtn.style.borderRadius = "10px";
    loadMoreBtn.style.transition = "background-color 0.3s ease";

    loadMoreBtn.addEventListener("mouseenter", () => {
        loadMoreBtn.style.backgroundColor = "#083c8a";
    });
    loadMoreBtn.addEventListener("mouseleave", () => {
        loadMoreBtn.style.backgroundColor = "#0a4cb0";
    });

    productGroups[1].after(loadMoreBtn);

    loadMoreBtn.addEventListener("click", () => {
        for (let i = 2; i < productGroups.length; i++) {
            productGroups[i].style.display = "flex";
        }

        loadMoreBtn.style.display = "none";
    });

    const dateTimeBlock = document.createElement("div");
    dateTimeBlock.classList.add("date-time");
    document.body.appendChild(dateTimeBlock);

    function updateDateTime() {
        const now = new Date();
        const formatted = now.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        dateTimeBlock.innerHTML = `<strong>Current Time:</strong> ${formatted}`;
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);

    document.addEventListener("keydown", (e) => {
        if (["ArrowRight", "ArrowLeft"].includes(e.key)) {
            e.preventDefault();

            if (e.key === "ArrowRight") {
                currentIndex = (currentIndex + 1) % menuItems.length;
            } else if (e.key === "ArrowLeft") {
                currentIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
            }

            menuItems[currentIndex].focus();
        }
    });
    
    const button = document.getElementById("applyFilters");

button.addEventListener("click", () => {
  button.animate(
    [
      { transform: "scale(1)", opacity: 1 },
      { transform: "scale(1.2)", opacity: 0.8 },
      { transform: "scale(1)", opacity: 1 }
    ],
    {
      duration: 400,
      easing: "ease-out"
    }
  );
});
});