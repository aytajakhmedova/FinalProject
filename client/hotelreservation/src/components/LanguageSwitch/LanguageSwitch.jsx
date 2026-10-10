import { LANGS } from '../../i18n/translations';
import { useLanguage } from '../../context/LanguageContext';
import './LanguageSwitch.css';

const LanguageSwitch = ({ className = '' }) => {
  const { lang, setLang, t } = useLanguage();

  return (
    <select
      className={`language-select ${className}`.trim()}
      value={lang}
      onChange={(event) => setLang(event.target.value)}
      aria-label={t('nav.language')}
    >
      {LANGS.map((item) => (
        <option key={item.code} value={item.code}>
          {item.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitch;
