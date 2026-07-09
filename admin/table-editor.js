/**
 * Sveltia CMS 表格编辑组件
 *
 * 做两件事：
 * 1. 通过 CMS.registerEditorComponent() 注册一个 "table" 富文本组件：
 *    正文里的 GFM markdown 表格会被识别成一个组件块，保存时原样写回 markdown。
 * 2. Sveltia 目前不支持自定义 widget UI（registerWidget 的 React control 尚未接线），
 *    所以用 MutationObserver 找到该组件渲染出的 textarea，把它替换成一个
 *    可视化表格网格（contenteditable 单元格 + 行列/对齐工具栏），编辑结果
 *    实时序列化回 textarea，走 Sveltia 自己的数据流。
 *
 * 依赖的 DOM 约定（对应 @sveltia/cms 0.170.x）：
 *   组件块外层有 [data-component-name="table"]，字段外层有 [data-field-type]。
 *   如果升级 CMS 后网格不出现，优先检查这两个选择器。
 */
(() => {
  'use strict';

  /* ---------- markdown 表格 解析 / 序列化 ---------- */

  /** 拆一行 `| a | b |` 成单元格数组，支持 \| 转义 */
  const splitRow = (line) => {
    let s = line.trim();
    if (s.startsWith('|')) s = s.slice(1);
    if (s.endsWith('|')) s = s.slice(0, -1);

    const cells = [];
    let cur = '';

    for (let i = 0; i < s.length; i += 1) {
      const ch = s[i];

      if (ch === '\\' && s[i + 1] === '|') {
        cur += '|';
        i += 1;
      } else if (ch === '|') {
        cells.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }

    cells.push(cur.trim());
    return cells;
  };

  const isDividerCell = (c) => /^:?-+:?$/.test(c.replace(/\s/g, ''));

  /** 解析 markdown 表格为 { header, aligns, rows }；解析失败时返回 2x2 空表 */
  const parseTable = (source) => {
    const lines = String(source ?? '')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('|'));

    let header = [];
    let aligns = [];
    let rows = [];

    if (lines.length >= 2) {
      const divider = splitRow(lines[1]);

      if (divider.length && divider.every(isDividerCell)) {
        header = splitRow(lines[0]);
        aligns = divider.map((c) => {
          const t = c.replace(/\s/g, '');
          if (t.startsWith(':') && t.endsWith(':')) return 'center';
          if (t.endsWith(':')) return 'right';
          if (t.startsWith(':')) return 'left';
          return '';
        });
        rows = lines.slice(2).map(splitRow);
      }
    }

    if (!header.length) {
      header = ['', ''];
      aligns = ['', ''];
      rows = [['', '']];
    }

    if (!rows.length) rows = [header.map(() => '')];

    const cols = Math.max(header.length, ...rows.map((r) => r.length));
    const pad = (arr, fill = '') => {
      while (arr.length < cols) arr.push(fill);
      return arr;
    };

    pad(header);
    pad(aligns);
    rows.forEach((r) => pad(r));

    return { header, aligns, rows };
  };

  /** 单元格文本 → markdown（转义竖线，换行转 <br>） */
  const escapeCell = (text) =>
    String(text ?? '')
      .replace(/\|/g, '\\|')
      .replace(/\r?\n/g, '<br>')
      .trim();

  const ALIGN_MARK = { left: ':---', center: ':---:', right: '---:', '': '---' };

  const serializeTable = ({ header, aligns, rows }) => {
    const row = (cells) => `| ${cells.map(escapeCell).join(' | ')} |`;
    const divider = `| ${aligns.map((a) => ALIGN_MARK[a] ?? '---').join(' | ')} |`;

    return [row(header), divider, ...rows.map(row)].join('\n');
  };

  /* ---------- 预览渲染 ---------- */

  const escapeHTML = (s) =>
    String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  /** 单元格预览：转义后放行 <br>，并支持少量行内 markdown（粗体/斜体/代码） */
  const cellHTML = (s) =>
    escapeHTML(s)
      .replace(/&lt;br\s*\/?&gt;/gi, '<br>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');

  const toPreviewHTML = (source) => {
    const { header, aligns, rows } = parseTable(source);
    const style = (i) => (aligns[i] ? ` style="text-align:${aligns[i]}"` : '');

    const thead = `<tr>${header.map((c, i) => `<th${style(i)}>${cellHTML(c)}</th>`).join('')}</tr>`;
    const tbody = rows
      .map((r) => `<tr>${r.map((c, i) => `<td${style(i)}>${cellHTML(c)}</td>`).join('')}</tr>`)
      .join('');

    return `<table><thead>${thead}</thead><tbody>${tbody}</tbody></table>`;
  };

  /* ---------- 注册编辑器组件 ---------- */

  const DEFAULT_TABLE = '|  |  |\n| --- | --- |\n|  |  |';

  // 匹配 GFM 表格块：表头行 + 分隔行 + 若干数据行（m 标志让 Sveltia 走多行 transformer）
  const TABLE_PATTERN = /^\|[^\n]*\|[ \t]*\n\|[ \t:|-]+\|[ \t]*(?:\n\|[^\n]*\|[ \t]*)*/m;

  const register = () => {
    if (!window.CMS?.registerEditorComponent) return false;

    window.CMS.registerEditorComponent({
      id: 'table',
      label: '表格',
      icon: 'table',
      fields: [
        {
          name: 'source',
          label: '表格内容（markdown）',
          widget: 'text',
          default: DEFAULT_TABLE,
        },
      ],
      pattern: TABLE_PATTERN,
      fromBlock: (match) => ({ source: match[0].trim() }),
      toBlock: ({ source = DEFAULT_TABLE }) => String(source).trim(),
      toPreview: ({ source = '' }) => toPreviewHTML(source),
    });

    return true;
  };

  /* ---------- 可视化网格编辑器 ---------- */

  const nativeSetValue = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    'value',
  ).set;

  const CSS = `
    .mdt-editor { margin: 8px 0; font-size: 14px; }
    .mdt-toolbar { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; align-items: center; }
    .mdt-toolbar button {
      padding: 4px 10px; border: 1px solid #ccc; border-radius: 6px;
      background: #fff; color: #333; cursor: pointer; font-size: 12px; line-height: 1.4;
    }
    .mdt-toolbar button:hover { background: #f0f0f0; }
    .mdt-toolbar .mdt-sep { width: 1px; height: 18px; background: #ddd; margin: 0 4px; }
    .mdt-toolbar .mdt-hint { font-size: 11px; color: #999; margin-left: auto; }
    .mdt-editor table { border-collapse: collapse; width: 100%; table-layout: auto; background: #fff; }
    .mdt-editor th, .mdt-editor td {
      border: 1px solid #ccc; padding: 6px 10px; min-width: 60px;
      outline: none; vertical-align: top; color: #333;
    }
    .mdt-editor th { background: #f5f5f5; font-weight: 600; }
    .mdt-editor th:focus, .mdt-editor td:focus {
      outline: 2px solid #4a8af4; outline-offset: -2px; background: #fbfdff;
    }
    .mdt-editor [contenteditable]:empty::before { content: '\\200b'; }
  `;

  const injectCSS = () => {
    if (document.getElementById('mdt-style')) return;
    const style = document.createElement('style');
    style.id = 'mdt-style';
    style.textContent = CSS;
    document.head.appendChild(style);
  };

  /** 在一个 table 组件的 textarea 上挂载网格编辑器 */
  const mountGrid = (textarea) => {
    textarea.dataset.mdtMounted = '1';

    const wrapper = textarea.closest('[data-component-name="table"]');
    const fieldSection = textarea.closest('[data-field-type]') ?? textarea;
    const model = parseTable(textarea.value || DEFAULT_TABLE);
    // 当前焦点单元格；r === -1 表示表头
    let cur = { r: -1, c: 0 };

    const root = document.createElement('div');
    root.className = 'mdt-editor';
    fieldSection.style.display = 'none';
    fieldSection.parentElement.insertBefore(root, fieldSection);

    const commit = () => {
      nativeSetValue.call(textarea, serializeTable(model));
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    };

    /** 把 DOM 单元格内容读回模型 */
    const pull = (cell) => {
      const r = Number(cell.dataset.r);
      const c = Number(cell.dataset.c);
      const text = cell.textContent.replace(/​/g, '');

      if (r === -1) model.header[c] = text;
      else model.rows[r][c] = text;
    };

    const focusCell = (r, c) => {
      const cell = root.querySelector(`[data-r="${r}"][data-c="${c}"]`);

      if (cell) {
        cur = { r, c };
        cell.focus();
        // 光标移到末尾
        const range = document.createRange();
        range.selectNodeContents(cell);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    };

    const makeCell = (tag, r, c, text) => {
      const cell = document.createElement(tag);
      cell.contentEditable = 'true';
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.textContent = text;
      if (model.aligns[c]) cell.style.textAlign = model.aligns[c];
      return cell;
    };

    const render = () => {
      root.textContent = '';

      const cols = model.header.length;

      /* 工具栏 */
      const toolbar = document.createElement('div');
      toolbar.className = 'mdt-toolbar';

      const btn = (label, title, onClick) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = label;
        b.title = title;
        // mousedown 阻止默认行为，避免点按钮时单元格失焦丢掉 cur
        b.addEventListener('mousedown', (e) => e.preventDefault());
        b.addEventListener('click', onClick);
        return b;
      };

      const structural = (fn) => () => {
        fn();
        commit();
        render();
      };

      toolbar.append(
        btn('＋ 行', '在当前行下方插入一行', structural(() => {
          const at = cur.r < 0 ? 0 : cur.r + 1;
          model.rows.splice(at, 0, model.header.map(() => ''));
          cur = { r: at, c: cur.c };
        })),
        btn('－ 行', '删除当前行', structural(() => {
          if (cur.r >= 0 && model.rows.length > 1) {
            model.rows.splice(cur.r, 1);
            cur = { r: Math.min(cur.r, model.rows.length - 1), c: cur.c };
          }
        })),
        Object.assign(document.createElement('span'), { className: 'mdt-sep' }),
        btn('＋ 列', '在当前列右侧插入一列', structural(() => {
          const at = cur.c + 1;
          model.header.splice(at, 0, '');
          model.aligns.splice(at, 0, '');
          model.rows.forEach((r) => r.splice(at, 0, ''));
          cur = { r: cur.r, c: at };
        })),
        btn('－ 列', '删除当前列', structural(() => {
          if (model.header.length > 1) {
            model.header.splice(cur.c, 1);
            model.aligns.splice(cur.c, 1);
            model.rows.forEach((r) => r.splice(cur.c, 1));
            cur = { r: cur.r, c: Math.min(cur.c, model.header.length - 1) };
          }
        })),
        Object.assign(document.createElement('span'), { className: 'mdt-sep' }),
        btn('⇤', '当前列左对齐', structural(() => { model.aligns[cur.c] = 'left'; })),
        btn('⇹', '当前列居中', structural(() => { model.aligns[cur.c] = 'center'; })),
        btn('⇥', '当前列右对齐', structural(() => { model.aligns[cur.c] = 'right'; })),
        Object.assign(document.createElement('span'), {
          className: 'mdt-hint',
          textContent: 'Tab 下一格 · Enter 下一行',
        }),
      );

      /* 表格 */
      const table = document.createElement('table');
      const thead = document.createElement('thead');
      const headRow = document.createElement('tr');

      model.header.forEach((text, c) => headRow.appendChild(makeCell('th', -1, c, text)));
      thead.appendChild(headRow);

      const tbody = document.createElement('tbody');

      model.rows.forEach((row, r) => {
        const tr = document.createElement('tr');
        row.forEach((text, c) => tr.appendChild(makeCell('td', r, c, text)));
        tbody.appendChild(tr);
      });

      table.append(thead, tbody);

      /* 事件（委托到 table 上） */
      const trackCur = (e) => {
        const cell = e.target.closest('[data-r]');
        if (cell) cur = { r: Number(cell.dataset.r), c: Number(cell.dataset.c) };
      };

      // focusin + mousedown 双保险：mousedown 不依赖窗口焦点状态
      table.addEventListener('focusin', trackCur);
      table.addEventListener('mousedown', trackCur);

      table.addEventListener('input', (e) => {
        const cell = e.target.closest('[data-r]');
        if (cell) pull(cell);
      });

      // 输入过程中不重渲染，失焦时才写回 textarea，避免打字被打断
      table.addEventListener('focusout', () => commit());

      root.append(toolbar, table);
      focusCell(cur.r, cur.c);
    };

    // Sveltia 的组件 wrapper 在捕获阶段 stopPropagation 了 keydown/paste，
    // 事件到不了 table，所以键盘和粘贴处理必须挂在 wrapper 的捕获阶段。
    wrapper?.addEventListener(
      'keydown',
      (e) => {
        const cell = e.target?.closest?.('.mdt-editor [data-r]');
        if (!cell || !root.contains(cell)) return;

        const r = Number(cell.dataset.r);
        const c = Number(cell.dataset.c);
        const lastCol = model.header.length - 1;

        if (e.key === 'Tab') {
          e.preventDefault();
          pull(cell);

          const delta = e.shiftKey ? -1 : 1;
          let nr = r;
          let nc = c + delta;

          if (nc > lastCol) {
            nc = 0;
            nr = r + 1;
            if (nr >= model.rows.length) {
              // 最后一格再 Tab：自动加一行（Word 习惯）
              model.rows.push(model.header.map(() => ''));
              commit();
              render();
            }
          } else if (nc < 0) {
            nc = lastCol;
            nr = r === -1 ? -1 : r - 1;
          }

          focusCell(nr, nc);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          pull(cell);

          if (e.shiftKey) return; // Shift+Enter 暂不支持换行（单元格内换行请用 <br>）

          const nr = r + 1;

          if (nr >= model.rows.length) {
            model.rows.push(model.header.map(() => ''));
            commit();
            render();
          }

          focusCell(nr, c);
        }
      },
      true,
    );

    // 粘贴时只保留纯文本
    wrapper?.addEventListener(
      'paste',
      (e) => {
        const cell = e.target?.closest?.('.mdt-editor [data-r]');
        if (!cell || !root.contains(cell)) return;

        e.preventDefault();
        e.stopPropagation();

        const text = (e.clipboardData || window.clipboardData)
          .getData('text/plain')
          .replace(/\r?\n/g, ' ');

        document.execCommand('insertText', false, text);
      },
      true,
    );

    render();
  };

  /** 扫描页面上尚未挂载网格的 table 组件 */
  const scan = () => {
    document
      .querySelectorAll('[data-component-name="table"] textarea:not([data-mdt-mounted])')
      .forEach(mountGrid);
  };

  const start = () => {
    if (!register()) {
      // CMS 脚本尚未就绪（理论上 script 顺序保证了就绪，这里兜底重试）
      setTimeout(start, 100);
      return;
    }

    injectCSS();

    let scheduled = false;

    new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        scan();
      });
    }).observe(document.body, { childList: true, subtree: true });

    scan();
  };

  start();
})();
