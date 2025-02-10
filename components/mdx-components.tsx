import Image from "next/image";
import * as runtime from "react/jsx-runtime";
import { Callout } from "./callout";
import { ThreeMedias } from "./three-medias";
import SudokuBacktrack from "./sudoku/SudokuBacktrack";
import SudokuAlgX from "./sudoku/SudokuAlgX";
import SudokuComparison from "./sudoku/SudokuComparison";
import PlayableSudoku from "./sudoku/PlayableSudoku";
import ConnectFour from "./connect-four/connect-four";
import Link from "next/link";
import { SudokuGrid } from "./sudoku/SudokuGrid";

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
    PlayableSudoku,
    SudokuGrid,
    Link
};

interface MdxProps {
    code: string;
}

export function MDXContent({ code }: MdxProps) {
    const Component = useMDXComponent(code);
    return <Component components={components} />;
}