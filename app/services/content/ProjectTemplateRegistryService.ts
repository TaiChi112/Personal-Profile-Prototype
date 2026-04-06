import { MOCK_PROJECTS } from '../../data/content';
import { adaptProjectToUnified } from './ContentTreeSetup';
import { ProjectTemplateRegistry } from '../../models/template/ProjectTemplateRegistry';

const projectTemplateRegistry = new ProjectTemplateRegistry();
projectTemplateRegistry.register('E-Commerce App', adaptProjectToUnified(MOCK_PROJECTS[0]));
projectTemplateRegistry.register('AI Chat System', adaptProjectToUnified(MOCK_PROJECTS[3]));

export { projectTemplateRegistry };
