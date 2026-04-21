// Prototype
interface Prototype<T> {
    clone(): T;
}
// Concrete Prototype(Requirement)
class Requirement implements Prototype<Requirement> {
    private _id: string;
    private _description: string;
    private _priority: string;
    constructor(id: string, description: string, priority: string) {
        this._id = id;
        this._description = description;
        this._priority = priority;
    }
    public get id(): string { return this._id; }
    public get description(): string { return this._description; }
    public get priority(): string { return this._priority; }

    public clone(): Requirement {
        return new Requirement(this.id, this.description, this.priority);
    }
}
// Concrete Prototype(Milestone)
class Milestone {
    private _name: string;
    private _date: Date;
    private _deliverable: string;
    constructor(name: string, date: Date, deliverable: string) {
        this._name = name;
        this._date = date;
        this._deliverable = deliverable;
    }
    public get name(): string { return this._name; }
    public get date(): Date { return this._date; }
    public get deliverable(): string { return this._deliverable; }
    clone(): Milestone { return new Milestone(this.name, new Date(this.date), this.deliverable); }
}

// Concrete Prototype(Product)
class SDLCProjectDocument implements Prototype<SDLCProjectDocument> {
    private _name: string = "";
    private _version: string = "";
    private _lastUpdated: Date = new Date();
    private _problemStatement: string = "";
    private _stakeholders: string[] = [];
    private _functionalRequirements: Requirement[] = [];
    private _techStack: string[] = [];
    private _description: string = "";
    private _milestones: Milestone[] = [];

    constructor() { }

    public clone(): SDLCProjectDocument {
        const cloned = new SDLCProjectDocument();

        const baseName = this._name.replace(/^Copy of\s+/, '');
        cloned.name = `Copy of ${baseName}`;

        cloned.version = this._version;
        cloned.lastUpdated = new Date();
        cloned.problemStatement = this._problemStatement;
        cloned.description = this._description;

        // 2. Deep Copy Logic
        cloned.stakeholders = [...this._stakeholders];
        cloned.techStack = [...this._techStack];
        cloned.functionalRequirements = this._functionalRequirements.map(req => req.clone());
        cloned.addSingleMilestone = this.addSingleMilestone;
        this._milestones.forEach(m => cloned.addSingleMilestone(m.clone()));

        console.log(`[System] 🐇 Cloned new instance from "${this._name}"`);
        return cloned;
    }

    public get name(): string { return this._name; }
    public get version(): string { return this._version; }
    public get lastUpdated(): Date { return this._lastUpdated; }
    public get problemStatement(): string { return this._problemStatement; }
    public get description(): string { return this._description; }
    public get stakeholders(): string[] { return [...this._stakeholders]; }
    public get techStack(): string[] { return [...this._techStack]; }
    public get functionalRequirements(): Requirement[] { return this._functionalRequirements.map(r => r.clone()); }
    public get milestones(): Milestone[] { return this._milestones.map(m => m.clone()); }
    public addSingleMilestone(m: Milestone): void {
        this._milestones.push(m);
    }

    public set name(value: string) { this._name = value; }
    public set version(value: string) { this._version = value; }
    public set lastUpdated(value: Date) { this._lastUpdated = value; }
    public set problemStatement(value: string) { this._problemStatement = value; }
    public set description(value: string) { this._description = value; }

    public set stakeholders(value: string[]) { this._stakeholders = [...value]; }
    public set techStack(value: string[]) { this._techStack = [...value]; }
    public set functionalRequirements(value: Requirement[]) {
        this._functionalRequirements = value.map(r => r.clone());
    }

    public addSingleStakeholder(holder: string): void {
        this._stakeholders.push(holder);
    }

    public addSingleRequirement(req: Requirement): void {
        this._functionalRequirements.push(req);
    }

