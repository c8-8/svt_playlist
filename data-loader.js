// SEVENTEEN 歌曲資料載入器
class SeventeenDataLoader {
    constructor() {
        this.dataSource = 'local'; // 'local', 'json', 'csv', 'api', 'complete'
        this.songs = [];
        this.metadata = {};
        this.albums = {};
    }

    // 設定資料來源
    setDataSource(source) {
        this.dataSource = source;
    }

    // 載入歌曲資料
    async loadSongs() {
        switch (this.dataSource) {
            case 'complete':
                return await this.loadFromCompleteDiscography();
            case 'json':
                return await this.loadFromJSON();
            case 'csv':
                return await this.loadFromCSV();
            case 'api':
                return await this.loadFromAPI();
            case 'spotify':
                return await this.loadFromSpotify();
            default:
                return this.loadFromLocal();
        }
    }

    // 從完整專輯資料庫載入
    async loadFromCompleteDiscography() {
        try {
            const response = await fetch('seventeen-complete-discography.json');
            const data = await response.json();
            this.metadata = data.metadata;
            this.albums = data.albums;
            
            const songs = [];
            let songId = 1;

            // 載入韓語作品
            if (data.albums.korean) {
                // 正規專輯
                if (data.albums.korean.studio_albums) {
                    data.albums.korean.studio_albums.forEach(album => {
                        songs.push(...this.generateSongsFromAlbum(album, 'korean', 'group', songId));
                        songId += album.tracks || 0;
                    });
                }

                // 迷你專輯
                if (data.albums.korean.mini_albums) {
                    data.albums.korean.mini_albums.forEach(album => {
                        songs.push(...this.generateSongsFromAlbum(album, 'korean', 'group', songId));
                        songId += album.tracks || 0;
                    });
                }

                // 小分隊專輯
                if (data.albums.korean.single_albums) {
                    data.albums.korean.single_albums.forEach(album => {
                        if (album.artist && album.artist.includes('BSS')) {
                            songs.push(...this.generateSongsFromAlbum(album, 'korean', 'subunit', songId));
                        } else if (album.artist && (album.artist.includes('JxW') || album.artist.includes('HxW'))) {
                            songs.push(...this.generateSongsFromAlbum(album, 'korean', 'subunit', songId));
                        }
                        songId += album.tracks || 0;
                    });
                }

                // 單曲
                if (data.albums.korean.singles) {
                    data.albums.korean.singles.forEach(single => {
                        songs.push({
                            id: songId++,
                            title: single.title,
                            language: 'korean',
                            category: single.title.includes('Feat.') ? 'feat' : 'group',
                            year: this.extractYearFromDate(single.release_date),
                            album: single.title,
                            era: single.era,
                            tier: null
                        });
                    });
                }
            }

            // 載入日語作品
            if (data.albums.japanese) {
                Object.keys(data.albums.japanese).forEach(albumType => {
                    if (Array.isArray(data.albums.japanese[albumType])) {
                        data.albums.japanese[albumType].forEach(album => {
                            songs.push(...this.generateSongsFromAlbum(album, 'japanese', 'group', songId));
                            songId += album.tracks || 0;
                        });
                    }
                });
            }

            // 載入英語作品
            if (data.albums.english && data.albums.english.singles) {
                data.albums.english.singles.forEach(single => {
                    songs.push({
                        id: songId++,
                        title: single.title,
                        language: 'english',
                        category: 'group',
                        year: this.extractYearFromDate(single.release_date),
                        album: single.title,
                        era: single.era,
                        tier: null
                    });
                });
            }

            // 載入中文作品
            if (data.albums.chinese) {
                if (data.albums.chinese.singles) {
                    data.albums.chinese.singles.forEach(single => {
                        songs.push({
                            id: songId++,
                            title: single.title,
                            language: 'chinese',
                            category: 'group',
                            year: this.extractYearFromDate(single.release_date),
                            album: single.title,
                            era: single.era,
                            tier: null
                        });
                    });
                }

                if (data.albums.chinese.korean_covers) {
                    data.albums.chinese.korean_covers.forEach(cover => {
                        songs.push({
                            id: songId++,
                            title: cover.title,
                            language: 'chinese',
                            category: 'group',
                            year: this.extractYearFromDate(cover.release_date),
                            album: `${cover.original} (Chinese Ver.)`,
                            era: cover.era,
                            tier: null
                        });
                    });
                }
            }

            return songs.filter(song => song.title !== 'TBA' && !song.title.includes('TBA'));

        } catch (error) {
            console.error('載入完整專輯資料庫失敗:', error);
            return this.loadFromLocal();
        }
    }

