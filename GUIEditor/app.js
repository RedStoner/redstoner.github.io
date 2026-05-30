'use strict';

// ── Defaults ─────────────────────────────────────────────────────────────────

const EMPTY_PADDING = { Mode:'full', Full:0, Vertical:0, Horizontal:0, Top:0, Left:0, Right:0, Bottom:0 };
const EMPTY_ANCHOR  = { Top:null, Left:null, Right:null, Bottom:null, Horizontal:null, Vertical:null, MinWidth:null, MaxWidth:null };

const GUI_DEFAULTS = {
  Id: '',
  Title: 'My Screen',
  Width: 480,
  Height: 420,
  CloseButton: true,
  Layout: 'Vertical',
  Padding: { Mode:'full', Full:12, Vertical:0, Horizontal:0, Top:0, Left:0, Right:0, Bottom:0 },
  ScrollbarStyle: '',
  DefaultCloseOnClick: false,
  DefaultRefresh: true,
  Command: null,
  Elements: []
};

// Common fields mixed into every visual element type
const COMMON_DEFAULTS = { Anchor: clone(EMPTY_ANCHOR), Visible: null, TooltipText: '', Align: 'Start' };

const ELEM_DEFAULTS = {
  label:       { Type:'label',       Id:'', Text:'Label text', Color:'#cccccc', Bold:false, Width:0, FlexWeight:0, FontSize:0, Requirements:[], ...clone(COMMON_DEFAULTS) },
  button:      { Type:'button',      Id:'', Text:'Button', Style:'default', Width:0, FlexWeight:0, Actions:[], CloseOnClick:null, Refresh:null, Requirements:[], ...clone(COMMON_DEFAULTS) },
  spacer:      { Type:'spacer',      Height:10 },
  divider:     { Type:'divider',     Color:'#333333', Height:1 },
  panel:       { Type:'panel',       Id:'', Layout:'Vertical', Padding: { Mode:'full', Full:8, Vertical:0, Horizontal:0, Top:0, Left:0, Right:0, Bottom:0 }, ScrollbarStyle:'', FlexWeight:0, Background:null, Elements:[], Requirements:[], ...clone(COMMON_DEFAULTS) },
  image:       { Type:'image',       Id:'', Src:'', Width:300, Height:80, Requirements:[], ...clone(COMMON_DEFAULTS) },
  itemicon:    { Type:'itemicon',    Id:'', ItemId:'some:item:id', Size:48, Requirements:[], ...clone(COMMON_DEFAULTS) },
  itemgrid:    { Type:'itemgrid',    Id:'', SlotsPerRow:5, DisplayItemQuantity:true, SlotSpacing:null, SlotSize:null, Slots:[], Requirements:[], ...clone(COMMON_DEFAULTS) },
  progressbar: { Type:'progressbar', Id:'', Value:'0.5', Max:0, Width:200, Height:20, Color:null, Circular:false, Requirements:[], ...clone(COMMON_DEFAULTS) },
  hyvatar:     { Type:'hyvatar',     Id:'', Username:'{player}', Render:'head', Size:64, Requirements:[], ...clone(COMMON_DEFAULTS) },
  checkbox:    { Type:'checkbox',    Id:'', Label:'Option', CheckedRequirements:[], CheckActions:[], UncheckActions:[], CloseOnClick:null, Refresh:null, Requirements:[], ...clone(COMMON_DEFAULTS) },
  dropdown:    { Type:'dropdown',    Id:'', CloseOnClick:null, Refresh:null, Requirements:[], Options:[], ...clone(COMMON_DEFAULTS) },
  sprite:      { Type:'sprite',      Id:'', Src:'', Width:64, Height:64, FrameWidth:0, FrameHeight:0, FramePerRow:0, FrameCount:0, Fps:0, Requirements:[], ...clone(COMMON_DEFAULTS) },
  hotkeylabel: { Type:'hotkeylabel', Id:'', InputBindingKey:'', InputBindingKeyPrefix:'', Requirements:[], ...clone(COMMON_DEFAULTS) },
};

const ELEM_LABELS = {
  label:'Label', button:'Button', spacer:'Spacer', divider:'Divider',
  panel:'Panel', image:'Image', itemicon:'Item Icon', itemgrid:'Item Grid',
  progressbar:'Progress Bar', hyvatar:'Hyvatar', checkbox:'Checkbox',
  dropdown:'Dropdown', sprite:'Sprite', hotkeylabel:'Hotkey Label',
};

// Shared fields appended to every visual element's schema (after its own fields).
const COMMON_SCHEMA = [
  {key:'Align',       label:'Align',   type:'select', options:['Start','Center','End']},
  {key:'Anchor',      label:'Anchor',  type:'anchor'},
  {key:'Visible',     label:'Visible', type:'tristate'},
  {key:'TooltipText', label:'Tooltip', type:'text'},
];

const SCHEMAS = {
  _gui: [
    {key:'Id',                  label:'ID / Filename',          type:'text'},
    {key:'Title',               label:'Title',                  type:'text'},
    {key:'Width',               label:'Width (px)',             type:'number'},
    {key:'Height',              label:'Height (px)',            type:'number'},
    {key:'Layout',              label:'Layout',                 type:'select', options:['Vertical','Horizontal','TopScrolling']},
    {key:'Padding',             label:'Padding',                type:'padding'},
    {key:'ScrollbarStyle',      label:'Scrollbar Style',        type:'text', placeholder:'@DefaultScrollbarStyle'},
    {key:'CloseButton',         label:'Close Button',           type:'checkbox'},
    {key:'DefaultCloseOnClick', label:'Dflt Close on Click',    type:'checkbox'},
    {key:'DefaultRefresh',      label:'Dflt Refresh',           type:'checkbox'},
    {key:'Command',             label:'Command (alias)',         type:'text'},
  ],
  label: [
    {key:'Id',           label:'ID',              type:'text'},
    {key:'Text',         label:'Text',            type:'text'},
    {key:'Color',        label:'Color',           type:'color'},
    {key:'Bold',         label:'Bold',            type:'checkbox'},
    {key:'Width',        label:'Width (0=auto)',  type:'number'},
    {key:'FlexWeight',   label:'Flex Weight (0=none)', type:'number'},
    {key:'FontSize',     label:'Font Size (0=default)', type:'number'},
    {key:'Requirements', label:'Requirements',    type:'list'},
    ...COMMON_SCHEMA,
  ],
  button: [
    {key:'Id',           label:'ID',              type:'text'},
    {key:'Text',         label:'Text',            type:'text'},
    {key:'Style',        label:'Style',           type:'select', options:['default','secondary','tertiary','small-secondary','small-tertiary','danger','disabled']},
    {key:'Width',        label:'Width (0=auto)',  type:'number'},
    {key:'FlexWeight',   label:'Flex Weight (0=none)', type:'number'},
    {key:'Actions',      label:'Actions',         type:'list'},
    {key:'CloseOnClick', label:'Close on Click',  type:'tristate'},
    {key:'Refresh',      label:'Refresh',         type:'tristate'},
    {key:'Requirements', label:'Requirements',    type:'list'},
    ...COMMON_SCHEMA,
  ],
  spacer: [
    {key:'Height', label:'Height (px)', type:'number'},
  ],
  divider: [
    {key:'Color',  label:'Color',        type:'color'},
    {key:'Height', label:'Height (px)',  type:'number'},
  ],
  panel: [
    {key:'Id',             label:'ID',              type:'text'},
    {key:'Layout',         label:'Layout',          type:'select', options:['Vertical','Horizontal','TopScrolling']},
    {key:'Padding',        label:'Padding',         type:'padding'},
    {key:'ScrollbarStyle', label:'Scrollbar Style', type:'text', placeholder:'@DefaultScrollbarStyle'},
    {key:'FlexWeight',     label:'Flex Weight (0=none)', type:'number'},
    {key:'Background',     label:'Background',      type:'color-nullable'},
    {key:'Requirements',   label:'Requirements',    type:'list'},
    ...COMMON_SCHEMA,
  ],
  image: [
    {key:'Id',           label:'ID',              type:'text'},
    {key:'Src',          label:'Src Path',        type:'text'},
    {key:'Width',        label:'Width',           type:'number'},
    {key:'Height',       label:'Height',          type:'number'},
    {key:'Requirements', label:'Requirements',    type:'list'},
    ...COMMON_SCHEMA,
  ],
  itemicon: [
    {key:'Id',           label:'ID',              type:'text'},
    {key:'ItemId',       label:'Item ID',         type:'text'},
    {key:'Size',         label:'Size (px)',       type:'number'},
    {key:'Requirements', label:'Requirements',    type:'list'},
    ...COMMON_SCHEMA,
  ],
  itemgrid: [
    {key:'Id',                   label:'ID',              type:'text'},
    {key:'SlotsPerRow',          label:'Slots Per Row',   type:'number'},
    {key:'DisplayItemQuantity',  label:'Show Quantities', type:'checkbox'},
    {key:'SlotSpacing',          label:'Slot Spacing (default 0)',    type:'number'},
    {key:'SlotSize',             label:'Slot Size (px, default 64)',  type:'number'},
    {key:'Requirements',         label:'Requirements',    type:'list'},
    ...COMMON_SCHEMA,
  ],
  progressbar: [
    {key:'Id',           label:'ID',                      type:'text'},
    {key:'Value',        label:'Value (0.0-1.0 or var)',  type:'text'},
    {key:'Max',          label:'Max (0=none)',             type:'number'},
    {key:'Width',        label:'Width',                   type:'number'},
    {key:'Height',       label:'Height',                  type:'number'},
    {key:'Color',           label:'Color',                   type:'color-nullable'},
    {key:'Circular',        label:'Circular',                type:'checkbox'},
    {key:'MaskTexturePath', label:'Mask Texture (circular)',  type:'text'},
    {key:'Requirements',    label:'Requirements',            type:'list'},
    ...COMMON_SCHEMA,
  ],
  hyvatar: [
    {key:'Id',           label:'ID',              type:'text'},
    {key:'Username',     label:'Username',        type:'text'},
    {key:'Render',       label:'Render Style',    type:'select', options:['head','body','bust','full']},
    {key:'Size',         label:'Size (px)',       type:'number'},
    {key:'Requirements', label:'Requirements',    type:'list'},
    ...COMMON_SCHEMA,
  ],
  checkbox: [
    {key:'Id',                   label:'ID',               type:'text'},
    {key:'Label',                label:'Label',            type:'text'},
    {key:'CheckedRequirements',  label:'Checked When',     type:'list'},
    {key:'CheckActions',         label:'Check Actions',    type:'list'},
    {key:'UncheckActions',       label:'Uncheck Actions',  type:'list'},
    {key:'CloseOnClick',         label:'Close on Click',   type:'tristate'},
    {key:'Refresh',              label:'Refresh',          type:'tristate'},
    {key:'Requirements',         label:'Requirements',     type:'list'},
    ...COMMON_SCHEMA,
  ],
  dropdown: [
    {key:'Id',           label:'ID',             type:'text'},
    {key:'CloseOnClick', label:'Close on Click', type:'tristate'},
    {key:'Refresh',      label:'Refresh',        type:'tristate'},
    {key:'Requirements', label:'Requirements',   type:'list'},
    ...COMMON_SCHEMA,
  ],
  sprite: [
    {key:'Id',           label:'ID',                  type:'text'},
    {key:'Src',          label:'Texture Path',        type:'text'},
    {key:'Width',        label:'Width',               type:'number'},
    {key:'Height',       label:'Height',              type:'number'},
    {key:'FrameWidth',   label:'Frame Width (0=none)',  type:'number'},
    {key:'FrameHeight',  label:'Frame Height',        type:'number'},
    {key:'FramePerRow',  label:'Frames Per Row',      type:'number'},
    {key:'FrameCount',   label:'Frame Count',         type:'number'},
    {key:'Fps',          label:'FPS (0=default)',     type:'number'},
    {key:'Requirements', label:'Requirements',        type:'list'},
    ...COMMON_SCHEMA,
  ],
  hotkeylabel: [
    {key:'Id',                   label:'ID',                   type:'text'},
    {key:'InputBindingKey',      label:'Input Binding Key',    type:'text'},
    {key:'InputBindingKeyPrefix',label:'Key Prefix (optional)',type:'text'},
    {key:'Requirements',         label:'Requirements',         type:'list'},
    ...COMMON_SCHEMA,
  ],
};

