const initSparkles = () => {
    const canvas = document.getElementById('sparkles');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const colors = ['#ffffff', '#fffc00', '#ff9eb5', '#a0e9ff'];

    class Sparkle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 8 + 2;
            this.speedY = Math.random() * -0.5 - 0.2; // Float up
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random();
            this.fadeSpeed = Math.random() * 0.02 + 0.005;
            this.type = Math.random() > 0.5 ? 'cross' : 'circle';
            this.rotation = Math.random() * 360;
        }

        update() {
            this.y += this.speedY;
            this.alpha -= this.fadeSpeed;
            this.rotation += 2;

            if (this.alpha <= 0) {
                this.y = canvas.height + 10;
                this.x = Math.random() * canvas.width;
                this.alpha = 1;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.translate(this.x, this.y);

            if (this.type === 'cross') {
                ctx.rotate(this.rotation * Math.PI / 180);
                const w = this.size / 2;
                const h = this.size * 2;
                ctx.beginPath();
                ctx.rect(-w / 2, -h / 2, w, h);
                ctx.rect(-h / 2, -w / 2, h, w);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    }

    function init() {
        for (let i = 0; i < 50; i++) {
            particles.push(new Sparkle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    init();
    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
};


document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor-ring');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

document.addEventListener('mousedown', () => {
    const cursor = document.querySelector('.cursor-ring');
    if (cursor) cursor.classList.add('active');
});

document.addEventListener('mouseup', () => {
    const cursor = document.querySelector('.cursor-ring');
    if (cursor) cursor.classList.remove('active');
});

document.addEventListener('click', (e) => {
 
    for (let i = 0; i < 5; i++) {
        const heart = document.createElement('i');
        heart.classList.add('fa-solid', 'fa-heart', 'heart-burst');
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';
        heart.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
        heart.style.animationDuration = Math.random() * 0.5 + 0.5 + 's';

      
        const xDir = Math.random() * 100 - 50;
        gsap.to(heart, { x: xDir, opacity: 0, duration: 1, ease: "power1.out", onComplete: () => heart.remove() });

        document.body.appendChild(heart);
    }
});



/* ============================
   Story Data
============================= */
const story = [
    { name: "Me", text: "Hi Nabila! <i class='fa-solid fa-face-smile'></i>" },
    { name: "Me", text: "Welcome to your special little corner of the internet." },
    { name: "Me", text: "I wanted to make something sweet just for you." },
    { name: "Me", text: "Look at this memory..." },
    { name: "Me", text: "Even the clouds stop to admire your smile.", cg: "photos/1.jpg" },
    { name: "Me", text: "And this one..." },
    { name: "Me", text: "Simply magical.", cg: "photos/2.jpg" },
    { name: "Me", text: "You make my world so much brighter." },
    { name: "Me", text: "Like a pastel dream come true.", cg: "photos/3.jpg" },
    { name: "Me", text: "I love you so much!" },
    { name: "Me", text: "Happy Birthday, my angel! <i class='fa-solid fa-heart' style='color:#ff9eb5'></i>" },
    { name: "System", text: "The End. Read again?" }
];



document.addEventListener('DOMContentLoaded', () => {
    initSparkles();
    gsap.registerPlugin(TextPlugin);
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-btn');
    const uiLayer = document.getElementById('ui-layer');
    const cgLayer = document.getElementById('cg-layer');
    const cgImage = document.getElementById('cg-image');

    const nameTag = document.getElementById('name-tag');
    const textContent = document.getElementById('text-content');
    const dialogueContainer = document.querySelector('.dialogue-container');

    let currentLine = 0;
    let isTyping = false;



    startBtn.addEventListener('click', () => {
        gsap.to(startScreen, {
            opacity: 0, scale: 1.2, duration: 0.8, onComplete: () => {
                startScreen.style.display = 'none';
                uiLayer.classList.remove('hidden');
            
                gsap.from(dialogueContainer, { y: 100, opacity: 0, duration: 1, ease: "elastic.out(1, 0.75)" });
                playScene();
            }
        });
    });

   


    dialogueContainer.addEventListener('click', () => {
        if (isTyping) {
          
            gsap.killTweensOf(textContent);
            textContent.innerHTML = story[currentLine].text;
            isTyping = false;
            return;
        }

        currentLine++;
        if (currentLine < story.length) {
            playScene();
        } else {
         
            currentLine = 0;
            playScene();
        }
    });

    function playScene() {
        const data = story[currentLine];

        nameTag.innerText = data.name;
        if (data.name === "System") {
            nameTag.style.background = "#ddd";
            nameTag.style.color = "#888";
        } else {
            nameTag.style.background = "#ff9eb5"; // Pink
            nameTag.style.color = "#fff";
        }

      
        if (data.cg) {
            cgLayer.classList.remove('hidden');
            cgImage.src = data.cg;
            // Polaroid Drop Animation
            gsap.fromTo('.cg-frame',
                { rotation: -10, y: -50, opacity: 0 },
                { rotation: Math.random() * 6 - 3, y: 0, opacity: 1, duration: 1, ease: "elastic.out(1, 0.8)" }
            );
        } else {
    
        }


        
        isTyping = true;
        textContent.innerHTML = "";
        gsap.to(textContent, {
            duration: data.text.length * 0.05,
            text: data.text,
            ease: "none",
            onComplete: () => {
                isTyping = false;
            }
        });
    }

});
