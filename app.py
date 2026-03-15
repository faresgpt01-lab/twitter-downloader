import os
import uuid
import string
from flask import Flask, request, jsonify, render_template, send_file
import yt_dlp

app = Flask(__name__)
DOWNLOAD_FOLDER = os.path.join(app.root_path, 'downloads')
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

def safe_filename(filename):
    valid_chars = f"-_.() {string.ascii_letters}{string.digits}"
    cleaned = "".join(c for c in filename if c in valid_chars or ('\u0600' <= c <= '\u06FF'))
    return cleaned.strip() or "twitter_media"

def format_size(bytes_size):
    if not bytes_size: return "غير معروف"
    mb = bytes_size / (1024 * 1024)
    return f"{mb:.1f} MB"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/info', methods=['POST'])
def get_info():
    data = request.json
    url = data.get('url')
    
    if not url:
        return jsonify({'error': 'يرجى إدخال رابط صحيح'}), 400
        
    if 'x.com' in url:
        url = url.replace('x.com', 'twitter.com')
        
    try:
        ydl_opts = {'quiet': True, 'noplaylist': True}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            title = info.get('title', 'فيديو تويتر')
            thumbnail = info.get('thumbnail', '')
            duration = info.get('duration', 0)
            formats_raw = info.get('formats', [])
            
            video_formats = []
            audio_formats = []
            
            for f in formats_raw:
                fmt_id = f.get('format_id')
                ext = f.get('ext')
                vcodec = f.get('vcodec')
                acodec = f.get('acodec')
                height = f.get('height')
                size = f.get('filesize') or f.get('filesize_approx')
                
                if vcodec != 'none' and vcodec is not None:
                    if height:
                        res_str = f"{height}p"
                        fmt_obj = {
                            'format_id': fmt_id,
                            'ext': 'mp4' if 'mp4' in ext else ext,
                            'resolution': res_str,
                            'filesize': format_size(size),
                            'is_video': True
                        }
                        if not any(v['resolution'] == res_str for v in video_formats):
                            video_formats.append(fmt_obj)
                            
                if acodec != 'none' and acodec is not None and (vcodec == 'none' or vcodec is None):
                    fmt_obj = {
                        'format_id': fmt_id,
                        'ext': ext,
                        'resolution': 'صوت فقط',
                        'filesize': format_size(size),
                        'is_video': False
                    }
                    if not any(a['ext'] == ext for a in audio_formats):
                        audio_formats.append(fmt_obj)
            
            if not audio_formats:
                audio_formats.append({
                    'format_id': 'bestaudio/best',
                    'ext': 'mp3',
                    'resolution': 'صوت MP3',
                    'filesize': 'يعتمد على الملف',
                    'is_video': False,
                    'is_extract': True
                })
                
            video_formats.sort(key=lambda x: int(x['resolution'].replace('p', '')) if 'p' in x['resolution'] else 0, reverse=True)
            
            return jsonify({
                'success': True,
                'title': title,
                'thumbnail': thumbnail,
                'duration': duration,
                'video_formats': video_formats,
                'audio_formats': audio_formats
            })
            
    except Exception as e:
        return jsonify({'error': f"فشل في جلب البيانات: {str(e)}"}), 500

@app.route('/api/download', methods=['POST'])
def download():
    data = request.json
    url = data.get('url')
    format_id = data.get('format_id', 'best')
    is_extract = data.get('is_extract', False)
    
    if not url: return jsonify({'error': 'مرر رابط صحيح'}), 400
    if 'x.com' in url: url = url.replace('x.com', 'twitter.com')
        
    try:
        file_id = str(uuid.uuid4())
        
        ydl_opts = {
            'outtmpl': os.path.join(DOWNLOAD_FOLDER, f'{file_id}.%(ext)s'),
            'quiet': True,
            'noplaylist': True,
            'format': format_id
        }
        
        if is_extract:
            ydl_opts['format'] = 'bestaudio/best'
            ydl_opts['postprocessors'] = [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]
            
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # force download=True now
            info = ydl.extract_info(url, download=True)
            
            ext = 'mp3' if is_extract else ('mp4' if info.get('ext') == 'm3u8' else info.get('ext','mp4'))
            downloaded_file = None
            
            for f in os.listdir(DOWNLOAD_FOLDER):
                if f.startswith(file_id):
                    downloaded_file = f
                    ext = f.split('.')[-1]
                    break
                    
            if not downloaded_file:
                return jsonify({'error': 'فشل تحميل الملف.'}), 500
                
            title = safe_filename(info.get('title', 'twitter_video'))
            filename = f"{title}.{ext}"
            
            return jsonify({
                'success': True,
                'download_id': file_id,
                'ext': ext,
                'filename': filename
            })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download_file/<download_id>')
def download_file(download_id):
    ext = request.args.get('ext', 'mp4')
    filename = request.args.get('filename', f'download.{ext}')
    file_path = os.path.join(DOWNLOAD_FOLDER, f'{download_id}.{ext}')
    
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True, download_name=filename)
    return "File not found", 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
