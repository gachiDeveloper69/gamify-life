import { QButton } from '@/components/ui/QButton';
import ChevronActions from '@/assets/icons/chevron-double-right.svg?react';

type QuestModalActionsProps = {
  isOpen: boolean;
  onToggle: () => void;

  onEdit: () => void;
  onPinToggle: () => void;
  onClone: () => void;

  onArchiveToggle: () => void;
  onDelete: () => void;

  isPinned?: boolean;
  isArchived?: boolean;
};

function stop(e: React.MouseEvent) {
  e.stopPropagation();
}

export function QuestModalActions({
  isOpen,
  onToggle,
  onEdit,
  onPinToggle,
  onClone,
  onArchiveToggle,
  onDelete,
  isPinned = false,
  isArchived = false,
}: QuestModalActionsProps) {
  return (
    <div className={`qactions ${isOpen ? 'qactions--open' : ''}`} onMouseDown={stop} onClick={stop}>
      <div className="qactions__panel" role="menu" aria-label="Действия задания">
        <QButton className="qbtn--primary qbtn--actions qbtn--in-panel" onClick={onEdit}>
          <span className="qcard__complete">Изменить</span>
        </QButton>
        <QButton className="qbtn--primary qbtn--actions qbtn--in-panel" onClick={onPinToggle}>
          <span className="qcard__complete">{isPinned ? 'Открепить' : 'Закрепить'}</span>
        </QButton>
        <QButton className="qbtn--primary qbtn--actions qbtn--in-panel" onClick={onClone}>
          <span className="qcard__complete">Клонировать</span>
        </QButton>
        <QButton className="qbtn--primary qbtn--actions qbtn--in-panel" onClick={onArchiveToggle}>
          <span className="qcard__complete">{isArchived ? 'Восстановить' : 'В архив'}</span>
        </QButton>

        <span className="qactions__sep" aria-hidden="true" />

        <QButton className="qbtn--danger qbtn--in-panel" onClick={onDelete}>
          <span className="qcard__complete">Удалить</span>
        </QButton>
        {/* пример условных */}
        {/* {quest.completed ? (
                <button className="qchip" role="menuitem" type="button">
                  Открыть
                </button>
              ) : (
                <button className="qchip" role="menuitem" type="button">
                  В архив
                </button>
              )} */}
      </div>
      <button
        className="qactions__button"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Скрыть действия' : 'Показать действия'}
        title="Действия"
        onClick={onToggle}
        type="button"
      >
        <ChevronActions className="qactions__chevron" />
      </button>
    </div>
  );
}
