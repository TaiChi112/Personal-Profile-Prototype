export interface AgenticGraphNodeRef {
  id: string;
  label: string;
}

export interface AgenticGraphEdgeRef {
  id: string;
  source: string;
  target: string;
}

export interface AgenticTestingPatch {
  nodesToAdd: Array<{ id: string; label: string }>;
  edgesToAdd: Array<{ id: string; source: string; target: string }>;
  edgesToRemove: string[];
  impact: {
    testCasesAdded: number;
    complexityIncrease: number;
    logMessage: string;
  };
}

/**
 * Deterministic fallback engine shared by /api/agentic-testing/intent (FALLBACK_TRIGGERED)
 * and the browser LOCAL_ONLY toggle.
 */
export function buildDeterministicAgenticPatch(
  prompt: string,
  currentNodes: AgenticGraphNodeRef[],
  currentEdges: AgenticGraphEdgeRef[],
): AgenticTestingPatch {
  const lower = prompt.toLowerCase();
  let label = "Verification Gate";
  let testCasesAdded = 4;
  let complexityIncrease = 12;

  if (
    lower.includes("2fa") ||
    lower.includes("otp") ||
    lower.includes("auth")
  ) {
    label = "2FA / OTP Check";
    testCasesAdded = 5;
    complexityIncrease = 18;
  } else if (
    lower.includes("kyc") ||
    lower.includes("fraud") ||
    lower.includes("risk")
  ) {
    label = "Fraud & KYC Audit";
    testCasesAdded = 6;
    complexityIncrease = 22;
  } else if (
    lower.includes("review") ||
    lower.includes("approval") ||
    lower.includes("hitl")
  ) {
    label = "Manual HITL Review";
    testCasesAdded = 4;
    complexityIncrease = 15;
  } else if (lower.includes("retry") || lower.includes("webhook")) {
    label = "Webhook Retry Queue";
    testCasesAdded = 3;
    complexityIncrease = 10;
  }

  const newNodeId = `node-local-${currentNodes.length + 1}`;
  const firstEdge = currentEdges[0];

  if (firstEdge) {
    return {
      nodesToAdd: [{ id: newNodeId, label }],
      edgesToAdd: [
        {
          id: `e-${firstEdge.source}-${newNodeId}`,
          source: firstEdge.source,
          target: newNodeId,
        },
        {
          id: `e-${newNodeId}-${firstEdge.target}`,
          source: newNodeId,
          target: firstEdge.target,
        },
      ],
      edgesToRemove: [firstEdge.id],
      impact: {
        testCasesAdded,
        complexityIncrease,
        logMessage: `Inserted "${label}" between ${firstEdge.source} and ${firstEdge.target} (Local Deterministic Engine).`,
      },
    };
  }

  const anchorId = currentNodes[0]?.id ?? "1";
  return {
    nodesToAdd: [{ id: newNodeId, label }],
    edgesToAdd: [
      {
        id: `e-${anchorId}-${newNodeId}`,
        source: anchorId,
        target: newNodeId,
      },
    ],
    edgesToRemove: [],
    impact: {
      testCasesAdded,
      complexityIncrease,
      logMessage: `Appended "${label}" after ${anchorId} (Local Deterministic Engine).`,
    },
  };
}