    public toString(): string {
        return `
    📁 PROJECT: ${this._name} (v${this._version})
    📅 Last Updated: ${this._lastUpdated.toLocaleDateString()}
    💡 Problem: ${this._problemStatement}
    👥 Stakeholders: ${this._stakeholders.join(', ')}
    📐 Functional Requirements: ${this._functionalRequirements.map((r) => `[${r.priority}] ${r.description}`).join(' ')}
    📋 Requirements List:
       ${this._functionalRequirements.map((r, i) => `${i + 1}. [${r.id}] ${r.description}`).join('\n       ')}
    🛠️ Tech Stack: [${this._techStack.join(', ')}]
    📝 Description: ${this._description}
    📅 Project Timeline:
       ${this._milestones.map(m => `[${m.date.toLocaleDateString()}] ${m.name} -> 📦 ${m.deliverable}`).join('\n       ')}
       `;
    }
}
// Product
class GeneratedReport {
    constructor(
        private _title: string,
        private _version: string,
        private _author: string,
        private _createdDate: Date,

        private _markdownContent: string,

        private _rawRequirements: { id: string, desc: string, priority: string }[],
        private _rawMilestones: { name: string, date: Date, deliverable: string }[],
        private _techStack: string[]
    ) { if (!this._title) throw new Error("Report title is required"); }

    public printSummary(): void {
        console.log(`📊 Report Summary: "${this._title}"`);
        console.log(`   - Requirements: ${this._rawRequirements.length} items`);
        console.log(`   - Milestones: ${this._rawMilestones.length} events`);
        console.log(`   - Stack: ${this._techStack.join(', ')}`);
    }
    public get markdownContent(): string { return this._markdownContent; }
}

// Builder
interface IBuilder<T> {
    reset(): this;
    setName(name: string): this;
    setVersion(ver: string): this;
    setUpdated(date: Date): this;
    setProblemStatement(prob: string): this;
    addStakeholder(holder: string): this;
    addRequirement(id: string, desc: string, priority: string): this;
    setTechStack(stack: string[]): this;
    setDescription(desc: string): this;
    addMilestone(name: string, date: Date, deliverable: string): this;
    build(): T;
}
// Concrete Builder
class SDLCBuilder implements IBuilder<SDLCProjectDocument> {
    private document: SDLCProjectDocument;

    constructor() {
        this.document = new SDLCProjectDocument();
    }

    public reset(): this {
        this.document = new SDLCProjectDocument();
        return this;
    }

    public setName(name: string): this { this.document.name = name; return this; }
    public setVersion(ver: string): this { this.document.version = ver; return this; }
    public setUpdated(date: Date): this { this.document.lastUpdated = date; return this; }
    public setProblemStatement(prob: string): this { this.document.problemStatement = prob; return this; }
    public setTechStack(stack: string[]): this { this.document.techStack = stack; return this; }
    public setDescription(desc: string): this { this.document.description = desc; return this; }

    public addStakeholder(holder: string): this {
        this.document.addSingleStakeholder(holder);
        return this;
    }

    public addRequirement(id: string, desc: string, priority: string): this {
        const req = new Requirement(id, desc, priority);
        this.document.addSingleRequirement(req);
        return this;
    }
    public addMilestone(name: string, date: Date, deliverable: string): this {
        const milestone = new Milestone(name, date, deliverable);
        this.document.addSingleMilestone(milestone);
        return this;
    }

    public build(): SDLCProjectDocument {
        if (!this.document.name) throw new Error("Document needs a name!");
        const result = this.document;
        this.reset();
        return result;
    }
}
// Concrete Builder
class MarkdownReportSDLCBuilder implements IBuilder<GeneratedReport> {
    private _title: string = "Untitled";
    private _version: string = "Draft";
    private _updated: Date = new Date();
    private _description: string = "";
    private _problem: string = "";

    private _stakeholders: string[] = [];
    private _techStack: string[] = [];
    private _reqs: { id: string, desc: string, priority: string }[] = [];
    private _milestones: { name: string, date: Date, deliverable: string }[] = [];

    private _mdBuffer: string = "";

    constructor() { this.reset(); }

    public reset(): this {
        this._title = "Untitled";
        this._version = "Draft";
        this._updated = new Date();
        this._description = "";
        this._problem = "";
        this._stakeholders = [];
        this._techStack = [];
        this._reqs = [];
        this._milestones = [];
        this._mdBuffer = "";
        return this;
    }
    public setName(name: string): this {
        this._title = name;
        this._mdBuffer += `# 📘 Project: ${name}\n\n`;
        return this;
    }

    public setVersion(ver: string): this {
        this._version = ver;
        this._mdBuffer += `**Version:** ${ver} `;
        return this;
    }

    public setUpdated(date: Date): this {
        this._updated = date;
        this._mdBuffer += `(Last Updated: ${date.toLocaleDateString()})\n\n`;
        return this;
    }

