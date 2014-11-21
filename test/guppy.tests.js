var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var proxy = require('proxyquire');
chai.use(require('sinon-chai'));

var noop = require('gulp-util').noop;

var gulpSrcStub = sinon.stub();
var gulpTaskStub = sinon.stub();

var pipeObj = {
  pipe: sinon.stub()
};
var pipeStub = pipeObj.pipe;
pipeStub.returns(pipeObj);
var lazypipeStub = sinon.stub();
lazypipeStub.returns(pipeObj);

guppy = proxy('../lib/guppy', {
  './git-hooks': ['hook'],
  gulp: {
    src: gulpSrcStub,
    task: gulpTaskStub
  },
  lazypipe: lazypipeStub
});

describe('guppy', function () {
  beforeEach(function () {
    lazypipeStub.reset();
    pipeStub.reset();
  });

  describe('stream method', function () {
    it('exposes a pipe method', function () {
      expect(guppy.stream('hook').pipe).to.be.a('function');
    });

    it('stream returns itself from stream#pipe', function () {
      var stream = guppy.stream('hook');

      expect(stream.pipe(noop)).to.eql(stream);
    });

    it('stream#pipe passes arguments to lazypipe#pipe', function () {
      var stream = guppy.stream('hook');

      stream.pipe('foo', 'bar');
      expect(pipeStub).to.have.been.calledWith('foo', 'bar');
    });
  });
});
