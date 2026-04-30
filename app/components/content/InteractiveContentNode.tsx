'use client';

import { useEffect, useState } from 'react';
import { Calendar, ChevronDown, ChevronRight, Clock, Folder, Layers, LayoutGrid, List } from 'lucide-react';
import { ProtectedDecoratedContent } from './ProtectedDecoratedContent';
import type { CompositeNode, LayoutNode, LayoutStyleType, LeafNode, UnifiedContentItem } from '../../interfaces/content-tree';

type NotifyLevel = 'SUCCESS' | 'WARNING' | 'INFO' | 'ERROR';

type InteractiveNodeStyle = {
  name: string;
  getCardClass: () => string;
  getBadgeClass: (type?: string) => string;
  getButtonClass: (variant?: 'primary' | 'secondary' | 'text') => string;
  getContainerClass: (type: string) => string;
  getLockedOverlayClass: () => string;
};

type InteractiveNodeLabels = {
  actions: {
    collapse: string;
    expand: string;
    related: string;
    readMore: string;
    locked: string;
    unlock: string;
  };
};

type InteractiveContentNodeProps = {
  readonly node: LayoutNode | CompositeNode | LeafNode;
  readonly style: InteractiveNodeStyle;
  readonly labels: InteractiveNodeLabels;
  readonly level?: number;
  readonly activeNodeId: string | null;
  readonly isAdmin: boolean;
  readonly notify: (message: string, level: NotifyLevel) => void;
  readonly onTitleClick?: (item: UnifiedContentItem) => void;
};

