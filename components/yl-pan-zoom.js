import ylComponent from './yl-component.js';

export default class ylPanZoom extends ylComponent {
  static get observedAttributes() {
    return ['src', 'zoom', 'x', 'y'];
  }

  get css() {
    return `
      :host {
        display: block;
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100%;
        user-select: none;
        touch-action: none;
      }
      img {
        position: absolute;
        transform-origin: 0 0;
        cursor: grabbing;
        transform: translate(${this.x}px, ${this.y}px) scale(${this.zoom});
        pointer-events: none;
        width: 100%;
      }
    `;
  }

  get html() {
    return `
      <img src="${this.src || ''}"></img>
    `;
  }

  connectedCallback() {
    this.dom.img = this.root.querySelector('img');

    this.zoom = 1.0;
    this.x = 0;
    this.y = 0;
    
    this._dragStart = null;
    this._lastTransform = { x: 0, y: 0 };

    // Add wheel event to component
    this.addEventListener('wheel', this._handleWheel.bind(this));
   
    // Add touch events to container
    this.addEventListener('touchstart', this._handleDragStart.bind(this));
    this.addEventListener('touchmove', this._handleDragMove.bind(this));
    this.addEventListener('touchend', this._handleDragEnd.bind(this));

    // Add mousedown to container, but move and up to document
    this.addEventListener('mousedown', this._handleDragStart.bind(this));
    document.addEventListener('mousemove', this._handleDragMove.bind(this));
    document.addEventListener('mouseup', this._handleDragEnd.bind(this));
  }

  _handleWheel(event) {
    event.preventDefault();
    
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    const rect = this.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    this._handleZoom(mouseX, mouseY, delta);
  }

  _handleZoom(x, y, delta) {
    const newZoom = Math.max(0.1, Math.min(10, this.zoom * delta));
    
    // Adjust position to zoom toward target position
    this.x = x - (x - this.x) * (newZoom / this.zoom);
    this.y = y - (y - this.y) * (newZoom / this.zoom);
    this.zoom = newZoom;
  }

  _handleDragStart(event) {
    if (event.touches) {
      if (event.touches.length === 2) {
        // Store initial pinch distance for zoom
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        this._initialPinchDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        this._initialZoom = this.zoom;

        // Store midpoint for zooming
        const rect = this.getBoundingClientRect();
        this._pinchMidpoint = {
          x: ((touch1.clientX + touch2.clientX) / 2) - rect.left,
          y: ((touch1.clientY + touch2.clientY) / 2) - rect.top
        };
      } else {
        // Single touch for panning
        const touch = event.touches[0];
        this._dragStart = {
          x: touch.clientX - this.x,
          y: touch.clientY - this.y
        };
      }
    } else {
      // Mouse event
      this._dragStart = {
        x: event.clientX - this.x,
        y: event.clientY - this.y
      };
    }
  }

  _handleDragMove(event) {
    if (event.touches) {
      if (event.touches.length === 2) {
        // Handle pinch zoom
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        const delta = currentDistance / this._initialPinchDistance;

        this._handleZoom(
          this._pinchMidpoint.x,
          this._pinchMidpoint.y,
          delta
        );

        this._initialPinchDistance = currentDistance;

      } else if (this._dragStart) {
        // Handle single touch pan
        const touch = event.touches[0];
        this.x = touch.clientX - this._dragStart.x;
        this.y = touch.clientY - this._dragStart.y;
      }
    } else if (this._dragStart) {
      // Handle mouse drag
      this.x = event.clientX - this._dragStart.x;
      this.y = event.clientY - this._dragStart.y;
    }
  }

  _handleDragEnd() {
    this._dragStart = null;
    this._initialPinchDistance = null;
    this._initialZoom = null;
    this._pinchMidpoint = null;
  }
}

ylPanZoom.defineElement();