    public setProblemStatement(prob: string): this {
        this._problem = prob;
        this._mdBuffer += `## 💡 Problem Statement\n> ${prob}\n\n`;
        return this;
    }

    public setDescription(desc: string): this {
        this._description = desc;
        this._mdBuffer += `## 📝 Description\n${desc}\n\n`;
        return this;
    }

    public addStakeholder(holder: string): this {
        this._stakeholders.push(holder);

        if (!this._mdBuffer.includes("## 👥 Stakeholders")) {
            this._mdBuffer += `## 👥 Stakeholders\n`;
        }
        this._mdBuffer += `- ${holder}\n`;
        return this;
    }

    public addRequirement(id: string, desc: string, priority: string): this {
        this._reqs.push({ id, desc, priority });

        if (!this._mdBuffer.includes("## 📐 Requirements")) {
            this._mdBuffer += `\n## 📐 Requirements\n| ID | Description | Priority |\n|---|---|---|\n`;
        }
        this._mdBuffer += `| ${id} | ${desc} | ${priority} |\n`;
        return this;
    }

    public setTechStack(stack: string[]): this {
        this._techStack = stack;

        this._mdBuffer += `\n## 🛠️ Tech Stack\n`;
        stack.forEach(tech => {
            this._mdBuffer += `* [ ] ${tech}\n`;
        });
        return this;
    }

    public addMilestone(name: string, date: Date, deliverable: string): this {
        this._milestones.push({ name, date, deliverable });

        if (!this._mdBuffer.includes("## 📅 Project Timeline")) {
            this._mdBuffer += `\n## 📅 Project Timeline\n`;
        }
        this._mdBuffer += `- **${date.toLocaleDateString()}**: ${name} (📦 ${deliverable})\n`;
        return this;
    }

    public build(): GeneratedReport {
        if (this._reqs.length === 0) {
            console.warn("⚠️ Warning: Building a report with no requirements.");
        }

        const report = new GeneratedReport(
            this._title,
            this._version,
            "System Director",
            this._updated,
            this._mdBuffer,
            this._reqs,
            this._milestones,
            this._techStack
        );

        this.reset();
        return report;
    }
}

class SDLCDirector<T> {
    private builder: IBuilder<T>;

    constructor(builder: IBuilder<T>) { this.builder = builder; }

    public constructAgileSprints(sprintCount: number, startDate: Date): void {
        this.builder.reset()
            .setName(`Agile Project (${sprintCount} Sprints)`)
            .setVersion("1.0.0")
            .setProblemStatement("Rapid iteration needed.")
            .addStakeholder("Product Owner")
            .addStakeholder("Scrum Master")
            .addStakeholder("Development Team")
            .addRequirement("FR1", "User authentication", "High")
            .addRequirement("FR2", "Data visualization dashboard", "Medium")
            .setTechStack(["Jira", "React", "Node.js", "PostgreSQL"]);

        let currentDate = new Date(startDate);

        this.builder.addMilestone("Kickoff", currentDate, "Project Charter");

        for (let i = 1; i <= sprintCount; i++) {
            currentDate = new Date(currentDate.setDate(currentDate.getDate() + 14));

            this.builder.addMilestone(
                `Sprint ${i} Demo`,
                new Date(currentDate),
                `Working Increment v0.${i}`
            );
        }
    }
    public constructStrictWaterfall(startDate: Date): void {
        this.builder.reset()
            .setName("Government Enterprise System")
            .setVersion("1.0.0")
            .setProblemStatement("Compliance and stability focused.")
            .setTechStack(["Java", "Oracle"])
            .addRequirement("REQ-W01", "System Security Module", "Critical")
            .addRequirement("REQ-W02", "Audit Trail Logging", "High");

        const date = new Date(startDate);

        this.builder.addMilestone("Requirement Freeze", date, "Signed SRS Document");

        date.setDate(date.getDate() + 30);
        this.builder.addMilestone("Design Approval", new Date(date), "System Architecture Doc");

        date.setDate(date.getDate() + 90);
        this.builder.addMilestone("Implementation Complete", new Date(date), "Source Code & Unit Test");

        date.setDate(date.getDate() + 45);
        this.builder.addMilestone("Go-Live", new Date(date), "Production Release");
    }

