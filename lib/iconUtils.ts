import BballSVG from "@/components/svg/bball";


const iconMap: Record<string, React.FC<any>> = {
  bball: BballSVG,
};

export const getIcon = (iconName: string): React.FC<any> | null => {
  return iconMap[iconName] || null; 
};
