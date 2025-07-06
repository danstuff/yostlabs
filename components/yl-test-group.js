import ylComponent from './yl-component';

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

class SourceNode {
  get length() {
    const nextIndex = this.parent.children.indexOf(this)+1;
    if (nextIndex >= this.parent.children.length) {
      return this.source.length - this.index;
    }
    
    const nextChild = this.parent.children[nextIndex];
    return nextChild.sourceIndex - this.index;
  }

  get content() {
    return this.source.substr(this.sourceIndex, this.length);
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
    console.log(`push ${name}`);
    const child = new SourceNode(name, this);
    this.children[name] = child;
    return child;
  }

  pop() {
    console.log(`pop ${this.name}`);
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
  get status() {
    const fullName = this.sourceNode.path.join(' ').trim();
    if (this.failCount <= 0) {
      return `${fullName}: PASS`;
    } else {
      return `${fullName}: FAIL (${this.failCount})\n${this.failLog}`;
    }
  }

  constructor(sourceNode, run) {
    this.sourceNode = sourceNode;
    this.run = run;
    this.assertCount = 0;
    this.failCount = 0;
    this.failLog = "";
  }

  assert(condition, message) {
    this.assertCount++;

    if (!condition) {
      this.failCount++;
      const line = this.sourceNode.getExpectLine(this.assertCount);
      this.failLog += ` ${line.file}:${line.number} >\n  ${line.text}\n  ${message}\n`;
    }
  }
}

export default class ylTestGroup extends ylComponent {
  static get observedAttributes() {
    return ['name', 'src', 'failcount'];
  }

  get html() {
    return `
      <div>${this.name}</div>
      <div class="frame">
        <slot></slot>
      </div>
      <div>Failed examples: ${this.failcount || 0}</div>
    `;
  }

  get css() {
    return `
      div {
        margin: 5px;
      }
      
      .frame {
        border: 1px dashed black;
        width: max-content;
      }
    `;
  }

  connectedCallback() {
    this.name = "Downloading...";
    this.failcount = 0;

    this.tests = [];

    // TODO sanitize URL and/or JS before executing
    fetch(this.src).then(response => response.text()).then(source => { 
      this.name = "Loading Tests...";

      this.source = source;
      this.rootSourceNode = new SourceNode('', null, source, this.src);
      this.sourceNode = this.rootSourceNode;

      Function(source).bind(this)();

      shuffle(this.tests);

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
    let name = object?.constructor?.name || "object";

    const to_exist = (t) => {
      this.test.assert((object != null) == t,
        `Expected ${name} to ${t ? '' : 'not '}exist but got ${o}`);
    };

    const to_be = (value, t) => {
      this.test.assert((object == value) == t,
        `Expected ${name} to ${t ? '' : 'not '}be ${value} but got ${object}`);
    };

    const to_have = (selector, t) => {
      const msg = 
        `Expected to find '${selector}' with content '` + 
        `${content}' in ${name}, but `;

      const children = object.querySelectorAll(selector);
      this.test.assert((children.length ? true : false) == t,
        msg + `there were no matches.`);

      return {
        with: (content) => {
          let match = false;
          for (const child of children) {
            match = match || child.innerHTML.contains(content);
            if (match) {
              break;
            }
          }
          this.test.assert(match == t,
            msg + `no matching selector had content.`);
        }
      };
    }

    return {
      to_exist:     ()         => { to_exist(true); },
      to_not_exist: ()         => { to_exist(false); },
      to_be:        (value)    => { to_be(value, true); },
      to_not_be:    (value)    => { to_be(value, false); },
      to_have:      (selector) => { return to_have(selector, true); },
      to_not_have:  (selector) => { return to_have(selector, false); },
    };
  }
} 

ylTestGroup.defineElement();