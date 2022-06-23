interface MenuItem {
  target: any;
  text: string | (() => string);
  callback: (menuItem) => void;
}
interface PosOBJ {
  x: string | number;
  y: string | number;
}

declare class ContextMenu {
  constructor(domContainer: Element)
  static show: (t: MenuItem[], p: PosOBJ) => void;
  static hide: () => void;
  static destroy: () => void;
}