// ── State ─────────────────────────────────────────────────────────────────────

let state = {
  def: clone(GUI_DEFAULTS),
  selectedPath: null,   // null = nothing; [] or array of ints = element path
  addToPath: [],        // where next addElement() goes
};

// ── Utils ─────────────────────────────────────────────────────────────────────

function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

function pathEq(a, b) {
  if (a === b) return true;
  if (!a || !b || a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

/** Get the elements array at a given parent path (empty = root). */
function elemsAt(parentPath) {
  let arr = state.def.Elements;
  for (const i of parentPath) arr = arr[i].Elements;
  return arr;
}

/** Get element at a full path (last index = element index in its parent). */
function elemAt(path) {
  return elemsAt(path.slice(0, -1))[path[path.length - 1]];
}

function displayName(el) {
  switch (el.Type) {
    case 'label':       return el.Text ? `"${el.Text.slice(0, 28)}"` : 'Label';
    case 'button':      return el.Text ? `[${el.Text.slice(0, 26)}]` : 'Button';
    case 'panel':       return el.Id  ? `Panel #${el.Id}` : `Panel (${el.Layout || 'V'})`;
    case 'spacer':      return `Spacer ${el.Height || 10}px`;
    case 'divider':     return 'Divider';
    case 'image':       return el.Src ? el.Src.split('/').pop() : 'Image';
    case 'itemicon':    return el.ItemId || 'Item Icon';
    case 'itemgrid':    return `Grid (${(el.Slots || []).length} slots)`;
    case 'progressbar': return `Progress (${el.Value})`;
    case 'hyvatar':     return `Avatar: ${el.Username || '{player}'}`;
    case 'checkbox':    return el.Label || 'Checkbox';
    case 'dropdown':    return `Dropdown (${(el.Options || []).length} opts)`;
    case 'sprite':      return el.Src ? el.Src.split('/').pop() : 'Sprite';
    case 'hotkeylabel': return el.InputBindingKey ? `[${el.InputBindingKey}]` : 'Hotkey Label';
    default:            return el.Type;
  }
}

// ── Element Operations ────────────────────────────────────────────────────────

function addElement(type, parentPath) {
  const els = elemsAt(parentPath || []);
  els.push(clone(ELEM_DEFAULTS[type]));
  state.selectedPath = [...(parentPath || []), els.length - 1];
  refresh();
}

function removeElement(path) {
  elemsAt(path.slice(0, -1)).splice(path[path.length - 1], 1);
  state.selectedPath = null;
  refresh();
}

function moveElement(path, dir) {
  const els = elemsAt(path.slice(0, -1));
  const i = path[path.length - 1];
  const j = i + dir;
  if (j < 0 || j >= els.length) return;
  [els[i], els[j]] = [els[j], els[i]];
  state.selectedPath = [...path.slice(0, -1), j];
  refresh();
}

function isAncestorOrEqual(ancestor, path) {
  if (ancestor.length > path.length) return false;
  return ancestor.every((v, i) => v === path[i]);
}

function moveElementTo(fromPath, targetParentPath, targetIdx) {
  if (isAncestorOrEqual(fromPath, targetParentPath)) return;

  const fromParent = elemsAt(fromPath.slice(0, -1));
  const fromIdx = fromPath[fromPath.length - 1];
  const element = fromParent[fromIdx];

  const targetFull = [...targetParentPath, targetIdx];
  let k = 0;
  while (k < fromPath.length - 1 && k < targetFull.length && fromPath[k] === targetFull[k]) k++;
  if (k < targetFull.length && k === fromPath.length - 1 && targetFull[k] > fromIdx) {
    targetFull[k] -= 1;
  }

  fromParent.splice(fromIdx, 1);

  const newParentPath = targetFull.slice(0, -1);
  const newIdx = targetFull[targetFull.length - 1];
  const newParent = elemsAt(newParentPath);
  const clamped = Math.max(0, Math.min(newIdx, newParent.length));
  newParent.splice(clamped, 0, element);

  state.selectedPath = [...newParentPath, clamped];
  refresh();
}

function duplicateElement(path) {
  const els = elemsAt(path.slice(0, -1));
  const i = path[path.length - 1];
  const dup = clone(els[i]);
  if (dup.Id) dup.Id += '_copy';
  els.splice(i + 1, 0, dup);
  state.selectedPath = [...path.slice(0, -1), i + 1];
  refresh();
}

// ── HyUIML Export ─────────────────────────────────────────────────────────────

function exportHtml() {
  const def = state.def;
  const id      = def.Id || '';
  const title   = escAttr(def.Title || '');
  const width   = def.Width  || 480;
  const height  = def.Height || 420;

  let containerAttrs = `class="container"\n     data-hyui-title="${title}"\n     style="anchor-width: ${width}; anchor-height: ${height};"`;
  if (id)          containerAttrs += `\n     data-ql-id="${escAttr(id)}"`;
  if (def.Command) containerAttrs += `\n     data-ql-command="${escAttr(def.Command)}"`;
  if (def.DefaultCloseOnClick) containerAttrs += `\n     data-ql-close="true"`;
  if (!def.DefaultRefresh)     containerAttrs += `\n     data-ql-refresh="false"`;

  const layoutMode = layoutKeyword(def.Layout);
  const innerStyle = [`layout-mode: ${layoutMode};`, paddingStyle(def.Padding)].filter(Boolean).join(' ');
  const scrollbar = def.ScrollbarStyle ? ` data-hyui-scrollbar-style="${escAttr(def.ScrollbarStyle)}"` : '';
  const inner = elementsToHtml(def.Elements || [], '        ');
  return `<div ${containerAttrs}>\n    <div class="container-contents">\n        <div style="${innerStyle}"${scrollbar}>\n${inner}        </div>\n    </div>\n</div>`;
}

// GUI Layout enum -> HyUIML layout-mode keyword.
function layoutKeyword(layout) {
  switch (layout) {
    case 'Horizontal':   return 'Left';
    case 'TopScrolling': return 'TopScrolling';
    default:             return 'Top';
  }
}

function elementsToHtml(elements, indent) {
  return elements.map(el => elementToHtml(el, indent)).join('\n') + (elements.length ? '\n' : '');
}

function elementToHtml(el, indent) {
  switch (el.Type) {
    case 'label':       return labelToHtml(el, indent);
    case 'button':      return buttonToHtml(el, indent);
    case 'spacer':      return spacerToHtml(el, indent);
    case 'divider':     return dividerToHtml(el, indent);
    case 'panel':       return panelToHtml(el, indent);
    case 'image':       return imageToHtml(el, indent);
    case 'itemicon':    return itemiconToHtml(el, indent);
    case 'itemgrid':    return itemgridToHtml(el, indent);
    case 'progressbar': return progressbarToHtml(el, indent);
    case 'hyvatar':     return hyvatarToHtml(el, indent);
    case 'checkbox':    return checkboxToHtml(el, indent);
    case 'dropdown':    return dropdownToHtml(el, indent);
    case 'sprite':      return spriteToHtml(el, indent);
    case 'hotkeylabel': return hotkeylabelToHtml(el, indent);
    default:            return '';
  }
}

function labelToHtml(el, indent) {
  const fontSize = el.FontSize > 0 ? el.FontSize : 15;
  let style = `font-size: ${fontSize}; color: ${el.Color || '#cccccc'}; vertical-align: Center;`;
  if (el.Bold)              style += ' font-bold: true;';
  if (el.Width > 0)          style += ` anchor-width: ${el.Width};`;
  if (el.FlexWeight > 0)     style += ` flex-weight: ${el.FlexWeight};`;
  const extras = commonStyle(el);
  if (extras) style += ' ' + extras;
  let attrs = `style="${style}"`;
  if (el.Id) attrs = `id="${escAttr(el.Id)}" ` + attrs;
  if (el.Requirements && el.Requirements.length) attrs += ` data-ql-req="${escAttr(el.Requirements.join('|'))}"`;
  attrs += commonAttrs(el);
  return `${indent}<label ${attrs}>${escText(el.Text || '')}</label>`;
}

function buttonToHtml(el, indent) {
  const cls = el.Style || 'default';
  let attrs = `class="${cls}"`;
  if (el.Id) attrs = `id="${escAttr(el.Id)}" ` + attrs;
  const extras = commonStyle(el);
  const btnStyle = [
    el.Width > 0       ? `anchor-width: ${el.Width};`       : '',
    el.FlexWeight > 0  ? `flex-weight: ${el.FlexWeight};`   : '',
    extras,
  ].filter(Boolean).join(' ');
  if (btnStyle) attrs += ` style="${btnStyle}"`;
  if (el.Requirements && el.Requirements.length) attrs += ` data-ql-req="${escAttr(el.Requirements.join('|'))}"`;
  if (el.Actions && el.Actions.length)            attrs += ` data-ql-actions="${escAttr(el.Actions.join('|'))}"`;
  if (el.CloseOnClick !== null && el.CloseOnClick !== undefined) attrs += ` data-ql-close="${el.CloseOnClick}"`;
  if (el.Refresh !== null && el.Refresh !== undefined)           attrs += ` data-ql-refresh="${el.Refresh}"`;
  attrs += commonAttrs(el);
  return `${indent}<button ${attrs}>${escText(el.Text || '')}</button>`;
}

function spacerToHtml(el, indent) {
  return `${indent}<div style="anchor-height: ${el.Height || 10};"></div>`;
}

function dividerToHtml(el, indent) {
  return `${indent}<div style="anchor-height: ${el.Height || 1}; background-color: ${el.Color || '#333333'};"></div>`;
}

function panelToHtml(el, indent) {
  const layoutMode = layoutKeyword(el.Layout);
  let style = `layout-mode: ${layoutMode};`;
  const pad = paddingStyle(el.Padding);
  if (pad)               style += ' ' + pad;
  if (el.FlexWeight > 0) style += ` flex-weight: ${el.FlexWeight};`;
  if (el.Background)     style += ` background-color: ${el.Background};`;
  const extras = commonStyle(el);
  if (extras)            style += ' ' + extras;
  let attrs = `style="${style}"`;
  if (el.Id) attrs = `id="${escAttr(el.Id)}" ` + attrs;
  if (el.Requirements && el.Requirements.length) attrs += ` data-ql-req="${escAttr(el.Requirements.join('|'))}"`;
  if (el.ScrollbarStyle) attrs += ` data-hyui-scrollbar-style="${escAttr(el.ScrollbarStyle)}"`;
  attrs += commonAttrs(el);
  const childIndent = indent + '  ';
  const children = elementsToHtml(el.Elements || [], childIndent);
  return `${indent}<div ${attrs}>\n${children}${indent}</div>`;
}

function imageToHtml(el, indent) {
  let attrs = `src="${escAttr(el.Src || '')}"`;
  const sizeStyle = el.Width > 0 ? `anchor-width: ${el.Width}; anchor-height: ${el.Height};` : '';
  const extras = commonStyle(el);
  const style = [sizeStyle, extras].filter(Boolean).join(' ');
  if (style) attrs += ` style="${style}"`;
  if (el.Id) attrs = `id="${escAttr(el.Id)}" ` + attrs;
  if (el.Requirements && el.Requirements.length) attrs += ` data-ql-req="${escAttr(el.Requirements.join('|'))}"`;
  attrs += commonAttrs(el);
  return `${indent}<img ${attrs}>`;
}

function itemiconToHtml(el, indent) {
  let attrs = `class="item-icon" data-hyui-item-id="${escAttr(el.ItemId || '')}"`;
  const sizeStyle = el.Size > 0 ? `anchor-width: ${el.Size}; anchor-height: ${el.Size};` : '';
  const extras = commonStyle(el);
  const style = [sizeStyle, extras].filter(Boolean).join(' ');
  if (style) attrs += ` style="${style}"`;
  if (el.Id) attrs = `id="${escAttr(el.Id)}" ` + attrs;
  if (el.Requirements && el.Requirements.length) attrs += ` data-ql-req="${escAttr(el.Requirements.join('|'))}"`;
  attrs += commonAttrs(el);
  return `${indent}<span ${attrs}></span>`;
}

function itemgridToHtml(el, indent) {
  let attrs = `class="item-grid"`;
  if (el.Id) attrs = `id="${escAttr(el.Id)}" ` + attrs;
  attrs += ` data-hyui-slots-per-row="${el.SlotsPerRow || 5}"`;
  attrs += ` data-hyui-display-item-quantity="${el.DisplayItemQuantity !== false}"`;
  const styleProps = [
    el.SlotSize    != null ? `SlotSize: ${el.SlotSize}; SlotIconSize: ${el.SlotSize};` : '',
    el.SlotSpacing != null ? `SlotSpacing: ${el.SlotSpacing};` : '',
  ].filter(Boolean).join(' ');
  if (styleProps) attrs += ` data-hyui-style="${escAttr(styleProps)}"`;
  const extras = commonStyle(el);
  if (extras) attrs += ` style="${extras}"`;
  if (el.Requirements && el.Requirements.length) attrs += ` data-ql-req="${escAttr(el.Requirements.join('|'))}"`;
  attrs += commonAttrs(el);
  const childIndent = indent + '  ';
  const slots = (el.Slots || []).map(s => slotToHtml(s, childIndent)).join('\n');
  return `${indent}<div ${attrs}>\n${slots}${slots ? '\n' : ''}${indent}</div>`;
}

function slotToHtml(slot, indent) {
  let attrs = `class="item-grid-slot" data-hyui-item-id="${escAttr(slot.ItemId || '')}" data-hyui-quantity="${slot.Quantity || 1}"`;
  if (slot.Name)        attrs += ` data-hyui-name="${escAttr(slot.Name)}"`;
  if (slot.Description) attrs += ` data-hyui-description="${escAttr(slot.Description)}"`;
  if (slot.Requirements && slot.Requirements.length)         attrs += ` data-ql-req="${escAttr(slot.Requirements.join('|'))}"`;
  if (slot.Actions && slot.Actions.length)                   attrs += ` data-ql-actions="${escAttr(slot.Actions.join('|'))}"`;
  if (slot.ClickRequirements && slot.ClickRequirements.length) attrs += ` data-ql-click-req="${escAttr(slot.ClickRequirements.join('|'))}"`;
  if (slot.CloseOnClick !== null && slot.CloseOnClick !== undefined) attrs += ` data-ql-close="${slot.CloseOnClick}"`;
  if (slot.Refresh !== null && slot.Refresh !== undefined)           attrs += ` data-ql-refresh="${slot.Refresh}"`;
  return `${indent}<div ${attrs}></div>`;
}

function progressbarToHtml(el, indent) {
  const extras = commonStyle(el);
  const style = [`anchor-width: ${el.Width || 200}; anchor-height: ${el.Height || 20};`, extras].filter(Boolean).join(' ');
  let attrs = `value="${escAttr(String(el.Value || '0'))}"`;
  if (el.Max > 0) attrs += ` max="${el.Max}"`;
  attrs += ` style="${style}"`;
  if (el.Circular) {
    attrs += ` class="circular"`;
    if (el.Color) attrs += ` data-hyui-color="${escAttr(el.Color)}"`;
  } else {
    attrs += ` data-hyui-alignment="Horizontal" data-hyui-direction="End"`;
  }
  if (el.Id) attrs = `id="${escAttr(el.Id)}" ` + attrs;
  if (el.Requirements && el.Requirements.length) attrs += ` data-ql-req="${escAttr(el.Requirements.join('|'))}"`;
  attrs += commonAttrs(el);
  const inner = `${indent}  <progress ${attrs}></progress>`;
  return `${indent}<div style="layout-mode: Left; anchor-height: ${el.Circular ? (el.Width || 200) : (el.Height || 20)};">\n${inner}\n${indent}</div>`;
}

function hyvatarToHtml(el, indent) {
  let attrs = `username="${escAttr(el.Username || '{player}')}" render="${escAttr(el.Render || 'head')}" size="${el.Size || 64}"`;
  const extras = commonStyle(el);
  if (extras) attrs += ` style="${extras}"`;
  if (el.Id) attrs = `id="${escAttr(el.Id)}" ` + attrs;
  if (el.Requirements && el.Requirements.length) attrs += ` data-ql-req="${escAttr(el.Requirements.join('|'))}"`;
  attrs += commonAttrs(el);
  return `${indent}<hyvatar ${attrs}></hyvatar>`;
}

function checkboxToHtml(el, indent) {
  let attrs = `type="checkbox"`;
  if (el.Id)    attrs += ` id="${escAttr(el.Id)}"`;
  if (el.Label) attrs += ` data-ql-label="${escAttr(el.Label)}"`;
  if (el.CheckedRequirements && el.CheckedRequirements.length) attrs += ` data-ql-check-req="${escAttr(el.CheckedRequirements.join('|'))}"`;
  if (el.CheckActions && el.CheckActions.length)               attrs += ` data-ql-check-actions="${escAttr(el.CheckActions.join('|'))}"`;
  if (el.UncheckActions && el.UncheckActions.length)           attrs += ` data-ql-uncheck-actions="${escAttr(el.UncheckActions.join('|'))}"`;
  if (el.Requirements && el.Requirements.length) attrs += ` data-ql-req="${escAttr(el.Requirements.join('|'))}"`;
  if (el.CloseOnClick !== null && el.CloseOnClick !== undefined) attrs += ` data-ql-close="${el.CloseOnClick}"`;
  if (el.Refresh !== null && el.Refresh !== undefined)           attrs += ` data-ql-refresh="${el.Refresh}"`;
  const extras = commonStyle(el);
  if (extras) attrs += ` style="${extras}"`;
  attrs += commonAttrs(el);
  return `${indent}<input ${attrs} />`;
}

function dropdownToHtml(el, indent) {
  let attrs = '';
  if (el.Id) attrs += `id="${escAttr(el.Id)}" `;
  if (el.Requirements && el.Requirements.length) attrs += `data-ql-req="${escAttr(el.Requirements.join('|'))}" `;
  if (el.CloseOnClick !== null && el.CloseOnClick !== undefined) attrs += `data-ql-close="${el.CloseOnClick}" `;
  if (el.Refresh !== null && el.Refresh !== undefined) attrs += `data-ql-refresh="${el.Refresh}" `;
  const extras = commonStyle(el);
  if (extras) attrs += `style="${extras}" `;
  attrs += commonAttrs(el).trimStart();
  attrs = attrs.trimEnd();
  const childIndent = indent + '  ';
  const options = (el.Options || []).map(opt => {
    let oa = `value="${escAttr(opt.Value || '')}"`;
    if (opt.Requirements && opt.Requirements.length) oa += ` data-ql-req="${escAttr(opt.Requirements.join('|'))}"`;
    if (opt.Actions && opt.Actions.length) oa += ` data-ql-actions="${escAttr(opt.Actions.join('|'))}"`;
    if (opt.CloseOnClick !== null && opt.CloseOnClick !== undefined) oa += ` data-ql-close="${opt.CloseOnClick}"`;
    if (opt.Refresh !== null && opt.Refresh !== undefined) oa += ` data-ql-refresh="${opt.Refresh}"`;
    return `${childIndent}<option ${oa}>${escText(opt.Label || opt.Value || '')}</option>`;
  }).join('\n');
  const open = attrs ? `<select ${attrs}>` : `<select>`;
  return `${indent}${open}\n${options}${options ? '\n' : ''}${indent}</select>`;
}

function spriteToHtml(el, indent) {
  const extras = commonStyle(el);
  const style = [`anchor-width: ${el.Width || 64}; anchor-height: ${el.Height || 64};`, extras].filter(Boolean).join(' ');
  let attrs = `src="${escAttr(el.Src || '')}" style="${style}"`;
  if (el.Id) attrs = `id="${escAttr(el.Id)}" ` + attrs;
  if (el.Requirements && el.Requirements.length) attrs += ` data-ql-req="${escAttr(el.Requirements.join('|'))}"`;
  const fw = el.FrameWidth || 0, fh = el.FrameHeight || 0, fpr = el.FramePerRow || 0, fc = el.FrameCount || 0;
  if (fw > 0 && fh > 0 && fpr > 0 && fc > 0) {
    attrs += ` data-hyui-frame-width="${fw}" data-hyui-frame-height="${fh}" data-hyui-frame-per-row="${fpr}" data-hyui-frame-count="${fc}"`;
  }
  if (el.Fps > 0) attrs += ` data-hyui-fps="${el.Fps}"`;
  attrs += commonAttrs(el);
  return `${indent}<sprite ${attrs}></sprite>`;
}

function hotkeylabelToHtml(el, indent) {
  let attrs = '';
  if (el.Id) attrs += `id="${escAttr(el.Id)}" `;
  if (el.InputBindingKey) attrs += `input-binding-key="${escAttr(el.InputBindingKey)}" `;
  if (el.InputBindingKeyPrefix) attrs += `input-binding-key-prefix="${escAttr(el.InputBindingKeyPrefix)}" `;
  if (el.Requirements && el.Requirements.length) attrs += `data-ql-req="${escAttr(el.Requirements.join('|'))}" `;
  const extras = commonStyle(el);
  if (extras) attrs += `style="${extras}" `;
  attrs += commonAttrs(el).trimStart();
  attrs = attrs.trimEnd();
  return attrs ? `${indent}<hotkey-label ${attrs}></hotkey-label>` : `${indent}<hotkey-label></hotkey-label>`;
}

function escAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escText(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── Common style/attr emission ────────────────────────────────────────────────
// Emits anchor-*, visibility from el.Anchor / el.Visible. Returns a space-
// prefixed string fragment (may be empty).
const ANCHOR_KEYS = [
  ['Top','top'], ['Left','left'], ['Right','right'], ['Bottom','bottom'],
  ['Horizontal','horizontal'], ['Vertical','vertical'],
  ['MinWidth','min-width'], ['MaxWidth','max-width'],
];
function anchorStyle(anchor) {
  if (!anchor) return '';
  const parts = [];
  for (const [js, css] of ANCHOR_KEYS) {
    const v = anchor[js];
    if (v !== null && v !== undefined && v !== '') parts.push(`anchor-${css}: ${v};`);
  }
  return parts.join(' ');
}
function visibilityStyle(visible) {
  if (visible === false) return 'visibility: hidden;';
  if (visible === true)  return 'visibility: shown;';
  return '';
}
function alignStyle(align) {
  if (align === 'Center') return 'horizontal-align: Center;';
  if (align === 'End')    return 'horizontal-align: End;';
  return '';
}
function commonStyle(el) {
  return [anchorStyle(el.Anchor), visibilityStyle(el.Visible), alignStyle(el.Align)].filter(Boolean).join(' ');
}
function commonAttrs(el) {
  return el.TooltipText ? ` data-hyui-tooltiptext="${escAttr(el.TooltipText)}"` : '';
}

// Emit a `padding: ...` style fragment from a padding object. Returns '' when
// the padding has no effect (all zeros).
function paddingStyle(p) {
  if (p === null || p === undefined) return '';
  if (typeof p === 'number') return p > 0 ? `padding: ${p};` : '';
  const mode = p.Mode || 'full';
  if (mode === 'full') return p.Full > 0 ? `padding: ${p.Full};` : '';
  if (mode === 'symmetric') {
    const v = p.Vertical || 0, h = p.Horizontal || 0;
    return (v || h) ? `padding: ${v} ${h};` : '';
  }
  const parts = [];
  if (p.Top)    parts.push(`padding-top: ${p.Top};`);
  if (p.Left)   parts.push(`padding-left: ${p.Left};`);
  if (p.Right)  parts.push(`padding-right: ${p.Right};`);
  if (p.Bottom) parts.push(`padding-bottom: ${p.Bottom};`);
  return parts.join(' ');
}

// Parse anchor-* and visibility out of a style string into el.Anchor/el.Visible.
function parseCommonStyle(el, styleStr) {
  if (!styleStr) return;
  const anchor = clone(EMPTY_ANCHOR);
  let used = false;
  for (const [js, css] of ANCHOR_KEYS) {
    const m = styleStr.match(new RegExp(`anchor-${css}:\\s*(-?\\d+)`));
    if (m) { anchor[js] = parseInt(m[1]); used = true; }
  }
  if (used) el.Anchor = anchor;
  const vm = styleStr.match(/visibility:\s*(hidden|shown)/);
  if (vm) el.Visible = vm[1] === 'shown';
  const am = styleStr.match(/horizontal-align:\s*(Center|End|Start)/);
  if (am) el.Align = am[1];
}

function parseCommonAttrs(el, node) {
  const tt = node.getAttribute('data-hyui-tooltiptext');
  if (tt) el.TooltipText = tt;
}

// Parse a padding fragment from a style string into a padding object, or null.
function parsePaddingStyle(styleStr) {
  if (!styleStr) return null;
  const sides = {};
  let hasSides = false;
  for (const [css, js] of [['top','Top'],['left','Left'],['right','Right'],['bottom','Bottom']]) {
    const m = styleStr.match(new RegExp(`padding-${css}:\\s*(-?\\d+)`));
    if (m) { sides[js] = parseInt(m[1]); hasSides = true; }
  }
  if (hasSides) {
    return { Mode:'sides', Full:0, Vertical:0, Horizontal:0,
             Top:sides.Top||0, Left:sides.Left||0, Right:sides.Right||0, Bottom:sides.Bottom||0 };
  }
  const two = styleStr.match(/(?:^|[;\s])padding:\s*(\d+)\s+(\d+)/);
  if (two) return { Mode:'symmetric', Full:0, Vertical:parseInt(two[1]), Horizontal:parseInt(two[2]),
                    Top:0, Left:0, Right:0, Bottom:0 };
  const one = styleStr.match(/(?:^|[;\s])padding:\s*(\d+)/);
  if (one) return { Mode:'full', Full:parseInt(one[1]), Vertical:0, Horizontal:0,
                    Top:0, Left:0, Right:0, Bottom:0 };
  return null;
}

// ── HyUIML Import ─────────────────────────────────────────────────────────────

function importHtml(text) {
  // Auto-detect JSON (legacy .gui.json files) and convert transparently
  if (text.trimStart().startsWith('{')) return importJson(text);

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<!DOCTYPE html><body>${text}</body>`, 'text/html');
    const container = doc.querySelector('body > .container, body > *:first-child');
    if (!container) throw new Error('No container element found');

    function styleInt(style, prop, def) {
      if (!style) return def;
      const m = style.match(new RegExp(prop + ':\\s*(\\d+)'));
      return m ? parseInt(m[1]) : def;
    }
    function splitPipe(s) { return s ? s.split('|').map(x => x.trim()).filter(Boolean) : []; }
    function attr(el, name, def) { const v = el.getAttribute(name); return (v !== null && v !== '') ? v : def; }
    function boolAttr(el, name, def) { const v = el.getAttribute(name); return v !== null ? v === 'true' : def; }

    const style = container.getAttribute('style') || '';
    const def = {
      Id:                  attr(container, 'data-ql-id', ''),
      Title:               attr(container, 'data-hyui-title', ''),
      Width:               styleInt(style, 'anchor-width', 480),
      Height:              styleInt(style, 'anchor-height', 420),
      CloseButton:         true,
      Layout:              'Vertical',
      Padding:             clone(GUI_DEFAULTS.Padding),
      ScrollbarStyle:      '',
      DefaultCloseOnClick: boolAttr(container, 'data-ql-close', false),
      DefaultRefresh:      boolAttr(container, 'data-ql-refresh', true),
      Command:             attr(container, 'data-ql-command', null),
      Elements:            []
    };

    const contents = container.querySelector('.container-contents') || container;
    // The inner wrapper <div> carries the root-level layout-mode, padding and
    // scrollbar style. We pull those back to the GUI-level def and then treat
    // its children as the real root elements.
    const inner = Array.from(contents.children).find(c => c.tagName === 'DIV');
    let rootChildren = contents.children;
    if (inner && !inner.className) {
      const ims = inner.getAttribute('style') || '';
      const lm = ims.match(/layout-mode:\s*(\w+)/);
      if (lm) def.Layout = lm[1] === 'Left' ? 'Horizontal' : (lm[1] === 'TopScrolling' ? 'TopScrolling' : 'Vertical');
      const pad = parsePaddingStyle(ims);
      if (pad) def.Padding = pad;
      const sb = inner.getAttribute('data-hyui-scrollbar-style');
      if (sb) def.ScrollbarStyle = sb;
      rootChildren = inner.children;
    }
    def.Elements = parseChildElements(rootChildren);
    fixElems(def.Elements);

    state.def = def;
    state.selectedPath = null;
    refresh();
    return null;
  } catch (e) {
    return e.message;
  }
}

function parseChildElements(children) {
  const result = [];
  for (const node of children) {
    const el = parseHtmlElement(node);
    if (el) result.push(el);
  }
  return result;
}

function parseHtmlElement(node) {
  if (node.nodeType !== 1) return null;
  const tag = node.tagName.toLowerCase();
  function splitPipe(s) { return s ? s.split('|').map(x => x.trim()).filter(Boolean) : []; }
  function attr(name, def) { const v = node.getAttribute(name); return (v !== null && v !== '') ? v : def; }
  function styleInt(prop, def) {
    const s = node.getAttribute('style') || '';
    const m = s.match(new RegExp(prop + ':\\s*(\\d+)'));
    return m ? parseInt(m[1]) : def;
  }

  const reqs = splitPipe(node.getAttribute('data-ql-req'));
  const id = attr('id', '');

  // Finalize: populate common fields (Anchor/Visible/TooltipText) from the
  // element's style+attrs so callers don't have to repeat the boilerplate.
  const finalize = (el) => {
    const s = node.getAttribute('style') || '';
    parseCommonStyle(el, s);
    parseCommonAttrs(el, node);
    if (el.Anchor === undefined)      el.Anchor = clone(EMPTY_ANCHOR);
    if (el.Visible === undefined)     el.Visible = null;
    if (el.TooltipText === undefined) el.TooltipText = '';
    return el;
  };

  if (tag === 'label') {
    const s = node.getAttribute('style') || '';
    return finalize({ Type: 'label', Id: id, Text: node.textContent,
      Color:    (s.match(/color:\s*(#[0-9a-fA-F]+)/) || [])[1] || '#cccccc',
      Bold:     /font-bold:\s*true/.test(s),
      Width:    styleInt('anchor-width', 0),
      FontSize: parseInt((s.match(/font-size:\s*(\d+)/) || [,'0'])[1]) || 0,
      Requirements: reqs });
  }
  if (tag === 'button') {
    const close = node.getAttribute('data-ql-close');
    const refresh = node.getAttribute('data-ql-refresh');
    return finalize({ Type: 'button', Id: id, Text: node.textContent,
      Style:       attr('class', 'default'),
      Width:       styleInt('anchor-width', 0),
      Actions:     splitPipe(node.getAttribute('data-ql-actions')),
      CloseOnClick: close !== null ? close === 'true' : null,
      Refresh:      refresh !== null ? refresh === 'true' : null,
      Requirements: reqs });
  }
  if (tag === 'input' && attr('type', '').toLowerCase() === 'checkbox') {
    const close = node.getAttribute('data-ql-close');
    const refresh = node.getAttribute('data-ql-refresh');
    return finalize({ Type: 'checkbox', Id: id,
      Label:               attr('data-ql-label', ''),
      CheckedRequirements: splitPipe(node.getAttribute('data-ql-check-req')),
      CheckActions:        splitPipe(node.getAttribute('data-ql-check-actions')),
      UncheckActions:      splitPipe(node.getAttribute('data-ql-uncheck-actions')),
      CloseOnClick:        close !== null ? close === 'true' : null,
      Refresh:             refresh !== null ? refresh === 'true' : null,
      Requirements: reqs });
  }
  if (tag === 'select') {
    const close = node.getAttribute('data-ql-close');
    const refresh = node.getAttribute('data-ql-refresh');
    const options = [];
    for (const opt of node.querySelectorAll('option')) {
      const oc = opt.getAttribute('data-ql-close');
      const or_ = opt.getAttribute('data-ql-refresh');
      options.push({
        Value:        opt.getAttribute('value') || opt.textContent,
        Label:        opt.textContent,
        Actions:      splitPipe(opt.getAttribute('data-ql-actions')),
        Requirements: splitPipe(opt.getAttribute('data-ql-req')),
        CloseOnClick: oc !== null ? oc === 'true' : null,
        Refresh:      or_ !== null ? or_ === 'true' : null,
      });
    }
    return finalize({ Type: 'dropdown', Id: id,
      CloseOnClick: close !== null ? close === 'true' : null,
      Refresh:      refresh !== null ? refresh === 'true' : null,
      Requirements: reqs, Options: options });
  }
  if (tag === 'sprite') {
    const fw = parseInt(node.getAttribute('data-hyui-frame-width') || '0') || 0;
    return finalize({ Type: 'sprite', Id: id,
      Src:         attr('src', ''),
      Width:       styleInt('anchor-width', 64),
      Height:      styleInt('anchor-height', 64),
      FrameWidth:  fw,
      FrameHeight: parseInt(node.getAttribute('data-hyui-frame-height') || '0') || 0,
      FramePerRow: parseInt(node.getAttribute('data-hyui-frame-per-row') || '0') || 0,
      FrameCount:  parseInt(node.getAttribute('data-hyui-frame-count') || '0') || 0,
      Fps:         parseInt(node.getAttribute('data-hyui-fps') || '0') || 0,
      Requirements: reqs });
  }
  if (tag === 'hotkey-label' || tag === 'hyui-hotkey-label') {
    return finalize({ Type: 'hotkeylabel', Id: id,
      InputBindingKey:       attr('input-binding-key', '') || attr('data-hyui-input-binding-key', ''),
      InputBindingKeyPrefix: attr('input-binding-key-prefix', '') || attr('data-hyui-input-binding-key-prefix', ''),
      Requirements: reqs });
  }
  if (tag === 'hyvatar') {
    return finalize({ Type: 'hyvatar', Id: id,
      Username: attr('username', '{player}'),
      Render:   attr('render', 'head'),
      Size:     parseInt(attr('size', '64')) || 64,
      Requirements: reqs });
  }
  if (tag === 'progress') {
    const s   = node.getAttribute('style') || '';
    const cls = node.getAttribute('class') || '';
    const dataColor = node.getAttribute('data-hyui-color');
    return finalize({ Type: 'progressbar', Id: id,
      Value:    attr('value', '0'),
      Max:      parseFloat(attr('max', '0')) || 0,
      Width:    styleInt('anchor-width', 200),
      Height:   styleInt('anchor-height', 20),
      Color:    dataColor || (s.match(/color:\s*(#[0-9a-fA-F]+)/) || [])[1] || null,
      Circular: /\bcircular\b/.test(cls) || /circular:\s*true/.test(s),
      Requirements: reqs });
  }
  if (tag === 'img') {
    return finalize({ Type: 'image', Id: id,
      Src:    attr('src', ''),
      Width:  styleInt('anchor-width', 300),
      Height: styleInt('anchor-height', 80),
      Requirements: reqs });
  }
  if (tag === 'span' && node.classList.contains('item-icon')) {
    return finalize({ Type: 'itemicon', Id: id,
      ItemId: attr('data-hyui-item-id', ''),
      Size:   styleInt('anchor-width', 48),
      Requirements: reqs });
  }
  if (tag === 'div') {
    const s = node.getAttribute('style') || '';
    const cls = node.getAttribute('class') || '';
    // Item grid
    if (cls.includes('item-grid')) {
      const slots = [];
      for (const slot of node.querySelectorAll(':scope > .item-grid-slot')) {
        const close = slot.getAttribute('data-ql-close');
        const refresh = slot.getAttribute('data-ql-refresh');
        slots.push({
          ItemId:           slot.getAttribute('data-hyui-item-id') || '',
          Quantity:         parseInt(slot.getAttribute('data-hyui-quantity') || '1') || 1,
          Name:             slot.getAttribute('data-hyui-name') || null,
          Description:      slot.getAttribute('data-hyui-description') || null,
          Actions:          splitPipe(slot.getAttribute('data-ql-actions')),
          Requirements:     splitPipe(slot.getAttribute('data-ql-req')),
          ClickRequirements:splitPipe(slot.getAttribute('data-ql-click-req')),
          CloseOnClick:     close !== null ? close === 'true' : null,
          Refresh:          refresh !== null ? refresh === 'true' : null,
        });
      }
      const hyStyle = node.getAttribute('data-hyui-style') || '';
      const slotSizeMatch    = hyStyle.match(/SlotSize:\s*(\d+)/);
      const slotSpacingMatch = hyStyle.match(/SlotSpacing:\s*(\d+)/);
      return finalize({ Type: 'itemgrid', Id: id,
        SlotsPerRow:          parseInt(attr('data-hyui-slots-per-row', '5')) || 5,
        DisplayItemQuantity:  attr('data-hyui-display-item-quantity', 'true') !== 'false',
        SlotSpacing: slotSpacingMatch ? parseInt(slotSpacingMatch[1]) : null,
        SlotSize:    slotSizeMatch    ? parseInt(slotSizeMatch[1])    : null,
        Slots: slots, Requirements: reqs });
    }
    // Spacer (no class, anchor-height only)
    if (!cls && /anchor-height/.test(s) && !/background-color/.test(s) && !/layout-mode/.test(s)) {
      const m = s.match(/anchor-height:\s*(\d+)/);
      return { Type: 'spacer', Height: m ? parseInt(m[1]) : 10 };
    }
    // Divider (no class, has background-color but no layout-mode)
    if (!cls && /background-color/.test(s) && !/layout-mode/.test(s)) {
      const hm = s.match(/anchor-height:\s*(\d+)/);
      const cm = s.match(/background-color:\s*(#[0-9a-fA-F]+)/);
      return { Type: 'divider', Height: hm ? parseInt(hm[1]) : 1, Color: cm ? cm[1] : '#333333' };
    }
    // Panel (has layout-mode)
    if (/layout-mode/.test(s)) {
      const lm = s.match(/layout-mode:\s*(\w+)/);
      const layoutKw = lm ? lm[1] : 'Top';
      const layout = layoutKw === 'Left' ? 'Horizontal' : (layoutKw === 'TopScrolling' ? 'TopScrolling' : 'Vertical');
      const bgm = s.match(/background-color:\s*(#[0-9a-fA-F]+)/);
      const pad = parsePaddingStyle(s) || clone(ELEM_DEFAULTS.panel.Padding);
      const sb  = node.getAttribute('data-hyui-scrollbar-style') || '';
      return finalize({ Type: 'panel', Id: id,
        Layout:         layout,
        Padding:        pad,
        ScrollbarStyle: sb,
        Background:     bgm ? bgm[1] : null,
        Elements:       parseChildElements(node.children),
        Requirements:   reqs });
    }
  }
  return null;
}

function importJson(text) {
  try {
    const p = JSON.parse(text);
    const def = {
      Id:                  p.Id || '',
      Title:               p.Title || '',
      Width:               p.Width  || 480,
      Height:              p.Height || 420,
      CloseButton:         p.CloseButton !== false,
      Layout:              p.Layout || 'Vertical',
      Padding:             migratePadding(p.Padding, 12),
      ScrollbarStyle:      p.ScrollbarStyle || '',
      DefaultCloseOnClick: !!p.DefaultCloseOnClick,
      DefaultRefresh:      p.DefaultRefresh !== false,
      Command:             p.Command || null,
      Elements:            p.Elements || [],
    };
    fixElems(def.Elements);
    state.def = def;
    state.selectedPath = null;
    refresh();
    return null;
  } catch (e) {
    return e.message;
  }
}

function migratePadding(v, fallback) {
  if (v && typeof v === 'object' && 'Mode' in v) return v;
  const base = clone(EMPTY_PADDING);
  if (typeof v === 'number') { base.Full = v; return base; }
  base.Full = fallback != null ? fallback : 0;
  return base;
}

// Back-fill Anchor/Visible/TooltipText on visual elements loaded from older
// configs that predate those fields.
function backfillCommon(el) {
  if (el.Type === 'spacer' || el.Type === 'divider') return;
  if (!el.Anchor || typeof el.Anchor !== 'object') el.Anchor = clone(EMPTY_ANCHOR);
  else for (const [js] of ANCHOR_KEYS) if (!(js in el.Anchor)) el.Anchor[js] = null;
  if (el.Visible === undefined)     el.Visible = null;
  if (el.TooltipText === undefined) el.TooltipText = '';
  if (el.Align === undefined)       el.Align = 'Start';
}

function fixElems(els) {
  if (!els) return;
  for (const el of els) {
    if (!el.Id)           el.Id = '';
    if (!el.Requirements) el.Requirements = [];
    backfillCommon(el);
    if (el.Type === 'label' && el.FontSize === undefined) el.FontSize = 0;
    if (el.Type === 'button') {
      if (!el.Actions)              el.Actions = [];
      if (el.CloseOnClick === undefined) el.CloseOnClick = null;
      if (el.Refresh === undefined)      el.Refresh = null;
    }
    if (el.Type === 'checkbox') {
      if (!el.CheckedRequirements) el.CheckedRequirements = [];
      if (!el.CheckActions)        el.CheckActions = [];
      if (!el.UncheckActions)      el.UncheckActions = [];
      if (el.CloseOnClick === undefined) el.CloseOnClick = null;
      if (el.Refresh === undefined)      el.Refresh = null;
    }
    if (el.Type === 'panel') {
      if (!el.Elements) el.Elements = [];
      if (el.Background === undefined) el.Background = null;
      el.Padding = migratePadding(el.Padding, 8);
      if (el.ScrollbarStyle === undefined) el.ScrollbarStyle = '';
      fixElems(el.Elements);
    }
    if (el.Type === 'itemgrid') {
      if (!el.Slots) el.Slots = [];
      for (const s of el.Slots) {
        if (!s.Actions)          s.Actions = [];
        if (!s.Requirements)     s.Requirements = [];
        if (!s.ClickRequirements) s.ClickRequirements = [];
        if (s.CloseOnClick === undefined) s.CloseOnClick = null;
        if (s.Refresh === undefined)      s.Refresh = null;
        if (s.Name === undefined)         s.Name = null;
        if (s.Description === undefined)  s.Description = null;
      }
    }
    if (el.Type === 'progressbar') {
      if (el.Color === undefined) el.Color = null;
    }
    if (el.Type === 'dropdown') {
      if (!el.Options) el.Options = [];
      if (el.CloseOnClick === undefined) el.CloseOnClick = null;
      if (el.Refresh === undefined)      el.Refresh = null;
      for (const opt of el.Options) {
        if (!opt.Actions)          opt.Actions = [];
        if (!opt.Requirements)     opt.Requirements = [];
        if (opt.CloseOnClick === undefined) opt.CloseOnClick = null;
        if (opt.Refresh === undefined)      opt.Refresh = null;
      }
    }
    if (el.Type === 'sprite') {
      if (!el.Src)            el.Src = '';
      if (!el.Width)          el.Width = 64;
      if (!el.Height)         el.Height = 64;
      if (el.FrameWidth  === undefined) el.FrameWidth  = 0;
      if (el.FrameHeight === undefined) el.FrameHeight = 0;
      if (el.FramePerRow === undefined) el.FramePerRow = 0;
      if (el.FrameCount  === undefined) el.FrameCount  = 0;
      if (el.Fps         === undefined) el.Fps         = 0;
    }
    if (el.Type === 'hotkeylabel') {
      if (!el.InputBindingKey)       el.InputBindingKey = '';
      if (!el.InputBindingKeyPrefix) el.InputBindingKeyPrefix = '';
    }
  }
}

// ── Render: GUI Settings ──────────────────────────────────────────────────────

function renderGuiSettings() {
  const c = document.getElementById('gui-settings');
  c.innerHTML = '';
  SCHEMAS._gui.forEach(f => renderField(c, state.def, f));
}

// ── Render: Element Tree ──────────────────────────────────────────────────────

function renderElementTree() {
  const tree = document.getElementById('element-tree');
  tree.innerHTML = '';
  renderTreeLevel(state.def.Elements, [], tree, 0);
}

function renderTreeLevel(elements, basePath, container, indent) {
  elements.forEach((el, i) => {
    const path = [...basePath, i];
    const sel  = pathEq(path, state.selectedPath);
    const isPanel = el.Type === 'panel';

    const row = mk('div', 'tree-item' + (sel ? ' selected' : ''));
    row.style.paddingLeft = (8 + indent * 16) + 'px';
    row.onclick = e => { e.stopPropagation(); state.selectedPath = path; refresh(); };

    row.draggable = true;
    row.dataset.path = path.join(',');
    attachDragHandlers(row, path, isPanel);

    const badge = mk('span', 'type-badge');
    badge.textContent = el.Type;

    const name = mk('span', 'elem-name');
    name.textContent = displayName(el);

    const acts = mk('div', 'tree-actions');
    acts.append(
      treeBtn('↑', () => moveElement(path, -1)),
      treeBtn('↓', () => moveElement(path,  1)),
      treeBtn('⧉', () => duplicateElement(path)),
      treeBtn('✕', () => { if (confirm('Delete this element?')) removeElement(path); }, 'danger')
    );
    row.append(badge, name, acts);
    container.appendChild(row);

    if (isPanel && el.Elements) {
      renderTreeLevel(el.Elements, path, container, indent + 1);

      const addRow = mk('div', 'add-child-row');
      addRow.style.paddingLeft = (8 + (indent + 1) * 16) + 'px';
      const addBtn = mk('button', 'add-child-btn');
      addBtn.textContent = '+ Add child';
      addBtn.onclick = e => { e.stopPropagation(); openAddModal(path); };
      addRow.appendChild(addBtn);
      attachChildDropHandlers(addRow, path);
      container.appendChild(addRow);
    }
  });
}

let dragSourcePath = null;

function parsePathAttr(s) {
  if (!s) return null;
  return s.split(',').filter(x => x !== '').map(Number);
}

function computeDropPosition(row, clientY, isPanel) {
  const rect = row.getBoundingClientRect();
  const offset = clientY - rect.top;
  if (isPanel) {
    if (offset < rect.height * 0.33) return 'before';
    if (offset > rect.height * 0.67) return 'after';
    return 'inside';
  }
  return offset < rect.height * 0.5 ? 'before' : 'after';
}

function attachDragHandlers(row, path, isPanel) {
  row.addEventListener('dragstart', e => {
    dragSourcePath = path;
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', path.join(',')); } catch (_) {}
    row.classList.add('dragging');
  });
  row.addEventListener('dragend', () => {
    dragSourcePath = null;
    row.classList.remove('dragging');
    clearDropIndicators();
  });
  row.addEventListener('dragover', e => {
    if (!dragSourcePath) return;
    if (isAncestorOrEqual(dragSourcePath, path)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const pos = computeDropPosition(row, e.clientY, isPanel);
    clearDropIndicators();
    row.classList.add('drop-' + pos);
  });
  row.addEventListener('dragleave', e => {
    if (e.relatedTarget && row.contains(e.relatedTarget)) return;
    row.classList.remove('drop-before', 'drop-after', 'drop-inside');
  });
  row.addEventListener('drop', e => {
    if (!dragSourcePath) return;
    if (isAncestorOrEqual(dragSourcePath, path)) return;
    e.preventDefault();
    e.stopPropagation();
    const pos = computeDropPosition(row, e.clientY, isPanel);
    clearDropIndicators();
    const src = dragSourcePath;
    dragSourcePath = null;
    if (pos === 'inside') {
      moveElementTo(src, path, (elemsAt(path) || []).length);
    } else {
      const parentPath = path.slice(0, -1);
      const idx = path[path.length - 1] + (pos === 'after' ? 1 : 0);
      moveElementTo(src, parentPath, idx);
    }
  });
}

function attachChildDropHandlers(addRow, parentPath) {
  addRow.addEventListener('dragover', e => {
    if (!dragSourcePath) return;
    if (isAncestorOrEqual(dragSourcePath, parentPath)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    clearDropIndicators();
    addRow.classList.add('drop-inside');
  });
  addRow.addEventListener('dragleave', e => {
    if (e.relatedTarget && addRow.contains(e.relatedTarget)) return;
    addRow.classList.remove('drop-inside');
  });
  addRow.addEventListener('drop', e => {
    if (!dragSourcePath) return;
    if (isAncestorOrEqual(dragSourcePath, parentPath)) return;
    e.preventDefault();
    e.stopPropagation();
    clearDropIndicators();
    const src = dragSourcePath;
    dragSourcePath = null;
    moveElementTo(src, parentPath, (elemsAt(parentPath) || []).length);
  });
}

function clearDropIndicators() {
  document.querySelectorAll('.drop-before, .drop-after, .drop-inside')
    .forEach(el => el.classList.remove('drop-before', 'drop-after', 'drop-inside'));
}

function treeBtn(label, onClick, cls) {
  const b = mk('button', 'tree-btn' + (cls ? ' ' + cls : ''));
  b.textContent = label;
  b.onclick = e => { e.stopPropagation(); onClick(); };
  return b;
}

// ── Render: Properties Panel ──────────────────────────────────────────────────

function renderProperties() {
  const panel = document.getElementById('props-panel');
  panel.innerHTML = '';

  if (state.selectedPath === null) {
    panel.innerHTML = '<div class="no-selection">Select an element from the tree to edit its properties.</div>';
    return;
  }

  const el = elemAt(state.selectedPath);
  if (!el) { state.selectedPath = null; panel.innerHTML = '<div class="no-selection">Element not found.</div>'; return; }

  const schema = SCHEMAS[el.Type] || [];

  // Header + quick actions
  const hdr = mk('div', 'props-section');
  const title = mk('div', 'props-title');
  title.textContent = (ELEM_LABELS[el.Type] || el.Type) + ' Properties';
  hdr.appendChild(title);

  const path = state.selectedPath;
  const acts = mk('div', 'props-actions');
  acts.append(
    actionBtn('Move Up',   () => moveElement(path, -1)),
    actionBtn('Move Down', () => moveElement(path,  1)),
    actionBtn('Duplicate', () => duplicateElement(path)),
    actionBtn('Delete',    () => { if (confirm('Delete this element?')) removeElement(path); }, 'danger'),
  );
  hdr.appendChild(acts);
  panel.appendChild(hdr);

  // Field schema
  const sec = mk('div', 'props-section');
  const visibleSchema = el.Type === 'progressbar'
    ? schema.filter(f => el.Circular || (f.key !== 'Color' && f.key !== 'MaskTexturePath'))
    : schema;
  visibleSchema.forEach(f => renderField(sec, el, f));
  panel.appendChild(sec);

  // Extra sections
  if (el.Type === 'itemgrid') renderSlotsEditor(panel, el);
  if (el.Type === 'dropdown') renderOptionsEditor(panel, el);
  if (el.Type === 'panel') {
    const ps = mk('div', 'props-section');
    const pt = mk('div', 'props-title');
    pt.textContent = 'Children';
    ps.appendChild(pt);
    ps.appendChild(actionBtn('+ Add Child Element', () => openAddModal(path)));
    panel.appendChild(ps);
  }
}

function renderSlotsEditor(panel, el) {
  const sec = mk('div', 'props-section');
  const title = mk('div', 'props-title');
  title.textContent = `Slots (${(el.Slots || []).length})`;
  sec.appendChild(title);

  (el.Slots || []).forEach((slot, i) => {
    const box = mk('div', 'slot-box');
    const sh  = mk('div', 'slot-header');
    const sl  = mk('span', 'slot-label');
    sl.textContent = `Slot ${i + 1}`;
    const rb = actionBtn('Remove', () => { el.Slots.splice(i, 1); refresh(); }, 'danger');
    rb.style.cssText = 'padding:2px 8px;font-size:10px;';
    sh.append(sl, rb);
    box.appendChild(sh);

    [
      {key:'ItemId',      label:'Item ID',     type:'text'},
      {key:'Quantity',    label:'Quantity',    type:'number'},
      {key:'Name',        label:'Name',        type:'text'},
      {key:'Description', label:'Desc',        type:'text'},
      {key:'Actions',     label:'Actions',     type:'list'},
    ].forEach(f => renderField(box, slot, f));
    sec.appendChild(box);
  });

  sec.appendChild(actionBtn('+ Add Slot', () => {
    if (!el.Slots) el.Slots = [];
    el.Slots.push({ ItemId:'', Quantity:1, Name:null, Description:null, Actions:[], Requirements:[], ClickRequirements:[], CloseOnClick:null, Refresh:null });
    refresh();
  }));
  panel.appendChild(sec);
}

function renderOptionsEditor(panel, el) {
  const sec = mk('div', 'props-section');
  const title = mk('div', 'props-title');
  title.textContent = `Options (${(el.Options || []).length})`;
  sec.appendChild(title);

  (el.Options || []).forEach((opt, i) => {
    const box = mk('div', 'slot-box');
    const sh  = mk('div', 'slot-header');
    const sl  = mk('span', 'slot-label');
    sl.textContent = `Option ${i + 1}`;
    const rb = actionBtn('Remove', () => { el.Options.splice(i, 1); refresh(); }, 'danger');
    rb.style.cssText = 'padding:2px 8px;font-size:10px;';
    sh.append(sl, rb);
    box.appendChild(sh);

    [
      {key:'Value',        label:'Value (sent to server)', type:'text'},
      {key:'Label',        label:'Display Label',          type:'text'},
      {key:'Actions',      label:'Actions',                type:'list'},
      {key:'Requirements', label:'Requirements',           type:'list'},
      {key:'CloseOnClick', label:'Close on Click',         type:'tristate'},
      {key:'Refresh',      label:'Refresh',                type:'tristate'},
    ].forEach(f => renderField(box, opt, f));
    sec.appendChild(box);
  });

  sec.appendChild(actionBtn('+ Add Option', () => {
    if (!el.Options) el.Options = [];
    el.Options.push({ Value:'', Label:'', Actions:[], Requirements:[], CloseOnClick:null, Refresh:null });
    refresh();
  }));
  panel.appendChild(sec);
}

// ── Field Rendering ───────────────────────────────────────────────────────────

function renderField(container, obj, field) {
  if (field.type === 'list')    { renderListField(container, obj, field); return; }
  if (field.type === 'anchor')  { renderAnchorField(container, obj, field); return; }
  if (field.type === 'padding') { renderPaddingField(container, obj, field); return; }

  const row = mk('div', 'field-row');
  const lbl = mk('label', '');
  lbl.textContent = field.label;
  row.appendChild(lbl);

  switch (field.type) {
    case 'text': {
      const inp = mk('input', '');
      inp.type = 'text';
      inp.value = obj[field.key] ?? '';
      if (field.placeholder) inp.placeholder = field.placeholder;
      inp.oninput = () => { obj[field.key] = inp.value; softUpdate(); };
      row.appendChild(inp);
      break;
    }
    case 'number': {
      const inp = mk('input', '');
      inp.type = 'number';
      inp.value = obj[field.key] ?? 0;
      inp.oninput = () => { obj[field.key] = parseFloat(inp.value) || 0; softUpdate(); };
      row.appendChild(inp);
      break;
    }
    case 'color': {
      const wrap = mk('div', '');
      wrap.style.cssText = 'display:flex;gap:5px;align-items:center;flex:1;';
      const ci = mk('input', '');
      ci.type = 'color';
      ci.value = obj[field.key] || '#cccccc';
      const ti = mk('input', '');
      ti.type = 'text';
      ti.style.flex = '1';
      ti.value = obj[field.key] || '#cccccc';
      ci.oninput = () => { ti.value = ci.value; obj[field.key] = ci.value; softUpdate(); };
      ti.oninput = () => {
        if (/^#[0-9a-fA-F]{6}$/.test(ti.value)) { ci.value = ti.value; obj[field.key] = ti.value; softUpdate(); }
      };
      wrap.append(ci, ti);
      row.appendChild(wrap);
      break;
    }
    case 'color-nullable': {
      const wrap = mk('div', '');
      wrap.style.cssText = 'display:flex;gap:5px;align-items:center;flex:1;';
      const ci = mk('input', '');
      ci.type = 'color';
      ci.value = obj[field.key] || '#4a8be5';
      ci.disabled = obj[field.key] === null;
      const ti = mk('input', '');
      ti.type = 'text';
      ti.style.flex = '1';
      ti.value = obj[field.key] || '';
      ti.placeholder = 'null (default)';
      const toggleBtn = actionBtn(obj[field.key] === null ? 'Set' : 'Clear', () => {
        obj[field.key] = obj[field.key] === null ? '#4a8be5' : null;
        refresh();
      });
      toggleBtn.style.cssText = 'padding:2px 7px;font-size:10px;';
      ci.oninput = () => { ti.value = ci.value; obj[field.key] = ci.value; softUpdate(); };
      ti.oninput = () => {
        if (/^#[0-9a-fA-F]{6}$/.test(ti.value)) { ci.value = ti.value; obj[field.key] = ti.value; softUpdate(); }
      };
      wrap.append(ci, ti, toggleBtn);
      row.appendChild(wrap);
      break;
    }
    case 'checkbox': {
      const inp = mk('input', '');
      inp.type = 'checkbox';
      inp.checked = !!obj[field.key];
      inp.onchange = () => { obj[field.key] = inp.checked; refresh(); };
      row.appendChild(inp);
      break;
    }
    case 'select': {
      const sel = mk('select', '');
      (field.options || []).forEach(opt => {
        const o = mk('option', '');
        o.value = opt; o.textContent = opt;
        if (opt === obj[field.key]) o.selected = true;
        sel.appendChild(o);
      });
      sel.onchange = () => { obj[field.key] = sel.value; refresh(); };
      row.appendChild(sel);
      break;
    }
    case 'tristate': {
      const sel = mk('select', '');
      [['null','Inherit (default)'],['true','Yes'],['false','No']].forEach(([v, label]) => {
        const o = mk('option', '');
        o.value = v; o.textContent = label;
        const cur = obj[field.key];
        if ((v === 'null' && cur === null) || (v === 'true' && cur === true) || (v === 'false' && cur === false)) o.selected = true;
        sel.appendChild(o);
      });
      sel.onchange = () => {
        obj[field.key] = sel.value === 'null' ? null : sel.value === 'true';
        refresh();
      };
      row.appendChild(sel);
      break;
    }
  }

  container.appendChild(row);
}

function renderListField(container, obj, field) {
  const row = mk('div', 'field-row list-field-row');
  const lbl = mk('label', '');
  lbl.textContent = field.label;
  const ta = mk('textarea', '');
  ta.value = (obj[field.key] || []).join('\n');
  ta.placeholder = 'One item per line';
  ta.oninput = () => {
    obj[field.key] = ta.value.split('\n').map(s => s.trim()).filter(Boolean);
    softUpdate();
  };
  const help = mk('div', 'list-help');
  help.textContent = 'One entry per line';
  row.append(lbl, ta, help);
  container.appendChild(row);
}

// 8-input compact grid for directional anchor offsets (Top/Left/Right/Bottom,
// Horizontal/Vertical centering, Min/MaxWidth).
function renderAnchorField(container, obj, field) {
  const wrap = mk('div', 'field-row compound-field');
  const lbl = mk('label', '');
  lbl.textContent = field.label;
  wrap.appendChild(lbl);
  const grid = mk('div', 'compound-grid anchor-grid');
  const anchor = obj[field.key] = obj[field.key] || clone(EMPTY_ANCHOR);
  const cells = [
    ['Top','T'], ['Left','L'], ['Right','R'], ['Bottom','B'],
    ['Horizontal','H'], ['Vertical','V'], ['MinWidth','MinW'], ['MaxWidth','MaxW'],
  ];
  for (const [key, short] of cells) {
    const cell = mk('div', 'compound-cell');
    const tag  = mk('span', 'compound-tag');
    tag.textContent = short;
    const inp = mk('input', '');
    inp.type = 'number';
    inp.value = anchor[key] ?? '';
    inp.placeholder = '—';
    inp.oninput = () => {
      anchor[key] = inp.value === '' ? null : parseInt(inp.value);
      if (isNaN(anchor[key])) anchor[key] = null;
      softUpdate();
    };
    cell.append(tag, inp);
    grid.appendChild(cell);
  }
  wrap.appendChild(grid);
  container.appendChild(wrap);
}

// Mode-switchable padding editor: Full / Symmetric (V,H) / Sides (T,L,R,B).
function renderPaddingField(container, obj, field) {
  const wrap = mk('div', 'field-row compound-field');
  const lbl = mk('label', '');
  lbl.textContent = field.label;
  wrap.appendChild(lbl);

  obj[field.key] = migratePadding(obj[field.key], 0);
  const p = obj[field.key];

  const col = mk('div', 'compound-col');
  const modeRow = mk('div', 'compound-modes');
  for (const mode of ['full', 'symmetric', 'sides']) {
    const btn = mk('button', 'compound-mode-btn' + (p.Mode === mode ? ' active' : ''));
    btn.textContent = mode[0].toUpperCase() + mode.slice(1);
    btn.onclick = () => { p.Mode = mode; refresh(); };
    modeRow.appendChild(btn);
  }
  col.appendChild(modeRow);

  const inputsRow = mk('div', 'compound-grid padding-grid');
  const keys = p.Mode === 'symmetric' ? [['Vertical','V'],['Horizontal','H']]
             : p.Mode === 'sides'     ? [['Top','T'],['Left','L'],['Right','R'],['Bottom','B']]
             :                          [['Full','All']];
  for (const [key, short] of keys) {
    const cell = mk('div', 'compound-cell');
    const tag  = mk('span', 'compound-tag');
    tag.textContent = short;
    const inp = mk('input', '');
    inp.type = 'number';
    inp.value = p[key] ?? 0;
    inp.oninput = () => { p[key] = parseInt(inp.value) || 0; softUpdate(); };
    cell.append(tag, inp);
    inputsRow.appendChild(cell);
  }
  col.appendChild(inputsRow);
  wrap.appendChild(col);
  container.appendChild(wrap);
}

// ── Render: Preview ───────────────────────────────────────────────────────────

function renderPreview() {
  const area = document.getElementById('preview-area');
  // Keep the label
  const label = area.querySelector('#preview-label');
  area.innerHTML = '';
  if (label) area.appendChild(label);

  const def = state.def;

  const gc = mk('div', 'game-container');
  gc.style.width  = def.Width  + 'px';
  gc.style.height = def.Height + 'px';
  gc.style.margin = 'auto';

  // Title bar
  const tb = mk('div', 'game-title-bar');
  const tt = mk('div', 'game-title-text');
  tt.textContent = def.Title || 'Untitled';
  tb.appendChild(tt);
  if (def.CloseButton) {
    const cb = mk('div', 'game-close-btn');
    cb.textContent = '×';
    tb.appendChild(cb);
  }
  gc.appendChild(tb);

  // Scrollable content
  const content = mk('div', 'game-content');
  content.style.padding = paddingToCss(def.Padding);
  if ((def.Layout || 'Vertical') === 'Horizontal') {
    content.style.flexDirection = 'row';
    content.style.alignItems = 'flex-start';
    content.style.flexWrap = 'nowrap';
  } else if (def.Layout === 'TopScrolling') {
    content.style.overflowY = 'auto';
  }
  renderPreviewElements(def.Elements, content, def.Layout);
  gc.appendChild(content);
  area.appendChild(gc);
}

// Convert a padding object (or legacy scalar) to a CSS padding value.
function paddingToCss(p) {
  if (p === null || p === undefined) return '0';
  if (typeof p === 'number') return p + 'px';
  const mode = p.Mode || 'full';
  if (mode === 'full')      return (p.Full || 0) + 'px';
  if (mode === 'symmetric') return `${p.Vertical || 0}px ${p.Horizontal || 0}px`;
  return `${p.Top || 0}px ${p.Right || 0}px ${p.Bottom || 0}px ${p.Left || 0}px`;
}

function renderPreviewElements(elements, container, layout) {
  if (!elements) return;
  const isHoriz = (layout || 'Vertical') === 'Horizontal';
  for (const el of elements) {
    const node = renderPreviewElement(el);
    if (!node) continue;
    // FlexWeight > 0 in a horizontal layout → proportional flex sizing.
    if (el.FlexWeight > 0 && isHoriz) {
      node.style.flex = String(el.FlexWeight);
      node.style.minWidth = '0';
    }
    if (el.Align === 'Center')   node.style.alignSelf = 'center';
    else if (el.Align === 'End') node.style.alignSelf = 'flex-end';
    if (el.Visible === false) node.classList.add('prev-hidden');
    if (el.TooltipText) node.title = el.TooltipText;
    container.appendChild(node);
  }
}

function renderPreviewElement(el) {
  switch (el.Type) {
    case 'label':       return prvLabel(el);
    case 'button':      return prvButton(el);
    case 'spacer':      return prvSpacer(el);
    case 'divider':     return prvDivider(el);
    case 'panel':       return prvPanel(el);
    case 'image':       return prvImage(el);
    case 'itemicon':    return prvItemIcon(el);
    case 'itemgrid':    return prvItemGrid(el);
    case 'progressbar': return prvProgressBar(el);
    case 'hyvatar':     return prvHyvatar(el);
    case 'checkbox':    return prvCheckbox(el);
    case 'dropdown':    return prvDropdown(el);
    case 'sprite':      return prvSprite(el);
    case 'hotkeylabel': return prvHotkeyLabel(el);
    default: return null;
  }
}

function prvLabel(el) {
  const d = mk('div', 'prev-label' + (el.Bold ? ' bold' : ''));
  d.style.color = el.Color || '#cccccc';
  d.textContent = el.Text || '';
  if (el.Width > 0) d.style.width = el.Width + 'px';
  if (el.FontSize > 0) d.style.fontSize = el.FontSize + 'px';
  return d;
}

function prvButton(el) {
  const style = (el.Style || 'default').toLowerCase().replace(/[^a-z-]/g, '');
  const d = mk('div', `prev-button style-${style}`);
  d.textContent = (el.Text || 'Button').toUpperCase();
  if (el.Width > 0) d.style.width = el.Width + 'px';
  return d;
}

function prvSpacer(el) {
  const d = mk('div', 'prev-spacer');
  d.style.height = (el.Height || 10) + 'px';
  return d;
}

function prvDivider(el) {
  const d = mk('div', 'prev-divider');
  d.style.borderTopColor = el.Color || '#333333';
  if ((el.Height || 1) > 1) d.style.height = el.Height + 'px';
  return d;
}

function prvPanel(el) {
  const layout = (el.Layout || 'Vertical').toLowerCase();
  const d = mk('div', `prev-panel ${layout}`);
  d.style.padding = paddingToCss(el.Padding);
  if (el.Background) d.style.backgroundColor = el.Background;
  if (el.Layout === 'TopScrolling') d.style.overflowY = 'auto';
  renderPreviewElements(el.Elements, d, el.Layout);
  return d;
}

function prvImage(el) {
  const d = mk('div', 'prev-image');
  if (el.Width  > 0) d.style.width  = el.Width  + 'px';
  d.style.height = (el.Height || 60) + 'px';
  d.textContent = el.Src ? el.Src.split('/').pop() : '[image]';
  return d;
}

function prvItemIcon(el) {
  const size = el.Size > 0 ? el.Size : 48;
  const d = mk('div', 'prev-itemicon');
  d.style.width  = size + 'px';
  d.style.height = size + 'px';
  d.textContent  = '◈';
  return d;
}

function prvItemGrid(el) {
  const spr      = el.SlotsPerRow || 5;
  const slots    = el.Slots || [];
  const count    = Math.max(slots.length, spr);
  const slotSize = el.SlotSize != null ? el.SlotSize : 64;
  const spacing  = el.SlotSpacing != null ? el.SlotSpacing : 0;
  const d = mk('div', 'prev-itemgrid');
  d.style.gridTemplateColumns = `repeat(${spr}, ${slotSize}px)`;
  d.style.gap = spacing + 'px';
  for (let i = 0; i < count; i++) {
    const slot = mk('div', 'prev-itemgrid-slot');
    slot.style.width  = slotSize + 'px';
    slot.style.height = slotSize + 'px';
    if (i < slots.length && slots[i].ItemId) {
      slot.textContent = slots[i].ItemId.split(':').pop().slice(0, 4);
    }
    d.appendChild(slot);
  }
  return d;
}

function prvProgressBar(el) {
  const raw     = parseFloat(el.Value) || 0;
  const frac    = el.Max > 0 ? raw / el.Max : raw;
  const clamped = Math.max(0, Math.min(1, frac));
  const color   = el.Color || '#4a8be5';
  const w       = el.Width  > 0 ? el.Width  : 200;
  const h       = el.Height > 0 ? el.Height : 20;

  if (el.Circular) {
    // Diamond shape with clockwise sweep from the top, matching in-game default rendering
    const size = w;
    const deg  = (clamped * 360).toFixed(2);
    const d = mk('div', '');
    d.style.cssText = `width:${size}px; height:${size}px; flex-shrink:0;`
      + `background:conic-gradient(from 0deg, ${color} ${deg}deg, #1a2030 ${deg}deg);`
      + `clip-path:polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);`;
    return d;
  }

  const wrap = mk('div', 'prev-progress');
  wrap.style.width  = w + 'px';
  wrap.style.height = h + 'px';
  const bar = mk('div', 'prev-progress-bar');
  bar.style.width      = (clamped * 100) + '%';
  bar.style.height     = '100%';
  bar.style.background = color;
  wrap.appendChild(bar);
  return wrap;
}

function prvHyvatar(el) {
  const size     = el.Size || 64;
  const username = el.Username || '';
  const render   = (el.Render || 'head').toLowerCase();

  // Use "NPC" as preview stand-in when username is a template variable
  const previewName = (!username || username.includes('{')) ? 'NPC' : username;

  const path = (render === 'full' || render === 'body')
    ? `render/full/${encodeURIComponent(previewName)}`
    : `render/${encodeURIComponent(previewName)}`;
  const url = `https://hyvatar.io/${path}?size=${size}`;

  const img = mk('img', '');
  img.src             = url;
  img.style.width     = size + 'px';
  img.style.height    = size + 'px';
  img.style.display   = 'block';
  img.style.flexShrink = '0';
  img.onerror = () => {
    const d = mk('div', 'prev-hyvatar');
    d.style.width    = size + 'px';
    d.style.height   = size + 'px';
    d.style.fontSize = Math.floor(size * 0.4) + 'px';
    d.textContent    = '👤';
    img.replaceWith(d);
  };
  return img;
}

function prvCheckbox(el) {
  const d = mk('div', 'prev-checkbox');
  const inp = mk('input', '');
  inp.type = 'checkbox';
  const lbl = mk('label', '');
  lbl.textContent = el.Label || '';
  d.append(inp, lbl);
  return d;
}

function prvDropdown(el) {
  const d = mk('div', 'prev-dropdown');
  const sel = mk('select', '');
  sel.disabled = true;
  const opts = el.Options || [];
  if (opts.length) {
    opts.forEach(opt => {
      const o = mk('option', '');
      o.textContent = opt.Label || opt.Value || '';
      sel.appendChild(o);
    });
  } else {
    const o = mk('option', '');
    o.textContent = '(no options)';
    sel.appendChild(o);
  }
  d.appendChild(sel);
  return d;
}

function prvSprite(el) {
  const w = el.Width  > 0 ? el.Width  : 64;
  const h = el.Height > 0 ? el.Height : 64;
  const d = mk('div', 'prev-sprite');
  d.style.width  = w + 'px';
  d.style.height = h + 'px';
  d.textContent  = el.Src ? el.Src.split('/').pop() : '[sprite]';
  return d;
}

function prvHotkeyLabel(el) {
  const d = mk('div', 'prev-hotkeylabel');
  d.textContent = el.InputBindingKey ? `[${el.InputBindingKey}]` : '[KEY]';
  return d;
}

// ── Add Element Modal ─────────────────────────────────────────────────────────

function openAddModal(parentPath) {
  state.addToPath = parentPath || [];
  const hint = document.getElementById('add-modal-hint');
  hint.textContent = parentPath && parentPath.length > 0
    ? `Adding inside panel at depth ${parentPath.length}`
    : 'Adding to root';
  document.getElementById('add-modal').style.display = 'flex';
}

function closeAddModal() {
  document.getElementById('add-modal').style.display = 'none';
}

// ── HTML Modal ────────────────────────────────────────────────────────────────

let htmlMode = 'export';

function openExportModal() {
  htmlMode = 'export';
  document.getElementById('json-modal-title').textContent = 'Export HTML';
  document.getElementById('json-modal-action').textContent = 'Copy to Clipboard';
  document.getElementById('json-modal-download').style.display = 'inline-block';
  document.getElementById('json-textarea').value = exportHtml();
  document.getElementById('json-textarea').readOnly = false;
  document.getElementById('json-modal').style.display = 'flex';
  setTimeout(() => document.getElementById('json-textarea').select(), 50);
}

function openImportModal() {
  htmlMode = 'import';
  document.getElementById('json-modal-title').textContent = 'Import HTML';
  document.getElementById('json-modal-action').textContent = 'Import';
  document.getElementById('json-modal-download').style.display = 'none';
  document.getElementById('json-textarea').value = '';
  document.getElementById('json-textarea').readOnly = false;
  document.getElementById('json-modal').style.display = 'flex';
  document.getElementById('json-textarea').focus();
}

function closeJsonModal() {
  document.getElementById('json-modal').style.display = 'none';
}

function handleJsonAction() {
  if (htmlMode === 'export') {
    const text = document.getElementById('json-textarea').value;
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('json-modal-action');
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = orig, 1800);
    }).catch(() => alert('Copy failed — please Ctrl+A, Ctrl+C manually.'));
  } else {
    const text = document.getElementById('json-textarea').value.trim();
    if (!text) { alert('Paste your HTML first.'); return; }
    const err = importHtml(text);
    if (err) alert('Import error: ' + err);
    else closeJsonModal();
  }
}

