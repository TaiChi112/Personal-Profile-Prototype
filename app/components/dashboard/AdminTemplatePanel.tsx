import { Copy, Plus } from 'lucide-react';
import type { StyleFactory, UILabels } from '../../models/theme/ThemeConfig';
import type { UnifiedContentItem } from '../../interfaces/content-tree';
import { projectTemplateRegistry } from '../../services/content/ProjectTemplateRegistryService';

type AdminTemplatePanelProps = {
  currentStyle: StyleFactory;
  labels: UILabels;
  onCloneProject: (item: UnifiedContentItem) => void;
};

export function AdminTemplatePanel({ currentStyle, labels, onCloneProject }: AdminTemplatePanelProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="mb-6 flex items-center gap-3 border-l-4 border-amber-500 pl-4">
        <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400">{labels.actions.adminActions}</h3>
        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">Admin Only</span>
      </div>
      <div className={`${currentStyle.getCardClass()} p-6 border-dashed border-2 border-amber-300 dark:border-amber-700/50`}>
        <div className="flex items-center gap-2 mb-4 text-gray-500 dark:text-gray-400 uppercase text-xs font-bold tracking-widest">
          <Copy size={14} /> Project Templates
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projectTemplateRegistry.getAllKeys().map((key) => (
            <button
              key={key}
              onClick={() => {
                const template = projectTemplateRegistry.get(key);
                if (template) {
                  const clonedItem = template.clone();
                  const newTechStack = window.prompt(
                    `Customize Tech Stack for "${clonedItem.title}"\n(Current: ${clonedItem.meta.join(', ')})`,
                    clonedItem.meta.join(', '),
                  );

                  if (newTechStack !== null) {
                    clonedItem.meta = newTechStack.split(',').map((token) => token.trim());
                    onCloneProject(clonedItem);
                  }
                }
              }}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all group ${currentStyle.name === 'Future' ? 'border-amber-500/30 hover:bg-amber-900/20 text-amber-400' : 'border-gray-200 dark:border-gray-700 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}
            >
              <span className="font-medium">{key}</span>
              <div className={`p-2 rounded-full transition-transform group-hover:rotate-90 ${currentStyle.name === 'Future' ? 'bg-amber-900/50' : 'bg-white dark:bg-gray-800 shadow-sm'}`}>
                <Plus size={16} className="text-amber-500" />
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4 italic text-center">
          * Click to clone. You will be prompted to customize the Tech Stack for the new instance.
        </p>
      </div>
    </div>
  );
}
