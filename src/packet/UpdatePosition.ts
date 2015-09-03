export default class UpdatePosition{
  x: number;
  y: number;
  size: number;

  constructor(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;
  }

  build() {
    var buf = new ArrayBuffer(13);
    var view = new DataView(buf);

    view.setUint8(0, 17);
    view.setFloat32(1, this.x, true);
    view.setFloat32(5, this.y, true);
    view.setFloat32(9, this.size, true);

    return buf;
  }

}