function downloadJson() {
  const html = exportHtml();
  const id   = state.def.Id || 'my-gui';
  const blob = new Blob([html], { type: 'text/html' });
  const a    = mk('a', '');
  a.href     = URL.createObjectURL(blob);
  a.download = id + '.gui.html';
  a.click();
  URL.revokeObjectURL(a.href);
}

// ── Drag & Drop File Loading ──────────────────────────────────────────────────

function hasExistingContent() {
  return (state.def.Elements && state.def.Elements.length > 0)
      || (state.def.Id || '').trim() !== ''
      || (state.def.Title || '').trim() !== (GUI_DEFAULTS.Title || '');
}

function loadDroppedFile(file) {
  if (!file) return;
  if (hasExistingContent() && !confirm(`Load "${file.name}"? This will replace the current GUI.`)) return;
  const reader = new FileReader();
  reader.onload = e => {
    const err = importHtml(String(e.target.result || ''));
    if (err) alert('Import error: ' + err);
  };
  reader.onerror = () => alert('Failed to read file: ' + file.name);
  reader.readAsText(file);
}

function setupDragAndDrop() {
  const tree = document.getElementById('element-tree');
  let depth = 0;
  // dataTransfer.types is case-sensitive 'Files' across browsers when files are dragged.
  const isFileDrag = e => !!(e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files'));

  // Suppress the browser's default open-file behavior on every relevant event.
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt =>
    document.addEventListener(evt, e => { if (isFileDrag(e)) e.preventDefault(); })
  );

  document.addEventListener('dragenter', e => {
    if (!isFileDrag(e)) return;
    if (depth === 0 && tree) tree.classList.add('drop-target');
    depth++;
  });
  document.addEventListener('dragleave', e => {
    if (!isFileDrag(e)) return;
    depth = Math.max(0, depth - 1);
    if (depth === 0 && tree) tree.classList.remove('drop-target');
  });
  document.addEventListener('drop', e => {
    if (!isFileDrag(e)) return;
    depth = 0;
    if (tree) tree.classList.remove('drop-target');
    const files = e.dataTransfer.files;
    if (files && files.length > 0) loadDroppedFile(files[0]);
  });
}

