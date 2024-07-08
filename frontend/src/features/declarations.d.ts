declare namespace JSX {
    interface IntrinsicElements {
        'lord-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            src: string;
            trigger: string;
            colors?: string;
            stroke?: number;
            scale?: number;
            state?: string;
            delay?: number;
        };
    }
}