export function InteractiveContentNode({
  node,
  style,
  labels,
  level = 0,
  activeNodeId,
  isAdmin,
  notify,
  onTitleClick,
}: InteractiveContentNodeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isComposite = (targetNode: LayoutNode): targetNode is CompositeNode => targetNode.type === 'container';
  const hasChildren = isComposite(node) && node.children && node.children.length > 0;

  const [currentLayout, setCurrentLayout] = useState<LayoutStyleType>(isComposite(node) ? node.layoutStyle : 'grid');

  useEffect(() => {
    if (activeNodeId === node.id) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        const element = document.getElementById(`node-${node.id}`);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [activeNodeId, node.id]);

  const contentItem = 'data' in node ? node.data : undefined;

  const getLayoutIcon = (layoutStyle: LayoutStyleType, size: number) => {
    if (layoutStyle === 'grid') {
      return <LayoutGrid size={size} />;
    }

    if (layoutStyle === 'list') {
      return <List size={size} />;
    }

    return <Clock size={size} />;
  };

  const getChildrenLayoutClass = () => {
    if (currentLayout === 'grid') {
      return 'grid grid-cols-1 md:grid-cols-2 gap-4';
    }

    if (currentLayout === 'list') {
      return 'flex flex-col space-y-4';
    }

    if (currentLayout === 'timeline') {
      return `border-l-2 ${style.name === 'Future' ? 'border-cyan-500' : 'border-gray-300'} ml-2 pl-4 space-y-6`;
    }

    return 'flex flex-col gap-4';
  };

  const renderContentCard = () => {
    if (!contentItem && !isComposite(node)) return null;

    if (!contentItem && isComposite(node)) {
      return (
        <div id={`node-${node.id}`} className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          <h3 className={`text-lg font-bold opacity-70 flex items-center gap-2 ${style.name === 'Future' ? 'text-cyan-200' : 'text-gray-500 dark:text-gray-400'}`}>
            <Folder size={18} /> {node.title || 'Section'}
          </h3>
          <div className="flex gap-2">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded p-1 scale-75 origin-right">
              {(['grid', 'list', 'timeline'] as LayoutStyleType[]).map((layoutStyle) => (
                <button
                  key={layoutStyle}
                  onClick={(event) => {
                    event.stopPropagation();
                    setCurrentLayout(layoutStyle);
                  }}
                  className={`p-1 rounded ${currentLayout === layoutStyle ? 'bg-white shadow text-blue-600' : 'text-gray-400'}`}
                >
                  {getLayoutIcon(layoutStyle, 14)}
                </button>
              ))}
            </div>
            {hasChildren && (
              <button onClick={() => setIsOpen(!isOpen)} className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                <ChevronDown size={20} />
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <ProtectedDecoratedContent
        isLocked={contentItem!.isLocked}
        isAdmin={isAdmin}
        decorations={contentItem!.decorations}
        style={style}
        labels={labels}
        onRequestUnlock={() => notify('Please sign in with Google to access this content', 'WARNING')}
      >
        <div id={`node-${node.id}`} className={`${style.getCardClass()} p-6 ${activeNodeId === node.id ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-xl scale-[1.01]' : ''} transition-all duration-500`}>
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <span className={style.getBadgeClass()}>{contentItem!.type}</span>
              <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12} /> {contentItem!.date}</span>
            </div>
            {hasChildren && (
              <button onClick={(event) => { event.stopPropagation(); setIsOpen(!isOpen); }} className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors ${style.name === 'Future' ? 'text-cyan-400' : 'text-blue-600 dark:text-blue-400'}`}>
                {isOpen ? labels.actions.collapse : labels.actions.expand} ({isComposite(node) ? node.children.length : 0}) <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
          <h3 className={`text-2xl font-bold mb-2 ${style.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-gray-100'}`}>
            <button
              type="button"
              className="text-left hover:underline"
              onClick={() => {
                if (onTitleClick) {
                  onTitleClick(contentItem!);
                  return;
                }

                notify(`Opened: ${contentItem!.title}`, 'INFO');
              }}
            >
              {contentItem!.title}
            </button>
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">{contentItem!.description}</p>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex gap-2">{contentItem?.meta?.slice(0, 3).map((tag) => <span key={tag} className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-500">#{tag}</span>)}</div>
            <button className={style.getButtonClass('text')}>{labels.actions.readMore} <ChevronRight size={14} className="inline ml-1" /></button>
          </div>
        </div>
      </ProtectedDecoratedContent>
    );
  };

  const renderChildren = () => {
    if (!isComposite(node)) return null;

    const shouldRender = contentItem ? isOpen : (isOpen || true);
    if (!shouldRender) return null;

    return (
      <div className={`${style.getContainerClass(currentLayout)} animate-in fade-in slide-in-from-top-4 duration-300`}>
        {contentItem && (
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2"><Layers size={14} /> {labels.actions.related}</span>
            <div className="flex gap-1 bg-gray-200 dark:bg-gray-700 rounded p-0.5">
              {(['grid', 'list', 'timeline'] as LayoutStyleType[]).map((layoutStyle) => (
                <button key={layoutStyle} onClick={() => setCurrentLayout(layoutStyle)} className={`p-1.5 rounded text-xs transition-all ${currentLayout === layoutStyle ? 'bg-white dark:bg-gray-600 shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} title={layoutStyle}>
                  {getLayoutIcon(layoutStyle, 12)}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className={getChildrenLayoutClass()}>
          {node.children.map((child) => (
            <div key={child.id} className={currentLayout === 'timeline' ? 'relative' : ''}>
              {currentLayout === 'timeline' && <div className={`absolute -left-5.75 top-6 h-3 w-3 rounded-full border-2 ${style.name === 'Future' ? 'border-black bg-cyan-500' : 'border-white bg-gray-400'} shadow-sm`} />}
              <InteractiveContentNode
                node={child}
                style={style}
                labels={labels}
                level={level + 1}
                activeNodeId={activeNodeId}
                isAdmin={isAdmin}
                notify={notify}
                onTitleClick={onTitleClick}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return <div className={`w-full ${level > 0 ? 'mb-0' : 'mb-8'}`}>{renderContentCard()}{renderChildren()}</div>;
}
