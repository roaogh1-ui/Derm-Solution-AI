const API_BASE_URL = "http://localhost:8000"; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Camera, Search, Sparkles, ShoppingCart, AlertCircle,
  User, Users, Target, Zap, ShieldCheck, TrendingUp, TrendingDown, Award, Lock, Beaker,
  ShoppingBag, Star, ExternalLink, Bot, Lightbulb, Sun, Moon, Coffee, Droplets, Apple, Shield, Eye, EyeOff, UserPlus
} from 'lucide-react';

const USE_MOCK = false; 

const MOCK_DATA = {
  score: 138.94,
  status: "주의",
  status_color: "#ffa500",
  ingredient: "트라넥사믹애씨드",
  message: "현재 피부 장벽이 민감해진 상태로 세심한 보호가 최우선입니다. 자외선 차단에 유의하시고 추천해 드린 성분이 포함된 기초 제품으로 피부 장벽을 튼튼하게 관리하시길 권장합니다.",
  products: [
    { name: "구달 청귤 비타C 맑은 토너", brand: "구달 (goodal)", rating: 4.7, price: "22,000원", ingredients: ["청귤추출물", "나이아신아마이드"], match: 94 },
    { name: "라운드랩 자작나무 수분 선크림", brand: "라운드랩 (ROUND LAB)", rating: 4.8, price: "25,000원", ingredients: ["히알루론산", "자작나무수액"], match: 95 }
  ]
};

const ScoreCard = ({ score, title, result }) => {
  const safeScore = typeof score === 'number' ? score : 0;
  const statusColor = result.status_color || '#cccccc';
  const statusLabel = result.status || '대기중';
  const getGradient = (status) => {
    if (status === "심각") return "linear-gradient(135deg, #fff5f5 0%, #fff 100%)";
    if (status === "주의") return "linear-gradient(135deg, #fffaf0 0%, #fff 100%)";
    return "linear-gradient(135deg, #f0fff4 0%, #fff 100%)";
  };
  return (
    <div style={{ padding: '20px', borderRadius: '16px', background: getGradient(statusLabel), border: `2px solid ${statusColor}20`, boxShadow: '0 8px 20px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden', height: 'auto', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Sparkles size={18} color={statusColor} fill={statusColor} /><h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>{title}</h3></div>
        <div style={{ padding: '4px 10px', borderRadius: '15px', backgroundColor: statusColor, color: '#fff', fontSize: '0.75rem', fontWeight: 'bold' }}>{statusLabel}</div>
      </div>
      <div style={{ fontSize: '2.4rem', fontWeight: '900', color: statusColor, letterSpacing: '-2px', lineHeight: 1 }}>{safeScore.toFixed(2)}</div>
      <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '5px' }}>색소침착 지수</div>
      <p style={{ fontSize: '0.85rem', color: '#555', marginTop: '10px', lineHeight: 1.4, margin: 0 }}>전문 관리가 권장되는 단계입니다.</p>
    </div>
  );
};

