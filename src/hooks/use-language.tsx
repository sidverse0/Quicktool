
"use client";

import { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { translations, Language } from '@/lib/translations';

type LanguageContextType = {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        const savedLanguage = localStorage.getItem('quick-tool-language') as Language;
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
            setLanguageState(savedLanguage);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('quick-tool-language', lang);
    }

    const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
        const keyParts = key.split('.');
        let text = translations[language];

        try {
            for (const part of keyParts) {
                text = text[part];
            }
        } catch (e) {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }

        if (typeof text !== 'string') {
            return key;
        }

        if (replacements) {
            for (const placeholder in replacements) {
                text = text.replace(`{${placeholder}}`, String(replacements[placeholder]));
            }
        }

        return text;
    }, [language]);


    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
