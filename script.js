// 全局变量
let currentGalleryFilter = 'all';
let galleryImages = [];

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeLearningTabs();
    initializeGallery();
    initializeScrollAnimations();
    initializeImageUpload();
});

// 导航功能
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 汉堡菜单切换
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // 点击导航链接后关闭移动菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 平滑滚动到对应区块
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // 考虑导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 滚动时高亮当前导航项
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });
}

// 学习中心标签切换功能
function initializeLearningTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const categoryContents = document.querySelectorAll('.category-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // 移除所有活动状态
            tabBtns.forEach(b => b.classList.remove('active'));
            categoryContents.forEach(content => content.classList.remove('active'));

            // 添加活动状态
            this.classList.add('active');
            document.getElementById(category).classList.add('active');
        });
    });
}

// 图片库功能
function initializeGallery() {
    // 初始化示例图片数据
    galleryImages = [
        { src: 'images/gallery/performance1.jpg', category: 'performance', title: '琼剧演出精彩瞬间' },
        { src: 'images/gallery/performance2.jpg', category: 'performance', title: '经典剧目表演' },
        { src: 'images/gallery/costume1.jpg', category: 'costume', title: '精美戏服展示' },
        { src: 'images/gallery/costume2.jpg', category: 'costume', title: '传统服饰细节' },
        { src: 'images/gallery/backstage1.jpg', category: 'backstage', title: '幕后准备工作' },
        { src: 'images/gallery/backstage2.jpg', category: 'backstage', title: '演员化妆过程' },
        { src: 'images/gallery/culture1.jpg', category: 'culture', title: '海南文化元素' },
        { src: 'images/gallery/culture2.jpg', category: 'culture', title: '传统工艺展示' }
    ];

    // 过滤按钮事件
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // 更新活动按钮
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 过滤图片
            filterGalleryImages(filter);
            currentGalleryFilter = filter;
        });
    });

    // 初始加载所有图片
    renderGalleryImages(galleryImages);
}

// 过滤图片库图片
function filterGalleryImages(filter) {
    let filteredImages = galleryImages;
    
    if (filter !== 'all') {
        filteredImages = galleryImages.filter(img => img.category === filter);
    }
    
    renderGalleryImages(filteredImages);
}

// 渲染图片库图片
function renderGalleryImages(images) {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;

    galleryGrid.innerHTML = '';

    images.forEach((image, index) => {
        const galleryItem = createGalleryItem(image, index);
        galleryGrid.appendChild(galleryItem);
    });
}

// 创建图片库项目
function createGalleryItem(image, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('data-category', image.category);

    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.title;
    img.onerror = function() {
        this.style.display = 'none';
        // 如果图片加载失败，显示占位符
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width: 100%;
            height: 250px;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            font-size: 0.9rem;
        `;
        placeholder.textContent = '图片加载中...';
        this.parentNode.replaceChild(placeholder, this);
    };

    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';
    const title = document.createElement('span');
    title.textContent = image.title;
    overlay.appendChild(title);

    item.appendChild(img);
    item.appendChild(overlay);

    // 点击图片放大查看
    item.addEventListener('click', function() {
        showImageModal(image);
    });

    return item;
}

// 图片模态框
function showImageModal(image) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        position: relative;
    `;

    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.title;
    img.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    `;

    const title = document.createElement('div');
    title.textContent = image.title;
    title.style.cssText = `
        color: white;
        text-align: center;
        margin-top: 20px;
        font-size: 1.2rem;
    `;

    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.5);
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
    `;

    modalContent.appendChild(img);
    modalContent.appendChild(title);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    // 关闭模态框
    const closeModal = function() {
        document.body.removeChild(modal);
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });

    // ESC键关闭
    const handleKeyPress = function(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleKeyPress);
        }
    };
    document.addEventListener('keydown', handleKeyPress);
}

// 图片上传功能
function initializeImageUpload() {
    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    uploadImage(file);
                }
            });
        });
    }
}

// 上传图片
function uploadImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const newImage = {
            src: e.target.result,
            category: 'culture', // 默认分类
            title: file.name.replace(/\.[^/.]+$/, ""), // 移除文件扩展名
            isNew: true
        };

        // 添加到图片库
        galleryImages.push(newImage);
        
        // 如果当前显示的是该分类或全部，则重新渲染
        if (currentGalleryFilter === 'all' || currentGalleryFilter === 'culture') {
            filterGalleryImages(currentGalleryFilter);
        }

        // 显示成功消息
        showNotification('图片上传成功！', 'success');
    };
    reader.readAsDataURL(file);
}

// 上传图片按钮点击事件
function uploadImages() {
    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
        fileInput.click();
    }
}

// 滚动动画
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

        // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.news-card, .activity-card, .product-card, .video-card, .character-card, .gallery-item');
    animatedElements.forEach(el => observer.observe(el));
}

// 通知系统
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

        // 动画显示
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

        // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 搜索功能（可选）
function initializeSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
        searchInput.placeholder = '搜索内容...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        padding: 10px 15px;
        border: 2px solid #e9ecef;
        border-radius: 25px;
        width: 300px;
        max-width: 100%;
        margin: 20px auto;
        display: block;
        font-size: 1rem;
    `;

    // 可以将搜索框添加到导航栏或其他位置
    // document.querySelector('.nav-container').appendChild(searchInput);
}

// 图片预加载
function preloadImages() {
    const imageUrls = [
        'images/hero-bg.jpg',
        'images/news1.jpg',
        'images/news2.jpg',
        'images/news3.jpg'
    ];

    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// 性能优化：懒加载图片
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// 响应式图片处理
function handleResponsiveImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
    });
}

// 初始化所有功能
window.addEventListener('load', function() {
    preloadImages();
    handleResponsiveImages();
    initializeLazyLoading();
});

// 导出功能供外部使用
window.QiongJuWebsite = {
    uploadImages,
    showNotification,
    filterGalleryImages
};
