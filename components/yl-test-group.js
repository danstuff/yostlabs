import ylComponent from './yl-component';

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

class SourceNode {
  get length() {
    const siblings = this.parent.children;
    const siblingKeys = Object.keys(siblings);

    const nextIndex = siblingKeys.indexOf(this.name)+1;
    if (nextIndex >= siblings.length) {
      return this.source.length - this.index;
    }
    
    const nextChild = siblings[siblingKeys[nextIndex]];
    return nextChild.index - this.index;
  }

  get content() {
    return this.source.substr(this.index, this.length);
  }

  constructor(name, parent, source, file) {
    this.name = name;
    this.path = parent?.path ? [...parent.path, name] : [name];

    this.source = parent?.source || source;
    this.file = parent?.file || file;

    // TODO guard against multiple matches
    this.index = this.source.indexOf(name, parent?.index || 0);
    
    this.parent = parent;
    this.children = {};
    this.setups = [];
  }

  walk(names, callback) {
    if (callback) {
      callback(this);
    }

    let map = this;
    for (let i = 1; i < names.length; i++) {
      map = map.children[names[i]];
      if (!map) {
        break;
      }
      if (callback) {
        callback(map);
      }
    }
  }

  push(name) {
    // console.log(`push ${name}`);
    const child = new SourceNode(name, this);
    this.children[name] = child;
    return child;
  }

  pop() {
    // console.log(`pop ${this.name}`);
    return this.parent;
  }

  getLineNumber(index) {
    const prevLines = this.source.substr(0, index);
    return prevLines.match(/\r?\n/g).length+1;
  }

  getLine(index) {
    index = index || this.index;
    return this.source.substr(
      index,
      this.source.indexOf('\n', index)-index);
  }

  getExpectLine(count) {
    let index = this.index;
    while (count > 0) {
      index = this.source.indexOf('this.expect', index+1);
      count--;
    }
    return {
      file: this.file,
      number: this.getLineNumber(index),
      text: this.getLine(index)
    };
  }
}

class Test {
  get passed() {
    return this.failCount == 0;
  }

  get status() {
    const fullName = this.sourceNode.path.join(' ').trim();
    if (this.failCount <= 0) {
      return `${fullName}: PASS`;
    } else {
      return `${fullName}: FAIL (${this.failCount})\n${this.failLog}\n`;
    }
  }

  constructor(sourceNode, run) {
    this.sourceNode = sourceNode;
    this.run = run;
    this.expectCount = 0;
    this.failCount = 0;
    this.failLog = "";
  }

  assert(condition, message) {
    if (!condition) {
      this.failCount++;
      const line = this.sourceNode.getExpectLine(this.expectCount);
      this.failLog += `\n ${line.file}:${line.number}\n  ${line.text}\n\n  ${message}\n`;
    }
  }
}

export default class ylTestGroup extends ylComponent {
  static get observedAttributes() {
    return ['status', 'src', 'failcount'];
  }

  get html() {
    return `
      <div class="frame">
        <slot></slot>
      </div>
      <div class="${this.failcount ? "fail" : "pass"}">
        <div class="status-box"></div>
        <p>${this.src}<br>${this.status} Failed examples: ${this.failcount || 0}</p>
      </div>
    `;
  }

  get css() {
    return `
      div {
        margin: 5px;
        vertical-align: middle;
      }

      p {
        vertical-align: middle;
        display: inline-block;
        margin: 0;
      }
      
      div.frame {
        border: 1px dashed black;
        width: max-content;
      }

      div.status-box {
        width: 1em;
        height: 1em;
        border: 1px solid black;
        border-radius: 1em;
        display: inline-block;
      }

      div.fail div.status-box {
        background-color: #FF0000;
      }

      div.pass div.status-box {
        background-color: #00FF00;
      }
    `;
  }

  connectedCallback() {
    this.status = "Downloading...";
    this.failcount = 0;

    this.tests = [];

    // TODO sanitize URL and/or JS before executing
    fetch(this.src).then(response => response.text()).then(source => { 
      this.status = "Loading Tests...";

      this.source = source;
      this.rootSourceNode = new SourceNode('', null, source, this.src);
      this.sourceNode = this.rootSourceNode;

      Function(source).bind(this)();

      shuffle(this.tests);

      this.status = "Running..."

      for (const test of this.tests) {
        this.test = test;

        this.data = {};
        this.runSetups(test);
        test.run();

        console.log(test.status);

        if (!test.passed) {
          this.failcount = this.failcount + 1;
        }
      }

      this.status = "Done."
    });
  }

  runSetups(test) {
    this.rootSourceNode.walk(test.sourceNode.path, (m) => {
      for(const setup of m.setups) {
        setup();
      }
    });
  }

  click(target) {
    target.click();
  }

  type(string) {
    return {
      in : (target) => {
        for (const key of string) {
          target.dispatchEvent(
            new KeyboardEvent('keypress', { key: key }));
        }
      }      
    }
  }

  describe(name, call) {
    this.sourceNode = this.sourceNode.push(name);
    call();
    this.sourceNode = this.sourceNode.pop();
  }

  let(run) {
    this.sourceNode.setups.push(run);
  }

  it(name, run) {
    this.sourceNode = this.sourceNode.push(name);
    this.tests.push(new Test(this.sourceNode, run));
    this.sourceNode = this.sourceNode.pop();
  }

  expect(object) {
    this.test.expectCount++;
    let name = object?.constructor?.name || "object";

    const _to_exist = (t) => {
      this.test.assert((object != null) == t,
        `Expected ${name} to ${t ? '' : 'not '}exist but got ${object}`);
    };

    const _to_be = (value, t) => {
      this.test.assert((object == value) == t,
        `Expected ${name} to ${t ? '' : 'not '}be ${value} but got ${object}`);
    };

    const _to_have = (selector, t) => {
      const children = object.querySelectorAll(selector);
      this.test.assert((children.length ? true : false) == t,
        `Expected to ${t ? '' : 'not '}find '${selector}' in ${name}, ` +
        `but got ${children.length} matches.`);

      const _with = (content, tt) => {
        let matches = 0;
        for (const child of children) {
          matches += child.innerHTML.includes(content) ? 1 : 0;
        }

        this.test.assert((matches != 0) == tt,
          `Expected to ${t ? '' : 'not '}find '${selector}' with content '` + 
          `${content}' in ${name}, but got ${matches} matches.`);
      };

      return {
        with: (content) => { _with(content, true); },
        without: (content) => { _with(content, false) } 
      };
    }

    return {
      to_exist:     ()         => { _to_exist(true); },
      to_not_exist: ()         => { _to_exist(false); },
      to_be:        (value)    => { _to_be(value, true); },
      to_not_be:    (value)    => { _to_be(value, false); },
      to_have:      (selector) => { return _to_have(selector, true); },
      to_not_have:  (selector) => { return _to_have(selector, false); },
    };
  }
} 

ylTestGroup.defineElement();