import * as React from 'react';
import HOOFieldset from '@n8d/htwoo-react/HOOFieldset';
import { IColorHarmonySelectorProps, ColorHarmony } from './IColorHarmonySelectorProps';
import styles from './ColorHarmonySelector.module.scss';

const harmonyDescriptions: Record<ColorHarmony, string> = {
  'complementary': 'Colors opposite on the color wheel - high contrast, vibrant',
  'analogous': 'Colors next to each other on the wheel - harmonious, pleasing',
  'triadic': 'Three colors evenly spaced on the wheel - balanced, vibrant',
  'tetradic': 'Two pairs of complementary colors - rich, complex palette',
  'monochromatic': 'Different tints and shades of one color - elegant, cohesive',
  'split-complementary': 'Base color plus two adjacent to complement - softer contrast'
};

const harmonyLabels: Record<ColorHarmony, string> = {
  'complementary': 'Complementary (Opposite)',
  'analogous': 'Analogous (Adjacent)',
  'triadic': 'Triadic (Three)',
  'tetradic': 'Tetradic (Four)',
  'monochromatic': 'Monochromatic (Single)',
  'split-complementary': 'Split Complementary'
};

export const ColorHarmonySelector: React.FC<IColorHarmonySelectorProps> = ({
  selectedHarmony,
  onHarmonyChange,
  disabled = false,
  className = ''
}) => {
  const selectorId = `harmony-selector-${Math.random().toString(36).substr(2, 9)}`;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    onHarmonyChange(event.target.value as ColorHarmony);
  };

  const containerClasses = [
    styles.harmonySelector,
    className
  ].filter(Boolean).join(' ');

  return (
    <HOOFieldset>
      <div className={containerClasses}>
        <label htmlFor={selectorId} className={styles.label}>
          Color Harmony:
        </label>
        <select
          id={selectorId}
          className={styles.select}
          value={selectedHarmony}
          onChange={handleChange}
          disabled={disabled}
        >
          {(Object.keys(harmonyLabels) as ColorHarmony[]).map((value: ColorHarmony) => (
            <option key={value} value={value}>
              {harmonyLabels[value]}
            </option>
          ))}
        </select>
        <div className={styles.description}>
          {harmonyDescriptions[selectedHarmony]}
        </div>
      </div>
    </HOOFieldset>
  );
};

export default ColorHarmonySelector;