import BballSVG from "@/components/svg/bball";
import BuildspaceSVG from "@/components/svg/buildspace";
import ManimSVG from "@/components/svg/manim";
import ReactIconSVG from "@/components/svg/reactSvg";


const iconMap: Record<string, React.FC<any>> = {
  bball: BballSVG,
  buildspace: BuildspaceSVG,
  manim: ManimSVG,
  react: ReactIconSVG,
};

export const getIcon = (iconName: string): React.FC<any> | null => {
  return iconMap[iconName] || null; 
};
