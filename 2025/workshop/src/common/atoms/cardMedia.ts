import styles from './atoms.module.scss';

export default function CardMedia(): HTMLElement {
    const figure = document.createElement('figure');
    figure.classList.add(styles.cardMedia);
    const img = document.createElement('img');
    img.src = 'https://picsum.photos/480/270?random=' + Math.floor(Math.random() * 1000);
    img.alt = 'Random Image';
    img.loading = 'lazy';
    figure.appendChild(img);
    return figure;
}