    public constructStartupMVP(appName: string): void {
        this.builder.reset()
            .setName(`${appName} - MVP Launch`)
            .setVersion("0.1.0-alpha")
            .setProblemStatement("Validate market fit with core features.")
            .setDescription("A minimal viable product to test assumptions.")
            .addStakeholder("Founders")
            .addStakeholder("Early Adopters")
            .setTechStack(["Flutter", "Firebase", "Stripe"])
            .addRequirement("MVP-01", "Sign up with Google", "Critical")
            .addRequirement("MVP-02", "Basic Payment Flow", "Critical");

        const today = new Date();
        this.builder.addMilestone("Concept", today, "Pitch Deck");

        const launchDay = new Date(today);
        launchDay.setDate(today.getDate() + 30);
        this.builder.addMilestone("Soft Launch", launchDay, "TestFlight Build");
    }
    public constructSystemDecommission(systemName: string): void {
        this.builder.reset()
            .setName(`Decommissioning: ${systemName}`)
            .setVersion("Final")
            .setProblemStatement("Legacy system replacement and data archiving.")
            .setDescription("Steps to safely sunset the old system.")
            .addStakeholder("Compliance Team")
            .addStakeholder("Data Archivist")
            .setTechStack(["Legacy Mainframe", "COBOL"])
            .addRequirement("DEC-01", "Export all data to Cold Storage", "High")
            .addRequirement("DEC-02", "Shut down servers", "High");

        const date = new Date();
        this.builder.addMilestone("Data Backup", date, "Backup Logs");

        date.setDate(date.getDate() + 7);
        this.builder.addMilestone("Server Shutdown", date, "Hardware Disposal Receipt");
    }
}
const builder = new SDLCBuilder();
const director = new SDLCDirector(builder);

console.log("--- 🏃 Agile Director Logic (Loop) ---");
director.constructAgileSprints(4, new Date());
console.log(builder.build().toString());

console.log("\n--- 🧱 Waterfall Director Logic (Sequential) ---");
director.constructStrictWaterfall(new Date());
console.log(builder.build().toString());

const mdBuilder = new MarkdownReportSDLCBuilder();

const reportDirector = new SDLCDirector<GeneratedReport>(mdBuilder);

console.log("\n>> 📄 Generating MVP Report...");
reportDirector.constructStartupMVP("Uber for Cats");
const mvpReport = mdBuilder.build();
console.log(mvpReport.markdownContent);

console.log("\n>> 📄 Generating Shutdown Report...");
reportDirector.constructSystemDecommission("Old-Banking-System");
const shutdownReport = mdBuilder.build();
console.log(shutdownReport.markdownContent);

const manualBuilder = new MarkdownReportSDLCBuilder();
const customReport = manualBuilder
    .reset()
    .setName("🔥 Emergency Hotfix Report")
    .setVersion("1.0.1-patch")
    .setUpdated(new Date())
    .setProblemStatement("Critical bug found in production payment gateway.")
    .addStakeholder("DevOps Team")
    .addStakeholder("CTO")
    .addRequirement("FIX-001", "Rollback API version", "Critical")
    .addRequirement("FIX-002", "Patch security hole", "Critical")
    .setTechStack(["AWS Lambda", "Node.js"])
    .addMilestone("Incident Detected", new Date(), "Alert Logs")
    .addMilestone("Fix Deployed", new Date(), "Deployment Success")
    .build();

console.log(customReport.markdownContent);

console.log("\n--- 🐇 Prototype Cloning Logic (Loop) ---");

const originalDoc: SDLCBuilder = new SDLCBuilder();

const mylist: SDLCProjectDocument[] = []

originalDoc
    .setName(`Original SDLC Document # 1`)
    .setVersion("1.0.0")
    .setProblemStatement("Initial project setup.")
    .addStakeholder("Project Manager")
    .addRequirement("FR1", "User login", "High")
    .setTechStack(["React", "Node.js"])
    .setDescription("This document outlines the SDLC for project # 1")
    .addMilestone("Project Kickoff", new Date(), "Kickoff Meeting");
const builtDoc = originalDoc.build();

// console.log(`\n>> Cloning Document Iteration #${i}`);
// const clonedDoc = builtDoc.clone();
for (let i = 0; i < 3; i++) {
    mylist.push(builtDoc.clone());
}
// console.log(clonedDoc.toString());

for (let i = 0; i < mylist.length; i++) {
    console.log("index: ", i, mylist[i].toString());
}

mylist[0].name = "Modified Clone Document #1";
console.log(mylist[0].toString());


