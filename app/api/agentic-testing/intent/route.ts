import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, currentNodes, currentEdges } = await req.json();

    const result = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: z.object({
        nodesToAdd: z.array(z.object({
          id: z.string(),
          label: z.string(),
        })).describe("New nodes to add to the state machine"),
        edgesToAdd: z.array(z.object({
          id: z.string(),
          source: z.string(),
          target: z.string()
        })).describe("New edges connecting nodes"),
        edgesToRemove: z.array(z.string()).describe("IDs of existing edges that should be removed (e.g., if a new node was inserted between two existing nodes)"),
        impact: z.object({
          testCasesAdded: z.number().describe("Estimated number of new test cases required"),
          complexityIncrease: z.number().describe("Estimated percentage increase in system complexity"),
          logMessage: z.string().describe("A short explanation of what was modified")
        })
      }),
      prompt: `
        You are an expert AI Software Architect modifying a State Machine (React Flow) diagram based on a user's natural language request.
        
        Current Nodes: ${JSON.stringify(currentNodes.map((n: any) => ({ id: n.id, label: n.data.label })))}
        Current Edges: ${JSON.stringify(currentEdges.map((e: any) => ({ id: e.id, source: e.source, target: e.target })))}
        
        User Intent: "${prompt}"
        
        INSTRUCTIONS:
        1. Determine how to modify the graph to fulfill the user's request.
        2. Always generate a unique ID for new nodes (e.g., "node-" + random number).
        3. If the user asks to insert a step BETWEEN existing node A and node B:
           - Add the new node.
           - Add a new edge from A to the new node.
           - Add a new edge from the new node to B.
           - You MUST include the ID of the old edge connecting A and B in "edgesToRemove" so it gets deleted.
        4. Keep labels concise (max 4 words).
        5. Provide a realistic estimate of how this impacts testing (testCasesAdded) and complexity (complexityIncrease).
      `,
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error('Agentic Intent Error:', error);
    return NextResponse.json({ error: 'Failed to process intent' }, { status: 500 });
  }
}
