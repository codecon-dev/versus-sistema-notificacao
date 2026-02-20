'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { faker } from '@faker-js/faker';

interface INotification {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

const createMockNotification = (): INotification => ({
  id: faker.string.uuid(),
  title: faker.lorem.words(3),
  message: faker.lorem.paragraphs(2),
  createdAt: faker.date.recent({ days: 7 }),
  read: faker.datatype.boolean(),
});

// Ícones SVG inline
const BellIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

const CheckAllIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
    />
  </svg>
);

const ArrowBackIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

const InboxIcon = () => (
  <svg
    className="w-12 h-12"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
    />
  </svg>
);

const SparklesIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

export default function PublicNotificationsPage() {
  const [notifications, setNotifications] = useState<INotification[] | null>(
    null
  );
  const [active, setActive] = useState<INotification | null>(null);

  useEffect(() => {
    // TODO: replace mock with Supabase + WebSocket later
    const data = faker.helpers.multiple(createMockNotification, { count: 12 });
    setNotifications(data);
  }, []);

  const unreadCount = useMemo(() => {
    return notifications?.filter((n) => !n.read).length ?? 0;
  }, [notifications]);

  const handleOpen = (id: string) => {
    if (!notifications) return;

    const updated = notifications.map((n) => {
      if (n.id === id) return { ...n, read: true };
      return n;
    });

    setNotifications(updated);
    setActive(updated.find((n) => n.id === id) || null);
  };

  const handleMarkAllAsRead = () => {
    if (!notifications) return;
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <main className="min-h-screen bg-[#404040] p-4 md:p-6">
      {/* Background tech pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(#ea6524 1px, transparent 1px), linear-gradient(90deg, #ea6524 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#ea6524] rounded-xl shadow-lg shadow-[#ea6524]/20">
              <BellIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Central de Notificações
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1 w-12 bg-[#ea6524] rounded-full" />
                <p className="text-sm text-gray-400">
                  Acompanhe suas mensagens em tempo real
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: notifications list */}
          <section className="lg:col-span-1 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-[#404040] to-[#505050] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white font-semibold">Inbox</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        unreadCount > 0
                          ? 'bg-[#ea6524] text-white'
                          : 'bg-white/20 text-white/80'
                      }`}
                    >
                      {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 
                           hover:bg-white/20 text-white text-xs font-medium 
                           transition-all duration-200 disabled:opacity-50 
                           disabled:cursor-not-allowed backdrop-blur-sm"
                >
                  <CheckAllIcon />
                  Marcar todas
                </button>
              </div>
            </div>

            <div className="p-4 max-h-[calc(100vh-280px)] overflow-auto">
              {!notifications ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div
                    className="w-12 h-12 border-4 border-[#ea6524] border-t-transparent 
                                rounded-full animate-spin"
                  />
                  <p className="text-sm text-gray-500">
                    Carregando notificações...
                  </p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-12 text-center gap-3">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <SparklesIcon />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Nenhuma notificação ainda
                  </p>
                  <p className="text-xs text-gray-400">Você está em dia! ✨</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleOpen(n.id)}
                      className={`w-full text-left rounded-xl p-4 border-2 transition-all 
                                duration-300 relative group overflow-hidden
                                ${
                                  n.read
                                    ? 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                    : 'bg-gradient-to-r from-[#ea6524]/5 to-[#ea6524]/10 border-[#ea6524]/30 hover:border-[#ea6524]/50 shadow-sm'
                                }
                                ${active?.id === n.id ? 'ring-2 ring-[#ea6524]' : ''}
                              `}
                    >
                      {/* Indicator dot */}
                      {!n.read && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <div className="h-2 w-2 rounded-full bg-[#ea6524]">
                            <div className="h-2 w-2 rounded-full bg-[#ea6524] animate-ping absolute" />
                          </div>
                        </div>
                      )}

                      <div className={n.read ? '' : 'ml-4'}>
                        <h3
                          className="font-semibold text-[#404040] truncate group-hover:text-[#ea6524] 
                                     transition-colors duration-200"
                        >
                          {n.title}
                        </h3>
                        <p className="mt-1 text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[10px] text-gray-400">
                            {n.createdAt.toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {!n.read && (
                            <span
                              className="px-2 py-0.5 bg-[#ea6524] text-white text-[10px] 
                                         font-medium rounded-full"
                            >
                              Nova
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Hover effect */}
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-[#ea6524]/0 
                                    to-[#ea6524]/5 opacity-0 group-hover:opacity-100 
                                    transition-opacity duration-300 pointer-events-none rounded-xl"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* RIGHT: notification viewer */}
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-[#404040] to-[#505050] p-4">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-[#ea6524] rounded-full" />
                {active ? 'Visualizador' : 'Detalhes'}
              </h2>
            </div>

            <div className="p-8 min-h-[calc(100vh-280px)]">
              {!active ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <div
                    className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-3xl 
                                shadow-inner border border-gray-100"
                  >
                    <InboxIcon />
                  </div>

                  <div className="space-y-2 max-w-md">
                    <h2 className="text-2xl font-bold text-[#404040]">
                      {unreadCount > 0 ? 'Suas Notificações' : 'Tudo em Dia!'}
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {unreadCount > 0
                        ? `Você tem ${unreadCount} notificação${unreadCount !== 1 ? 'ões' : ''} não lida${unreadCount !== 1 ? 's' : ''}. Selecione uma ao lado para visualizar.`
                        : 'Nenhuma notificação pendente. Quando algo novo chegar, você verá aqui.'}
                    </p>
                  </div>

                  {unreadCount > 0 && (
                    <div
                      className="mt-4 px-6 py-3 bg-[#ea6524]/10 border border-[#ea6524]/20 
                                  rounded-xl inline-flex items-center gap-2"
                    >
                      <div className="h-2 w-2 bg-[#ea6524] rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-[#ea6524]">
                        {unreadCount} aguardando leitura
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <article className="flex flex-col gap-6 animate-fadeIn">
                  {/* Badge de status */}
                  <div className="flex items-center gap-2">
                    {!active.read && (
                      <span
                        className="px-3 py-1 bg-[#ea6524] text-white text-xs 
                                   font-semibold rounded-full flex items-center gap-1.5"
                      >
                        <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
                        Não lida
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      ID: {active.id.slice(0, 8)}
                    </span>
                  </div>

                  {/* Header */}
                  <header className="pb-4 border-b-2 border-gray-100">
                    <h2 className="text-3xl font-bold text-[#404040] leading-tight">
                      {active.title}
                    </h2>
                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {active.createdAt.toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {active.createdAt.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </header>

                  {/* Content */}
                  <div
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 
                                border border-gray-100 shadow-inner"
                  >
                    <p className="text-sm text-[#404040] leading-relaxed whitespace-pre-wrap">
                      {active.message}
                    </p>
                  </div>

                  {/* Footer */}
                  <footer className="pt-6 border-t-2 border-gray-100 flex justify-between items-center">
                    <button
                      onClick={() => setActive(null)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl 
                               bg-gray-100 hover:bg-gray-200 text-[#404040] text-sm 
                               font-medium transition-all duration-200 
                               hover:shadow-md active:scale-95"
                    >
                      <ArrowBackIcon />
                      Voltar ao histórico
                    </button>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Recebida há{' '}
                      {Math.floor(
                        (new Date().getTime() - active.createdAt.getTime()) /
                          (1000 * 60 * 60)
                      )}
                      h
                    </div>
                  </footer>
                </article>
              )}
            </div>
          </section>
        </div>

        {/* Stats footer */}
        <footer className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#ea6524]/20 rounded-lg">
                <BellIcon className="w-5 h-5 text-[#ea6524]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {notifications?.length || 0}
                </div>
                <div className="text-xs text-gray-400">
                  Total de Notificações
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#ea6524]/20 rounded-lg">
                <svg
                  className="w-5 h-5 text-[#ea6524]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {unreadCount}
                </div>
                <div className="text-xs text-gray-400">Não Lidas</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#ea6524]/20 rounded-lg">
                <CheckAllIcon />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {notifications ? notifications.length - unreadCount : 0}
                </div>
                <div className="text-xs text-gray-400">Já Lidas</div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
