'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { AgentRoleProfile, AgentLogStep, GitHubTrendingRepo, SoloBattleResult } from '@/types';
import { ModalArtifactState, WorkflowNode } from '@/types/workflow';
import { DevOpsToolDefinition } from '@/lib/devopsCatalog';

import { AgentLogInspectorModal } from '@/components/AgentLogInspectorModal';
import { AgentSoloArenaModal } from '@/components/AgentSoloArenaModal';
import ArtifactInspectorModal from '@/components/ArtifactInspectorModal';
import InfrastructureConfigModal from '@/components/InfrastructureConfigModal';
import DocumentationModal from '@/components/DocumentationModal';
import DynamicToolCatalogModal from '@/components/DynamicToolCatalogModal';
import { AgentSquadChatTerminal } from '@/components/AgentSquadChatTerminal';
import { MobileBottomNavigation } from '@/components/MobileBottomNavigation';
import NodeQuickConfigDrawer from '@/components/NodeQuickConfigDrawer';

interface WorkflowModalsHubProps {
  theme: 'light' | 'dark';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
  selectedAgentForModal: AgentRoleProfile | null;
  agentLogs: AgentLogStep[];
  isAgentModalOpen: boolean;
  setIsAgentModalOpen: (open: boolean) => void;
  activeSoloBattle: SoloBattleResult | null;
  soloBattleRepo: GitHubTrendingRepo | null;
  soloBattleAgent: AgentRoleProfile | null;
  isSoloModalOpen: boolean;
  setIsSoloModalOpen: (open: boolean) => void;
  modalArtifact: ModalArtifactState;
  setModalArtifact: React.Dispatch<React.SetStateAction<ModalArtifactState>>;
  isConfigModalOpen: boolean;
  setIsConfigModalOpen: (open: boolean) => void;
  sysConfig: any;
  fetchLocalProjects: () => void;
  isDocsModalOpen: boolean;
  setIsDocsModalOpen: (open: boolean) => void;
  isCatalogModalOpen: boolean;
  setIsCatalogModalOpen: (open: boolean) => void;
  handleAddToolToPipeline: (tool: DevOpsToolDefinition, configuredValues: Record<string, any>, targetBox?: 'CI_BOX' | 'CD_BOX') => void;
  activePipelineToolIds: string[];
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  activeMainTab: 'WORKFLOW' | 'AGENTS' | 'QA_LAB' | 'SOLO_ARENA' | 'KEY_POOL';
  setActiveMainTab: (tab: 'WORKFLOW' | 'AGENTS' | 'QA_LAB' | 'SOLO_ARENA' | 'KEY_POOL') => void;
  handlePushCodeRunAll: () => void;
  isRunningAll: boolean;
  isNodeConfigDrawerOpen: boolean;
  setIsNodeConfigDrawerOpen: (open: boolean) => void;
  activeConfigNodeId: string | null;
  selectedNodeId: string;
  selectedNode: WorkflowNode | undefined;
}

export const WorkflowModalsHub: React.FC<WorkflowModalsHubProps> = ({
  theme,
  setTheme,
  selectedAgentForModal,
  agentLogs,
  isAgentModalOpen,
  setIsAgentModalOpen,
  activeSoloBattle,
  soloBattleRepo,
  soloBattleAgent,
  isSoloModalOpen,
  setIsSoloModalOpen,
  modalArtifact,
  setModalArtifact,
  isConfigModalOpen,
  setIsConfigModalOpen,
  sysConfig,
  fetchLocalProjects,
  isDocsModalOpen,
  setIsDocsModalOpen,
  isCatalogModalOpen,
  setIsCatalogModalOpen,
  handleAddToolToPipeline,
  activePipelineToolIds,
  isChatOpen,
  setIsChatOpen,
  activeMainTab,
  setActiveMainTab,
  handlePushCodeRunAll,
  isRunningAll,
  isNodeConfigDrawerOpen,
  setIsNodeConfigDrawerOpen,
  activeConfigNodeId,
  selectedNodeId,
  selectedNode
}) => {
  return (
    <>
      {/* Floating AI Prompt Copilot Trigger Button */}
      <button
        type="button"
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-20 md:bottom-8 right-5 z-40 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
        title="Mở AI Prompt Terminal (Ctrl + K)"
      >
        <Sparkles className="w-4 h-4 animate-spin" />
        <span className="tracking-wide">Prompt AI Squad</span>
        <span className="hidden sm:inline text-[10px] font-mono bg-white/20 px-1.5 py-0.5 rounded border border-white/30">Ctrl+K</span>
      </button>

      {/* Agent Log Inspector Modal */}
      <AgentLogInspectorModal
        agent={selectedAgentForModal}
        logs={agentLogs}
        onClose={() => setIsAgentModalOpen(false)}
      />

      {/* Solo Arena 1v1 Modal */}
      <AgentSoloArenaModal
        battleResult={activeSoloBattle}
        repo={soloBattleRepo}
        agent={soloBattleAgent}
        onClose={() => setIsSoloModalOpen(false)}
        onConfirmHire={() => {
          setIsSoloModalOpen(false);
          alert('Đã duyệt tích hợp kỹ năng mới vào Agent Squad!');
        }}
      />

      {/* Artifact Inspector Modal */}
      <ArtifactInspectorModal
        isOpen={modalArtifact.isOpen}
        onClose={() => setModalArtifact(prev => ({ ...prev, isOpen: false }))}
        title={modalArtifact.title}
        artifactName={modalArtifact.artifactName}
        format={modalArtifact.format}
        content={modalArtifact.content}
        sourceNodeName={modalArtifact.sourceNodeName}
      />

      {/* Infrastructure Configuration Modal */}
      <InfrastructureConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        initialConfig={sysConfig}
        onOpenCatalog={() => setIsCatalogModalOpen(true)}
        onSaved={fetchLocalProjects}
      />

      {/* Documentation Modal */}
      <DocumentationModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
        theme={theme}
      />

      {/* Dynamic Open Source Tool Catalog Modal */}
      <DynamicToolCatalogModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        onAddToolToPipeline={handleAddToolToPipeline}
        activePipelineToolIds={activePipelineToolIds}
        theme={theme}
      />

      {/* Agent Squad Chat Terminal */}
      <AgentSquadChatTerminal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenTab={setActiveMainTab}
        onRunPipeline={handlePushCodeRunAll}
        theme={theme}
      />

      {/* Touch-First Mobile Bottom Navigation Bar (< 768px) */}
      <MobileBottomNavigation
        activeTab={activeMainTab}
        onTabChange={setActiveMainTab}
        onRunPipeline={handlePushCodeRunAll}
        isRunning={isRunningAll}
        theme={theme}
        onToggleTheme={() => setTheme(curr => curr === 'light' ? 'dark' : 'light')}
        onOpenConfig={() => setIsConfigModalOpen(true)}
        onOpenDocs={() => setIsDocsModalOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Node Quick-Config & Live Ping Drawer */}
      <NodeQuickConfigDrawer
        isOpen={isNodeConfigDrawerOpen}
        onClose={() => setIsNodeConfigDrawerOpen(false)}
        nodeId={activeConfigNodeId || selectedNodeId}
        nodeName={selectedNode?.name || ''}
        nodeCategory={selectedNode?.details.gateName || selectedNode?.category || ''}
        onSaveConfig={(nId, values) => {
          console.log('Saved config for node', nId, values);
        }}
        theme={theme}
      />
    </>
  );
};
