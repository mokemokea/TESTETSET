from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import json
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # セッション用の秘密鍵

# JSONファイルのパス
POSTS_FILE = 'posts.json'

# JSONファイルの初期化
def init_posts_file():
    """posts.jsonファイルが存在しない場合は作成"""
    if not os.path.exists(POSTS_FILE):
        with open(POSTS_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=2)

# 投稿データの読み込み
def load_posts():
    """JSONファイルから投稿データを読み込む"""
    try:
        with open(POSTS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

# 投稿データの保存
def save_posts(posts):
    """投稿データをJSONファイルに保存"""
    with open(POSTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)

# 新しいIDを生成
def get_next_id(posts):
    """投稿リストから次のIDを生成"""
    if not posts:
        return 1
    return max(post['id'] for post in posts) + 1

# メインページ（投稿一覧）
@app.route('/')
def index():
    """投稿一覧を表示"""
    posts = load_posts()
    # 新しい投稿が上に来るように逆順にソート
    posts.sort(key=lambda x: x['created_at'], reverse=True)
    return render_template('index.html', posts=posts)

# 新規投稿ページ
@app.route('/create', methods=['GET', 'POST'])
def create():
    """新規投稿の作成"""
    if request.method == 'POST':
        title = request.form.get('title', '').strip()
        content = request.form.get('content', '').strip()
        author = request.form.get('author', '').strip()
        
        # バリデーション
        if not title or not content or not author:
            flash('タイトル、内容、投稿者名は必須です', 'error')
            return render_template('create.html')
        
        # 新しい投稿を作成
        posts = load_posts()
        new_post = {
            'id': get_next_id(posts),
            'title': title,
            'content': content,
            'author': author,
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        
        posts.append(new_post)
        save_posts(posts)
        
        flash('投稿が作成されました', 'success')
        return redirect(url_for('index'))
    
    return render_template('create.html')

# 投稿編集ページ
@app.route('/edit/<int:post_id>', methods=['GET', 'POST'])
def edit(post_id):
    """投稿の編集"""
    posts = load_posts()
    post = next((p for p in posts if p['id'] == post_id), None)
    
    if not post:
        flash('投稿が見つかりません', 'error')
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        title = request.form.get('title', '').strip()
        content = request.form.get('content', '').strip()
        author = request.form.get('author', '').strip()
        
        # バリデーション
        if not title or not content or not author:
            flash('タイトル、内容、投稿者名は必須です', 'error')
            return render_template('edit.html', post=post)
        
        # 投稿を更新
        post['title'] = title
        post['content'] = content
        post['author'] = author
        post['updated_at'] = datetime.now().isoformat()
        
        save_posts(posts)
        
        flash('投稿が更新されました', 'success')
        return redirect(url_for('index'))
    
    return render_template('edit.html', post=post)

# 投稿削除
@app.route('/delete/<int:post_id>', methods=['POST'])
def delete(post_id):
    """投稿の削除"""
    posts = load_posts()
    posts = [p for p in posts if p['id'] != post_id]
    save_posts(posts)
    
    flash('投稿が削除されました', 'success')
    return redirect(url_for('index'))

# エラーハンドラー
@app.errorhandler(404)
def not_found(error):
    """404エラーハンドラー"""
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    """500エラーハンドラー"""
    return render_template('500.html'), 500

if __name__ == '__main__':
    # アプリケーション起動時にJSONファイルを初期化
    init_posts_file()
    # デバッグモードで起動（ポート8080を使用）
    app.run(debug=True, host='0.0.0.0', port=8080)

# Made with Bob
