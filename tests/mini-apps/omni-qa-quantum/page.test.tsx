import { describe, it, expect, mock, beforeEach } from 'bun:test';
import { render, fireEvent, act } from '@testing-library/react';

// Mock framer-motion to avoid exit animation delays in unit tests
mock.module('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock xyflow to avoid SVG / layout dependencies in happy-dom
mock.module('@xyflow/react', () => ({
  ReactFlow: ({ children, nodes, edges }: any) => (
    <div
      data-testid="mock-reactflow"
      data-nodes={JSON.stringify(nodes?.map((n: any) => ({ id: n.id, style: n.style })))}
      data-edges-count={edges?.length}
    >
      {children}
    </div>
  ),
  Background: () => <div data-testid="mock-background" />,
  Controls: () => <div data-testid="mock-controls" />,
  MarkerType: { ArrowClosed: 'arrowclosed' },
  useNodesState: (initial: any) => [initial, () => {}],
  useEdgesState: (initial: any) => [initial, () => {}],
}));

import OmniQAQuantum from '@/app/projects/(micro-apps)/omni-qa-quantum/page';

describe('OmniQAQuantum Micro-App Suite', () => {
  beforeEach(() => {
    // any setup needed
  });

  it('should render header with title and 3 quantum tabs', () => {
    const { getByText } = render(<OmniQAQuantum />);

    expect(getByText('OmniQA', { exact: false })).toBeInTheDocument();
    expect(getByText('Phase 5', { exact: false })).toBeInTheDocument();
    expect(getByText('Ecosystem & Swarm Intelligence', { exact: false })).toBeInTheDocument();

    expect(getByText('Swarm Debugger', { exact: false })).toBeInTheDocument();
    expect(getByText('Omni-Bridge', { exact: false })).toBeInTheDocument();
    expect(getByText('Generative Sandbox', { exact: false })).toBeInTheDocument();
  });

  it('should default to Swarm Debugger and handle swarm deployment', () => {
    const { getByRole, getByText } = render(<OmniQAQuantum />);

    const deployBtn = getByRole('button', { name: /Deploy Agent Swarm/i });
    expect(deployBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(deployBtn);
    });

    expect(getByRole('button', { name: /Swarm Deployed/i })).toBeDisabled();
    expect(getByText('Swarm Status')).toBeInTheDocument();
    expect(getByText('5 Specialized Agents Active')).toBeInTheDocument();
  });

  it('should switch to Omni-Bridge and toggle Stripe Outage resilience mode', () => {
    const { getByText, queryByText } = render(<OmniQAQuantum />);

    // Switch to Omni-Bridge tab
    const bridgeTab = getByText('Omni-Bridge', { exact: false });
    act(() => {
      fireEvent.click(bridgeTab);
    });

    expect(getByText('Cross-Enterprise State Mapping')).toBeInTheDocument();
    expect(getByText('Simulate Stripe Outage', { exact: false })).toBeInTheDocument();
    expect(queryByText('Vendor Dependency Risk')).toBeNull();

    // Toggle outage simulation
    const outageBtn = getByText('Simulate Stripe Outage', { exact: false });
    act(() => {
      fireEvent.click(outageBtn);
    });

    // Outage active
    expect(getByText('Restore Stripe API', { exact: false })).toBeInTheDocument();
    expect(getByText('Vendor Dependency Risk')).toBeInTheDocument();
    expect(getByText('Medium (Degraded)')).toBeInTheDocument();
    expect(getByText('Fallback State Success')).toBeInTheDocument();
    expect(getByText('100% Active')).toBeInTheDocument();
    expect(getByText('SLA Violation')).toBeInTheDocument();

    // Restore Stripe
    act(() => {
      fireEvent.click(getByText('Restore Stripe API', { exact: false }));
    });
    expect(getByText('Simulate Stripe Outage', { exact: false })).toBeInTheDocument();
    expect(queryByText('Vendor Dependency Risk')).toBeNull();
  });

  it('should switch to Generative Sandbox tab and handle promo code input', () => {
    let timeoutCb: any = null;
    const origSetTimeout = global.setTimeout;
    global.setTimeout = ((cb: any, d: number) => {
      timeoutCb = cb;
      return origSetTimeout(cb, d);
    }) as any;

    const { getByText, getByPlaceholderText, unmount } = render(<OmniQAQuantum />);

    try {
      const genTab = getByText('Generative Sandbox', { exact: false });
      act(() => {
        fireEvent.click(genTab);
      });

      expect(getByText('Generative Manifestation')).toBeInTheDocument();
      expect(getByText('Your Cart')).toBeInTheDocument();
      expect(getByText('Generative UI Confidence')).toBeInTheDocument();

      const input = getByPlaceholderText('Enter code...');
      expect(input).toBeInTheDocument();

      act(() => {
        fireEvent.change(input, { target: { value: 'SUMMER20' } });
      });
      expect(input).toHaveValue('SUMMER20');

      if (timeoutCb) {
        act(() => {
          timeoutCb();
        });
      }
    } finally {
      global.setTimeout = origSetTimeout;
    }

    unmount();
  });

  it('should process all swarm events, show intelligence logs, and transition to resolved state with auto-patch', () => {
    const timeouts: Array<{ cb: any; delay: number }> = [];
    const originalSetTimeout = global.setTimeout;
    global.setTimeout = ((cb: any, delay: number) => {
      timeouts.push({ cb, delay });
      return timeouts.length as any;
    }) as any;

    try {
      const { getByRole, getByText } = render(<OmniQAQuantum />);
      const deployBtn = getByRole('button', { name: /Deploy Agent Swarm/i });
      act(() => {
        fireEvent.click(deployBtn);
      });

      expect(timeouts.length).toBe(6);

      // Execute all 6 events in sequence
      act(() => {
        timeouts.forEach(item => item.cb());
      });

      // Verify log messages are rendered
      expect(getByText(/Critical Outage detected at Payment API/)).toBeInTheDocument();
      expect(getByText(/Analyzing Ledger DB locks/)).toBeInTheDocument();
      expect(getByText(/Root cause isolated/)).toBeInTheDocument();

      // Resolved state shows "Apply Auto-Patch" button
      expect(getByText('Apply Auto-Patch')).toBeInTheDocument();
    } finally {
      global.setTimeout = originalSetTimeout;
    }
  });
});
