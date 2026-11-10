import { Link } from 'react-router-dom';
import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import logo from '../../assets/images/AE_HOTEL_transparent_logo.png';

export default function AuthBrand() {
  return <>
    <svg className="auth-gold-waves" viewBox="0 0 1600 1100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="auth-gold-edge"><stop stopColor="#98602f" stopOpacity=".2" /><stop offset=".5" stopColor="#edbb6e" /><stop offset="1" stopColor="#8c5427" stopOpacity=".15" /></linearGradient>
        <linearGradient id="auth-gold-fold" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#995a2d" stopOpacity=".5" /><stop offset=".65" stopColor="#4e2a18" stopOpacity=".12" /><stop offset="1" stopColor="#29180f" stopOpacity="0" /></linearGradient>
      </defs>
      <path d="M0 0 H360 C230 95 145 110 0 170Z" fill="url(#auth-gold-fold)" />
      <path d="M0 170 C145 110 230 95 360 0 M0 335 C110 175 180 120 300 40" fill="none" stroke="url(#auth-gold-edge)" strokeWidth="1.5" />
      <path d="M940 1100 C1290 1060 1350 820 1600 690 V1100Z" fill="url(#auth-gold-fold)" />
      <path d="M940 1100 C1290 1060 1350 820 1600 690 M1210 1030 C1400 935 1490 870 1600 805" fill="none" stroke="url(#auth-gold-edge)" strokeWidth="1.5" />
    </svg>
    <Link to="/" className="auth-brand" aria-label="AE Hotel — Ana səhifə"><img src={logo} alt="AE Hotel" /></Link>
  </>;
}

export function AuthSocialOptions() {
  return <div className="auth-social-options">
    <div className="auth-social-divider"><span />və ya<span /></div>
    <div className="auth-social-buttons" aria-label="Sosial hesabla giriş">
      <button type="button" disabled aria-label="Google ilə giriş — hazırda aktiv deyil" title="Google ilə giriş hazırda aktiv deyil"><FcGoogle aria-hidden="true" /></button>
      <button type="button" disabled aria-label="Apple ilə giriş — hazırda aktiv deyil" title="Apple ilə giriş hazırda aktiv deyil"><FaApple aria-hidden="true" /></button>
      <button type="button" disabled aria-label="Microsoft ilə giriş — hazırda aktiv deyil" title="Microsoft ilə giriş hazırda aktiv deyil"><span className="auth-microsoft-mark" aria-hidden="true"><i /><i /><i /><i /></span></button>
    </div>
    <p className="auth-social-note">Sosial giriş hazırda aktiv deyil.</p>
  </div>;
}
