import { describe, it, expect, mock, beforeEach, afterEach } from 'bun:test';
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

// Mock xyflow to avoid SVG / layout dependencies in happy-dom
mock.module('@xyflow/react', () => ({
  ReactFlow: ({ children, nodes, edges }: any) => (
    <div data-testid="mock-reactflow" data-nodes-count={nodes?.length} data-edges-count={edges?.length}>
      {children}
    </div>
  ),
  Background: () => <div data-testid="mock-background" />,
  Controls: () => <div data-testid="mock-controls" />,
  MarkerType: { ArrowClosed: 'arrowclosed' },
  useNodesState: (initial: any) => [initial, () => {}],
  useEdgesState: (initial: any) => [initial, () => {}],
}));

import OmniQAApp from '@/app/projects/(micro-apps)/omni-qa/page';
import { Sidebar } from '@/app/projects/(micro-apps)/omni-qa/components/Sidebar';
import { RiskCalculator } from '@/app/projects/(micro-apps)/omni-qa/components/RiskCalculator';
import { MCPSimulator } from '@/app/projects/(micro-apps)/omni-qa/components/MCPSimulator';
import { QAScorecard } from '@/app/projects/(micro-apps)/omni-qa/components/QAScorecard';

describe('OmniQA Micro-App Suite', () => {
  beforeEach(() => {
    // any setup needed
  });

  it('should render Sidebar with all 5 menu options and highlight active item', () => {
    const setActiveModuleMock = mock();
    const { getByText } = render(
      <Sidebar activeModule="intent" setActiveModule={setActiveModuleMock} />
    );

    const intentBtn = getByText('Intent-to-State');
    const diffBtn = getByText('Visual Diff Audit');
    const mcpBtn = getByText('MCP Self-Healing');
    const riskBtn = getByText('Risk & Tech Debt');
    const pmsBtn = getByText('QA PMS Sync');

    expect(intentBtn).toBeInTheDocument();
    expect(diffBtn).toBeInTheDocument();
    expect(mcpBtn).toBeInTheDocument();
    expect(riskBtn).toBeInTheDocument();
    expect(pmsBtn).toBeInTheDocument();

    // Clicking diff button calls setActiveModule with 'diff'
    fireEvent.click(diffBtn);
    expect(setActiveModuleMock).toHaveBeenCalledWith('diff');

    // Clicking risk button calls setActiveModule with 'risk'
    fireEvent.click(riskBtn);
    expect(setActiveModuleMock).toHaveBeenCalledWith('risk');
  });

  it('should switch modules in OmniQAApp when clicking sidebar items', () => {
    const { getByText, queryByText } = render(<OmniQAApp />);

    // Default is IntentEngine
    expect(getByText('Intent-to-State Engine')).toBeInTheDocument();

    // Switch to Visual Diff Audit
    act(() => {
      fireEvent.click(getByText('Visual Diff Audit'));
    });
    expect(getByText('Visual Audit Diff')).toBeInTheDocument();
    expect(queryByText('Intent-to-State Engine')).toBeNull();

    // Switch to MCP Self-Healing
    act(() => {
      fireEvent.click(getByText('MCP Self-Healing'));
    });
    expect(getByText('MCP Self-Healing Simulator')).toBeInTheDocument();

    // Switch to Risk & Tech Debt
    act(() => {
      fireEvent.click(getByText('Risk & Tech Debt'));
    });
    expect(getByText('Risk-Based Testing & Tech Debt')).toBeInTheDocument();

    // Switch to QA PMS Sync
    act(() => {
      fireEvent.click(getByText('QA PMS Sync'));
    });
    expect(getByText('QA Performance & PMS Sync')).toBeInTheDocument();
  });

  it('should display complete risk metrics in RiskCalculator', () => {
    const { getByText } = render(<RiskCalculator />);

    expect(getByText('New Test Cases Required')).toBeInTheDocument();
    expect(getByText('42')).toBeInTheDocument();

    expect(getByText('Est. Testing Time')).toBeInTheDocument();
    expect(getByText('18')).toBeInTheDocument();

    expect(getByText('Cost of Change')).toBeInTheDocument();
    expect(getByText('$1,250')).toBeInTheDocument();

    // Risk weightings
    expect(getByText('High Risk (Financial/Auth)')).toBeInTheDocument();
    expect(getByText('28 Cases')).toBeInTheDocument();

    expect(getByText('Medium Risk (Business Logic)')).toBeInTheDocument();
    expect(getByText('10 Cases')).toBeInTheDocument();

    expect(getByText('Low Risk (UI/View)')).toBeInTheDocument();
    expect(getByText('4 Cases')).toBeInTheDocument();
  });

  it('should handle MCPSimulator run button and log simulation steps', () => {
    const { getByText } = render(<MCPSimulator />);

    const runBtn = getByText('Run Autonomous Test');
    expect(runBtn).toBeInTheDocument();
    expect(getByText("Click 'Run Autonomous Test' to begin MCP simulation.")).toBeInTheDocument();

    act(() => {
      fireEvent.click(runBtn);
    });

    expect(getByText('Agent is running...')).toBeInTheDocument();
  });

  it('should render QAScorecard leaderboard and handle sync button', () => {
    const { getByText } = render(<QAScorecard />);

    expect(getByText('Sarah Connor')).toBeInTheDocument();
    expect(getByText('John Smith')).toBeInTheDocument();
    expect(getByText('Alex Wong')).toBeInTheDocument();

    const syncBtn = getByText('Sync to HRM / PMS');
    expect(syncBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(syncBtn);
    });

    expect(getByText('Syncing to HRM...')).toBeInTheDocument();
  });

  it('should render VersionDiff component with nodes, edges and commit history', () => {
    const { VersionDiff } = require('@/app/projects/(micro-apps)/omni-qa/components/VersionDiff');
    const { getByText, getByTestId } = render(<VersionDiff />);

    expect(getByText('Visual Audit Diff')).toBeInTheDocument();
    expect(getByText('Comparing main branch with AI proposed changes')).toBeInTheDocument();
    expect(getByText('Commit History')).toBeInTheDocument();
    expect(getByText('AI Agent (OmniQA)')).toBeInTheDocument();
    expect(getByText('Dev Team')).toBeInTheDocument();
    expect(getByTestId('mock-reactflow')).toBeInTheDocument();
  });

  it('should handle IntentEngine form input and submission with timer', () => {
    const { IntentEngine } = require('@/app/projects/(micro-apps)/omni-qa/components/IntentEngine');
    let timeoutCb: any;
    const originalSetTimeout = global.setTimeout;
    global.setTimeout = ((cb: any, delay: number) => {
      timeoutCb = cb;
      return 1 as any;
    }) as any;

    try {
      const { getByPlaceholderText, getByText, getByTestId } = render(<IntentEngine />);
      const input = getByPlaceholderText(/เพิ่มระบบตรวจสอบ/);
      const submitBtn = getByText('Generate State');

      // Empty submission should not trigger typing
      fireEvent.submit(submitBtn.closest('form')!);
      expect(getByText('Generate State')).toBeInTheDocument();

      // Enter prompt
      act(() => {
        fireEvent.change(input, { target: { value: 'Add cashback check' } });
      });

      // Submit form
      act(() => {
        fireEvent.submit(submitBtn.closest('form')!);
      });

      // Should show Thinking...
      expect(getByText('Thinking...')).toBeInTheDocument();

      // Trigger the AI mock timeout
      act(() => {
        timeoutCb();
      });

      // After timeout, input is cleared and new nodes/edges are updated
      expect(input).toHaveValue('');
      expect(getByText('Generate State')).toBeInTheDocument();
      const rf = getByTestId('mock-reactflow');
      expect(rf.getAttribute('data-nodes-count')).toBe('4');
      expect(rf.getAttribute('data-edges-count')).toBe('3');
    } finally {
      global.setTimeout = originalSetTimeout;
    }
  });

  it('should process full simulation steps in MCPSimulator with timeouts', () => {
    const timeoutCbs: Array<{ cb: any; delay: number }> = [];
    const originalSetTimeout = global.setTimeout;
    global.setTimeout = ((cb: any, delay: number) => {
      timeoutCbs.push({ cb, delay });
      return timeoutCbs.length as any;
    }) as any;

    try {
      const { getByText, queryByText } = render(<MCPSimulator />);
      const runBtn = getByText('Run Autonomous Test');

      act(() => {
        fireEvent.click(runBtn);
      });

      expect(getByText('Agent is running...')).toBeInTheDocument();
      expect(timeoutCbs.length).toBe(9);

      // Execute all step callbacks in sequence
      act(() => {
        timeoutCbs.forEach(item => item.cb());
      });

      // After last step, isRunning is false and logs are present
      expect(getByText('Run Autonomous Test')).toBeInTheDocument();
      expect(getByText('Initializing OmniQA Autonomous Agent...')).toBeInTheDocument();
      expect(getByText('Connecting to MCP Server: [UI_Inspector_v2]')).toBeInTheDocument();
      expect(getByText('Executing Path: Start -> Process Payment -> Verify Cashback')).toBeInTheDocument();
      expect(getByText('⚠️ ALERT: Target button #btn-cashback not found in DOM.')).toBeInTheDocument();
      expect(getByText('Self-Healing Initiated: Invoking Vision LLM to locate button by semantic meaning.')).toBeInTheDocument();
      expect(getByText('Vision LLM: Button text changed to "Redeem CB". Auto-updating selector...')).toBeInTheDocument();
      expect(getByText('Test step passed using self-healed selector.')).toBeInTheDocument();
      expect(getByText('Transitioned to State: Generate Receipt')).toBeInTheDocument();
      expect(getByText('All E2E flows executed successfully.')).toBeInTheDocument();
    } finally {
      global.setTimeout = originalSetTimeout;
    }
  });

  it('should handle full QAScorecard sync cycle with timeout transitions', () => {
    const timeouts: Array<{ cb: any; delay: number }> = [];
    const originalSetTimeout = global.setTimeout;
    global.setTimeout = ((cb: any, delay: number) => {
      timeouts.push({ cb, delay });
      return timeouts.length as any;
    }) as any;

    try {
      const { getByText } = render(<QAScorecard />);
      const syncBtn = getByText('Sync to HRM / PMS');

      act(() => {
        fireEvent.click(syncBtn);
      });

      expect(getByText('Syncing to HRM...')).toBeInTheDocument();

      // Trigger first timeout (sync complete -> synced: true)
      act(() => {
        timeouts[0].cb();
      });

      expect(getByText('Synced to Payroll')).toBeInTheDocument();

      // Trigger second timeout (reset synced: false)
      act(() => {
        timeouts[1].cb();
      });

      expect(getByText('Sync to HRM / PMS')).toBeInTheDocument();
    } finally {
      global.setTimeout = originalSetTimeout;
    }
  });
});
