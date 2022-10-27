import { $, $$, _, BEM, getTop, getLeft } from './dom.js';

/* drawing helper functions */

// line drawing algorithm
function bres(x0, y0, x1, y1) {
  let pts = [];
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  let sx = x0 < x1 ? 1 : -1;
  let sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  let safety = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (safety++ > (parseInt(dx + dy) || 2)) {
      // console.warn('bres reached safety valve!');
      break;
    }
    pts.push([x0, y0]);
    if (x0 === x1 && y0 === y1) break;
    let e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
  return pts;
}

function rect(x0, y0, x1, y1) {
  if (x1 < x0) {
    [x0, x1] = [x1, x0];
  }
  if (y1 < y0) {
    [y0, y1] = [y1, y0];
  }
  let pts = [];
    for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      pts.push([x, y]);
    }
  }
  return pts;
}

// flood fill algorithm
function flood(data, x, y, width, value) {
  let seen = {};
  const height = (data.length / width) | 0;
  const idx = (x, y) => width * y + x;
  let start = idx(x, y);
  let bg = data[start];
  let stack = [start];
  seen[start] = true;
  while (stack.length) {
    let pos = stack.pop();
    if (data[pos] === bg) {
      data[pos] = value;
      let x = pos % width;
      let y = (pos / width) | 0;
      if (x < width - 1 && !seen[pos + 1]) {
        seen[pos + 1] = true;
        stack.push(pos + 1);
      }
      if (x > 0 && !seen[pos - 1]) {
        seen[pos - 1] = true;
        stack.push(pos - 1);
      }
      if (y < height - 1 && !seen[pos + width]) {
        seen[pos + width] = true;
        stack.push(pos + width);
      }
      if (y > 0 && !seen[pos - width]) {
        seen[pos - width] = true;
        stack.push(pos - width);
      }
    }
  }
}

// returns the coordinates of a mouseevent relative to an element
function getRelativePoint(event, el, zoom) {
  let left = getLeft(el);
  let top = getTop(el);
  return [
    ((event.pageX - left - 1) / zoom) | 0,
    ((event.pageY - top - 1) / zoom) | 0
  ];
}

const tools = ['draw', 'line', 'rect', 'fill'];
const defaultColors = [
  [255, 255, 255],
  [0, 0, 0],
  [255, 0, 0],
  [255, 255, 0],
  [0, 255, 0],
  [0, 255, 255],
  [0, 0, 255],
  [255, 0, 255]
];

export default class PixelEditor {
  constructor({
    width,
    height = width,
    colors,
    zoom = 8,
    currentColor = 1,
    bg = 0,
    container,
    onUpdate,
    afterDraw
  } = {}) {
    this.bem = BEM('pE');
    this.width = width;
    this.height = height;
    this.zoom = zoom;
    this.colors = colors || defaultColors;
    this.currentColor = currentColor;
    this.bg = bg;
    this.data = Array(width * height).fill(bg);
    this.mode = 'draw';
    this.undoStack = [];
    this.onUpdate = onUpdate;
    this.afterDraw = afterDraw;
    this.save();
    this.dataChanged = false;
    this.lastDraw = null;
    // common CSS classes
    this.classes = {
      color: this.bem.e('color'),
      selected: this.bem.m('selected')
    };
    if (container) {
      this.mount(container);
    }
  }

  // saves an undo snapshot, optionally with sizing information
  save(saveSizing) {
    this.undoStack.push({
      data: [...this.data],
      ...(saveSizing && {
        width: this.width,
        height: this.height,
        zoom: this.zoom
      })
    });
  }

  // restores to the previous undo snapshot, if available
  undo() {
    if (this.undoStack.length) {
      let popped = this.undoStack.pop();
      if (popped.width || popped.height || popped.zoom) {
        this.resize({ ...popped, noSave: true });
      }
      this.data = popped.data;
      this.dataChanged = true;
      this.draw();
      this.updated();
    }
  }

  // set the whole canvas to a single color
  clear(color) {
    if (typeof color === 'undefined') {
      color = this.bg;
    }
    this.save();
    this.data.fill(color);
    this.dataChanged = true;
    this.draw();
  }
  
