(function() {
  // ---------- GLOBAL NAVIGATION FUNCTION ----------
  window.navigateTo = function(url) {
    window.location.href = url;
  };

  // ---------- SHARED CART FUNCTIONALITY ----------
  let cart = JSON.parse(localStorage.getItem('zp_cart')) || [];

  function updateCart() {
    const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    const total = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
    
    const cartCountEl = document.getElementById('cartCount');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartIconEl = document.getElementById('cartIcon');
    const cartItemsEl = document.getElementById('cartItems');
    
    if (cartCountEl) cartCountEl.textContent = count;
    if (cartTotalEl) cartTotalEl.textContent = total.toFixed(2);
    if (cartIconEl) cartIconEl.setAttribute('data-count', count || '');
    
    if (cartItemsEl) {
      if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p style="color: #888; padding: 20px 0;">Your cart is empty</p>';
      } else {
        cartItemsEl.innerHTML = cart.map((item, index) => `
          <div class="cart-item">
            <span><strong>${item.name}</strong> $${item.price} x${item.qty || 1}</span>
            <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
          </div>
        `).join('');
      }
    }
    
    localStorage.setItem('zp_cart', JSON.stringify(cart));
  }

  window.addToCart = function(product) {
    const existing = cart.find(item => item.id == product.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    updateCart();
    showNotification(`${product.name} added to cart`);
  };

  // Remove from cart
  document.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.remove-item');
    if (removeBtn) {
      const index = removeBtn.dataset.index;
      cart.splice(index, 1);
      updateCart();
    }
  });

  // Notification function
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: #C6A962;
      color: #111;
      padding: 16px 24px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      box-shadow: 0 20px 30px -10px rgba(0,0,0,0.08);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Add animation style
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  // ---------- SHARED UI FUNCTIONALITY ----------
  
  // Mobile drawer
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const closeDrawer = document.getElementById('closeDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.add('open');
      if (drawerOverlay) drawerOverlay.classList.add('active');
    });
  }

  if (closeDrawer) {
    closeDrawer.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('open');
      if (drawerOverlay) drawerOverlay.classList.remove('active');
    });
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('open');
      drawerOverlay.classList.remove('active');
    });
  }

  // Navigation
  document.querySelectorAll('.nav-links a, .mobile-drawer a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href) window.location.href = href;
    });
  });

  // Logo
  const logoHome = document.getElementById('logoHome');
  if (logoHome) {
    logoHome.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  // Cart icons
  const cartIcon = document.getElementById('cartIcon');
  const bottomCart = document.getElementById('bottomCart');
  const cartPreview = document.getElementById('cartPreview');

  if (cartIcon && cartPreview) {
    cartIcon.addEventListener('click', () => {
      cartPreview.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (bottomCart && cartPreview) {
    bottomCart.addEventListener('click', () => {
      cartPreview.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Checkout
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your cart is empty');
      } else {
        alert('Proceeding to checkout (demo)');
      }
    });
  }

  // Back to top
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Search icon
  const searchIcon = document.getElementById('searchIcon');
  if (searchIcon) {
    searchIcon.addEventListener('click', () => {
      alert('Search functionality (demo)');
    });
  }

  // Wishlist icon
  const wishlistIcon = document.getElementById('wishlistIcon');
  if (wishlistIcon) {
    wishlistIcon.addEventListener('click', () => {
      window.location.href = 'wishlist.html';
    });
  }

  // Newsletter
  const newsletterBtn = document.getElementById('newsletterBtn');
  if (newsletterBtn) {
    newsletterBtn.addEventListener('click', () => {
      const email = document.getElementById('newsletterEmail');
      if (email && email.value) {
        alert(`Subscribed with ${email.value}`);
        email.value = '';
      } else {
        alert('Please enter your email');
      }
    });
  }

  // Slider drag functionality
  document.querySelectorAll('.slider-container').forEach(slider => {
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.style.cursor = 'grabbing';
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    });
  });

  // ---------- PRODUCT DATA ----------
  const products = [
    { id: 1, name: 'Oversized Hoodie', price: 89, category: 'Hoodie', image: 'photo-1556905055-8f358a7a47b2.jpg', badge: 'New' },
    { id: 2, name: 'Cargo Pants', price: 120, category: 'Pants', image: 'photo-1503342217505-b0a15ec3261c.jpg', badge: 'New' },
    { id: 3, name: 'Graphic Tee', price: 45, category: 'T-shirt', image: 'photo-1523381210434-271e8be1f52b.avif', badge: 'New' },
    { id: 4, name: 'Varsity Jacket', price: 230, category: 'Jacket', image: 'photo-1552374196-1ab2a1c593e8.jpg', badge: 'Limited' },
    { id: 5, name: 'Crossbody Bag', price: 59, category: 'Accessories', image: 'accessories.jpg', badge: 'New' },
    { id: 6, name: 'Sneakers', price: 149, category: 'Shoes', image: 'sneakers.jpg', badge: 'New' },
    { id: 7, name: 'Denim Jeans', price: 110, category: 'Pants', image: 'denim.jpg', badge: 'New' },
    { id: 8, name: 'Puffer Vest', price: 169, category: 'Jacket', image: 'jacket.jpg', badge: 'New' },
    { id: 9, name: 'Leather Wallet', price: 39, category: 'Accessories', image: 'wallet.jpg', badge: 'New' },
    { id: 10, name: 'Mini Crossbody', price: 49, category: 'Accessories', image: 'Mini Crossbody.jpg', badge: 'New' },
    { id: 11, name: 'Cotton Hoodie', price: 79, category: 'Hoodie', image: 'photo-1503342217505-b0a15ec3261c.jpg', badge: 'New' },
    { id: 12, name: 'Running Shoes', price: 129, category: 'Shoes', image: 'Running Shoes.jpg', badge: 'New' }
  ];

  const categories = [
    { name: 'Men', img: 'photo-1552374196-1ab2a1c593e8.jpg' },
    { name: 'Women', img: 'photo-1503342217505-b0a15ec3261c.jpg' },
    { name: 'Oversized', img: 'oversized.webp' },
    { name: 'Accessories', img: 'accessories.jpg' }
  ];

  // Product click handler
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (card && !e.target.closest('.remove-item') && !e.target.closest('.wishlist-remove') && !e.target.closest('.add-to-cart-btn')) {
      const id = card.dataset.id;
      const name = card.dataset.name;
      const price = parseFloat(card.dataset.price);
      if (id && name && price) {
        addToCart({ id, name, price });
      }
    }
  });

  // ---------- HOME PAGE ----------
  if (document.getElementById('newArrivalsGrid')) {
    // Render New Arrivals
    const newGrid = document.getElementById('newArrivalsGrid');
    newGrid.innerHTML = products.slice(0, 4).map(p => `
      <div class="product-card" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">
        <div class="card-image" style="background-image: url('${p.image}')">
          <div class="badge">${p.badge}</div>
        </div>
        <div class="card-info">
          <div class="card-category">${p.category}</div>
          <div class="card-title">${p.name}</div>
          <div class="card-price">$${p.price}</div>
        </div>
      </div>
    `).join('');

    // Render Categories
    const catGrid = document.getElementById('categoriesGrid');
    catGrid.innerHTML = categories.map(c => `
      <div class="cat-card" style="background-image: url('${c.img}')" onclick="window.location.href='shop.html?category=${c.name.toLowerCase()}'">
        <div class="overlay"><span>${c.name}</span></div>
      </div>
    `).join('');

    // Best Sellers Slider
    const sliderDiv = document.getElementById('bestsellerSlider');
    sliderDiv.innerHTML = products.slice(2, 6).map(p => `
      <div class="slider-item product-card" style="min-width: 260px;" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">
        <div class="card-image" style="background-image: url('${p.image}')"></div>
        <div class="card-info">
          <div class="card-category">${p.category}</div>
          <div class="card-title">${p.name}</div>
          <div class="card-price">$${p.price}</div>
        </div>
      </div>
    `).join('');

    // Testimonials Slider
    const testiSlider = document.getElementById('testimonialsSlider');
    testiSlider.innerHTML = `
      <div class="slider-item testimonial-card">
        <div style="margin-bottom: 16px;">
          <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
        </div>
        <p style="margin-bottom: 16px;">"Best quality hoodie I've ever owned. The fit is perfect."</p>
        <strong>— Alex R.</strong>
      </div>
      <div class="slider-item testimonial-card">
        <div style="margin-bottom: 16px;">
          <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
        </div>
        <p style="margin-bottom: 16px;">"Fast shipping and amazing customer service. Will buy again."</p>
        <strong>— Jordan T.</strong>
      </div>
      <div class="slider-item testimonial-card">
        <div style="margin-bottom: 16px;">
          <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
        </div>
        <p style="margin-bottom: 16px;">"The attention to detail is incredible. My new favorite brand."</p>
        <strong>— Taylor S.</strong>
      </div>
    `;
  }

  // ---------- SHOP PAGE ----------
  if (document.getElementById('productGrid')) {
    let currentPage = 1;
    const itemsPerPage = 12;
    let filteredProducts = [...products];
    let activeFilters = {
      categories: [],
      price: { min: 0, max: 1000 }
    };

    const productGrid = document.getElementById('productGrid');
    const resultsCount = document.getElementById('resultsCount');
    const activeFiltersDiv = document.getElementById('activeFilters');
    const paginationDiv = document.getElementById('pagination');

    function renderProducts() {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const productsToShow = filteredProducts.slice(start, end);

      if (productsToShow.length === 0) {
        productGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px;">No products match your filters</div>';
      } else {
        productGrid.innerHTML = productsToShow.map(p => `
          <div class="product-card" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">
            <div class="card-image" style="background-image: url('${p.image}')">
              ${p.badge ? '<div class="badge">' + p.badge + '</div>' : ''}
            </div>
            <div class="card-info">
              <div class="card-category">${p.category}</div>
              <div class="card-title">${p.name}</div>
              <div class="card-price">$${p.price}</div>
            </div>
          </div>
        `).join('');
      }

      if (resultsCount) {
        resultsCount.textContent = `Showing ${start + 1}-${Math.min(end, filteredProducts.length)} of ${filteredProducts.length} products`;
      }
      renderPagination();
    }

    function renderPagination() {
      const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
      let html = '';
      
      for (let i = 1; i <= totalPages; i++) {
        html += `<div class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</div>`;
      }
      
      paginationDiv.innerHTML = html;
    }

    function filterProducts() {
      filteredProducts = products.filter(p => {
        if (activeFilters.categories.length > 0 && !activeFilters.categories.includes(p.category)) {
          return false;
        }
        if (p.price < activeFilters.price.min || p.price > activeFilters.price.max) {
          return false;
        }
        return true;
      });
      
      currentPage = 1;
      renderProducts();
      updateActiveFiltersDisplay();
    }

    function updateActiveFiltersDisplay() {
      if (!activeFiltersDiv) return;
      
      let html = '';
      
      activeFilters.categories.forEach(cat => {
        html += `<span class="filter-tag">${cat} <i class="fas fa-times" data-filter="category" data-value="${cat}"></i></span>`;
      });
      
      if (activeFilters.price.min > 0 || activeFilters.price.max < 1000) {
        html += `<span class="filter-tag">$${activeFilters.price.min} - $${activeFilters.price.max} <i class="fas fa-times" data-filter="price"></i></span>`;
      }
      
      activeFiltersDiv.innerHTML = html || '<span style="color: #999;">No active filters</span>';
    }

    function sortProducts(type) {
      switch(type) {
        case 'low-high':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'high-low':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        default:
          filteredProducts.sort((a, b) => a.id - b.id);
      }
      renderProducts();
    }

    // Desktop Filters
    const applyDesktopFilters = document.getElementById('applyDesktopFilters');
    const clearDesktopFilters = document.getElementById('clearDesktopFilters');

    if (applyDesktopFilters) {
      applyDesktopFilters.addEventListener('click', () => {
        const categories = [];
        document.querySelectorAll('#desktopCategoryFilters input:checked').forEach(cb => {
          categories.push(cb.value);
        });
        
        const min = parseInt(document.getElementById('desktopMinPrice')?.value) || 0;
        const max = parseInt(document.getElementById('desktopMaxPrice')?.value) || 1000;
        
        activeFilters = { categories, price: { min, max } };
        filterProducts();
      });
    }

    if (clearDesktopFilters) {
      clearDesktopFilters.addEventListener('click', () => {
        document.querySelectorAll('#desktopCategoryFilters input').forEach(cb => cb.checked = false);
        const desktopMin = document.getElementById('desktopMinPrice');
        const desktopMax = document.getElementById('desktopMaxPrice');
        if (desktopMin) desktopMin.value = '';
        if (desktopMax) desktopMax.value = '';
        
        activeFilters = { categories: [], price: { min: 0, max: 1000 } };
        filterProducts();
      });
    }

    // Mobile Filters
    const applyMobileFilters = document.getElementById('applyMobileFilters');
    const clearMobileFilters = document.getElementById('clearMobileFilters');
    const mobileFilterBtn = document.getElementById('mobileFilterBtn');
    const closeMobileFilter = document.getElementById('closeMobileFilter');
    const mobileFilterDrawer = document.getElementById('mobileFilterDrawer');

    if (applyMobileFilters) {
      applyMobileFilters.addEventListener('click', () => {
        const categories = [];
        document.querySelectorAll('#mobileCategoryFilters input:checked').forEach(cb => {
          categories.push(cb.value);
        });
        
        const min = parseInt(document.getElementById('mobileMinPrice')?.value) || 0;
        const max = parseInt(document.getElementById('mobileMaxPrice')?.value) || 1000;
        
        activeFilters = { categories, price: { min, max } };
        filterProducts();
        if (mobileFilterDrawer) mobileFilterDrawer.classList.remove('open');
      });
    }

    if (clearMobileFilters) {
      clearMobileFilters.addEventListener('click', () => {
        document.querySelectorAll('#mobileCategoryFilters input').forEach(cb => cb.checked = false);
        const mobileMin = document.getElementById('mobileMinPrice');
        const mobileMax = document.getElementById('mobileMaxPrice');
        if (mobileMin) mobileMin.value = '';
        if (mobileMax) mobileMax.value = '';
      });
    }

    if (mobileFilterBtn && mobileFilterDrawer) {
      mobileFilterBtn.addEventListener('click', () => {
        mobileFilterDrawer.classList.add('open');
      });
    }

    if (closeMobileFilter && mobileFilterDrawer) {
      closeMobileFilter.addEventListener('click', () => {
        mobileFilterDrawer.classList.remove('open');
      });
    }

    // Remove filter tag
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('fa-times') && e.target.closest('.filter-tag')) {
        const filter = e.target.dataset.filter;
        const value = e.target.dataset.value;
        
        if (filter === 'category') {
          activeFilters.categories = activeFilters.categories.filter(c => c !== value);
          document.querySelectorAll('#desktopCategoryFilters input, #mobileCategoryFilters input').forEach(cb => {
            if (cb.value === value) cb.checked = false;
          });
        } else if (filter === 'price') {
          activeFilters.price = { min: 0, max: 1000 };
          const desktopMin = document.getElementById('desktopMinPrice');
          const desktopMax = document.getElementById('desktopMaxPrice');
          const mobileMin = document.getElementById('mobileMinPrice');
          const mobileMax = document.getElementById('mobileMaxPrice');
          if (desktopMin) desktopMin.value = '';
          if (desktopMax) desktopMax.value = '';
          if (mobileMin) mobileMin.value = '';
          if (mobileMax) mobileMax.value = '';
        }
        
        filterProducts();
      }
    });

    // Sort
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sortProducts(e.target.value);
      });
    }

    // Pagination
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('page-btn') && e.target.dataset.page) {
        currentPage = parseInt(e.target.dataset.page);
        renderProducts();
      }
    });

    // Initialize shop page
    renderProducts();
  }

  // ---------- WISHLIST PAGE ----------
  if (document.getElementById('wishlistContainer')) {
    let wishlist = JSON.parse(localStorage.getItem('zp_wishlist')) || [];

    // Default wishlist items for demo if empty
    if (wishlist.length === 0) {
      wishlist = [
        { id: 1, name: 'Oversized Hoodie', price: 89, category: 'Hoodie', image: 'photo-1556905055-8f358a7a47b2.jpg' },
        { id: 3, name: 'Graphic Tee', price: 45, category: 'T-shirt', image: 'photo-1523381210434-271e8be1f52b.avif' },
        { id: 5, name: 'Crossbody Bag', price: 59, category: 'Accessories', image: 'accessories.jpg' }
      ];
      localStorage.setItem('zp_wishlist', JSON.stringify(wishlist));
    }

    const wishlistContainer = document.getElementById('wishlistContainer');

    function renderWishlist() {
      if (wishlist.length === 0) {
        wishlistContainer.innerHTML = `
          <div class="empty-wishlist">
            <i class="far fa-heart"></i>
            <h3>Your wishlist is empty</h3>
            <p>Save items you love and they'll appear here</p>
            <button class="shop-now-btn" onclick="navigateTo('shop.html')">Shop Now</button>
          </div>
        `;
        return;
      }

      const totalValue = wishlist.reduce((sum, item) => sum + item.price, 0);

      wishlistContainer.innerHTML = `
        <div class="wishlist-grid">
          ${wishlist.map(item => `
            <div class="wishlist-card" data-id="${item.id}">
              <div class="wishlist-image" style="background-image: url('${item.image}')">
                <div class="wishlist-remove" onclick="removeFromWishlist(${item.id})">
                  <i class="fas fa-times"></i>
                </div>
              </div>
              <div class="wishlist-info">
                <div class="wishlist-category">${item.category}</div>
                <div class="wishlist-title">${item.name}</div>
                <div class="wishlist-price">$${item.price}</div>
                <button class="add-to-cart-btn" onclick="addToCartFromWishlist(${item.id})">
                  Add to Cart
                </button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="wishlist-sidebar">
          <h3>Wishlist Summary</h3>
          <div class="wishlist-stats">
            <div class="stat-item">
              <span>Total Items</span>
              <span><strong>${wishlist.length}</strong></span>
            </div>
            <div class="stat-item">
              <span>Total Value</span>
              <span><strong>$${totalValue}</strong></span>
            </div>
          </div>
          <div class="share-wishlist">
            <p style="margin-bottom: 12px;">Share your wishlist</p>
            <div class="share-buttons">
              <button class="share-btn" onclick="shareWishlist('facebook')">
                <i class="fab fa-facebook-f"></i>
              </button>
              <button class="share-btn" onclick="shareWishlist('twitter')">
                <i class="fab fa-twitter"></i>
              </button>
              <button class="share-btn" onclick="shareWishlist('email')">
                <i class="fas fa-envelope"></i>
              </button>
              <button class="share-btn" onclick="shareWishlist('copy')">
                <i class="fas fa-link"></i>
              </button>
            </div>
          </div>
          <button class="clear-wishlist" onclick="clearWishlist()">
            Clear Wishlist
          </button>
        </div>
      `;
    }

    window.removeFromWishlist = function(productId) {
      wishlist = wishlist.filter(item => item.id != productId);
      localStorage.setItem('zp_wishlist', JSON.stringify(wishlist));
      renderWishlist();
      showNotification('Item removed from wishlist');
    };

    window.clearWishlist = function() {
      if (confirm('Are you sure you want to clear your entire wishlist?')) {
        wishlist = [];
        localStorage.setItem('zp_wishlist', JSON.stringify(wishlist));
        renderWishlist();
        showNotification('Wishlist cleared');
      }
    };

    window.addToCartFromWishlist = function(productId) {
      const product = wishlist.find(item => item.id == productId);
      if (product) {
        addToCart(product);
      }
    };

    window.shareWishlist = function(platform) {
      const message = `Check out my ZERO POINT wishlist! ${window.location.href}`;
      switch(platform) {
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`);
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`);
          break;
        case 'email':
          window.location.href = `mailto:?subject=My ZERO POINT Wishlist&body=${encodeURIComponent(message)}`;
          break;
        case 'copy':
          navigator.clipboard.writeText(window.location.href);
          showNotification('Link copied to clipboard!');
          break;
      }
    };

    renderWishlist();
  }

  // ---------- COLLECTION PAGE ----------
  if (document.getElementById('newArrivalsGrid') && document.querySelector('.filter-tab')) {
    let currentFilter = 'all';

    const filterTabs = document.querySelectorAll('.filter-tab');

    function updateActiveFilter(filter) {
      filterTabs.forEach(tab => {
        const tabFilter = tab.dataset.filter;
        if (tabFilter === filter) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
    }

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        currentFilter = tab.dataset.filter;
        updateActiveFilter(currentFilter);
        
        let filtered = products;
        if (currentFilter !== 'all') {
          filtered = products.filter(p => p.category === currentFilter);
        }

        const grid = document.getElementById('newArrivalsGrid');
        grid.innerHTML = filtered.map(p => `
          <div class="product-card" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-category="${p.category}">
            <div class="card-image" style="background-image: url('${p.image}')">
              <div class="badge">${p.badge}</div>
            </div>
            <div class="card-info">
              <div class="card-category">${p.category}</div>
              <div class="card-title">${p.name}</div>
              <div class="card-price">$${p.price}</div>
            </div>
          </div>
        `).join('');
      });
    });
  }

  // ---------- CONTACT PAGE ----------
  if (document.getElementById('contactForm')) {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName')?.value;
        const email = document.getElementById('email')?.value;
        const subject = document.getElementById('subject')?.value;
        const message = document.getElementById('message')?.value;

        if (!firstName || !email || !subject || !message) {
          alert('Please fill in all required fields');
          return;
        }

        if (successMessage) {
          successMessage.style.display = 'flex';
        }
        contactForm.reset();

        setTimeout(() => {
          if (successMessage) successMessage.style.display = 'none';
        }, 5000);
      });
    }

    // Direction buttons
    document.querySelectorAll('.direction-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        alert('Opening Google Maps (demo)');
      });
    });

    // Social icons
    document.querySelectorAll('.fab').forEach(icon => {
      icon.addEventListener('click', () => {
        alert('Social media link (demo)');
      });
    });
  }

  // Initialize cart on all pages
  updateCart();
})();