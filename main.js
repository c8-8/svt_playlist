// 主頁面管理系統
class MainApp {
    constructor() {
        this.currentUser = null;
        this.currentCategory = 'all';
        this.currentView = 'timeline'; // 預設顯示時間軸
        this.allSongs = [];
        this.currentSongs = [];
        this.rankings = {};
        this.sortableInstances = {};
        this.albumsData = null; // 專輯資料
        
                 // 專輯封面映射表
         this.albumCovers = {
             // 韓語專輯 - 按時間順序
             '17 CARAT': 'img/album/17CARAT.jpg',
             'BOYS BE': 'img/album/Boys_Be.jpg',
             'Love & Letter': 'img/album/Love_and_Letter.jpg',
             'Love & Letter (Repackage)': 'img/album/Love_and_Letter_Repackage.jpg',
             'Going Seventeen': 'img/album/Going_Seventeen.jpg',
             'Al1': 'img/album/Al1.jpg',
             'TEEN, AGE': 'img/album/Teen_Age.jpg',
             'DIRECTOR\'S CUT': 'img/album/DIRECTOR\'S_CUT.jpg',
             'YOU MAKE MY DAY': 'img/album/You_Make_My_Day.jpg',
             'YOU MADE MY DAWN': 'img/album/You_Made_My_Dawn.jpg',
             'An Ode': 'img/album/An_Ode.jpg',
             'Heng:garæ': 'img/album/Henggarae.jpg',
             '; [Semicolon]': 'img/album/Semicolon.jpg',
             'Your Choice': 'img/album/Your_Choice.jpg',
             'Attacca': 'img/album/Attacca.jpg',
             'Face the Sun': 'img/album/Face_the_Sun.jpg',
             'SECTOR 17': 'img/album/Sector_17.jpg',
             'FML': 'img/album/FML.jpg',
             'SEVENTEENTH HEAVEN': 'img/album/Seventeenth_Heaven.jpg',
             'SPILL THE FEELS': 'img/album/Spill_the_Feels.jpg',
             '17 IS RIGHT HERE': 'img/album/17_Is_Right_Here.jpg',
             
             // 日語專輯
             'WE MAKE YOU': 'img/album/We_Make_You.jpg',
             'Happy Ending': 'img/album/Happy_Ending.jpg',
             'Fallin\' Flower': 'img/album/Maiochiruhanabira (Fallin\' Flower).jpg',
             'Maiochiruhanabira (Fallin\' Flower)': 'img/album/Maiochiruhanabira (Fallin\' Flower).jpg',
             '24H': 'img/album/24hr.jpg',
             'Power of Love': 'img/album/Power_of_Love.jpg',
             'Not Alone': 'img/album/Not_Alone.jpg',
             'ALWAYS YOURS': 'img/album/ALWAYS_YOURS.jpg',
             'DREAM': 'img/album/DREAM.jpg',
             'Shohikigen': 'img/album/Shohikigen(消費期限).jpg',
             '消費期限': 'img/album/Shohikigen(消費期限).jpg',
             
             // 單曲
             'Darl+ing': 'img/album/Darl+ing.jpg',
             'HIT': 'img/album/An_Ode.jpg', // HIT是單曲，但封面通常使用An Ode
             
             // 小分隊專輯
             'SECOND WIND (BSS)': 'img/album/SECOND_WIND(BSS).jpg',
             'THIS MAN (JxW)': 'img/album/THIS_MAN(JxW).jpg',
             'TELEPARTY (BSS)': 'img/album/TELEPARTY(BSS).jpg',
             'BEAM (HxW)': 'img/album/BEAM(HxW).jpg',
             
             // 合輯
             '17 Hits': 'img/album/17_Hits.jpg',
             'HAPPY BURSTDAY': 'img/album/HAPPY_BURSTDAY.jpg',
             '相遇的意義': 'img/album/相遇的意義.jpg',

             // 更多日語專輯
             'Hitorijanai (Not Alone)': 'img/album/Not_Alone.jpg',
             'Ainochikara (Power of Love)': 'img/album/Power_of_Love.jpg'
         };
        
        this.init();
    }

    async init() {
        console.log('🎵 MainApp 初始化開始...');
        
        try {
            // 檢查用戶登入狀態（但不強制跳轉）
            console.log('1. 檢查用戶登入狀態...');
            this.checkAuthStatus();
            
            // 初始化事件監聽器
            console.log('2. 初始化事件監聽器...');
            this.initializeEventListeners();
            
            // 載入歌曲資料
            console.log('3. 開始載入歌曲資料...');
            await this.loadSongs();
            
            // 設置初始視圖為時間軸
            console.log('4. 設置初始視圖...');
            this.initializeDefaultView();
            
            // 初始化拖拽功能（僅在需要時）
            if (this.currentUser && !this.currentUser.isGuest) {
                console.log('5. 初始化拖拽功能...');
                this.initializeSortable();
                this.loadUserRankings();
            } else {
                console.log('5. 跳過拖拽功能（訪客模式）');
            }
            
            console.log('✅ MainApp 初始化完成！');
            this.showNotification('系統初始化完成', 'success');
            
        } catch (error) {
            console.error('❌ MainApp 初始化失敗:', error);
            this.showNotification(`系統初始化失敗: ${error.message}`, 'error');
        }
    }

    checkAuthStatus() {
        // 檢查登入用戶
        const currentUser = localStorage.getItem('svt_current_user');
        const guestUser = sessionStorage.getItem('svt_guest_user');
        
        if (currentUser) {
            this.currentUser = JSON.parse(currentUser);
        } else if (guestUser) {
            this.currentUser = JSON.parse(guestUser);
        } else {
            // 未登入，設置為訪客模式，可以瀏覽時間軸
            this.currentUser = {
                username: '訪客',
                isGuest: true,
                email: null,
                bias: null
            };
        }

        // 更新用戶介面
        this.updateUserInterface();
    }

