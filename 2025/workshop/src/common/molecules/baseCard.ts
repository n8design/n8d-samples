import { CardMedia, CardHeader, CardDescription } from '../atoms/index';

import styles from './molecules.module.scss';

export default function BaseCard(): HTMLElement {
    const card = document.createElement('article');
    card.classList.add(styles.baseCard);
    card.appendChild(CardMedia());
    card.appendChild(CardHeader());
    card.appendChild(CardDescription());
    return card;
}