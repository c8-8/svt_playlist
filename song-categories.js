// SEVENTEEN 歌曲分類資料庫
const SONG_CATEGORIES = {
    // 成員資訊
    members: {
        'scoups': { name: 'S.Coups', koreanName: '에스쿱스', birthYear: 1995, team: 'hiphop' },
        'jeonghan': { name: 'Jeonghan', koreanName: '정한', birthYear: 1995, team: 'vocal' },
        'joshua': { name: 'Joshua', koreanName: '조슈아', birthYear: 1995, team: 'vocal' },
        'jun': { name: 'Jun', koreanName: '준', birthYear: 1996, team: 'performance' },
        'hoshi': { name: 'Hoshi', koreanName: '호시', birthYear: 1996, team: 'performance' },
        'wonwoo': { name: 'Wonwoo', koreanName: '원우', birthYear: 1996, team: 'hiphop' },
        'woozi': { name: 'Woozi', koreanName: '우지', birthYear: 1996, team: 'vocal' },
        'the8': { name: 'The8', koreanName: '디에잇', birthYear: 1997, team: 'performance' },
        'mingyu': { name: 'Mingyu', koreanName: '민규', birthYear: 1997, team: 'hiphop' },
        'dk': { name: 'DK', koreanName: '도겸', birthYear: 1997, team: 'vocal' },
        'seungkwan': { name: 'Seungkwan', koreanName: '승관', birthYear: 1998, team: 'vocal' },
        'vernon': { name: 'Vernon', koreanName: '버논', birthYear: 1998, team: 'hiphop' },
        'dino': { name: 'Dino', koreanName: '디노', birthYear: 1999, team: 'performance' }
    },

    // 正式小分隊歌曲
    officialUnits: {
        'hiphop-team': [
            { title: 'Trauma', album: 'Teen, Age', year: 2017, members: ['scoups', 'wonwoo', 'mingyu', 'vernon'] },
            { title: 'Moonwalker', album: 'You Make My Day', year: 2018, members: ['scoups', 'wonwoo', 'mingyu', 'vernon'] },
            { title: 'Back It Up', album: 'An Ode', year: 2019, members: ['scoups', 'wonwoo', 'mingyu', 'vernon'] },
            { title: 'GAM3 BO1', album: 'Your Choice', year: 2021, members: ['scoups', 'wonwoo', 'mingyu', 'vernon'] },
            { title: 'Fire', album: 'FML', year: 2023, members: ['scoups', 'wonwoo', 'mingyu', 'vernon'] },
            { title: 'Rain', album: 'Spill The Feels', year: 2024, members: ['scoups', 'wonwoo', 'mingyu', 'vernon'] }
        ],
        'vocal-team': [
            { title: 'Habit', album: 'Al1', year: 2017, members: ['jeonghan', 'joshua', 'woozi', 'dk', 'seungkwan'] },
            { title: 'Pinwheel', album: 'Teen, Age', year: 2017, members: ['jeonghan', 'joshua', 'woozi', 'dk', 'seungkwan'] },
            { title: 'Hug', album: 'You Made My Dawn', year: 2019, members: ['jeonghan', 'joshua', 'woozi', 'dk', 'seungkwan'] },
            { title: 'Kidult', album: 'Heng:garae', year: 2020, members: ['jeonghan', 'joshua', 'woozi', 'dk', 'seungkwan'] },
            { title: 'Same Dream, Same Mind, Same Night', album: 'Your Choice', year: 2021, members: ['jeonghan', 'joshua', 'woozi', 'dk', 'seungkwan'] },
            { title: 'Dust (먼지)', album: 'FML', year: 2023, members: ['jeonghan', 'joshua', 'woozi', 'dk', 'seungkwan'] },
            { title: 'Candy (사탕)', album: 'Spill The Feels', year: 2024, members: ['jeonghan', 'joshua', 'woozi', 'dk', 'seungkwan'] }
        ],
        'performance-team': [
            { title: 'Lilili Yabbay', album: 'Teen, Age', year: 2017, members: ['jun', 'hoshi', 'the8', 'dino'] },
            { title: 'What\'s Good', album: 'You Make My Day', year: 2018, members: ['jun', 'hoshi', 'the8', 'dino'] },
            { title: 'Lucky', album: 'An Ode', year: 2019, members: ['jun', 'hoshi', 'the8', 'dino'] },
            { title: 'Wave', album: 'Your Choice', year: 2021, members: ['jun', 'hoshi', 'the8', 'dino'] },
            { title: 'I Don\'t Understand But I Luv U', album: 'FML', year: 2023, members: ['jun', 'hoshi', 'the8', 'dino'] },
            { title: 'Water', album: 'Spill The Feels', year: 2024, members: ['jun', 'hoshi', 'the8', 'dino'] }
        ],
        'bss': [
            { title: 'Just Do It', album: 'BSS 1st Single Album', year: 2018, members: ['hoshi', 'dk', 'seungkwan'] },
            { title: 'Fighting (feat. Lee Young Ji)', album: 'Second Wind', year: 2023, members: ['hoshi', 'dk', 'seungkwan'] },
            { title: 'Lunch', album: 'Second Wind', year: 2023, members: ['hoshi', 'dk', 'seungkwan'] },
            { title: 'Feelin\' Good', album: 'Second Wind', year: 2023, members: ['hoshi', 'dk', 'seungkwan'] },
            { title: 'Turtle', album: 'Second Wind', year: 2023, members: ['hoshi', 'dk', 'seungkwan'] },
            { title: 'The Reasons of My Smiles', album: 'Second Wind', year: 2023, members: ['hoshi', 'dk', 'seungkwan'] }
        ],
        'jxw': [
            { title: 'THIS MAN', album: 'THIS MAN', year: 2024, members: ['jeonghan', 'wonwoo'] },
            { title: 'Last night (어젯밤)', album: 'THIS MAN', year: 2024, members: ['jeonghan', 'wonwoo'] },
            { title: 'Beautiful Monster', album: 'THIS MAN', year: 2024, members: ['jeonghan', 'wonwoo'] }
        ],
        'hxw': [
            { title: 'BEAM', album: 'BEAM', year: 2025, members: ['hoshi', 'woozi'] }
        ]
    },

    // 年齡線小分隊
    ageLineUnits: {
        'leaders': [
            { title: 'AH! LOVE', album: '; [Semicolon]', year: 2020, members: ['scoups', 'jeonghan', 'joshua'] }
        ],
        '95line': [
            { title: 'AH! LOVE', album: '; [Semicolon]', year: 2020, members: ['scoups', 'jeonghan', 'joshua'] }
        ],
        '96line': [
            { title: '마음에 불을 지펴 (Light a Flame)', album: '; [Semicolon]', year: 2020, members: ['jun', 'hoshi', 'wonwoo', 'woozi'] }
        ],
        '97line': [
            { title: 'HEY BUDDY', album: '; [Semicolon]', year: 2020, members: ['the8', 'mingyu', 'dk'] }
        ],
        'maknae-line': [
            { title: '도레미 (Do Re Mi)', album: '; [Semicolon]', year: 2020, members: ['seungkwan', 'vernon', 'dino'] }
        ]
    },

    // 隨機組合歌曲
    randomUnits: [
        {
            title: '이놈의 인기 (Still Lonely)',
            album: 'Love & Letter',
            year: 2016,
            members: ['jun', 'hoshi', 'wonwoo', 'woozi', 'dk', 'vernon', 'dino'],
            note: '7人組合'
        },
        {
            title: 'Say Yes',
            album: 'Love & Letter',
            year: 2016,
            members: ['dk', 'seungkwan'],
            note: 'DK × 勝寛'
        },
        {
            title: '떠내려가 (Drift Away)',
            album: 'Love & Letter',
            year: 2016,
            members: ['scoups', 'jeonghan', 'joshua', 'the8', 'mingyu', 'seungkwan'],
            note: '6人組合'
        },
        {
            title: 'Beautiful',
            album: 'Going Seventeen',
            year: 2016,
            members: ['joshua', 'hoshi', 'the8', 'mingyu', 'dk', 'dino'],
            note: '6人組合'
        },
        {
            title: '글쎄 (I Don\'t Know)',
            album: 'Going Seventeen',
            year: 2016,
            members: ['scoups', 'jeonghan', 'jun', 'wonwoo', 'woozi', 'seungkwan', 'vernon'],
            note: '7人組合'
        },
        {
            title: 'Flower',
            album: 'Teen, Age',
            year: 2017,
            members: ['scoups', 'jeonghan', 'wonwoo', 'the8', 'seungkwan', 'dino'],
            note: '6人組合'
        },
        {
            title: 'MY I',
            album: 'Al1',
            year: 2017,
            members: ['jun', 'the8'],
            note: 'Jun × The8 (中國Line)'
        },
        {
            title: '兄弟一回',
            album: 'Special',
            year: 2018,
            members: ['jun', 'the8'],
            note: 'Jun × The8 中文歌'
        },
        {
            title: '날 쏘고 가라 (Bring It)',
            album: 'Teen, Age',
            year: 2017,
            members: ['hoshi', 'woozi'],
            note: '豪雨 (Hoshi × Woozi)'
        },
        {
            title: 'ROCKET',
            album: 'Teen, Age',
            year: 2017,
            members: ['joshua', 'vernon'],
            note: 'Joshua × Vernon'
        },
        {
            title: '2 MINUS 1',
            album: 'Attacca',
            year: 2021,
            members: ['joshua', 'vernon'],
            note: 'Joshua × Vernon'
        },
        {
            title: 'Hello',
            album: 'Teen, Age',
            year: 2017,
            members: ['jun', 'mingyu', 'dk'],
            note: '3人組合'
        },
        {
            title: 'Falling For U',
            album: 'Director\'s Cut',
            year: 2018,
            members: ['jeonghan', 'joshua'],
            note: 'Jeonghan × Joshua'
        },
        {
            title: 'Network Love',
            album: 'An Ode',
            year: 2019,
            members: ['joshua', 'jun', 'the8', 'vernon'],
            note: '4人組合'
        },
        {
            title: 'A-TEEN',
            album: 'Special OST',
            year: 2018,
            members: ['joshua', 'hoshi', 'woozi', 'vernon', 'dino'],
            note: 'A-TEEN OST'
        },
        {
            title: 'SWEETEST THING',
            album: 'Special',
            year: 2021,
            members: ['joshua', 'wonwoo', 'dk', 'seungkwan', 'dino'],
            note: '5人組合'
        },
        {
            title: '逆燃 (Warrior)',
            album: 'Special',
            year: 2022,
            members: ['joshua', 'jun', 'the8', 'mingyu', 'vernon'],
            note: '5人組合'
        },
        {
            title: 'We gonna make it shine',
            album: 'Special',
            year: 2023,
            members: ['hoshi', 'woozi', 'dk', 'seungkwan'],
            note: '4人組合'
        }
    ],

    // 個人作品/OST/合作
    soloAndCollaborations: [
        {
            title: 'Q&A (與Ailee合作)',
            artist: 'S.Coups, Woozi, Vernon',
            year: 2020,
            type: 'collaboration',
            members: ['scoups', 'woozi', 'vernon']
        },
        {
            title: 'Bittersweet (與LeeHi合作)',
            artist: 'Wonwoo, Mingyu',
            year: 2021,
            type: 'collaboration',
            members: ['wonwoo', 'mingyu']
        },
        {
            title: 'Spider',
            artist: 'Hoshi',
            year: 2021,
            type: 'solo',
            members: ['hoshi']
        },
        {
            title: 'Ruby',
            artist: 'Woozi',
            year: 2022,
            type: 'solo',
            members: ['woozi']
        },
        {
            title: 'Limbo',
            artist: 'Wonwoo × Mingyu',
            year: 2023,
            type: 'unit',
            members: ['wonwoo', 'mingyu']
        }
    ],

    // 分類標題對應
    categoryTitles: {
        'all': '全部歌曲',
        'chronological': '按發行順序',
        'korean': '韓文歌',
        'japanese': '日語歌',
        'english-chinese': '英文/中文歌',
        'hiphop-team': 'Hip-hop Team',
        'vocal-team': 'Vocal Team',
        'performance-team': 'Performance Team',
        'bss': 'BSS (夫碩順)',
        'jxw': 'JxW (淨漢×圓佑)',
        'hxw': 'HxW (HOSHI×WOOZI)',
        'leaders': 'SVT Leaders',
        '95line': '💎95 Line',
        '96line': '💎96 Line',
        '97line': '💎97 Line',
        'maknae-line': '💎忙內 Line',
        'random-units': '隨機組合',
        'solo-ost': '個人作品/OST',
        'collaborations': '合作歌曲'
    },

    // 獲取分類歌曲
    getCategorySongs: function(category, allSongs) {
        switch (category) {
            case 'all':
                return allSongs;
            
            case 'chronological':
                return [...allSongs].sort((a, b) => {
                    if (a.year !== b.year) return a.year - b.year;
                    return a.title.localeCompare(b.title);
                });
            
            case 'korean':
                return allSongs.filter(song => song.language === 'korean');
            
            case 'japanese':
                return allSongs.filter(song => song.language === 'japanese');
            
            case 'english-chinese':
                return allSongs.filter(song => 
                    song.language === 'english' || song.language === 'chinese'
                );
            
            case 'hiphop-team':
            case 'vocal-team':
            case 'performance-team':
            case 'bss':
            case 'jxw':
            case 'hxw':
                const unitSongs = this.officialUnits[category] || [];
                return allSongs.filter(song => 
                    unitSongs.some(unitSong => unitSong.title === song.title)
                );
            
            case 'leaders':
            case '95line':
            case '96line':
            case '97line':
            case 'maknae-line':
                const ageLineSongs = this.ageLineUnits[category] || [];
                return allSongs.filter(song => 
                    ageLineSongs.some(ageLineSong => ageLineSong.title === song.title)
                );
            
            case 'random-units':
                return allSongs.filter(song => 
                    this.randomUnits.some(randomUnit => randomUnit.title === song.title)
                );
            
            case 'solo-ost':
                return allSongs.filter(song => 
                    this.soloAndCollaborations.some(solo => 
                        solo.title === song.title && (solo.type === 'solo' || solo.type === 'ost')
                    )
                );
            
            case 'collaborations':
                return allSongs.filter(song => 
                    this.soloAndCollaborations.some(collab => 
                        collab.title === song.title && collab.type === 'collaboration'
                    )
                );
            
            default:
                return allSongs;
        }
    },

    // 獲取歌曲詳細資訊
    getSongDetails: function(songTitle) {
        // 檢查正式小分隊
        for (const [unitType, songs] of Object.entries(this.officialUnits)) {
            const found = songs.find(song => song.title === songTitle);
            if (found) {
                return {
                    ...found,
                    unitType: unitType,
                    memberNames: found.members.map(memberId => this.members[memberId].name)
                };
            }
        }

        // 檢查年齡線小分隊
        for (const [ageLineType, songs] of Object.entries(this.ageLineUnits)) {
            const found = songs.find(song => song.title === songTitle);
            if (found) {
                return {
                    ...found,
                    unitType: ageLineType,
                    memberNames: found.members.map(memberId => this.members[memberId].name)
                };
            }
        }

        // 檢查隨機組合
        const randomUnit = this.randomUnits.find(unit => unit.title === songTitle);
        if (randomUnit) {
            return {
                ...randomUnit,
                unitType: 'random',
                memberNames: randomUnit.members.map(memberId => this.members[memberId].name)
            };
        }

        // 檢查個人作品/合作
        const soloCollab = this.soloAndCollaborations.find(item => item.title === songTitle);
        if (soloCollab) {
            return {
                ...soloCollab,
                unitType: soloCollab.type,
                memberNames: soloCollab.members ? soloCollab.members.map(memberId => this.members[memberId].name) : []
            };
        }

        return null;
    }
};

// 匯出給其他檔案使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SONG_CATEGORIES;
} 