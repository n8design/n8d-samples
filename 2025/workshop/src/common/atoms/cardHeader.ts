import styles from './atoms.module.scss';

export default function CardHeader(): HTMLElement {
    const header = document.createElement('h2');
    header.textContent = 'Card Header';
    header.classList.add(styles.cardHeader);
    return header;
}