import type { StyleFactory } from '../../models/theme/ThemeConfig';

type NotifyFn = (message: string, level: 'SUCCESS' | 'WARNING' | 'INFO' | 'ERROR') => void;

type TopicCloudProps = {
  tags: string[];
  currentStyle: StyleFactory;
  onNotify: NotifyFn;
};

export function TopicCloud({ tags, currentStyle, onNotify }: TopicCloudProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`${currentStyle.getBadgeClass()} text-sm py-1.5 px-3`}
          onClick={() => onNotify(`Tag selected: ${tag}`, 'INFO')}
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}
