import { useState } from 'react';
import type { CompositeNode, LeafNode, UnifiedContentItem } from '../../interfaces/content-tree';
import { INITIAL_PROJECTS_TREE } from '../../services/content/ContentTreeSetup';
import type { EventType } from '../../services/system/notification/NotificationBridge';

type UseProjectTreeStateParams = {
  onNotify: (message: string, level: EventType) => void;
};

export function useProjectTreeState({ onNotify }: UseProjectTreeStateParams) {
  const [projectTree, setProjectTree] = useState<CompositeNode>(INITIAL_PROJECTS_TREE);

  const addProjectFromTemplate = (newItem: UnifiedContentItem) => {
    const newLeaf: LeafNode = { id: `leaf-${newItem.id}`, type: 'item', data: newItem };

    const newTree = { ...projectTree };
    if (newTree.children && newTree.children.length > 0) {
      const targetContainer = newTree.children.find((child) => child.type === 'container') as CompositeNode;
      if (targetContainer && targetContainer.children) {
        targetContainer.children = [newLeaf, ...targetContainer.children];
      } else {
        newTree.children = [newLeaf, ...newTree.children];
      }
    }

    setProjectTree(newTree);
    onNotify(`Project "${newItem.title}" created from template!`, 'SUCCESS');
  };

  return {
    projectTree,
    addProjectFromTemplate,
  };
}
