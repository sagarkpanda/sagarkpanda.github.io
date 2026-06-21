/* ========================================= */
/*           Supabase Like System            */
/* ========================================= */

const SB_URL = 'https://dghpmgmaxkrabkccuprr.supabase.co';
    const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnaHBtZ21heGtyYWJrY2N1cHJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjM2OTMsImV4cCI6MjA4OTg5OTY5M30.jiaAgBQ55EgweW33BUV8uFKssmEPOTxjNQvw4qJ4Lrs';

    async function handleLike() {
        const slug = window.location.pathname;
        const storageKey = 'liked_' + slug;
        const container = document.getElementById('custom-heart-section');
        const btn = document.getElementById('like-btn');
        const countEl = document.getElementById('like-count');

        if (!container || !btn || !countEl) return;

        // --- CASE 1: ALREADY LIKED ---
        // Trigger the "Shake" animation to show it's already done
        if (localStorage.getItem(storageKey)) {
            btn.classList.remove('shake-animation'); // Reset class
            void btn.offsetWidth;                    // Trigger reflow to restart animation
            btn.classList.add('shake-animation');

            // Clean up class after animation (400ms)
            setTimeout(() => btn.classList.remove('shake-animation'), 400);
            return;
        }

        // --- CASE 2: NEW LIKE ---
        // 1. Optimistic UI update (Instant feedback)
        container.classList.add('liked');
        let currentCount = parseInt(countEl.innerText) || 0;
        countEl.innerText = currentCount + 1;

        // 2. Network Request to Supabase
        try {
            const res = await fetch(SB_URL + '/rest/v1/rpc/increment_like', {
                method: 'POST',
                headers: {
                    'apikey': SB_KEY,
                    'Authorization': 'Bearer ' + SB_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ post_id: slug })
            });

            if (res.ok) {
                localStorage.setItem(storageKey, 'true');
            } else {
                throw new Error("Supabase RPC failed");
            }
        } catch (e) {
            console.error("Like Sync Error:", e);
            // Optional: Revert UI if the server is down
            // container.classList.remove('liked');
            // countEl.innerText = currentCount;
        }
    }

    /**
     * Page Load Initialization
     * Syncs UI state with LocalStorage and fetches fresh count
     */
    document.addEventListener('DOMContentLoaded', function() {
        const slug = window.location.pathname;
        const storageKey = 'liked_' + slug;
        const container = document.getElementById('custom-heart-section');
        const countEl = document.getElementById('like-count');

        if (!container || !countEl) return;

        // Check if user already liked this post previously
        if (localStorage.getItem(storageKey)) {
            container.classList.add('liked');
        }

        // Fetch the current like count from Supabase
        fetch(SB_URL + '/rest/v1/likes?id=eq.' + encodeURIComponent(slug) + '&select=count', {
            headers: {
                'apikey': SB_KEY,
                'Authorization': 'Bearer ' + SB_KEY
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data && data[0]) {
                countEl.innerText = data[0].count;
            }
        })
        .catch(err => console.error("Error loading like count:", err));
    });



function openTopic(evt, topicName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tab-button");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }
  const target = document.getElementById(topicName);
  if (target) {
    target.style.display = "block";
    evt.currentTarget.classList.add("active");
  }
}

/* remember page when reloading */
document.addEventListener("DOMContentLoaded", function() {
    // 1. Check if there's a saved tab in localStorage
    const savedTab = localStorage.getItem('activeTab');
    const tabs = document.querySelectorAll('.tab-button');

    if (savedTab) {
        tabs.forEach(tab => {
            // 2. If a tab's text matches the saved name, trigger a click
            if (tab.textContent.trim() === savedTab) {
                tab.click();
            }
        });
    }

    // 3. Listen for clicks on tabs to save the new state
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            localStorage.setItem('activeTab', this.textContent.trim());
        });
    });
});


document.addEventListener("DOMContentLoaded", function() {
    function activateTab() {
        // 1. Get the hash (e.g., 'ci-cd' or 'ansible')
        let hash = window.location.hash.substring(1).toLowerCase();
        if (!hash) return;

        // 2. Clean the hash (replace dashes with spaces to match button text)
        // 'ci-cd' becomes 'ci/cd' or 'ci cd'
        let cleanHash = hash.replace('-', ' ');

        // 3. Find the button by its visible text
        let buttons = document.querySelectorAll('.tab-button');
        let match = Array.from(buttons).find(btn => {
            let btnText = btn.innerText.toLowerCase().trim();
            // This matches if button says "Ci/Cd" and hash is "ci-cd"
            return btnText === cleanHash || btnText.replace('/', ' ') === cleanHash || btnText.replace('/', '-') === hash;
        });

        if (match) {
            // Force a small delay to let the page settle
            setTimeout(() => {
                match.click();
                match.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 50);
        }
    }

    activateTab();
    window.addEventListener('hashchange', activateTab);
});

/* ========================================= */
/*           Lightbox Image Popup            */
/* ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');

  if (!lightbox || !lightboxImg || !closeBtn) {
    return;
  }

  let lightboxOpen = false;

  function openLightbox(src) {
    lightboxImg.src = src;

    document.body.style.overflow = 'hidden';

    lightbox.classList.add('active');

    if (!lightboxOpen) {
      history.pushState({ lightbox: true }, '');
      lightboxOpen = true;
    }
  }

  function closeLightbox(fromHistory = false) {
    lightbox.classList.remove('active');

    document.body.style.overflow = '';

    if (lightboxOpen && !fromHistory) {
      lightboxOpen = false;
      history.back();
    }
  }

  document.querySelectorAll('.lightbox-trigger').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      openLightbox(link.href);
    });
  });

  closeBtn.addEventListener('click', () => closeLightbox());

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });

  window.addEventListener('popstate', () => {
    if (lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lightboxOpen = false;
    }
  });
});