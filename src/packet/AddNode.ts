export default class AddNode{
  item: any;
  constructor(item) {
    this.item = item;
  }

  build(){
    // Only add player controlled cells with this packet or it will bug the camera
    var buf = new ArrayBuffer(5);
    var view = new DataView(buf);

    view.setUint8(0, 32);
    view.setUint32(1, this.item.nodeId, true);

    return buf;
  }
}
