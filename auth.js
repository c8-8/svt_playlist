// 認證系統
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('svt_users') || '{}');
        this.currentUser = JSON.parse(localStorage.getItem('svt_current_user') || 'null');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // 表單切換
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });

        // 表單提交
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // 訪客模式
        document.getElementById('guestBtn').addEventListener('click', () => {
            this.handleGuestMode();
        });

        // 檢查是否已登入
        this.checkAutoLogin();
    }

    showRegisterForm() {
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('registerForm').classList.add('active');
    }

    showLoginForm() {
        document.getElementById('registerForm').classList.remove('active');
        document.getElementById('loginForm').classList.add('active');
    }

    async handleLogin() {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        if (!username || !password) {
            this.showNotification('請填寫所有欄位', 'error');
            return;
        }

        // 模擬登入驗證
        if (this.users[username] && this.users[username].password === password) {
            this.showLoading();
            
            // 模擬網路延遲
            setTimeout(() => {
                const user = {
                    username: username,
                    email: this.users[username].email,
                    bias: this.users[username].bias,
                    loginTime: new Date().toISOString()
                };

                this.currentUser = user;
                localStorage.setItem('svt_current_user', JSON.stringify(user));
                
                if (rememberMe) {
                    localStorage.setItem('svt_remember_user', username);
                }

                this.hideLoading();
                this.showNotification(`歡迎回來，${username}！`, 'success');
                
                // 跳轉到主頁面
                setTimeout(() => {
                    window.location.href = 'main.html';
                }, 1500);
            }, 1000);
        } else {
            this.showNotification('使用者名稱或密碼錯誤', 'error');
        }
    }

    async handleRegister() {
        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const bias = document.getElementById('biasSelect').value;

        // 驗證輸入
        if (!username || !email || !password || !confirmPassword) {
            this.showNotification('請填寫所有欄位', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('密碼確認不符', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('密碼至少需要6個字元', 'error');
            return;
        }

        if (this.users[username]) {
            this.showNotification('使用者名稱已存在', 'error');
            return;
        }

        this.showLoading();

        // 模擬註冊過程
        setTimeout(() => {
            // 儲存新用戶
            this.users[username] = {
                email: email,
                password: password,
                bias: bias,
                registerTime: new Date().toISOString(),
                rankings: {}
            };

            localStorage.setItem('svt_users', JSON.stringify(this.users));

            // 自動登入
            const user = {
                username: username,
                email: email,
                bias: bias,
                loginTime: new Date().toISOString()
            };

            this.currentUser = user;
            localStorage.setItem('svt_current_user', JSON.stringify(user));

            this.hideLoading();
            this.showNotification(`註冊成功！歡迎加入，${username}！`, 'success');

            // 跳轉到主頁面
            setTimeout(() => {
                window.location.href = 'main.html';
            }, 1500);
        }, 1500);
    }

    handleGuestMode() {
        this.showLoading();
        
        setTimeout(() => {
            // 設置訪客用戶
            const guestUser = {
                username: 'Guest',
                email: '',
                bias: '',
                isGuest: true,
                loginTime: new Date().toISOString()
            };

            this.currentUser = guestUser;
            sessionStorage.setItem('svt_guest_user', JSON.stringify(guestUser));

            this.hideLoading();
            this.showNotification('以訪客模式進入', 'info');

            // 跳轉到主頁面
            setTimeout(() => {
                window.location.href = 'main.html';
            }, 1000);
        }, 500);
    }

    checkAutoLogin() {
        const rememberedUser = localStorage.getItem('svt_remember_user');
        if (rememberedUser && this.users[rememberedUser]) {
            document.getElementById('loginUsername').value = rememberedUser;
            document.getElementById('rememberMe').checked = true;
        }
    }

    showLoading() {
        document.getElementById('loadingOverlay').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }

    showNotification(message, type = 'info') {
        // 移除現有通知
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 創建新通知
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // 樣式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        `;

        // 根據類型設置背景色
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
                break;
            case 'info':
                notification.style.background = 'linear-gradient(135deg, #2196F3, #1976D2)';
                break;
        }

        document.body.appendChild(notification);
        
        // 3秒後自動移除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // 獲取當前用戶
    getCurrentUser() {
        return this.currentUser;
    }

    // 登出
    logout() {
        this.currentUser = null;
        localStorage.removeItem('svt_current_user');
        sessionStorage.removeItem('svt_guest_user');
        localStorage.removeItem('svt_remember_user');
        window.location.href = 'login.html';
    }

    // 保存用戶排名
    saveUserRanking(rankings) {
        if (this.currentUser && !this.currentUser.isGuest) {
            const username = this.currentUser.username;
            if (this.users[username]) {
                this.users[username].rankings = rankings;
                this.users[username].lastUpdate = new Date().toISOString();
                localStorage.setItem('svt_users', JSON.stringify(this.users));
            }
        }
    }

    // 載入用戶排名
    loadUserRanking() {
        if (this.currentUser && !this.currentUser.isGuest) {
            const username = this.currentUser.username;
            if (this.users[username] && this.users[username].rankings) {
                return this.users[username].rankings;
            }
        }
        return null;
    }
}

// 初始化認證系統
const authSystem = new AuthSystem();

// 添加滑入動畫的CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 