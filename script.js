

document.addEventListener("DOMContentLoaded", () => {

    $(document).ready(function() {
    console.log("jQuery is ready!");
});

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

    function showToast(message, type = "info", duration = 3000) {
        const toast = $(`
            <div class="toast ${type}">
            ${message}
            </div>
            `);
            $("#toastContainer").append(toast);

            setTimeout(() => toast.addClass("show"), 100);
            setTimeout(() => {
                toast.removeClass("show");
                setTimeout(() => toast.remove(), 400);
            }, duration);
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
                    
                    showToast(`Welcome, ${userName}! Enjoy browsing our collection.`, "success");
                } else {
                    userNameInput.style.borderColor = "#dc3545";
                    userNameInput.focus();
                    showToast("Please enter your name", "error");
                    
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
                showToast("Please enter your login.", "error");
                loginInput.focus();
                return;
            }
            
            showToast("Login successful! Redirecting...", "success");
            const $btn = $('.login-form button[type="submit"]');
            const originalBtnText = $btn.html();
            $btn.html('<span class="spinner"></span> Please wait...');
            $btn.prop('disabled', true);
            
            setTimeout(() => {
                window.location.href = "catalog.html";
            }, 1500);
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
    
    // Autosuggestions for catalog filter search (#catalogSearch)
    (function catalogAutoSuggest() {
        const searchInput = document.getElementById('catalogSearch');
        if (!searchInput) return;

        // collect unique product titles
        const titles = Array.from(document.querySelectorAll('.card .card-title'))
            .map(el => el.textContent.trim())
            .filter(Boolean);
        const suggestions = [...new Set(titles)];

        // create dropdown container
        const dropdown = document.createElement('div');
        dropdown.className = 'catalog-suggestions';
        Object.assign(dropdown.style, {
            position: 'absolute',
            zIndex: 1050,
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.12)',
            boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
            maxHeight: '220px',
            overflowY: 'auto',
            width: (searchInput.offsetWidth || 260) + 'px',
            display: 'none',
            borderRadius: '6px'
        });

        // ensure parent positioned so absolute dropdown aligns
        const parent = searchInput.parentElement;
        if (parent) parent.style.position = parent.style.position || 'relative';
        parent.appendChild(dropdown);

        let activeIndex = -1;

        function render(list) {
            dropdown.innerHTML = '';
            if (!list.length) {
                dropdown.style.display = 'none';
                activeIndex = -1;
                return;
            }
            list.forEach((text, idx) => {
                const item = document.createElement('div');
                item.className = 'catalog-suggestion-item';
                item.textContent = text;
                Object.assign(item.style, {
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid rgba(0,0,0,0.04)'
                });
                item.addEventListener('mousedown', (e) => {
                    e.preventDefault(); // preserve focus
                    searchInput.value = text;
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                    dropdown.style.display = 'none';
                });
                item.addEventListener('mouseenter', () => setActive(idx));
                dropdown.appendChild(item);
            });
            dropdown.style.display = 'block';
            setActive(-1);
        }

        function setActive(i) {
            const items = dropdown.querySelectorAll('.catalog-suggestion-item');
            items.forEach((it, idx) => it.style.background = idx === i ? '#f0f8ff' : 'transparent');
            activeIndex = i;
        }

        function update(q) {
            const ql = q.trim().toLowerCase();
            if (!ql) return render([]);
            const matches = suggestions.filter(s => s.toLowerCase().includes(ql)).slice(0, 8);
            render(matches);
        }

        // debounce input
        let dt;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(dt);
            dt = setTimeout(() => update(e.target.value), 150);
        });

        // keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            const items = dropdown.querySelectorAll('.catalog-suggestion-item');
            if (dropdown.style.display === 'none' || items.length === 0) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive(Math.min(activeIndex + 1, items.length - 1));
                items[activeIndex]?.scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive(Math.max(activeIndex - 1, 0));
                items[activeIndex]?.scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'Enter') {
                if (activeIndex >= 0) {
                    e.preventDefault();
                    items[activeIndex].dispatchEvent(new MouseEvent('mousedown'));
                }
            } else if (e.key === 'Escape') {
                dropdown.style.display = 'none';
            }
        });

        // hide on blur (delay allows click)
        searchInput.addEventListener('blur', () => setTimeout(() => dropdown.style.display = 'none', 150));
        window.addEventListener('resize', () => dropdown.style.width = (searchInput.offsetWidth || 260) + 'px');
    })();

    // Apply filters: search + checkboxes
    (function setupApplyFilters() {
        const searchInput = document.getElementById('catalogSearch');
        const applyBtn = document.getElementById('applyFilters');
        const clearBtn = document.getElementById('clearFilters');
        const cards = Array.from(document.querySelectorAll('.catalog .card-group .card'));

        function parsePrice(card) {
            const p = card.querySelector('.card-text.fw-bold')?.textContent || '';
            const m = p.replace(/[, ]/g, '').match(/\$?(\d+)/);
            return m ? Number(m[1]) : Number(card.dataset.price || 0);
        }

        function matchesPrice(price, checkedRanges) {
            if (checkedRanges.length === 0) return true;
            return checkedRanges.some(r => {
                if (r === 'priceUnder200') return price < 200;
                if (r === 'price200to300') return price >= 200 && price <= 300;
                if (r === 'priceOver300') return price > 300;
                return true;
            });
        }

        function getCheckedIds(ids) {
            return ids.map(id => document.getElementById(id))
                      .filter(Boolean)
                      .filter(el => el.checked)
                      .map(el => el.id);
        }

        function applyFilters() {
            const q = (searchInput?.value || '').trim().toLowerCase();
            const priceChecks = getCheckedIds(['priceUnder200','price200to300','priceOver300']);
            const typeChecks = getCheckedIds(['classic','modern','luxury']);
            const brandChecks = getCheckedIds(['timeless','premium']);
            const availabilityChecks = getCheckedIds(['inStock','limited']); // 'limited' used as limited edition

            let visible = 0;
            cards.forEach(card => {
                const title = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
                const desc = (card.querySelector('.card-text')?.textContent || '').toLowerCase();
                const price = parsePrice(card);
                const type = (card.dataset.type || '').toLowerCase();
                const brand = (card.dataset.brand || '').toLowerCase();
                const available = (card.dataset.available || 'true').toLowerCase() === 'true';

                // search match
                const searchMatch = !q || title.includes(q) || desc.includes(q) || String(price).includes(q);

                // price match
                const priceMatch = matchesPrice(price, priceChecks);

                // type match
                const typeMatch = typeChecks.length === 0 || typeChecks.some(id => id.replace(/-/g,'') && id.includes(type) || id.startsWith(type));
                // simpler: if types selected, require card type to be among them
                const typeSelectedMatch = typeChecks.length === 0 || typeChecks.some(id => id === type);

                // brand match
                const brandSelectedMatch = brandChecks.length === 0 || brandChecks.some(id => id === brand);

                // availability match
                let availabilitySelectedMatch = true;
                if (availabilityChecks.length) {
                    // 'inStock' -> available true, 'limited' -> available false
                    availabilitySelectedMatch = availabilityChecks.some(id => {
                        if (id === 'inStock') return available === true;
                        if (id === 'limited') return available === false;
                        return true;
                    });

                    highlightMatches(q);

                }
                
                function highlightMatches(query) {
                    $(".card-title, .card-text").each(function () {
                        const el = $(this);
                        el.html(el.text()); 
                    });
                    
                    if (!query) return;
                    
                    const regex = new RegExp("(" + query + ")", "gi");
                    $(".card-title, .card-text").each(function () {
                        const el = $(this);
                        el.contents().each(function () {
                            if (this.nodeType === 3 && regex.test(this.nodeValue)) {
                                const newHTML = this.nodeValue.replace(regex, "<span class='highlight'>$1</span>");
                                $(this).replaceWith(newHTML);}
                            });
                        });
                    }


                const show = searchMatch && priceMatch && (typeSelectedMatch || typeChecks.length === 0) && brandSelectedMatch && availabilitySelectedMatch;

                card.style.display = show ? '' : 'none';
                if (show) visible++;
            });

            // update showing count text if exists
            const countLabel = document.querySelector('.col-md-6 .text-muted') || document.querySelector('#catalogCount');
            if (countLabel) {
                const total = cards.length;
                countLabel.textContent = `Showing ${visible} of ${total} products`;
            }
        }

        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                applyBtn.animate(
                    [
                        { transform: "scale(1)", opacity: 1 },
                        { transform: "scale(1.05)", opacity: 0.95 },
                        { transform: "scale(1)", opacity: 1 }
                    ],
                    { duration: 220, easing: "ease-out" }
                );
                applyFilters();
            });
        }

        // Enter key on search triggers apply
        if (searchInput) {
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    applyFilters();
                }
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                // clear inputs and checkboxes
                if (searchInput) searchInput.value = '';
                ['priceUnder200','price200to300','priceOver300','classic','modern','luxury','timeless','premium','inStock','limited']
                    .forEach(id => {
                        const el = document.getElementById(id);
                        if (el && el.type === 'checkbox') el.checked = false;
                    });
                applyFilters();
            });
        }

        // initial apply to ensure consistent state
        applyFilters();
    })();
 
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
    
