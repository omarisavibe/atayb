// --- ATYAB EL THAMAR SCRIPT - PREMIUM DATES (v_SatelliteAndDetails Base, Arabic, New Flow) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("----- ATYAB EL THAMAR STARTUP (v_SatelliteAndDetails_Dates) ----- DOM loaded.");

    // --- SUPABASE CLIENT SETUP ---
    const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE'; // ✅ !! REPLACE THIS !!
    const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE'; // ✅ !! REPLACE THIS !!

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL.includes("YOUR_SUPABASE_URL") || SUPABASE_ANON_KEY.includes("YOUR_SUPABASE_ANON_KEY")) {
        console.error("🛑 توقف! مفاتيح Supabase مفقودة أو افتراضية في script.js. يجب إصلاحها!");
        alert("تنبيه إداري! الرجاء إصلاح مفاتيح Supabase في script.js! لا شيء يعمل بدونها!");
        const grid = document.getElementById('product-grid');
        if (grid) grid.innerHTML = '<p style="color: #DAA520; text-align: center; font-weight: bold; font-size: 1.5rem; padding: 2rem;">💀 خطأ في الإعداد: فشل الاتصال بالخادم.</p>';
        return;
    }

    let supabase;
    try {
        if (!window.supabase) {
            throw new Error("مكتبة Supabase client غير موجودة. تأكد من تضمينها في ملف HTML.");
        }
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("✅ Supabase client يبدو جيدًا. لنبدأ.");
    } catch (error) {
        console.error("🔥 فشل تهيئة Supabase client:", error);
        alert("حدث خطأ في اتصال Supabase. قد يساعد تحديث الصفحة. الخطأ: " + error.message);
        const grid = document.getElementById('product-grid');
        if (grid) grid.innerHTML = '<p style="color: red; text-align: center; font-weight: bold;">🗼 خطأ اتصال: فشل تحميل التمور.</p>';
        return;
    }

    let leafletAvailable = true;
    let geocoderAvailable = true;
    if (typeof L === 'undefined') {
        console.error("🛑 مكتبة Leaflet (L) غير موجودة. ميزات الخريطة معطلة.");
        leafletAvailable = false;
    } else {
        console.log("✅ مكتبة Leaflet (L) موجودة.");
        if (typeof L.Control.Geocoder === 'undefined') {
            console.warn("⚠️ إضافة Leaflet Geocoder (L.Control.Geocoder) غير موجودة. وظيفة البحث معطلة.");
            geocoderAvailable = false;
        } else {
            console.log("✅ إضافة Leaflet Geocoder موجودة.");
        }
    }

    // --- DOM ELEMENTS CACHE ---
    console.log("البحث عن عناصر HTML...");
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
    const checkoutTotalPriceElement = document.getElementById('checkout-total-price'); // Note: name change from Vibe script to avoid conflict if both used
    const submitOrderButton = document.getElementById('submit-order-button');
    const checkoutMessage = document.getElementById('checkout-message');
    const yearSpan = document.getElementById('year');
    const loadingIndicator = document.getElementById('loading-indicator');
    const bodyElement = document.body;
    const paymentMethodSelection = document.querySelector('.payment-method-selection');
    const paymentTotalReminders = document.querySelectorAll('.payment-total-reminder');

    // Selection Screens and Buttons
    const dateSizeSelectionScreen = document.getElementById('date-size-selection-screen');
    const packWeightSelectionScreen = document.getElementById('pack-weight-selection-screen');
    const productDisplayScreen = document.getElementById('product-display-screen');
    const dateSizeOptions = dateSizeSelectionScreen.querySelectorAll('.option-button');
    const packWeightOptions = packWeightSelectionScreen.querySelectorAll('.option-button');
    const selectedDateSizeDisplay = document.getElementById('selected-date-size-display');
    const finalProductSelectionInfo = document.getElementById('final-product-selection-info');
    const backToSizeSelectionButton = document.getElementById('back-to-size-selection');
    const backToWeightSelectionButton = document.getElementById('back-to-weight-selection');


    if (!productGrid || !cartButton || !cartSidebar || !cartOverlay || !cartCount || !cartItemsContainer || !cartTotalPrice ||
        !checkoutButton || !checkoutModal || !checkoutOverlay || !closeCheckoutButton || !checkoutForm || !submitOrderButton ||
        !customerNameInput || !customerPhoneInput || !checkoutSummary || !checkoutTotalPriceElement || !paymentMethodSelection || paymentTotalReminders.length === 0 ||
        !buildingDetailsInput || !floorAptInput || !landmarksInput ||
        (leafletAvailable && (!mapContainer || !locationStatus || !customerLatitudeInput || !customerLongitudeInput || !findMeButton)) ||
        // New selection screen elements
        !dateSizeSelectionScreen || !packWeightSelectionScreen || !productDisplayScreen || !dateSizeOptions.length || !packWeightOptions.length || !selectedDateSizeDisplay || !finalProductSelectionInfo || !backToSizeSelectionButton || !backToWeightSelectionButton
    ) {
        console.error("🛑 عناصر HTML حرجة مفقودة! تحقق من المعرفات/الفئات في ملف HTML الخاص بك مقابل السكربت (بما في ذلك عناصر الخريطة وحقول العنوان الجديدة وشاشات الاختيار).");
        alert("عفوًا! بعض الأجزاء الأساسية من الصفحة مفقودة في HTML. لا يمكن التشغيل بشكل صحيح.");
        if (bodyElement) bodyElement.innerHTML = '<h1 style="color: #DAA520; text-align: center; padding: 50px;">خطأ حرج في التخطيط: عناصر الصفحة مفقودة.</h1>';
        return;
    }
    console.log("✅ تم العثور على عناصر HTML.");
    if (!leafletAvailable && mapContainer) {
        mapContainer.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">فشل تحميل مكتبة الخرائط.</p>';
    }


    // --- STATE MANAGEMENT ---
    let cart = [];
    let allProducts = []; // To store all products fetched
    let filteredProducts = []; // Products to display based on selection
    let isCartOpen = false;
    let isCheckoutOpen = false;
    let isSubmitting = false;
    let mapInstance = null;
    let markerInstance = null;
    let geocoderControl = null;
    let layerControl = null;
    let selectedDateSize = null;
    let selectedPackWeight = null;

    // --- DELIVERY ZONE & MAP CONFIG (Greater Cairo & Giza - Example) ---
    const DELIVERY_ZONE = {
        minLat: 29.85, // Approx Southern boundary (e.g., Helwan/15th May)
        maxLat: 30.25, // Approx Northern boundary (e.g., Shoubra El Kheima/Obour)
        minLng: 31.00, // Approx Western boundary (e.g., 6th October edge)
        maxLng: 31.65  // Approx Eastern boundary (e.g., New Cairo edge/Shorouk)
    };
    const DEFAULT_MAP_CENTER = [30.0444, 31.2357]; // Cairo Downtown as default
    const DEFAULT_MAP_ZOOM = 10; // Zoom out a bit to show more of Cairo initially
    const LOCATION_FOUND_ZOOM = 17;

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles © Esri'
    });
    console.log("منطقة التوصيل (تقريبي):", DELIVERY_ZONE);


    // --- UTILITY FUNCTIONS ---
    const formatCurrency = (amount) => {
        const numericAmount = typeof amount === 'number' ? amount : 0;
        return `${numericAmount.toFixed(2)} ج.م`; // Egyptian Pound
    };

    const temporaryClass = (element, className, duration = 500) => {
        if (!element) return;
        element.classList.add(className);
        setTimeout(() => { element.classList.remove(className); }, duration);
    };

    const showNotification = (message, type = 'info', duration = 3000) => {
        const existingNotification = document.getElementById('site-notification');
        if (existingNotification) existingNotification.remove();

        const notification = document.createElement('div');
        notification.id = 'site-notification';
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        void notification.offsetWidth;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
            notification.addEventListener('transitionend', () => notification.remove(), { once: true });
        }, duration);
        console.log(`إشعار [${type}]: ${message}`);
    };

    // --- Navigation Between Selection Screens ---
    function showScreen(screenToShow) {
        [dateSizeSelectionScreen, packWeightSelectionScreen, productDisplayScreen].forEach(screen => {
            screen.style.display = 'none';
            screen.classList.remove('active-screen');
        });
        screenToShow.style.display = 'flex'; // Using flex for centering
        screenToShow.classList.add('active-screen');
        window.scrollTo({ top: screenToShow.offsetTop - 100, behavior: 'smooth' }); // Scroll to the new screen
    }
    
    dateSizeOptions.forEach(button => {
        button.addEventListener('click', () => {
            selectedDateSize = button.dataset.size;
            dateSizeOptions.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            console.log("الحجم المختار:", selectedDateSize);
            selectedDateSizeDisplay.textContent = selectedDateSize;
            packWeightOptions.forEach(btn => btn.classList.remove('selected')); // Reset weight selection
            selectedPackWeight = null; // Reset weight state
            showScreen(packWeightSelectionScreen);
        });
    });

    packWeightOptions.forEach(button => {
        button.addEventListener('click', () => {
            selectedPackWeight = parseInt(button.dataset.weight);
             packWeightOptions.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            console.log("الوزن المختار:", selectedPackWeight, "جم");
            filterAndDisplayProducts();
            showScreen(productDisplayScreen);
        });
    });
    
    backToSizeSelectionButton.addEventListener('click', () => {
        selectedDateSize = null; // Reset
        dateSizeOptions.forEach(btn => btn.classList.remove('selected'));
        showScreen(dateSizeSelectionScreen);
    });

    backToWeightSelectionButton.addEventListener('click', () => {
        selectedPackWeight = null; // Reset
        packWeightOptions.forEach(btn => btn.classList.remove('selected'));
        productGrid.innerHTML = ''; // Clear previous products
        if(loadingIndicator) loadingIndicator.style.display = 'none';
        showScreen(packWeightSelectionScreen);
    });


    // --- CORE FUNCTIONS ---
    const updateCartUI = () => {
        if (!cartItemsContainer || !cartTotalPrice || !cartCount || !checkoutButton) {
            console.error("لا يمكن تحديث واجهة السلة - العناصر المطلوبة مفقودة.");
            return;
        }
        console.log("تحديث واجهة السلة. السلة الحالية:", JSON.stringify(cart));

        cartItemsContainer.innerHTML = '';
        let total = 0;
        let itemCount = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-message fade-in">سلتك فارغة. أضف بعض التمور الفاخرة!</p>';
        } else {
            cart.forEach(item => {
                // In this model, 'products' might be allProducts, or better, get product details from allProducts
                const product = allProducts.find(p => p.id === item.id); 
                if (!product || typeof product.price !== 'number' || !product.name_ar || !product.image_url) {
                    console.warn(`عرض السلة: بيانات مفقودة أو غير صالحة للمعرف: ${item.id}. تجاهل العنصر.`);
                    // ... error element as in Vibe Treats ...
                    return;
                }

                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item', 'animate-item-enter');
                itemElement.dataset.itemId = item.id;
                itemElement.innerHTML = `
                     <img src="${product.image_url}" alt="${product.name_ar}" class="cart-item-img" onerror="this.onerror=null; this.src='placeholder-date.png'; this.alt='فشل تحميل الصورة';">
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
             localStorage.setItem('atyabElThamarCart', JSON.stringify(cart)); // Use a unique key
        } catch (e) {
            console.error("فشل حفظ السلة في localStorage:", e);
             showNotification("لم يتم حفظ تغييرات السلة.", "error");
        }

        checkoutButton.disabled = cart.length === 0;
        checkoutButton.textContent = cart.length === 0 ? 'السلة فارغة' : 'إتمام الطلب والدفع';
        console.log(`تم تحديث واجهة السلة: ${itemCount} عناصر, الإجمالي: ${formatCurrency(total)}`);
    };

    const addToCart = (productId, buttonElement) => {
        const product = allProducts.find(p => p.id === productId); // Check against allProducts
        if (!product) {
             console.error(`خطأ إضافة للسلة: المنتج بالمعرف ${productId} غير موجود.`);
             showNotification("خطأ: لم نتمكن من العثور على هذا المنتج.", 'error');
            return;
        }
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
             showNotification(`+١ ${product.name_ar}! اختيار رائع.`, 'info');
        } else {
            cart.push({ id: productId, quantity: 1 });
            showNotification(`تمت إضافة ${product.name_ar} إلى سلتك!`, 'success');
        }
        if(buttonElement) temporaryClass(buttonElement, 'button-adding', 400);
        temporaryClass(cartCount, 'pulse-quick', 500);
        if (cartButton) temporaryClass(cartButton, 'shake-subtle', 500);
        updateCartUI();
    };

    const removeFromCart = (productId) => {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex === -1) return;
        const productName = allProducts.find(p => p.id === productId)?.name_ar || 'المنتج';
        cart = cart.filter(item => item.id !== productId);
        showNotification(`تمت إزالة ${productName} من السلة.`, 'info');
        // Animation for removal similar to Vibe Treats...
        updateCartUI();
    };
    const increaseQuantity = (productId) => { /* Same as Vibe Treats */ 
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity++;
            updateCartUI();
            const itemElement = cartItemsContainer?.querySelector(`.cart-item[data-item-id="${productId}"] .item-quantity`);
            if(itemElement) temporaryClass(itemElement.parentElement.parentElement, 'pulse-quick', 300);
        }
    };
    const decreaseQuantity = (productId) => {  /* Same as Vibe Treats */
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity--;
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                updateCartUI();
                 const itemElement = cartItemsContainer?.querySelector(`.cart-item[data-item-id="${productId}"] .item-quantity`);
                 if(itemElement) temporaryClass(itemElement.parentElement.parentElement, 'pulse-quick', 300);
            }
        }
    };

    const openCart = () => { /* Same as Vibe Treats, check element names */ 
        if (!cartSidebar || !cartOverlay || !bodyElement) return;
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        bodyElement.classList.add('overlay-active', 'cart-open'); // Add 'cart-open'
        isCartOpen = true;
        console.log("تم فتح السلة.");
    };
    const closeCart = () => { /* Same as Vibe Treats */ 
        if (!cartSidebar || !cartOverlay || !bodyElement) return;
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        bodyElement.classList.remove('overlay-active', 'cart-open');
        isCartOpen = false;
        console.log("تم إغلاق السلة.");
    };
    
    // --- Map and Checkout logic (largely from Vibe Treats, translated and adapted) ---
    // --- Map Location Update (from Vibe Treats, translated) ---
    const updateLocation = (lat, lng, locationName = null) => {
        if (!mapInstance || !markerInstance || !customerLatitudeInput || !customerLongitudeInput || !locationStatus || !mapContainer) return;
        const latLng = L.latLng(lat, lng);
        if (!markerInstance.getLatLng() || markerInstance.getLatLng().lat === 0) {
            markerInstance.setLatLng(latLng).addTo(mapInstance);
        } else {
            markerInstance.setLatLng(latLng);
        }
        mapInstance.setView(latLng, LOCATION_FOUND_ZOOM);
        customerLatitudeInput.value = lat.toFixed(6);
        customerLongitudeInput.value = lng.toFixed(6);

        const isInZone = lat >= DELIVERY_ZONE.minLat && lat <= DELIVERY_ZONE.maxLat &&
                         lng >= DELIVERY_ZONE.minLng && lng <= DELIVERY_ZONE.maxLng;
        
        let statusText = `الموقع: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        let popupText = `<b>${locationName || 'الموقع المحدد'}</b><br>${statusText}`;

        if (isInZone) {
            locationStatus.textContent = `✅ الموقع جيد (منطقة التوصيل: القاهرة الكبرى / الجيزة)`;
            locationStatus.className = 'status-ok';
            mapContainer.classList.remove('input-error');
            popupText += '<br><span style="color: green;">✅ داخل منطقة التوصيل</span>';
            console.log(`تم تحديد الموقع (${lat}, ${lng}) - داخل المنطقة.`);
        } else {
            locationStatus.textContent = `🚨 خارج منطقة التوصيل (القاهرة الكبرى / الجيزة فقط)`;
            locationStatus.className = 'status-error';
            mapContainer.classList.add('input-error');
            popupText += '<br><span style="color: red;">🚨 خارج منطقة التوصيل</span>';
             showNotification("الموقع المحدد خارج منطقة التوصيل لدينا.", "warn", 4000);
            console.warn(`تم تحديد الموقع (${lat}, ${lng}) - خارج المنطقة.`);
        }
        markerInstance.bindPopup(popupText).openPopup();
    };

    const findUserLocation = (initialLoad = false) => { /* From Vibe Treats, translated messages */ 
        if (!navigator.geolocation) {
            console.warn("خاصية تحديد الموقع الجغرافي غير مدعومة من هذا المتصفح.");
            if (!initialLoad) showNotification("عذرًا، متصفحك لا يدعم تحديد موقعك.", "warn");
            if (mapInstance && initialLoad) {
                mapInstance.setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM);
                locationStatus.textContent = 'تحديد الموقع غير مدعوم. الرجاء التحديد يدويًا.';
                locationStatus.className = 'status-pending';
            }
            return;
        }

        if (!initialLoad) showNotification("جاري تحديد موقعك...", "info", 2000);
        if (findMeButton) findMeButton.disabled = true;
        locationStatus.textContent = 'جاري البحث عن موقعك...';
        locationStatus.className = 'status-pending';

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                updateLocation(latitude, longitude, "موقعك الحالي");
                if (findMeButton) findMeButton.disabled = false;
            },
            (error) => {
                let message = "تعذر الحصول على موقعك.";
                if (error.code === error.PERMISSION_DENIED) message = "تم رفض إذن تحديد الموقع. اسمح به أو حدد يدويًا.";
                // ... other error codes from Vibe Treats script ...
                if (!initialLoad) showNotification(message, "warn");
                locationStatus.textContent = message + ' الرجاء التحديد يدويًا أو البحث.';
                locationStatus.className = 'status-error';
                 if (mapInstance && initialLoad) mapInstance.setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM);
                 if (findMeButton) findMeButton.disabled = false;
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
        );
    };
    
    const initializeMap = () => { /* From Vibe Treats, translated and adapted */ 
        if (!leafletAvailable || !mapContainer) {
             console.error("Leaflet غير متوفر أو حاوية الخريطة مفقودة. لا يمكن تهيئة الخريطة.");
             if (mapContainer) mapContainer.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">خطأ: فشل تحميل مكتبة الخرائط.</p>';
             return;
        }
        if (mapInstance) { /* Remove previous if exists */
            if (layerControl) mapInstance.removeControl(layerControl);
            if (geocoderControl) mapInstance.removeControl(geocoderControl);
            mapInstance.remove(); mapInstance = null; markerInstance = null; geocoderControl = null; layerControl = null;
        }
        mapContainer.querySelector('p')?.remove();
        mapContainer.classList.remove('input-error');
        locationStatus.textContent = 'الرجاء تحديد موقعك على الخريطة أو البحث.';
        locationStatus.className = 'status-pending';

        try {
             mapInstance = L.map('map-container', { center: DEFAULT_MAP_CENTER, zoom: DEFAULT_MAP_ZOOM, layers: [osmLayer] });
             const baseMaps = { "خريطة الشارع": osmLayer, "عرض القمر الصناعي": satelliteLayer };
             layerControl = L.control.layers(baseMaps).addTo(mapInstance);
             markerInstance = L.marker([0, 0], { draggable: false });
             if (geocoderAvailable) {
                geocoderControl = L.Control.geocoder({
                    defaultMarkGeocode: false,
                    placeholder: "ابحث عن عنوانك (عربي/إنجليزي)...",
                    errorMessage: "لم يتم العثور على شيء، حاول مرة أخرى؟",
                    geocoder: L.Control.Geocoder.nominatim({
                        geocodingQueryParams: { countrycodes: 'eg', "accept-language": 'ar, en', viewbox: '30.9,29.7,31.9,30.3', bounded: 0 }
                    }),
                    position: 'topright', collapsed: false,
                }).on('markgeocode', (e) => { updateLocation(e.geocode.center.lat, e.geocode.center.lng, e.geocode.name); }).addTo(mapInstance);
            }
            mapInstance.on('click', (e) => { updateLocation(e.latlng.lat, e.latlng.lng); });
            setTimeout(() => findUserLocation(true), 500);
             console.log("✅ تم تهيئة خريطة Leaflet.");
        } catch (error) {
             console.error("🔥 فشل تهيئة خريطة Leaflet:", error);
             mapContainer.innerHTML = `<p style="color: red; text-align: center; padding: 20px;">خطأ في الخريطة: ${error.message}</p>`;
        }
    };

    const openCheckout = () => { /* From Vibe Treats, translated and adapted, use checkoutTotalPriceElement */
        const requiredElementsPresent = checkoutModal && checkoutOverlay && bodyElement && checkoutSummary && checkoutTotalPriceElement && checkoutForm && submitOrderButton && paymentTotalReminders.length > 0 &&
                                     customerNameInput && customerPhoneInput && buildingDetailsInput && floorAptInput && landmarksInput &&
                                     (!leafletAvailable || (mapContainer && locationStatus && customerLatitudeInput && customerLongitudeInput && findMeButton));
        if (!requiredElementsPresent) {
            console.error("لا يمكن فتح نافذة الطلب - عناصر مطلوبة مفقودة.");
            showNotification("نافذة الطلب غير متاحة بسبب خطأ في الصفحة.", "error");
            return;
        }
        if (cart.length === 0) {
            showNotification("أضف بعض التمور إلى سلتك أولاً!", "warn");
            return;
        }

        console.log("فتح نافذة الطلب.");
        let summaryHTML = '<ul>';
        let total = 0;
        cart.forEach(item => {
             const product = allProducts.find(p => p.id === item.id); // Use allProducts
             if (product && typeof product.price === 'number') {
                summaryHTML += `<li>${item.quantity} × ${product.name_ar} (${formatCurrency(product.price)} للواحدة)</li>`;
                 total += product.price * item.quantity;
             } else {
                summaryHTML += `<li class="error-message">خطأ في معالجة المنتج: ${item.id || 'غير معروف'}</li>`;
             }
        });
        summaryHTML += '</ul>';
        checkoutSummary.innerHTML = summaryHTML;
        const totalFormatted = formatCurrency(total);
        checkoutTotalPriceElement.textContent = totalFormatted; // Use new name
        paymentTotalReminders.forEach(span => { span.textContent = totalFormatted; });

        checkoutForm.reset();
        customerLatitudeInput.value = ''; customerLongitudeInput.value = '';
        if (locationStatus) {
             locationStatus.textContent = 'الرجاء تحديد موقعك على الخريطة أو البحث.';
             locationStatus.className = 'status-pending';
        }
        if (mapContainer) mapContainer.classList.remove('input-error');
        checkoutMessage.textContent = ''; checkoutMessage.className = 'checkout-message';
        submitOrderButton.disabled = false;
        submitOrderButton.textContent = 'تأكيد البيانات والدفع ✅';
        isSubmitting = false;
        if (findMeButton) findMeButton.disabled = false;
        checkoutForm.querySelectorAll('.input-error').forEach(el => { el.classList.remove('input-error'); });
        if (paymentMethodSelection) paymentMethodSelection.classList.remove('input-error');
        
        checkoutModal.classList.add('active');
        checkoutOverlay.classList.add('active');
        bodyElement.classList.add('overlay-active', 'checkout-open'); // Added 'checkout-open'
        isCheckoutOpen = true;
        if (isCartOpen) closeCart();

        if (leafletAvailable) {
             setTimeout(() => { initializeMap(); if (customerNameInput) customerNameInput.focus(); }, 150);
        } else {
             if (mapContainer) mapContainer.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">فشل تحميل مكتبة الخرائط.</p>';
        }
     };

    const closeCheckout = () => { /* From Vibe Treats */
        if (!checkoutModal || !checkoutOverlay || !bodyElement) return;
        checkoutModal.classList.remove('active');
        checkoutOverlay.classList.remove('active');
        bodyElement.classList.remove('overlay-active', 'checkout-open');
        isCheckoutOpen = false;
        if (mapInstance) {
            if (layerControl) mapInstance.removeControl(layerControl);
            if (geocoderControl) mapInstance.removeControl(geocoderControl);
            mapInstance.remove(); mapInstance = null; markerInstance = null; geocoderControl = null; layerControl = null;
        }
        if (submitOrderButton) {
             submitOrderButton.disabled = false;
             submitOrderButton.textContent = 'تأكيد البيانات والدفع ✅';
        }
        isSubmitting = false;
    };
    

    // --- Render Products ---
    const renderFilteredProducts = () => {
        if (!productGrid) return;
        console.log(`عرض ${filteredProducts.length} منتجًا مختارًا.`);
        if(loadingIndicator) loadingIndicator.style.display = 'none'; // Ensure it's hidden here too
        productGrid.innerHTML = '';

        if (filteredProducts.length === 0) {
            productGrid.innerHTML = '<p class="empty-message fade-in">عفوًا، لا توجد منتجات تطابق اختيارك حاليًا. جرب اختيارًا آخر.</p>';
            finalProductSelectionInfo.textContent = `تمور ${selectedDateSize || ''} وزن ${selectedPackWeight || ''}جم: لا يوجد حالياً.`;
            return;
        }
        
        finalProductSelectionInfo.textContent = `اختر من تمور "${selectedDateSize}" بوزن "${selectedPackWeight} جم":`;

        filteredProducts.forEach((product, index) => {
             // Make sure your product object has name_ar, description_ar
             if (!product || typeof product.id !== 'string' || !product.name_ar || typeof product.price !== 'number' || !product.image_url) {
                 console.warn("تجاهل عرض المنتج بسبب بيانات غير كاملة:", product);
                 // ... error card as in Vibe Treats, translated ...
                 return;
             }
            const card = document.createElement('article');
            card.classList.add('product-card', 'animate-card-enter');
            card.style.setProperty('--animation-delay', `${index * 0.05}s`);
            const priceFormatted = formatCurrency(product.price);
            
            // ** IMAGE PROMPT FOR A SINGLE PRODUCT CARD (EXAMPLE - Medjoul Jumbo 800g) **
            // Design: Appetizing close-up of "Medjoul Jumbo" dates in an elegant "800g" package.
            // Dates: Large, plump, glossy Medjoul dates. Some whole, one or two cut open to show rich flesh.
            // Packaging: A premium black or dark brown box/container with subtle gold branding "أطيب الثمر - چامبو - ٨٠٠جم". The dates should be clearly visible.
            // Background: Soft-focused dark background, maybe a hint of dark wood or fabric texture.
            // Lighting: Warm, inviting light, creating highlights on the dates.
            // Mood: Luxurious, high-quality, delicious, tempting.
            // File name: example-medjoul-jumbo-800g.png (use product.image_url from DB)

            card.innerHTML = `
                <div class="product-image-container">
                     <img src="${product.image_url}" alt="${product.name_ar}" class="product-main-image" loading="lazy"
                          onerror="this.onerror=null; this.src='placeholder-date.png'; this.alt='فشل تحميل الصورة'; console.warn('فشل تحميل الصورة: ${product.image_url}')">
                 </div>
                 <div class="product-details">
                    <h3 class="product-name">${product.name_ar}</h3>
                    <p class="product-description">${product.description_ar || 'تمور طبيعية فاخرة ذات جودة عالية.'}</p>
                    <p class="product-price">${priceFormatted}</p>
                    <button class="cta-button add-to-cart-btn" data-id="${product.id}" aria-label="أضف ${product.name_ar} إلى السلة">
                        أضف إلى السلة ✨
                    </button>
                </div>
            `;
            productGrid.appendChild(card);
            setTimeout(() => card.classList.remove('animate-card-enter'), 600 + (index * 50));
        });
        console.log("اكتمل عرض المنتجات المختارة.");
    };
    
    const filterAndDisplayProducts = () => {
        if (!selectedDateSize || !selectedPackWeight) {
            console.warn("لم يتم تحديد الحجم أو الوزن لعرض المنتجات.");
            productGrid.innerHTML = '<p class="empty-message">الرجاء اختيار حجم التمر ووزن العبوة أولاً.</p>';
            if(loadingIndicator) loadingIndicator.style.display = 'none';
            return;
        }
        if(loadingIndicator) loadingIndicator.style.display = 'block';
        productGrid.innerHTML = '<div class="spinner"></div>'; // Show spinner while filtering/rendering

        console.log(`فلترة المنتجات: الحجم=${selectedDateSize}, الوزن=${selectedPackWeight}جم`);
        // IMPORTANT: Ensure your Supabase 'products' table has 'category' (e.g., 'صغير', 'وسط', 'چامبو')
        // and 'weight_g' (e.g., 400, 800) columns.
        filteredProducts = allProducts.filter(p =>
            p.category === selectedDateSize && p.weight_g === selectedPackWeight
        );
        console.log("المنتجات المفلترة:", filteredProducts);
        
        // Delay rendering slightly if needed to show spinner
        setTimeout(() => {
            renderFilteredProducts();
        }, 200); // Adjust delay as needed, or remove if filtering is instant
    };


    const fetchProducts = async () => {
         if (!productGrid || !supabase) {
            console.error("لا يمكن جلب المنتجات، productGrid أو supabase client مفقود.");
            if(productGrid) productGrid.innerHTML = '<p class="error-message">خطأ اتصال. لا يمكن تحميل المنتجات.</p>';
            return;
         }
         if (loadingIndicator) loadingIndicator.style.display = 'block';
         // productGrid.innerHTML = ''; // No, grid is for specific filtered products now

         console.log("🚀 بدء جلب المنتجات...");

         try {
             // Make sure your table 'products' has: id, name_ar, description_ar, price, image_url, category, weight_g, created_at
             // `category` values: 'صغير', 'وسط', 'چامبو'
             // `weight_g` values: 400, 800 (numbers)
             let { data, error, status } = await supabase
                 .from('products')
                 .select('id, name_ar, description_ar, price, image_url, category, weight_g, created_at')
                 .order('created_at', { ascending: true });

             if (error) throw new Error(`خطأ قاعدة البيانات (${status}): ${error.message}`);

             if (data) {
                console.log(`✅ نجاح الجلب! تم العثور على ${data.length} منتج.`);
                 allProducts = data;
             } else {
                 console.warn("🤔 اكتمل الجلب، ولكن لم يتم استلام بيانات.");
                 allProducts = [];
             }
         } catch (error) {
            console.error('🔥 فشل جلب المنتجات:', error);
             allProducts = [];
             // Don't show error in main grid yet, user hasn't made selection. Maybe a general site notification.
             showNotification(`لم نتمكن من تحميل قائمة المنتجات! ${error.message}`, "error");
         } finally {
             // Don't hide loading indicator for productGrid here. It's for the final product display step.
             // Hide the general one on the product-display-screen if it was used there
             const productScreenLoading = productDisplayScreen.querySelector('#loading-indicator');
             if(productScreenLoading) productScreenLoading.style.display = 'none';
             
             updateCartUI(); // Update cart if there were stored items with new product data
             console.log("اكتمل تسلسل جلب المنتجات.");
        }
     };

    const validateCheckoutForm = () => { /* From Vibe Treats, translated field names & messages */
         const elementsPresent = checkoutForm && customerNameInput && customerPhoneInput && paymentMethodSelection &&
                              buildingDetailsInput && floorAptInput && landmarksInput &&
                              (!leafletAvailable || (mapContainer && locationStatus && customerLatitudeInput && customerLongitudeInput));
        if (!elementsPresent) {
             console.error("تخطي التحقق من صحة نموذج الطلب: العناصر المطلوبة مفقودة.");
             showNotification("خطأ في نموذج الطلب. الرجاء الاتصال بالدعم.", "error");
             return false;
        }
         let isValid = true;
         let firstInvalidField = null;
         const applyError = (element, isGroup = false, isMap = false) => { /* same logic */ 
            const elToStyle = isMap ? mapContainer : (isGroup ? paymentMethodSelection : element);
            if(!elToStyle) return;
            elToStyle.classList.add('input-error'); temporaryClass(elToStyle, 'shake-subtle', 500);
            if (!isGroup && !isMap && element) element.setAttribute('aria-invalid', 'true');
            if(!firstInvalidField) firstInvalidField = element || elToStyle;
         };
         const removeError = (element, isGroup = false, isMap = false) => { /* same logic */
            const elToStyle = isMap ? mapContainer : (isGroup ? paymentMethodSelection : element);
            if(!elToStyle) return;
            elToStyle.classList.remove('input-error');
            if (!isGroup && !isMap && element) element.removeAttribute('aria-invalid');
         };

         // Reset & Validations
         checkoutForm.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
         [customerNameInput, customerPhoneInput, buildingDetailsInput, floorAptInput, landmarksInput].forEach(el => { if (el) el.removeAttribute('aria-invalid'); });
         removeError(null, true, false); removeError(null, false, true);

         if (customerNameInput.value.trim().length < 2) { isValid = false; applyError(customerNameInput); console.warn("خطأ التحقق: الاسم"); } 
         else { removeError(customerNameInput); }
         
         if (!customerPhoneInput.checkValidity() || customerPhoneInput.value.trim() === '') { isValid = false; applyError(customerPhoneInput); console.warn("خطأ التحقق: رقم الهاتف"); }
         else { removeError(customerPhoneInput); }

        if (leafletAvailable) {
            const lat = parseFloat(customerLatitudeInput.value);
            const lng = parseFloat(customerLongitudeInput.value);
            if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
                isValid = false; applyError(null, false, true);
                if (locationStatus && !locationStatus.classList.contains('status-error')) {
                    locationStatus.textContent = '🚨 الرجاء تحديد موقعك على الخريطة أو البحث!'; locationStatus.className = 'status-error';
                }
                console.warn("خطأ التحقق: الموقع غير محدد.");
            } else {
                const isInZone = lat >= DELIVERY_ZONE.minLat && lat <= DELIVERY_ZONE.maxLat && lng >= DELIVERY_ZONE.minLng && lng <= DELIVERY_ZONE.maxLng;
                if (!isInZone) {
                    isValid = false; applyError(null, false, true);
                    if (locationStatus && !locationStatus.textContent.includes('خارج')) {
                        locationStatus.textContent = `🚨 خارج منطقة التوصيل (القاهرة الكبرى / الجيزة فقط)`; locationStatus.className = 'status-error';
                    }
                } else { removeError(null, false, true);
                    if (locationStatus && !locationStatus.textContent.includes('جيد')) {
                         locationStatus.textContent = `✅ الموقع جيد (منطقة التوصيل: القاهرة الكبرى / الجيزة)`; locationStatus.className = 'status-ok';
                    }
                }
            }
        }
        removeError(buildingDetailsInput); removeError(floorAptInput); removeError(landmarksInput); // These are optional

        const selectedPaymentMethod = checkoutForm.querySelector('input[name="payment_method"]:checked');
        if (!selectedPaymentMethod) {
            isValid = false; applyError(null, true, false); console.warn("خطأ التحقق: لم يتم اختيار طريقة الدفع.");
            if (!firstInvalidField) firstInvalidField = paymentMethodSelection?.querySelector('input[type="radio"]');
        } else { removeError(null, true, false); }

        if (!isValid) {
            showNotification("الرجاء التحقق من التفاصيل المميزة بالخطأ!", 'warn', 3000);
            if (firstInvalidField) { /* Scroll logic same as Vibe Treats */
                setTimeout(() => {
                    if (firstInvalidField === mapContainer || firstInvalidField.type === 'radio' || firstInvalidField.classList.contains('payment-method-selection')) {
                        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        if(firstInvalidField === mapContainer) temporaryClass(mapContainer, 'focus-highlight', 1000);
                        else if (paymentMethodSelection) temporaryClass(paymentMethodSelection, 'focus-highlight', 1000);
                    } else if (firstInvalidField.focus) {
                        firstInvalidField.focus({ preventScroll: true });
                        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
                if (checkoutModal) temporaryClass(checkoutModal, 'shake-error', 400);
            }
        } else {
             console.log("✅ تم التحقق من صحة نموذج الطلب.");
        }
        return isValid;
     };


    const handleCheckout = async (event) => { /* From Vibe Treats, translated messages, product field `name_ar` */
        event.preventDefault();
        const baseElementsOk = supabase && checkoutForm && submitOrderButton && checkoutMessage;
        const mapCheckOk = !leafletAvailable || (customerLatitudeInput && customerLongitudeInput);
        const addressFieldsOk = buildingDetailsInput && floorAptInput && landmarksInput;
        if (!baseElementsOk || !mapCheckOk || !addressFieldsOk) {
             showNotification("خطأ في نظام الطلب. الرجاء تحديث الصفحة أو الاتصال بالدعم.", "error"); return;
        }
        if (isSubmitting) { return; }
        if (cart.length === 0) { showNotification("سلتك فارغة!", "warn"); return; }
        if (!validateCheckoutForm()) return;

        isSubmitting = true;
        submitOrderButton.disabled = true;
        submitOrderButton.textContent = 'جاري حفظ الطلب... ⏳';
        checkoutMessage.textContent = ''; checkoutMessage.className = 'checkout-message';

        const formData = new FormData(checkoutForm);
        const customerData = {
            customer_name: formData.get('customer_name')?.trim() || 'غير متوفر',
            customer_phone: formData.get('customer_phone')?.trim() || 'غير متوفر',
            payment_method: formData.get('payment_method') || 'لم يتم الاختيار',
            latitude: leafletAvailable ? parseFloat(customerLatitudeInput.value) : null,
            longitude: leafletAvailable ? parseFloat(customerLongitudeInput.value) : null,
            building_details: formData.get('building_details')?.trim() ?? '',
            floor_apt: formData.get('floor_apt')?.trim() ?? '',
            landmarks: formData.get('landmarks')?.trim() ?? ''
        };
        if (leafletAvailable && (isNaN(customerData.latitude) || isNaN(customerData.longitude) || customerData.latitude === 0 || customerData.longitude === 0)) {
             showNotification("خطأ في بيانات الموقع. الرجاء إعادة تحديد موقعك.", "error");
             isSubmitting = false; submitOrderButton.disabled = false; submitOrderButton.textContent = 'حاول مرة أخرى؟ خطأ في الموقع';
             applyError(null, false, true); return;
        }
        const orderItems = cart.map(item => {
            const product = allProducts.find(p => p.id === item.id); // Use allProducts and product.name_ar
            return {
                product_id: item.id, quantity: item.quantity,
                name_at_purchase: product ? product.name_ar : 'غير معروف', // Use name_ar
                price_at_purchase: (product && typeof product.price === 'number') ? product.price : 0
            };
        }).filter(item => item.price_at_purchase > 0);

        if (orderItems.length !== cart.length) console.warn("بعض عناصر السلة لها سعر صفر وتمت تصفيتها.");
        if (orderItems.length === 0 && cart.length > 0) {
             showNotification("خطأ في معالجة عناصر السلة. الرجاء المحاولة مرة أخرى.", "error");
             isSubmitting = false; submitOrderButton.disabled = false; submitOrderButton.textContent = 'حاول مرة أخرى؟ خطأ في السلة'; return;
        }
        const calculatedTotalPrice = orderItems.reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0);

        // Table: orders. Columns: customer_name, customer_phone, latitude, longitude, building_details, floor_apt, landmarks, payment_method, order_items (JSONB), total_price, status
        const orderPayload = { ...customerData, order_items: orderItems, total_price: calculatedTotalPrice, status: 'Pending Payment/Confirmation' };

        try {
            const { data, error } = await supabase.from('orders').insert([orderPayload]).select();
            if (error) throw new Error(`خطأ قاعدة البيانات: ${error.message} (الكود: ${error.code}) تلميح: ${error.hint}`);
            console.log("✅ تم تسجيل الطلب بنجاح:", data);
            let successMsg = `🎉 تم تسجيل طلبك! الرجاء إتمام الدفع عبر ${customerData.payment_method}. سنتصل بك للتأكيد. شكرًا لك!`;
             // For Cash on Delivery
             if (customerData.payment_method === 'CashOnDelivery') {
                successMsg = `🎉 تم تسجيل طلبك بنجاح! الدفع عند الاستلام. سنتصل بك قريبًا للتأكيد وترتيب التوصيل. شكرًا لك!`;
             }
            checkoutMessage.textContent = successMsg;
            checkoutMessage.className = 'checkout-message success animate-fade-in';
            showNotification("تم إرسال تفاصيل الطلب! ننتظر تأكيد الدفع أو سنتصل للتأكيد.", 'success', 6000);
            cart = []; updateCartUI();
            setTimeout(closeCheckout, 5000);
        } catch (error) {
            console.error("🔥 فشل تسجيل الطلب:", error);
            let userErrorMessage = `😭 عفوًا! تعذر حفظ تفاصيل الطلب. الرجاء المحاولة مرة أخرى أو الاتصال بنا.`;
            checkoutMessage.textContent = userErrorMessage;
            checkoutMessage.className = 'checkout-message error animate-fade-in';
            showNotification(`فشل تسجيل الطلب. ${error.message}`, 'error', 7000);
            isSubmitting = false; submitOrderButton.disabled = false; submitOrderButton.textContent = 'حاول التأكيد مرة أخرى؟';
        }
    };


    const setupEventListeners = () => { /* From Vibe Treats, adapted selectors and translations if needed */
        const listenerElementsPresent = cartButton && closeCartButton && cartOverlay && checkoutButton && closeCheckoutButton && checkoutOverlay && checkoutForm && cartItemsContainer && productGrid && checkoutModal && (findMeButton || !leafletAvailable);
        if (!listenerElementsPresent) {
           console.error("لا يمكن إعداد جميع مستمعي الأحداث - عناصر تفاعلية حرجة مفقودة!");
           showNotification("خطأ في إعداد الصفحة. قد لا تعمل بعض الأزرار.", "error"); return;
        }
        cartButton.addEventListener('click', openCart);
        closeCartButton.addEventListener('click', closeCart);
        cartOverlay.addEventListener('click', closeCart);
        checkoutButton.addEventListener('click', openCheckout);
        closeCheckoutButton.addEventListener('click', closeCheckout);
        checkoutOverlay.addEventListener('click', (event) => { if (event.target === checkoutOverlay) closeCheckout(); });
        checkoutForm.addEventListener('submit', handleCheckout);

        cartItemsContainer.addEventListener('click', (event) => { /* Logic for increase/decrease/remove from cart */
            const targetButton = event.target.closest('.action-button'); if (!targetButton) return;
            const productId = targetButton.dataset.id; if (!productId) return;
            temporaryClass(targetButton, 'button-clicked', 200);
             if (targetButton.classList.contains('increase-quantity')) increaseQuantity(productId);
             else if (targetButton.classList.contains('decrease-quantity')) decreaseQuantity(productId);
             else if (targetButton.classList.contains('remove-item')) removeFromCart(productId);
        });

        productGrid.addEventListener('click', (event) => { /* Logic for add to cart from product card */
             const button = event.target.closest('.add-to-cart-btn');
             if (button) {
                event.preventDefault(); const productId = button.dataset.id;
                 if (productId) addToCart(productId, button);
                 else console.warn("زر الإضافة يفتقد data-id!");
             }
         });
        
        if (leafletAvailable && findMeButton) {
             findMeButton.addEventListener('click', () => {
                if (!mapInstance) { showNotification("الرجاء انتظار تحميل الخريطة.", "warn"); return; }
                findUserLocation(false);
             });
        } else if (!leafletAvailable && findMeButton) { findMeButton.disabled = true; findMeButton.title = "فشل تحميل مكتبة الخرائط"; }

        // Copy buttons
        checkoutModal.addEventListener('click', async (event) => {
            const copyButton = event.target.closest('.copy-button'); if (!copyButton) return;
            const targetSelector = copyButton.dataset.clipboardTarget;
            const targetElement = targetSelector ? document.querySelector(targetSelector) : null;
            if (!targetElement) { showNotification("خطأ في العثور على النص للنسخ.", "error"); return; }
            const textToCopy = targetElement.textContent || targetElement.innerText;
            if (!textToCopy) { showNotification("لا يوجد شيء لنسخه.", "info"); return; }
            try {
                await navigator.clipboard.writeText(textToCopy);
                const originalText = copyButton.innerHTML;
                copyButton.innerHTML = '✅ تم النسخ!'; copyButton.classList.add('copied');
                temporaryClass(copyButton, 'pulse-quick', 300);
                showNotification(`تم النسخ: ${textToCopy}`, 'success', 2000);
                setTimeout(() => { copyButton.innerHTML = originalText; copyButton.classList.remove('copied'); }, 2000);
            } catch (err) {
                showNotification('فشل النسخ تلقائيًا. الرجاء النسخ يدويًا.', 'error');
                // Fallback selection, Vibe Treats logic
            }
        });
        console.log("✅ اكتمل إعداد جميع مستمعي الأحداث.");
    };

    const initializePage = () => {
        console.log("----- تهيئة صفحة أطيب الثمر -----");
         try {
             const storedCart = localStorage.getItem('atyabElThamarCart'); // Unique key
             if (storedCart) {
                 try {
                     const parsedCart = JSON.parse(storedCart);
                     if (Array.isArray(parsedCart) && parsedCart.every(item => typeof item.id === 'string' && typeof item.quantity === 'number' && item.quantity > 0)) {
                         cart = parsedCart; console.log("تم تحميل السلة من localStorage:", cart.length, "عناصر");
                     } else { localStorage.removeItem('atyabElThamarCart'); cart = []; }
                 } catch (e) { localStorage.removeItem('atyabElThamarCart'); cart = []; }
            } else { cart = []; }

            if (yearSpan) yearSpan.textContent = new Date().getFullYear();
            
            // Show initial selection screen
            showScreen(dateSizeSelectionScreen);

             setupEventListeners();
             fetchProducts(); // Fetches all products into allProducts
            console.log("----- تمت تهيئة الصفحة ----- (جاري جلب المنتجات في الخلفية)");
        } catch (error) {
            console.error("☠️ خطأ فادح أثناء تهيئة الصفحة:", error);
             alert("حدث خطأ حرج أثناء تحميل الصفحة. الرجاء محاولة التحديث.");
             if(bodyElement) {
                 bodyElement.innerHTML = `<div style="padding: 40px; text-align: center; color: #DAA520; background-color: #111;">...رسالة خطأ HTML...</div>`;
            }
        }
    };

    initializePage();
});