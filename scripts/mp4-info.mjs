import fs from 'node:fs';

const file = process.argv[2];
const buf = fs.readFileSync(file);

const containers = new Set(['moov', 'trak', 'mdia', 'minf', 'stbl', 'edts']);
const out = {};

function walk(start, end, depth) {
  let off = start;
  while (off + 8 <= end) {
    let size = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    let header = 8;
    if (size === 1) {
      size = Number(buf.readBigUInt64BE(off + 8));
      header = 16;
    } else if (size === 0) {
      size = end - off;
    }
    if (size < header) break;

    if (type === 'mvhd') {
      const version = buf.readUInt8(off + header);
      const ts = version === 1 ? buf.readUInt32BE(off + header + 20) : buf.readUInt32BE(off + header + 12);
      const dur = version === 1 ? Number(buf.readBigUInt64BE(off + header + 24)) : buf.readUInt32BE(off + header + 16);
      out.mvhd = { timescale: ts, duration: dur, seconds: dur / ts };
    }
    if (type === 'tkhd') {
      const w = buf.readUInt32BE(off + size - 8) / 65536;
      const h = buf.readUInt32BE(off + size - 4) / 65536;
      if (w && h) out.tkhd = { width: w, height: h };
    }
    if (containers.has(type) && depth < 6) walk(off + header, off + size, depth + 1);
    off += size;
  }
}

walk(0, buf.length, 0);
console.log(JSON.stringify({ file, sizeBytes: buf.length, ...out }, null, 2));
