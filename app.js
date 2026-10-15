document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animation Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Auto-select Membership Type based on URL param
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    const select = document.getElementById('membershipType');

    if (plan && select) {
        if (plan === 'india') {
            select.value = "Student Member (India) - ₹1,000";
        } else if (plan === 'intl') {
            select.value = "International Member - AED 100";
        }
    }

    // Announcement System
    const announcements = [
        {
            id: 1,
            text: "🚀 Next Workshop: 'Intro to Aeromodelling' on April 4th! Register Now.",
            date: "2026-04-04",
            isImportant: true,
            expiryDate: "2026-04-03"
        },
        {
            id: 2,
            text: "📢 Annual General Meeting scheduled for April 5th.",
            date: "2026-04-05",
            isImportant: false,
            expiryDate: "2026-04-06"
        },
        {
            id: 3,
            text: "Congratulations to our new Student Members!",
            date: "2024-02-10",
            isImportant: false,
            expiryDate: "2024-02-20" // Expired example
        }
    ];

    const announcementContainer = document.getElementById('announcements-container');

    if (announcementContainer) {
        const today = new Date().toISOString().split('T')[0];

        // Filter valid notes
        const activeAnnouncements = announcements
            .filter(a => a.expiryDate >= today)
            .sort((a, b) => b.isImportant - a.isImportant);

        if (activeAnnouncements.length > 0) {
            announcementContainer.style.display = 'block';

            // Create Marquee Container
            const marqueeWrapper = document.createElement('div');
            marqueeWrapper.className = 'marquee-wrapper';

            const marqueeContent = document.createElement('div');
            marqueeContent.className = 'marquee-content';

            // Join all announcements
            activeAnnouncements.forEach(note => {
                const item = document.createElement('span');
                item.className = 'marquee-item';
                item.innerHTML = `${note.isImportant ? '🔥' : '📢'} <b>${note.text}</b> <span class="date">(${new Date(note.date).toLocaleDateString()})</span>`;
                marqueeContent.appendChild(item);
            });

            // Duplicate content for seamless loop
            const clone = marqueeContent.cloneNode(true);
            marqueeWrapper.appendChild(marqueeContent);
            marqueeWrapper.appendChild(clone);

            announcementContainer.innerHTML = ''; // Clear previous
            announcementContainer.appendChild(marqueeWrapper);
        }
    }

    // Header Scroll Logic
    let lastScroll = 0;
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add "scrolled" class for background changes
        if (currentScroll > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        // Hide/Show on scroll logic
        if (currentScroll > lastScroll && currentScroll > 150) {
            // Scrolling down
            header.classList.add('header-hidden');
        } else {
            // Scrolling up
            header.classList.remove('header-hidden');
        }

        lastScroll = currentScroll;
    });
});

// Admin WhatsApp Number
const ADMIN_PHONE = "919600462211";

function handleRegister(event) {
    try {
        event.preventDefault();
        console.log("Registration process initiated...");

        // Define required fields and their labels
        const fields = {
            'membershipType': 'Membership Type',
            'studentName': 'Student Name',
            'grade': 'Grade',
            'school': 'School Name',
            'city': 'City',
            'state': 'State',
            'email': 'Parent Email',
            'contactPhone': 'Contact Number',
            'whatsappPhone': 'WhatsApp Number',
            'transactionId': 'Transaction ID'
        };

        const data = {};
        for (const [id, label] of Object.entries(fields)) {
            const el = document.getElementById(id);
            if (!el) {
                throw new Error(`Technical Error: Field '${label}' (ID: ${id}) not found in the page.`);
            }
            data[id] = el.value.trim();
            if (!data[id]) {
                throw new Error(`Please fill in the ${label} field.`);
            }
        }

        const message = `*New Model Rocketry Society Registration Request*%0A%0A` +
            `*Type:* ${encodeURIComponent(data.membershipType)}%0A` +
            `*Name:* ${encodeURIComponent(data.studentName)}%0A` +
            `*Grade:* ${encodeURIComponent(data.grade)}%0A` +
            `*School:* ${encodeURIComponent(data.school)}%0A` +
            `*City:* ${encodeURIComponent(data.city)}%0A` +
            `*State:* ${encodeURIComponent(data.state)}%0A` +
            `*Parent Email:* ${encodeURIComponent(data.email)}%0A` +
            `*Contact No:* ${encodeURIComponent(data.contactPhone)}%0A` +
            `*WhatsApp No:* ${encodeURIComponent(data.whatsappPhone)}%0A` +
            `*Transaction ID:* ${encodeURIComponent(data.transactionId)}%0A%0A` +
            `Please verify my payment and approve membership.`;

        const whatsappUrl = `https://wa.me/${ADMIN_PHONE}?text=${message}`;

        // Attempt to open WhatsApp
        const waWindow = window.open(whatsappUrl, '_blank');

        // Show success message regardless of window.open result (since it's a redirect)
        const form = document.getElementById('registrationForm');
        if (form) {
            const container = form.closest('.card') || form.parentElement;
            container.innerHTML = `
                <div class="fade-in visible" style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 5rem; margin-bottom: 20px;">🎉</div>
                    <h2 style="color: var(--accent-gold); margin-bottom: 20px; font-family: 'Orbitron', sans-serif;">Registration Form Sent!</h2>
                    
                    <p style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 10px; color: #fff;">
                        Your details have been pre-filled in WhatsApp. 
                    </p>
                    <p style="font-size: 1rem; color: var(--accent-gold); margin-bottom: 30px; opacity: 0.9;">
                        Our team will contact you soon!
                    </p>
                    
                    <div style="background: rgba(74, 163, 223, 0.15); border: 2px solid var(--accent-blue); padding: 25px; border-radius: 15px; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                        <p style="color: #fff; font-weight: 700; font-size: 1.1rem; margin-bottom: 15px;">
                            🚀 FINAL STEP:
                        </p>
                        <p style="color: var(--text-main); line-height: 1.5; margin: 0;">
                            1. Go to the WhatsApp chat that just opened.<br>
                            2. 📎 <strong>Attach</strong> your payment screenshot.<br>
                            3. Click <strong>Send</strong> to finalize your application.
                        </p>
                    </div>
                    <a href="index.html" class="btn" style="display: inline-block;">Return to Home</a>
                </div>
            `;
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } catch (error) {
        console.error("Submission Error:", error);
        alert(error.message || "There was an error submitting your registration. Please try again.");
    }
}
