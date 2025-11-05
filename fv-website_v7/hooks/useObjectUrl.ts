import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch a resource and create a blob object URL.
 * It is designed to load an asset like `/logo.png` from the server.
 *
 * As requested, this hook will ONLY attempt to load the resource from the
 * specified URL. It does not contain any fallback logic. If the fetch
 * fails (e.g., the file is not found), the `url` returned will be `null`,
 * and no image will be rendered.
 */
export const useObjectUrl = (url: string) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!url) {
        setIsLoading(false);
        setObjectUrl(null);
        return;
    }

    let isMounted = true;
    let createdUrl: string | undefined;

    const fetchAndCreateUrl = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch '${url}': ${response.status} ${response.statusText}`);
        }
        const blob = await response.blob();
        if (isMounted) {
            createdUrl = URL.createObjectURL(blob);
            setObjectUrl(createdUrl);
        }
      } catch (e: any) {
        if (isMounted) {
            console.error(e);
            setError(e);
            setObjectUrl(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAndCreateUrl();

    return () => {
      isMounted = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [url]);

  return { url: objectUrl, error, isLoading };
};
