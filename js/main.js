/**
 * NISHANT — CINEMATIC EDITORIAL PORTFOLIO 2026
 * Interactive Engine: Loader, Clock, Navigation, Modals, Filter, Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initISTClock();
  initNavigation();
  initWorkRows();
  initProjectsFilter();
  initModals();
  initClipboardToast();
});

/* ==========================================================================
   1. LOADING INTRO SCREEN CONTROLLER
   ========================================================================== */
function initLoader() {
  const loader = document.getElementById('loader-screen');
  const counterEl = document.getElementById('loader-counter');
  const progressCircle = document.getElementById('loader-progress-circle');
  const skipBtn = document.getElementById('loader-skip-btn');

  if (!loader || !counterEl) return;

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let progress = 0;
  const target = 100;
  const circumference = 471.24; // 2 * PI * 75

  function setProgress(val) {
    counterEl.textContent = `${Math.floor(val)}%`;
    if (progressCircle) {
      const offset = circumference - (val / 100) * circumference;
      progressCircle.style.strokeDashoffset = offset;
    }
  }

  function finishLoading() {
    setProgress(100);
    setTimeout(() => {
      loader.classList.add('fade-out');
      document.body.style.overflow = '';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 800);
    }, 300);
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      finishLoading();
    });
  }

  if (prefersReducedMotion) {
    finishLoading();
    return;
  }

  // Prevent scroll during intro
  document.body.style.overflow = 'hidden';

  // Incremental ticker with organic pacing
  const duration = 1800; // 1.8s
  const intervalTime = 20;
  const increment = target / (duration / intervalTime);

  const timer = setInterval(() => {
    progress += increment;
    if (progress >= target) {
      clearInterval(timer);
      finishLoading();
    } else {
      // Nonlinear tick
      setProgress(progress);
    }
  }, intervalTime);
}

/* ==========================================================================
   2. LIVE IST CLOCK
   ========================================================================== */
