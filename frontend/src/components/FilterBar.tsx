interface Props {
  status: string;
  priority: string;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
}

export function FilterBar({ status, priority, onStatusChange, onPriorityChange }: Props) {
  return (
    <div className="filters">
      <select value={status} onChange={(e) => onStatusChange(e.target.value)}>
        <option value="">すべてのステータス</option>
        <option value="todo">未着手</option>
        <option value="doing">進行中</option>
        <option value="done">完了</option>
      </select>
      <select value={priority} onChange={(e) => onPriorityChange(e.target.value)}>
        <option value="">すべての優先度</option>
        <option value="high">高</option>
        <option value="medium">中</option>
        <option value="low">低</option>
      </select>
    </div>
  );
}
