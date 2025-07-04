this.describe('yl-test-group', () => {
  this.let(() => {
    this.data.element = this.querySelector('yl-component');
    this.data.observedAttributes =
      component.constructor.observedAttributes;
  });

  this.it('has no observed attributes', () => {
    this.expect(observedAttributes.length).to_be(1);
    this.expect(false).to_be(null);
    this.expect(false).to_be(true);
  });

  this.it('has something else', () => {
    this.expect(true);
  });
})