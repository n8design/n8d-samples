import * as React from 'react';
import OriginalThemeEditor from '../../ThemeEditor';
import { IThemeEditorProps } from '../../IThemeEditorProps';

/**
 * ThemeEditor Organism - Atomic Design Wrapper
 * 
 * This organism wraps the existing ThemeEditor component to fit within
 * our atomic design structure while maintaining all existing functionality.
 */
const ThemeEditor: React.FC<IThemeEditorProps> = (props) => {
  return <OriginalThemeEditor {...props} />;
};

export default ThemeEditor;