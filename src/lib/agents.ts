// Agent System; multi-agent orchestration for FreeLeased.
//
// Six specialized agents with structured handoff and parallel execution.
// Each agent has a specific role, tools, model, and cost profile.
// The orchestrator routes tasks, manages handoffs, and reconciles outputs.
//
// This is the intelligence layer that makes the system a team, not a tool.

// ── Agent Definitions ─────────────────────────────────────────────

export type AgentRole =
  | "planner"
  | "researcher"
  | "analyzer"
  | "drafter"
  | "critic"
  | "auditor";

export interface AgentDefinition {
  role: AgentRole;
  description: string;
  model: string; // OpenRouter model ID
  costPerQuery: number; // USD
  tools: string[];
  constraints: string[];
}

export const AGENTS: Record<AgentRole, AgentDefinition> = {
  planner: {
    role: "planner",
    description: "Break requests into tasks, assign to other agents, manage priorities",
    model: "nousresearch/hermes-3-llama-3.1-8b",
    costPerQuery: 0.0003,
    tools: ["task_decomposition", "priority_assignment", "dependency_tracking"],
    constraints: [
      "Must produce structured JSON output",
      "Cannot execute tasks directly",
      "Must assign to appropriate specialist agents",
    ],
  },
  researcher: {
    role: "researcher",
    description: "Find relevant legislation, precedents, patterns across jurisdictions",
    model: "nousresearch/hermes-3-llama-3.1-8b",
    costPerQuery: 0.0005,
    tools: ["legislation_search", "case_law_search", "cross_jurisdiction_lookup", "rag_query"],
    constraints: [
      "Must cite sources for every claim",
      "Cannot make legal conclusions",
      "Must flag uncertainty levels",
    ],
  },
  analyzer: {
    role: "analyzer",
    description: "Apply legal rules to user's situation, calculate thresholds, assess eligibility",
    model: "meta-llama/llama-3.1-70b-instruct",
    costPerQuery: 0.008,
    tools: ["rule_application", "threshold_calculation", "eligibility_assessment", "pattern_matching"],
    constraints: [
      "Must reference specific statutes",
      " Cannot exceed evidence class confidence caps",
      "Must flag contested interpretations",
    ],
  },
  drafter: {
    role: "drafter",
    description: "Write reports, letters, applications, compliance statements",
    model: "nousresearch/hermes-3-llama-3.1-8b",
    costPerQuery: 0.0003,
    tools: ["template_selection", "content_generation", "formatting", "citation_insertion"],
    constraints: [
      "Must use UK English",
      " Must include all required citations",
      "Must follow document templates",
    ],
  },
  critic: {
    role: "critic",
    description: "Review output for errors, risks, completeness, compliance",
    model: "meta-llama/llama-3.1-70b-instruct",
    costPerQuery: 0.008,
    tools: ["fact_checking", "completeness_check", "risk_assessment", "compliance_review"],
    constraints: [
      "Must identify all errors",
      " Cannot approve without evidence",
      "Must flag risks with severity levels",
    ],
  },
  auditor: {
    role: "auditor",
    description: "Validate deterministically; no LLM, pure code",
    model: "deterministic",
    costPerQuery: 0,
    tools: ["schema_validation", "rule_checking", "audit_logging", "cost_tracking"],
    constraints: [
      "No LLM inference; pure code only",
      " Must log every decision",
      "Must enforce evidence class caps",
    ],
  },
};

// ── Agent Messages ────────────────────────────────────────────────

export type MessageType =
  | "task"
  | "result"
  | "question"
  | "error"
  | "escalation";

export interface AgentMessage {
  id: string;
  from: AgentRole;
  to: AgentRole | "orchestrator";
  type: MessageType;
  taskId: string;
  content: Record<string, unknown>;
  timestamp: Date;
  confidence?: number;
  evidenceClass?: string;
  citations?: string[];
}

// ── Task Definition ───────────────────────────────────────────────

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "failed"
  | "escalated";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo: AgentRole[];
  completedBy?: AgentRole;
  result?: Record<string, unknown>;
  error?: string;
  confidence?: number;
  evidenceClass?: string;
  citations?: string[];
  cost: number;
  messages: AgentMessage[];
  createdAt: Date;
  completedAt?: Date;
}

// ── The Orchestrator ──────────────────────────────────────────────

export class AgentOrchestrator {
  private tasks: Map<string, Task> = new Map();
  private messageLog: AgentMessage[] = [];
  private totalCost = 0;
  private taskCounter = 0;

