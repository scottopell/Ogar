export default class ClearNodes{
  constructor(){
  }

  build = function() {
    var buf = new ArrayBuffer(1);
    var view = new DataView(buf);

    // TODO document what these are
    // and why `true` was in there as third param...
    //view.setUint8(0, 20, true);
    view.setUint8(0, 20);

    return buf;
  }
}
