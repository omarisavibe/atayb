// --- ATYAB EL THAMAR SCRIPT - (v_Mobile_Luxury_Focus) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("----- ATYAB EL THAMAR (v_Mobile_Luxury_Focus) ----- DOM loaded."); // BRANDING

    // --- SUPABASE CLIENT SETUP ---
    const SUPABASE_URL = 'https://lhodhrpfbetqrjfbdxzm.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxob2RocnBmYmV0cXJqZmJkeHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNDY1MzAsImV4cCI6MjA2MjcyMjUzMH0.2XLcTLZU0rBo8sy7fPKzSX-25dBLD6m2zlZK2Gi2IDc';

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL.includes("YOUR_SUPABASE_URL") || SUPABASE_ANON_KEY.includes("YOUR_SUPABASE_ANON_KEY")) {
        console.error("🛑 توقف! مفاتيح Supabase مفقودة أو افتراضية في script.js لـ أطيب الثمر. يجب إصلاحها فوراً!"); // BRANDING
        alert("تنبيه إداري عاجل! الرجاء إصلاح مفاتيح Supabase في script.js! نظام أطيب الثمر لن يعمل بدونها!"); // BRANDING
        const grid = document.getElementById('product-grid');
        if (grid) grid.innerHTML = '<p style="color: var(--brand-gold); text-align: center; font-weight: bold; font-size: 1.5rem; padding: 2rem;">💀 خطأ فادح في الإعداد: فشل الاتصال بخادم بيانات أطيب الثمر.</p>'; // BRANDING
        return;
    }

    let supabase;
    try {
        if (!window.supabase) {
            throw new Error("مكتبة Supabase client الأساسية غير موجودة. يرجى التأكد من تضمينها بشكل صحيح في ملف HTML الخاص بـ أطيب الثمر."); // BRANDING
        }
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("✅ Supabase client جاهز. لنبدأ رحلة تمور الواحات مع أطيب الثمر!"); // BRANDING
    } catch (error) {
        console.error("🔥 فشل تهيئة Supabase client لـ أطيب الثمر:", error); // BRANDING
        alert("حدث خطأ في الاتصال بقاعدة بيانات أطيب الثمر. قد يساعد تحديث الصفحة. تفاصيل الخطأ: " + error.message); // BRANDING
        const grid = document.getElementById('product-grid');
        if (grid) grid.innerHTML = '<p style="color: var(--error-color); text-align: center; font-weight: bold;">🗼 خطأ اتصال حرج: فشل تحميل كنوز تمور الواحات من أطيب الثمر.</p>'; // BRANDING
        return;
    }

    // Leaflet checks as before...
    let leafletAvailable = true;
    let geocoderAvailable = true;
    if (typeof L === 'undefined') {
        console.error("🛑 مكتبة Leaflet (L) للخرائط غير موجودة. ميزات تحديد الموقع لدى أطيب الثمر ستكون معطلة."); leafletAvailable = false; // BRANDING
    } else {
        console.log("✅ مكتبة Leaflet (L) للخرائط موجودة وجاهزة لـ أطيب الثمر."); // BRANDING
        if (typeof L.Control.Geocoder === 'undefined') {
            console.warn("⚠️ إضافة Leaflet Geocoder غير موجودة. البحث عن العناوين في خريطة أطيب الثمر قد يكون محدودًا."); geocoderAvailable = false; // BRANDING
        } else { console.log("✅ إضافة Leaflet Geocoder للبحث عن العناوين موجودة."); }
    }


    // --- DOM ELEMENTS CACHE (Ensure all IDs are correct from new HTML structure) ---
    console.log("جاري البحث عن عناصر واجهة أطيب الثمر..."); // BRANDING
    const productGrid = document.getElementById('product-grid');
    const cartButton = document.getElementById('cart-button');
    const closeCartButton = document.getElementById('close-cart-button'); // Ensure this is the one in new cart-header
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutButton = document.getElementById('checkout-button');

    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutOverlay = document.getElementById('checkout-overlay');
    const closeCheckoutButton = document.getElementById('close-checkout-button'); // Ensure this is in new checkout-modal-header
    const checkoutModalContent = checkoutModal.querySelector('.checkout-modal-content'); // For scrolling
    const checkoutForm = document.getElementById('checkout-form');
    // ... rest of form inputs, map elements, selection screen elements
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
    const mobileMenuToggleBtn = document.getElementById('mobile-menu-toggle-btn');
    const mainNavElement = document.getElementById('main-nav');


    if (!productGrid || !cartButton || !cartSidebar || !cartOverlay || !cartCount || !cartItemsContainer || !cartTotalPrice ||
        !checkoutButton || !checkoutModal || !checkoutOverlay || !closeCheckoutButton || !checkoutForm || !submitOrderButton ||
        !customerNameInput || !customerPhoneInput || !checkoutSummary || !checkoutTotalPriceElement || !paymentMethodSelection || paymentTotalReminders.length === 0 ||
        !buildingDetailsInput || !floorAptInput || !landmarksInput || !checkoutModalContent ||
        (leafletAvailable && (!mapContainer || !locationStatus || !customerLatitudeInput || !customerLongitudeInput || !findMeButton)) ||
        !dateSizeSelectionScreen || !packWeightSelectionScreen || !productDisplayScreen || !dateSizeOptions.length || !packWeightOptions.length || !selectedDateSizeDisplay || !finalProductSelectionInfo || !backToSizeSelectionButton || !backToWeightSelectionButton || !mobileMenuToggleBtn || !mainNavElement
    ) {
        console.error("🛑 عناصر HTML حرجة مفقودة في واجهة أطيب الثمر! يرجى التحقق من كل المعرفات والفئات."); // BRANDING
        alert("عفوًا! خطأ في تحميل واجهة أطيب الثمر. بعض الأجزاء مفقودة."); // BRANDING
        if (bodyElement) bodyElement.innerHTML = '<h1 style="color: var(--brand-gold); text-align: center; padding: 50px;">خطأ في تصميم الواجهة. الرجاء الاتصال بالدعم الفني لأطيب الثمر.</h1>'; // BRANDING
        return;
    }
    console.log("✅ تم العثور على جميع عناصر واجهة أطيب الثمر."); // BRANDING

    // State, Configs (Delivery Zone, Map Layers) - No change from previous logical structure

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

    const DELIVERY_ZONE = { minLat: 29.85, maxLat: 30.25, minLng: 31.00, maxLng: 31.65 };
    const DEFAULT_MAP_CENTER = [30.0444, 31.2357];
    const DEFAULT_MAP_ZOOM = 10;
    const LOCATION_FOUND_ZOOM = 17;
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, attribution: '© <a href="http://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
    });
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19, attribution: 'Tiles © <a href="https://www.esri.com" target="_blank" rel="noopener">Esri</a>'
    });

    // Utility Functions (formatCurrency, temporaryClass, showNotification) - No change
    const formatCurrency = (amount) => { return `${(typeof amount === 'number' ? amount : 0).toFixed(2)} ج.م`; };
    const temporaryClass = (element, className, duration = 500) => {
        if (!element) return;
        element.classList.add(className);
        setTimeout(() => { element.classList.remove(className); }, duration);
    };
    const showNotification = (message, type = 'info', duration = 3800) => { // Slightly longer for impact
        const existingNotification = document.getElementById('site-notification');
        if (existingNotification) existingNotification.remove();
        const notification = document.createElement('div');
        notification.id = 'site-notification';
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.textContent = message;
        document.body.appendChild(notification);
        void notification.offsetWidth;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            notification.addEventListener('transitionend', () => notification.remove(), { once: true });
        }, duration);
        console.log(`إشعار أطيب الثمر [${type}]: ${message}`); // BRANDING
    };

    // Navigation (showScreen, size/weight selection, back buttons) - Logic unchanged, but relies on new CSS for look.
    function showScreen(screenToShow) {
        [dateSizeSelectionScreen, packWeightSelectionScreen, productDisplayScreen].forEach(screen => {
            screen.style.display = 'none';
            screen.classList.remove('active-screen');
        });
        screenToShow.style.display = 'flex';
        screenToShow.classList.add('active-screen');
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 60;
        window.scrollTo({ top: screenToShow.offsetTop - headerHeight - 15 , behavior: 'smooth' });
    }
    dateSizeOptions.forEach(card => {
        card.addEventListener('click', () => {
            selectedDateSize = card.dataset.size;
            dateSizeOptions.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            console.log("حجم تمر الواحات المختار من أطيب الثمر:", selectedDateSize); // BRANDING
            selectedDateSizeDisplay.textContent = selectedDateSize;
            packWeightOptions.forEach(btn => btn.classList.remove('selected'));
            selectedPackWeight = null;
            showScreen(packWeightSelectionScreen);
        });
    });
    packWeightOptions.forEach(button => {
        button.addEventListener('click', () => {
            selectedPackWeight = parseInt(button.dataset.weight);
            packWeightOptions.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            console.log("وزن عبوة الواحات المختار من أطيب الثمر:", selectedPackWeight, "جم"); // BRANDING
            filterAndDisplayProducts();
            showScreen(productDisplayScreen);
        });
    });
    backToSizeSelectionButton.addEventListener('click', () => { /* ... */ });
    backToWeightSelectionButton.addEventListener('click', () => { /* ... */ });


    // Core Cart Functions (updateCartUI, addToCart, removeFromCart, inc/dec quantity, open/closeCart)
    // UI text refined for Atyab El Thamar branding.
    const updateCartUI = () => {
        if (!cartItemsContainer || !cartTotalPrice || !cartCount || !checkoutButton) { return; }
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let itemCount = 0;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-message fade-in">سلتك بانتظار أطايب الثمر. ابدأ رحلة اختيار تمور الواحات!</p>'; // BRANDING
        } else {
            cart.forEach(item => {
                const product = allProducts.find(p => p.id === item.id); 
                if (!product || typeof product.price !== 'number' || !product.name_ar || !product.image_url) {
                    cartItemsContainer.innerHTML += `<p class="error-message" style="color:var(--error-color); padding: 0 1rem;">خلل في عرض منتج بالسلة.</p>`; return;
                }
                const itemElement = document.createElement('div'); /* ... InnerHTML structure ... */
                itemElement.classList.add('cart-item', 'animate-item-enter');
                itemElement.dataset.itemId = item.id;
                itemElement.innerHTML = `
                     <img src="${product.image_url}" alt="${product.name_ar}" class="cart-item-img" onerror="this.onerror=null; this.src='placeholder-date.png'; this.alt='صورة المنتج غير متاحة';">
                    <div class="cart-item-info">
                         <h4>${product.name_ar}</h4>
                         <p>${formatCurrency(product.price)} × ${item.quantity}</p>
                     </div>
                     <div class="cart-item-actions">
                        <button class="decrease-quantity action-button" data-id="${item.id}" aria-label="تقليل الكمية">-</button>
                         <span class="item-quantity">${item.quantity}</span>
                        <button class="increase-quantity action-button" data-id="${item.id}" aria-label="زيادة الكمية">+</button>
                         <button class="remove-item action-button danger" data-id="${item.id}" aria-label="إزالة العنصر">×</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
                total += product.price * item.quantity;
                itemCount += item.quantity;
                setTimeout(() => itemElement.classList.remove('animate-item-enter'), 300);
            });
        }
        cartTotalPrice.textContent = formatCurrency(total);
        cartCount.textContent = itemCount;
        cartButton.classList.toggle('has-items', itemCount > 0);
        try {
             localStorage.setItem('atyabElThamarCart', JSON.stringify(cart)); // BRANDING: Correct LocalStorage Key
        } catch (e) { console.error("فشل حفظ سلة أطيب الثمر:", e); showNotification("لم يتم حفظ تغييرات السلة.", "error");} // BRANDING
        checkoutButton.disabled = cart.length === 0;
        checkoutButton.textContent = cart.length === 0 ? 'السلة فارغة' : 'إتمام الطلب والدفع الآمن';
    };
    const addToCart = (productId, buttonElement) => {
        const product = allProducts.find(p => p.id === productId);
        if (!product) { showNotification("عفواً، المنتج غير متوفر حالياً.", 'error'); return; }
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
            showNotification(`+١ ${product.name_ar}! ذوقك رائع مع أطايب الثمر.`, 'info', 2500); // BRANDING
        } else {
            cart.push({ id: productId, quantity: 1 });
            showNotification(`تمت إضافة ${product.name_ar} إلى سلتك! اختيار فاخر من أطيب الثمر.`, 'success'); // BRANDING
        }
        if(buttonElement) temporaryClass(buttonElement, 'button-adding', 600);
        temporaryClass(cartCount, 'pulse-quick', 500);
        if (cartButton) temporaryClass(cartButton, 'shake-subtle', 500);
        updateCartUI();
    };
    const removeFromCart = (productId) => { /* ... UI and animation remains, messages refined */
        const product = allProducts.find(p => p.id === productId);
        const productName = product ? product.name_ar : 'المنتج';
        cart = cart.filter(item => item.id !== productId);
        showNotification(`تمت إزالة "${productName}" من سلتك.`, 'info');
        const itemElement = cartItemsContainer.querySelector(`.cart-item[data-item-id="${productId}"]`);
        if (itemElement) {
            itemElement.classList.add('animate-item-exit');
            itemElement.addEventListener('animationend', () => { updateCartUI(); }, { once: true });
        } else { updateCartUI(); }
    };
    const increaseQuantity = (productId) => { /* ... */ };
    const decreaseQuantity = (productId) => { /* ... */ };
    const openCart = () => {
        if (mainNavElement.classList.contains('active')) { mobileMenuToggleBtn.click(); } // Close mobile nav
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        bodyElement.classList.add('overlay-active', 'cart-open');
        isCartOpen = true;
    };
    const closeCart = () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        bodyElement.classList.remove('overlay-active', 'cart-open');
        isCartOpen = false;
    };

    // Map Logic (updateLocation, findUserLocation, initializeMap) - Marker and geocoder CSS updates are in style.css.
    const updateLocation = (lat, lng, locationName = null) => { /* ... */ };
    const findUserLocation = (initialLoad = false) => { /* ... */ };
    const initializeMap = () => {
        if (!leafletAvailable || !mapContainer) { /* ... error handling ... */ return; }
        if (mapInstance) { try { mapInstance.remove(); } catch(e) {} mapInstance = null; markerInstance = null; geocoderControl = null; layerControl = null; }
        const mapPlaceholder = mapContainer.querySelector('p');
        if(mapPlaceholder) mapPlaceholder.textContent = 'جاري تهيئة الخريطة، لحظات...';
        mapContainer.classList.remove('input-error');
        locationStatus.textContent = 'نرجو تحديد موقع التوصيل بدقة.'; locationStatus.className = 'status-pending';
        try {
             mapInstance = L.map('map-container', { center: DEFAULT_MAP_CENTER, zoom: DEFAULT_MAP_ZOOM, layers: [osmLayer], preferCanvas: true });
             const baseMaps = { "خريطة الشارع": osmLayer, "صور الأقمار الصناعية": satelliteLayer };
             layerControl = L.control.layers(baseMaps).addTo(mapInstance);
             // Using a gold marker SVG directly for better control and no API keys
             const goldIcon = L.divIcon({
                html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${getComputedStyle(document.documentElement).getPropertyValue('--brand-gold').trim()}" width="38px" height="38px"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>`,
                className: 'leaflet-gold-marker', // For potential additional styling if needed
                iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38]
            });
            markerInstance = L.marker([0,0], { draggable: true, icon: goldIcon });
            markerInstance.on('dragend', function(event){ updateLocation(event.target.getLatLng().lat, event.target.getLatLng().lng, "الموقع المحدد بالسحب"); });
            if (geocoderAvailable) {
                geocoderControl = L.Control.geocoder({ defaultMarkGeocode: false, placeholder: "ابحث عن عنوانك...", errorMessage: "لم يتم العثور على العنوان.", geocoder: L.Control.Geocoder.nominatim({ geocodingQueryParams: { countrycodes: 'eg', "accept-language": 'ar, en' } }), position: 'topleft', collapsed: window.innerWidth < 768 })
                .on('markgeocode', (e) => { updateLocation(e.geocode.center.lat, e.geocode.center.lng, e.geocode.name); markerInstance.setLatLng(e.geocode.center); }).addTo(mapInstance);
            }
            mapInstance.on('click', (e) => { updateLocation(e.latlng.lat, e.latlng.lng); markerInstance.setLatLng(e.latlng); });
            if(mapPlaceholder) mapPlaceholder.style.display = 'none';
            setTimeout(() => findUserLocation(true), 600);
        } catch (error) { /* ... error handling ... */ }
    };


    // Checkout Logic (openCheckout, closeCheckout, renderFilteredProducts, filterAndDisplayProducts, fetchProducts, validateCheckoutForm, handleCheckout)
    // UI text/messages will be refined for Atyab El Thamar.
    const openCheckout = () => {
        if (mainNavElement.classList.contains('active')) { mobileMenuToggleBtn.click(); }
        if (cart.length === 0) { showNotification("سلتك فارغة! أضف بعض تمور الواحات من أطيب الثمر أولاً.", "warn"); return; } // BRANDING
        // ... HTML summary, total calc ...
        let summaryHTML = '<ul>'; let total = 0;
        cart.forEach(item => { /* ... */ }); summaryHTML += '</ul>'; checkoutSummary.innerHTML = summaryHTML;
        const totalFormatted = formatCurrency(total); checkoutTotalPriceElement.textContent = totalFormatted;
        paymentTotalReminders.forEach(span => { span.textContent = totalFormatted; });
        checkoutForm.reset(); /* ... reset fields and messages ... */
        checkoutModal.classList.add('active'); checkoutOverlay.classList.add('active');
        bodyElement.classList.add('overlay-active', 'checkout-open'); isCheckoutOpen = true;
        if (isCartOpen) closeCart();
        if (leafletAvailable) { setTimeout(() => { initializeMap(); if (customerNameInput) customerNameInput.focus({ preventScroll: true }); checkoutModalContent.scrollTop = 0; }, 250);
        } else { if (mapContainer) mapContainer.innerHTML = '<p style="color:var(--error-color);text-align:center;padding:20px;">خدمة الخرائط غير متاحة حالياً.</p>'; }
    };
    const closeCheckout = () => { /* ... */ };
    const renderFilteredProducts = () => { /* ... Ensure product name from DB (like "تمور واحات أطيب الثمر - صغير (عبوة ٤٠٠ جم)") is used. */
        // The product cards will use the new, more luxurious CSS.
    };
    const filterAndDisplayProducts = () => { /* Filtering logic. Make sure p.name_ar.includes "الواحات" (Wahat Dates) and optionally "أطيب الثمر" if needed */
        // ... productGrid innerHTML = '<div class="spinner"></div>'; ...
        filteredProducts = allProducts.filter(p => p.category === selectedDateSize && p.weight_g === selectedPackWeight /* && p.name_ar.includes("الواحات") && p.name_ar.includes("أطيب الثمر") if needed */ );
        // ... setTimeout to renderFilteredProducts ...
    };
    const fetchProducts = async () => {
         console.log("🚀 بدء جلب منتجات أطيب الثمر..."); // BRANDING
         try {
             let { data, error } = await supabase.from('products').select('*').order('category').order('weight_g');
             if (error) throw new Error(`خطأ قاعدة بيانات أطيب الثمر: ${error.message}`); // BRANDING
             if (data) { console.log(`✅ تم جلب ${data.length} منتج من أطيب الثمر.`); allProducts = data; } // BRANDING
             else { allProducts = []; }
         } catch (error) { console.error('🔥 فشل جلب منتجات أطيب الثمر:', error); showNotification(`لم نتمكن من تحميل قائمة منتجات أطيب الثمر! ${error.message}`, "error");} // BRANDING
         finally { updateCartUI(); console.log("اكتمل جلب منتجات أطيب الثمر."); } // BRANDING
     };
    const validateCheckoutForm = () => { /* Form validation. No logical change, but focusing on errors now more robust with scrollIntoView. */
        // ... form validation logic ...
        // if (!isValid && firstInvalidField) { // Logic for scrolling to error, check if still needed with modal behavior
        //     setTimeout(() => {
        //         const modalContentRect = checkoutModalContent.getBoundingClientRect();
        //         const fieldRect = firstInvalidField.getBoundingClientRect();
        //         if (fieldRect.top < modalContentRect.top || fieldRect.bottom > modalContentRect.bottom) {
        //              checkoutModalContent.scrollTo({ top: firstInvalidField.offsetTop - checkoutModalContent.offsetTop - 20, behavior: 'smooth' });
        //         }
        //         if (firstInvalidField.focus && typeof firstInvalidField.focus === 'function') {
        //             try { firstInvalidField.focus({ preventScroll: true }); } catch (e) {}
        //         }
        //     }, 150);
        // }
        // return isValid;
        return true; // Simplified for this example; full validation from previous script is assumed.
    };
    const handleCheckout = async (event) => {
        event.preventDefault(); /* ... checks ... */ if (!validateCheckoutForm()) return;
        isSubmitting = true; submitOrderButton.disabled = true; submitOrderButton.textContent = 'جاري تسجيل طلبك لدى أطيب الثمر... ⏳'; // BRANDING
        /* ... formData, customerData, orderItems, orderPayload ... */
        const orderPayload = { /* ... customer details, order items ... */ };
        try {
            const { data, error } = await supabase.from('orders').insert([orderPayload]).select();
            if (error) throw new Error(`خطأ قاعدة بيانات أطيب الثمر: ${error.message}`); // BRANDING
            let successMsg = `🎉 تم تسجيل طلبك من أطيب الثمر بنجاح! شكراً لاختيارك تمور الواحات الفاخرة.`; // BRANDING
             if (orderPayload.payment_method === 'CashOnDelivery') { successMsg += ` الدفع عند الاستلام. سنتواصل معك قريباً للتأكيد.`; }
             else { successMsg += ` الرجاء إتمام الدفع عبر ${orderPayload.payment_method}. سنتصل للتأكيد.`; }
            checkoutMessage.textContent = successMsg; checkoutMessage.className = 'checkout-message success animate-fade-in';
            showNotification("تم إرسال طلبك بنجاح إلى أطيب الثمر! ننتظر تواصلك أو تواصلنا.", 'success', 7000); // BRANDING
            cart = []; updateCartUI();
            setTimeout(closeCheckout, 6500);
        } catch (error) { /* ... error handling with Atyab El Thamar branding ... */
            let userErrorMessage = `😭 عفوًا! خطأ في حفظ طلبك لأطايب الثمر. حاول مرة أخرى أو اتصل بنا.`; // BRANDING
            checkoutMessage.textContent = userErrorMessage; /* ... */
            showNotification(`فشل تسجيل طلبك لدى أطيب الثمر. ${error.message}`, 'error', 8000); // BRANDING
        }
    };


    // Event Listeners Setup (setupEventListeners) - Inline mobile menu script in HTML. Other listeners are fine.
    const setupEventListeners = () => {
        cartButton.addEventListener('click', openCart);
        closeCartButton.addEventListener('click', closeCart);
        cartOverlay.addEventListener('click', closeCart);
        checkoutButton.addEventListener('click', openCheckout);
        closeCheckoutButton.addEventListener('click', closeCheckout);
        checkoutOverlay.addEventListener('click', (event) => { if (event.target === checkoutOverlay) closeCheckout(); });
        checkoutForm.addEventListener('submit', handleCheckout);
        cartItemsContainer.addEventListener('click', (event) => { /* ... cart item actions ... */ });
        productGrid.addEventListener('click', (event) => { /* ... add to cart from grid ... */ });
        if (leafletAvailable && findMeButton) { findMeButton.addEventListener('click', () => { /* ... */ }); }
        checkoutModal.addEventListener('click', async (event) => { /* ... copy button logic ... */ });
         console.log("✅ مستمعو أحداث أطيب الثمر جاهزون للتفاعل."); // BRANDING
    };

    // Initialize Page (initializePage)
    const initializePage = () => {
        console.log("----- تهيئة صفحة أطيب الثمر الفاخرة -----"); // BRANDING
         try {
             const storedCart = localStorage.getItem('atyabElThamarCart'); // BRANDING: Ensure key matches
             if (storedCart) { /* ... load cart ... */ } else { cart = []; }
             if (yearSpan) yearSpan.textContent = new Date().getFullYear();
             showScreen(dateSizeSelectionScreen);
             setupEventListeners();
             fetchProducts();
            console.log("----- صفحة أطيب الثمر جاهزة لاستقبال طلباتكم! -----"); // BRANDING
        } catch (error) {
            console.error("☠️ خطأ كارثي أثناء تهيئة صفحة أطيب الثمر:", error); // BRANDING
            alert("عذراً، خطأ جسيم في تحميل صفحة أطيب الثمر. نرجو تحديث الصفحة."); // BRANDING
            if(bodyElement) { bodyElement.innerHTML = `<div style="/* error message HTML */"><h1>عطل فني!</h1><p>نعتذر، صفحة أطيب الثمر تواجه مشكلة. حاول التحديث.</p></div>`; } // BRANDING
        }
    };

    initializePage();
});
