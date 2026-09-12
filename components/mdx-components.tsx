import Image from "next/image";
import * as runtime from "react/jsx-runtime";
import { Callout } from "./callout";
import { ThreeMedias } from "./three-medias";
import SudokuBacktrack from "./sudoku/SudokuBacktrack";
import SudokuAlgX from "./sudoku/SudokuAlgX";
import SudokuComparison from "./sudoku/SudokuComparison";
import ConnectFour from "./connect-four/connect-four";
import Link from "next/link";
import { SudokuGrid } from "./sudoku/SudokuGrid";
import { SubscriberForm } from "./mailerlite/subscriber-form";
import { ProjectItem } from "./project-item";
import { StaticBlogFlowDiagram } from "./static-flow-diagram";
import { ImageGallery } from "./image-gallery";

const useMDXComponent = (code: string) => {
    const fn = new Function(code);
    return fn({ ...runtime }).default;
};

const components = {
    Image,
    Callout,
    ThreeMedias,
    ConnectFour,
    SudokuBacktrack,
    SudokuAlgX,
    SudokuComparison,
    SudokuGrid,
    Link,
    SubscriberForm,
    ProjectItem,
    StaticBlogFlowDiagram,
    ImageGallery
};

interface MdxProps {
    code: string;
}

export function MDXContent({ code }: MdxProps) {
    const Component = useMDXComponent(code);
    return <Component components={components} />;
}
