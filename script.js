const CURRENCY_API_KEY = '8a255bad67-c9308cf6c6-t5imga';

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

// Cart persistence helpers
function formatCurrency(n) {
    if (n == null || isNaN(n)) return '$0';
    if (Number.isInteger(n)) return '$' + n;
    return '$' + Number(n).toFixed(2);
}

function saveCartObject(obj) {
    try { localStorage.setItem('timeless-cart', JSON.stringify(obj)); } catch (e) { console.warn('saveCart failed', e); }
}

function loadCartObject() {
    try { return JSON.parse(localStorage.getItem('timeless-cart') || 'null') || null; } catch (e) { return null; }
}

    // Theme handling: read from localStorage, fallback to prefers-color-scheme, persist on change
    const THEME_KEY = 'timeless-theme';

    function getStoredTheme() {
        try {
            return localStorage.getItem(THEME_KEY);
        } catch (e) { return null; }
    }

    function storeTheme(t) {
        try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
    }

    
    function setTheme(theme) {
        if (theme !== 'dark' && theme !== 'light') theme = 'light';
        document.body.setAttribute('data-theme', theme);
    // show a compact icon indicating the opposite mode (sun for day, moon for night)
    themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
        themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        storeTheme(theme);
        
        if (typeof updateThemeMessage === 'function') updateThemeMessage(theme);
        
        try {
            let meta = document.querySelector('meta[name="theme-color"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = 'theme-color';
                document.head.appendChild(meta);
            }
            meta.content = theme === 'dark' ? '#0f3460' : '#ffffff';
        } catch (e) {}
    }

    // create toggle button (we'll place it into the navbar as an icon)
    const themeToggle = document.createElement("button");
    themeToggle.classList.add("btn", "theme-toggle-btn", "nav-theme-toggle");
    themeToggle.setAttribute('aria-label', 'Toggle color theme');
    // compact navbar-friendly styling (preserve theming via CSS classes)
    themeToggle.style.padding = "6px 10px";
    themeToggle.style.border = "none";
    themeToggle.style.borderRadius = "6px";
    themeToggle.style.cursor = "pointer";
    themeToggle.style.fontWeight = "600";
    themeToggle.style.fontSize = "14px";
    themeToggle.style.transition = "all 0.2s ease";
    themeToggle.innerHTML = '🌙';

    themeToggle.addEventListener("click", () => {
        const current = document.body.getAttribute('data-theme') || 'light';
        setTheme(current === 'light' ? 'dark' : 'light');
        playClickSound();
    });

    // Insert the theme toggle into the navbar (left of the nav links)
    (function placeThemeToggleInNavbar() {
        const navbarContainer = document.querySelector('.navbar .container-fluid');
        if (!navbarContainer) return;
        const navList = navbarContainer.querySelector('ul.navbar-nav');
        if (!navList) return;

        // create a nav item to hold the button and insert it before the first nav link
        const li = document.createElement('li');
        li.className = 'nav-item';

        // style the button to look like a nav-link
        themeToggle.classList.add('nav-link');
        themeToggle.style.display = 'inline-flex';
        themeToggle.style.alignItems = 'center';
        themeToggle.style.justifyContent = 'center';
        themeToggle.style.padding = '6px 8px';
        themeToggle.style.marginRight = '6px';
        themeToggle.style.background = 'transparent';
        themeToggle.style.color = 'inherit';

        // insert before first item so it's on the left of Home/Catalog/Cart
        navList.insertBefore(li, navList.firstElementChild);
        li.appendChild(themeToggle);
    })();

    // --- Currency switcher (uses FastForex convert endpoint) ---
    const SUPPORTED_CURRENCIES = ['USD','KZT','RUB','EUR','GBP'];
    const CURRENCY_STORE_KEY = 'timeless-currency';
    const RATES_CACHE_KEY = 'timeless-rates'; // stores { rates: {...}, fetchedAt }

    function getStoredCurrency() {
        try { return localStorage.getItem(CURRENCY_STORE_KEY) || 'USD'; } catch (e) { return 'USD'; }
    }
    function setStoredCurrency(c) {
        try { localStorage.setItem(CURRENCY_STORE_KEY, c); } catch (e) {}
    }

    async function fetchRatesIfNeeded() {
        // return object mapping currency -> rate (USD -> currency)
        try {
            const cachedRaw = localStorage.getItem(RATES_CACHE_KEY);
            if (cachedRaw) {
                const cached = JSON.parse(cachedRaw);
                if (cached && cached.fetchedAt && (Date.now() - cached.fetchedAt) < 12 * 60 * 60 * 1000 && cached.rates) {
                    return cached.rates;
                }
            }

            const toList = SUPPORTED_CURRENCIES.filter(c => c !== 'USD').join(',');
            const url = `https://api.fastforex.io/convert?from=USD&to=${encodeURIComponent(toList)}&amount=1&api_key=${encodeURIComponent(CURRENCY_API_KEY)}`;
            const res = await fetch(url, { method: 'GET' });
            console.log(res);
            if (!res.ok) throw new Error('Rate fetch failed');
            const data = await res.json();
            console.log(data);

            // FastForex responses may nest rates in different props; handle common shapes
            const possible = data.result || data.results || data.rates || data.conversion || data; // fallback
            // normalize to an object mapping currency -> Number
            const rates = {};
            SUPPORTED_CURRENCIES.forEach(c => { rates[c] = c === 'USD' ? 1 : (Number(possible[c]) || null); });

            // persist
            try { localStorage.setItem(RATES_CACHE_KEY, JSON.stringify({ rates, fetchedAt: Date.now() })); } catch (e) {}
            return rates;
        } catch (e) {
            console.warn('fetchRatesIfNeeded error', e);
            // try to return cached even if stale
            try {
                const cachedRaw = localStorage.getItem(RATES_CACHE_KEY);
                if (cachedRaw) return JSON.parse(cachedRaw).rates || { USD: 1 };
            } catch (e) {}
            return { USD: 1 };
        }
    }

    function formatMoney(amount, currency) {
        try {
            // Intl will pick a sensible locale; fallback to simple formatting
            return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(Number(amount));
        } catch (e) {
            return currency + ' ' + Number(amount).toFixed(2);
        }
    }

    function parseUsdFromText(text) {
        if (!text) return 0;
        const m = String(text).replace(/[, ]/g, '').match(/([0-9]+(?:\.[0-9]+)?)/);
        return m ? Number(m[1]) : 0;
    }

    async function applyCurrencyToPage(targetCurrency) {
        const urlRUB = `https://api.fastforex.io/convert?from=USD&to=RUB&amount=1&api_key=${CURRENCY_API_KEY}`;
        const urlGBP = `https://api.fastforex.io/convert?from=USD&to=GBP&amount=1&api_key=${CURRENCY_API_KEY}`;
        const urlEUR = `https://api.fastforex.io/convert?from=USD&to=EUR&amount=1&api_key=${CURRENCY_API_KEY}`;
        const urlKZT = `https://api.fastforex.io/convert?from=USD&to=KZT&amount=1&api_key=${CURRENCY_API_KEY}`;

        // Fetch all exchange rates in parallel
        const [resRUB, resGBP, resEUR, resKZT] = await Promise.all([
            fetch(urlRUB),
            fetch(urlGBP),
            fetch(urlEUR),
            fetch(urlKZT)
        ]);

        if (!resRUB.ok || !resGBP.ok || !resEUR.ok || !resKZT.ok) {
            throw new Error('Rate fetch failed');
        }

        const [dataRUB, dataGBP, dataEUR, dataKZT] = await Promise.all([
            resRUB.json(),
            resGBP.json(),
            resEUR.json(),
            resKZT.json()
        ]);

        console.log('💱 Rates fetched:', dataRUB, dataGBP, dataEUR, dataKZT);

        // Load original USD prices from localStorage
        const originalPrices = JSON.parse(localStorage.getItem('originalPrices') || '[]');

        $('.card-text.fw-bold.text-primary').each(function(index) {
            const original = originalPrices[index];
            if (!original) return;

            let rate = 1;
            let currency = 'USD';

            if (targetCurrency === 'RUB') {
                rate = dataRUB.result.RUB;
                currency = 'RUB';
            } else if (targetCurrency === 'GBP') {
                rate = dataGBP.result.GBP;
                currency = 'GBP';
            } else if (targetCurrency === 'EUR') {
                rate = dataEUR.result.EUR;
                currency = 'EUR';
            } else if (targetCurrency === 'KZT') {
                rate = dataKZT.result.KZT;
                currency = 'KZT';
            }

            // If targetCurrency = USD → restore original prices
            if (currency === 'USD') {
                $(this).text(original.text);
                return;
            }

            const converted = original.value * rate;
            $(this).text(formatMoney(converted, currency));
        });
    }



    // create a compact currency button and insert to navbar next to theme button
    (function createCurrencyButton() {
        const current = getStoredCurrency();
        const currencyBtn = document.createElement('button');
        currencyBtn.className = 'btn nav-currency-btn nav-link';
        currencyBtn.type = 'button';
        currencyBtn.style.padding = '6px 8px';
        currencyBtn.style.border = 'none';
        currencyBtn.style.background = 'transparent';
        currencyBtn.style.color = 'inherit';
        currencyBtn.style.cursor = 'pointer';
        currencyBtn.textContent = current;
        currencyBtn.setAttribute('aria-label', 'Change currency');

        // insert next to theme toggle if present in navbar
        const navbarContainer = document.querySelector('.navbar .container-fluid');
        if (!navbarContainer) return;
        const navList = navbarContainer.querySelector('ul.navbar-nav');
        if (!navList) return;

        const li = document.createElement('li');
        li.className = 'nav-item';

        // place after theme toggle li if exists (theme was prepended earlier)
        const first = navList.firstElementChild;
        if (first) navList.insertBefore(li, first.nextElementSibling); else navList.appendChild(li);
        li.appendChild(currencyBtn);

        // click cycles through supported currencies
        currencyBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const cur = getStoredCurrency();
            const idx = SUPPORTED_CURRENCIES.indexOf(cur);
            const next = SUPPORTED_CURRENCIES[(idx + 1) % SUPPORTED_CURRENCIES.length];
            setStoredCurrency(next);
            currencyBtn.textContent = next;
            try { playClickSound(); } catch (e) {}
            await applyCurrencyToPage(next);
            showToast(`Prices switched to ${next}`, 'info');
        });

        // initial apply on load
        (async function initCurrency() {
            const c = getStoredCurrency() || 'USD';
            currencyBtn.textContent = c;
            try { await applyCurrencyToPage(c); } catch (e) { console.warn(e); }
        })();
    })();

    // initialize theme: stored -> system preference -> default light
    (function initTheme() {
        const stored = getStoredTheme();
        if (stored) {
            setTheme(stored);
            return;
        }
        // prefer system preference
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    })();

    // Render auth status in navbar and provide logout action on non-index pages
    (function renderNavbarAuth() {
        const AUTH_CURRENT_KEY = 'timeless-current-user';
        function getCurrentUser() { try { return localStorage.getItem(AUTH_CURRENT_KEY); } catch (e) { return null; } }

        const user = getCurrentUser();
        const navbarContainer = document.querySelector('.navbar .container-fluid');
        if (!navbarContainer) return;

        // ensure we modify the right UL
        const navList = navbarContainer.querySelector('ul.navbar-nav');
        if (!navList) return;

        // remove existing auth node if present
        const existing = document.getElementById('navAuth');
        if (existing) existing.remove();

        const li = document.createElement('li');
        li.id = 'navAuth';
        if (user) {
            li.className = 'nav-item dropdown';
            li.innerHTML = `
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    ${user}
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
                </ul>
            `;
        } else {
            li.className = 'nav-item';
            li.innerHTML = `<a class="nav-link" href="index.html">Login</a>`;
        }

        navList.appendChild(li);

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                try { localStorage.removeItem(AUTH_CURRENT_KEY); } catch (err) {}
                playClickSound();
                showToast('You have been logged out', 'info');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 700);
            });
        }
    })();

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


    // --- Local-storage based auth (login & registration) ---
    (function setupAuth() {
        const AUTH_USERS_KEY = 'timeless-users';
        const AUTH_CURRENT_KEY = 'timeless-current-user';

        function getUsers() {
            try { return JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || '{}'); } catch (e) { return {}; }
        }
        function saveUsers(u) {
            try { localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(u)); } catch (e) {}
        }
        function setCurrentUser(username) {
            try { localStorage.setItem(AUTH_CURRENT_KEY, username); } catch (e) {}
        }
        function getCurrentUser() {
            try { return localStorage.getItem(AUTH_CURRENT_KEY); } catch (e) { return null; }
        }

        // Auto-redirect to catalog if already logged in and on index/root
        const curUser = getCurrentUser();
        const path = window.location.pathname;
        if (curUser && (path.endsWith('index.html') || path === '/' || path === '')) {
            window.location.href = 'catalog.html';
            return;
        }

        const loginForm = document.querySelector('.login-form');
        if (!loginForm) return;

        const loginInput = document.getElementById('login');
        const passwordInput = document.getElementById('password');
        const confirmContainer = document.getElementById('confirmContainer');
        const passwordConfirm = document.getElementById('passwordConfirm');
        const submitBtn = document.getElementById('submitBtn');
        const authToggle = document.getElementById('authToggle');

        function switchToRegister() {
            loginForm.setAttribute('data-mode','register');
            submitBtn.textContent = 'Register';
            confirmContainer.style.display = '';
            authToggle.textContent = 'Already have an account? Login';
        }
        function switchToLogin() {
            loginForm.setAttribute('data-mode','login');
            submitBtn.textContent = 'Login';
            confirmContainer.style.display = 'none';
            authToggle.textContent = "Don't have an account? Register";
        }

        // initial state
        switchToLogin();

        authToggle.addEventListener('click', () => {
            if (loginForm.getAttribute('data-mode') === 'login') switchToRegister(); else switchToLogin();
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = (loginInput.value || '').trim();
            const password = (passwordInput.value || '');

            if (!username) {
                showToast('Please enter a username', 'error');
                loginInput.focus();
                return;
            }

            const mode = loginForm.getAttribute('data-mode') || 'login';
            const users = getUsers();

            if (mode === 'register') {
                const confirm = (passwordConfirm?.value || '');
                if (!password || password.length < 4) {
                    showToast('Password must be at least 4 characters', 'error');
                    passwordInput.focus();
                    return;
                }
                if (password !== confirm) {
                    showToast('Passwords do not match', 'error');
                    passwordConfirm.focus();
                    return;
                }
                if (users[username]) {
                    showToast('User already exists. Please login.', 'error');
                    switchToLogin();
                    return;
                }

                // register
                users[username] = { password: password, createdAt: Date.now() };
                saveUsers(users);
                setCurrentUser(username);
                playSuccessSound();
                showToast('Registration successful! Redirecting...', 'success');
                submitBtn.disabled = true;
                setTimeout(() => window.location.href = 'catalog.html', 900);
                return;
            }

            // login
            if (!users[username]) {
                showToast('User not found. Please register first.', 'error');
                switchToRegister();
                return;
            }

            if (users[username].password !== password) {
                playErrorSound();
                showToast('Incorrect password', 'error');
                passwordInput.focus();
                return;
            }

            // success
            setCurrentUser(username);
            playSuccessSound();
            showToast('Login successful! Redirecting...', 'success');
            submitBtn.disabled = true;
            setTimeout(() => window.location.href = 'catalog.html', 900);
        });
    })();

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

    // --- Cart page: make + and - buttons functional, update per-item subtotal and total ---
    (function setupCartButtons() {
        if (!window.location.href.includes('cart.html')) return;

        function parsePriceText(node) {
            if (!node) return 0;
            const text = (node.textContent || '').replace(/[, ]/g, '');
            const m = text.match(/\$?(\d+(?:\.\d+)?)/);
            return m ? Number(m[1]) : 0;
        }

        function formatCurrency(n) {
            if (Number.isInteger(n)) return '$' + n;
            return '$' + n.toFixed(2);
        }

        const cards = Array.from(document.querySelectorAll('main .card'));
        if (!cards.length) return;

        cards.forEach(card => {
            const btnGroup = card.querySelector('.btn-group');
            if (!btnGroup) return;

            const buttons = btnGroup.querySelectorAll('button');
            if (buttons.length < 2) return;

            const decBtn = buttons[0];
            const incBtn = buttons[buttons.length - 1];
            const qtySpan = btnGroup.querySelector('span') || document.createElement('span');

            const priceEl = card.querySelector('.card-text.text-primary.fw-bold') || card.querySelector('.card-text');
            const unitPrice = parsePriceText(priceEl) || Number(card.dataset.price || 0);
            // store unit price to dataset so we can always compute subtotal
            card.dataset.unitPrice = String(unitPrice);

            // ensure qty is numeric
            let qty = Number(qtySpan.textContent) || 1;
            qty = Math.max(1, Math.min(99, qty));
            qtySpan.textContent = qty;

            function updateDisplay() {
                const subtotal = unitPrice * qty;
                priceEl.textContent = formatCurrency(subtotal);
                updateCartTotal();
            }

            decBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (qty <= 1) return;
                qty--;
                qtySpan.textContent = qty;
                playClickSound();
                updateDisplay();
            });

            incBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (qty >= 99) return;
                qty++;
                qtySpan.textContent = qty;
                playClickSound();
                updateDisplay();
            });

            // initialize per-item display to show subtotal
            updateDisplay();
        });

        function updateCartTotal() {
            const cardsNow = Array.from(document.querySelectorAll('main .card'));
            let total = 0;
            const items = [];

            cardsNow.forEach(c => {
                const unit = Number(c.dataset.unitPrice || 0);
                const q = Number(c.querySelector('.btn-group span')?.textContent || 1);
                const title = c.querySelector('.card-title')?.textContent?.trim() || '';
                const img = c.querySelector('img')?.getAttribute('src') || c.querySelector('img')?.getAttribute('data-src') || '';
                const subtotal = unit * q;
                total += subtotal;
                items.push({ title, price: unit, qty: q, img, subtotal });
            });

            const placeBtn = document.querySelector('a.btn-success');
            if (placeBtn) {
                placeBtn.textContent = `Place Order (${formatCurrency(total)})`;
            }

            // persist cart for order page
            saveCartObject({ total, items, updatedAt: Date.now() });
        }

        // initial total
        updateCartTotal();
    })();

    // Populate order page from localStorage cart
    (function populateOrderPage() {
        if (!window.location.href.includes('order.html')) return;

        const cart = loadCartObject() || { total: 0, items: [] };

        const orderTotalEl = document.getElementById('orderTotal');
        if (orderTotalEl) orderTotalEl.textContent = formatCurrency(cart.total || 0);

        const itemsContainer = document.getElementById('orderItems') || document.querySelector('.row.g-4.mb-4');
        if (!itemsContainer) return;

        itemsContainer.innerHTML = '';

        (cart.items || []).forEach(it => {
            const col = document.createElement('div');
            col.className = 'col-lg-4 col-md-6 col-sm-12';
            col.innerHTML = `
                <div class="card">
                    <img src="${it.img || 'imgs/placeholder.jpg'}" class="card-img-top" alt="${it.title}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${it.title}</h5>
                        <p class="card-text text-primary fw-bold">${formatCurrency(it.price)} × ${it.qty} = ${formatCurrency(it.subtotal)}</p>
                    </div>
                </div>
            `;
            itemsContainer.appendChild(col);
        });

        // Optional: clear cart after rendering order (commented out)
        // localStorage.removeItem('timeless-cart');
    })();

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

    const originalPrices = [];

    $('.card-text.fw-bold.text-primary').each(function() {
        const priceText = $(this).text().trim();

        // Only save prices that contain $
        if (priceText.includes("$")) {
            const numericPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            originalPrices.push({
                text: priceText,
                value: numericPrice
            });
        }
    });

    // Save to localStorage once
    if (originalPrices.length > 0) {
        localStorage.setItem('originalPrices', JSON.stringify(originalPrices));
        console.log('✅ Original USD prices saved to localStorage:', originalPrices);
    }

  });

  window.TimelessInitCounters = setupCounters;

    // Legacy jQuery login handler removed --- using local-storage auth instead

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