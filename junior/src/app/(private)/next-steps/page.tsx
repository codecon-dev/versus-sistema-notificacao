'use client';

import React from 'react';

/* ---------- Tipos ---------- */
type InitiativeStatus = 'done' | 'planned';

type Initiative = {
  id: string;
  title: string;
  description: string;
  status: InitiativeStatus;
};

/* ---------- Mock de planejamento ---------- */
const initiativesMock: Initiative[] = [
  // ✅ O que já foi feito
  {
    id: '1',
    title: 'Autenticação por Role',
    description:
      'Implementação de controle de acesso baseado em permissões (admin, user).',
    status: 'done',
  },
  {
    id: '2',
    title: 'Envio de Notificações',
    description:
      'Funcionalidade para envio manual de notificações pelo painel administrativo.',
    status: 'done',
  },
  {
    id: '3',
    title: 'Exibição de Notificações',
    description: 'Listagem de notificações para o usuário final na aplicação.',
    status: 'done',
  },
  {
    id: '4',
    title: 'Marcar Notificações como Não Lidas',
    description: 'Controle de estado de leitura das notificações pelo usuário.',
    status: 'done',
  },

  // 🔜 Próximos passos
  {
    id: '5',
    title: 'Usuários da Página de Admin via Supabase',
    description:
      'Carregar usuários dinamicamente do Supabase no painel administrativo.',
    status: 'planned',
  },
  {
    id: '6',
    title: 'Persistência de Notificações no Supabase',
    description:
      'Salvar notificações enviadas no banco de dados para histórico e auditoria.',
    status: 'planned',
  },
  {
    id: '7',
    title: 'Notificações em Tempo Real',
    description:
      'Recebimento de notificações em tempo real utilizando subscriptions.',
    status: 'planned',
  },
  {
    id: '8',
    title: 'Sons e Animações de Notificação',
    description: 'Feedback visual e sonoro para novas notificações recebidas.',
    status: 'planned',
  },
];

/* ---------- Helpers ---------- */
const statusMap = {
  planned: {
    label: 'Planejado',
    color: 'bg-gray-200 text-gray-700',
  },
  in_progress: {
    label: 'Em andamento',
    color: 'bg-[#ea6524]/10 text-[#ea6524]',
  },
  done: {
    label: 'Concluído',
    color: 'bg-green-100 text-green-700',
  },
};

/* ---------- Página ---------- */
export default function PlanningPage() {
  return (
    <main className="min-h-screen bg-[#404040] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Planejamento & Visão Futura
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl">
            Esta área apresenta iniciativas planejadas, em andamento e já
            concluídas. Os dados abaixo são mockados e servirão de base para
            futuras integrações com backend e analytics.
          </p>
        </header>

        {/* Cards de métricas */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Iniciativas Totais"
            value={initiativesMock.length}
          />
          <MetricCard
            title="Realizadas"
            value={initiativesMock.filter((i) => i.status === 'planned').length}
          />
          <MetricCard
            title="Planejadas"
            value={initiativesMock.filter((i) => i.status === 'planned').length}
          />
        </section>

        {/* Lista de iniciativas */}
        <section className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-[#404040]">
              Roadmap de Desenvolvimento
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {initiativesMock.map((item) => {
              const status = statusMap[item.status];

              return (
                <div
                  key={item.id}
                  className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-gray-50 transition"
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[#404040]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 max-w-2xl">
                      {item.description}
                    </p>
                  </div>

                  <div
                    className={`px-4 py-2 rounded-full text-xs font-semibold w-fit ${status.color}`}
                  >
                    {status.label}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer informativo */}
        <footer className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <p className="text-sm text-gray-300 leading-relaxed">
            <strong className="text-white">Nota:</strong> Esta página utiliza
            dados mockados para validação visual e estrutural. No futuro, essas
            informações poderão ser alimentadas por APIs, banco de dados e
            sistemas de analytics em tempo real.
          </p>
        </footer>
      </div>
    </main>
  );
}

/* ---------- Componentes ---------- */
function MetricCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-3xl font-bold text-[#404040] mt-2">{value}</div>
    </div>
  );
}
