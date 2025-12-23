// ========================================
// 削除確認ダイアログ
// ========================================
function confirmDelete() {
    return confirm('この投稿を削除してもよろしいですか？\nこの操作は取り消せません。');
}

// ========================================
// フラッシュメッセージの自動非表示
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // フラッシュメッセージを3秒後に自動的にフェードアウト
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
        setTimeout(function() {
            alert.style.transition = 'opacity 0.5s ease-out';
            alert.style.opacity = '0';
            setTimeout(function() {
                alert.remove();
            }, 500);
        }, 3000);
    });
});

// ========================================
// フォームバリデーション
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('.post-form');
    
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            const title = form.querySelector('#title');
            const content = form.querySelector('#content');
            const author = form.querySelector('#author');
            
            let isValid = true;
            let errorMessage = '';
            
            // タイトルのバリデーション
            if (title && title.value.trim() === '') {
                isValid = false;
                errorMessage += 'タイトルを入力してください。\n';
            }
            
            // 投稿者名のバリデーション
            if (author && author.value.trim() === '') {
                isValid = false;
                errorMessage += '投稿者名を入力してください。\n';
            }
            
            // 内容のバリデーション
            if (content && content.value.trim() === '') {
                isValid = false;
                errorMessage += '内容を入力してください。\n';
            }
            
            if (!isValid) {
                e.preventDefault();
                alert(errorMessage);
            }
        });
    });
});

// ========================================
// スムーズスクロール
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // ページ読み込み時に一番上にスクロール
    window.scrollTo(0, 0);
});

// ========================================
// 文字数カウンター（オプション機能）
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const titleInput = document.querySelector('#title');
    const contentTextarea = document.querySelector('#content');
    
    // タイトルの文字数カウンター
    if (titleInput) {
        const titleCounter = document.createElement('div');
        titleCounter.className = 'char-counter';
        titleCounter.style.cssText = 'text-align: right; color: #666; font-size: 0.85rem; margin-top: 0.25rem;';
        titleInput.parentNode.appendChild(titleCounter);
        
        function updateTitleCounter() {
            const length = titleInput.value.length;
            const maxLength = titleInput.getAttribute('maxlength') || 100;
            titleCounter.textContent = `${length} / ${maxLength} 文字`;
            
            if (length > maxLength * 0.9) {
                titleCounter.style.color = '#dc3545';
            } else {
                titleCounter.style.color = '#666';
            }
        }
        
        titleInput.addEventListener('input', updateTitleCounter);
        updateTitleCounter();
    }
    
    // 内容の文字数カウンター
    if (contentTextarea) {
        const contentCounter = document.createElement('div');
        contentCounter.className = 'char-counter';
        contentCounter.style.cssText = 'text-align: right; color: #666; font-size: 0.85rem; margin-top: 0.25rem;';
        contentTextarea.parentNode.appendChild(contentCounter);
        
        function updateContentCounter() {
            const length = contentTextarea.value.length;
            contentCounter.textContent = `${length} 文字`;
        }
        
        contentTextarea.addEventListener('input', updateContentCounter);
        updateContentCounter();
    }
});

// ========================================
// キーボードショートカット
// ========================================
document.addEventListener('keydown', function(e) {
    // Ctrl+Enter または Cmd+Enter でフォーム送信
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const form = document.querySelector('.post-form');
        if (form) {
            form.submit();
        }
    }
});

// ========================================
// アニメーション効果
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // 投稿カードのフェードインアニメーション
    const postCards = document.querySelectorAll('.post-card');
    postCards.forEach(function(card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(function() {
            card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// ========================================
// ローカルストレージでフォームの下書き保存（オプション）
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.post-form');
    
    if (form && window.location.pathname === '/create') {
        const titleInput = form.querySelector('#title');
        const contentTextarea = form.querySelector('#content');
        const authorInput = form.querySelector('#author');
        
        // 下書きの読み込み
        if (titleInput && localStorage.getItem('draft_title')) {
            titleInput.value = localStorage.getItem('draft_title');
        }
        if (contentTextarea && localStorage.getItem('draft_content')) {
            contentTextarea.value = localStorage.getItem('draft_content');
        }
        if (authorInput && localStorage.getItem('draft_author')) {
            authorInput.value = localStorage.getItem('draft_author');
        }
        
        // 下書きの保存
        function saveDraft() {
            if (titleInput) localStorage.setItem('draft_title', titleInput.value);
            if (contentTextarea) localStorage.setItem('draft_content', contentTextarea.value);
            if (authorInput) localStorage.setItem('draft_author', authorInput.value);
        }
        
        if (titleInput) titleInput.addEventListener('input', saveDraft);
        if (contentTextarea) contentTextarea.addEventListener('input', saveDraft);
        if (authorInput) authorInput.addEventListener('input', saveDraft);
        
        // フォーム送信時に下書きをクリア
        form.addEventListener('submit', function() {
            localStorage.removeItem('draft_title');
            localStorage.removeItem('draft_content');
            localStorage.removeItem('draft_author');
        });
    }
});

console.log('📝 掲示板アプリケーションが読み込まれました');

// Made with Bob
