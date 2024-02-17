import { useEffect, useState } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@nextui-org/react';
import styles from './BacktestPeriodsDropdown.module.css';

const backtestPeriods = [
  {
    key: 'week',
    content: 'Últimos 7 días',
  },
  {
    key: 'month',
    content: 'Últimos 30 días',
  },
  {
    key: 'year',
    content: 'Últimos 365 días',
  },
  {
    key: 'custom',
    content: 'Personalizado',
  },
];

const BacktestPeriodsDropdown = ({ onChange }) => {
  const [selectedKey, setSelectedKey] = useState(
    new Set([backtestPeriods[0].key]),
  );

  useEffect(() => {
    onChange(selectedKey.values().next().value);
  }, []);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" className={styles.datesDropdown}>
          {
            backtestPeriods.find((period) => selectedKey.has(period.key))
              ?.content
          }
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Single selection example"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKey={selectedKey}
        onSelectionChange={(e) => {
          setSelectedKey(e);
          onChange(e.values().next().value);
        }}
      >
        {backtestPeriods.map((period) => (
          <DropdownItem key={period.key}>{period.content}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default BacktestPeriodsDropdown;
