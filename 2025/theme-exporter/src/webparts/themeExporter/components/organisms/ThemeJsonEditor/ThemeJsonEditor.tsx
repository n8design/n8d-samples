import * as React from 'react';
import { ThemeJsonEditor as OriginalThemeJsonEditor, IThemeJsonEditorProps } from '../../ThemeJsonEditor';

/**
 * ThemeJsonEditor Organism - Atomic Design Wrapper
 * 
 * This organism wraps the existing ThemeJsonEditor component to fit within
 * our atomic design structure while maintaining all existing functionality.
 */
const ThemeJsonEditor: React.FC<IThemeJsonEditorProps> = (props) => {
  return <OriginalThemeJsonEditor {...props} />;
};

export default ThemeJsonEditor;