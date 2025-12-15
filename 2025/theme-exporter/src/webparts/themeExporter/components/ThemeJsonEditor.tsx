import * as React from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { IThemeData } from '../../../services/BrandCenterService';
import HOOButton, { HOOButtonType } from '@n8d/htwoo-react/HOOButton';
import ThemeEditor from './ThemeEditor';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IWebPartInstance } from './IThemeExporterProps';
// Using global classes from ThemeExporter.module.scss

// Extend the JSX namespace to include the name attribute for details
declare module 'react' {
  interface DetailsHTMLAttributes<T> extends React.HTMLAttributes<T> {
    name?: string;
  }
}

export interface IThemeJsonEditorProps {
  themeData: IThemeData;
  themeName: string;
  context: WebPartContext;
  onThemeUpdated?: () => void;
  webPartInstance?: IWebPartInstance;
}

// Helper functions for color conversion
function hexToRgba(hex: string): { red: number; green: number; blue: number; alpha: number } {
  const bigint = parseInt(hex.replace('#', ''), 16);
  const length = hex.length - 1;
  let r: number, g: number, b: number, a: number;

  if (length === 3) {
    r = (bigint >> 8) * 17;
    g = ((bigint >> 4) & 0xf) * 17;
    b = (bigint & 0xf) * 17;
    a = 1;
  } else if (length === 6) {
    r = (bigint >> 16) & 255;
    g = (bigint >> 8) & 255;
    b = bigint & 255;
    a = 1;
  } else {
    // handle #RRGGBBAA
    r = (bigint >> 24) & 255;
    g = (bigint >> 16) & 255;
    b = (bigint >> 8) & 255;
    a = (bigint & 255) / 255;
  }

  return { red: r / 255, green: g / 255, blue: b / 255, alpha: a };
}

function rgbaToHex({ red, green, blue }: { red: number; green: number; blue: number; alpha: number }): string {
  const to255 = (v: number): number => Math.round(v * 255);
  return `#${[red, green, blue]
    .map((v) => {
      const hex = to255(v).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('')}`;
}

// Global flag to ensure color provider is only registered once
let colorProviderRegistered = false;

export const ThemeJsonEditor: React.FC<IThemeJsonEditorProps> = ({ themeData, themeName, context, onThemeUpdated, webPartInstance }) => {
  const [showEditor, setShowEditor] = React.useState(false);
  const monaco = useMonaco();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = React.useState<number>(400);

  // Parse themeJson string to get the actual theme colors
  const parsedThemeData = React.useMemo(() => {
    try {
      if (themeData.themeJson && typeof themeData.themeJson === 'string') {
        return JSON.parse(themeData.themeJson);
      }
      return themeData;
    } catch (error) {
      console.warn('Failed to parse themeJson:', error);
      return themeData;
    }
  }, [themeData]);

  // Register color provider when monaco is available (only once globally)
  React.useEffect(() => {
    if (!monaco || colorProviderRegistered) return;

    // Register color provider for JSON language
    monaco.languages.registerColorProvider('json', {
      provideDocumentColors(model) {
        const regex = /#([0-9a-f]{3,8})\b/gi;
        const text = model.getValue();
        const colors = [];
        let match;

        while ((match = regex.exec(text))) {
          const hex = match[0];
          const start = match.index;
          const end = start + hex.length;
          const range = new monaco.Range(
            model.getPositionAt(start).lineNumber,
            model.getPositionAt(start).column,
            model.getPositionAt(end).lineNumber,
            model.getPositionAt(end).column
          );

          // Convert hex to RGBA
          const rgba = hexToRgba(hex);

          colors.push({
            color: rgba,
            range,
          });
        }

        return colors;
      },
      provideColorPresentations(model, colorInfo) {
        const rgba = colorInfo.color;
        const hex = rgbaToHex(rgba);
        return [{ label: hex }];
      },
    });

  colorProviderRegistered = true;
}, [monaco]);

// Measure container height and update CSS variable
React.useEffect(() => {
  const measureHeight = (): void => {
    if (containerRef.current) {
      // Find the nearest parent with themeGrid class
      const themeGridElement = containerRef.current.closest('.theme-grid') as HTMLElement;
      
      if (themeGridElement) {
        const height = themeGridElement.clientHeight;
        setContainerHeight(height);
        containerRef.current.style.setProperty('--editor-height', `${height}px`);
      } else {
        // Fallback to container's own height if themeGrid parent not found
        const height = containerRef.current.clientHeight;
        setContainerHeight(height);
        containerRef.current.style.setProperty('--editor-height', `${height}px`);
      }
    }
  };

  // Initial measurement
  measureHeight();

  // Set up ResizeObserver to detect container size changes
  const resizeObserver = new ResizeObserver(measureHeight);
  if (containerRef.current) {
    // Find the themeGrid element to observe
    const themeGridElement = containerRef.current.closest('.theme-grid') as HTMLElement;
    if (themeGridElement) {
      resizeObserver.observe(themeGridElement);
    } else {
      resizeObserver.observe(containerRef.current);
    }
  }

  return () => {
    resizeObserver.disconnect();
  };
}, []);

const themeDetection = (): 'light' | 'dark' => {
    try {
      // First check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      
      // Fallback to body background detection
      const styles = getComputedStyle(document.body);
      const backgroundColor = styles.backgroundColor;
      
      if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
        const rgb = backgroundColor.match(/\d+/g);
        if (rgb) {
          const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
          return brightness > 128 ? 'light' : 'dark';
        }
      }
    } catch (error) {
      console.warn('Theme detection failed:', error);
    }
    return 'light';
  };

  return (
    <details name="theme-switcher">
      <summary>{themeName}</summary>
      <div 
        ref={containerRef}
        className="theme-content"
        style={{ '--editor-height': `${containerHeight}px` } as React.CSSProperties}
      >
        {/* Theme Editor Toggle */}
        <div className="theme-editor-toggle">
          <HOOButton
            type={HOOButtonType.Standard}
            label={showEditor ? "Hide Editor" : "Show Editor"}
            onClick={() => setShowEditor(!showEditor)}
          />
        </div>

        {/* Theme Editor */}
        {showEditor && (
          <div className="theme-editor-content">
            <ThemeEditor 
              context={context}
              editingTheme={themeData}
              webPartInstance={webPartInstance}
              onThemeCreated={(themeId) => {
                console.log('Theme updated with ID:', themeId);
                setShowEditor(false);
                if (onThemeUpdated) {
                  onThemeUpdated();
                }
              }}
            />
          </div>
        )}
        <Editor
          height={containerHeight}
          language="json"
          value={JSON.stringify(parsedThemeData, null, 2)}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            fontSize: 14,
            lineNumbers: 'on',
            folding: true,
            bracketPairColorization: { enabled: true }
          }}
          theme={themeDetection() === 'dark' ? 'vs-dark' : 'vs'}
        />
      </div>
    </details>
  );
};