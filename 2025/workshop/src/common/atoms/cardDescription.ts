import styles from './atoms.module.scss';

export default function CardDescription(): HTMLElement {
    const description = document.createElement('p');
    description.textContent = 'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    description.classList.add(styles.cardDescription);

    return description;
}