function initISTClock() {
  const clockEl = document.getElementById('ist-clock-time');
  if (!clockEl) return;

  function updateClock() {
    try {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat('en-GB', options);
      clockEl.textContent = formatter.format(now);
    } catch (e) {
      // Fallback
      const d = new Date();
      clockEl.textContent = d.toTimeString().substring(0, 8);
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   3. NAVIGATION & MOBILE HAMBURGER
   ========================================================================== */
function initNavigation() {
  const hamburger = document.getElementById('hamburger-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      hamburger.classList.toggle('is-active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // Active link scroll observer
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -60% 0px'
    });

    sections.forEach(sec => observer.observe(sec));
  }
}

/* ==========================================================================
   4. WORK SECTION EXPERIMENTS DATA & MODAL PREVIEW
   ========================================================================== */
const WORK_EXPERIMENTS = {
  'sustainability': {
    title: 'Sustainability Prototype',
    field: 'Hackathon // First Year Innovators',
    year: '2025',
    category: 'Hackathon & Green Tech',
    summary: 'A computer vision and local edge-AI prototype built during an overnight national hackathon. It classifies electronic component waste at source and calculates lifecycle footprint metrics directly on low-power hardware.',
    details: `
      <p>Developed in a 36-hour sprint during Nishant's first semester, this prototype explored how lightweight classification models can operate on edge microcontrollers without relying on expensive cloud compute pipelines.</p>
      <p>Key responsibilities included setting up the prompt-chain evaluation pipeline for edge categorization, training a custom micro-classifier, and structuring a rapid web dashboard to stream telemetry in real time.</p>
      <h4>Architectural Highlights:</h4>
      <ul>
        <li>Local inference latency: &lt; 120ms on an embedded quad-core board.</li>
        <li>Dual-tier verification: Prompt-based anomaly detection validates edge confidence scores.</li>
        <li>Zero-waste component lifecycle registry generated automatically in JSON-LD.</li>
      </ul>
    `,
    stack: ['Python', 'Prompt Pipeline', 'Embedded Edge', 'OpenCV', 'REST API']
  },
  'ai-assistant': {
    title: 'AI Study Assistant',
    field: 'Prompting // Cognitive Architecture',
    year: '2026',
    category: 'AI Workflows & Prompt Engineering',
    summary: 'An autonomous pedagogical study partner designed to parse complex university engineering syllabi, decompose lectures into Socratic questioning drills, and identify student conceptual blind spots.',
    details: `
      <p>Rather than relying on generic LLM summaries that encourage passive reading, SyllabusGenie uses rigorous structured prompt engineering to act as an adversarial Socratic examiner.</p>
      <p>The system digests textbook chapters and professor handouts into knowledge graphs, generates targeted test cases for mathematical proofs and memory layouts, and scores student mental models with actionable feedback.</p>
      <h4>Engineering Implementation:</h4>
      <ul>
        <li>Deterministic output enforcement via JSON schema extraction and structured prompt templates.</li>
        <li>Context-window budget optimization maintaining retrieval fidelity across 40-page lecture transcripts.</li>
        <li>Interactive spaced-repetition scheduler with active recall flashcards.</li>
      </ul>
    `,
    stack: ['Prompt Architecture', 'Structured Outputs', 'TypeScript', 'Node.js', 'LLM Agents']
  },
  'terminal-games': {
    title: 'Terminal Games & Engine',
    field: 'C Language // Systems & Memory',
    year: '2026',
    category: 'C Programming & Systems',
    summary: 'A suite of retro ASCII games and an interactive micro-game loop crafted in pure C99. Built without heavy graphics libraries to deeply understand memory buffers, ANSI terminal escape sequences, and cache-friendly structs.',
    details: `
      <p>Built as an exercise in understanding what happens underneath high-level game frameworks. Nishant implemented a custom double-buffered terminal renderer using ANSI escape codes, non-blocking POSIX/Windows terminal I/O, and fixed-timestep physics.</p>
      <p>Includes an ASCII dungeon exploration crawler ("RogueTerminal") and a collision-physics snake engine running at a stable 60 FPS in standard terminal emulators with near-zero CPU footprint.</p>
      <h4>Low-Level Techniques:</h4>
      <ul>
        <li>Contiguous 2D char array framebuffers with delta-drawing to eliminate terminal flicker.</li>
        <li>Arena memory allocation avoiding fragmented heap calls during the main gameplay loop.</li>
        <li>Platform-agnostic terminal polling for raw keyboard scancodes.</li>
      </ul>
    `,
    stack: ['C99', 'Clang / GCC', 'Memory Arenas', 'ANSI Sequences', 'Algorithms']
  }
};

function initWorkRows() {
  const rows = document.querySelectorAll('.work-row[data-work-id]');
  rows.forEach(row => {
    row.addEventListener('click', (e) => {
      e.preventDefault();
      const workId = row.getAttribute('data-work-id');
      const data = WORK_EXPERIMENTS[workId];
      if (data) {
        openModal({
          title: data.title,
          eyebrow: `${data.field} · ${data.year}`,
          htmlContent: `
            <div class="modal-content-prose">
              <p><strong>Overview:</strong> ${data.summary}</p>
              ${data.details}
              <div style="margin-top: 1.5rem;">
                <h5 style="font-family: var(--font-mono); font-size: 0.8125rem; text-transform: uppercase; margin-bottom: 0.5rem; color: var(--ink-charcoal);">Technologies &amp; Disciplines:</h5>
                <div class="project-stack-tags">
                  ${data.stack.map(s => `<span class="project-stack-pill">${s}</span>`).join('')}
                </div>
              </div>
            </div>
          `
        });
      }
    });
  });
}

/* ==========================================================================
   5. REAL PROJECTS FILTERING & EXPLORER
   ========================================================================== */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   6. MODALS CONTROLLER (CASE STUDIES & BLOG READER)
   ========================================================================== */
let activeModalOverlay = null;

function initModals() {
  const overlay = document.getElementById('site-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!overlay) return;

  activeModalOverlay = overlay;

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Attach click listeners to blog cards
  const blogCards = document.querySelectorAll('.blog-card[data-blog-id]');
  blogCards.forEach(card => {
    card.addEventListener('click', () => {
      const blogId = card.getAttribute('data-blog-id');
      loadBlogArticle(blogId);
    });
  });
}

function openModal({ title, eyebrow, htmlContent }) {
  if (!activeModalOverlay) return;

  const titleEl = document.getElementById('modal-title');
  const eyebrowEl = document.getElementById('modal-eyebrow');
  const bodyEl = document.getElementById('modal-body-content');

  if (titleEl) titleEl.textContent = title;
  if (eyebrowEl) eyebrowEl.textContent = eyebrow;
  if (bodyEl) bodyEl.innerHTML = htmlContent;

  activeModalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!activeModalOverlay) return;
  activeModalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Blog Articles Database for Reader Modal
const BLOG_POSTS = {
  'c-mental-model': {
    title: 'Why C is the Ultimate First-Year Mental Model',
    eyebrow: 'Systems & Architecture · 6 Min Read · 2026',
    content: `
      <div class="modal-content-prose">
        <p>In modern computer science programs, there is a recurring debate on whether universities should teach Python, Rust, or C as the first foundational language. Having spent the first year building command line tools and memory allocators in C, my verdict is unwavering: <em>C teaches you the physics of software.</em></p>
        
        <p>When you allocate an array in Python or create an object in JavaScript, the runtime gracefully conceals the underlying operating system contract. You are insulated from byte alignments, heap fragmentation, cache misses, and page faults. But in C, nothing is free and nothing is magical.</p>
        
        <pre><code>// Understanding manual memory boundaries
typedef struct {
    size_t size;
    size_t capacity;
    uint8_t *data;
} ArenaBuffer;

void *arena_push(ArenaBuffer *arena, size_t bytes) {
    if (arena-&gt;size + bytes &gt; arena-&gt;capacity) return NULL;
    void *ptr = &amp;arena-&gt;data[arena-&gt;size];
    arena-&gt;size += (bytes + 7) &amp; ~7; // 64-bit alignment
    return ptr;
}</code></pre>

        <p>Working directly with pointers forced me to think about where data actually lives: in L1/L2 cache lines, on the call stack, or on the heap. When you understand that memory is just a contiguous sequence of numbered lockers, debugging higher-level systems becomes fundamentally intuitive.</p>

        <p>The lesson for every freshman engineer: don't flee from segmentation faults. They are the compiler's most honest teachers.</p>
      </div>
    `
  },
  'prompt-engineering-pipelines': {
    title: 'Prompt Engineering as Functional Architecture',
    eyebrow: 'AI Workflows & Heuristics · 5 Min Read · 2026',
    content: `
      <div class="modal-content-prose">
        <p>Prompt engineering is often misunderstood as "talking nicely to a chatbot." But when applied to production workflows and automated code generation, it ceases to be natural language conversation and becomes <strong>functional pipeline design</strong>.</p>
        
        <p>Just like a unix shell pipeline passes structured byte streams through pipes, an effective AI workflow chains composable, deterministic evaluation steps:</p>
        
        <pre><code>Input Problem 
  -&gt; [Extraction Prompt] (Output: Strict JSON AST)
  -&gt; [Constraint Verification Prompt] (Output: Boolean + Invariant Checks)
  -&gt; [Synthesis Prompt] (Output: Minimal Tested Code Chunk)
  -&gt; Local Compiler / Test Runner</code></pre>

        <p>By enforcing typed JSON outputs and using few-shot counterexamples, we eliminate hallucinations and gain reproducible results. Prompting is simply high-level compiler configuration for probabilistic reasoning engines.</p>

        <p>As first-year students, our superpower is combining low-level systems knowledge with rapid AI-assisted research to build tools at ten times traditional velocity.</p>
      </div>
    `
  },
  'freshman-playbook': {
    title: 'Freshman Playbook: Badminton, Bitwise Math, and Late-Night Builds',
    eyebrow: 'Life & Practice · 4 Min Read · 2026',
    content: `
      <div class="modal-content-prose">
        <p>Entering college as a Computer Science undergrad in India comes with a firehose of new realities: engineering mechanics, discrete mathematics, hackathons, and endless terminal screens. The quickest way to burn out is to live exclusively behind an illuminated 27-inch panel.</p>

        <p>My grounding anchors over the past two semesters have been remarkably analog:</p>
        <ul>
          <li><strong>Badminton court sprints:</strong> Intense physical rallies reset the brain in a way no caffeine or pomodoro timer ever can. You cannot dwell on a dangling pointer while tracking a feather shuttlecock at 200 km/h.</li>
          <li><strong>Drawing and ink studies:</strong> Sketching mechanical concepts and character silhouettes trains visual proportion and patience. Good software UI is just editorial design implemented in code.</li>
          <li><strong>Ambient audio loops:</strong> Binaural drones and minimal synth waves create a focused cognitive chamber for 3-hour deep work sprints.</li>
        </ul>

        <p>Balance isn't something you find; it is an invariant you deliberately maintain in your schedule.</p>
      </div>
    `
  }
};

function loadBlogArticle(blogId) {
  const article = BLOG_POSTS[blogId];
  if (!article) return;

  openModal({
    title: article.title,
    eyebrow: article.eyebrow,
    htmlContent: article.content
  });
}

/* ==========================================================================
   7. EMAIL COPY TO CLIPBOARD & TOAST NOTIFICATION
   ========================================================================== */
function initClipboardToast() {
  const copyBtns = document.querySelectorAll('.copy-email-btn');
  const toast = document.getElementById('toast-msg');

  if (!copyBtns.length || !toast) return;

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'hello@nishant.dev';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showToast(`✓ Copied ${email} to clipboard!`);
        }).catch(() => {
          fallbackCopy(email);
        });
      } else {
        fallbackCopy(email);
      }
    });
  });

  function fallbackCopy(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand('copy');
      showToast(`✓ Copied ${text} to clipboard!`);
    } catch (err) {
      showToast(`Contact: ${text}`);
    }
    document.body.removeChild(input);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
}