  setData(data) {
    this.data = data;
    this.dataChanged = true;
    this.save();
    this.draw();
  }

  // construct the DOM, and set event listeners
  render() {
    const { b, e, m } = this.bem;

    // common classes
    const colorClass = this.classes.color;

    /* construct DOM */

    this.palette = _(
      `div.${e('palette')}`,
      ...this.colors.map((c, i) =>
        _('a.' + colorClass, {
          href: '#',
          style: `background-color:rgb(${c.join(',')}`,
          'data-color': i
        })
      )
    );

    $(`[data-color="${this.currentColor}"]`, this.palette).classList.add(
      m('selected')
    );

    this.canvas = _(`canvas.${e('drawing')}`, {
      width: this.width * this.zoom,
      height: this.height * this.zoom
    });

    const undoButton = _(`button.${e('menu-item')}`, 'undo');
    const clearButton = _(`button.${e('menu-item')}`, 'clear');
    this.menu = _(
      `div.${e('menu')}`,
      ...tools.map(t =>
        _(
          `label.${e('tool')}`,
          _(`input`, {
            name: 'tool',
            type: 'radio',
            value: t,
            ...(t === this.mode && { checked: true })
          }),
          _(`span.${e('tool-icon')}`, t)
        )
      ),
      undoButton,
      clearButton
    );

    this.el = _(
      `div.pixeleditor.${b}`,
      {
        tabindex: 0
      },
      this.menu,
      _(`div.${e('canvas')}`, this.canvas),
      this.palette
    );

    /* event listeners */

    this.el.addEventListener('keydown', e => {
      if (!this.p0) {
        this.p0 = [0, 0];
      }
      let cursor = this.p0;
      if (!e.metaKey && !e.ctrlKey) {
        if (e.altKey) {
          // alt-x
          if (e.keyCode === 88) {
            this.clear();
          }
        } else {
          e.preventDefault();
          if (e.key === 'ArrowRight') {
            cursor[0] = Math.min(cursor[0] + 1, this.width - 1);
          }
          if (e.key === 'ArrowLeft') {
            cursor[0] = Math.max(cursor[0] - 1, 0);
          }
          if (e.key === 'ArrowDown') {
            cursor[1] = Math.min(cursor[1] + 1, this.height - 1);
          }
          if (e.key === 'ArrowUp') {
            cursor[1] = Math.max(cursor[1] - 1, 0);
          }

          if (e.key === 'z') {
            this.undo();
          }

          if (e.key === 'l') {
            this.setMode('line');
          }
          if (e.key === 'd') {
            this.setMode('draw');
          }
          if (e.key === 'r') {
            this.setMode('rect');
          }
          if (e.key === 'f') {
            this.setMode('fill');
          }
          if (e.key === ']') {
            let newColor = this.currentColor + 1;
            if (newColor >= this.colors.length) {
              newColor = 0;
            }
            this.setColor(newColor);
          }
          if (e.key === '[') {
            let newColor = this.currentColor - 1;
            if (newColor < 0) {
              newColor = this.colors.length - 1;
            }
            this.setColor(newColor);
          }

          if (e.key === ' ') {
            if (this.mode === 'draw') {
              if (this.drawing) {
                this.updated();
              } else {
                this.save();
              }
              this.drawing = !this.drawing;
            }
            if (this.mode === 'line') {
              if (this.drawing) {
                this.plotLine(this.p0, this.p1);
                this.updated();
              } else {
                this.save();
                this.p1 = [...cursor];
              }
              this.drawing = !this.drawing;
            }
            if (this.mode === 'rect') {
              if (this.drawing) {
                this.plotRect(this.p0, this.p1);
                this.updated();
              } else {
                this.save();
                this.p1 = [...cursor];
              }
              this.drawing = !this.drawing;
            }
            if (this.mode === 'fill') {
              this.save();
              flood(this.data, ...cursor, this.width, this.currentColor);
              this.dataChanged = true;
              this.updated();
            }
          }
        }
      }

      if (this.drawing) {
        if (this.mode === 'draw') {
          this.plotPoint(...cursor);
        }
      }

      this.draw();
    });

    this.menu.addEventListener('click', e => {
      if (e.target.value) {
        this.mode = e.target.value;
      }
    });

    undoButton.addEventListener('click', () => this.undo());
    clearButton.addEventListener('click', () => this.clear());

    this.palette.addEventListener('click', e => {
      e.preventDefault();
      let tgt = e.target;
      let color = tgt.dataset.color;
      this.setColor(color);
    });

    this.canvas.addEventListener('mousedown', e => {
      let [x, y] = getRelativePoint(e, this.canvas, this.zoom);

      if (this.mode === 'draw') {
        this.save();
        this.plotPoint(x, y);
        this.drawing = true;
      }
      if (this.mode === 'line' || this.mode === 'rect') {
        this.drawing = true;
        this.p0 = [x, y];
        this.p1 = [x, y];
        this.draw();
      }
      if (this.mode === 'fill') {
        this.save();
        flood(this.data, x, y, this.width, this.currentColor);
        this.dataChanged = true;
        this.draw();
        this.updated();
      }
    });

    this.canvas.addEventListener('mousemove', e => {
      let [x, y] = getRelativePoint(e, this.canvas, this.zoom);

      if (!this.p0 || x !== this.p0[0] || y !== this.p0[1]) {
        this.p0 = [x, y];
        this.draw();
      }
      if (this.drawing && this.mode === 'draw') {
        this.plotPoint(x, y);
      }
      if (this.drawing && (this.mode === 'line' || this.mode === 'rect')) {
        if (x !== this.p0[0] || y !== this.p0[1]) {
          this.p0 = [x, y];
          this.draw();
        }
      }
    });

    this.el.addEventListener('mouseup', () => {
      if (this.drawing && this.mode === 'line') {
        this.save();
        this.plotLine(this.p0, this.p1);
        this.draw();
        this.updated();
      }
      if (this.drawing && this.mode === 'rect') {
        this.save();
        this.plotRect(this.p0, this.p1);
        this.draw();
        this.updated();
      }
      if (this.drawing && this.mode === 'draw') {
        this.updated();
      }
      this.drawing = false;
    });

    this.el.addEventListener('blur', () => {
      this.p0 = null;
      this.draw();
    });

    this.el.addEventListener('mouseleave', () => {
      if (this.drawing && this.mode === 'draw') {
        this.updated();
      }
      this.drawing = false;
      if (this.mode === 'line' || this.mode === 'rect') {
        this.draw();
      }
    });
  }

