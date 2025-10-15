// -----------------------
// Main script for site
// -----------------------

// Typing animation
const roles = ["Data Scientist", "Dashboard Developer", "ML Engineer"];
const typingSpan = document.querySelector(".typing-role");
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  if (!typingSpan) return;
  const current = roles[roleIndex];
  if (isDeleting) {
    typingSpan.textContent = current.substring(0, charIndex--);
    if (charIndex < 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeEffect, 500);
    } else {
      setTimeout(typeEffect, 50);
    }
  } else {
    typingSpan.textContent = current.substring(0, charIndex++);
    if (charIndex > current.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1500);
    } else {
      setTimeout(typeEffect, 100);
    }
  }
}
typeEffect();

// -----------------------
// Modal & Razorpay setup
// -----------------------
const openModalBtn = document.getElementById("openModalBtn");
const openModalBtnHero = document.getElementById("openModalBtnHero");
const paidConsultBtn = document.getElementById("paidConsultBtn");
const paymentModal = document.getElementById("paymentModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const payButton = document.getElementById("payButton");
const quickBook = document.getElementById("quickBook");
const showPricing = document.getElementById("showPricing");

function showModal() {
  if (!paymentModal) return;
  paymentModal.classList.remove("hidden");
  paymentModal.classList.add("flex");
  // focus first input
  const name = document.getElementById("modal_name");
  if (name) name.focus();
}

function closeModal() {
  if (!paymentModal) return;
  paymentModal.classList.add("hidden");
  paymentModal.classList.remove("flex");
}

// open modal from header + hero
if (openModalBtn) openModalBtn.addEventListener("click", showModal);
if (openModalBtnHero) openModalBtnHero.addEventListener("click", showModal);
if (paidConsultBtn) paidConsultBtn.addEventListener("click", showModal);
if (quickBook) quickBook.addEventListener("click", showModal);
if (showPricing) showPricing.addEventListener("click", () => { window.location.href = "#services"; });

if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);

// Close modal on backdrop click
if (paymentModal) {
  paymentModal.addEventListener("click", (e) => {
    if (e.target === paymentModal) closeModal();
  });
}

// Razorpay integration
if (payButton) {
  payButton.addEventListener("click", (e) => {
    e.preventDefault();

    // Collect optional prefill values
    const prefillName = document.getElementById("modal_name") ? document.getElementById("modal_name").value.trim() : "";
    const prefillEmail = document.getElementById("modal_email") ? document.getElementById("modal_email").value.trim() : "";

    const options = {
      key: "rzp_test_XXXXXXXXXXXXXXXX", // <-- REPLACE with your Razorpay key id
      amount: 49900, // ₹499 in paise
      currency: "INR",
      name: "Deepak Kumar",
      description: "30-min Consultation Call",
      image: "your-logo-url-here", // optional
      handler: function (response) {
        // Payment success handler
        try {
          alert("✅ Payment successful! Payment ID: " + response.razorpay_payment_id);
        } catch (err) {
          console.log("Payment success callback error:", err);
        }
        closeModal();
        // Optionally, you could call a backend to create the appointment here.
        // e.g., send payment id + name/email + slot to your server.
      },
      prefill: {
        name: prefillName,
        email: prefillEmail,
      },
      theme: {
        color: "#3B82F6"
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  });
}

// -----------------------
// EmailJS contact form
// -----------------------
(function () {
  if (window.emailjs) {
    // initialize will be called in index.html's inline or you can initialize here:
    try {
      emailjs.init('YOUR_EMAILJS_USER_ID'); // <-- REPLACE with your EmailJS user ID
    } catch (e) {
      // ignore if already initialized
    }
  }

  const sendBtn = document.getElementById('sendBtn');
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');

  if (sendBtn && form) {
    sendBtn.addEventListener('click', function () {
      statusEl.textContent = '';

      const name = document.getElementById('user_name').value.trim();
      const email = document.getElementById('user_email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        statusEl.textContent = 'Please fill name, email and message before sending.';
        return;
      }

      sendBtn.disabled = true;
      sendBtn.textContent = 'Sending...';

      // send via EmailJS - replace service and template IDs
      if (window.emailjs) {
        emailjs.send(
          'YOUR_SERVICE_ID',    // <-- REPLACE with your EmailJS service ID
          'YOUR_TEMPLATE_ID',   // <-- REPLACE with your EmailJS template ID
          {
            user_name: name,
            user_email: email,
            subject: document.getElementById('subject').value || '(no subject)',
            message: message
          }
        ).then(function (response) {
          statusEl.textContent = 'Thanks — your message has been sent. I will reply within 48 hours.';
          form.reset();
        }, function (error) {
          console.error('EmailJS error:', error);
          statusEl.textContent = 'Sorry — something went wrong while sending. You can also email me directly.';
        }).finally(function () {
          sendBtn.disabled = false;
          sendBtn.textContent = 'Send Message';
        });
      } else {
        statusEl.textContent = 'Email service not initialized. Please contact directly.';
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send Message';
      }
    });
  }
})();
