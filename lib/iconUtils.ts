import BuildspaceSVG from "@/components/svg/buildspaceSvg";
import ManimSVG from "@/components/svg/manimSvg";
import NextIconSVG from "@/components/svg/nextjsSvg";
import ReactIconSVG from "@/components/svg/reactSvg";
import RustIconSVG from "@/components/svg/rustSvg";
import ShiftAppensSVG from "@/components/svg/shiftAppensSvg";
import SpotifyIconSVG from "@/components/svg/spotifySvg";
import { Icons } from "@/components/icons";
import SocketIoSVG from "@/components/svg/socketIoSvg";
import PythonIconSVG from "@/components/svg/pythonSvg";


const iconMap: Record<string, React.FC<any>> = {
  buildspace: BuildspaceSVG,
  manim: ManimSVG,
  react: ReactIconSVG,
  next: NextIconSVG,
  rust: RustIconSVG,
  sa: ShiftAppensSVG,
  spotify: SpotifyIconSVG,
  logo: Icons.logo,
  socketio: SocketIoSVG,
  python: PythonIconSVG
};

export const getIcon = (iconName: string): React.FC<any> | null => {
  return iconMap[iconName] || null; 
};
