// 引入React相关的包
import React, { useState, useRef, useEffect, Component } from 'react';
import { createRoot } from 'react-dom/client';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import { Toolbar } from 'markmap-toolbar';
import './style.css';

// 初始化Transformer和初始值
const transformer = new Transformer();
const initValueHooks = `# markmap
- beautiful
- useful
- easy
- interactive
`;
const initValueClass = `
# markmap
- 123
- useful
- easy
- interactive
`;

// 定义MarkmapClass类组件
class MarkmapClass extends Component {
  state = {
    value: initValueClass,
  };

  private svg: SVGSVGElement;
  private mm: Markmap;

  bindSvg = (el) => {
    this.svg = el;
  };

  componentDidMount() {
    this.mm = Markmap.create(this.svg);
    this.updateSvg();
  }

  handleChange = (e) => {
    this.setState({ value: e.target.value }, this.updateSvg);
  };

  updateSvg = () => {
    const { root } = transformer.transform(this.state.value);
    this.mm.setData(root);
    this.mm.fit();
  };

  render() {
    const { value } = this.state;
    return (
      <React.Fragment>
        <div className="flex-1">
          <textarea
            className="w-full h-full border border-gray-400"
            value={value}
            onChange={this.handleChange}
          />
        </div>
        <svg className="flex-1" ref={this.bindSvg} />
      </React.Fragment>
    );
  }
}

// 定义MarkmapHooks函数组件
function MarkmapHooks() {
  const [value, setValue] = useState(initValueHooks);
  const refSvg = useRef<SVGSVGElement>();
  const refMm = useRef<Markmap>();
  const refToolbar = useRef<HTMLDivElement>();

  useEffect(() => {
    const mm = Markmap.create(refSvg.current);
    refMm.current = mm;
    renderToolbar(refMm.current, refToolbar.current);
  }, [refSvg.current]);

  useEffect(() => {
    const mm = refMm.current;
    if (!mm) return;
    const { root } = transformer.transform(value);
    mm.setData(root);
    mm.fit();
  }, [refMm.current, value]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <React.Fragment>
      <div className="flex-1">
        <textarea
          className="w-full h-full border border-gray-400"
          value={value}
          onChange={handleChange}
        />
      </div>
      <svg className="flex-1" ref={refSvg} />
      <div className="absolute bottom-1 right-1" ref={refToolbar}></div>
    </React.Fragment>
  );
}

// 定义渲染工具栏的函数
function renderToolbar(mm: Markmap, wrapper: HTMLElement) {
  while (wrapper?.firstChild) wrapper.firstChild.remove();
  if (mm && wrapper) {
    const toolbar = new Toolbar();
    toolbar.attach(mm);
    toolbar.register({
      id: 'alert',
      title: 'Click to show an alert',
      content: 'Alert',
      onClick: () => alert('You made it!'),
    });
    toolbar.setItems([...Toolbar.defaultItems, 'alert']);
    wrapper.append(toolbar.render());
  }
}

// 定义App函数组件
function App() {
  const [type, setType] = useState('hooks');
  const Component = type === 'hooks' ? MarkmapHooks : MarkmapClass;
  return (
    <div className="flex flex-col h-screen p-2">
      <select
        className="border border-gray-400"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="class">Class</option>
        <option value="hooks">Hooks</option>
      </select>
      <Component />
    </div>
  );
}

// 渲染App组件
const root = createRoot(document.getElementById('root'));
root.render(<App />);
