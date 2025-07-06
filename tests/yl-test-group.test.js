this.describe('yl-test-group', () => {
  this.let(() => {
    this.data.foo = "bar";
  });

  this.it('has no observed attributes', () => {
    this.expect(this.data.foo).to_be("bar");
    this.expect(false).to_be(false);
    this.expect(true).to_be(true);
  });

  this.it('has something else', () => {
    this.expect(true);
  });
})