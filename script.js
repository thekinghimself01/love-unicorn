(function() {
    // ----- navigation state -----
    const pages = {
        valentine: document.getElementById('pageValentine'),
        hub: document.getElementById('pageHub'),
        reasons: document.getElementById('pageReasons'),
        surprise: document.getElementById('pageSurprise'),
        letters: document.getElementById('pageLetters'),
        gallery: document.getElementById('pageGallery'),
        vault: document.getElementById('pageVault'),
        add: document.getElementById('pageAdd')
    };

    function showPage(pageId) {
        Object.values(pages).forEach(p => p.classList.remove('active'));
        pages[pageId].classList.add('active');
        if (pageId === 'vault') renderVault();
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
                    showMessageOverlay(currentQ.memory, true, { nextOnClose: true });
                } else {
                    e.target.classList.add('wrong-guess');
                    showMessageOverlay('try again', false);
                }
            });
        });
    }

    // ----- OPEN WHEN LETTERS -----
    const lettersData = [
        { type: 'miss', label: 'you miss me', content: `
            <p>My love,</p>
            <p>If you are reading this, it means you feel that little ache in your chest that whispers my name.</p>
            <p>Close your eyes for a second.<br>
            Imagine my arms around you.<br>
            Imagine the forehead kiss you always love.<br>
            Imagine me saying softly, "I'm right here, mon cœur."<br>
            Distance doesn't change what we are. Silence doesn't weaken us.<br>
            If you miss me, it only means what we share is real. And I miss you too... always.</p>
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
            <p>Mon cœur,</p>
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
    function renderLetters() {
        board.innerHTML = '';
        lettersData.forEach((l, idx) => {
            const env = document.createElement('div');
            env.className = 'letter-envelope';
            env.innerHTML = `
                <span class="envelope-icon">💌</span>
                <span class="letter-label">${l.label}</span>
                <span class="letter-status">unopened</span>
            `;
            env.addEventListener('click', () => {
                showMessageOverlay(l.content, null, { emoji: '💌', hint: '' });
                env.querySelector('.letter-status').innerText = 'opened ❤️';
                env.classList.add('opened');
            });
            board.appendChild(env);
        });
    }
    renderLetters();
    document.getElementById('closeLetterBtn').addEventListener('click', () => {
        document.getElementById('letterDisplay').classList.add('hidden');
    });

    // ----- GALLERY -----
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryImages = [
        'ohima (1).jpeg', 'ohima (1).jpg', 'ohima (2).jpeg', 'ohima (2).jpg',
        'ohima (3).jpg', 'ohima (4).jpg', 'ohima (5).jpg', 'ohima (6).jpg',
        'ohima (7).jpg', 'ohima (8).jpg', 'ohima (9).jpg', 'ohima.png'
    ];
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

    // ----- MEMORY VAULT with image support -----
    function getMemories() {
        return JSON.parse(localStorage.getItem('memories') || '[]');
    }

    function renderVault() {
        const vaultContent = document.getElementById('vaultContent');
        const mems = getMemories();
        if (!mems.length) {
            vaultContent.innerHTML = '<div style="text-align:center; padding:60px 20px; color:#b85763;">✨ no memories yet.<br>add your first one together.</div>';
            return;
        }
        let html = '<div style="display:flex; flex-direction:column; gap:16px;">';
        mems.forEach((m, idx) => {
            const dateStr = m.date ? new Date(m.date+'T12:00').toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}) : 'a special day';
            html += `
                <div style="background:white; border-radius:30px; padding:18px 20px; border:2px solid #ffe2e2; box-shadow:0 4px 12px rgba(170,80,90,0.1);">
                    <div style="font-size:0.8rem; color:#b85763; text-transform:uppercase; letter-spacing:1px;">${dateStr}</div>
                    <div style="font-size:1.3rem; font-weight:600; color:#b13e4b; margin:4px 0 8px;">${m.title}</div>
                    ${m.note ? `<div style="color:#ac7b81; margin-bottom:8px;">${m.note}</div>` : ''}
                    <div style="display:inline-block; background:#ffd9d9; padding:4px 14px; border-radius:30px; font-size:0.9rem; color:#a53f4d;">${m.tag}</div>
                    ${m.image ? `<div style="margin-top:12px;"><img src="${m.image}" style="max-width:100%; max-height:200px; border-radius:20px; border:2px solid #ffe2e2;"></div>` : ''}
                </div>
            `;
        });
        html += '</div>';
        vaultContent.innerHTML = html;
    }

    // ----- ADD MEMORY (with image resize & storage) -----
    const memImageInput = document.getElementById('memImage');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    let imageDataURL = null;

    memImageInput.addEventListener('change', function(e) {
        const file = this.files[0];
        if (!file) {
            imagePreview.style.display = 'none';
            imageDataURL = null;
            return;
        }
        // resize image before storing
        const reader = new FileReader();
        reader.onload = function(ev) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const MAX = 400;
                let width = img.width, height = img.height;
                if (width > height) {
                    if (width > MAX) { height = height * (MAX / width); width = MAX; }
                } else {
                    if (height > MAX) { width = width * (MAX / height); height = MAX; }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                imageDataURL = dataUrl;
                previewImg.src = dataUrl;
                imagePreview.style.display = 'block';
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('saveMemoryBtn').addEventListener('click', function() {
        const title = document.getElementById('memTitle').value.trim();
        const date = document.getElementById('memDate').value;
        const note = document.getElementById('memNote').value.trim();
        const tag = document.getElementById('memTag').value;
        if (!title) { document.getElementById('memTitle').focus(); return; }
        const mems = getMemories();
        mems.unshift({
            title,
            date,
            note,
            tag,
            image: imageDataURL || null,   // store resized image
            id: Date.now()
        });
        localStorage.setItem('memories', JSON.stringify(mems));
        // reset form
        document.getElementById('memTitle').value = '';
        document.getElementById('memDate').value = '';
        document.getElementById('memNote').value = '';
        memImageInput.value = '';
        imagePreview.style.display = 'none';
        imageDataURL = null;
        // toast
        const t = document.getElementById('toast');
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2200);
        // update vault if visible
        if (pages.vault.classList.contains('active')) renderVault();
    });

    // ----- floating hearts -----
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