    // 從專輯生成歌曲（基於已知的歌曲名稱）
    generateSongsFromAlbum(album, language, category, startId) {
        const songs = [];
        const knownSongs = this.getKnownSongsForAlbum(album.id);
        
        if (knownSongs.length > 0) {
            knownSongs.forEach((songTitle, index) => {
                songs.push({
                    id: startId + index,
                    title: songTitle,
                    language: language,
                    category: category,
                    year: this.extractYearFromDate(album.release_date),
                    album: album.title,
                    era: album.era,
                    tier: null
                });
            });
        } else {
            // 如果沒有已知歌曲，創建佔位符
            const trackCount = typeof album.tracks === 'number' ? album.tracks : 0;
            for (let i = 0; i < trackCount; i++) {
                songs.push({
                    id: startId + i,
                    title: `${album.title} - Track ${i + 1}`,
                    language: language,
                    category: category,
                    year: this.extractYearFromDate(album.release_date),
                    album: album.title,
                    era: album.era,
                    tier: null
                });
            }
        }

        return songs;
    }

    // 獲取已知的專輯歌曲名稱
    getKnownSongsForAlbum(albumId) {
        const knownSongs = {
            '17_carat': ['Adore U (아낀다)', 'Shining Diamond', 'Ah Yeah', 'Jam Jam', '20'],
            'boys_be': ['Mansae (만세)', 'Fronting', 'When I Grow Up', 'OMG', 'Rock', 'Mansae (Acoustic Ver.)'],
            'love_letter': ['Pretty U (예쁘다)', 'Chuck', 'Still Lonely', 'Hit Song', 'Say Yes', 'Drift Away', 'Love Letter'],
            'love_letter_repackage': ['Very Nice (아주 NICE)', 'Healing', 'SIMPLE', 'Space'],
            'going_seventeen': ['BOOMBOOM (붐붐)', 'BEAUTIFUL', 'HIGHLIGHT', 'Lean On Me', 'Fast Pace', 'Don\'t Listen In Secret', 'I Don\'t Know', 'Smile Flower'],
            'al1': ['Don\'t Wanna Cry (울고 싶지 않아)', 'Habit', 'If I', 'Swimming Fool', 'MY I', 'Crazy in Love', 'Who', 'Check-In'],
            'teen_age': ['Clap (박수)', 'CHANGE UP', 'Without You', 'BRING IT', 'Lilili Yabbay', 'TRAUMA', 'Pinwheel', 'Flower', 'ROCKET', 'Hello', 'Campfire'],
            'directors_cut': ['Thanks (고맙다)', 'Thinkin\' about you', 'Run to You', 'Falling For You'],
            'you_make_my_day': ['Oh My! (어쩌나)', 'Holiday', 'Come to me', 'What\'s Good', 'MOONWALKER', 'Our dawn is hotter than day'],
            'you_made_my_dawn': ['Home', 'Good to Me', 'Hug', 'Chilli', 'Shhh', 'Getting Closer'],
            'an_ode': ['Fear (독: Fear)', 'Lie Again', 'Let me hear you say', '247', 'Second Life', 'Network Love', 'Back It Up', 'Lucky', 'Snap Shoot'],
            'henggarae': ['Left & Right', 'Fearless', 'I Wish', 'My My', 'Kidult', 'Together'],
            'semicolon': ['HOME;RUN', 'Do Re Mi', 'HEY BUDDY', 'Light a flame', 'AH! LOVE', 'All My Love'],
            'your_choice': ['Ready to love', 'Heaven\'s Cloud', 'Anyone', 'GAM3 BO1', 'Wave', 'Same dream, same mind, same night'],
            'attacca': ['Rock with you', 'To you (소용돌이)', 'Crush', 'PANG!', 'Imperfect love', 'I can\'t run away', '2 MINUS 1'],
            'face_the_sun': ['HOT', 'DON QUIXOTE', 'March', 'Domino', 'Shadow', '\'bout you (노래해)', 'IF you leave me', 'Ash'],
            'sector_17': ['_WORLD', 'Circles (놀고 놀아)', 'CHEERS'],
            'fml': ['F*ck My Life', 'Super (손오공)', 'Fire', 'I don\'t Understand But I Luv U', 'Dust (먼지)', 'April Shower'],
            'seventeenth_heaven': ['God of Music (음악의 신)', 'SOS (prod.Marshmello)', 'Diamond Days', 'Back 2 Back', 'Monster', 'Yawn', 'Headliner'],
            'spill_the_feels': ['LOVE, MONEY, FAME (feat. DJ Khaled)', 'Eyes on you', '1 TO 13', 'Candy (사탕)', 'Rain', 'Water'],
            'second_wind_bss': ['Fighting (feat. Lee Young Ji)', 'Lunch', 'Feelin\' Good', 'Turtle', 'The Reasons of My Smiles'],
            'this_man_jxw': ['THIS MAN', 'Last night (어젯밤)', 'Beautiful Monster'],
            'we_make_you': ['Call Call Call!', 'HIGHLIGHT (Japanese Ver.)', 'Lean on Me (Japanese Ver.)'],
            'fallin_flower': ['Fallin\' Flower', 'Good to Me (Japanese Ver.)'],
            'not_alone': ['Not Alone', 'HOME;RUN (Japanese Ver.)'],
            'power_of_love': ['Power of Love', 'Home (Japanese ver.)'],
            'shohikigen': ['Shohikigen (消費期限)', 'Sara Sara']
        };

        return knownSongs[albumId] || [];
    }

