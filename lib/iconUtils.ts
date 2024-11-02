import BballSVG from "@/components/svg/bballSvg";
import BuildspaceSVG from "@/components/svg/buildspaceSvg";
import ManimSVG from "@/components/svg/manimSvg";
import NextIconSVG from "@/components/svg/nextjsSvg";
import ReactIconSVG from "@/components/svg/reactSvg";
import RustIconSVG from "@/components/svg/rustSvg";


const iconMap: Record<string, React.FC<any>> = {
  bball: BballSVG,
  buildspace: BuildspaceSVG,
  manim: ManimSVG,
  react: ReactIconSVG,
  next: NextIconSVG,
  rust: RustIconSVG,
};

export const getIcon = (iconName: string): React.FC<any> | null => {
  return iconMap[iconName] || null; 
};
