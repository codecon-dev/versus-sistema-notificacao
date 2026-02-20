'use client';

import React, { useState } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
};

const sampleUsers: User[] = [
  { id: '1', name: 'Ana Silva', email: 'ana@exemplo.com' },
  { id: '2', name: 'Bruno Costa', email: 'bruno@exemplo.com' },
  { id: '3', name: 'Carla Souza', email: 'carla@exemplo.com' },
  { id: '4', name: 'Diego Alves', email: 'diego@exemplo.com' },
];

// Ícones SVG inline para manter moderno
const BellIcon = () => (
  <svg
    className="w-5 h-5"
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

const SendIcon = () => (
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
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default function NotificationPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sendToAll, setSendToAll] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const selectedCount = sendToAll ? sampleUsers.length : selectedIds.length;

  return (
    <main className="min-h-screen bg-[#404040] p-4 md:p-8">
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
        {/* Header com visual moderno */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-[#ea6524] rounded-xl shadow-lg shadow-[#ea6524]/20">
              <BellIcon />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Enviar Notificação
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1 w-12 bg-[#ea6524] rounded-full" />
                <p className="text-sm text-gray-400">
                  Sistema de notificações em tempo real
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna esquerda - Formulário */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card de configuração */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-[#404040] to-[#505050] p-4">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#ea6524] rounded-full animate-pulse" />
                  Configurar Mensagem
                </h2>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#404040] mb-2">
                    Título da notificação
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Atualização importante"
                    className="w-full rounded-xl border-2 border-gray-200 p-3 text-sm text-[#404040] 
                             placeholder:text-gray-400 focus:outline-none focus:border-[#ea6524] 
                             transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#404040] mb-2">
                    Mensagem
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escreva a mensagem que será enviada..."
                    rows={6}
                    className="w-full rounded-xl border-2 border-gray-200 p-3 text-sm text-[#404040] 
                             placeholder:text-gray-400 focus:outline-none focus:border-[#ea6524] 
                             transition-all duration-300 resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <label
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 
                                  cursor-pointer transition-colors duration-200 group"
                  >
                    <input
                      type="checkbox"
                      checked={sendToAll}
                      onChange={(e) => setSendToAll(e.target.checked)}
                      className="h-5 w-5 rounded border-gray-300 text-[#ea6524] 
                               focus:ring-[#ea6524] focus:ring-offset-0 cursor-pointer"
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <UsersIcon />
                      <span
                        className="text-sm font-medium text-[#404040] group-hover:text-[#ea6524] 
                                     transition-colors duration-200"
                      >
                        Enviar para todos
                      </span>
                    </div>
                  </label>
                </div>

                <button
                  disabled={!title || !message || selectedCount === 0}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#ea6524] 
                           px-6 py-4 text-white text-sm font-semibold shadow-lg shadow-[#ea6524]/30
                           hover:bg-[#d45a1f] hover:shadow-xl hover:shadow-[#ea6524]/40
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                           transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <SendIcon />
                  Enviar Notificação
                </button>

                <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl">
                  <CheckCircleIcon />
                  <span className="text-sm text-gray-600">
                    Destinatários:{' '}
                    <span className="font-bold text-[#ea6524]">
                      {selectedCount}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Stats card */}
            <div
              className="bg-gradient-to-br from-[#ea6524] to-[#d45a1f] rounded-2xl p-6 
                          shadow-xl shadow-[#ea6524]/20 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Status do Sistema</h3>
                <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                  Online
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{sampleUsers.length}</div>
                  <div className="text-xs opacity-90">Total de Usuários</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{selectedCount}</div>
                  <div className="text-xs opacity-90">Selecionados</div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna direita - Lista de usuários e preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lista de usuários */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-[#404040] to-[#505050] p-4 flex items-center justify-between">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <UsersIcon />
                  Lista de Usuários
                </h2>
                <div className="px-3 py-1 bg-[#ea6524] rounded-full text-xs font-medium text-white">
                  {sampleUsers.length} usuários
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  {sampleUsers.map((u) => {
                    const selected = selectedIds.includes(u.id);
                    return (
                      <div
                        key={u.id}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 
                                  transition-all duration-300 cursor-pointer group
                                  ${
                                    selected
                                      ? 'border-[#ea6524] bg-[#ea6524]/5 shadow-md'
                                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                  }
                                  ${sendToAll ? 'opacity-60' : ''}`}
                        onClick={() => !sendToAll && toggleSelect(u.id)}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center 
                                        font-bold text-lg transition-all duration-300
                                        ${
                                          selected
                                            ? 'bg-[#ea6524] text-white'
                                            : 'bg-gray-100 text-[#404040] group-hover:bg-gray-200'
                                        }`}
                          >
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-[#404040]">
                              {u.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {u.email}
                            </div>
                          </div>
                        </div>

                        <label
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleSelect(u.id)}
                            disabled={sendToAll}
                            className="h-5 w-5 rounded border-gray-300 text-[#ea6524] focus:ring-[#ea6524] focus:ring-offset-0 cursor-pointer disabled:cursor-not-allowed"
                          />
                          <span
                            className={`text-xs font-medium transition-colors duration-200
                                         ${selected ? 'text-[#ea6524]' : 'text-gray-500'}`}
                          >
                            {selected ? 'Selecionado' : 'Selecionar'}
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Preview da notificação */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-[#404040] to-[#505050] p-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#ea6524] rounded-full" />
                  Pré-visualização
                </h3>
              </div>

              <div className="p-6">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-100">
                  {/* Simulação de notificação mobile */}
                  <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                      <div className="bg-[#ea6524] p-3 flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                          <BellIcon />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-semibold text-sm">
                            {title || 'Título da notificação'}
                          </div>
                          <div className="text-white/80 text-xs">Agora</div>
                        </div>
                      </div>

                      <div className="p-4 bg-white">
                        <p className="text-sm text-[#404040] leading-relaxed">
                          {message ||
                            'Aqui aparecerá a mensagem que você escreveu. Escreva algo para ver a prévia!'}
                        </p>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <UsersIcon />
                            <span>
                              Destinatários:{' '}
                              <strong className="text-[#ea6524]">
                                {sendToAll
                                  ? 'Todos os usuários'
                                  : `${selectedCount} selecionado${selectedCount !== 1 ? 's' : ''}`}
                              </strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <svg
                className="w-5 h-5 text-[#ea6524]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-300 leading-relaxed">
                <strong className="text-white">Próximos passos:</strong>{' '}
                Integração com Supabase para envio real de notificações,
                histórico de envios e análise de métricas de engajamento.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
