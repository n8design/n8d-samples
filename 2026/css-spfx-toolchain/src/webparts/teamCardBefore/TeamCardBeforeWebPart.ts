import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './TeamCardBeforeWebPart.module.scss';
import { TEAM, TeamCard } from '../../common/teamCard';

export interface ITeamCardBeforeWebPartProps {}

// BEFORE state of the running demo:
// Sass @import, viewport media queries + canvas class sniffing,
// px sizes, hardcoded Segoe UI and legacy "[theme:slot]" tokens.
export default class TeamCardBeforeWebPart extends BaseClientSideWebPart<ITeamCardBeforeWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = '';
    const grid = document.createElement('div');
    grid.classList.add(styles.teamCardBefore);

    TEAM.forEach(member => grid.appendChild(TeamCard(member, {
      card: styles.card,
      media: styles.media,
      header: styles.header,
      role: styles.role,
      description: styles.description
    })));

    this.domElement.appendChild(grid);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
