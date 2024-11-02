import BballSVG from "@/components/svg/bball";
import BuildspaceSVG from "@/components/svg/buildspace";


const iconMap: Record<string, React.FC<any>> = {
  bball: BballSVG,
  buildspace: BuildspaceSVG,
};

export const getIcon = (iconName: string): React.FC<any> | null => {
  return iconMap[iconName] || null; 
};
