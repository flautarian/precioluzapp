import { FC } from 'react';
import { Switch, SwitchEvent, Text } from '@nextui-org/react';

interface Props {
  checked?: boolean,
  setIsPeninsula: Function,
  textValues: string[]
}

export const ZoneSwitch: FC<Props> = ({ checked, setIsPeninsula, textValues }) => {
  function updateCheckStatus(ev: SwitchEvent): void {
    setIsPeninsula(ev.target.checked);
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>{textValues[checked ? 0 : 1]}</Text>
        <Switch checked={checked} onChange={updateCheckStatus} />
      </div>
    </>)

};