    updateUserInterface() {
        const usernameElement = document.getElementById('username');
        if (usernameElement) {
            usernameElement.textContent = this.currentUser.username;
        }
    }

    initializeEventListeners() {
        // 視圖切換
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-view]')) {
                e.preventDefault();
                const view = e.target.dataset.view;
                this.switchView(view, e.target);
            }
        });

        // 側邊欄導航
        document.addEventListener('click', (e) => {
            if (e.target.matches('.category-list a')) {
                e.preventDefault();
                const category = e.target.dataset.category;
                if (category) {
                    this.switchCategory(category, e.target);
                }
            }
        });

        // 移動端菜單
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.add('open');
            });
        }

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.remove('open');
            });
        }

        // 動作按鈕
        document.getElementById('shuffleBtn')?.addEventListener('click', () => this.shuffleSongs());
        document.getElementById('resetBtn')?.addEventListener('click', () => this.resetRankings());
        document.getElementById('saveBtn')?.addEventListener('click', () => this.saveRankings());

        // 用戶功能
        document.getElementById('profileBtn')?.addEventListener('click', () => this.showProfile());
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());

        // 模態框
        document.addEventListener('click', (e) => {
            if (e.target.matches('.close-btn') || e.target.matches('.modal')) {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            }
        });
    }

    async loadSongs() {
        try {
            console.log('開始載入歌曲資料...');
            this.showNotification('正在載入歌曲資料...', 'info');
            
            // 載入完整專輯資料庫
            const response = await fetch('seventeen-complete-discography.json');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const discographyData = await response.json();
            console.log('JSON資料載入成功:', discographyData);
            
            // 保存專輯資料
            this.albumsData = discographyData;
            
            // 轉換為歌曲格式
            this.allSongs = this.convertDiscographyToSongs(discographyData);
            console.log(`轉換完成，共 ${this.allSongs.length} 首歌曲`);
            
            if (this.allSongs.length === 0) {
                throw new Error('轉換後的歌曲數量為0');
            }
            
            // 載入分類資料
            await this.loadCategoryData();
            
            // 顯示歌曲
            this.displaySongs();
            
            this.showNotification(`成功載入 ${this.allSongs.length} 首歌曲`, 'success');
            console.log(`成功載入 ${this.allSongs.length} 首歌曲`);
            
        } catch (error) {
            console.error('載入歌曲失敗:', error);
            console.error('錯誤詳情:', error.message);
            this.showNotification(`載入歌曲失敗: ${error.message}，嘗試載入備用資料`, 'warning');
            
            // 載入備用資料
            await this.loadFallbackData();
        }
    }

    async loadFallbackData() {
        try {
            console.log('嘗試載入CSV備用資料...');
            this.showNotification('正在載入CSV備用資料...', 'info');
            
            // 嘗試載入CSV資料
            const response = await fetch('seventeen-songs-complete.csv');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const csvText = await response.text();
            this.allSongs = this.parseCsvToSongs(csvText);
            
            if (this.allSongs.length === 0) {
                throw new Error('CSV資料解析後歌曲數量為0');
            }
            
            this.displaySongs();
            this.showNotification(`從CSV載入 ${this.allSongs.length} 首歌曲`, 'success');
            console.log(`從CSV載入 ${this.allSongs.length} 首歌曲`);
            
        } catch (error) {
            console.error('載入備用資料失敗:', error);
            console.error('錯誤詳情:', error.message);
            this.showNotification(`CSV載入失敗: ${error.message}，使用內建資料`, 'warning');
            
            // 使用內建資料
            this.allSongs = this.getBuiltinSongs();
            this.displaySongs();
            this.showNotification(`使用內建歌曲資料 (${this.allSongs.length} 首)`, 'info');
            console.log(`使用內建歌曲資料 (${this.allSongs.length} 首)`);
        }
    }

    parseCsvToSongs(csvText) {
        const lines = csvText.split('\n');
        if (lines.length < 2) {
            throw new Error('CSV檔案格式不正確：缺少資料行');
        }
        
        const headers = lines[0].split(',').map(h => h.trim());
        console.log('CSV標題行:', headers);
        
        const songs = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // 使用更複雜的CSV解析來處理引號內的逗號
            const values = this.parseCSVLine(line);
            
            if (values.length < headers.length) {
                console.warn(`第 ${i + 1} 行資料不完整:`, line);
                continue;
            }
            
            const song = {};
            headers.forEach((header, index) => {
                song[header] = values[index] ? values[index].trim().replace(/^"|"$/g, '') : '';
            });
            
            // 確保必要欄位存在
            if (song.title && song.title !== '') {
                songs.push({
                    id: parseInt(song.id) || i,
                    title: song.title,
                    koreanTitle: song.korean_title || '',
                    album: song.album || '',
                    year: parseInt(song.year) || 2015,
                    language: song.language || 'korean',
                    category: song.category || 'group',
                    era: song.era || 'unknown',
                    isTitleTrack: song.is_title_track === 'TRUE',
                    unitName: song.unit_name || '',
                    unitMembers: song.unit_members || '',
                    featuring: song.featuring || '',
                    notes: song.notes || ''
                });
            }
        }
        
        console.log(`CSV解析完成，共解析 ${songs.length} 首歌曲`);
        return songs;
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result;
    }

    getBuiltinSongs() {
        return [
            { id: 1, title: 'Adore U (아낀다)', album: '17 CARAT', year: 2015, language: 'korean', category: 'group' },
            { id: 2, title: 'Mansae (만세)', album: 'BOYS BE', year: 2015, language: 'korean', category: 'group' },
            { id: 3, title: 'Pretty U (예쁘다)', album: 'Love & Letter', year: 2016, language: 'korean', category: 'group' },
            { id: 4, title: 'Very Nice (아주 NICE)', album: 'Love & Letter (Repackage)', year: 2016, language: 'korean', category: 'group' },
            { id: 5, title: 'BOOMBOOM (붐붐)', album: 'Going Seventeen', year: 2016, language: 'korean', category: 'group' },
            { id: 6, title: 'Don\'t Wanna Cry (울고 싶지 않아)', album: 'Al1', year: 2017, language: 'korean', category: 'group' },
            { id: 7, title: 'Clap (박수)', album: 'TEEN, AGE', year: 2017, language: 'korean', category: 'group' },
            { id: 8, title: 'Thanks (고맙다)', album: 'DIRECTOR\'S CUT', year: 2018, language: 'korean', category: 'group' },
            { id: 9, title: 'Oh My!', album: 'YOU MAKE MY DAY', year: 2018, language: 'korean', category: 'group' },
            { id: 10, title: 'HOME', album: 'YOU MADE MY DAWN', year: 2019, language: 'korean', category: 'group' },
            { id: 11, title: 'HIT', album: 'An Ode', year: 2019, language: 'korean', category: 'group' },
            { id: 12, title: 'Left & Right', album: 'Heng:garæ', year: 2020, language: 'korean', category: 'group' },
            { id: 13, title: 'Rock with you', album: 'Attacca', year: 2021, language: 'korean', category: 'group' },
            { id: 14, title: 'HOT', album: 'Face the Sun', year: 2022, language: 'korean', category: 'group' },
            { id: 15, title: 'God of Music (음악의 신)', album: 'SEVENTEENTH HEAVEN', year: 2023, language: 'korean', category: 'group' },
            { id: 16, title: 'CALL CALL CALL!', album: 'WE MAKE YOU', year: 2018, language: 'japanese', category: 'group' },
            { id: 17, title: 'Happy Ending', album: 'Happy Ending', year: 2019, language: 'japanese', category: 'group' },
            { id: 18, title: 'Fallin\' Flower', album: 'Maiochiruhanabira (Fallin\' Flower)', year: 2020, language: 'japanese', category: 'group' },
            { id: 19, title: '24H', album: '24H', year: 2020, language: 'japanese', category: 'group' },
            { id: 20, title: 'Power of Love', album: 'Ainochikara (Power of Love)', year: 2021, language: 'japanese', category: 'group' },
            { id: 21, title: 'Not Alone', album: 'Hitorijanai (Not Alone)', year: 2021, language: 'japanese', category: 'group' }
        ];
    }

    convertDiscographyToSongs(discographyData) {
        const songs = [];
        let songId = 1;
        
        // 已知的專輯歌曲對應表
        const knownTracks = {
            '17 CARAT': ['Shining Diamond', 'Adore U (아낀다)', 'Ah Yeah', 'Jam Jam', '20'],
            'BOYS BE': ['Fronting', 'Mansae (만세)', 'When I Grow Up', 'OMG', 'Rock', 'BOYS BE (Outro)'],
            'Love & Letter': ['Chuck', 'Hit Song', 'Adore U (아낀다)', 'Mansae (만세)', 'Fronting', 'OMG', 'Jam Jam', 'When I Grow Up', 'Still Lonely', 'Good to Me', 'Lotto', 'Love Letter', 'Drift Away'],
            'Love & Letter (Repackage)': ['Pretty U (예쁘다)', 'Chuck', 'Hit Song', 'Adore U (아낀다)', 'Mansae (만세)', 'Fronting', 'OMG', 'Jam Jam', 'When I Grow Up', 'Still Lonely', 'Good to Me', 'Lotto', 'Love Letter', 'Drift Away', 'Say Yes', 'Healing', 'Space'],
            'Going Seventeen': ['BOOMBOOM (붐붐)', 'Thinkin\' About You', 'Popular Song', 'Lean On Me', 'Still Lonely', 'Good to Me', 'Lotto', 'Space'],
            'Al1': ['Don\'t Wanna Cry (울고 싶지 않아)', 'HIGHLIGHT', 'Campfire', 'Trauma', 'Without You', 'Beautiful', 'Crazy in Love'],
            'TEEN, AGE': ['Intro', 'Clap (박수)', 'Bring It', 'Lilili Yabbay', 'Falling for U', 'Rocket', 'Pinwheel', 'Flower', 'Campfire', 'Crazy in Love', 'Change Up', 'Outro'],
            'DIRECTOR\'S CUT': ['Thanks (고맙다)', 'Run to You', 'Rocket', 'Crazy in Love'],
            'YOU MAKE MY DAY': ['Oh My!', 'Come to Me', 'What\'s Good', 'Moonwalker', 'Our Dawn Is Hotter Than Day', 'Bad Sun'],
            'YOU MADE MY DAWN': ['Good to Me', 'Getting Closer', 'Home', 'Lie Again', 'Smile Flower', 'Hug', 'Clear'],
            'An Ode': ['HIT', 'Fear', 'Lucky', 'Snap Shoot', 'Second Life', 'Happy Ending', 'Lie Again', 'Back It Up', 'My My', 'Shhh', 'Network Love'],
            '; [Semicolon]': ['Do Re Mi', 'Hey Buddy', 'Light a Flame', 'GAM3 BO1', 'Together', 'Kidult'],
            'Heng:garæ': ['Fearless', 'Left & Right', 'I Wish', 'My My', 'Kidult', 'Together'],
            'Your Choice': ['Anyone', 'GAM3 BO1', 'Heaven\'s Cloud', 'Wave', 'Same Dream, Same Mind, Same Night', 'Ready to Love'],
            'Attacca': ['To You', 'Rock with you', 'Crush', 'PANG!', 'Imperfect Love', '2 MINUS 1', 'I Can\'t Run Away'],
            'Face the Sun': ['Darl+ing', 'HOT', 'DON QUIXOTE', 'March', 'Domino', 'Shadow', 'Don\'t Wanna Cry', 'Ash', 'If you leave me'],
            'SECTOR 17': ['_WORLD', 'Darl+ing', 'HOT', 'DON QUIXOTE', 'March', 'Domino', 'Shadow', 'Don\'t Wanna Cry', 'Ash', 'If you leave me', 'Circles', 'Fallin\' Flower', 'Cheers'],
            'FML': ['F*ck My Life', 'God of Music', 'Party Feel Love', 'Fire', 'I Don\'t Understand But I Luv U', 'Dust'],
            'SEVENTEENTH HEAVEN': ['God of Music (음악의 신)', 'Diamond Days', 'Back 2 Back', 'Monster', 'Yawn', 'Heaven', 'SOS', 'Headliner'],
            'SPILL THE FEELS': ['Eyes on You', 'LOVE, MONEY, FAME (feat. DJ Khaled)', 'Candy', 'Water', 'Rain', 'Spillin\' the Feels'],
            '17 IS RIGHT HERE': ['MAESTRO', 'God of Music (음악의 신)', 'Rock with you', 'HOT', 'Ready to Love', 'Left & Right', 'HIT', 'Don\'t Wanna Cry (울고 싶지 않아)', 'Very Nice (아주 NICE)', 'Clap (박수)', 'Pretty U (예쁘다)', 'Mansae (만세)', 'Adore U (아낀다)'],
            'HAPPY BURSTDAY': ['HBD', 'THUNDER', 'Bad Influence (Prod. by Pharrell Williams)', 'Skyfall (THE 8 Solo)', 'Fortunate Change (JOSHUA Solo)', '99.9% (WONWOO Solo)', 'Raindrops (SEUNGKWAN Solo)', 'Damage (HOSHI Solo) (feat. Timbaland)', 'Shake It Off (MINGYU Solo)', 'Happy Virus (DK Solo)', 'Destiny (WOOZI Solo)', 'Shining Star (Vernon Solo)', 'Gemini (JUN Solo)', 'Trigger (DINO Solo)', 'Coincidence (JEONGHAN Solo)', 'Jungle (S.COUPS Solo)'],
            'TELEPARTY (BSS)': ['CBZ (Prime time)', 'Happy Alone', 'Love Song'],
            'BEAM (HxW)': ['ECHO! (Prod. WOOZI)', '96ers', 'STUPID IDIOT', 'PINOCCHIO (feat. So!YoON!)']
        };
        
        if (discographyData.albums) {
            // 處理韓語專輯
            if (discographyData.albums.korean) {
                const koreanAlbums = discographyData.albums.korean;
                
                // 處理各種類型的專輯
                const albumTypes = ['studio_albums', 'mini_albums', 'special_albums', 'compilation_albums', 'single_albums'];
                
                albumTypes.forEach(albumType => {
                    if (koreanAlbums[albumType]) {
                        koreanAlbums[albumType].forEach(album => {
                            const albumTracks = knownTracks[album.title];
                            
                            if (albumTracks) {
                                // 使用已知的歌曲名稱
                                albumTracks.forEach(trackTitle => {
                                    songs.push({
                                        id: songId++,
                                        title: trackTitle,
                                        album: album.title,
                                        year: this.extractYearFromDate(album.release_date),
                                        language: 'korean',
                                        category: 'group',
                                        era: album.era || 'unknown',
                                        type: album.type
                                    });
                                });
                            } else {
                                // 為沒有詳細歌曲資料的專輯創建佔位符
                                const trackCount = typeof album.tracks === 'number' ? album.tracks : 1;
                                for (let i = 0; i < trackCount; i++) {
                                    songs.push({
                                        id: songId++,
                                        title: `${album.title} - Track ${i + 1}`,
                                        album: album.title,
                                        year: this.extractYearFromDate(album.release_date),
                                        language: 'korean',
                                        category: 'group',
                                        era: album.era || 'unknown',
                                        type: album.type
                                    });
                                }
                            }
                        });
                    }
                });
                
                // 處理韓語單曲
                if (koreanAlbums.singles) {
                    koreanAlbums.singles.forEach(single => {
                        songs.push({
                            id: songId++,
                            title: single.title,
                            album: single.title,
                            year: this.extractYearFromDate(single.release_date),
                            language: 'korean',
                            category: single.title.includes('Feat.') ? 'feat' : 'group',
                            era: single.era || 'unknown',
                            type: 'Single'
                        });
                    });
                }
            }
            
            // 處理日語專輯
            if (discographyData.albums.japanese) {
                const japaneseAlbums = discographyData.albums.japanese;
                Object.keys(japaneseAlbums).forEach(albumType => {
                    if (Array.isArray(japaneseAlbums[albumType])) {
                        japaneseAlbums[albumType].forEach(album => {
                            const trackCount = typeof album.tracks === 'number' ? album.tracks : 1;
                            for (let i = 0; i < trackCount; i++) {
                                songs.push({
                                    id: songId++,
                                    title: `${album.title} - Track ${i + 1}`,
                                    album: album.title,
                                    year: this.extractYearFromDate(album.release_date),
                                    language: 'japanese',
                                    category: 'group',
                                    era: album.era || 'unknown',
                                    type: album.type
                                });
                            }
                        });
                    }
                });
            }
            
            // 處理英語作品
            if (discographyData.albums.english && discographyData.albums.english.singles) {
                discographyData.albums.english.singles.forEach(single => {
                    songs.push({
                        id: songId++,
                        title: single.title,
                        album: single.title,
                        year: this.extractYearFromDate(single.release_date),
                        language: 'english',
                        category: 'group',
                        era: single.era || 'unknown',
                        type: 'Single'
                    });
                });
            }
            
            // 處理中文作品
            if (discographyData.albums.chinese) {
                if (discographyData.albums.chinese.singles) {
                    discographyData.albums.chinese.singles.forEach(single => {
                        songs.push({
                            id: songId++,
                            title: single.title,
                            album: single.title,
                            year: this.extractYearFromDate(single.release_date),
                            language: 'chinese',
                            category: 'group',
                            era: single.era || 'unknown',
                            type: 'Single'
                        });
                    });
                }
                
                if (discographyData.albums.chinese.korean_covers) {
                    discographyData.albums.chinese.korean_covers.forEach(cover => {
                        songs.push({
                            id: songId++,
                            title: cover.title,
                            album: `${cover.original} (Chinese Ver.)`,
                            year: this.extractYearFromDate(cover.release_date),
                            language: 'chinese',
                            category: 'group',
                            era: cover.era || 'unknown',
                            type: 'Cover'
                        });
                    });
                }
            }
        }
        
        return songs.filter(song => song.title && !song.title.includes('TBA'));
    }

    extractYearFromDate(dateString) {
        if (!dateString) return 2015;
        const year = parseInt(dateString.split('-')[0]);
        return isNaN(year) ? 2015 : year;
    }

    async loadCategoryData() {
        // 載入歌曲分類資料
        try {
            const script = document.createElement('script');
            script.src = 'song-categories.js';
            document.head.appendChild(script);
            
            // 等待腳本載入
            await new Promise(resolve => {
                script.onload = resolve;
            });
        } catch (error) {
            console.error('載入分類資料失敗:', error);
        }
    }

    initializeDefaultView() {
        // 設置預設視圖為時間軸
        document.querySelector('.ranking-container').style.display = 'none';
        document.getElementById('timeline-container').style.display = 'block';
        document.getElementById('categoryTitle').textContent = '專輯時間軸';
        document.querySelector('.content-actions').style.display = 'none';
        
        // 設置時間軸為活動狀態
        document.querySelectorAll('[data-view]').forEach(a => a.classList.remove('active'));
        const timelineBtn = document.querySelector('[data-view="timeline"]');
        if (timelineBtn) {
            timelineBtn.classList.add('active');
        }
        
        // 載入時間軸
        this.loadTimeline();
        
        console.log('預設視圖已設置為時間軸模式');
    }

    switchView(view, activeElement) {
        // 切換視圖
        if (view === 'ranking') {
            // 檢查登入狀態
            if (!this.currentUser || this.currentUser.isGuest) {
                this.showNotification('排名功能需要登入，正在跳轉到登入頁面...', 'info');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                return;
            }
            
            this.currentView = view;
            document.querySelector('.ranking-container').style.display = 'block';
            document.getElementById('timeline-container').style.display = 'none';
            document.getElementById('categoryTitle').textContent = '歌曲排名';
            
            // 顯示排名相關按鈕
            document.querySelector('.content-actions').style.display = 'flex';
            
        } else if (view === 'timeline') {
            this.currentView = view;
            document.querySelector('.ranking-container').style.display = 'none';
            document.getElementById('timeline-container').style.display = 'block';
            document.getElementById('categoryTitle').textContent = '專輯時間軸';
            this.loadTimeline();
            
            // 隱藏排名相關按鈕
            document.querySelector('.content-actions').style.display = 'none';
        }
        
        // 更新活動狀態
        document.querySelectorAll('[data-view]').forEach(a => a.classList.remove('active'));
        if (activeElement) {
            activeElement.classList.add('active');
        }
        
        // 關閉移動端側邊欄
        if (window.innerWidth <= 1024) {
            document.getElementById('sidebar').classList.remove('open');
        }
    }

    switchCategory(category, activeElement) {
        // 只在排名視圖中處理分類切換
        if (this.currentView !== 'ranking') return;
        
        this.currentCategory = category;
        
        // 更新活動狀態
        document.querySelectorAll('.category-list a').forEach(a => a.classList.remove('active'));
        activeElement.classList.add('active');
        
        // 更新標題
        const title = window.SONG_CATEGORIES ? 
            window.SONG_CATEGORIES.categoryTitles[category] || category : 
            category;
        document.getElementById('categoryTitle').textContent = title;
        
        // 篩選並顯示歌曲
        this.filterAndDisplaySongs();
        
        // 關閉移動端側邊欄
        if (window.innerWidth <= 1024) {
            document.getElementById('sidebar').classList.remove('open');
        }
    }

    filterAndDisplaySongs() {
        if (window.SONG_CATEGORIES) {
            this.currentSongs = window.SONG_CATEGORIES.getCategorySongs(this.currentCategory, this.allSongs);
        } else {
            // 基本篩選邏輯
            switch (this.currentCategory) {
                case 'korean':
                    this.currentSongs = this.allSongs.filter(song => song.language === 'korean');
                    break;
                case 'japanese':
                    this.currentSongs = this.allSongs.filter(song => song.language === 'japanese');
                    break;
                case 'chronological':
                    this.currentSongs = [...this.allSongs].sort((a, b) => a.year - b.year);
                    break;
                default:
                    this.currentSongs = this.allSongs;
            }
        }
        
        this.displaySongs();
    }

    displaySongs() {
        const songPool = document.getElementById('song-pool');
        if (!songPool) return;
        
        // 清空載入動畫
        songPool.innerHTML = '';
        
        // 如果沒有歌曲，顯示提示
        if (this.currentSongs.length === 0) {
            songPool.innerHTML = '<div class="no-songs"><p>沒有找到歌曲</p></div>';
            return;
        }
        
        // 顯示歌曲
        this.currentSongs.forEach(song => {
            if (!this.isSongRanked(song.id)) {
                const songElement = this.createSongElement(song);
                songPool.appendChild(songElement);
            }
        });
        
        console.log(`顯示 ${this.currentSongs.length} 首歌曲`);
    }

    createSongElement(song) {
        const songDiv = document.createElement('div');
        songDiv.className = 'song-item';
        songDiv.dataset.songId = song.id;
        
        songDiv.innerHTML = `
            <div class="song-title">${song.title}</div>
            <div class="song-meta">
                <span class="song-album">${song.album}</span>
                <span class="song-year">${song.year}</span>
                <span class="song-language">${song.language}</span>
            </div>
        `;
        
        return songDiv;
    }

    isSongRanked(songId) {
        return Object.values(this.rankings).some(tier => 
            tier.some(rankedSong => rankedSong.id === songId)
        );
    }

    initializeSortable() {
        const tierContents = document.querySelectorAll('.tier-content');
        const songPool = document.getElementById('song-pool');

        // 為每個tier設置sortable
        tierContents.forEach(tierContent => {
            const sortable = Sortable.create(tierContent, {
                group: 'shared',
                animation: 150,
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                onAdd: (evt) => {
                    const songId = evt.item.dataset.songId;
                    const tier = evt.to.dataset.tier;
                    this.updateRankings();
                    this.saveRankings();
                },
                onUpdate: () => {
                    this.updateRankings();
                    this.saveRankings();
                }
            });
            this.sortableInstances[tierContent.id] = sortable;
        });

        // 為歌曲池設置sortable
        if (songPool) {
            const poolSortable = Sortable.create(songPool, {
                group: 'shared',
                animation: 150,
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                onAdd: () => {
                    this.updateRankings();
                    this.saveRankings();
                }
            });
            this.sortableInstances['song-pool'] = poolSortable;
        }
    }

    updateRankings() {
        this.rankings = {};
        
        const tiers = ['S', 'A', 'B', 'C', 'D'];
        tiers.forEach(tier => {
            const tierElement = document.getElementById(`tier-${tier.toLowerCase()}`);
            if (tierElement) {
                const songs = Array.from(tierElement.children)
                    .filter(child => child.classList.contains('song-item'))
                    .map(songElement => {
                        const songId = songElement.dataset.songId;
                        const song = this.allSongs.find(s => s.id === songId);
                        return song;
                    })
                    .filter(song => song);
                
                this.rankings[tier] = songs;
            }
        });
        
        this.updateStatistics();
    }

    updateStatistics() {
        const rankedCount = Object.values(this.rankings)
            .reduce((total, tier) => total + tier.length, 0);
        const sTierCount = this.rankings.S ? this.rankings.S.length : 0;
        
        document.getElementById('rankedSongsCount').textContent = rankedCount;
        document.getElementById('sTierCount').textContent = sTierCount;
    }

    shuffleSongs() {
        const songPool = document.getElementById('song-pool');
        const songs = Array.from(songPool.children);
        
        // Fisher-Yates shuffle
        for (let i = songs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            songPool.appendChild(songs[j]);
        }
        
        this.showNotification('歌曲已隨機排序', 'info');
    }

    resetRankings() {
        if (confirm('確定要重置所有排名嗎？此操作無法復原。')) {
            // 將所有歌曲移回歌曲池
            const tiers = ['S', 'A', 'B', 'C', 'D'];
            const songPool = document.getElementById('song-pool');
            
            tiers.forEach(tier => {
                const tierElement = document.getElementById(`tier-${tier.toLowerCase()}`);
                const songs = Array.from(tierElement.children)
                    .filter(child => child.classList.contains('song-item'));
                
                songs.forEach(song => {
                    songPool.appendChild(song);
                });
            });
            
            this.rankings = {};
            this.updateStatistics();
            this.saveRankings();
            this.showNotification('排名已重置', 'success');
        }
    }

    saveRankings() {
        if (this.currentUser && !this.currentUser.isGuest) {
            const rankingData = {
                userId: this.currentUser.username,
                rankings: this.rankings,
                lastUpdated: new Date().toISOString()
            };
            
            localStorage.setItem(`svt_rankings_${this.currentUser.username}`, JSON.stringify(rankingData));
            this.showNotification('排名已保存', 'success');
        }
    }

    loadUserRankings() {
        if (this.currentUser && !this.currentUser.isGuest) {
            const savedRankings = localStorage.getItem(`svt_rankings_${this.currentUser.username}`);
            if (savedRankings) {
                const rankingData = JSON.parse(savedRankings);
                this.rankings = rankingData.rankings || {};
                this.restoreRankings();
            }
        }
    }

    restoreRankings() {
        const tiers = ['S', 'A', 'B', 'C', 'D'];
        
        tiers.forEach(tier => {
            const tierElement = document.getElementById(`tier-${tier.toLowerCase()}`);
            const tierSongs = this.rankings[tier] || [];
            
            tierSongs.forEach(song => {
                const songElement = this.createSongElement(song);
                tierElement.appendChild(songElement);
            });
        });
        
        this.updateStatistics();
        this.displaySongs(); // 重新顯示未排名的歌曲
    }

    loadTimeline() {
        const timelineContainer = document.querySelector('.timeline');
        if (!timelineContainer) return;
        
        // 清空載入動畫
        timelineContainer.innerHTML = '';
        
        if (this.albumsData && this.albumsData.albums) {
            this.renderTimeline(this.albumsData.albums);
        } else {
            // 使用預設專輯資料
            this.renderTimeline(this.getDefaultAlbums());
        }
    }

    getDefaultAlbums() {
        return [
            { id: '17-carat', title: '17 CARAT', year: 2015, date: '2015.05.29', type: '1st Mini Album', language: 'korean' },
            { id: 'boys-be', title: 'BOYS BE', year: 2015, date: '2015.09.10', type: '2nd Mini Album', language: 'korean' },
            { id: 'love-letter', title: 'Love & Letter', year: 2016, date: '2016.04.25', type: '1st Studio Album', language: 'korean' },
            { id: 'love-letter-repackage', title: 'Love & Letter (Repackage)', year: 2016, date: '2016.07.03', type: 'Repackage Album', language: 'korean' },
            { id: 'going-seventeen', title: 'Going Seventeen', year: 2016, date: '2016.12.05', type: '3rd Mini Album', language: 'korean' },
            { id: 'al1', title: 'Al1', year: 2017, date: '2017.05.22', type: '4th Mini Album', language: 'korean' },
            { id: 'teen-age', title: 'TEEN, AGE', year: 2017, date: '2017.11.06', type: '2nd Studio Album', language: 'korean' },
            { id: 'directors-cut', title: 'DIRECTOR\'S CUT', year: 2018, date: '2018.02.04', type: 'Special Album', language: 'korean' },
            { id: 'we-make-you', title: 'WE MAKE YOU', year: 2018, date: '2018.05.30', type: '1st Mini Album', language: 'japanese' },
            { id: 'you-make-my-day', title: 'YOU MAKE MY DAY', year: 2018, date: '2018.07.15', type: '5th Mini Album', language: 'korean' },
            { id: 'you-made-my-dawn', title: 'YOU MADE MY DAWN', year: 2019, date: '2019.01.20', type: '6th Mini Album', language: 'korean' },
            { id: 'an-ode', title: 'An Ode', year: 2019, date: '2019.09.16', type: '3rd Studio Album', language: 'korean' },
            { id: 'henggarae', title: 'Heng:garæ', year: 2020, date: '2020.06.22', type: '7th Mini Album', language: 'korean' },
            { id: 'semicolon', title: '; [Semicolon]', year: 2020, date: '2020.10.18', type: 'Special Album', language: 'korean' },
            { id: 'your-choice', title: 'Your Choice', year: 2021, date: '2021.06.18', type: '8th Mini Album', language: 'korean' },
            { id: 'attacca', title: 'Attacca', year: 2021, date: '2021.10.22', type: '9th Mini Album', language: 'korean' },
            { id: 'face-the-sun', title: 'Face the Sun', year: 2022, date: '2022.05.27', type: '4th Studio Album', language: 'korean' },
            { id: 'sector-17', title: 'SECTOR 17', year: 2022, date: '2022.07.18', type: 'Repackage Album', language: 'korean' },
            { id: 'seventeenth-heaven', title: 'SEVENTEENTH HEAVEN', year: 2023, date: '2023.10.23', type: '11th Mini Album', language: 'korean' },
            { id: 'spill-the-feels', title: 'SPILL THE FEELS', year: 2024, date: '2024.10.14', type: '12th Mini Album', language: 'korean' }
        ];
    }

    renderTimeline(albums) {
        const timelineContainer = document.querySelector('.timeline');
        const albumsByYear = {};
        
        // 確保albums是陣列格式
        let albumList = [];
        if (Array.isArray(albums)) {
            albumList = albums;
        } else if (albums && typeof albums === 'object') {
            // 如果albums是物件（如JSON中的結構），轉換為陣列
            albumList = this.convertAlbumsObjectToArray(albums);
        }
        
        // 按年份分組
        albumList.forEach(album => {
            const year = album.year;
            if (!albumsByYear[year]) {
                albumsByYear[year] = [];
            }
            albumsByYear[year].push(album);
        });
        
        // 渲染時間軸
        Object.keys(albumsByYear).sort().forEach(year => {
            const yearDiv = document.createElement('div');
            yearDiv.className = 'timeline-year';
            
            const yearMarker = document.createElement('div');
            yearMarker.className = 'year-marker';
            yearMarker.innerHTML = `<span class="year-text">${year}</span>`;
            
            const albumsRow = document.createElement('div');
            albumsRow.className = 'albums-row';

            // 如果同年份的專輯少於等於4張，則添加一個class使其單行顯示
            if (albumsByYear[year].length <= 4) {
                albumsRow.classList.add('single-row');
            }
            
            // 按照發行日期對同年份的專輯進行排序
            albumsByYear[year].sort((a, b) => {
                const dateA = new Date((a.date || '').replace(/\./g, '-'));
                const dateB = new Date((b.date || '').replace(/\./g, '-'));
                if (isNaN(dateA) || isNaN(dateB)) return 0;
                return dateA - dateB;
            });

            albumsByYear[year].forEach(album => {
                const albumCard = this.createAlbumCard(album);
                albumsRow.appendChild(albumCard);
            });
            
            yearDiv.appendChild(yearMarker);
            yearDiv.appendChild(albumsRow);
            timelineContainer.appendChild(yearDiv);
        });
    }

    convertAlbumsObjectToArray(albumsObj) {
        const albumList = [];
        
        // 處理韓語專輯
        if (albumsObj.korean) {
            const koreanAlbums = albumsObj.korean;
            const albumTypes = ['studio_albums', 'mini_albums', 'special_albums', 'compilation_albums', 'single_albums'];
            
            albumTypes.forEach(albumType => {
                if (koreanAlbums[albumType] && Array.isArray(koreanAlbums[albumType])) {
                    koreanAlbums[albumType].forEach(album => {
                        albumList.push({
                            id: album.id,
                            title: album.title,
                            year: this.extractYearFromDate(album.release_date),
                            date: album.release_date,
                            type: album.type,
                            language: 'korean',
                            tracks: album.tracks || []
                        });
                    });
                }
            });
        }
        
        // 處理日語專輯
        if (albumsObj.japanese) {
            Object.keys(albumsObj.japanese).forEach(albumType => {
                if (Array.isArray(albumsObj.japanese[albumType])) {
                    albumsObj.japanese[albumType].forEach(album => {
                        albumList.push({
                            id: album.id,
                            title: album.title,
                            year: this.extractYearFromDate(album.release_date),
                            date: album.release_date,
                            type: album.type,
                            language: 'japanese',
                            tracks: album.tracks || []
                        });
                    });
                }
            });
        }
        
        // 處理英語和中文專輯
        ['english', 'chinese'].forEach(lang => {
            if (albumsObj[lang] && albumsObj[lang].singles) {
                albumsObj[lang].singles.forEach(single => {
                    albumList.push({
                        id: single.id || single.title.toLowerCase().replace(/\s+/g, '-'),
                        title: single.title,
                        year: this.extractYearFromDate(single.release_date),
                        date: single.release_date,
                        type: 'Single',
                        language: lang,
                        tracks: []
                    });
                });
            }
        });
        
        return albumList.sort((a, b) => a.year - b.year);
    }

    createAlbumCard(album) {
        const card = document.createElement('div');
        card.className = 'album-card';
        card.onclick = () => this.openAlbumModal(album);
        
        // 使用真實專輯封面或後備方案
        const coverUrl = this.getAlbumCoverUrl(album.title);
        
        card.innerHTML = `
            <div class="album-cover">
                <img src="${coverUrl}" alt="${album.title}" onerror="this.src='https://via.placeholder.com/200x200/F7CAC9/FFFFFF?text=${encodeURIComponent(album.title)}'">
            </div>
            <div class="album-info">
                <h3>${album.title}</h3>
                <p>${album.date || album.year}</p>
                <span class="album-type">${album.type}</span>
            </div>
        `;
        
        return card;
    }

    openAlbumModal(album) {
        const modal = document.getElementById('albumModal');
        const coverUrl = this.getAlbumCoverUrl(album.title);
        
        document.getElementById('albumModalTitle').textContent = album.title;
        document.getElementById('albumCoverLarge').src = coverUrl;
        document.getElementById('albumCoverLarge').onerror = function() {
            this.src = `https://via.placeholder.com/200x200/F7CAC9/FFFFFF?text=${encodeURIComponent(album.title)}`;
        };
        document.getElementById('albumTitleDetailed').textContent = album.title;
        document.getElementById('albumReleaseDate').textContent = album.date || album.year;
        document.getElementById('albumType').textContent = album.type || '專輯';
        document.getElementById('albumLanguage').textContent = album.language || 'Korean';
        
        // 顯示收錄曲目
        const trackList = document.getElementById('albumTrackList');
        trackList.innerHTML = '';
        
        // 嘗試從專輯資料中獲取曲目
        let tracks = [];
        if (album.tracks && album.tracks.length > 0) {
            tracks = album.tracks;
        } else if (this.albumsData && this.albumsData.albums) {
            // 從完整專輯資料中查找（需要處理物件結構）
            const albumArray = this.convertAlbumsObjectToArray(this.albumsData.albums);
            const fullAlbum = albumArray.find(a => 
                a.title === album.title || a.id === album.id
            );
            if (fullAlbum && fullAlbum.tracks) {
                tracks = fullAlbum.tracks;
            }
        }
        
        if (tracks.length > 0) {
            tracks.forEach((track, index) => {
                const li = document.createElement('li');
                const trackTitle = track.title || track;
                li.innerHTML = `
                    <span class="track-number">${index + 1}.</span>
                    <span class="track-title">${trackTitle}</span>
                `;
                trackList.appendChild(li);
            });
        } else {
            // 如果沒有曲目資料，從歌曲資料庫中查找該專輯的歌曲
            const albumSongs = this.allSongs.filter(song => 
                song.album === album.title
            );
            
            if (albumSongs.length > 0) {
                albumSongs.forEach((song, index) => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span class="track-number">${index + 1}.</span>
                        <span class="track-title">${song.title}</span>
                    `;
                    trackList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = '暫無曲目資訊';
                trackList.appendChild(li);
            }
        }
        
        modal.style.display = 'block';
    }

    showProfile() {
        const modal = document.getElementById('profileModal');
        
        document.getElementById('profileUsername').textContent = this.currentUser.username;
        document.getElementById('profileEmail').textContent = this.currentUser.email || '-';
        document.getElementById('profileBias').textContent = this.getBiasName(this.currentUser.bias) || '-';
        document.getElementById('profileRegisterTime').textContent = 
            this.currentUser.registerTime ? new Date(this.currentUser.registerTime).toLocaleDateString() : '-';
        
        modal.style.display = 'block';
    }

    getBiasName(biasId) {
        const biasNames = {
            'scoups': 'S.Coups (에스쿱스)',
            'jeonghan': 'Jeonghan (정한)',
            'joshua': 'Joshua (조슈아)',
            'jun': 'Jun (준)',
            'hoshi': 'Hoshi (호시)',
            'wonwoo': 'Wonwoo (원우)',
            'woozi': 'Woozi (우지)',
            'the8': 'The8 (디에잇)',
            'mingyu': 'Mingyu (민규)',
            'dk': 'DK (도겸)',
            'seungkwan': 'Seungkwan (승관)',
            'vernon': 'Vernon (버논)',
            'dino': 'Dino (디노)',
            'ot13': 'OT13 (全部都愛)'
        };
        return biasNames[biasId] || biasId;
    }

    logout() {
        if (confirm('確定要登出嗎？')) {
            localStorage.removeItem('svt_current_user');
            sessionStorage.removeItem('svt_guest_user');
            window.location.href = 'login.html';
        }
    }

    showNotification(message, type = 'info') {
        // 創建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // 添加樣式
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                animation: slideIn 0.3s ease;
                max-width: 300px;
            }
            
            .notification-success { border-left: 4px solid #4CAF50; }
            .notification-error { border-left: 4px solid #f44336; }
            .notification-warning { border-left: 4px solid #ff9800; }
            .notification-info { border-left: 4px solid #2196F3; }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .notification-success i { color: #4CAF50; }
            .notification-error i { color: #f44336; }
            .notification-warning i { color: #ff9800; }
            .notification-info i { color: #2196F3; }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        
        if (!document.querySelector('style[data-notification]')) {
            style.setAttribute('data-notification', 'true');
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // 3秒後自動移除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    getAlbumCoverUrl(albumTitle) {
        return this.albumCovers[albumTitle] || `https://via.placeholder.com/200x200/F7CAC9/FFFFFF?text=${encodeURIComponent(albumTitle)}`;
    }
}

// 關閉專輯模態框的全域函數
function closeAlbumModal() {
    document.getElementById('albumModal').style.display = 'none';
} 