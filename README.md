# Rangmod
1. pip install torch transformers fastapi uvicorn requests accelerate
2. ไปที่ terminal รัน : ./download_model.sh หรือ https://drive.google.com/file/d/1l5jHuk_mVnd3u70UB8q4thgLn10p2KEp/view?usp=sharing สร้างโฟลเดอร์ models (โฟลเดอร์อยุ่ะดับเดียวกับ src)  และใส่ในโฟลเดอร์นั้น
3. ใส่ mongodb_url ในไฟล์ .env 
4. ติดตั้ง ollama https://ollama.com/
5. ไปที่ terminal อันที่1 รัน : uvicorn src.app.api.main:app --reload
6. ไปที่ terminal อันที่2 รัน : npm run dev
7. ไปที่ cmd รัน : ollama serve