    // 從日期字串提取年份
    extractYearFromDate(dateString) {
        if (!dateString || dateString.includes('TBA')) return 2024;
        return parseInt(dateString.split('-')[0]);
    }

    // 從本地陣列載入（目前的方式）
    loadFromLocal() {
        return [
            // 代表性歌曲
            { id: 1, title: 'Adore U (아낀다)', language: 'korean', category: 'group', year: 2015, album: '17 CARAT', era: 'debut' },
            { id: 2, title: 'Mansae (만세)', language: 'korean', category: 'group', year: 2015, album: 'BOYS BE', era: 'rookie' },
            { id: 3, title: 'Pretty U (예쁘다)', language: 'korean', category: 'group', year: 2016, album: 'Love & Letter', era: 'rising' },
            { id: 4, title: 'Very Nice (아주 NICE)', language: 'korean', category: 'group', year: 2016, album: 'Love & Letter Repackage', era: 'rising' },
            { id: 5, title: 'BOOMBOOM (붐붐)', language: 'korean', category: 'group', year: 2016, album: 'Going Seventeen', era: 'growth' },
            { id: 6, title: 'Don\'t Wanna Cry (울고 싶지 않아)', language: 'korean', category: 'group', year: 2017, album: 'Al1', era: 'breakthrough' },
            { id: 7, title: 'Clap (박수)', language: 'korean', category: 'group', year: 2017, album: 'TEEN, AGE', era: 'peak' },
            { id: 8, title: 'Thanks (고맙다)', language: 'korean', category: 'group', year: 2018, album: 'DIRECTOR\'S CUT', era: 'peak' },
            { id: 9, title: 'Oh My! (어쩌나)', language: 'korean', category: 'group', year: 2018, album: 'YOU MAKE MY DAY', era: 'peak' },
            { id: 10, title: 'Home', language: 'korean', category: 'group', year: 2019, album: 'YOU MADE MY DAWN', era: 'peak' },
            { id: 11, title: 'HIT', language: 'korean', category: 'group', year: 2019, album: 'HIT', era: 'peak' },
            { id: 12, title: 'Fear (독: Fear)', language: 'korean', category: 'group', year: 2019, album: 'An Ode', era: 'peak' },
            { id: 13, title: 'Left & Right', language: 'korean', category: 'group', year: 2020, album: 'Heng:garæ', era: 'peak' },
            { id: 14, title: 'HOME;RUN', language: 'korean', category: 'group', year: 2020, album: '; [Semicolon]', era: 'peak' },
            { id: 15, title: 'Ready to love', language: 'korean', category: 'group', year: 2021, album: 'Your Choice', era: 'peak' },
            { id: 16, title: 'Rock with you', language: 'korean', category: 'group', year: 2021, album: 'Attacca', era: 'peak' },
            { id: 17, title: 'Darl+ing', language: 'english', category: 'group', year: 2022, album: 'Darl+ing', era: 'peak' },
            { id: 18, title: 'HOT', language: 'korean', category: 'group', year: 2022, album: 'Face the Sun', era: 'peak' },
            { id: 19, title: '_WORLD (Feat. Anne-Marie)', language: 'korean', category: 'feat', year: 2022, album: 'SECTOR 17', era: 'peak' },
            { id: 20, title: 'Super (손오공)', language: 'korean', category: 'group', year: 2023, album: 'FML', era: 'peak' },
            { id: 21, title: 'God of Music (음악의 신)', language: 'korean', category: 'group', year: 2023, album: 'SEVENTEENTH HEAVEN', era: 'peak' },
            { id: 22, title: 'MAESTRO', language: 'korean', category: 'group', year: 2024, album: '17 IS RIGHT HERE', era: 'peak' },
            { id: 23, title: 'LOVE, MONEY, FAME (feat. DJ Khaled)', language: 'korean', category: 'group', year: 2024, album: 'SPILL THE FEELS', era: 'peak' },
            
            // 小分隊歌曲
            { id: 24, title: 'BEAUTIFUL', language: 'korean', category: 'subunit', year: 2016, album: 'Going Seventeen', era: 'growth' },
            { id: 25, title: 'CHANGE UP', language: 'korean', category: 'subunit', year: 2017, album: 'TEEN, AGE', era: 'peak' },
            { id: 26, title: 'Fighting (feat. Lee Young Ji)', language: 'korean', category: 'subunit', year: 2023, album: 'SECOND WIND (BSS)', era: 'peak' },
            { id: 27, title: 'THIS MAN', language: 'korean', category: 'subunit', year: 2024, album: 'THIS MAN (JxW)', era: 'peak' },
            
            // 日文歌曲
            { id: 28, title: 'Call Call Call!', language: 'japanese', category: 'group', year: 2018, album: 'We Make You', era: 'peak' },
            { id: 29, title: 'Fallin\' Flower', language: 'japanese', category: 'group', year: 2020, album: 'Maiochiruhanabira', era: 'peak' },
            { id: 30, title: 'Not Alone', language: 'japanese', category: 'group', year: 2021, album: 'Hitorijanai', era: 'peak' },
            
            // 中文歌曲
            { id: 31, title: '相遇的意義', language: 'chinese', category: 'group', year: 2024, album: '相遇的意義', era: 'peak' },
            { id: 32, title: '怎麼辦 (Oh My!)', language: 'chinese', category: 'group', year: 2018, album: 'Oh My! (Chinese Ver.)', era: 'peak' }
        ];
    }

