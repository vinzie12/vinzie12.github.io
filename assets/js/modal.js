(() => {
  /* ─── Project Data ─────────────────────────────────── */

  const PROJECTS = [
    {
      id: 1,
      number: '01',
      title: 'Piso Printer System',
      badge: 'IoT + Web',
      shortDesc: 'Pay-per-print kiosk with web control panel, job management, pricing, transaction logs, and hardware controller logic.',
      longDesc: 'A fully integrated IoT-based pay-per-print kiosk system designed to operate autonomously in public spaces. Users insert coins, connect via Wi-Fi, select their files from a mobile-friendly web interface, and print. The admin panel provides real-time monitoring of print jobs, revenue tracking, transaction logs, pricing controls, and printer settings — all managed through a responsive web dashboard.',
      problem: 'Printing services in schools and public spaces often require a person to manage the printer, handle payments, and troubleshoot issues. This creates bottlenecks, long queues, and limits operating hours to when staff is available.',
      solution: 'Built a self-service kiosk that combines coin-operated hardware with a web-based control system. The Arduino handles coin detection and hardware signals, while the PHP web app manages the entire print workflow — from file upload to job queuing to payment verification — eliminating the need for an attendant.',
      features: [
        'Coin-operated payment with real-time balance tracking',
        'Wi-Fi hotspot for mobile file uploads',
        'Print job queue management with priority handling',
        'Admin dashboard with revenue analytics and transaction logs',
        'Remote printer settings and pricing configuration',
        'Hardware status monitoring (ink levels, paper, connectivity)',
        'Multi-file format support (PDF, images, documents)',
        'Session timeout and automatic cleanup'
      ],
      techStack: [
        { name: 'PHP', icon: 'fab fa-php' },
        { name: 'JavaScript', icon: 'fab fa-js' },
        { name: 'MySQL', icon: 'fas fa-database' },
        { name: 'Arduino', icon: 'fas fa-microchip' },
        { name: 'HTML/CSS', icon: 'fab fa-html5' },
        { name: 'Bootstrap', icon: 'fab fa-bootstrap' },
        { name: 'IoT Sensors', icon: 'fas fa-wifi' },
        { name: 'REST API', icon: 'fas fa-plug' }
      ],
      architecture: 'Three-tier architecture: Arduino microcontroller handles coin detection and printer hardware signals, communicating via serial with a Raspberry Pi running the PHP web server. The web app uses MySQL for persistent storage of transactions, settings, and logs. Clients connect to a local Wi-Fi hotspot to access the upload interface.',
      challenges: 'The biggest challenge was reliable coin detection — electrical noise from the printer motor caused false readings on the coin acceptor. Solved this with software debouncing and a moving-average filter on the Arduino. Another challenge was handling concurrent print jobs from multiple connected devices, which was solved with a database-backed queue system with file locking.',
      codeSnippet: '// Coin detection with debounce\nconst DEBOUNCE_MS = 150;\nlet lastPulse = 0;\n\nvoid handleCoinPulse() {\n  unsigned long now = millis();\n  if (now - lastPulse > DEBOUNCE_MS) {\n    coinCount++;\n    updateBalance(coinCount * COIN_VALUE);\n    sendToServer("coin_inserted", coinCount);\n    lastPulse = now;\n  }\n}',
      results: 'Successfully deployed in a school environment, serving 50+ students daily. Reduced print service wait times by 80% and enabled 24/7 printing availability. Generated consistent revenue with zero attendant costs. The admin dashboard allowed remote monitoring, reducing maintenance visits by 60%.',
      lessons: 'Learned the importance of hardware-software integration testing in real environments. Electrical interference, paper jams, and network drops taught me to build robust error handling and recovery mechanisms. Also learned that user experience is critical for kiosks — simplified the upload flow after observing first-time users struggle.',
      future: 'Cloud-based remote management for multiple kiosk locations, mobile payment integration (GCash/Maya), print job estimation with cost preview, and a customer loyalty system with discounted rates for frequent users.',
      images: [
        { url: 'assets/img/Piso_printer/UI/admin_dashboard_1.png', caption: 'Admin Dashboard — Overview', category: 'ui' },
        { url: 'assets/img/Piso_printer/UI/admin_dashboard_2.png', caption: 'Admin Dashboard — Stats', category: 'ui' },
        { url: 'assets/img/Piso_printer/UI/admin_dashboard_logs.png', caption: 'Transaction Logs', category: 'ui' },
        { url: 'assets/img/Piso_printer/UI/admin_dashboard_sett.png', caption: 'Settings Panel', category: 'ui' },
        { url: 'assets/img/Piso_printer/UI/admin_dashboard_sett_printer.jpg', caption: 'Printer Configuration', category: 'ui' },
        { url: 'assets/img/Piso_printer/UI/login_1.png', caption: 'User Login Screen', category: 'ui' },
        { url: 'assets/img/Piso_printer/UI/login_2.png', caption: 'File Selection', category: 'ui' },
        { url: 'assets/img/Piso_printer/UI/login_3.png', caption: 'Print Confirmation', category: 'ui' },
        { url: 'assets/img/Piso_printer/UI/login_insert_coin.jpg', caption: 'Insert Coin Screen', category: 'ui' },
        { url: 'assets/img/Piso_printer/UI/login_insert_coin_2.jpg', caption: 'Coin Inserted — Balance Update', category: 'ui' },
        { url: 'assets/img/Piso_printer/UI/login_insert_coin_3.jpg', caption: 'Balance Ready', category: 'ui' },
        { url: 'assets/img/Piso_printer/UI/login_queueing_1.png', caption: 'Print Queue', category: 'ui' },
        { url: 'assets/img/Piso_printer/UI/wifi_connection_in_phone.jpg', caption: 'Mobile Wi-Fi Connection', category: 'mobile' },
        { url: 'assets/img/Piso_printer/Hardware/hardware_1.jpg', caption: 'Kiosk Enclosure — Front', category: 'hardware' },
        { url: 'assets/img/Piso_printer/Hardware/hardware_2.jpg', caption: 'Internal Wiring', category: 'hardware' },
        { url: 'assets/img/Piso_printer/Hardware/hardware_3.jpg', caption: 'Circuit Board Setup', category: 'hardware' },
        { url: 'assets/img/Piso_printer/Hardware/hardware_4.jpg', caption: 'Coin Acceptor Module', category: 'hardware' },
        { url: 'assets/img/Piso_printer/Hardware/hardware_5.jpg', caption: 'Printer Mount', category: 'hardware' },
        { url: 'assets/img/Piso_printer/Hardware/hardware_6.jpg', caption: 'Power Supply Unit', category: 'hardware' },
        { url: 'assets/img/Piso_printer/Hardware/hardware_7.jpg', caption: 'Completed Build', category: 'hardware' }
      ],
      github: 'https://github.com/vinzie12/pisoprinter',
      demo: null
    },
    {
      id: 2,
      number: '02',
      title: 'Hive Voting & Reward Distribution',
      badge: 'Blockchain',
      shortDesc: 'Automated delegation tracking, curation reward calculation, and vote distribution on Hive blockchain.',
      longDesc: 'An automated backend system that interfaces with the Hive blockchain to track delegation events, enforce a 7-day maturity period before rewards activate, calculate curation rewards proportionally, and distribute upvotes to delegators. Includes caching for API efficiency, structured logging, dry-run testing mode, and graceful error recovery.',
      problem: 'Hive blockchain community leaders who receive delegated HP (Hive Power) need to manually track delegators, calculate fair reward distributions, and execute votes — a tedious, error-prone process that doesn\'t scale as the community grows.',
      solution: 'Built a Node.js automation that runs on a schedule, fetching delegation data from the Hive API, maintaining a local SQLite database of delegators with maturity dates, computing proportional rewards based on delegation size, and executing votes through the blockchain API — all without manual intervention.',
      features: [
        'Automated delegation tracking with maturity enforcement (7-day rule)',
        'Proportional reward calculation based on delegation weight',
        'Vote distribution with configurable voting power limits',
        'SQLite database for persistent delegator state',
        'API response caching to minimize blockchain RPC calls',
        'Comprehensive logging with rotation',
        'Dry-run mode for testing without executing votes',
        'Graceful error handling with automatic retry logic'
      ],
      techStack: [
        { name: 'Node.js', icon: 'fab fa-node-js' },
        { name: 'JavaScript', icon: 'fab fa-js' },
        { name: 'Hive API', icon: 'fas fa-link' },
        { name: 'SQLite', icon: 'fas fa-database' },
        { name: 'Cron Jobs', icon: 'fas fa-clock' },
        { name: 'REST API', icon: 'fas fa-plug' }
      ],
      architecture: 'Single Node.js process running on a scheduled cron job. Fetches delegation data from Hive RPC nodes, processes it through the maturity filter, calculates reward shares, and broadcasts vote transactions. SQLite provides lightweight persistent storage for tracking delegation dates and vote history. A caching layer reduces redundant API calls.',
      challenges: 'Hive RPC nodes can be unreliable — requests sometimes timeout or return stale data. Implemented a multi-node failover system that automatically switches to backup RPC endpoints. Another challenge was ensuring vote timing didn\'t exceed the blockchain\'s voting power regeneration rate, solved with a configurable daily vote budget calculator.',
      codeSnippet: '<span class="code-kw">const</span> delegations = <span class="code-fn">getDelegations</span>(account);\n<span class="code-kw">const</span> matured = delegations.<span class="code-fn">filter</span>(\n  d => <span class="code-fn">daysSince</span>(d.timestamp) >= <span class="code-num">7</span>\n);\n\n<span class="code-kw">const</span> totalHP = matured.<span class="code-fn">reduce</span>(\n  (sum, d) => sum + d.hp, <span class="code-num">0</span>\n);\n\n<span class="code-cm">// Proportional reward distribution</span>\n<span class="code-kw">for</span> (<span class="code-kw">const</span> d <span class="code-kw">of</span> matured) {\n  <span class="code-kw">const</span> share = d.hp / totalHP;\n  <span class="code-kw">const</span> weight = <span class="code-fn">Math.round</span>(\n    share * maxVoteWeight\n  );\n  <span class="code-kw">await</span> <span class="code-fn">broadcastVote</span>(d.delegator, weight);\n}',
      results: 'Handles 100+ delegators reliably with zero manual intervention. Distributes votes daily with fair proportional weighting. Reduced community management time from 2+ hours daily to zero. Has been running continuously for months with 99.9% uptime.',
      lessons: 'Working with blockchain APIs taught me the importance of idempotent operations — if a vote broadcast fails mid-way, the system needs to know what was already sent. Also learned about rate limiting and being a good API citizen when interacting with public RPC nodes.',
      future: 'Web dashboard for delegators to track their rewards in real-time, Telegram/Discord bot notifications for new delegations and vote distributions, support for multiple Hive accounts, and a reward history export feature.',
      images: [],
      github: 'https://github.com/vstorage1002/hive-vote',
      demo: null
    },
    {
      id: 3,
      number: '03',
      title: 'Point of Sale (POS) System',
      badge: 'Web App',
      shortDesc: 'Sales & inventory platform with AJAX-powered controls and real-time database updates.',
      longDesc: 'A comprehensive Point of Sale system built for a company deployment, featuring product catalog management, real-time sales processing, inventory tracking with low-stock alerts, AJAX-powered settings panels, receipt generation, and multi-user role support. Designed for speed and reliability in a retail environment.',
      problem: 'The company was using manual spreadsheets to track sales and inventory, leading to frequent stock discrepancies, lost sales records, and no real-time visibility into business performance. End-of-day reconciliation took hours.',
      solution: 'Developed a web-based POS system that digitizes the entire sales workflow — from scanning/selecting products through checkout to receipt printing. Inventory updates automatically with each sale, managers get real-time dashboards, and all data is stored in MySQL for reliable reporting.',
      features: [
        'Product catalog with categories, images, and barcode support',
        'Real-time sales processing with receipt generation',
        'Inventory management with automatic stock deduction',
        'Low-stock alerts and reorder notifications',
        'AJAX-powered settings with live toggle updates',
        'Multi-user roles (Admin, Cashier, Manager)',
        'Daily/weekly/monthly sales reports with charts',
        'Transaction history with search and filters'
      ],
      techStack: [
        { name: 'PHP', icon: 'fab fa-php' },
        { name: 'MySQL', icon: 'fas fa-database' },
        { name: 'JavaScript', icon: 'fab fa-js' },
        { name: 'jQuery', icon: 'fas fa-code' },
        { name: 'Bootstrap', icon: 'fab fa-bootstrap' },
        { name: 'AJAX', icon: 'fas fa-exchange-alt' },
        { name: 'Chart.js', icon: 'fas fa-chart-bar' }
      ],
      architecture: 'Traditional MVC architecture with PHP handling server-side logic and MySQL for data persistence. The frontend uses Bootstrap for responsive layout and jQuery for AJAX interactions — settings toggles, product searches, and cart updates all happen without page reloads. Reports are generated server-side and rendered with Chart.js.',
      challenges: 'Handling concurrent sales from multiple cashier terminals without inventory conflicts was the primary challenge. Implemented database transactions with row-level locking to prevent overselling. Also had to optimize product search queries to maintain sub-100ms response times even with 10,000+ SKUs.',
      codeSnippet: '<span class="code-cm">// AJAX settings toggle with optimistic UI</span>\n$(<span class="code-str">\'.setting-toggle\'</span>).<span class="code-fn">on</span>(<span class="code-str">\'change\'</span>, <span class="code-kw">function</span>() {\n  <span class="code-kw">const</span> key = $(<span class="code-kw">this</span>).<span class="code-fn">data</span>(<span class="code-str">\'key\'</span>);\n  <span class="code-kw">const</span> val = $(<span class="code-kw">this</span>).<span class="code-fn">is</span>(<span class="code-str">\':checked\'</span>);\n  $.<span class="code-fn">post</span>(<span class="code-str">\'/api/settings\'</span>, {\n    setting: key, value: val\n  }).<span class="code-fn">fail</span>(() => {\n    $(<span class="code-kw">this</span>).<span class="code-fn">prop</span>(<span class="code-str">\'checked\'</span>, !val);\n    <span class="code-fn">showToast</span>(<span class="code-str">\'Update failed\'</span>);\n  });\n});',
      results: 'Deployed across 3 cashier terminals in a retail store. Reduced checkout time by 40% compared to manual processing. Eliminated inventory discrepancies and saved 10+ hours weekly on reconciliation. Sales reports helped identify top products and optimize purchasing decisions.',
      lessons: 'This was my first team project contribution, and it taught me about code organization, consistent naming conventions, and writing maintainable code that others can understand. Also learned the importance of input validation — both client and server-side — after encountering edge cases in production.',
      future: 'Barcode scanner integration for faster product lookup, mobile companion app for managers, cloud backup and multi-branch synchronization, and customer loyalty program with purchase history tracking.',
      images: [
        { url: 'assets/img/POS_system/1.PNG', caption: 'Main Dashboard', category: 'ui' },
        { url: 'assets/img/POS_system/2.PNG', caption: 'Product Catalog', category: 'ui' },
        { url: 'assets/img/POS_system/3.PNG', caption: 'Sales Terminal', category: 'ui' },
        { url: 'assets/img/POS_system/4.PNG', caption: 'Settings Panel', category: 'ui' },
        { url: 'assets/img/POS_system/5.PNG', caption: 'Inventory Management', category: 'ui' },
        { url: 'assets/img/POS_system/6.PNG', caption: 'Sales Reports', category: 'ui' },
        { url: 'assets/img/POS_system/7.PNG', caption: 'Transaction History', category: 'ui' },
        { url: 'assets/img/POS_system/8.PNG', caption: 'Product Details', category: 'ui' },
        { url: 'assets/img/POS_system/10.PNG', caption: 'Order Processing', category: 'ui' },
        { url: 'assets/img/POS_system/11.PNG', caption: 'User Management', category: 'admin' },
        { url: 'assets/img/POS_system/12.PNG', caption: 'Role Permissions', category: 'admin' },
        { url: 'assets/img/POS_system/13.PNG', caption: 'Stock Alerts', category: 'ui' },
        { url: 'assets/img/POS_system/14.PNG', caption: 'Receipt Preview', category: 'ui' },
        { url: 'assets/img/POS_system/15.PNG', caption: 'Daily Summary', category: 'reports' },
        { url: 'assets/img/POS_system/16.PNG', caption: 'Revenue Charts', category: 'reports' },
        { url: 'assets/img/POS_system/17.PNG', caption: 'Category Breakdown', category: 'reports' },
        { url: 'assets/img/POS_system/18.PNG', caption: 'Export Options', category: 'reports' }
      ],
      github: null,
      demo: null
    },
    {
      id: 4,
      number: '04',
      title: 'Scheduling Management System',
      badge: 'Web App',
      shortDesc: 'Internal platform for managing student entries, class schedules, and attendance tracking.',
      longDesc: 'An internal scheduling and attendance management platform built for educational institutions. Teachers can manage student records, create and modify class schedules, track daily attendance, and generate reports. Built from scratch as my first complete web application using a PHP starter template as the foundation.',
      problem: 'Teachers were manually tracking attendance on paper sheets and managing class schedules in spreadsheets. This made it difficult to identify students with attendance issues, generate reports for administration, and handle schedule conflicts across multiple classes.',
      solution: 'Created a centralized web platform where teachers log in, view their class schedules, and mark attendance digitally. The system automatically flags students below attendance thresholds, generates printable reports, and prevents schedule conflicts through validation rules.',
      features: [
        'Student records management with profile details',
        'Class schedule creation with conflict detection',
        'Digital attendance marking with timestamps',
        'Automated attendance threshold alerts',
        'Printable attendance and schedule reports',
        'Teacher dashboard with daily overview',
        'Search and filter across student records',
        'Role-based access (Admin, Teacher)'
      ],
      techStack: [
        { name: 'PHP', icon: 'fab fa-php' },
        { name: 'MySQL', icon: 'fas fa-database' },
        { name: 'JavaScript', icon: 'fab fa-js' },
        { name: 'HTML/CSS', icon: 'fab fa-html5' },
        { name: 'Bootstrap', icon: 'fab fa-bootstrap' }
      ],
      architecture: 'Simple MVC-inspired PHP application with MySQL backend. Uses session-based authentication for multi-user support. The frontend is server-rendered with Bootstrap for responsive layout and minimal JavaScript for interactive elements like date pickers and dynamic form validation.',
      challenges: 'As my first full project, the biggest challenge was structuring the codebase in a maintainable way. Initially had all logic in single files, then refactored into a cleaner separation of concerns. Also struggled with complex SQL queries for generating attendance reports across date ranges and multiple classes.',
      codeSnippet: '<span class="code-cm">// Attendance threshold check</span>\n<span class="code-kw">function</span> <span class="code-fn">checkAttendance</span>($studentId) {\n  $total = <span class="code-fn">getTotalClasses</span>($studentId);\n  $present = <span class="code-fn">getPresent</span>($studentId);\n  $rate = ($present / $total) * <span class="code-num">100</span>;\n\n  <span class="code-kw">if</span> ($rate < <span class="code-num">75</span>) {\n    <span class="code-fn">flagStudent</span>($studentId,\n      <span class="code-str">\'Below threshold\'</span>);\n    <span class="code-fn">notifyTeacher</span>($studentId);\n  }\n  <span class="code-kw">return</span> $rate;\n}',
      results: 'Used internally by 5+ teachers managing 200+ students. Reduced attendance tracking time by 70% compared to paper-based methods. Administration gained instant visibility into attendance patterns, helping identify and support at-risk students earlier.',
      lessons: 'This project was my learning ground for full-stack web development. Learned PHP, MySQL, session management, CRUD operations, and form validation from scratch. The biggest takeaway was the importance of planning database schema before writing code — had to restructure tables twice during development.',
      future: 'Parent notification system via SMS/email, mobile-responsive attendance marking, integration with school\'s existing student information system, and QR code-based attendance for faster check-ins.',
      images: [
        { url: 'assets/img/attendance/attendance_1.png', caption: 'Main Dashboard', category: 'ui' },
        { url: 'assets/img/attendance/attendance_2.png', caption: 'Schedule View', category: 'ui' },
        { url: 'assets/img/attendance/attendance_3.png', caption: 'Student Records', category: 'ui' },
        { url: 'assets/img/attendance/attendance_4.png', caption: 'Attendance Marking', category: 'ui' },
        { url: 'assets/img/attendance/attendance_5.png', caption: 'Reports Generation', category: 'reports' },
        { url: 'assets/img/attendance/attendance_6.png', caption: 'Settings & Configuration', category: 'admin' }
      ],
      github: null,
      demo: null
    }
  ];

  /* ─── DOM refs ─────────────────────────────────────── */

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  const overlay     = $('#projectModal');
  const container   = $('.pm-container', overlay);
  const pmNumber    = $('#pmNumber');
  const pmBadge     = $('#pmBadge');
  const pmTitle     = $('#pmTitle');
  const pmGallery   = $('#pmGallery');
  const pmMainImg   = $('#pmMainImg');
  const pmCounter   = $('#pmCounter');
  const pmCaption   = $('#pmCaption');
  const pmThumbstrip = $('#pmThumbstrip');
  const pmCodeDisplay = $('#pmCodeDisplay');
  const pmCodeInner = $('#pmCodeInner');
  const pmLongDesc  = $('#pmLongDesc');
  const pmProblem   = $('#pmProblem');
  const pmSolution  = $('#pmSolution');
  const pmFeatures  = $('#pmFeatures');
  const pmStack     = $('#pmStack');
  const pmArchitecture = $('#pmArchitecture');
  const pmChallenges = $('#pmChallenges');
  const pmCodeSnippetWrap = $('#pmCodeSnippetWrap');
  const pmCodeSnippet = $('#pmCodeSnippet');
  const pmGalleryFull = $('#pmGalleryFull');
  const pmResults   = $('#pmResults');
  const pmLessons   = $('#pmLessons');
  const pmFuture    = $('#pmFuture');
  const pmFooterLinks = $('#pmFooterLinks');

  if (!overlay) return;

  /* ─── State ────────────────────────────────────────── */

  let currentProject = null;
  let currentImgIdx = 0;
  let previousFocusEl = null;

  /* ─── Open / Close ─────────────────────────────────── */

  function openModal(projectId) {
    const proj = PROJECTS.find(p => p.id === projectId);
    if (!proj) return;

    currentProject = proj;
    currentImgIdx = 0;
    previousFocusEl = document.activeElement;

    populateModal(proj);

    overlay.hidden = false;
    requestAnimationFrame(() => {
      overlay.classList.add('is-open');
    });
    document.body.style.overflow = 'hidden';

    // reset tabs
    $$('.pm-tab', overlay).forEach((t, i) => {
      t.classList.toggle('is-active', i === 0);
      t.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    });
    $$('.pm-panel', overlay).forEach((p, i) => {
      p.classList.toggle('is-active', i === 0);
      p.hidden = i !== 0;
    });

    // scroll to top
    container.scrollTop = 0;

    // focus close button
    setTimeout(() => {
      $('.pm-close', overlay)?.focus();
    }, 100);
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';

    setTimeout(() => {
      overlay.hidden = true;
      currentProject = null;
    }, 320);

    if (previousFocusEl) {
      previousFocusEl.focus();
      previousFocusEl = null;
    }
  }

  /* ─── Populate ─────────────────────────────────────── */

  function populateModal(proj) {
    pmNumber.textContent = proj.number;
    pmBadge.textContent = proj.badge;
    pmTitle.textContent = proj.title;
    pmLongDesc.textContent = proj.longDesc;
    pmProblem.textContent = proj.problem;
    pmSolution.textContent = proj.solution;
    pmArchitecture.textContent = proj.architecture;
    pmChallenges.textContent = proj.challenges;
    pmResults.textContent = proj.results;
    pmLessons.textContent = proj.lessons;
    pmFuture.textContent = proj.future;

    // Features list
    pmFeatures.innerHTML = proj.features.map(f =>
      `<li>${f}</li>`
    ).join('');

    // Tech stack
    pmStack.innerHTML = proj.techStack.map(t =>
      `<span class="pm-stack-item"><i class="${t.icon}"></i> ${t.name}</span>`
    ).join('');

    // Code snippet
    if (proj.codeSnippet) {
      pmCodeSnippetWrap.hidden = false;
      pmCodeSnippet.innerHTML = proj.codeSnippet;
    } else {
      pmCodeSnippetWrap.hidden = true;
    }

    // Gallery vs code display
    if (proj.images.length > 0) {
      pmGallery.hidden = false;
      pmCodeDisplay.hidden = true;
      updateGalleryImage(0);
      renderThumbstrip(proj.images);
    } else {
      pmGallery.hidden = true;
      pmCodeDisplay.hidden = false;
      pmCodeInner.innerHTML = proj.codeSnippet || '';
    }

    // Full gallery tab
    renderFullGallery(proj.images);

    // Footer links
    let linksHtml = '';
    if (proj.github) {
      linksHtml += `<a class="btn btn-sm btn-primary" href="${proj.github}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> View on GitHub</a>`;
    }
    if (proj.demo) {
      linksHtml += `<a class="btn btn-sm btn-ghost" href="${proj.demo}" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> Live Demo</a>`;
    }
    if (!proj.github && !proj.demo) {
      linksHtml = `<span class="bento-note"><i class="fas fa-lock"></i> Private / internal project</span>`;
    }
    pmFooterLinks.innerHTML = linksHtml;
  }

  /* ─── Gallery ──────────────────────────────────────── */

  function updateGalleryImage(idx) {
    if (!currentProject || currentProject.images.length === 0) return;
    const images = currentProject.images;
    idx = ((idx % images.length) + images.length) % images.length;
    currentImgIdx = idx;

    pmMainImg.classList.add('is-loading');
    const img = new Image();
    img.onload = () => {
      pmMainImg.src = img.src;
      pmMainImg.alt = images[idx].caption;
      pmMainImg.classList.remove('is-loading');
    };
    img.onerror = () => {
      pmMainImg.src = images[idx].url;
      pmMainImg.alt = images[idx].caption;
      pmMainImg.classList.remove('is-loading');
    };
    img.src = images[idx].url;

    pmCounter.textContent = `${idx + 1} / ${images.length}`;
    pmCaption.textContent = images[idx].caption;

    // highlight thumbstrip
    $$('.pm-thumbstrip button', overlay).forEach((btn, i) => {
      btn.classList.toggle('is-active', i === idx);
    });
  }

  function renderThumbstrip(images) {
    pmThumbstrip.innerHTML = images.map((img, i) =>
      `<button type="button" class="${i === 0 ? 'is-active' : ''}" aria-label="${img.caption}" data-idx="${i}">
        <img src="${img.url}" alt="" loading="lazy" />
      </button>`
    ).join('');
  }

  function renderFullGallery(images) {
    if (images.length === 0) {
      pmGalleryFull.innerHTML = '<p class="pm-text" style="text-align:center;padding:40px 0;">This project uses a code-based display. Check the Technical tab for code details.</p>';
      return;
    }

    // group by category
    const cats = {};
    const catLabels = {
      ui: 'UI Screenshots',
      mobile: 'Mobile Views',
      hardware: 'Hardware',
      admin: 'Admin Panels',
      reports: 'Reports'
    };

    images.forEach((img, i) => {
      const cat = img.category || 'ui';
      if (!cats[cat]) cats[cat] = [];
      cats[cat].push({ ...img, globalIdx: i });
    });

    let html = '';
    for (const [cat, items] of Object.entries(cats)) {
      html += `<div class="pm-gallery-cat">${catLabels[cat] || cat}</div>`;
      items.forEach(img => {
        html += `<div class="pm-gallery-item" data-idx="${img.globalIdx}">
          <img src="${img.url}" alt="${img.caption}" loading="lazy" />
          <span class="pm-gallery-item-caption">${img.caption}</span>
        </div>`;
      });
    }
    pmGalleryFull.innerHTML = html;
  }

  /* ─── Tabs ─────────────────────────────────────────── */

  function switchTab(tabName) {
    const panels = { overview: 'panelOverview', technical: 'panelTechnical', gallery: 'panelGallery', impact: 'panelImpact' };

    $$('.pm-tab', overlay).forEach(t => {
      const active = t.dataset.tab === tabName;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    $$('.pm-panel', overlay).forEach(p => {
      const active = p.id === panels[tabName];
      p.classList.toggle('is-active', active);
      p.hidden = !active;
    });
  }

  /* ─── Prev / Next Project ──────────────────────────── */

  function navigateProject(dir) {
    if (!currentProject) return;
    const idx = PROJECTS.findIndex(p => p.id === currentProject.id);
    const next = ((idx + dir) % PROJECTS.length + PROJECTS.length) % PROJECTS.length;
    openModal(PROJECTS[next].id);
  }

  /* ─── Focus Trap ───────────────────────────────────── */

  function trapFocus(e) {
    if (!overlay.classList.contains('is-open')) return;

    const focusable = $$('button:not([disabled]), a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])', container);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* ─── Touch Swipe ──────────────────────────────────── */

  let touchStartX = 0;
  let touchStartY = 0;

  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    if (!currentProject || currentProject.images.length === 0) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) updateGalleryImage(currentImgIdx - 1);
      else updateGalleryImage(currentImgIdx + 1);
    }
  }

  /* ─── Event Binding ────────────────────────────────── */

  // Close triggers
  overlay.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) {
      closeModal();
    }
  });

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeModal();
    }

    if (!overlay.classList.contains('is-open')) return;

    // Arrow keys for gallery
    if (e.key === 'ArrowLeft' && currentProject?.images.length > 0) {
      updateGalleryImage(currentImgIdx - 1);
    }
    if (e.key === 'ArrowRight' && currentProject?.images.length > 0) {
      updateGalleryImage(currentImgIdx + 1);
    }

    // Focus trap
    if (e.key === 'Tab') {
      trapFocus(e);
    }
  });

  // Gallery arrows
  $('#pmPrev')?.addEventListener('click', () => updateGalleryImage(currentImgIdx - 1));
  $('#pmNext')?.addEventListener('click', () => updateGalleryImage(currentImgIdx + 1));

  // Thumbstrip clicks
  pmThumbstrip?.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const idx = parseInt(btn.dataset.idx, 10);
    if (!isNaN(idx)) updateGalleryImage(idx);
  });

  // Full gallery click → switch to main gallery view
  pmGalleryFull?.addEventListener('click', (e) => {
    const item = e.target.closest('.pm-gallery-item');
    if (!item) return;
    const idx = parseInt(item.dataset.idx, 10);
    if (!isNaN(idx)) {
      switchTab('overview');
      // small delay so tab switches first
      setTimeout(() => {
        updateGalleryImage(idx);
        container.scrollTop = 0;
      }, 60);
    }
  });

  // Tabs
  overlay.addEventListener('click', (e) => {
    const tab = e.target.closest('.pm-tab');
    if (tab) switchTab(tab.dataset.tab);
  });

  // Prev / Next project
  $('#pmPrevProject')?.addEventListener('click', () => navigateProject(-1));
  $('#pmNextProject')?.addEventListener('click', () => navigateProject(1));

  // Touch swipe on gallery
  const mainWrap = $('.pm-main-img-wrap', overlay);
  if (mainWrap) {
    mainWrap.addEventListener('touchstart', handleTouchStart, { passive: true });
    mainWrap.addEventListener('touchend', handleTouchEnd, { passive: true });
  }

  /* ─── Bento Card Triggers ──────────────────────────── */

  function initBentoCardTriggers() {
    $$('.bento-card').forEach((card, i) => {
      // add data-project-id
      card.dataset.projectId = PROJECTS[i]?.id || '';

      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `View details: ${PROJECTS[i]?.title || 'Project'}`);

      // add "View Details" hint
      if (!$('.bento-view-hint', card)) {
        const hint = document.createElement('span');
        hint.className = 'bento-view-hint';
        hint.innerHTML = '<i class="fas fa-expand"></i> View Details';
        // insert into overlay div so it's above the content
        const overlayDiv = $('.bento-overlay', card);
        if (overlayDiv) overlayDiv.appendChild(hint);
      }

      card.addEventListener('click', (e) => {
        // don't trigger modal if clicking a link or button inside the card
        if (e.target.closest('a[href], .bento-thumb')) return;
        const pid = parseInt(card.dataset.projectId, 10);
        if (pid) openModal(pid);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const pid = parseInt(card.dataset.projectId, 10);
          if (pid) openModal(pid);
        }
      });
    });
  }

  /* ─── Init ─────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBentoCardTriggers);
  } else {
    initBentoCardTriggers();
  }

})();
