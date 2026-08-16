import { Tooltip } from '@mui/material';
import { FaCarSide, FaChargingStation, FaMotorcycle, FaStar, FaUniversalAccess, FaUsers } from 'react-icons/fa6';
import { MdBlock, MdSensors } from 'react-icons/md';
import { ParkingSpace, SpaceType } from '../types/models';

const iconFor = (type: SpaceType) => {
  if (type === 'VIP') return <FaStar />;
  if (type === 'Accessible') return <FaUniversalAccess />;
  if (type === 'Electric Vehicle Charging') return <FaChargingStation />;
  if (type === 'Motorcycle') return <FaMotorcycle />;
  if (type === 'Family Parking') return <FaUsers />;
  return <FaCarSide />;
};

export const ParkingSpaceTile = ({
  space,
  selected,
  onClick
}: {
  space: ParkingSpace;
  selected?: boolean;
  onClick?: (space: ParkingSpace) => void;
}) => (
  <Tooltip title={`${space.spaceNumber} / ${space.zoneName} / ${space.spaceType} / ${space.currentStatus}`}>
    <button
      type="button"
      className={`space-tile status-${space.currentStatus.toLowerCase().replace(/\s+/g, '-')} ${
        selected ? 'is-selected' : ''
      }`}
      onClick={() => onClick?.(space)}
      aria-label={`Parking space ${space.spaceNumber}`}
    >
      <span>{space.currentStatus === 'Sensor Fault' ? <MdSensors /> : space.currentStatus === 'Out of Service' ? <MdBlock /> : iconFor(space.spaceType)}</span>
      <strong>{space.spaceNumber}</strong>
    </button>
  </Tooltip>
);
