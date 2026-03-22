import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { useI18n } from '@/lib/i18n';
import { Mail, Archive, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  status: 'new' | 'replied' | 'archived';
  createdAt: string;
}

export default function ContactMessages() {
  const { t, lang } = useI18n();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      const res = await api.get('/api/contact?limit=5');
      return res.data.messages;
    },
    refetchInterval: 10000,
    retry: false,
    enabled: !!localStorage.getItem('token'),
  });

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/api/contact/${id}/read`);
      refetch();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await api.patch(`/api/contact/${id}/status`, { status: 'archived' });
      refetch();
      setSelectedId(null);
    } catch (error) {
      console.error('Error archiving message:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Mail className="h-5 w-5 text-gold" />
          {lang === 'ru' ? 'Контактные сообщения' : 'Contact Messages'}
        </h3>
        <div className="text-sm text-muted-foreground">
          {lang === 'ru' ? 'Загрузка...' : 'Loading...'}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Mail className="h-5 w-5 text-gold" />
          {lang === 'ru' ? 'Контактные сообщения' : 'Contact Messages'}
        </h3>
        <div className="text-sm text-muted-foreground"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Mail className="h-5 w-5 text-gold" />
          {lang === 'ru' ? 'Контактные сообщения' : 'Contact Messages'}
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            {lang === 'ru' ? 'Нет сообщений' : 'No messages'}
          </span>
        </h3>
        <div className="text-sm text-muted-foreground p-4 rounded-lg border border-dashed bg-muted/50">
          {lang === 'ru' ? 'Нет новых контактных сообщений' : 'No new contact messages'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Mail className="h-5 w-5 text-gold" />
          {lang === 'ru' ? 'Новые сообщения' : 'New Messages'}
          {data.filter((m: ContactMessage) => !m.isRead).length > 0 && (
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-500 text-white text-xs font-bold">
              {data.filter((m: ContactMessage) => !m.isRead).length}
            </span>
          )}
        </h3>
      </div>

      <div className="space-y-2">
        {data.map((message: ContactMessage) => (
          <div
            key={message._id}
            className={`rounded-lg border p-4 cursor-pointer transition-all ${
              message.isRead
                ? 'border-border bg-muted/50'
                : 'border-gold/50 bg-gold/5'
            } ${selectedId === message._id ? 'ring-2 ring-gold' : ''}`}
            onClick={() => {
              setSelectedId(message._id);
              if (!message.isRead) {
                handleMarkAsRead(message._id);
              }
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-foreground">{message.name}</p>
                  {!message.isRead && (
                    <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{message.email}</p>
                {selectedId === message._id && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {message.message}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchive(message._id);
                        }}
                        className="text-xs px-3 py-1 rounded bg-muted text-muted-foreground hover:bg-muted/70 flex items-center gap-1"
                      >
                        <Archive className="h-3 w-3" />
                        {lang === 'ru' ? 'Архив' : 'Archive'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                {new Date(message.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
