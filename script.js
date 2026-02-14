(function() {
    // ----- navigation state -----
    const pages = {
        valentine: document.getElementById('pageValentine'),
        hub: document.getElementById('pageHub'),
        reasons: document.getElementById('pageReasons'),
        surprise: document.getElementById('pageSurprise'),
        letters: document.getElementById('pageLetters'),
        gallery: document.getElementById('pageGallery')
    };

    function showPage(pageId) {
        Object.values(pages).forEach(p => p.classList.remove('active'));
        pages[pageId].classList.add('active');
    }

    // back handlers
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target.closest('[data-back]') || e.target.classList.contains('back-btn')) {
                showPage('hub');
            }
        });
    });
    document.getElementById('backFromHubToQuestion').addEventListener('click', () => showPage('valentine'));

    // ----- valentine yes/no joke -----
    const yesBtn = document.getElementById('yesValentine');
    const noBtn = document.getElementById('noValentine');
    const sadArea = document.getElementById('sadFaceArea');
    let noClickCount = 0;
    noBtn.addEventListener('click', () => {
        noClickCount++;
        if (noClickCount === 1) sadArea.innerText = '🥺 please?';
        else if (noClickCount === 2) sadArea.innerText = '😢💔';
        else if (noClickCount === 3) sadArea.innerText = '😭😭 ok i\'ll wait';
        else if (noClickCount === 4) { sadArea.innerText = '🙈 okay but you\'re missing out'; }
        else {
            sadArea.innerText = '😡 really, mon cœur';
        }
        noBtn.style.transform = `translateX(${Math.random()*20-10}px)`;
    });
    yesBtn.addEventListener('click', () => {
        showPage('hub');
        noClickCount = 0;
        sadArea.innerText = '';
        noBtn.style.transform = 'none';
    });

    // ----- hub cards open respective page
    document.querySelectorAll('.hub-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const page = card.dataset.page;
            if (page) showPage(page);
        });
    });

    // ----- 14 reasons -----
    const reasonsList = [
        "the way you smile at me",
        "the way you talk to me",
        "you still laugh at my jokes",
        "the way you are constantly trying to learn new things",
        "your eyes when you talk about dreams",
        "the way you call me babe",
        "you are really intellectual",
        "you make everyday days feel like valentine",
        "the way you hold my hand",
        "you always pray for me",
        "your strength when things are hard",
        "the cute faces you make ",
        "you chose me back",
        "you are you, and that's everything I love"
    ];

    let revealedIdx = 0;
    const reasonsGrid = document.getElementById('reasonsGrid');
    const counterSpan = document.getElementById('reasonCounter');
    const revealBtn = document.getElementById('revealOneMore');
    const revealAllBtn = document.getElementById('revealAllBtn');

    function renderReasons() {
        reasonsGrid.innerHTML = '';
        for (let i = 0; i < revealedIdx; i++) {
            const div = document.createElement('div');
            div.className = 'reason-card';
            div.innerText = reasonsList[i];
            reasonsGrid.appendChild(div);
        }
        counterSpan.innerText = `${revealedIdx} / 14 revealed`;
        if (revealedIdx >= 7) revealAllBtn.classList.remove('hidden');
        if (revealedIdx >= 14) revealBtn.disabled = true;
    }
    revealBtn.addEventListener('click', () => {
        if (revealedIdx < 14) {
            revealedIdx++;
            renderReasons();
        }
        if (revealedIdx === 14) {
            revealBtn.innerText = 'all revealed 💕';
            revealBtn.style.opacity = '0.6';
        }
    });
    revealAllBtn.addEventListener('click', () => {
        revealedIdx = 14;
        renderReasons();
        revealBtn.innerText = 'all revealed 💕';
    });
    revealedIdx = 1;
    renderReasons();

    // ----- surprise game (with message overlay) -----
    const questions = [
        { question: "where did we first connect?", options: ["your house", "that party", "online", "my shop"], correct: 3, memory: "you were showing your 32... lol. First time I ever saw an angel✨" },
        { question: "what couldn't you finish on our first date?", options: ["the cake", "the parfait", "the doughnuts", "me"], correct: 1, memory: "Like how can you get filled from drinking chilled yoghurt... 😂" },
        { question: "How much do you think I love you?", options: ["you don't love me", "About 50%", "maybe 80%", "so much"], correct: 3, memory: "You know how they say some moments feel like a lifetime? Every second with you does that. My love for you is measured in eternities that only last an instant. I LOVE YOU MON CŒUR❤" },
        { question: "When is our anniversary?(I think I got it but it is you tun to guss)", options: ["june 05 2021", "May 04 2021", "july 25 2021", "september 22 2021"], correct: 2, memory: "I think it was the sunday evening I phoned you and then asked you out" }
    ];
    let qIndex = 0;
    const startDiv = document.getElementById('gameStart');
    const playDiv = document.getElementById('gamePlay');
    const endDiv = document.getElementById('gameEnd');
    const questionBox = document.getElementById('questionBox');
    const optionsBox = document.getElementById('optionsBox');
    const progress = document.getElementById('gameProgress');

    // overlay elements
    const overlay = document.getElementById('messageOverlay');
    const msgEmoji = document.getElementById('messageEmoji');
    const msgContent = document.getElementById('messageContent');
    const msgHint = document.getElementById('messageHint');
    const closeMsgBtn = document.getElementById('closeMessageBtn');

    let pendingNextQuestion = false;
    function showMessageOverlay(text, isCorrect, opts = {}) {
        msgEmoji.innerText = opts.emoji ?? (isCorrect ? '✨' : '💭');
        // render HTML content (so <p> tags show correctly)
        msgContent.innerHTML = text;
        msgHint.innerText = (typeof opts.hint !== 'undefined') ? opts.hint : (isCorrect ? '· correct ·' : '');
        pendingNextQuestion = !!opts.nextOnClose;
        overlay.classList.add('active');
    }

    function closeOverlay() {
        overlay.classList.remove('active');
        if (pendingNextQuestion) {
            pendingNextQuestion = false;
            qIndex++;
            showQuestion();
        }
    }
    closeMsgBtn.addEventListener('click', closeOverlay);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeOverlay();
    });

    document.getElementById('startGameBtn').addEventListener('click', () => {
        startDiv.classList.add('hidden');
        playDiv.classList.remove('hidden');
        qIndex = 0;
        showQuestion();
    });

    function showQuestion() {
        if (qIndex >= questions.length) {
            playDiv.classList.add('hidden');
            endDiv.classList.remove('hidden');
            return;
        }
        const q = questions[qIndex];
        questionBox.innerText = q.question;
        let optsHtml = '';
        q.options.forEach((opt, i) => {
            optsHtml += `<button class="option-btn" data-opt-index="${i}">${opt}</button>`;
        });
        optionsBox.innerHTML = optsHtml;
        progress.innerText = `question ${qIndex+1} of ${questions.length}`;
        
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selected = parseInt(e.target.dataset.optIndex);
                const currentQ = questions[qIndex];
                
                document.querySelectorAll('.option-btn').forEach(b => {
                    b.classList.remove('correct-guess', 'wrong-guess');
                });
                
                if (selected === currentQ.correct) {
                    e.target.classList.add('correct-guess');
                    // show memory; advance to next question when user closes the popup
                    showMessageOverlay(currentQ.memory, true, { nextOnClose: true });
                } else {
                    e.target.classList.add('wrong-guess');
                    showMessageOverlay('try again', false);
                }
            });
        });
    }

    // ----- OPEN WHEN LETTERS (centered image, text top) -----
    const lettersData = [
        { type: 'miss', label: 'you miss me', content: `
            <p>My love,</p>
            <p>If you are reading this, it means you feel that little ache in your chest that whispers my name.</p>
            <p>Close your eyes for a second.<br>
            Imagine my arms around you.<br>
            Imagine the forehead kiss you always love.<br>
            Imagine me saying softly, "Im right here, mon c5ur."<br>
            Distance doesnt change what we are. Silence doesnt weaken us.<br>
            If you miss me, it only means what we share is real. And I miss you too... 493</p>
        `},
        { type: 'sad', label: 'bad day', content: `
            <p>Hey love,</p>
            <p>First of all, breathe. Bad days visit and then they leave, they don't define you.</p>
            <p>You are not your mistakes. You are the strongest, kindest soul I know. If today feels heavy, let me carry part of it.</p>
        `},
        { type: 'proud', label: 'need pride reminder', content: `
            <p>Sometimes you forget how powerful you are.</p>
            <p>I see your light, your effort, and the growth. I am so proud of the person you are becoming, never shrink your glow.</p>
        `},
        { type: 'insecure', label: 'need reassurance', content: `
            <p>Mon c3ur,</p>
            <p>If you ever doubt my love, let me be louder: I am here, fully and completely. You don't have to prove anything, you already have me.</p>
            <p>I love you.</p>
        `},
        { type: 'grateful', label: 'grateful for us', content: `
            <p>My heart,</p>
            <p>If you're reading this thinking about us, know that I am grateful for your laugh, your patience, your love.</p>
            <p>Thank you for choosing me. I love you.</p>
        `}
    ];
    const board = document.getElementById('lettersBoard');
    const letterDisplay = document.getElementById('letterDisplay');
    const letterText = document.getElementById('letterText');
    function renderLetters() {
        board.innerHTML = '';
        lettersData.forEach((l, idx) => {
            const env = document.createElement('div');
            env.className = 'letter-envelope';
            // using emoji as centered image, label at top, status below
            env.innerHTML = `
                <span class="envelope-icon">💌</span>
                <span class="letter-label">${l.label}</span>
                <span class="letter-status">unopened</span>
            `;
            env.addEventListener('click', () => {
                // open as centered popup (reuse message overlay)
                showMessageOverlay(l.content, null, { emoji: '💌', hint: '' });
                env.querySelector('.letter-status').innerText = 'opened ❤️';
                env.classList.add('opened');
            });
            board.appendChild(env);
        });
    }
    renderLetters();
    document.getElementById('closeLetterBtn').addEventListener('click', () => {
        letterDisplay.classList.add('hidden');
    });

    // ----- GALLERY with centered images & caption on top -----
    const galleryGrid = document.getElementById('galleryGrid');
    // images available in the images/ folder (selected from workspace)
    const galleryImages = [
        'ohima (1).jpeg', 'ohima (1).jpg', 'ohima (2).jpeg', 'ohima (2).jpg',
        'ohima (3).jpg', 'ohima (4).jpg', 'ohima (5).jpg', 'ohima (6).jpg',
        'ohima (7).jpg', 'ohima (8).jpg', 'ohima (9).jpg', 'ohima.png'
    ];

    // friendly captions map for images
    const galleryCaptions = {
        'ohima (1).jpeg': 'You look like a queen',
        'ohima (1).jpg': 'See teeth',
        'ohima (2).jpeg': 'Picture 3',
        'ohima (2).jpg': 'Stupendous in my opinion',
        'ohima (3).jpg': 'Hot kidd',
        'ohima (4).jpg': 'lol',
        'ohima (5).jpg': '2022 I guess',
        'ohima (6).jpg': 'Corper weee',
        'ohima (7).jpg': 'My love',
        'ohima (8).jpg': 'I love you',
        'ohima (9).jpg': 'Remember this one',
        'ohima.png': 'Says it all'
    };

    // pick N random unique images
    function pickRandom(arr, n) {
        const copy = arr.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy.slice(0, n);
    }

    const picked = pickRandom(galleryImages, 4);
    const galleryItems = picked.map((file) => ({
        caption: galleryCaptions[file] || file.replace(/\.[^.]+$/, '').replace(/\(|\)/g, ''),
        src: `images/${file}`
    }));

    galleryItems.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        // Caption first (order: -1 in css), image centered
        div.innerHTML = `
            <div class="photo-caption">${item.caption}</div>
            <img src="${item.src}" alt="memory">
        `;
        div.addEventListener('click', () => expandImage(item.src, item.caption));
        galleryGrid.appendChild(div);
    });

    window.expandImage = function(src, caption) {
        document.getElementById('expandedImg').src = src;
        document.getElementById('caption').innerText = caption;
        document.getElementById('lightbox').classList.remove('hidden');
    };
    window.closeLightbox = function() {
        document.getElementById('lightbox').classList.add('hidden');
    };

    // floating hearts
    function addFloater() {
        const heart = document.createElement('div');
        heart.innerText = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.bottom = '-20px';
        heart.style.fontSize = '1.7rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        heart.style.animation = 'float-up 4s linear forwards';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 4000);
    }
    setInterval(addFloater, 800);

    const style = document.createElement('style');
    style.innerHTML = `@keyframes float-up { to { transform: translateY(-100vh); opacity:0; }}`;
    document.head.appendChild(style);
})();
