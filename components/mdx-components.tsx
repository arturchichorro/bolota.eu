import Image from "next/image";
import * as runtime from "react/jsx-runtime";
import { Callout } from "./callout";
import { ThreeMedias } from "./three-medias";
import ConnectFour from "./connect-four";

const useMDXComponent = (code: string) => {
    const fn = new Function(code);
    return fn({ ...runtime }).default;
};

const components = {
    Image,
    Callout,
    ThreeMedias,
    ConnectFour
};

interface MdxProps {
    code: string;
}

export function MDXContent({ code }: MdxProps) {
    const Component = useMDXComponent(code);
    return <Component components={components} />;
}