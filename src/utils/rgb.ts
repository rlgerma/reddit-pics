// returns a string in the form of 'rgb(r,g,b)'
export default function rgb(): string {
  interface Colors {
    r: number;
    g: number;
    b: number;
  }

  function GetColors(): Colors {
    const cols = { r: 0, g: 0, b: 0 };
    let count = 0;
    while (cols.r + cols.g + cols.b < 300 && count < 4) {
      cols.r = Math.floor(Math.random() * 255);
      cols.g = Math.floor(Math.random() * 255);
      cols.b = Math.floor(Math.random() * 255);
      count++;
    }
    return cols;
  }

  return (
    "rgb(" +
    GetColors().r.toString() +
    "," +
    GetColors().g.toString() +
    "," +
    GetColors().b.toString() +
    ")"
  );
}
