"use client";

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface AddBookButtonProps {
  onClick: () => void;
}

export default function AddBookButton({ onClick }: AddBookButtonProps) {
  const { t } = useLanguage();

  return (
    <Button 
      onClick={onClick}
      className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
    >
      <Plus className="w-5 h-5" />
      <span className="hidden md:inline font-semibold">{t.library.modals.add_new_book}</span>
    </Button>
  );
}
