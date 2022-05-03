import { Block } from '../components/block';

export function render(query: string, block: Block<never>) {
    const root = document.querySelector(query);
    root?.appendChild(block.getContent());

    return root;
}