  /**
   * Create a new task and route it to the appropriate agents.
   */
  async createTask(
    title: string,
    description: string,
    routeTo: AgentRole[] = ["planner"],
  ): Promise<Task> {
    this.taskCounter++;
    const taskId = `task_${this.taskCounter}_${Date.now()}`;
    const task: Task = {
      id: taskId,
      title,
      description,
      status: "pending",
      assignedTo: routeTo,
      cost: 0,
      messages: [],
      createdAt: new Date(),
    };

    this.tasks.set(taskId, task);

    // Send initial task message
    this.addMessage({
      id: `msg_${Date.now()}`,
      from: "orchestrator",
      to: routeTo[0],
      type: "task",
      taskId,
      content: { title, description, assignedTo: routeTo },
      timestamp: new Date(),
    });

    return task;
  }

  /**
   * Execute a task through the agent pipeline.
   * This is the main execution loop.
   */
  async executeTask(taskId: string): Promise<Task> {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);

    task.status = "in_progress";

    try {
      // Step 1: Planner decomposes the task
      const plan = await this.executeAgent("planner", task, {
        action: "decompose",
        title: task.title,
        description: task.description,
      });

      // Step 2: Researcher finds relevant information
      const research = await this.executeAgent("researcher", task, {
        action: "research",
        plan,
        jurisdiction: task.description.includes("UK") ? "UK" : "all",
      });

      // Step 3: Analyzer applies rules
      const analysis = await this.executeAgent("analyzer", task, {
        action: "analyze",
        research,
        plan,
      });

      // Step 4: Drafter produces output
      const draft = await this.executeAgent("drafter", task, {
        action: "draft",
        analysis,
        research,
        plan,
      });

      // Step 5: Critic reviews
      const review = await this.executeAgent("critic", task, {
        action: "review",
        draft,
        analysis,
        research,
      });

      // Step 6: Auditor validates deterministically
      const audit = await this.executeAgent("auditor", task, {
        action: "audit",
        draft,
        review,
        analysis,
      });

      // Complete the task
      task.status = "completed";
      task.result = {
        plan,
        research,
        analysis,
        draft,
        review,
        audit,
      };
      task.completedAt = new Date();

      return task;
    } catch (error) {
      task.status = "failed";
      task.error = error instanceof Error ? error.message : String(error);
      return task;
    }
  }

  /**
   * Execute a single agent with input and get output.
   */
  private async executeAgent(
    role: AgentRole,
    task: Task,
    input: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const agent = AGENTS[role];

    // For auditor, use deterministic code
    if (role === "auditor") {
      const result = this.auditDeterministically(input);
      task.cost += 0;
      this.addMessage({
        id: `msg_${Date.now()}`,
        from: role,
        to: "orchestrator",
        type: "result",
        taskId: task.id,
        content: result,
        timestamp: new Date(),
        confidence: 1,
        evidenceClass: "established",
        citations: [],
      });
      return result;
    }

    // For other agents, simulate LLM call (in production, this calls OpenRouter)
    // Partners brainstorm pick #3: when USE_MINIMAX=1 and MINIMAX_API_KEY are
    // both set, route the call through the MiniMax alt-LLM as a drop-in
    // alternative. Falls back to simulateLLMCall on any failure so the
    // agent contract is preserved.
    const result = await this.maybeCallMiniMax(role, input);
    task.cost += agent.costPerQuery;
    this.totalCost += agent.costPerQuery;

    this.addMessage({
      id: `msg_${Date.now()}`,
      from: role,
      to: "orchestrator",
      type: "result",
      taskId: task.id,
      content: result,
      timestamp: new Date(),
      confidence: result.confidence ?? 0.8,
      evidenceClass: result.evidenceClass ?? "heuristic",
      citations: result.citations ?? [],
    });

    return result;
  }

  /**
   * Optional MiniMax path (Partners brainstorm pick #3). When
   * `USE_MINIMAX=1` and `MINIMAX_API_KEY` are both set, this calls the
   * MiniMax wrapper with a system+user prompt derived from the role.
   * On any failure (no key, network error, parse error) it falls back
   * to the deterministic `simulateLLMCall()` so the agent contract is
   * unchanged.
   *
   * The default code path stays deterministic — MiniMax is opt-in via
   * the env flag. Nothing about the agent's return shape changes with
   * or without the key.
   */
  private async maybeCallMiniMax(
    role: AgentRole,
    input: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const useMiniMax = process.env.USE_MINIMAX === "1";
    const keySet = (process.env.MINIMAX_API_KEY ?? "").trim() !== "" &&
      (process.env.MINIMAX_API_KEY ?? "").trim() !== "your_minimax_api_key_here";
    if (!useMiniMax || !keySet) {
      return this.simulateLLMCall(role, input);
    }
    try {
      // Lazy import so agents.ts stays usable in environments that never
      // enable MiniMax.
      const { callMiniMax } = await import("./minimax");
      const system = `You are a ${role} agent in the FreeLeased multi-agent system. Respond in compact JSON with at least { confidence: number, evidenceClass: string }.`;
      const user = JSON.stringify(input).slice(0, 6000);
      const r = await callMiniMax({ system, user, maxTokens: 600 });
      if (!r.ok) return this.simulateLLMCall(role, input);
      const jsonStart = r.text.indexOf("{");
      const jsonEnd = r.text.lastIndexOf("}");
      if (jsonStart === -1 || jsonEnd === -1) return this.simulateLLMCall(role, input);
      const parsed = JSON.parse(r.text.slice(jsonStart, jsonEnd + 1)) as Record<string, unknown>;
      // Mirror the agent's confidence / evidenceClass fields.
      return {
        ...parsed,
        confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.7,
        evidenceClass:
          typeof parsed.evidenceClass === "string" ? parsed.evidenceClass : "heuristic",
        engine: "minimax",
      };
    } catch {
      // Any failure → fallback to deterministic path.
      return this.simulateLLMCall(role, input);
    }
  }

  /**
   * Simulate LLM call (placeholder for OpenRouter integration).
   */
  private simulateLLMCall(
    role: AgentRole,
    input: Record<string, unknown>,
  ): Record<string, unknown> {
    // In production, this calls OpenRouter with the agent's model
    // For now, return simulated results based on role
    const agent = AGENTS[role];

    switch (role) {
      case "planner":
        return {
          tasks: [
            { id: "t1", title: "Research relevant legislation", agent: "researcher" },
            { id: "t2", title: "Analyze user situation", agent: "analyzer" },
            { id: "t3", title: "Draft response", agent: "drafter" },
            { id: "t4", title: "Review for accuracy", agent: "critic" },
          ],
          confidence: 0.9,
          evidenceClass: "established",
        };

      case "researcher":
        return {
          statutes: ["Landlord and Tenant Act 1985", "Commonhold and Leasehold Reform Act 2002"],
          precedents: ["Case Law Reference 1"],
          patterns: ["Service charge consultation required"],
          confidence: 0.85,
          evidenceClass: "heuristic",
          citations: ["https://legislation.gov.uk/ukpga/1985/70"],
        };

      case "analyzer":
        return {
          findings: [
            { rule: "s.20 consultation", applies: true, confidence: 0.9 },
            { rule: "s.20C costs", applies: true, confidence: 0.85 },
          ],
          confidence: 0.88,
          evidenceClass: "established",
          citations: ["https://legislation.gov.uk/ukpga/1985/70/section/20"],
        };

      case "drafter":
        return {
          document: "Draft report based on analysis...",
          format: "formal",
          wordCount: 450,
          confidence: 0.8,
          evidenceClass: "heuristic",
        };

      case "critic":
        return {
          errors: [],
          risks: [
            { level: "low", description: "Jurisdiction-specific interpretation may vary" },
          ],
          completeness: 0.9,
          confidence: 0.85,
          evidenceClass: "heuristic",
        };

      default:
        return { confidence: 0.7, evidenceClass: "heuristic" };
    }
  }

  /**
   * Deterministic audit; no LLM, pure code.
   */
  private auditDeterministically(input: Record<string, unknown>): Record<string, unknown> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    if (!input.draft) errors.push("Missing draft");
    if (!input.analysis) errors.push("Missing analysis");
    if (!input.review) warnings.push("Missing review (non-critical)");

    // Check confidence levels
    const analysis = input.analysis as Record<string, unknown>;
    if (analysis && typeof analysis.confidence === "number" && analysis.confidence < 0.5) {
      warnings.push("Low confidence in analysis");
    }

    return {
      passed: errors.length === 0,
      errors,
      warnings,
      auditTimestamp: new Date(),
      confidence: 1,
      evidenceClass: "established",
    };
  }

  /**
   * Add a message to the log.
   */
  private addMessage(message: AgentMessage): void {
    this.messageLog.push(message);
    const task = this.tasks.get(message.taskId);
    if (task) {
      task.messages.push(message);
    }
  }

  /**
   * Get task status.
   */
  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Get all tasks.
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get message log.
   */
  getMessageLog(): AgentMessage[] {
    return [...this.messageLog];
  }

  /**
   * Get cost summary.
   */
  getCostSummary(): {
    totalCost: number;
    tasksCompleted: number;
    tasksFailed: number;
    averageCostPerTask: number;
  } {
    const tasks = Array.from(this.tasks.values());
    const completed = tasks.filter(t => t.status === "completed").length;
    const failed = tasks.filter(t => t.status === "failed").length;

    return {
      totalCost: this.totalCost,
      tasksCompleted: completed,
      tasksFailed: failed,
      averageCostPerTask: completed > 0 ? this.totalCost / completed : 0,
    };
  }
}

// ── Singleton ─────────────────────────────────────────────────────

export const agentOrchestrator = new AgentOrchestrator();
