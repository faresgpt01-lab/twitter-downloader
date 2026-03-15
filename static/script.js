document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('download-form');
    const urlInput = document.getElementById('url-input');
    const pasteBtn = document.getElementById('paste-btn');
    const fetchBtn = document.getElementById('fetch-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const loadingText = document.getElementById('loading-text');
    const errorMessage = document.getElementById('error-message');
    const resultSection = document.getElementById('result-section');
    
    const thumbImg = document.getElementById('thumb-img');
    const videoTitle = document.getElementById('video-title');
    const videoDuration = document.getElementById('video-duration');
    const videoFormatsBody = document.getElementById('video-formats-body');
    const audioFormatsBody = document.getElementById('audio-formats-body');
    
    const themeBtn = document.getElementById('theme-btn');
    const langOptions = document.querySelectorAll('.lang-option');

    // Theme Toggle Logic
    let currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    themeBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    });

    // Language Dictionary
    const translations = {
        ar: {
            howTo: "كيفية الاستخدام؟",
            more: "المزيد ",
            title: "محمّل فيديوهات تويتر",
            subtitle: "مجاني جودة عالية",
            placeholder: "ألصق رابط فيديو تويتر الخاص بك...",
            pasteBtn: "لصق <i class='fa-solid fa-paste'></i>",
            fetchBtn: "<span>تحميل</span><i class='fa-solid fa-arrow-down-long'></i>",
            disclaimer: "لا يمكن تنزيل المحتوى المحمي بحقوق الطبع والنشر باستخدام هذه الأداة.",
            maintenance: "النظام يعمل بكفاءة عالية لتحسين الأداء والأمان.",
            infoBanner: "مجاني XDown هو محمل فيديو تويتر يعمل على الويب ولا ينتمي إلى أي برنامج أو منتجات مدفوعة - .",
            bestToolTitle: "<i class='fa-brands fa-x-twitter'></i> أفضل أداة لتنزيل تويتر",
            bestToolP1: "توفر أداة XDown أحد أفضل برامج تنزيل مقاطع فيديو تويتر بتنسيقات MP4 و MP3 مجانية.",
            bestToolP2: "وسهلة الاستخدام تتيح لك حفظ مقاطع الفيديو عالية الدقة. العملية سريعة وبسيطة، سواء كنت ترغب في تنزيل فيديو عالي الدقة أو مقطع صوتي فقط.",
            bestToolP3: "ما عليك سوى إدخال رابط المنشور على تويتر، واختيار الجودة المطلوبة وتنزيله مباشرة إلى جهازك.",
            faqTitle: "<i class='fa-regular fa-circle-question'></i> الأسئلة الشائعة",
            q1: "1. أين يتم حفظ التحميلات؟ <i class='fa-solid fa-caret-down'></i>",
            a1: "عادة ما يتم حفظ الملفات في مجلد \"التنزيلات\" (Downloads) الافتراضي على جهازك أو هاتفك المحمول.",
            q2: "2. كيفية تحميل فيديوهات تويتر بصيغة MP3؟ <i class='fa-solid fa-caret-down'></i>",
            a2: "ببساطة الصق الرابط، وبعد جلب المعلومات، اختر تبويب \"صيغ الصوت\" واضغط على زر التحميل بجانب جودة MP3.",
            q3: "3. كم من الوقت يستغرق تحميل الفيديوهات؟ <i class='fa-solid fa-caret-down'></i>",
            a3: "يعتمد ذلك على حجم الفيديو وسرعة اتصالك بالإنترنت، ولكننا نوفر أقصى سرعة ممكنة على خوادمنا.",
            q4: "4. هل من الآمن تحميل الفيديوهات باستخدام الأداة؟ <i class='fa-solid fa-caret-down'></i>",
            a4: "نعم، 100٪ آمن. لا نطلب تسجيل الدخول ولا نحتفظ بنسخ من الفيديوهات المحملة بعد تسليمها لك.",
            dlbtn: "تحميل"
        },
        en: {
            howTo: "How to use?",
            more: "More ",
            title: "Twitter Video Downloader",
            subtitle: "Free High Quality",
            placeholder: "Paste your Twitter video link here...",
            pasteBtn: "Paste <i class='fa-solid fa-paste'></i>",
            fetchBtn: "<span>Download</span><i class='fa-solid fa-arrow-down-long'></i>",
            disclaimer: "Copyright-protected content cannot be downloaded using this tool.",
            maintenance: "System is operating efficiently for improved performance and security.",
            infoBanner: "XDown is a free web-based Twitter video downloader and is not affiliated with any paid software or products.",
            bestToolTitle: "<i class='fa-brands fa-x-twitter'></i> Best Twitter Downloader Tool",
            bestToolP1: "XDown provides one of the best Twitter video downloading tools in free MP4 and MP3 formats.",
            bestToolP2: "It is easy to use and allows you to save high-definition videos. The process is fast and simple, whether you want an HD video or just audio.",
            bestToolP3: "Simply enter the Twitter post link, choose the desired quality, and download it directly to your device.",
            faqTitle: "<i class='fa-regular fa-circle-question'></i> Frequently Asked Questions",
            q1: "1. Where are the downloads saved? <i class='fa-solid fa-caret-down'></i>",
            a1: "Files are usually saved in the default 'Downloads' folder on your device or mobile phone.",
            q2: "2. How to download Twitter videos as MP3? <i class='fa-solid fa-caret-down'></i>",
            a2: "Simply paste the link, and after fetching information, choose the 'Audio Formats' tab and click the download button next to MP3 quality.",
            q3: "3. How long does it take to download videos? <i class='fa-solid fa-caret-down'></i>",
            a3: "It depends on the video size and your internet speed, but we provide the maximum possible speed on our servers.",
            q4: "4. Is it safe to download videos using the tool? <i class='fa-solid fa-caret-down'></i>",
            a4: "Yes, 100% safe. We don't require login and don't keep copies of downloaded videos after delivering them to you.",
            dlbtn: "Download"
        },
        fr: {
            howTo: "Comment utiliser?",
            more: "Plus ",
            title: "Téléchargeur Vidéo Twitter",
            subtitle: "Qualité Haute Gratuite",
            placeholder: "Collez votre lien vidéo Twitter ici...",
            pasteBtn: "Coller <i class='fa-solid fa-paste'></i>",
            fetchBtn: "<span>Télécharger</span><i class='fa-solid fa-arrow-down-long'></i>",
            disclaimer: "Le contenu protégé par le droit d'auteur ne peut pas être téléchargé avec cet outil.",
            maintenance: "Le système fonctionne efficacement avec une performance et une sécurité améliorées.",
            infoBanner: "XDown est un téléchargeur vidéo Twitter Web gratuit et n'est affilié à aucun logiciel ou produit payant.",
            bestToolTitle: "<i class='fa-brands fa-x-twitter'></i> Meilleur Outil de Téléchargement",
            bestToolP1: "XDown offre l'un des meilleurs outils de téléchargement vidéo Twitter en formats MP4 et MP3 gratuits.",
            bestToolP2: "Facile à utiliser, il vous permet d'enregistrer des vidéos haute définition. Que vous vouliez une vidéo HD ou de l'audio seul, c'est rapide.",
            bestToolP3: "Entrez simplement le lien du post, choisissez la qualité souhaitée et téléchargez directement sur votre appareil.",
            faqTitle: "<i class='fa-regular fa-circle-question'></i> Foire Aux Questions",
            q1: "1. Où les téléchargements sont-ils enregistrés? <i class='fa-solid fa-caret-down'></i>",
            a1: "Les fichiers sont généralement enregistrés dans le dossier 'Téléchargements' par défaut sur votre appareil ou téléphone mobile.",
            q2: "2. Comment télécharger des vidéos Twitter en MP3? <i class='fa-solid fa-caret-down'></i>",
            a2: "Collez simplement le lien, puis choisissez l'onglet 'Formats Audio' et cliquez sur le bouton de téléchargement près de MP3.",
            q3: "3. Combien de temps prend le téléchargement? <i class='fa-solid fa-caret-down'></i>",
            a3: "Cela dépend de la taille de la vidéo et de votre vitesse Internet, mais nous offrons la vitesse maximale sur nos serveurs.",
            q4: "4. Est-il sûr de télécharger des vidéos avec l'outil? <i class='fa-solid fa-caret-down'></i>",
            a4: "Oui, 100 % sûr. Nous ne demandons pas de connexion et ne conservons pas vos vidéos téléchargées.",
            dlbtn: "Télécharger"
        }
    };

    // Make language change function
    function changeLanguage(lang) {
        localStorage.setItem('lang', lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        
        const t = translations[lang];
        if (!t) return;
        
        document.querySelector('.nav-links a:nth-child(1)').textContent = t.howTo;
        document.querySelector('.nav-links .dropdown > a').childNodes[0].nodeValue = t.more + ' ';
        
        document.querySelector('.main-title').textContent = t.title;
        document.querySelector('.subtitle').textContent = t.subtitle;
        document.getElementById('url-input').placeholder = t.placeholder;
        document.getElementById('paste-btn').innerHTML = t.pasteBtn;
        document.getElementById('fetch-btn').innerHTML = t.fetchBtn;
        document.querySelector('.disclaimer span').textContent = t.disclaimer;
        document.querySelector('.maintenance-notice span').textContent = t.maintenance;
        
        // Add remaining translations
        if (document.querySelector('.info-banner')) document.querySelector('.info-banner').textContent = t.infoBanner;
        
        const descSide = document.querySelector('.description-side');
        if (descSide) {
            descSide.querySelector('h2').innerHTML = t.bestToolTitle;
            const ps = descSide.querySelectorAll('p');
            if (ps.length >= 3) {
                ps[0].textContent = t.bestToolP1;
                ps[1].textContent = t.bestToolP2;
                ps[2].textContent = t.bestToolP3;
            }
        }
        
        const faqSide = document.querySelector('.faq-side');
        if (faqSide) {
            faqSide.querySelector('h2').innerHTML = t.faqTitle;
            const items = faqSide.querySelectorAll('.accordion-item');
            if (items.length >= 4) {
                items[0].querySelector('button').innerHTML = t.q1;
                items[0].querySelector('.accordion-content p').textContent = t.a1;
                items[1].querySelector('button').innerHTML = t.q2;
                items[1].querySelector('.accordion-content p').textContent = t.a2;
                items[2].querySelector('button').innerHTML = t.q3;
                items[2].querySelector('.accordion-content p').textContent = t.a3;
                items[3].querySelector('button').innerHTML = t.q4;
                items[3].querySelector('.accordion-content p').textContent = t.a4;
            }
        }
        
        // Update download buttons if any exist
        document.querySelectorAll('.dl-btn').forEach(btn => {
            if (!btn.classList.contains('btn-loading')) {
                btn.innerHTML = `${t.dlbtn} <i class='fa-solid fa-download'></i>`;
            }
        });
    }

    // Load saved lang
    const savedLang = localStorage.getItem('lang') || 'ar';
    changeLanguage(savedLang);

    langOptions.forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = opt.getAttribute('data-lang');
            changeLanguage(selectedLang);
        });
    });

    // Paste from clipboard
    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            urlInput.value = text;
            urlInput.focus();
        } catch (err) {
            alert('تعذر الوصول إلى الحافظة. يرجى اللصق يدوياً.');
        }
    });

    // Handle Form Submission (Fetch Info)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const url = urlInput.value.trim();
        if (!url) return;

        // Reset UI
        errorMessage.classList.add('hidden');
        resultSection.classList.add('hidden');
        loadingText.textContent = 'جاري جلب معلومات الفيديو...';
        loadingSpinner.classList.remove('hidden');
        fetchBtn.disabled = true;
        fetchBtn.style.opacity = '0.7';

        try {
            const response = await fetch('/api/info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || 'حدث خطأ أثناء معالجة الرابط.');
            }

            renderResults(data, url);

        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('hidden');
        } finally {
            loadingSpinner.classList.add('hidden');
            fetchBtn.disabled = false;
            fetchBtn.style.opacity = '1';
        }
    });

    function renderResults(data, originalUrl) {
        // Set Preview
        videoTitle.textContent = data.title;
        thumbImg.src = data.thumbnail || 'https://abs.twimg.com/icons/apple-touch-icon-192x192.png';
        
        // Render Video Formats
        videoFormatsBody.innerHTML = '';
        if (data.video_formats && data.video_formats.length > 0) {
            data.video_formats.forEach(fmt => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${fmt.resolution} <span style="color:#888;font-size:0.8em">(.${fmt.ext})</span></td>
                    <td>${fmt.filesize}</td>
                    <td><button class="dl-btn" data-url="${originalUrl}" data-format="${fmt.format_id}">تحميل <i class="fa-solid fa-download"></i></button></td>
                `;
                videoFormatsBody.appendChild(tr);
            });
        } else {
            videoFormatsBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">لا توجد صيغ فيديو متاحة</td></tr>';
        }

        // Render Audio Formats
        audioFormatsBody.innerHTML = '';
        if (data.audio_formats && data.audio_formats.length > 0) {
            data.audio_formats.forEach(fmt => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${fmt.resolution} <span style="color:#888;font-size:0.8em">(.${fmt.ext})</span></td>
                    <td>${fmt.filesize}</td>
                    <td><button class="dl-btn" data-url="${originalUrl}" data-format="${fmt.format_id}" data-extract="${fmt.is_extract ? 'true' : 'false'}">تحميل <i class="fa-solid fa-download"></i></button></td>
                `;
                audioFormatsBody.appendChild(tr);
            });
        } else {
            audioFormatsBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">لا توجد صيغ صوت متاحة</td></tr>';
        }

        // Attach download events to the dynamically created buttons
        const dlButtons = document.querySelectorAll('.dl-btn');
        dlButtons.forEach(btn => {
            btn.addEventListener('click', handleDownloadProcess);
        });

        resultSection.classList.remove('hidden');
    }

    async function handleDownloadProcess(e) {
        const btn = e.currentTarget;
        const url = btn.getAttribute('data-url');
        const formatId = btn.getAttribute('data-format');
        const isExtract = btn.getAttribute('data-extract') === 'true';

        // UI Feedback for specific button
        const originalHtml = btn.innerHTML;
        btn.innerHTML = 'جاري... <i class="fa-solid fa-spinner fa-spin"></i>';
        btn.classList.add('btn-loading');
        btn.disabled = true;

        try {
            const response = await fetch('/api/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: url,
                    format_id: formatId,
                    is_extract: isExtract
                })
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || 'حدث خطأ أثناء تحميل الملف.');
            }

            // Trigger actual browser download
            const downloadUrl = `/download_file/${data.download_id}?ext=${data.ext}&filename=${encodeURIComponent(data.filename)}`;
            
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = data.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        } catch (error) {
            alert(error.message);
        } finally {
            btn.innerHTML = originalHtml;
            btn.classList.remove('btn-loading');
            btn.disabled = false;
        }
    }

    // FAQ Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            
            // Toggle current
            const isActive = item.classList.contains('active');
            
            // Close all other
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.accordion-content').style.maxHeight = null;
            });
            
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
});
