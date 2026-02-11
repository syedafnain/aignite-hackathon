document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM fully loaded");

    /*** 🟢 COUNTDOWN TIMER ***/
    function updateCountdown() {
        const eventDate = new Date("March 8, 2026 00:00:00").getTime();
        const now = new Date().getTime();
        const timeLeft = eventDate - now;

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            document.getElementById("countdown").innerText = 
                `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
            document.getElementById("countdown").innerText = "Registration Closed!";
        }
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    /*** 🟢 PROBLEM STATEMENT MODAL ***/
    const psModal = document.getElementById("psModal");
    const closePsBtn = document.getElementById("closeModal");

    window.openPsModal = function (title, description) {
        document.getElementById("psTitle").innerText = title;
        document.getElementById("psDescription").innerText = description;
        psModal.style.display = "block";
        document.body.classList.add("modal-open");
    };

    if (closePsBtn) {
        closePsBtn.addEventListener("click", function () {
            psModal.style.display = "none";
            document.body.classList.remove("modal-open");
        });
    }

    window.addEventListener("click", function (event) {
        if (event.target === psModal) {
            psModal.style.display = "none";
            document.body.classList.remove("modal-open");
        }
    });

    /*** 🟢 SHOW PROBLEM TITLES ON HOVER ***/
    window.showTitle = function (card, title) {
        let titleElement = card.querySelector(".problem-title");
        if (titleElement) {
            titleElement.innerText = title;
            titleElement.style.opacity = "1";
        }
    };

    window.hideTitle = function (card) {
        let titleElement = card.querySelector(".problem-title");
        if (titleElement) {
            titleElement.innerText = "";
            titleElement.style.opacity = "0";
        }
    };

    /*** 🟢 REGISTRATION MODAL ***/
    const regModal = document.getElementById("registrationModal");
    
    window.openRegistration = function () {
        if (regModal) {
            regModal.style.display = "flex";
            document.body.classList.add("modal-open");
            
            // Clear any previous messages
            const validationMsg = document.getElementById("validationMessage");
            const formMsg = document.getElementById("formMessage");
            if (validationMsg) validationMsg.style.display = "none";
            if (formMsg) formMsg.style.display = "none";
            
            // Reset character counter if it exists
            const charCount = document.getElementById("charCount");
            const solutionText = document.getElementById("solutionExplanation");
            if (charCount && solutionText) {
                charCount.textContent = "0 characters (minimum 100)";
                charCount.style.color = "#666";
                solutionText.value = "";
            }
        }
    };

    // Close registration modal
    const closeRegBtn = regModal ? regModal.querySelector(".close") : null;
    
    if (closeRegBtn) {
        closeRegBtn.addEventListener("click", function () {
            regModal.style.display = "none";
            document.body.classList.remove("modal-open");
        });
    }

    window.addEventListener("click", function (event) {
        if (event.target === regModal) {
            regModal.style.display = "none";
            document.body.classList.remove("modal-open");
        }
    });

    /*** 🟢 REGISTRATION FORM HANDLER ***/
    const registrationForm = document.getElementById("registrationForm");
    
    if (registrationForm) {
        // Character counter for solution explanation
        const solutionTextarea = document.getElementById("solutionExplanation");
        const charCount = document.getElementById("charCount");
        
        if (solutionTextarea && charCount) {
            solutionTextarea.addEventListener("input", function() {
                const count = this.value.length;
                charCount.textContent = count + " characters (minimum 100)";
                charCount.style.color = count < 100 ? "red" : "green";
            });
        }

        // Form submission
        registrationForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            // Validate at least one female member
            const genderSelects = [
                "member1Gender", "member2Gender", "member3Gender", 
                "member4Gender", "member5Gender", "member6Gender"
            ];
            
            let hasFemale = false;
            genderSelects.forEach(function(name) {
                const select = document.querySelector(`select[name="${name}"]`);
                if (select && select.value === "FEMALE") {
                    hasFemale = true;
                }
            });
            
            const validationMsg = document.getElementById("validationMessage");
            if (!hasFemale) {
                if (validationMsg) validationMsg.style.display = "block";
                validationMsg.scrollIntoView({ behavior: "smooth", block: "center" });
                return;
            } else {
                if (validationMsg) validationMsg.style.display = "none";
            }
            
            // Validate solution length
            const solution = document.getElementById("solutionExplanation");
            if (solution.value.length < 100) {
                alert("Please provide at least 100 characters in your solution explanation.");
                solution.focus();
                return;
            }

            // Disable submit button
            const submitBtn = registrationForm.querySelector(".submit-btn");
            const originalBtnText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = "Submitting...";

            try {
                // Collect form data
                const formData = new FormData(registrationForm);
                const formObject = {};
                
                // Convert FormData to JSON object
                for (let [key, value] of formData.entries()) {
                    formObject[key] = value;
                }
                
                // Add terms acceptance
                formObject.termsAccepted = formObject.terms === "on";
                
                console.log("Submitting registration:", formObject);

                // Send to backend (update URL when deployed)
                const response = await fetch("https://aignite-hackathon.onrender.com/api/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formObject)
                });

                const result = await response.json();

                const messageEl = document.getElementById("formMessage");
                if (messageEl) {
                    messageEl.style.display = "block";
                    
                    if (response.ok) {
                        // Success
                        messageEl.style.backgroundColor = "#d4edda";
                        messageEl.style.color = "#155724";
                        messageEl.style.border = "1px solid #c3e6cb";
                        messageEl.textContent = result.message || "✅ Registration successful! We will contact you soon.";
                        
                        // Reset form after 3 seconds
                        setTimeout(() => {
                            registrationForm.reset();
                            if (charCount) {
                                charCount.textContent = "0 characters (minimum 100)";
                                charCount.style.color = "#666";
                            }
                            regModal.style.display = "none";
                            document.body.classList.remove("modal-open");
                        }, 3000);
                    } else {
                        // Error
                        messageEl.style.backgroundColor = "#f8d7da";
                        messageEl.style.color = "#721c24";
                        messageEl.style.border = "1px solid #f5c6cb";
                        messageEl.textContent = result.message || "❌ Registration failed. Please try again.";
                    }
                    
                    messageEl.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                
            } catch (error) {
                console.error("Registration error:", error);
                
                const messageEl = document.getElementById("formMessage");
                if (messageEl) {
                    messageEl.style.display = "block";
                    messageEl.style.backgroundColor = "#f8d7da";
                    messageEl.style.color = "#721c24";
                    messageEl.style.border = "1px solid #f5c6cb";
                    messageEl.textContent = "❌ Network error. Please check your connection and try again.";
                }
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }

    /*** 🟢 ANIMATIONS FOR CARDS ***/
    function animateCards(selector) {
        const cards = document.querySelectorAll(selector);
        cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100 && rect.bottom > 0) {
                setTimeout(() => {
                    card.classList.add("show");
                }, index * 100);
            } else {
                card.classList.remove("show");
            }
        });
    }

    function animateAllSections() {
        animateCards(".problem-card");
        animateCards(".organizer-card");
        animateCards(".prize-box");
        animateCards(".animated-section");
    }

    window.addEventListener("scroll", animateAllSections);
    animateAllSections(); // Run on page load

    /*** 🟢 FIX ORGANIZERS LAYOUT ***/
    function fixOrganizersLayout() {
        const organizersSection = document.querySelector(".organizers");
        if (organizersSection) {
            organizersSection.style.display = "block";
            organizersSection.style.textAlign = "center";
        }
    }
    fixOrganizersLayout();

    /*** 🟢 CLOSE MODALS WITH ESC KEY ***/
    window.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            // Close problem modal
            if (psModal && psModal.style.display === "block") {
                psModal.style.display = "none";
                document.body.classList.remove("modal-open");
            }
            // Close registration modal
            if (regModal && regModal.style.display === "flex") {
                regModal.style.display = "none";
                document.body.classList.remove("modal-open");
            }
        }
    });

    /*** 🟢 PREVENT SCROLLING WHEN MODAL IS OPEN ***/
    // This is handled by adding/removing 'modal-open' class to body
    // Make sure you have this CSS:
    // body.modal-open { overflow: hidden; }

    console.log("✅ All scripts initialized!");
});

/*** 🟢 BACKWARD COMPATIBILITY FUNCTIONS ***/
// These functions are called from HTML onclick attributes

window.openPsModal = function(title, description) {
    const modal = document.getElementById('psModal');
    const modalTitle = document.getElementById('psTitle');
    const modalDescription = document.getElementById('psDescription');
    
    if (modalTitle) modalTitle.innerText = title;
    if (modalDescription) modalDescription.innerText = description;
    if (modal) {
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    }
};

window.closePsModal = function() {
    const modal = document.getElementById('psModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
};

window.showTitle = function(card, title) {
    let titleElement = card.querySelector('.problem-title');
    if (titleElement) {
        titleElement.innerHTML = title;
        titleElement.style.opacity = '1';
    }
};

window.hideTitle = function(card) {
    let titleElement = card.querySelector('.problem-title');
    if (titleElement) {
        titleElement.innerHTML = '';
        titleElement.style.opacity = '0';
    }
};

window.openRegistration = function() {
    const modal = document.getElementById('registrationModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
        
        // Clear previous messages
        const validationMsg = document.getElementById('validationMessage');
        const formMsg = document.getElementById('formMessage');
        if (validationMsg) validationMsg.style.display = 'none';
        if (formMsg) formMsg.style.display = 'none';
    }
};
