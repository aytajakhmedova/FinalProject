import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getSiteContent } from '../api/client';

const SiteContentContext = createContext({
  content: null,
  loading: true,
  error: '',
  reload: () => {},
});

export const SiteContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    getSiteContent()
      .then((data) => {
        setContent(data);
        setError('');
      })
      .catch((err) => {
        setContent(null);
        setError(err.message || 'Sayt məzmunu yüklənmədi.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const value = useMemo(
    () => ({ content, loading, error, reload: load }),
    [content, loading, error]
  );

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => useContext(SiteContentContext);
