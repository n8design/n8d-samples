// Shared markup for the running "team card" demo.
// Ported from n8d-samples/2025/workshop/src/common/{atoms,molecules}.
// Markup is identical for the before and after web parts; only the
// class map (and therefore the stylesheet) differs.

export interface ITeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface ITeamCardClasses {
  card: string;
  media: string;
  header: string;
  role: string;
  description: string;
}

export const TEAM: ITeamMember[] = [
  { name: 'Ada Brooks', role: 'Product Lead', bio: 'Owns the roadmap and keeps the backlog honest. Ask her about prioritisation.', image: 'https://picsum.photos/seed/ada/480/270' },
  { name: 'Ravi Menon', role: 'SPFx Developer', bio: 'Migrated six solutions from gulp to heft and lived to tell the tale.', image: 'https://picsum.photos/seed/ravi/480/270' },
  { name: 'Lena Fischer', role: 'Designer', bio: 'Design tokens, Brand Center themes and the occasional strongly worded opinion on spacing.', image: 'https://picsum.photos/seed/lena/480/270' },
  { name: 'Tomás Ortega', role: 'Content Owner', bio: 'Publishes the intranet news and tests every web part in a one-third column.', image: 'https://picsum.photos/seed/tomas/480/270' }
];

function cardMedia(member: ITeamMember, className: string): HTMLElement {
  const figure = document.createElement('figure');
  figure.classList.add(className);
  const img = document.createElement('img');
  img.src = member.image;
  img.alt = '';
  img.loading = 'lazy';
  figure.appendChild(img);
  return figure;
}

function cardText(tag: string, text: string, className: string): HTMLElement {
  const el = document.createElement(tag);
  el.textContent = text;
  el.classList.add(className);
  return el;
}

export function TeamCard(member: ITeamMember, classes: ITeamCardClasses): HTMLElement {
  const card = document.createElement('article');
  card.classList.add(classes.card);
  card.appendChild(cardMedia(member, classes.media));
  card.appendChild(cardText('h3', member.name, classes.header));
  card.appendChild(cardText('p', member.role, classes.role));
  card.appendChild(cardText('p', member.bio, classes.description));
  return card;
}
