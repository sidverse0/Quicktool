
"use client";

import { useState, useEffect, useCallback } from 'react';

const USER_DATA_KEY = 'quickToolUserData';
const MAX_FREE_USES = 10;

export type ToolName = 
  | "pdfToImage"
  | "imageToPdf"
  | "resizeDimensions"
  | "resizeSize"
  | "imageFilters"
  | "paletteGenerator"
  | "qrUrl"
  | "qrText"
  | "qrVCard"
  | "qrUpi"
  | "calligraphySignature"
  | "handwrittenNotes";

type UserData = {
  coins: number;
  isPremium: boolean;
  toolUsage: Record<ToolName, number>;
};

const defaultUserData: UserData = {
  coins: 100, // Start with some coins
  isPremium: false,
  toolUsage: {
    pdfToImage: 0,
    imageToPdf: 0,
    resizeDimensions: 0,
    resizeSize: 0,
    imageFilters: 0,
    paletteGenerator: 0,
    qrUrl: 0,
    qrText: 0,
    qrVCard: 0,
    qrUpi: 0,
    calligraphySignature: 0,
    handwrittenNotes: 0,
  },
};

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData>(() => {
    if (typeof window === 'undefined') {
      return defaultUserData;
    }
    try {
      const item = window.localStorage.getItem(USER_DATA_KEY);
      return item ? JSON.parse(item) : defaultUserData;
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      return defaultUserData;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to save user data to localStorage", error);
    }
  }, [userData]);
  
  const canUseTool = useCallback((tool: ToolName): boolean => {
    if (userData.isPremium) {
      return true;
    }
    return (userData.toolUsage[tool] || 0) < MAX_FREE_USES;
  }, [userData.isPremium, userData.toolUsage]);

  const incrementToolUsage = useCallback((tool: ToolName) => {
    if (userData.isPremium) return;

    setUserData(prev => ({
      ...prev,
      toolUsage: {
        ...prev.toolUsage,
        [tool]: (prev.toolUsage[tool] || 0) + 1,
      },
    }));
  }, [userData.isPremium]);

  const addCoins = useCallback((amount: number) => {
    setUserData(prev => ({
        ...prev,
        coins: prev.coins + amount
    }));
  }, []);

  const unlockPremium = useCallback(() => {
    setUserData(prev => {
        if(prev.coins >= 499) {
            return {
                ...prev,
                isPremium: true,
                coins: prev.coins - 499,
            }
        }
        return prev;
    });
  }, []);

  return { userData, canUseTool, incrementToolUsage, addCoins, unlockPremium };
};
