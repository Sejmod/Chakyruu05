document.addEventListener('DOMContentLoaded', () => {
    // Символы для хакерской расшифровки
    const chars = 'АБВГДЕЁЖЗИЙКЛМНОӨПРСТУҮФХЦЧШЩЪЫЬЭЮЯ1234567890!@#$%&*';
    const cryptElements = document.querySelectorAll('.crypt-text');
    let wordsData = [];
    
    let isLevitating = false;
    let isAssembling = false;
    let time = 0;

    // 1. ПОДГОТОВКА ТЕКСТА
    cryptElements.forEach(el => {
        const originalText = el.getAttribute('data-text');
        if (!originalText) return;

        const words = originalText.split(' ');
        el.innerHTML = ''; 

        words.forEach(word => {
            const span = document.createElement('span');
            span.className = 'word-wrap';
            span.setAttribute('data-word', word);
            
            span.innerText = scrambleWord(word);
            el.appendChild(span);
            el.appendChild(document.createTextNode(' '));

            // Корректный расчёт разлёта в зависимости от размера экрана (мобильный / ПК)
            const isMobile = window.innerWidth < 600;
            const spreadX = isMobile ? window.innerWidth * 0.4 : Math.min(window.innerWidth * 0.5, 500);
            const spreadY = isMobile ? window.innerHeight * 0.35 : Math.min(window.innerHeight * 0.4, 400);

            wordsData.push({
                element: span,
                originalText: word,
                x: (Math.random() - 0.5) * spreadX,
                y: (Math.random() - 0.5) * spreadY,
                z: (Math.random() - 0.5) * (isMobile ? 200 : 400),
                rotX: (Math.random() - 0.5) * 360,
                rotY: (Math.random() - 0.5) * 360,
                rotZ: (Math.random() - 0.5) * 360,
                phaseX: Math.random() * Math.PI * 2,
                phaseY: Math.random() * Math.PI * 2,
                phaseZ: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.02 + 0.01,
                opacity: 0,
                blur: isMobile ? 5 : 8
            });
        });
    });

    function scrambleWord(word) {
        return word.split('').map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    }

    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // 2. ФИЗИКА И АНИМАЦИЯ (60 FPS)
    function renderPhysics() {
        if (!isLevitating) return;
        time += 1;
        let allSettled = true;

        wordsData.forEach(item => {
            if (isAssembling) {
                // Плавная сборка текста на свои места
                item.x = lerp(item.x, 0, 0.03);
                item.y = lerp(item.y, 0, 0.03);
                item.z = lerp(item.z, 0, 0.03);
                item.rotX = lerp(item.rotX, 0, 0.04);
                item.rotY = lerp(item.rotY, 0, 0.04);
                item.rotZ = lerp(item.rotZ, 0, 0.04);
                item.blur = lerp(item.blur, 0, 0.06);
                
                if (Math.abs(item.x) > 0.8 || Math.abs(item.y) > 0.8) {
                    allSettled = false;
                }
            } else {
                // Фаза левитации
                item.x += Math.sin(time * item.speed + item.phaseX) * 1.5;
                item.y += Math.cos(time * item.speed + item.phaseY) * 1.5;
                item.z += Math.sin(time * item.speed + item.phaseZ) * 1.5;
                item.rotX += Math.sin(time * item.speed) * 0.4;
                item.rotY += Math.cos(time * item.speed) * 0.4;
                
                item.opacity = lerp(item.opacity, 1, 0.03);
                item.blur = lerp(item.blur, 2, 0.03);
                allSettled = false;
            }

            item.element.style.transform = `translate3d(${item.x}px, ${item.y}px, ${item.z}px) rotateX(${item.rotX}deg) rotateY(${item.rotY}deg) rotateZ(${item.rotZ}deg)`;
            item.element.style.opacity = item.opacity;
            item.element.style.filter = `blur(${item.blur}px)`;
        });

        if (isAssembling && allSettled) {
            isLevitating = false;
            triggerConfetti();
        } else {
            requestAnimationFrame(renderPhysics);
        }
    }

    // 3. ЭФФЕКТ ДЕШИФРОВКИ
    function startDecryption() {
        wordsData.forEach((item, index) => {
            setTimeout(() => {
                let iterations = 0;
                let interval = setInterval(() => {
                    item.element.innerText = item.originalText.split('').map((letter, i) => {
                        if (i < iterations) return item.originalText[i];
                        return chars[Math.floor(Math.random() * chars.length)];
                    }).join('');
                    
                    if (iterations >= item.originalText.length) {
                        clearInterval(interval);
                        item.element.style.fontFamily = 'inherit';
                        
                        // Сохраняем индивидуальные цвета элементов
                        const parent = item.element.parentElement;
                        if (parent.classList.contains('highlight') || parent.classList.contains('detail-val')) {
                            item.element.style.color = 'var(--highlight)';
                            item.element.style.fontWeight = 'bold';
                        }
                    }
                    iterations += 1/2; 
                }, 25);
            }, index * 60); 
        });
    }

    // 4. ЗАПУСК
    document.getElementById('start-btn').addEventListener('click', () => {
        const loader = document.getElementById('loader');
        const card = document.getElementById('card');
        
        loader.style.opacity = '0';
        
        setTimeout(() => {
            loader.style.display = 'none';
            card.style.opacity = '1';
            card.style.pointerEvents = 'auto';
            card.classList.add('active'); 
            
            isLevitating = true;
            renderPhysics();

            // Через 2.8 сек начинаем сборку и дешифровку
            setTimeout(() => {
                isAssembling = true;
                startDecryption();
            }, 2800);

        }, 800);
    });

    // 5. АНИМАЦИЯ ЧАСТИЦ НА ФОНЕ
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(26, 37, 47, 0.35)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < (window.innerWidth < 600 ? 35 : 70); i++) {
        particlesArray.push(new Particle());
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Праздничный салют из конфетти
    function triggerConfetti() {
        if(typeof confetti === 'undefined') return;
        var duration = 3 * 1000;
        var end = Date.now() + duration;
        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#c0392b', '#1a252f', '#d35400']
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#c0392b', '#1a252f', '#d35400']
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    }
});