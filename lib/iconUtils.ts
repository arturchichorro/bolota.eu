import BballSVG from "@/components/svg/bballSvg";
import BuildspaceSVG from "@/components/svg/buildspaceSvg";
import ManimSVG from "@/components/svg/manimSvg";
import NextIconSVG from "@/components/svg/nextjsSvg";
import ReactIconSVG from "@/components/svg/reactSvg";
import RustIconSVG from "@/components/svg/rustSvg";
import ShiftAppensSVG from "@/components/svg/shiftAppensSvg";
import SpotifyIconSVG from "@/components/svg/spotifySvg";
import { Icons } from "@/components/icons";
import SocketIoSVG from "@/components/svg/socketIoSvg";


const iconMap: Record<string, React.FC<any>> = {
  bball: BballSVG,
  buildspace: BuildspaceSVG,
  manim: ManimSVG,
  react: ReactIconSVG,
  next: NextIconSVG,
  rust: RustIconSVG,
  sa: ShiftAppensSVG,
  spotify: SpotifyIconSVG,
  logo: Icons.logo,
  socketio: SocketIoSVG,
};

export const getIcon = (iconName: string): React.FC<any> | null => {
  return iconMap[iconName] || null; 
};
