export default class DrawLine{
  x: number;
  y: number;

  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  build(){
    var buf = new ArrayBuffer(5);
    var view = new DataView(buf);

    view.setUint8(0, 21);
    view.setUint16(1, this.x, true);
    view.setUint16(3, this.y, true);

    return buf;
  }
}
