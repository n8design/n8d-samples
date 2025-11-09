export type ColorHarmony = 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'monochromatic' | 'split-complementary';

export interface IColorHarmonySelectorProps {
  selectedHarmony: ColorHarmony;
  onHarmonyChange: (harmony: ColorHarmony) => void;
  disabled?: boolean;
  className?: string;
}