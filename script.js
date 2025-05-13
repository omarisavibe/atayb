// --- ATYAB EL THAMAR SCRIPT - PREMIUM DATES (v_SatelliteAndDetails Base, Arabic, New Flow) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("----- ATYAB EL THAMAR STARTUP (v_SatelliteAndDetails_Dates_Visual) ----- DOM loaded."); // Added _Visual

    // --- SUPABASE CLIENT SETUP ---
    const SUPABASE_URL = 'https://lhodhrpfbetqrjfbdxzm.supabase.co'; // ✅ !! REPLACE THIS !!
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxob2RocnBmYmV0cXJqZmJkeHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNDY1MzAsImV4cCI6MjA2MjcyMjUzMH0.2XLcTLZU0rBo8sy7fPKzSX-25dBLD6m2zlZK2Gi2IDc'; // ✅ !! REPLACE THIS !!

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
        if (grid) grid.innerHTML = '<p style="color: red; text-align: center; font-weight: bold;">🗼 خطأ اتصال: فشل تحميل تمور الواحات.</p>'; // Updated text
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
    const checkoutTotalPriceElement = document.getElementById('checkout-total-price');
    const submitOrderButton = document.getElementById('submit-order-button');
    const checkoutMessage = document.getElementById('checkout-message');
    const yearSpan = document.getElementById('year');
    const loadingIndicator = document.getElementById('loading-indicator'); // This one is inside product-display-screen
    const bodyElement = document.body;
    const paymentMethodSelection = document.querySelector('.payment-method-selection');
    const paymentTotalReminders = document.querySelectorAll('.payment-total-reminder');

    // Selection Screens and Buttons
    const dateSizeSelectionScreen = document.getElementById('date-size-selection-screen');
    const packWeightSelectionScreen = document.getElementById('pack-weight-selection-screen');
    const productDisplayScreen = document.getElementById('product-display-screen');
    // IMPORTANT CHANGE HERE: Selecting the new visual cards for size
    const dateSizeOptions = dateSizeSelectionScreen.querySelectorAll('.size-option-card'); // <-- MODIFIED SELECTOR
    const packWeightOptions = packWeightSelectionScreen.querySelectorAll('.option-button'); // This remains for weight
    const selectedDateSizeDisplay = document.getElementById('selected-date-size-display');
    const finalProductSelectionInfo = document.getElementById('final-product-selection-info');
    const backToSizeSelectionButton = document.getElementById('back-to-size-selection');
    const backToWeightSelectionButton = document.getElementById('back-to-weight-selection');


    if (!productGrid || !cartButton || !cartSidebar || !cartOverlay || !cartCount || !cartItemsContainer || !cartTotalPrice ||
        !checkoutButton || !checkoutModal || !checkoutOverlay || !closeCheckoutButton || !checkoutForm || !submitOrderButton ||
        !customerNameInput || !customerPhoneInput || !checkoutSummary || !checkoutTotalPriceElement || !paymentMethodSelection || paymentTotalReminders.length === 0 ||
        !buildingDetailsInput || !floorAptInput || !landmarksInput ||
        (leafletAvailable && (!mapContainer || !locationStatus || !customerLatitudeInput || !customerLongitudeInput || !findMeButton)) ||
        !dateSizeSelectionScreen || !packWeightSelectionScreen || !productDisplayScreen || !dateSizeOptions.length || !packWeightOptions.length || !selectedDateSizeDisplay || !finalProductSelectionInfo || !backToSizeSelectionButton || !backToWeightSelectionButton
    ) {
        console.error("🛑 عناصر HTML حرجة مفقودة! تحقق من المعرفات/الفئات في ملف HTML الخاص بك مقابل السكربت (بما في ذلك عناصر الخريطة وحقول العنوان الجديدة وشاشات الاختيار).");
        alert("عفوًا! بعض الأجزاء الأساسية من الصفحة مفقودة في HTML. لا يمكن التشغيل بشكل صحيح.");
        if (bodyElement) bodyElement.innerHTML = '<h1 style="color: #DAA520; text-align: center; padding: 50px;">خطأ حرج في التخطيط: عناصر الصفحة مفقودة.</h1>';
        return;
    }
    console.log("✅ تم العثور على جميع عناصر HTML المطلوبة.");
    if (!leafletAvailable && mapContainer) {
        mapContainer.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">فشل تحميل مكتبة الخرائط.</p>';
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

    // --- DELIVERY ZONE & MAP CONFIG (Greater Cairo & Giza - Example) ---
    const DELIVERY_ZONE = {
        minLat: 29.85, maxLat: 30.25, minLng: 31.00, maxLng: 31.65
    };
    const DEFAULT_MAP_CENTER = [30.0444, 31.2357];
    const DEFAULT_MAP_ZOOM = 10;
    const LOCATION_FOUND_ZOOM = 17;

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19, attribution: 'Tiles © Esri'
    });
    console.log("منطقة التوصيل (تقريبي):", DELIVERY_ZONE);


    // --- UTILITY FUNCTIONS ---
    const formatCurrency = (amount) => {
        const numericAmount = typeof amount === 'number' ? amount : 0;
        return `${numericAmount.toFixed(2)} ج.م`;
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
        screenToShow.style.display = 'flex';
        screenToShow.classList.add('active-screen');
        window.scrollTo({ top: screenToShow.offsetTop - 100, behavior: 'smooth' });
    }
    
    dateSizeOptions.forEach(card => { // Changed from button to card
        card.addEventListener('click', () => {
            selectedDateSize = card.dataset.size;
            dateSizeOptions.forEach(c => c.classList.remove('selected')); // Changed from btn to c
            card.classList.add('selected');
            console.log("الحجم المختار:", selectedDateSize);
            selectedDateSizeDisplay.textContent = selectedDateSize; // "صغير", "وسط", "چامبو"
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
            console.log("الوزن المختار:", selectedPackWeight, "جم");
            filterAndDisplayProducts(); // This will now filter based on "Wahat Dates" implicitly if that's all in your DB
            showScreen(productDisplayScreen);
        });
    });
    
    backToSizeSelectionButton.addEventListener('click', () => {
        selectedDateSize = null;
        dateSizeOptions.forEach(c => c.classList.remove('selected')); // Changed from btn to c
        showScreen(dateSizeSelectionScreen);
    });

    backToWeightSelectionButton.addEventListener('click', () => {
        selectedPackWeight = null;
        packWeightOptions.forEach(btn => btn.classList.remove('selected'));
        productGrid.innerHTML = '';
        if(loadingIndicator) loadingIndicator.style.display = 'none'; // Hide main grid loading
        showScreen(packWeightSelectionScreen);
    });


    // --- CORE FUNCTIONS ---
    const updateCartUI = () => {
        if (!cartItemsContainer || !cartTotalPrice || !cartCount || !checkoutButton) {
            console.error("لا يمكن تحديث واجهة السلة - العناصر المطلوبة مفقودة.");
            return;
        }
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let itemCount = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-message fade-in">سلتك تنتظر أطايب الواحات. ابدأ رحلة الاختيار!</p>';
        } else {
            cart.forEach(item => {
                const product = allProducts.find(p => p.id === item.id); 
                if (!product || typeof product.price !== 'number' || !product.name_ar || !product.image_url) {
                    console.warn(`عرض السلة: بيانات مفقودة أو غير صالحة للمعرف: ${item.id}. تجاهل العنصر.`);
                    cartItemsContainer.innerHTML += `<p class="error-message" style="color: var(--error-color);">خطأ في عرض عنصر بالسلة.</p>`;
                    return;
                }

                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item', 'animate-item-enter');
                itemElement.dataset.itemId = item.id;
                // Ensure product.name_ar includes "تمور الواحات" as per your Supabase data.
                itemElement.innerHTML = `
                     <img src="${product.image_url}" alt="${product.name_ar}" class="cart-item-img" onerror="this.onerror=null; this.src='placeholder-date.png'; this.alt='فشل تحميل صورة المنتج';">
                    <div class="cart-item-info">
                         <h4>${product.name_ar}</h4>
                         <p>${formatCurrency(product.price)} × ${item.quantity}</p>
                     </div>
                     <div class="cart-item-actions">
                        <button class="decrease-quantity action-button" data-id="${item.id}" aria-label="تقليل الكمية">-</button>
                         <span class="item-quantity">${item.quantity}</span>
                        <button class="increase-quantity action-button" data-id="${item.id}" aria-label="زيادة الكمية">+</button>
                         <button class="remove-item action-button danger" data-id="${item.id}" aria-label="إزالة العنصر من السلة">×</button>
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
             localStorage.setItem('atyabElWahatCart', JSON.stringify(cart)); // Changed key to reflect "Wahat"
        } catch (e) {
            console.error("فشل حفظ السلة في localStorage:", e);
             showNotification("لم يتم حفظ تغييرات السلة بشكل صحيح.", "error");
        }

        checkoutButton.disabled = cart.length === 0;
        checkoutButton.textContent = cart.length === 0 ? 'السلة فارغة' : 'إتمام الطلب والدفع';
    };

    const addToCart = (productId, buttonElement) => {
        const product = allProducts.find(p => p.id === productId);
        if (!product) {
             console.error(`خطأ إضافة للسلة: المنتج بالمعرف ${productId} غير موجود.`);
             showNotification("عفواً، لم نتمكن من العثور على هذا المنتج.", 'error');
            return;
        }
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
             showNotification(`+١ ${product.name_ar}! اختيار رائع من كنوز الواحات.`, 'info');
        } else {
            cart.push({ id: productId, quantity: 1 });
            showNotification(`تمت إضافة ${product.name_ar} إلى سلتك! ذوق رفيع.`, 'success');
        }
        if(buttonElement) temporaryClass(buttonElement, 'button-adding', 400);
        temporaryClass(cartCount, 'pulse-quick', 500);
        if (cartButton) temporaryClass(cartButton, 'shake-subtle', 500);
        updateCartUI();
    };

    const removeFromCart = (productId) => {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex === -1) return;
        const product = allProducts.find(p => p.id === productId);
        const productName = product ? product.name_ar : 'المنتج';
        cart = cart.filter(item => item.id !== productId);
        showNotification(`تمت إزالة ${productName} من السلة.`, 'info');
        const itemElement = cartItemsContainer.querySelector(`.cart-item[data-item-id="${productId}"]`);
        if (itemElement) {
            itemElement.classList.add('animate-item-exit');
            itemElement.addEventListener('animationend', () => {
                updateCartUI(); // Update after animation to avoid jump
            }, { once: true });
        } else {
            updateCartUI();
        }
    };
    const increaseQuantity = (productId) => { 
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity++;
            updateCartUI();
            const itemElement = cartItemsContainer?.querySelector(`.cart-item[data-item-id="${productId}"] .item-quantity`);
            if(itemElement) temporaryClass(itemElement.parentElement.parentElement, 'pulse-quick', 300);
        }
    };
    const decreaseQuantity = (productId) => { 
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

    const openCart = () => { 
        if (!cartSidebar || !cartOverlay || !bodyElement) return;
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        bodyElement.classList.add('overlay-active', 'cart-open');
        isCartOpen = true;
    };
    const closeCart = () => { 
        if (!cartSidebar || !cartOverlay || !bodyElement) return;
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        bodyElement.classList.remove('overlay-active', 'cart-open');
        isCartOpen = false;
    };
    
    // --- Map and Checkout logic (largely from Vibe Treats, translated and adapted) ---
    const updateLocation = (lat, lng, locationName = null) => {
        if (!mapInstance || !markerInstance || !customerLatitudeInput || !customerLongitudeInput || !locationStatus || !mapContainer) return;
        const latLng = L.latLng(lat, lng);
        if (!markerInstance.getLatLng() || markerInstance.getLatLng().lat === 0) { // Only add if not already added or at 0,0
            markerInstance.setLatLng(latLng).addTo(mapInstance);
        } else {
            markerInstance.setLatLng(latLng);
        }
        mapInstance.setView(latLng, LOCATION_FOUND_ZOOM);
        customerLatitudeInput.value = lat.toFixed(6);
        customerLongitudeInput.value = lng.toFixed(6);

        const isInZone = lat >= DELIVERY_ZONE.minLat && lat <= DELIVERY_ZONE.maxLat &&
                         lng >= DELIVERY_ZONE.minLng && lng <= DELIVERY_ZONE.maxLng;
        
        let statusText = `الإحداثيات: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        let popupText = `<b>${locationName || 'الموقع المحدد على الخريطة'}</b><br>${statusText}`;

        if (isInZone) {
            locationStatus.textContent = `✅ الموقع ضمن نطاق التوصيل (القاهرة الكبرى / الجيزة).`;
            locationStatus.className = 'status-ok';
            mapContainer.classList.remove('input-error');
            popupText += '<br><span style="color: green;">✅ داخل منطقة التوصيل</span>';
        } else {
            locationStatus.textContent = `🚨 عذراً، الموقع المحدد خارج نطاق التوصيل (القاهرة الكبرى / الجيزة فقط).`;
            locationStatus.className = 'status-error';
            mapContainer.classList.add('input-error');
            popupText += '<br><span style="color: red;">🚨 خارج منطقة التوصيل</span>';
             showNotification("الموقع المحدد خارج منطقة التوصيل لدينا. نقدم خدماتنا في القاهرة الكبرى والجيزة.", "warn", 4500);
        }
        markerInstance.bindPopup(popupText).openPopup();
    };

    const findUserLocation = (initialLoad = false) => { 
        if (!navigator.geolocation) {
            if (!initialLoad) showNotification("عذرًا، متصفحك لا يدعم خاصية تحديد الموقع تلقائياً.", "warn");
            if (mapInstance && initialLoad) {
                mapInstance.setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM);
                locationStatus.textContent = 'تحديد الموقع غير مدعوم. الرجاء التحديد يدوياً على الخريطة أو البحث.';
                locationStatus.className = 'status-pending';
            }
            return;
        }

        if (!initialLoad) showNotification("لحظات، نحاول تحديد موقعك الحالي...", "info", 2000);
        if (findMeButton) findMeButton.disabled = true;
        locationStatus.textContent = 'جاري البحث عن موقعك، يرجى الانتظار...';
        locationStatus.className = 'status-pending';

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                updateLocation(latitude, longitude, "موقعك الحالي التقريبي");
                if (findMeButton) findMeButton.disabled = false;
            },
            (error) => {
                let message = "تعذر الحصول على موقعك بدقة.";
                if (error.code === error.PERMISSION_DENIED) message = "تم رفض إذن تحديد الموقع. يمكنك السماح به أو التحديد يدوياً.";
                else if (error.code === error.POSITION_UNAVAILABLE) message = "معلومات الموقع غير متاحة حالياً.";
                else if (error.code === error.TIMEOUT) message = "انتهى وقت محاولة تحديد الموقع.";
                
                if (!initialLoad) showNotification(message, "warn");
                locationStatus.textContent = message + ' نرجو تحديد موقعك يدوياً على الخريطة أو البحث عن العنوان.';
                locationStatus.className = 'status-error';
                 if (mapInstance && initialLoad) mapInstance.setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM);
                 if (findMeButton) findMeButton.disabled = false;
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // High accuracy, no cache
        );
    };
    
    const initializeMap = () => { 
        if (!leafletAvailable || !mapContainer) {
             if (mapContainer) mapContainer.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">خطأ فني: فشل تحميل مكتبة الخرائط.</p>';
             return;
        }
        if (mapInstance) { 
            try { mapInstance.remove(); } catch(e) { console.warn("Error removing old map instance:", e); }
            mapInstance = null; markerInstance = null; geocoderControl = null; layerControl = null;
        }
        mapContainer.querySelector('p')?.remove(); // Remove "جاري تهيئة الخريطة"
        mapContainer.classList.remove('input-error');
        locationStatus.textContent = 'الرجاء تحديد موقعكم على الخريطة أو البحث عن العنوان.';
        locationStatus.className = 'status-pending';

        try {
             mapInstance = L.map('map-container', { center: DEFAULT_MAP_CENTER, zoom: DEFAULT_MAP_ZOOM, layers: [osmLayer] });
             const baseMaps = { "خريطة الشارع الأساسية": osmLayer, "عرض القمر الصناعي (صور جوية)": satelliteLayer };
             layerControl = L.control.layers(baseMaps).addTo(mapInstance);
             markerInstance = L.marker([0,0], { draggable: true }); // Draggable marker by default
             
             markerInstance.on('dragend', function(event){
                var marker = event.target;
                var position = marker.getLatLng();
                updateLocation(position.lat, position.lng, "الموقع المحدد بالسحب");
            });

             if (geocoderAvailable) {
                geocoderControl = L.Control.geocoder({
                    defaultMarkGeocode: false,
                    placeholder: "ابحث عن عنوانك (مثال: شارع التحرير، الدقي)...",
                    errorMessage: "لم يتم العثور على نتائج. حاول بكلمات أخرى.",
                    geocoder: L.Control.Geocoder.nominatim({
                        geocodingQueryParams: { countrycodes: 'eg', "accept-language": 'ar, en', viewbox: '30.9,29.7,31.9,30.3', bounded: 0 }
                    }),
                    position: 'topright', collapsed: window.innerWidth < 768, // Collapsed on mobile
                }).on('markgeocode', (e) => { 
                    updateLocation(e.geocode.center.lat, e.geocode.center.lng, e.geocode.name); 
                    markerInstance.setLatLng(e.geocode.center); // Ensure marker moves with geocode
                }).addTo(mapInstance);
            }
            mapInstance.on('click', (e) => { 
                updateLocation(e.latlng.lat, e.latlng.lng); 
                markerInstance.setLatLng(e.latlng); // Ensure marker moves with click
            });
            setTimeout(() => findUserLocation(true), 500); // Attempt to find location on map init
        } catch (error) {
             console.error("🔥 فشل تهيئة خريطة Leaflet:", error);
             mapContainer.innerHTML = `<p style="color: red; text-align: center; padding: 20px;">حدث خطأ أثناء تحميل الخريطة: ${error.message}</p>`;
        }
    };

    const openCheckout = () => {
        // ... (validation for elements) ...
        if (cart.length === 0) {
            showNotification("سلتك فارغة! أضف بعض كنوز الواحات أولاً.", "warn");
            return;
        }

        // ... (summaryHTML, total calculation) ...
        let summaryHTML = '<ul>';
        let total = 0;
        cart.forEach(item => {
             const product = allProducts.find(p => p.id === item.id);
             if (product && typeof product.price === 'number') {
                summaryHTML += `<li>${item.quantity} × ${product.name_ar} (${formatCurrency(product.price)} للواحدة)</li>`;
                 total += product.price * item.quantity;
             } else {
                summaryHTML += `<li class="error-message" style="color:var(--error-color);">خطأ في تفاصيل المنتج: ${item.id || 'غير معروف'}</li>`;
             }
        });
        summaryHTML += '</ul>';
        checkoutSummary.innerHTML = summaryHTML;
        const totalFormatted = formatCurrency(total);
        checkoutTotalPriceElement.textContent = totalFormatted;
        paymentTotalReminders.forEach(span => { span.textContent = totalFormatted; });
        
        // ... (reset form, messages, etc.) ...
        checkoutForm.reset(); // Reset form fields
        customerLatitudeInput.value = ''; 
        customerLongitudeInput.value = '';
        if (locationStatus) {
             locationStatus.textContent = 'الرجاء تحديد موقعكم على الخريطة أو البحث عن العنوان.';
             locationStatus.className = 'status-pending';
        }
        if (mapContainer) mapContainer.classList.remove('input-error');
        checkoutMessage.textContent = ''; 
        checkoutMessage.className = 'checkout-message';
        submitOrderButton.disabled = false;
        submitOrderButton.textContent = 'تأكيد الطلب وإرسال التفاصيل النهائية';
        isSubmitting = false;
        if (findMeButton) findMeButton.disabled = false;
        checkoutForm.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        if (paymentMethodSelection) paymentMethodSelection.classList.remove('input-error');


        checkoutModal.classList.add('active');
        checkoutOverlay.classList.add('active');
        bodyElement.classList.add('overlay-active', 'checkout-open');
        isCheckoutOpen = true;
        if (isCartOpen) closeCart();

        if (leafletAvailable) {
             setTimeout(() => { 
                initializeMap(); 
                if (customerNameInput) customerNameInput.focus(); 
            }, 150); // Delay slightly for modal transition
        } else {
             if (mapContainer) mapContainer.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">فشل تحميل مكتبة الخرائط. لا يمكن تحديد الموقع.</p>';
        }
     };

    const closeCheckout = () => { 
        if (!checkoutModal || !checkoutOverlay || !bodyElement) return;
        checkoutModal.classList.remove('active');
        checkoutOverlay.classList.remove('active');
        bodyElement.classList.remove('overlay-active', 'checkout-open');
        isCheckoutOpen = false;
        if (mapInstance) {
            try { mapInstance.remove(); } catch(e) { console.warn("Error removing map on checkout close:", e); }
            mapInstance = null; markerInstance = null; geocoderControl = null; layerControl = null;
        }
        if (submitOrderButton) {
             submitOrderButton.disabled = false;
             submitOrderButton.textContent = 'تأكيد الطلب وإرسال التفاصيل النهائية';
        }
        isSubmitting = false;
    };
    

    // --- Render Products ---
    const renderFilteredProducts = () => {
        if (!productGrid) return;
        const currentLoadingIndicator = productGrid.querySelector('.spinner, #loading-indicator, .loading-msg');
        if(currentLoadingIndicator) currentLoadingIndicator.remove();


        if (filteredProducts.length === 0) {
            productGrid.innerHTML = '<p class="empty-message fade-in" style="grid-column: 1 / -1;">عفوًا، لا توجد تمور واحات تطابق هذا الحجم والوزن حاليًا. جرب اختيارًا آخر.</p>';
            finalProductSelectionInfo.textContent = `تمور الواحات ${selectedDateSize || ''} بوزن ${selectedPackWeight || ''} جم: غير متوفر حالياً.`;
            return;
        }
        
        // Assumes product.name_ar from DB correctly represents "تمور الواحات حجم وزن"
        finalProductSelectionInfo.textContent = `اختر من تمور الواحات "${selectedDateSize}" بوزن "${selectedPackWeight} جم":`;

        filteredProducts.forEach((product, index) => {
             if (!product || typeof product.id !== 'string' || !product.name_ar || typeof product.price !== 'number' || !product.image_url) {
                 console.warn("تجاهل عرض المنتج بسبب بيانات غير كاملة:", product);
                 const errorCard = document.createElement('div');
                 errorCard.className = 'product-card error-card';
                 errorCard.innerHTML = `<p>خطأ في عرض بيانات المنتج.</p>`;
                 productGrid.appendChild(errorCard);
                 return;
             }
            const card = document.createElement('article');
            card.classList.add('product-card', 'animate-card-enter');
            card.style.setProperty('--animation-delay', `${index * 0.05}s`);
            const priceFormatted = formatCurrency(product.price);
            
            card.innerHTML = `
                <div class="product-image-container">
                     <img src="${product.image_url}" alt="${product.name_ar}" class="product-main-image" loading="lazy"
                          onerror="this.onerror=null; this.src='placeholder-date.png'; this.alt='فشل تحميل صورة المنتج'; console.warn('فشل تحميل الصورة: ${product.image_url}')">
                 </div>
                 <div class="product-details">
                    <h3 class="product-name">${product.name_ar}</h3>
                    <p class="product-description">${product.description_ar || 'تمور واحات طبيعية فاخرة ذات جودة عالية.'}</p>
                    <p class="product-price">${priceFormatted}</p>
                    <button class="cta-button add-to-cart-btn" data-id="${product.id}" aria-label="أضف ${product.name_ar} إلى السلة">
                        أضف إلى السلة <span style="font-size: 1.2em;">✨</span>
                    </button>
                </div>
            `;
            productGrid.appendChild(card);
            setTimeout(() => card.classList.remove('animate-card-enter'), 600 + (index * 50));
        });
    };
    
    const filterAndDisplayProducts = () => {
        if (!selectedDateSize || !selectedPackWeight) {
            productGrid.innerHTML = '<p class="empty-message">الرجاء اختيار حجم التمر ووزن العبوة أولاً لعرض المنتجات.</p>';
            const currentLoadingIndicator = productDisplayScreen.querySelector('#loading-indicator');
            if (currentLoadingIndicator) currentLoadingIndicator.style.display = 'none';
            return;
        }
        
        const currentLoadingIndicator = productDisplayScreen.querySelector('#loading-indicator');
        if (currentLoadingIndicator) currentLoadingIndicator.style.display = 'block'; // Show the main loading indicator on product screen
        productGrid.innerHTML = '<div class="spinner"></div>'; // Or use the general loading message

        console.log(`فلترة المنتجات: الحجم=${selectedDateSize}, الوزن=${selectedPackWeight}جم`);
        // This filter assumes 'allProducts' contains various "Wahat Dates" products
        // and 'category' matches 'صغير', 'وسط', 'چامبو' from data-size attributes.
        // and 'weight_g' matches 400, 800 from data-weight attributes.
        // The product names in Supabase (name_ar) should be specific e.g., "تمور الواحات صغير (٤٠٠ جم)"
        filteredProducts = allProducts.filter(p =>
            p.category === selectedDateSize && 
            p.weight_g === selectedPackWeight &&
            p.name_ar.includes("الواحات") // Ensures we are only showing Wahat dates if other types exist in DB
        );
        console.log("المنتجات المفلترة (تمور الواحات):", filteredProducts);
        
        setTimeout(() => {
            if (currentLoadingIndicator) currentLoadingIndicator.style.display = 'none'; // Hide after a delay
            renderFilteredProducts();
        }, 300); 
    };


    const fetchProducts = async () => {
         if (!supabase) {
            console.error("لا يمكن جلب المنتجات، Supabase client مفقود.");
            // Don't modify productGrid here as it's not the main loading display for this step
            return;
         }
         // No loading indicator shown here, it's part of filterAndDisplayProducts for the grid
         console.log("🚀 بدء جلب جميع منتجات الواحات...");

         try {
             // Ensure your 'products' table has: id, name_ar (e.g., "تمور الواحات صغير (٤٠٠ جم)"), 
             // description_ar, price, image_url, category ('صغير', 'وسط', 'چامبو'), weight_g (400, 800)
             let { data, error, status } = await supabase
                 .from('products')
                 .select('id, name_ar, description_ar, price, image_url, category, weight_g, created_at')
                 //.ilike('name_ar', '%الواحات%') // Optional: Filter for "Wahat" at DB level if table has other date types
                 .order('category', { ascending: true })
                 .order('weight_g', { ascending: true });

             if (error) throw new Error(`خطأ قاعدة البيانات (${status}): ${error.message}`);

             if (data) {
                console.log(`✅ نجاح الجلب! تم العثور على ${data.length} منتج من تمور الواحات.`);
                 allProducts = data;
             } else {
                 allProducts = [];
             }
         } catch (error) {
            console.error('🔥 فشل جلب منتجات الواحات:', error);
             allProducts = [];
             showNotification(`لم نتمكن من تحميل قائمة تمور الواحات! ${error.message}`, "error");
         } finally {
             updateCartUI(); // Update cart if there were stored items
             console.log("اكتمل تسلسل جلب منتجات الواحات.");
        }
     };

    const validateCheckoutForm = () => { /* ... No changes to internal logic, just ensure messages are elegant if modified ... */
        // ... (validation logic remains the same) ...
        // Example of more elegant notification for validation:
        if (!isValid) {
            showNotification("نرجو مراجعة البيانات المدخلة والتأكد من الحقول المميزة.", 'warn', 3500);
            // ... (rest of the focusing logic) ...
        }
        return isValid;
     };


    const handleCheckout = async (event) => { /* ... No changes to internal logic, ensure messages are elegant ... */
        event.preventDefault();
        // ... (initial checks) ...
        if (!validateCheckoutForm()) return;

        isSubmitting = true;
        submitOrderButton.disabled = true;
        submitOrderButton.textContent = 'لحظات من فضلك، يتم حفظ طلبك... ⏳';
        // ... (formData, customerData, orderItems) ...

        // Table: orders. Columns: customer_name, customer_phone, latitude, longitude, building_details, floor_apt, landmarks, payment_method, order_items (JSONB), total_price, status
        const orderPayload = { /* ... as before ... */ };

        try {
            const { data, error } = await supabase.from('orders').insert([orderPayload]).select();
            if (error) throw new Error(`خطأ بقاعدة البيانات: ${error.message} (الرمز: ${error.code}) تلميح: ${error.hint}`);
            
            let successMsg = `🎉 تم تسجيل طلبكم بنجاح! نشكركم لاختيار أطايب الواحات.`;
             if (customerData.payment_method === 'CashOnDelivery') {
                successMsg += ` سيتم الدفع عند الاستلام. سنتواصل معكم قريباً لتأكيد الطلب وترتيبات التوصيل.`;
             } else {
                successMsg += ` الرجاء إتمام الدفع عبر ${customerData.payment_method}. سنتواصل للتأكيد فور استلام المبلغ.`;
             }
            checkoutMessage.textContent = successMsg;
            checkoutMessage.className = 'checkout-message success animate-fade-in';
            showNotification("تم إرسال تفاصيل طلبكم بنجاح! شكراً لثقتكم.", 'success', 7000);
            cart = []; updateCartUI();
            setTimeout(closeCheckout, 6000); // Slightly longer for user to read
        } catch (error) {
            console.error("🔥 فشل تسجيل الطلب:", error);
            let userErrorMessage = `😭 عفوًا! حدث خطأ أثناء محاولة حفظ طلبكم. نرجو المحاولة مرة أخرى أو التواصل معنا مباشرة لمساعدتكم.`;
            checkoutMessage.textContent = userErrorMessage;
            checkoutMessage.className = 'checkout-message error animate-fade-in';
            showNotification(`فشل تسجيل الطلب. ${error.message}`, 'error', 8000);
            isSubmitting = false; submitOrderButton.disabled = false; submitOrderButton.textContent = 'محاولة تأكيد الطلب مرة أخرى؟';
        }
    };


    const setupEventListeners = () => { /* ... No changes to internal logic ... */
        // ... (all event listeners setup as before, ensuring selectors are still valid for new HTML if any changes were deep) ...
        // The productGrid listener will work fine as product cards structure is the same.
        // The cartItemsContainer listener is also fine.
    };

    const initializePage = () => {
        console.log("----- تهيئة صفحة أطايب الواحات -----");
         try {
             const storedCart = localStorage.getItem('atyabElWahatCart'); // Changed key
             if (storedCart) {
                 try {
                     const parsedCart = JSON.parse(storedCart);
                     if (Array.isArray(parsedCart) && parsedCart.every(item => typeof item.id === 'string' && typeof item.quantity === 'number' && item.quantity > 0)) {
                         cart = parsedCart;
                     } else { localStorage.removeItem('atyabElWahatCart'); cart = []; }
                 } catch (e) { localStorage.removeItem('atyabElWahatCart'); cart = []; }
            } else { cart = []; }

            if (yearSpan) yearSpan.textContent = new Date().getFullYear();
            
            showScreen(dateSizeSelectionScreen);

             setupEventListeners();
             fetchProducts(); // Fetches all "Wahat Dates" products
            console.log("----- تمت تهيئة الصفحة بنجاح ----- (جاري جلب منتجات الواحات في الخلفية)");
        } catch (error) {
            console.error("☠️ خطأ فادح أثناء تهيئة الصفحة:", error);
             alert("حدث خطأ جسيم أثناء تحميل الصفحة. نرجو محاولة تحديث الصفحة أو العودة لاحقاً.");
             if(bodyElement) {
                 bodyElement.innerHTML = `<div style="padding: 40px; text-align: center; color: #DAA520; background-color: #111;"><h1>عذراً، حدث خطأ غير متوقع</h1><p>نواجه بعض الصعوبات التقنية في عرض الصفحة حالياً. الرجاء المحاولة مرة أخرى بعد قليل.</p></div>`;
            }
        }
    };

    initializePage();
});