// ── Update Helpers ────────────────────────────────────────────────────────────

/** Partial update: tree + preview only (preserves focus in text fields). */
function softUpdate() {
  renderElementTree();
  renderPreview();
}

/** Full re-render of all panels. */
function refresh() {
  renderGuiSettings();
  renderElementTree();
  renderProperties();
  renderPreview();
}

// ── DOM Helpers ───────────────────────────────────────────────────────────────

function mk(tag, cls) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
}

function actionBtn(label, onClick, cls) {
  const b = mk('button', 'prop-action-btn' + (cls ? ' ' + cls : ''));
  b.textContent = label;
  b.onclick = onClick;
  return b;
}

// ── Init ──────────────────────────────────────────────────────────────────────

function init() {
  // Header
  document.getElementById('btn-new').onclick = () => {
    if (!confirm('Clear current GUI? All unsaved changes will be lost.')) return;
    state.def = clone(GUI_DEFAULTS);
    state.selectedPath = null;
    refresh();
  };
  document.getElementById('btn-import').onclick = openImportModal;
  document.getElementById('btn-export').onclick = openExportModal;

  // JSON modal
  document.getElementById('json-modal-close').onclick = closeJsonModal;
  document.getElementById('json-modal-action').onclick = handleJsonAction;
  document.getElementById('json-modal-download').onclick = downloadJson;
  document.getElementById('json-modal').onclick = e => {
    if (e.target === e.currentTarget) closeJsonModal();
  };

  // Add modal
  document.getElementById('add-modal-close').onclick = closeAddModal;
  document.getElementById('add-modal').onclick = e => {
    if (e.target === e.currentTarget) closeAddModal();
  };
  document.querySelectorAll('[data-type]').forEach(btn => {
    btn.onclick = () => {
      addElement(btn.dataset.type, state.addToPath);
      closeAddModal();
    };
  });

  // Add root element
  document.getElementById('btn-add-root').onclick = () => openAddModal([]);

  // Deselect on click on empty tree area
  document.getElementById('element-tree').onclick = e => {
    if (e.target === e.currentTarget) {
      state.selectedPath = null;
      refresh();
    }
  };

  // Drag & drop file loading
  setupDragAndDrop();

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeJsonModal();
      closeAddModal();
    }
    // Delete selected element with Delete/Backspace (when not in input)
    if ((e.key === 'Delete' || e.key === 'Backspace') &&
        state.selectedPath !== null &&
        !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      if (confirm('Delete selected element?')) removeElement(state.selectedPath);
    }
  });

  refresh();
}

document.addEventListener('DOMContentLoaded', init);