  // draw a single point
  plotPoint(x, y, c) {
    if (typeof c === 'undefined') {
      c = this.currentColor;
    }
    let idx = y * this.width + x;
    if (this.data[idx] !== c) {
      this.data[idx] = c;
      this.dataChanged = true;
      this.draw();
    }
  }
  
  // draw a line
  plotRect(p0, p1, c) {
    if (typeof c === 'undefined') {
      c = this.currentColor;
    }
    rect(...p0, ...p1).forEach(p => {
      this.data[p[1] * this.width + p[0]] = c;
    });
    this.dataChanged = true;
    this.draw();
  }

  // draw a line
  plotLine(p0, p1, c) {
    if (typeof c === 'undefined') {
      c = this.currentColor;
    }
    bres(...p0, ...p1).forEach(p => {
      this.data[p[1] * this.width + p[0]] = c;
    });
    this.dataChanged = true;
    this.draw();
  }

  // change the drawing mode
  setMode(mode) {
    if (tools.indexOf(mode) > -1) {
      $(`input[value="${mode}"]`).checked = true;
      this.mode = mode;
    }
  }

  // change the current drawing color
  setColor(color) {
    color = parseInt(color);
    const selectedClass = this.classes.selected;
    const colorClass = this.classes.color;
    if (color >= 0 && color < this.colors.length) {
      $$(`.${colorClass}.${selectedClass}`, this.palette).forEach(e =>
        e.classList.remove(selectedClass)
      );
      $(`[data-color="${color}"]`, this.palette).classList.add(selectedClass);
      this.currentColor = color;
    }
  }

