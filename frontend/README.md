# 🌸 Derm-Solution-AI - 맞춤형 스킨 테크 솔루션

## 📌 프로젝트 개요
**Derm-Solution-AI**는 사용자의 안면 이미지를 실시간으로 분석하여 피부 상태를 진단하고, LLM을 통해 개인 맞춤형 화장품 성분 및 관리 솔루션을 제공하는 **프리미엄 AI 뷰티 웹 서비스**입니다. 
(2025 K-Digital Training AI 활용 헬스케어 서비스 해커톤 출품작)

## 🚀 핵심 기술 및 차별점
1. **정밀 안면 분석 (CV)**: `MediaPipe`를 활용하여 이미지 내 얼굴 영역(ROI)만 정밀하게 추출한 뒤, `ResNet18` 딥러닝 모델을 통해 색소침착, 민감도 등의 피부 지표를 수치화합니다.
2. **AI 맞춤형 처방 (LLM)**: `Gemini 2.5 Flash` 모델을 연동하여, 분석된 피부 수치를 바탕으로 사용자의 현재 상태를 진단하고 피해야 할 성분과 추천 제품(스킨, 로션, 선크림)을 제안합니다.
3. **독립적 시연 환경 방어**: 네트워크 환경이 불안정한 해커톤 시연 환경을 대비하여 프론트엔드 자체 `Mock Data` 모드를 지원합니다.

## 🛠 기술 스택
* **Frontend**: React (Vite), Tailwind CSS, Lucide-React, Axios
* **Backend**: FastAPI, Uvicorn, Python-multipart
* **AI & Vision**: PyTorch, Torchvision, MediaPipe, OpenCV, Google Generative AI (Gemini)

## ⚙️ 설치 및 실행 방법

### 1. Clone the repository
git clone [https://github.com/본인계정/Derm-Solution-AI.git]
cd Derm-Solution-AI

2. Backend 환경 세팅
cd backend
# 필수 패키지 설치
pip install -r requirements.txt

# 환경 변수 설정 (.env 파일 생성 후 구글 API 키 입력)
# GOOGLE_API_KEY=AIzaSyBc...

# 서버 실행 (http://localhost:8000)
python -m uvicorn main:app --reload

3. Frontend 환경 세팅
cd frontend
# 패키지 설치
npm install

# 프론트엔드 실행 (http://localhost:5173)
npm run dev