    // ... 其他現有方法保持不變 ...

    // 從JSON檔案載入
    async loadFromJSON() {
        try {
            const response = await fetch('seventeen-songs.json');
            const data = await response.json();
            this.metadata = data.metadata;
            return data.songs.map(song => ({
                id: song.id,
                title: song.korean_title ? `${song.title} (${song.korean_title})` : song.title,
                language: song.language,
                category: song.category,
                year: song.year,
                album: song.album,
                era: song.era,
                isTitle: song.is_title_track,
                duration: song.duration,
                popularity: song.popularity,
                tier: null
            }));
        } catch (error) {
            console.error('載入JSON失敗:', error);
            return this.loadFromLocal();
        }
    }

    // 獲取專輯統計
    async getAlbumStatistics() {
        if (this.dataSource === 'complete') {
            try {
                const response = await fetch('seventeen-complete-discography.json');
                const data = await response.json();
                return data.statistics;
            } catch (error) {
                console.error('載入專輯統計失敗:', error);
                return null;
            }
        }
        return null;
    }

    // 按語言分組歌曲
    async getSongsByLanguage() {
        const songs = await this.loadSongs();
        const languageGroups = {};
        
        songs.forEach(song => {
            const language = song.language || 'unknown';
            if (!languageGroups[language]) {
                languageGroups[language] = [];
            }
            languageGroups[language].push(song);
        });

        return languageGroups;
    }

    // 按時代分組歌曲
    async getSongsByEra() {
        const songs = await this.loadSongs();
        const eraGroups = {};
        
        songs.forEach(song => {
            const era = song.era || 'unknown';
            if (!eraGroups[era]) {
                eraGroups[era] = [];
            }
            eraGroups[era].push(song);
        });

        return eraGroups;
    }

    // 新增：CSV檔案讀取功能
    async loadFromCSV() {
        try {
            const response = await fetch('seventeen-songs-complete.csv');
            const csvText = await response.text();
            
            // 解析CSV
            const lines = csvText.split('\n');
            const headers = lines[0].split(',');
            const songs = [];
            
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                // 處理CSV行（考慮引號內的逗號）
                const values = this.parseCSVLine(line);
                if (values.length < headers.length) continue;
                
                const song = {};
                headers.forEach((header, index) => {
                    song[header.trim()] = values[index] ? values[index].trim() : '';
                });
                
                // 轉換資料類型
                song.id = parseInt(song.id);
                song.year = parseInt(song.year);
                song.is_title_track = song.is_title_track === 'TRUE';
                
                songs.push(song);
            }
            
            return songs;
        } catch (error) {
            console.error('載入CSV檔案失敗:', error);
            return [];
        }
    }

    // CSV行解析函數（處理引號內的逗號）
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
}

// 匯出給其他檔案使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SeventeenDataLoader;
} 