if (button) {
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
}

// ========== Scroll Progress Bar (jQuery) ==========
(function () {
  if (typeof jQuery === 'undefined') return; 
  if ($('#scrollProgressContainer').length === 0) {
    $('body').prepend('<div id="scrollProgressContainer"><div id="scrollProgress"></div></div>');
  }
  if ($('#progressCircle').length === 0) {
    $('body').append('<div id="progressCircle"><span class="pct">0%</span></div>');
  }

  const $bar = $('#scrollProgress');
  const $circle = $('#progressCircle');
  const $pct = $('#progressCircle .pct');

  function updateScrollProgress() {
    const docH = $(document).height() - $(window).height();
    const scrollTop = $(window).scrollTop();
    const percent = docH > 0 ? Math.round((scrollTop / docH) * 100) : 0;

    $bar.css('width', percent + '%');

    $pct.text(percent + '%');

    if (percent > 3) {
      if (!$circle.is(':visible')) $circle.fadeIn(140);
    } else {
      if ($circle.is(':visible')) $circle.fadeOut(120);
    }
  }

  let ticking = false;
  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(function () {
        updateScrollProgress();
        ticking = false;
      });
    }
  }

  updateScrollProgress();

  $(window).on('scroll resize', requestUpdate);

  $circle.on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 450);
  });

  $circle.attr('title', 'Scroll to top');

  $('#scrollProgressContainer').on('click', function (e) {
    const $w = $(window);
    const clickX = e.clientX; // px from left
    const width = $(this).width();
    const clickRatio = Math.min(Math.max(clickX / width, 0), 1);
    const targetScroll = Math.round(( $(document).height() - $w.height() ) * clickRatio);
    $('html, body').animate({ scrollTop: targetScroll }, 350);
  });

})();
// ========= Animated Number Counter (jQuery) =========
(function () {
  if (typeof jQuery === 'undefined') return;

  function formatNumber(n, useSep) {
    if (!useSep) return n;
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function animateValue($el, start, end, duration, useSep, suffix) {
    const startTime = performance.now();
    const range = end - start;
    function step(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.floor(start + range * eased);
      $el.text(formatNumber(current, useSep) + (suffix || ""));
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        $el.text(formatNumber(end, useSep) + (suffix || ""));
      }
    }
    requestAnimationFrame(step);
  }

  function setupCounters() {
    const $counters = $('.anim-counter').not('._counted'); 
    if ($counters.length === 0) return;

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const $el = $(entry.target);
            startCounterFor($el);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      $counters.each(function () { io.observe(this); });
    } else {
      $counters.each(function () { startCounterFor($(this)); });
    }

    function startCounterFor($el) {
      if ($el.hasClass('_counted')) return;
      const target = parseInt($el.data('target') || $el.text().replace(/[^\d]/g, ''), 10) || 0;
      const duration = parseInt($el.data('duration') || 2000, 10);
      const suffix = $el.data('suffix') || '';
      const useSep = String($el.data('sep')) === 'true';
      const start = 0;
      $el.addClass('_counted');
      animateValue($el, start, target, duration, useSep, suffix);
    }
  }

  $(document).ready(function () {
    setupCounters();
  });

  window.TimelessInitCounters = setupCounters;

  $(document).ready(function () {
    $('#loginForm').submit(function (event) {
        event.preventDefault();
        event.stopPropagation();


        const $btn = $('#submitBtn');
        const originalText = $btn.text();
        
        $btn
        .prop('disabled', true)
        .html(`<div class="spinner"></div> Please wait...`);


        setTimeout(() => {
            $btn
            .prop('disabled', false)
            .text(originalText);
            alert("Login successful!"); 
        }, 2000);
  });
});

$(document).ready(function () {
  $(".copy-btn").on("click", function () {
    const $content = $(this).parent();
    const textToCopy = $content.clone().children().remove().end().text().trim(); 

    navigator.clipboard.writeText(textToCopy).then(() => {
      $(this).text("✅");
      const tooltip = $('<div class="copy-tooltip">Copied!</div>');
      $content.append(tooltip);
      setTimeout(() => tooltip.addClass("show"), 50);

      setTimeout(() => {
        tooltip.removeClass("show");
        setTimeout(() => tooltip.remove(), 300);
        $(this).text("📋");
      }, 1500);
    });
  });
});

$(document).ready(function () {

  $(".accordion-header").on("click", function () {
    const content = $(this).next(".accordion-content");

    $(".accordion-content").not(content).slideUp(200);

    content.stop(true, true).slideToggle(200);
  });
  $(".copy-btn").on("click", function (event) {
    event.stopPropagation(); 
    const $content = $(this).parent();
    const textToCopy = $content.clone().children().remove().end().text().trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      $(this).text("✅");
      const tooltip = $('<div class="copy-tooltip">Copied!</div>');
      $content.append(tooltip);
      setTimeout(() => tooltip.addClass("show"), 50);

      setTimeout(() => {
        tooltip.removeClass("show");
        setTimeout(() => tooltip.remove(), 300);
        $(this).text("📋");
      }, 1500);
    });
  });

});
  function lazyLoad() {
    $('.lazy').each(function() {
      const imgTop = $(this).offset().top;
      const scrollBottom = $(window).scrollTop() + $(window).height();

      if (scrollBottom > imgTop - 100) {
        const src = $(this).attr('data-src');
        if (src) {
          $(this).attr('src', src).removeAttr('data-src');
          $(this).on('load', function() {
            $(this).addClass('loaded');
          });
        }
      }
    });
  }

  $(window).on('scroll', lazyLoad);
  $(window).on('load', lazyLoad);

})();

});