  // re-render the drawing with a reticle and pending line if applicable
  draw() {
    let ctx = this.canvas.getContext('2d');
    ctx.save();
    let { width, height, zoom } = this;
    let drawData = this.data;
    if (this.drawing && this.mode === 'line') {
      drawData = [...this.data];
      bres(...this.p0, ...this.p1).forEach(p => {
        drawData[p[1] * width + p[0]] = this.currentColor;
      });
      this.dataChanged = true;
    }
    if (this.drawing && this.mode === 'rect') {
      drawData = [...this.data];
      rect(...this.p0, ...this.p1).forEach(p => {
        drawData[p[1] * width + p[0]] = this.currentColor;
      });
      this.dataChanged = true;
    }
    let id = this.lastDraw;
    if (this.dataChanged || !this.lastDraw) {      
      // eslint-disable-next-line no-undef
      id = new ImageData(width * zoom, height * zoom);
      for (let i = 0; i < id.data.length; i += 4) {
        let x = (i / 4) % this.canvas.width;
        let y = (i / 4 / this.canvas.width) | 0;
        let px = (x / zoom) | 0;
        let py = (y / zoom) | 0;
        let c = this.colors[drawData[py * width + px]];
        id.data[i] = c[0];
        id.data[i + 1] = c[1];
        id.data[i + 2] = c[2];
        id.data[i + 3] = 255;
      }
      this.lastDraw = id;
    } else {
      id = this.lastDraw;
    }
    this.dataChanged = false;
    ctx.putImageData(id, 0, 0);
    ctx.imageSmoothingEnabled = false;
    /* if (this.p0) {
      let rx = this.p0[0] * zoom;
      let ry = this.p0[1] * zoom;
      let z = zoom / 2;
      ctx.globalCompositeOperation = 'difference';
      ctx.strokeStyle = '#fff';
      ctx.strokeRect(rx - 1, ry - 1, zoom + 1, zoom + 1);
    }
    ctx.restore(); */
    if (this.afterDraw) {
      this.afterDraw(ctx, this);
    }
  }

  // notify onUpdated callback
  updated() {
    if (this.onUpdate) {
      this.onUpdate(this);
    }
  }

  // change the size of the drawing canvas
  resize({ width, height, zoom, noSave }) {
    if (!noSave) {
      this.save(true);
    }
    let oldWidth = this.width;
    let oldHeight = this.height;
    // let oldZoom = this.zoom;
    let oldData = this.data;

    if (width) {
      this.width = parseInt(width);
    }
    if (height) {
      this.height = parseInt(height);
    }
    if (zoom) {
      this.zoom = parseInt(zoom);
    }

    this.canvas.width = this.width * this.zoom;
    this.canvas.height = this.height * this.zoom;
    this.data = Array(this.width * this.height).fill(0);

    for (let i = 0; i < this.data.length; i++) {
      let x = i % this.width;
      let y = (i / this.width) | 0;
      if (x < oldWidth && y < oldHeight) {
        this.data[i] = oldData[y * oldWidth + x];
      }
    }
    this.dataChanged = true;
    this.draw();
  }

  // append the widget to a container
  mount(container) {
    this.render();
    container.append(this.el);
    this.draw();
  }

  /* export formats */
  // return an ImageData of the drawing at the specified zoom
  toImageData({ zoom = 1 } = {}) {
    let { width, height } = this;
    // eslint-disable-next-line no-undef
    let id = new ImageData(width * zoom, height * zoom);
    let drawData = this.data;
    for (let i = 0; i < id.data.length; i += 4) {
      let x = (i / 4) % (width * zoom);
      let y = (i / 4 / (width * zoom)) | 0;
      let px = (x / zoom) | 0;
      let py = (y / zoom) | 0;
      let c = this.colors[drawData[py * width + px]];
      id.data[i] = c[0];
      id.data[i + 1] = c[1];
      id.data[i + 2] = c[2];
      id.data[i + 3] = 255;
    }
    return id;
  }

  // returns an "image/png" Blob of the drawing at the specified zoom
  toBlob({ zoom = 1 } = {}) {
    return new Promise((resolve, _) => {
      let id = this.toImageData({ zoom });
      let canvas = _('canvas', {
        width: id.width,
        height: id.height
      });
      canvas.getContext('2d').putImageData(id, 0, 0);
      canvas.toBlob(resolve);
    });
  }
}
