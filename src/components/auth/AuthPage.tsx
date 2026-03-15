import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth } from '../../lib/firebase';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      }
    } catch (err: any) {
      setError(err.message === 'Firebase: Error (auth/user-not-found).' 
        ? '존재하지 않는 사용자입니다.' 
        : '이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError('구글 로그인에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden p-10 border">
        <div className="text-center mb-10">
          <img src="/logo.svg" alt="GovFund Logo" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            {isLogin ? '반갑습니다!' : '환영합니다!'}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {isLogin ? '정부 R&D 지원사업을 스마트하게 관리하세요.' : 'GovFund의 모든 기능을 무료로 시작하세요.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">이름</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">이메일</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">비밀번호</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-xs mt-2 ml-1 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50"
          >
            {loading ? '처리 중...' : (isLogin ? '로그인' : '계정 만들기')}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-slate-400">또는</span></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-4 border rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          구글로 계속하기
        </button>

        <p className="text-center mt-8 text-sm text-slate-500">
          {isLogin ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-bold ml-2 hover:underline"
          >
            {isLogin ? '회원가입' : '로그인'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
