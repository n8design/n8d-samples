import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';

import styles from './TeamCardAfterWebPart.module.scss';
import { TEAM, TeamCard } from '../../common/teamCard';
import { applyThemeSlots } from '../../common/ThemeService';

export interface ITeamCardAfterWebPartProps {}

// AFTER state of the running demo:
// container queries + cq units, intrinsic grid, prefixed @property tokens,
// runtime theme mapped onto custom properties once on the root.
export default class TeamCardAfterWebPart extends BaseClientSideWebPart<ITeamCardAfterWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = '';
    this.domElement.classList.add(styles.teamCardAfter);

    const grid = document.createElement('div');
    grid.classList.add(styles.grid);

    TEAM.forEach(member => grid.appendChild(TeamCard(member, {
      card: styles.card,
      media: styles.media,
      header: styles.header,
      role: styles.role,
      description: styles.description
    })));

    this.domElement.appendChild(grid);
  }

  // Fires on load and whenever the section background variant changes
  // (supportsThemeVariants: true in the manifest).
  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    applyThemeSlots(this.domElement, currentTheme);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
