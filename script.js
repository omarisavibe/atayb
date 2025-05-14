// --- ATYAB EL WAHAT SCRIPT - PREMIUM DATES (v_SatelliteAndDetails_Dates_Visual_MobileEnhanced) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("----- ATYAB EL WAHAT STARTUP (v_MobileEnhanced) ----- DOM loaded.");

    // --- SUPABASE CLIENT SETUP ---
    const SUPABASE_URL = 'https://lhodhrpfbetqrjfbdxzm.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxob2RocnBmYmV0cXJqZmJkeHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNDY1MzAsImV4cCI6MjA2MjcyMjUzMH0.2XLcTLZU0rBo8sy7fPKzSX-25dBLD6m2zlZK2Gi2IDc';

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL.includes("YOUR_SUPABASE_URL") || SUPABASE_ANON_KEY.includes("YOUR_SUPABASE_ANON_KEY")) {
        console.error("🛑 توقف! مفاتيح Supabase مفقودة أو افتراضية في script.js. يجب إصلاحها فوراً!");
        alert("تنبيه إداري عاجل! الرجاء إصلاح مفاتيح Supabase في script.js! النظام لن يعمل بدونها!");
        const grid = document.getElementById('product-grid');
        if (grid) grid.innerHTML = '<p style="color: var(--brand-gold); text-align: center; font-weight: bold; font-size: 1.5rem; padding: 2rem;">💀 خطأ فادح في الإعداد: فشل الاتصال بخادم البيانات.</p>';
        return;
    }

    let supabase;
    try {
        if (!window.supabase) {
            throw new Error("مكتبة Supabase client الأساسية غير موجودة. يرجى التأكد من تضمينها بشكل صحيح في ملف HTML.");
        }
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("✅ Supabase client جاهز. لنبدأ رحلة أطايب الواحات!");
    } catch (error) {
        console.error("🔥 فشل تهيئة Supabase client:", error);
        alert("حدث خطأ في الاتصال بقاعدة بيانات أطايب الواحات. قد يساعد تحديث الصفحة. تفاصيل الخطأ: " + error.message);
        const grid = document.getElementById('product-grid');
        if (grid) grid.innerHTML = '<p style="color: var(--error-color); text-align: center; font-weight: bold;">🗼 خطأ اتصال حرج: فشل تحميل كنوز تمور الواحات.</p>';
        return;
    }

    let leafletAvailable = true;
    let geocoderAvailable = true;
    if (typeof L === 'undefined') {
        console.error("🛑 مكتبة Leaflet (L) للخرائط غير موجودة. ميزات تحديد الموقع معطلة.");
        leafletAvailable = false;
    } else {
        console.log("✅ مكتبة Leaflet (L) للخرائط موجودة وجاهزة.");
        if (typeof L.Control.Geocoder === 'undefined') {
            console.warn("⚠️ إضافة Leaflet Geocoder (L.Control.Geocoder) للبحث عن العناوين غير موجودة. وظيفة البحث في الخريطة قد تكون محدودة.");
            geocoderAvailable = false;
        } else {
            console.log("✅ إضافة Leaflet Geocoder للبحث عن العناوين موجودة.");
        }
    }

    // --- DOM ELEMENTS CACHE ---
    console.log("جاري البحث عن عناصر الواجهة الرئيسية لأطايب الواحات...");
    const productGrid = document.getElementById('product-grid');
    const cartButton = document.getElementById('cart-button');
    const closeCartButton = document.getElementById('close-cart-button');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutButton = document.getElementById('checkout-button');
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutOverlay = document.getElementById('checkout-overlay');
    const closeCheckoutButton = document.getElementById('close-checkout-button');
    const checkoutForm = document.getElementById('checkout-form');
    const customerNameInput = document.getElementById('customer_name');
    const customerPhoneInput = document.getElementById('customer_phone');
    const buildingDetailsInput = document.getElementById('building_details');
    const floorAptInput = document.getElementById('floor_apt');
    const landmarksInput = document.getElementById('landmarks');
    const mapContainer = document.getElementById('map-container');
    const locationStatus = document.getElementById('location-status');
    const customerLatitudeInput = document.getElementById('customer_latitude');
    const customerLongitudeInput = document.getElementById('customer_longitude');
    const findMeButton = document.getElementById('find-me-button');
    const checkoutSummary = document.getElementById('checkout-summary');
    const checkoutTotalPriceElement = document.getElementById('checkout-total-price');
    const submitOrderButton = document.getElementById('submit-order-button');
    const checkoutMessage = document.getElementById('checkout-message');
    const yearSpan = document.getElementById('year');
    const loadingIndicator = document.getElementById('loading-indicator');
    const bodyElement = document.body;
    const paymentMethodSelection = document.querySelector('.payment-method-selection');
    const paymentTotalReminders = document.querySelectorAll('.payment-total-reminder');

    const dateSizeSelectionScreen = document.getElementById('date-size-selection-screen');
    const packWeightSelectionScreen = document.getElementById('pack-weight-selection-screen');
    const productDisplayScreen = document.getElementById('product-display-screen');
    const dateSizeOptions = dateSizeSelectionScreen.querySelectorAll('.size-option-card');
    const packWeightOptions = packWeightSelectionScreen.querySelectorAll('.option-button');
    const selectedDateSizeDisplay = document.getElementById('selected-date-size-display');
    const finalProductSelectionInfo = document.getElementById('final-product-selection-info');
    const backToSizeSelectionButton = document.getElementById('back-to-size-selection');
    const backToWeightSelectionButton = document.getElementById('back-to-weight-selection');
    const mobileMenuToggleBtn = document.getElementById('mobile-menu-toggle-btn'); // For enabling/disabling
    const mainNavElement = document.getElementById('main-nav'); // For menu logic


    if (!productGrid || !cartButton || !cartSidebar || !cartOverlay || !cartCount || !cartItemsContainer || !cartTotalPrice ||
        !checkoutButton || !checkoutModal || !checkoutOverlay || !closeCheckoutButton || !checkoutForm || !submitOrderButton ||
        !customerNameInput || !customerPhoneInput || !checkoutSummary || !checkoutTotalPriceElement || !paymentMethodSelection || paymentTotalReminders.length === 0 ||
        !buildingDetailsInput || !floorAptInput || !landmarksInput ||
        (leafletAvailable && (!mapContainer || !locationStatus || !customerLatitudeInput || !customerLongitudeInput || !findMeButton)) ||
        !dateSizeSelectionScreen || !packWeightSelectionScreen || !productDisplayScreen || !dateSizeOptions.length || !packWeightOptions.length || !selectedDateSizeDisplay || !finalProductSelectionInfo || !backToSizeSelectionButton || !backToWeightSelectionButton || !mobileMenuToggleBtn || !mainNavElement
    ) {
        console.error("🛑 عناصر HTML حرجة مفقودة! يرجى التحقق بدقة من المعرفات والفئات في ملف HTML الخاص بك ومقارنتها بالسكربت (بما في ذلك عناصر الخريطة، حقول العنوان الجديدة، شاشات الاختيار، وقائمة التنقل).");
        alert("عفوًا! يبدو أن بعض الأجزاء الأساسية من واجهة مستخدم أطايب الواحات مفقودة في ملف HTML. لا يمكن تشغيل الصفحة بشكل صحيح.");
        if (bodyElement) bodyElement.innerHTML = '<h1 style="color: var(--brand-gold); text-align: center; padding: 50px;">خطأ حرج في تصميم الواجهة: عناصر الصفحة غير مكتملة.</h1>';
        return;
    }
    console.log("✅ تم العثور بنجاح على جميع عناصر واجهة المستخدم المطلوبة.");
    if (!leafletAvailable && mapContainer) {
        mapContainer.innerHTML = '<p style="color: var(--error-color); text-align: center; padding: 20px;">عفواً، فشل تحميل مكتبة الخرائط. خدمة تحديد الموقع غير متاحة حالياً.</p>';
    }

    // --- STATE MANAGEMENT ---
    let cart = [];
    let allProducts = [];
    let filteredProducts = [];
    let isCartOpen = false;
    let isCheckoutOpen = false;
    let isSubmitting = false;
    let mapInstance = null;
    let markerInstance = null;
    let geocoderControl = null;
    let layerControl = null;
    let selectedDateSize = null;
    let selectedPackWeight = null;

    // --- DELIVERY ZONE & MAP CONFIG ---
    const DELIVERY_ZONE = { minLat: 29.85, maxLat: 30.25, minLng: 31.00, maxLng: 31.65 };
    const DEFAULT_MAP_CENTER = [30.0444, 31.2357];
    const DEFAULT_MAP_ZOOM = 10;
    const LOCATION_FOUND_ZOOM = 17;

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, attribution: '© <a href="http://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> مساهمون'
    });
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19, attribution: 'Tiles © <a href="https://www.esri.com" target="_blank" rel="noopener">Esri</a>'
    });
    console.log("منطقة التوصيل المعتمدة (تقريبي):", DELIVERY_ZONE);

    // --- UTILITY FUNCTIONS ---
    const formatCurrency = (amount) => { /* ... as before ... */ return `${(typeof amount === 'number' ? amount : 0).toFixed(2)} ج.م`; };
    const temporaryClass = (element, className, duration = 500) => { /* ... as before ... */ };
    const showNotification = (message, type = 'info', duration = 3500) => { /* ... as before, but adjust duration if needed ... */
        // (notification creation logic)
        // console.log(`إشعار أطايب الواحات [${type}]: ${message}`);
        const existingNotification = document.getElementById('site-notification');
        if (existingNotification) existingNotification.remove();

        const notification = document.createElement('div');
        notification.id = 'site-notification';
        notification.className = `notification notification-${type}`; // CSS handles specific styling
        notification.setAttribute('role', 'alert');
        notification.textContent = message;
        document.body.appendChild(notification);
        void notification.offsetWidth; // Trigger reflow for CSS animation
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
            // Remove the element after the transition/animation completes
            notification.addEventListener('transitionend', () => notification.remove(), { once: true });
        }, duration);
        console.log(`إشعار [${type}]: ${message}`);
    };


    // --- Navigation Between Selection Screens ---
    function showScreen(screenToShow) { /* ... as before ... */
        [dateSizeSelectionScreen, packWeightSelectionScreen, productDisplayScreen].forEach(screen => {
            screen.style.display = 'none';
            screen.classList.remove('active-screen');
        });
        screenToShow.style.display = 'flex'; // Keep flex for centering
        screenToShow.classList.add('active-screen');
        // Smooth scroll to the top of the new screen, considering sticky header height
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
        window.scrollTo({ top: screenToShow.offsetTop - headerHeight - 20 , behavior: 'smooth' });
    }
    
    dateSizeOptions.forEach(card => { /* ... as before, ensure card selector is still correct ... */
        card.addEventListener('click', () => {
            selectedDateSize = card.dataset.size;
            dateSizeOptions.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            console.log("حجم التمر المختار من الواحات:", selectedDateSize);
            selectedDateSizeDisplay.textContent = selectedDateSize;
            packWeightOptions.forEach(btn => btn.classList.remove('selected'));
            selectedPackWeight = null;
            showScreen(packWeightSelectionScreen);
        });
    });

    packWeightOptions.forEach(button => { /* ... as before ... */
        button.addEventListener('click', () => {
            selectedPackWeight = parseInt(button.dataset.weight);
            packWeightOptions.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            console.log("وزن العبوة المختار من تمور الواحات:", selectedPackWeight, "جم");
            filterAndDisplayProducts();
            showScreen(productDisplayScreen);
        });
    });
    
    backToSizeSelectionButton.addEventListener('click', () => { /* ... as before ... */ });
    backToWeightSelectionButton.addEventListener('click', () => { /* ... as before ... */ });

    // --- CORE FUNCTIONS ---
    const updateCartUI = () => { /* ... as before ... use specific branding in messages ... */
        // ...
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-message fade-in">سلتك تنتظر أطايب الواحات. ابدأ رحلة الاختيار الآن!</p>';
        } else {
            // ...
        }
        // ...
        try {
             localStorage.setItem('atyabElWahatCart', JSON.stringify(cart)); // Key is 'atyabElWahatCart'
        } catch (e) {
            console.error("فشل حفظ السلة في localStorage:", e);
             showNotification("عفواً، لم نتمكن من حفظ تغييرات السلة بشكل صحيح.", "error");
        }
        // ...
    };

    const addToCart = (productId, buttonElement) => { /* ... as before, update notification text ... */
        const product = allProducts.find(p => p.id === productId);
        if (!product) { /* ... */ return; }
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
            showNotification(`+١ ${product.name_ar}! اختيارك يزداد روعة مع كنوز الواحات.`, 'info', 2500);
        } else {
            cart.push({ id: productId, quantity: 1 });
            showNotification(`تمت إضافة ${product.name_ar} إلى سلتك! ذوق رفيع يليق بك.`, 'success');
        }
        /* ... button/cart animation ... */
        updateCartUI();
    };
    const removeFromCart = (productId) => { /* ... as before, ensure smooth animation still works with new CSS ... */ };
    const increaseQuantity = (productId) => { /* ... as before ... */ };
    const decreaseQuantity = (productId) => { /* ... as before ... */ };

    const openCart = () => { /* ... as before, also ensure body overlay logic works with mobile menu ... */
        if (isCheckoutOpen) closeCheckout(); // Close checkout if open
        if (mainNavElement.classList.contains('active')) { // Close mobile menu if open
            mobileMenuToggleBtn.click();
        }
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        bodyElement.classList.add('overlay-active', 'cart-open');
        isCartOpen = true;
    };
    const closeCart = () => { /* ... as before ... */
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        bodyElement.classList.remove('overlay-active', 'cart-open');
        isCartOpen = false;
    };
    
    // --- Map and Checkout logic ---
    const updateLocation = (lat, lng, locationName = null) => { /* ... as before ... ensure status messages are good */ };
    const findUserLocation = (initialLoad = false) => { /* ... as before ... maybe adjust timeout for mobile if needed */ };
    const initializeMap = () => { /* ... as before ... the new Leaflet control CSS should apply here */
        if (!leafletAvailable || !mapContainer) {
             if (mapContainer) mapContainer.innerHTML = '<p style="color: var(--error-color); text-align: center; padding: 20px;">خطأ فني: فشل تحميل مكتبة الخرائط. يرجى المحاولة لاحقاً.</p>';
             return;
        }
        if (mapInstance) { 
            try { mapInstance.remove(); } catch(e) { console.warn("Error removing old map instance:", e); }
            mapInstance = null; markerInstance = null; geocoderControl = null; layerControl = null;
        }
        const mapPlaceholder = mapContainer.querySelector('p');
        if(mapPlaceholder) mapPlaceholder.textContent = 'جاري تهيئة الخريطة التفاعلية، لحظات من فضلك...';

        mapContainer.classList.remove('input-error');
        locationStatus.textContent = 'نرجو تحديد موقعكم بدقة على الخريطة أو البحث عن العنوان.';
        locationStatus.className = 'status-pending';

        try {
             mapInstance = L.map('map-container', { center: DEFAULT_MAP_CENTER, zoom: DEFAULT_MAP_ZOOM, layers: [osmLayer], preferCanvas: true }); // preferCanvas for potential mobile performance
             const baseMaps = { "خريطة الشارع الأساسية": osmLayer, "عرض القمر الصناعي (صور جوية)": satelliteLayer };
             layerControl = L.control.layers(baseMaps).addTo(mapInstance);
             markerInstance = L.marker([0,0], { draggable: true, icon: L.icon({ // Custom gold marker
                iconUrl: 'https://api.geoapify.com/v1/icon/?type=material&color=%23daa520&icon=location_on&iconType=awesome&scaleFactor=2&apiKey=YOUR_GEOAPIFY_API_KEY', // Replace with your Geoapify key or a local gold marker SVG/PNG
                iconSize: [38, 55], iconAnchor: [19, 55], popupAnchor: [0, -55],
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', shadowSize: [41, 41], shadowAnchor: [12, 41]
            }) }); 
             
             markerInstance.on('dragend', function(event){ /* ... as before ... */ });

             if (geocoderAvailable) {
                geocoderControl = L.Control.geocoder({ /* ... as before ... */ }).addTo(mapInstance);
            }
            mapInstance.on('click', (e) => { /* ... as before ... */ });
            if(mapPlaceholder) mapPlaceholder.style.display = 'none'; // Hide placeholder after map init
            setTimeout(() => findUserLocation(true), 500);
        } catch (error) {
             console.error("🔥 فشل تهيئة خريطة Leaflet:", error);
             if(mapPlaceholder) mapPlaceholder.remove();
             mapContainer.innerHTML = `<p style="color: var(--error-color); text-align: center; padding: 20px;">حدث خطأ أثناء تحميل الخريطة: ${error.message}. الرجاء المحاولة مرة أخرى.</p>`;
        }
    };

    const openCheckout = () => { /* ... as before ... close mobile menu if open ... */
        if (mainNavElement.classList.contains('active')) { // Close mobile menu if open
            mobileMenuToggleBtn.click();
        }
        // ... rest of the openCheckout logic ...
        if (leafletAvailable) {
             setTimeout(() => { 
                initializeMap(); 
                if (customerNameInput) customerNameInput.focus({ preventScroll: true }); // Prevent scroll to ensure modal is viewed correctly
                checkoutModal.scrollTop = 0; // Scroll modal to top
            }, 200); // Ensure modal animation is complete
        }
    };
    const closeCheckout = () => { /* ... as before ... */ };
    
    // --- Render Products ---
    const renderFilteredProducts = () => { /* ... as before, but consider adding `aspect-ratio` CSS to images to prevent layout shift */
        // ... product card generation, ensure mobile text is readable ...
    };
    const filterAndDisplayProducts = () => { /* ... as before ... spinner should work with new CSS */ };
    const fetchProducts = async () => { /* ... as before ... notification texts refined for branding ... */ };
    const validateCheckoutForm = () => { /* ... as before ... ensure focusing logic works with mobile overlay keyboard ... */
        // When an error occurs and firstInvalidField is set, scroll it into view considering the checkout modal context
        if (!isValid && firstInvalidField) {
            setTimeout(() => {
                const modalRect = checkoutModal.getBoundingClientRect();
                const fieldRect = firstInvalidField.getBoundingClientRect();
                // Check if field is outside visible area of the modal
                if (fieldRect.top < modalRect.top || fieldRect.bottom > modalRect.bottom) {
                     firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                if (firstInvalidField.focus && typeof firstInvalidField.focus === 'function') {
                    try { firstInvalidField.focus({ preventScroll: true }); } catch (e) {} // focus can sometimes fail
                }
            }, 150);
        }
        return isValid;
    };
    const handleCheckout = async (event) => { /* ... as before ... success/error messages refined */ };

    const setupEventListeners = () => { /* ... as before, mobile menu toggle moved to inline HTML script for simplicity but can be here */
        // For any dynamically added elements that need event listeners, ensure they are handled correctly, e.g., via event delegation on parent.
        cartButton.addEventListener('click', openCart);
        closeCartButton.addEventListener('click', closeCart);
        cartOverlay.addEventListener('click', closeCart);
        checkoutButton.addEventListener('click', openCheckout);
        closeCheckoutButton.addEventListener('click', closeCheckout);
        checkoutOverlay.addEventListener('click', (event) => { if (event.target === checkoutOverlay) closeCheckout(); });
        checkoutForm.addEventListener('submit', handleCheckout);

        cartItemsContainer.addEventListener('click', (event) => {
            const targetButton = event.target.closest('.action-button'); if (!targetButton) return;
            const productId = targetButton.dataset.id; if (!productId) return;
            temporaryClass(targetButton, 'button-clicked', 200);
             if (targetButton.classList.contains('increase-quantity')) increaseQuantity(productId);
             else if (targetButton.classList.contains('decrease-quantity')) decreaseQuantity(productId);
             else if (targetButton.classList.contains('remove-item')) removeFromCart(productId);
        });

        productGrid.addEventListener('click', (event) => {
             const button = event.target.closest('.add-to-cart-btn');
             if (button) {
                event.preventDefault(); const productId = button.dataset.id;
                 if (productId) addToCart(productId, button);
                 else console.warn("زر الإضافة إلى السلة يفتقد data-id!");
             }
         });
        
        if (leafletAvailable && findMeButton) {
             findMeButton.addEventListener('click', () => {
                if (!mapInstance) { showNotification("الرجاء الانتظار حتى يتم تحميل الخريطة بالكامل.", "warn"); return; }
                findUserLocation(false);
             });
        } else if (!leafletAvailable && findMeButton) { findMeButton.disabled = true; findMeButton.title = "عفواً، خدمة الخرائط غير متاحة حالياً."; }

        // Copy buttons in checkout modal
        checkoutModal.addEventListener('click', async (event) => {
            const copyButton = event.target.closest('.copy-button'); if (!copyButton) return;
            const targetSelector = copyButton.dataset.clipboardTarget;
            const targetElement = targetSelector ? document.querySelector(targetSelector) : null;
            if (!targetElement) { showNotification("خطأ: لم يتم العثور على النص المطلوب لنسخه.", "error"); return; }
            const textToCopy = (targetElement.textContent || targetElement.innerText || '').trim();
            if (!textToCopy) { showNotification("لا يوجد نص لنسخه حالياً.", "info"); return; }
            try {
                await navigator.clipboard.writeText(textToCopy);
                const originalText = copyButton.innerHTML;
                copyButton.innerHTML = '✅ تم النسخ!'; copyButton.classList.add('copied');
                temporaryClass(copyButton, 'pulse-quick', 300);
                showNotification(`تم نسخ "${textToCopy}" بنجاح!`, 'success', 2500);
                setTimeout(() => { copyButton.innerHTML = originalText; copyButton.classList.remove('copied'); }, 2500);
            } catch (err) {
                showNotification('فشل النسخ تلقائيًا. الرجاء محاولة النسخ يدويًا.', 'error');
                // Fallback manual selection can be added here if navigator.clipboard is not supported/allowed.
                // For example, creating a temporary textarea, selecting its content, and execCommand('copy').
            }
        });
         console.log("✅ تم إعداد جميع مستمعي الأحداث بنجاح.");
    };


    const initializePage = () => {
        console.log("----- تهيئة صفحة أطايب الواحات الذهبية -----");
         try {
             const storedCart = localStorage.getItem('atyabElWahatCart'); // Ensure this key matches
             if (storedCart) {
                 try {
                     const parsedCart = JSON.parse(storedCart);
                     if (Array.isArray(parsedCart) && parsedCart.every(item => typeof item.id === 'string' && typeof item.quantity === 'number' && item.quantity > 0)) {
                         cart = parsedCart; console.log("تم تحميل سلة أطايب الواحات من الذاكرة المحلية:", cart.length, "أنواع فاخرة.");
                     } else { localStorage.removeItem('atyabElWahatCart'); cart = []; }
                 } catch (e) { localStorage.removeItem('atyabElWahatCart'); cart = []; console.warn("فشل تحليل بيانات السلة من الذاكرة المحلية:", e);}
            } else { cart = []; }

            if (yearSpan) yearSpan.textContent = new Date().getFullYear();
            
            showScreen(dateSizeSelectionScreen); // Start with the first screen

             setupEventListeners(); // Setup main event listeners
             fetchProducts(); // Fetch all products into memory
            console.log("----- تمت تهيئة صفحة أطايب الواحات بنجاح ----- (جاري جلب كنوز الواحات في الخلفية)");
        } catch (error) {
            console.error("☠️ خطأ فادح جداً أثناء تهيئة الصفحة الرئيسية لأطايب الواحات:", error);
             alert("عذراً، حدث خطأ جسيم وغير متوقع أثناء تحميل الصفحة. نرجو منكم محاولة تحديث الصفحة أو العودة لاحقاً. نشكر تفهمكم.");
             if(bodyElement) {
                 bodyElement.innerHTML = `<div style="padding: 40px; text-align: center; color: var(--brand-gold); background-color: var(--background-dark); min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;"><h1>عذراً، خطأ تقني!</h1><p style="font-size: 1.2rem; color: var(--text-grey-light); margin-top: 1rem;">نواجه بعض الصعوبات التقنية في عرض روعة أطايب الواحات حالياً.<br/>الرجاء المحاولة مرة أخرى بعد لحظات قليلة.</p></div>`;
            }
        }
    };

    initializePage();
});
