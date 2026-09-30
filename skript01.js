document.addEventListener('DOMContentLoaded', () => {
    const chars = 'АБВГДЕЁЖЗИЙКЛМНОӨПРСТУҮФХЦЧШЩЪЫЬЭЮЯ1234567890!@#$';
    const cryptElements = document.querySelectorAll('.crypt-text');
    let wordsData = [];
    
    // Состояния физического движка
    let isLevitating = false;
    let isAssembling = false;
    let time = 0; // Внутреннее время для синусоид

    // 1. ПОДГОТОВКА ТЕКСТА
    // Разбиваем строки на слова, оборачиваем в span для независимой физики
    cryptElements.forEach(el => {
        const originalText = el.getAttribute('data-text');
        const words = originalText.split(' ');
        el.innerHTML = ''; // Очищаем контейнер

        words.forEach(word => {
            const span = document.createElement('span');
            span.className = 'word-wrap';
            span.setAttribute('data-word', word);
            
            // Заполняем слово кракозябрами изначально
            span.innerText = scrambleWord(word);
            el.appendChild(span);

            // Добавляем пробел после слова
            el.appendChild(document.createTextNode(' '));

            // Генерируем случайные параметры левитации для каждого слова
            wordsData.push({
                element: span,
                originalText: word,
                // Начальные случайные координаты (разлет)
                x: (Math.random() - 0.5) * 1500,
                y: (Math.random() - 0.5) * 1500,
                z: (Math.random() - 0.5) * 1000,
                rotX: (Math.random() - 0.5) * 360,
                rotY: (Math.random() - 0.5) * 360,
                rotZ: (Math.random() - 0.5) * 360,
                // Скорость и фаза левитации (для синусоиды)
                phaseX: Math.random() * Math.PI * 2,
                phaseY: Math.random() * Math.PI * 2,
                phaseZ: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.02 + 0.01,
                // Состояние расшифровки
                isDecrypted: false,
                opacity: 0,
                blur: 20
            });
        });
    });

    function scrambleWord(word) {
        return word.split('').map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    }

    // ЛИНЕЙНАЯ ИНТЕРПОЛЯЦИЯ (Математика притяжения)
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // 2. ФИЗИЧЕСКИЙ ДВИЖОК (Вызывается 60 раз в секунду)
    function renderPhysics() {
        if (!isLevitating) return;
        time += 1;

        let allSettled = true;

        wordsData.forEach(item => {
            if (isAssembling) {
                // Если пошла сборка, плавно притягиваем значения к нулю (Lerp)
                // Коэффициент 0.02 дает очень плавное и медленное притяжение
                item.x = lerp(item.x, 0, 0.02);
                item.y = lerp(item.y, 0, 0.02);
                item.z = lerp(item.z, 0, 0.02);
                item.rotX = lerp(item.rotX, 0, 0.03);
                item.rotY = lerp(item.rotY, 0, 0.03);
                item.rotZ = lerp(item.rotZ, 0, 0.03);
                item.blur = lerp(item.blur, 0, 0.05);
                
                // Проверяем, достигло ли слово места
                if (Math.abs(item.x) > 1 || Math.abs(item.y) > 1) {
                    allSettled = false;
                }
            } else {
                // Фаза свободной левитации (Zero-G)
                // Добавляем синусоиду к координатам
                item.x += Math.sin(time * item.speed + item.phaseX) * 2;
                item.y += Math.cos(time * item.speed + item.phaseY) * 2;
                item.z += Math.sin(time * item.speed + item.phaseZ) * 2;
                item.rotX += Math.sin(time * item.speed) * 0.5;
                item.rotY += Math.cos(time * item.speed) * 0.5;
                
                item.opacity = lerp(item.opacity, 1, 0.01);
                item.blur = lerp(item.blur, 5, 0.01);
                allSettled = false;
            }

            // Применяем вычисленные координаты к стилям элемента
            item.element.style.transform = `translate3d(${item.x}px, ${item.y}px, ${item.z}px) rotateX(${item.rotX}deg) rotateY(${item.rotY}deg) rotateZ(${item.rotZ}deg)`;
            item.element.style.opacity = item.opacity;
            item.element.style.filter = `blur(${item.blur}px)`;
        });

        // Если сборка завершена, останавливаем цикл
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
            // Задержка расшифровки для каждого слова создает каскадный эффект
            setTimeout(() => {
                let iterations = 0;
                let interval = setInterval(() => {
                    item.element.innerText = item.originalText.split('').map((letter, i) => {
                        if (i < iterations) return item.originalText[i];
                        return chars[Math.floor(Math.random() * chars.length)];
                    }).join('');
                    
                    if (iterations >= item.originalText.length) {
                        clearInterval(interval);
                        item.element.style.color = (item.element.parentElement.tagName === 'H1') ? 'var(--gold)' : '';
                    }
                    iterations += 1/3; // Медленная расшифровка
                }, 30);
            }, index * 80); // 80мс между расшифровкой соседних слов
        });
    }

    // 4. ЗАПУСК ШОУ
    document.getElementById('start-btn').addEventListener('click', () => {
        const loader = document.getElementById('loader');
        const card = document.getElementById('card');
        
        loader.style.opacity = '0';
        
        setTimeout(() => {
            loader.style.display = 'none';
            card.style.opacity = '1';
            card.style.pointerEvents = 'auto';
            
            // Начинаем левитацию
            isLevitating = true;
            renderPhysics();

            // Через 4 секунды левитации включаем "гравитацию" и дешифровку
            setTimeout(() => {
                isAssembling = true;
                startDecryption();
            }, 4000);

        }, 1000);
    });

    // 5. КРАСИВЫЙ ФОН ИЗ ЧАСТИЦ (Канвас)
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(212, 175, 55, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < 100; i++) particlesArray.push(new Particle());
    
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

    function triggerConfetti() {
        var duration = 4 * 1000;
        var end = Date.now() + duration;
        (function frame() {
            confetti({
                particleCount: 4,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#D4AF37', '#ffffff']
            });
            confetti({
                particleCount: 4,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#D4AF37', '#ffffff']
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    }
});