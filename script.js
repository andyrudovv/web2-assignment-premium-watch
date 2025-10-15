document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.querySelector(".login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const loginInput = document.getElementById("login");
            const passwordInput = document.getElementById("password");

            // Basic validation
            if (!loginInput.value.trim()) {
                alert("Please enter your login.");
                loginInput.focus();
                return;
            }

            if (passwordInput.value.length < 6) {
                alert("Password must be at least 6 characters long.");
                passwordInput.focus();
                return;
            }

            // Passed validation → redirect to catalog
            window.location.href = "catalog.html";
        });
    }

    const accordionHeaders = document.querySelectorAll(".accordion-header");
    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const content = header.nextElementSibling;
            content.classList.toggle("show");

            if (content.classList.contains("show")) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
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
        alert("Thank you for subscribing!");
        popup.style.display = "none";
    });

    const colorBtn = document.createElement("button");
    colorBtn.textContent = "Change Background Color";
    colorBtn.classList.add("btn", "btn-success", "color-btn");
    colorBtn.style.position = "fixed";
    colorBtn.style.bottom = "20px";
    colorBtn.style.right = "20px";
    document.body.appendChild(colorBtn);

    const colors = ["#E6E6FA", "#FFF8DC", "#E0FFFF", "#F0FFF0", "#FFFAFA", "#F5F5DC"];
    colorBtn.addEventListener("click", () => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.style.backgroundColor = randomColor;
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
        dateTimeBlock.textContent = formatted;
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);
});
