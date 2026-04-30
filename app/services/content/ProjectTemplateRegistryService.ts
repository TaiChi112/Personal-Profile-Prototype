import { MOCK_PROJECTS } from '../../data/content';
import { adaptProjectToUnified } from './ContentTreeSetup';
import { ProjectTemplateRegistry } from '../../models/template/ProjectTemplateRegistry';

const projectTemplateRegistry = new ProjectTemplateRegistry();
// projectTemplateRegistry.register('E-Commerce App', adaptProjectToUnified(MOCK_PROJECTS[0]));
// projectTemplateRegistry.register('AI Chat System', adaptProjectToUnified(MOCK_PROJECTS[3]));
projectTemplateRegistry.register('AI-Powered Manga OCR and Translation Pipeline (HITL)', adaptProjectToUnified(MOCK_PROJECTS[1]));
projectTemplateRegistry.register('Universal Academic Portfolio System (UAPs)', adaptProjectToUnified(MOCK_PROJECTS[2]));
projectTemplateRegistry.register('Google Calendar AI Agent (MCP)', adaptProjectToUnified(MOCK_PROJECTS[3]));
projectTemplateRegistry.register('Project Scaffolding CLI Tool (MVP)', adaptProjectToUnified(MOCK_PROJECTS[4]));
projectTemplateRegistry.register('AI-Powered Phygital Icebreaker Platform', adaptProjectToUnified(MOCK_PROJECTS[5]));
projectTemplateRegistry.register('E-Commerce Super App', adaptProjectToUnified(MOCK_PROJECTS[6]));

export { projectTemplateRegistry };
