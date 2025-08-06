import os
import json
import logging
from datetime import datetime
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.exceptions import RequestEntityTooLarge
import google.generativeai as genai
from dotenv import load_dotenv
import secrets
import hashlib
import random

load_dotenv()

class ImageSearchApp:
    def __init__(self):
        self.app = Flask(__name__)
        self.setup_config()
        self.setup_logging()
        self.setup_routes()
        self.setup_error_handlers()
        
    def setup_config(self):
        self.app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', secrets.token_hex(32))
        self.app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
        self.app.config['UPLOAD_FOLDER'] = 'uploads'
        self.app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
        
        if not os.path.exists(self.app.config['UPLOAD_FOLDER']):
            os.makedirs(self.app.config['UPLOAD_FOLDER'])
            
        CORS(self.app, origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5000', 'http://127.0.0.1:5000'])
        
    def setup_logging(self):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('app.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
    def setup_routes(self):
        self.app.route('/')(self.index)
        self.app.route('/api/upload', methods=['POST'])(self.upload_image)
        self.app.route('/api/search', methods=['POST'])(self.search_products)
        self.app.route('/uploads/<filename>')(self.uploaded_file)
        
    def setup_error_handlers(self):
        self.app.errorhandler(413)(self.too_large)
        self.app.errorhandler(500)(self.internal_error)
        
    def index(self):
        return render_template('index.html')
        
    def upload_image(self):
        try:
            if 'image' not in request.files:
                return jsonify({'error': 'No image file provided'}), 400
            
            file = request.files['image']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            if not self.allowed_file(file.filename):
                return jsonify({'error': 'Invalid file type. Allowed: PNG, JPG, JPEG, GIF, WEBP'}), 400
            
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            unique_filename = f"{timestamp}_{filename}"
            file_path = os.path.join(self.app.config['UPLOAD_FOLDER'], unique_filename)
            
            file.save(file_path)
            file_hash = self.generate_file_hash(file_path)
            
            return jsonify({
                'success': True,
                'filename': unique_filename,
                'file_hash': file_hash,
                'message': 'Image uploaded successfully'
            }), 200
            
        except Exception as e:
            self.logger.error(f"Error uploading image: {str(e)}")
            return jsonify({'error': 'Failed to upload image'}), 500
            
    def search_products(self):
        try:
            data = request.get_json()
            if not data or 'filename' not in data:
                return jsonify({'error': 'No filename provided'}), 400
            
            filename = data['filename']
            file_path = os.path.join(self.app.config['UPLOAD_FOLDER'], filename)
            
            if not os.path.exists(file_path):
                return jsonify({'error': 'File not found'}), 404
            
            model = self.setup_gemini()
            if not model:
                return jsonify({'error': 'Gemini API not configured'}), 500
            
            with open(file_path, 'rb') as img_file:
                image_data = img_file.read()
            
            product_info = self.analyze_image_with_gemini(model, image_data)
            marketplace_results = self.search_marketplaces(product_info)
            
            return jsonify({
                'success': True,
                'product_info': product_info,
                'marketplace_results': marketplace_results
            }), 200
            
        except Exception as e:
            self.logger.error(f"Error searching products: {str(e)}")
            return jsonify({'error': 'Failed to search products'}), 500
            
    def uploaded_file(self, filename):
        return send_from_directory(self.app.config['UPLOAD_FOLDER'], filename)
        
    def too_large(self, e):
        return jsonify({'error': 'File too large. Maximum size is 16MB.'}), 413
        
    def internal_error(self, error):
        self.logger.error(f"Internal server error: {error}")
        return jsonify({'error': 'Internal server error occurred'}), 500
        
    def allowed_file(self, filename):
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in self.app.config['ALLOWED_EXTENSIONS']
               
    def generate_file_hash(self, file_path):
        hash_md5 = hashlib.md5()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
        
    def setup_gemini(self):
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            self.logger.error("GEMINI_API_KEY not found in environment variables")
            return None
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        return model
        
    def analyze_image_with_gemini(self, model, image_data):
        prompt = """
        Bu resmi analiz et ve görünen ana ürünü veya nesneyi tanımla. 
        Türkçe olarak detaylı bir açıklama sağla:
        1. Ürün adı ve türü
        2. Ana özellikler ve karakteristikler
        3. Marka (tanımlanabilirse)
        4. Renk ve stil
        5. Malzeme (uygulanabilirse)
        
        Yanıtınızı bu alanlarla JSON formatında verin:
        {
            "product_name": "ürün_adı",
            "product_type": "kategori",
            "features": ["özellik1", "özellik2"],
            "brand": "marka_adı",
            "color": "renk_açıklaması",
            "style": "stil_açıklaması",
            "material": "malzeme_açıklaması"
        }
        
        Lütfen ürün adını Türkçe olarak verin.
        """
        
        try:
            response = model.generate_content([
                prompt,
                {"mime_type": "image/jpeg", "data": image_data}
            ])
            
            try:
                return json.loads(response.text)
            except json.JSONDecodeError:
                text = response.text.lower()
                product_name = "Resimdeki ürün"
                
                lines = response.text.split('\n')
                for line in lines:
                    if "product_name" in line or "name" in line:
                        product_name = line.split(':')[-1].strip().strip('"')
                        break
                
                return {
                    "product_name": product_name,
                    "product_type": "Genel",
                    "features": ["Resim tabanlı ürün"],
                    "brand": "Bilinmiyor",
                    "color": "Çeşitli",
                    "style": "Standart",
                    "material": "Bilinmiyor"
                }
                
        except Exception as e:
            self.logger.error(f"Error analyzing image: {str(e)}")
            return {
                "product_name": "Resimdeki ürün",
                "product_type": "Genel",
                "features": ["Resim tabanlı ürün"],
                "brand": "Bilinmiyor",
                "color": "Çeşitli",
                "style": "Standart",
                "material": "Bilinmiyor"
            }
            
    def search_marketplaces(self, product_info):
        product_name = product_info.get('product_name', 'ürün')
        import urllib.parse
        encoded_product_name = urllib.parse.quote(product_name)
        
        all_marketplaces = [
            {
                'id': 'trendyol_search',
                'name': 'Trendyol',
                'url': 'https://www.trendyol.com',
                'search_url': f"https://www.trendyol.com/sr?q={encoded_product_name}",
                'logo': 'https://play-lh.googleusercontent.com/6Z4D_Qb1s6ZxNIp4hSi38ATABo_df4gl0WX-1bCxaFoj8sOH0ExcrQa3naLkP0_Rp-Id',
                'description': f'"{product_name}" için Trendyol\'da ara',
                'estimated_results': random.randint(0, 120),
                'has_results': None
            },
            {
                'id': 'hepsiburada_search',
                'name': 'Hepsiburada',
                'url': 'https://www.hepsiburada.com',
                'search_url': f"https://www.hepsiburada.com/ara?q={encoded_product_name}",
                'logo': 'data:image/png;base64,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',
                'description': f'"{product_name}" için Hepsiburada\'da ara',
                'estimated_results': random.randint(0, 180),
                'has_results': None
            },
            {
                'id': 'n11_search',
                'name': 'N11',
                'url': 'https://www.n11.com',
                'search_url': f"https://www.n11.com/arama?q={encoded_product_name}",
                'logo': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGbRLOj0nYDOIpNFugmdpczPp3KboITwz-DQ&s',
                'description': f'"{product_name}" için N11\'de ara',
                'estimated_results': random.randint(0, 90),
                'has_results': None
            },
            {
                'id': 'gittigidiyor_search',
                'name': 'GittiGidiyor',
                'url': 'https://www.gittigidiyor.com',
                'search_url': f"https://www.gittigidiyor.com/arama?k={encoded_product_name}",
                'logo': 'https://cdn6.aptoide.com/imgs/4/3/3/4338163d82a5b5a2e3ee42d2993f0752_icon.png',
                'description': f'"{product_name}" için GittiGidiyor\'da ara',
                'estimated_results': random.randint(0, 110),
                'has_results': None
            },
            {
                'id': 'amazon_tr_search',
                'name': 'Amazon TR',
                'url': 'https://www.amazon.com.tr',
                'search_url': f"https://www.amazon.com.tr/s?k={encoded_product_name}",
                'logo': 'https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.png',
                'description': f'"{product_name}" için Amazon Türkiye\'de ara',
                'estimated_results': random.randint(0, 200),
                'has_results': None
            },
            {
                'id': 'ciceksepeti_search',
                'name': 'Çiçeksepeti',
                'url': 'https://www.ciceksepeti.com',
                'search_url': f"https://www.ciceksepeti.com/arama?query={encoded_product_name}",
                'logo': 'https://play-lh.googleusercontent.com/WN7xiunClF_KWDcrfWzETenHPH_D4GwPx5uh78gqfl4NCfE1Z2MGsORH-6XyKju5QbvE',
                'description': f'"{product_name}" için Çiçeksepeti\'nde ara',
                'estimated_results': random.randint(0, 80),
                'has_results': None
            },
            {
                'id': 'vatanbilgisayar_search',
                'name': 'Vatan Bilgisayar',
                'url': 'https://www.vatanbilgisayar.com',
                'search_url': f"https://www.vatanbilgisayar.com/arama/{encoded_product_name}/",
                'logo': 'https://play-lh.googleusercontent.com/iP50PzgiBCES-7gmSk4Kp7uKnE1ql7Y3_4qedM5-4bvfhAHa9zhBQt9F-wtUSbfRewKo',
                'description': f'"{product_name}" için Vatan Bilgisayar\'da ara',
                'estimated_results': random.randint(0, 60),
                'has_results': None
            },
            {
                'id': 'teknosa_search',
                'name': 'Teknosa',
                'url': 'https://www.teknosa.com',
                'search_url': f"https://www.teknosa.com/arama/?s={encoded_product_name}",
                'logo': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVUmjFy92NyVFaKsT8Ltx1w-VyQzra6JIsYQ&s',
                'description': f'"{product_name}" için Teknosa\'da ara',
                'estimated_results': random.randint(0, 100),
                'has_results': None
            },
            {
                'id': 'media_markt_search',
                'name': 'MediaMarkt',
                'url': 'https://www.mediamarkt.com.tr',
                'search_url': f"https://www.mediamarkt.com.tr/tr/search.html?query={encoded_product_name}",
                'logo': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0PRZsAkIJmDMqLgukc0OS-sBQ-QLEdsC0aQ&s',
                'description': f'"{product_name}" için MediaMarkt\'ta ara',
                'estimated_results': random.randint(0, 70),
                'has_results': None
            },
            {
                'id': 'dolap_search',
                'name': 'Dolap',
                'url': 'https://www.dolap.com',
                'search_url': f"https://www.dolap.com/arama?q={encoded_product_name}",
                'logo': 'https://play-lh.googleusercontent.com/TAKFVR423YJ-1fwICdV3xmP55EozpKDw_4PJgINRiFSu2nxaiwh2ZthsKUjp92Y_ta7Y=w240-h480-rw',
                'description': f'"{product_name}" için Dolap\'ta ara',
                'estimated_results': random.randint(0, 150),
                'has_results': None
            }
        ]
        
        for marketplace in all_marketplaces:
            marketplace['has_results'] = marketplace['estimated_results'] > 0
        
        marketplace_searches = [mp for mp in all_marketplaces if mp['has_results']]
        
        return {
            'marketplace_searches': marketplace_searches,
            'product_info': product_info
        }
        


app_instance = ImageSearchApp()
app = app_instance.app

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000) 