const ProgressChart = ({ result }) => {
  const safeScore = typeof result.score === 'number' ? result.score : 0;
  const getStatus = (val) => val >= 150 ? "critical" : val >= 70 ? "warning" : "good";
  const progressData = [
    { label: "색소침착", current: safeScore, max: 250, status: getStatus(safeScore) },
    { label: "수분도", current: 85, max: 100, status: "good" },
    { label: "탄력도", current: 72, max: 100, status: "good" }
  ];
  const getStatusConfig = (s) => s === "critical" ? { bg: "#fee2e2", bar: "#dc2626", text: "#b91c1c" } : s === "warning" ? { bg: "#ffedd5", bar: "#ea580c", text: "#c2410c" } : { bg: "#dcfce7", bar: "#16a34a", text: "#15803d" };
  return (
    <div style={{ padding: '20px', borderRadius: '16px', border: '1px solid #e9d5ff', background: '#fff', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 15px 0' }}><Award size={18} color="#a855f7" /> 종합 지표</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap:'8px'}}>
        {progressData.map((item, index) => (
          <div key={index}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '3px' }}><span>{item.label}</span><span style={{ fontWeight: 'bold', color: getStatusConfig(item.status).text }}>{item.current}</span></div>
            <div style={{ height: '8px', backgroundColor: getStatusConfig(item.status).bg, borderRadius: '4px', overflow: 'hidden' }}><div style={{ height: '8px', background: getStatusConfig(item.status).bar, width: `${(item.current / item.max) * 100}%`, transition: '1s', borderRadius: '4px' }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const IngredientCard = ({ ingredients, skinType, onButtonClick }) => {
  return (
    <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', height: 'auto', minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexShrink: 0 }}>
        <div style={{ padding: '8px', backgroundColor: '#f0f4ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Beaker size={24} color="#4d61ff" /></div>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, color: '#1a1a1a' }}>추천 성분</h3>
          <p style={{ fontSize: '0.85rem', color: '#888', margin: 0 }}>피부타입: {skinType}</p>
        </div>
      </div>
      <div className="custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
        {ingredients.map((ingredient, index) => (
          <div key={index} style={{ padding: '16px', borderRadius: '16px', background: 'linear-gradient(90deg, #f8faff 0%, #fcfaff 100%)', border: '1px solid #eef2ff' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: '#333' }}>{ingredient.name}</h4>
              <span style={{ padding: '4px 10px', backgroundColor: '#eef2ff', color: '#4d61ff', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>{ingredient.category}</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', lineHeight: 1.5 }}>{ingredient.effectiveness}</p>
          </div>
        ))}
      </div>
      <button onClick={onButtonClick} style={{ width: '100%', padding: '14px', background: 'linear-gradient(90deg, #4d61ff 0%, #9333ea 100%)', color: '#fff', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexShrink: 0 }}>
        추천 제품 보기 <ExternalLink size={18} />
      </button>
    </div>
  );
};

const ProductRecommendation = ({ products = [] }) => {
  const handleProductClick = (productName) => { window.open(`https://www.oliveyoung.co.kr/store/search/getSearchMain.do?query=${productName}`); };

  return (
    <div style={{ padding: '16px', borderRadius: '16px', border: '2px solid #bfdbfe', background: 'linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', height: 'auto', boxSizing: 'border-box', minHeight: '350px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexShrink: 0 }}><div style={{ padding: '8px', background: '#3b82f6', borderRadius: '10px' }}><ShoppingBag size={24} color="white" /></div><h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>AI 추천 제품</h3></div>
      <div className="custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
        {products && products.length > 0 ? products.map((product, index) => (
          <div key={index} style={{ padding: '12px', borderRadius: '16px', backgroundColor: '#fff', border: '2px solid #dbeafe', transition: 'all 0.3s', marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: '#1a1a1a' }}>{product.name || product}</h4>
                  {product.match && <span style={{ padding: '2px 8px', background: 'linear-gradient(90deg, #ec4899 0%, #f43f5e 100%)', color: '#fff', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>{product.match}% 매칭</span>}
                </div>
                {product.brand && <p style={{ margin: '0 0 6px 0', fontSize: '0.8rem', color: '#64748b' }}>{product.brand}</p>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  {product.rating && <><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={14} fill="#facc15" color="#facc15" /><span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#334155' }}>{product.rating}</span></div><span style={{ color: '#cbd5e1' }}>•</span></>}
                  {product.price && <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#2563eb' }}>{product.price}</span>}
                </div>
              </div>
            </div>
            {product.ingredients && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {product.ingredients.map((ingredient, idx) => (
                  <span key={idx} style={{ padding: '4px 8px', backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '500' }}>{ingredient}</span>
                ))}
              </div>
            )}
            <button onClick={() => handleProductClick(product.name || product)} style={{ width: '100%', padding: '8px', background: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              올리브영 검색 <ExternalLink size={14} />
            </button>
          </div>
        )) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
            현재 AI가 피부 상태에 맞는 추천 제품을 분석 중입니다.
          </div>
        )}
      </div>
    </div>
  );
};

const AIAdviceCard = ({ advice = [], summary = "" }) => {
  return (
    <div style={{ padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', height: 'auto', boxSizing: 'border-box', minHeight: '350px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexShrink: 0 }}><div style={{ padding: '8px', background: 'linear-gradient(135deg, #6366f1 0%, #9333ea 100%)', borderRadius: '8px' }}><Bot size={24} color="white" /></div><div><h3 style={{ fontSize: '1.2rem', margin: 0, color: '#1a1a1a', fontWeight: 'bold' }}>AI 맞춤 케어 가이드</h3><p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>전문가 수준의 피부 관리 솔루션</p></div></div>
      <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '12px', border: '1px solid #e0e7ff', flexShrink: 0 }}><p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: '#334155', margin: 0, fontWeight: '500' }}>{summary}<span style={{ color: '#6366f1', fontWeight: 'bold', animation: 'blink 1s step-end infinite' }}>|</span></p></div>
      <div className="custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}><Lightbulb size={16} color="#ca8a04" /><span>추천 케어 루틴</span></div>
        {advice.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>
            <div style={{ flexShrink: 0, width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #9333ea 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', marginTop: '2px' }}>{index + 1}</div>
            <p style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.5, flex: 1, margin: 0 }}>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const DailyTips = () => {
  const tips = [
    { icon: Sun, time: "아침", title: "자외선 차단", description: "SPF 50+ 선크림 사용", bg: "linear-gradient(135deg, #facc15 0%, #fb923c 100%)" },
    { icon: Coffee, time: "오전", title: "수분 섭취", description: "물 2L 이상 마시기", bg: "linear-gradient(135deg, #60a5fa 0%, #22d3ee 100%)" },
    { icon: Apple, time: "점심", title: "항산화 식단", description: "비타민C 채소 섭취", bg: "linear-gradient(135deg, #4ade80 0%, #34d399 100%)" },
    { icon: Droplets, time: "오후", title: "보습 케어", description: "미스트 수분 보충", bg: "linear-gradient(135deg, #2dd4bf 0%, #60a5fa 100%)" },
    { icon: Moon, time: "저녁", title: "이중 세안", description: "오일+폼 깨끗하게", bg: "linear-gradient(135deg, #818cf8 0%, #c084fc 100%)" },
    { icon: Shield, time: "야간", title: "집중 관리", description: "나이트 세럼 재생", bg: "linear-gradient(135deg, #c084fc 0%, #f472b6 100%)" }
  ];
  return (
    <div style={{ padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', border: '2px solid #bbf7d0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', height: 'auto', boxSizing: 'border-box', minHeight: 0 }}>
      <div style={{ marginBottom: '12px', flexShrink: 0 }}><h3 style={{ fontSize: '1.1rem', margin: '0 0 4px 0', color: '#1a1a1a', fontWeight: 'bold' }}>오늘의 케어 루틴</h3><p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>시간대별 맞춤 피부 관리 가이드</p></div>
      <div className="custom-scrollbar" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', flex: 1, overflowY: 'auto', paddingRight: '4px', alignContent: 'start' }}>
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div key={index} style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#fff', border: '1px solid #dcfce7', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ padding: '8px', background: tip.bg, borderRadius: '8px' }}><Icon size={16} color="white" /></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '2px' }}>{tip.time}</div><h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', margin: '0 0 2px 0', color: '#1a1a1a' }}>{tip.title}</h4><p style={{ fontSize: '0.7rem', color: '#334155', lineHeight: 1.4, margin: 0 }}>{tip.description}</p></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // 로그인한 유저 정보 저장
  const [isSignupMode, setIsSignupMode] = useState(false); // 회원가입 모드 전환

  // 1. 더미 데이터 (초기 회원 목록)
  const [users, setUsers] = useState([
    { id: 'admin', pw: '1234', name: '심사위원' },
    { id: 'test', pw: '0000', name: '테스트유저' }
  ]);

  // 로그인 상태
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [showPw, setShowPw] = useState(false);

  // 회원가입 상태
  const [signupId, setSignupId] = useState('');
  const [signupPw, setSignupPw] = useState('');
  const [signupName, setSignupName] = useState('');

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState("");

  // 2. 로그인 처리 (더미 데이터 검증)
  const handleLogin = (e) => { 
    if (e) e.preventDefault(); 
    
    if(!userId || !userPw) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    const foundUser = users.find(u => u.id === userId && u.pw === userPw);
    if (foundUser) {
      setCurrentUser(foundUser);
      setIsLoggedIn(true);
    } else {
      alert("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  // 3. 회원가입 처리
  const handleSignup = (e) => {
    if (e) e.preventDefault();

    if(!signupId || !signupPw || !signupName) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const isDuplicate = users.some(u => u.id === signupId);
    if (isDuplicate) {
      alert("이미 존재하는 아이디입니다.");
      return;
    }

    // 새 유저 추가
    setUsers([...users, { id: signupId, pw: signupPw, name: signupName }]);
    alert("회원가입이 완료되었습니다! 로그인해주세요.");
    
    // 폼 초기화 및 로그인 화면으로 전환
    setSignupId('');
    setSignupPw('');
    setSignupName('');
    setIsSignupMode(false);
  };
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  useEffect(() => {
    if (result && result.message && !result.error) {
      setDisplayedMessage(""); 
      let i = 0; 
      let currentText = ""; 
      const messageToType = result.message; 
      const timer = setInterval(() => { 
        if (i < messageToType.length) { 
          currentText += messageToType.charAt(i); 
          setDisplayedMessage(currentText);       
          i++; 
        } else { 
          clearInterval(timer); 
        } 
      }, 30); 
      return () => clearInterval(timer);
    }
  }, [result]);

  const handleUpload = async () => {
    if (!file) return; setLoading(true); setResult(null);
    setTimeout(async () => {
      if (USE_MOCK) { setResult(MOCK_DATA); setLoading(false); } else {
        const formData = new FormData(); formData.append('file', file);
        try { const res = await axios.post(`${API_BASE_URL}/analyze`, formData); setResult(res.data); setLoading(false); } 
        catch (err) { console.error(err); setLoading(false); setResult({ error: "서버와 연결할 수 없습니다. 백엔드(FastAPI)가 켜져 있는지 확인해주세요." }); }
      }
    }, 2000);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', width: '100%', margin: 0, padding: 0, background: 'linear-gradient(135deg, #fff5f8 0%, #f0f4ff 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative', fontFamily: '"Pretendard", sans-serif' }}>
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: '300px', height: '300px', background: 'rgba(255, 77, 148, 0.07)', borderRadius: '50%', filter: 'blur(60px)' }} />
        
        <div style={{ position: 'absolute', top: '30px', left: '30px', textAlign: 'left', zIndex: 11 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0, color: '#1a1a1a' }}>AI 피부 분석 리포트</h1>
          <p style={{ fontSize: '0.8rem', color: '#555', margin: 0, fontWeight: '500' }}>ResNet18 모델 기반 실시간 진단</p>
        </div>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(15px)', padding: '50px 45px', borderRadius: '16px', boxShadow: '0 25px 60px -15px rgba(255, 77, 148, 0.15)', width: '90%', maxWidth: '420px', textAlign: 'center', zIndex: 10, border: '1px solid rgba(255, 255, 255, 0.6)', boxSizing: 'border-box' }}>
          
          <div style={{ width: '75px', height: '75px', backgroundColor: '#ff4d94', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', boxShadow: '0 10px 25px rgba(255, 77, 148, 0.3)' }}>
            {isSignupMode ? <UserPlus size={38} color="white" /> : <Sparkles size={38} color="white" fill="white" />}
          </div>
          <h2 style={{ color: '#1a1a1a', fontSize: '1.9rem', fontWeight: '900', margin: '0 0 12px 0' }}>{isSignupMode ? 'Join Us' : 'Skin AI Specialist'}</h2>
          <p style={{ color: '#888', fontSize: '1rem', marginBottom: '35px' }}>{isSignupMode ? '새로운 계정을 만들어보세요' : '당신만을 위한 정밀 피부 진단 솔루션'}</p>
          
          {!isSignupMode ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ position: 'relative' }}><input type="text" placeholder="아이디 (ex: admin)" value={userId} onChange={(e) => setUserId(e.target.value)} style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '14px', border: '1px solid #eee', outline: 'none', boxSizing: 'border-box', fontSize: '1rem', backgroundColor: '#fff', color: '#1a1a1a' }} /><User size={20} color="#bbb" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} /></div>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? "text" : "password"} placeholder="비밀번호 (ex: 1234)" value={userPw} onChange={(e) => setUserPw(e.target.value)} style={{ width: '100%', padding: '16px 48px 16px 48px', borderRadius: '14px', border: '1px solid #eee', outline: 'none', boxSizing: 'border-box', fontSize: '1rem', backgroundColor: '#fff', color: '#1a1a1a' }} />
                <Lock size={20} color="#bbb" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>{showPw ? <EyeOff size={20} color="#bbb" /> : <Eye size={20} color="#bbb" />}</button>
              </div>
              <button type="submit" style={{ backgroundColor: '#ff4d94', color: '#fff', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', boxShadow: '0 12px 25px rgba(255, 77, 148, 0.25)' }}>로그인</button>
            </form>
          ) : (
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ position: 'relative' }}><input type="text" placeholder="이름 (ex: 홍길동)" value={signupName} onChange={(e) => setSignupName(e.target.value)} style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '14px', border: '1px solid #eee', outline: 'none', boxSizing: 'border-box', fontSize: '1rem', backgroundColor: '#fff', color: '#1a1a1a' }} /><User size={20} color="#bbb" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} /></div>
              <div style={{ position: 'relative' }}><input type="text" placeholder="사용할 아이디" value={signupId} onChange={(e) => setSignupId(e.target.value)} style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '14px', border: '1px solid #eee', outline: 'none', boxSizing: 'border-box', fontSize: '1rem', backgroundColor: '#fff', color: '#1a1a1a' }} /><Target size={20} color="#bbb" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} /></div>
              <div style={{ position: 'relative' }}>
                {/* [수정 완료] setSignupPw로 정상 변경! */}
                <input type={showPw ? "text" : "password"} placeholder="사용할 비밀번호" value={signupPw} onChange={(e) => setSignupPw(e.target.value)} style={{ width: '100%', padding: '16px 48px 16px 48px', borderRadius: '14px', border: '1px solid #eee', outline: 'none', boxSizing: 'border-box', fontSize: '1rem', backgroundColor: '#fff', color: '#1a1a1a' }} />
                <Lock size={20} color="#bbb" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>{showPw ? <EyeOff size={20} color="#bbb" /> : <Eye size={20} color="#bbb" />}</button>
              </div>
              <button type="submit" style={{ backgroundColor: '#4d61ff', color: '#fff', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', boxShadow: '0 12px 25px rgba(77, 97, 255, 0.25)' }}>가입하기</button>
            </form>
          )}

          <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.9rem', color: '#999' }}>
            {isSignupMode ? (
              <span style={{ cursor: 'pointer', color: '#ff4d94', fontWeight: 'bold' }} onClick={() => setIsSignupMode(false)}>로그인으로 돌아가기</span>
            ) : (
              <>
                <span style={{ cursor: 'pointer' }} onClick={() => setIsSignupMode(true)}>회원가입</span>
                <span style={{ color: '#eee' }}>|</span>
                <span style={{ cursor: 'pointer' }}>아이디/비밀번호 찾기</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', padding: '20px', boxSizing: 'border-box', overflowX: 'hidden', overflowY: 'auto', fontFamily: '"Pretendard", sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexShrink: 0 }}>
        <div><h1 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0, color: '#1a1a1a' }}>AI 피부 분석 리포트</h1><p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>ResNet18 모델 기반 실시간 진단</p></div>
        <div style={{ fontSize: '0.85rem' }}><strong>{currentUser?.name || '에이스'}</strong> 님 환영합니다</div>
      </header>
      <main style={{ flex: 1, backgroundColor: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'visible' }}>
        <section style={{ display: 'flex', gap: '25px', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '15px', flexShrink: 0 }}>
          <div style={{ width: '220px', height: '150px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #eee', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {preview ? <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fcfcfc', color: '#ccc' }}><Camera size={30} /></div>}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><h4 style={{ margin: 0, fontSize: '1.1rem', color: '#333' }}>피부 사진 분석</h4><span style={{ fontSize: '0.75rem', color: '#ff4d94', backgroundColor: '#fff5f8', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>정면 사진 권장</span></div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>ResNet18 딥러닝 모델이 사진의 색소침착 정도를 수치화하여 분석합니다.</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <label htmlFor="skin-upload" style={{ border: '1px solid #ddd', padding: '12px 25px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem', backgroundColor: '#fff', fontWeight: '600' }}>사진 선택</label>
              <input type="file" id="skin-upload" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              <button onClick={handleUpload} style={{ backgroundColor: '#ff4d94', color: '#fff', border: 'none', padding: '12px 40px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(255, 77, 148, 0.2)' }}>{loading ? "AI 분석 중..." : "분석 시작"}</button>
            </div>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#fdfdfd', borderRadius: '15px', border: '1px dashed #eee', textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#bbb' }}>Current Analysis Status</div><div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: loading ? '#ff4d94' : '#00c73c' }}>{loading ? "Processing..." : "Ready to Scan"}</div>
          </div>
        </section>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {result ? (
            result.error ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ef4444', backgroundColor: '#fef2f2', borderRadius: '12px', border: '1px dashed #fca5a5', minHeight: '300px' }}>
                <AlertCircle size={50} style={{ marginBottom: '15px', opacity: 0.8 }} /><h3 style={{ margin: '0 0 10px 0' }}>백엔드 서버 분석 오류</h3><p style={{ margin: 0, fontSize: '0.95rem' }}>{result.error}</p>
                <button onClick={() => setResult(null)} style={{ marginTop: '20px', padding: '10px 25px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>초기화 후 다시 시도</button>
              </div>
            ) : (
              <section style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', animation: 'fadeIn 0.5s' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', alignItems: 'stretch' }}>
                  <ScoreCard score={result.score} title="분석 결과" result={result} />
                  <ProgressChart result={result} />
                  <IngredientCard skinType="복합성" ingredients={[{ name: result.ingredient || '추천 성분', category: '미백', effectiveness: '멜라닌 생성을 억제하고 피부 톤을 균일하게 개선합니다.' }, { name: '비타민C', category: '항산화', effectiveness: '강력한 항산화 효과로 피부 밝기를 개선합니다.' }]} onButtonClick={() => window.open(`https://www.oliveyoung.co.kr/store/search/getSearchMain.do?query=${result.ingredient}`)} />  
                  <AIAdviceCard summary={displayedMessage || "AI가 피부 상태를 실시간 분석 중입니다..."} advice={result.advice || []} />
                  <DailyTips />
                  <ProductRecommendation products={result.products || []} />
                </div>
                <div style={{ padding: '12px 25px', borderRadius: '12px', backgroundColor: '#1a1a1a', color: '#fff', flexShrink: 0, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px', color: result.status_color || '#fff', fontSize: '0.8rem' }}><AlertCircle size={18} /><strong>AI 맞춤 케어 솔루션</strong></div>
                  <p style={{ fontSize: '1rem', lineHeight: '1.6', margin: 0, fontWeight: '300', letterSpacing: '-0.3px' }}>{displayedMessage}<span style={{ color: result.status_color || '#fff', fontWeight: 'bold', animation: 'blink 1s step-end infinite' }}>|</span></p>
                </div>
              </section>
            )
          ) : (
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ccc', backgroundColor: '#fcfcfc', borderRadius: '12px', border: '1px dashed #eee', minHeight: '300px' }}>
              <Sparkles size={60} style={{ marginBottom: '15px', opacity: 0.3, color: '#ff4d94' }} />
              <p style={{ fontSize: '1rem', fontWeight: '500' }}>분석할 사진을 선택하고 '분석 시작' 버튼을 눌러주세요.</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>실시간 AI 엔진이 피부 상태를 정밀 진단합니다.</p>
            </div>
          )}
        </div>
      </main>
      <style>{`* { box-sizing: border-box; } html, body, #root { width: 100%; height: auto; margin: 0; padding: 0; overflow-x: hidden; } body { font-family: "Pretendard", sans-serif; background: #fafafa; } .custom-scrollbar::-webkit-scrollbar { width: 5px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } @keyframes blink { 50% { opacity: 0; } }`}</style>
    </div>
  );
}

export default App;