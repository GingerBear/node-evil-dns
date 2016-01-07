var dns = require('dns');
var expect = require('chai').expect;
var evilDNS = require('../evil-dns');

describe('The method hijacking dns.lookup', function () {
  it('returns the family when doing DNS queries', function (done) {
    evilDNS.add('*.foo.com', '1.2.3.4');
    dns.lookup('a.foo.com', {family: undefined, hints: dns.ADDRCONFIG | dns.V4MAPPED}, function (err, addr, family) {
      expect(addr).to.equal('1.2.3.4');
      expect(family).to.equal(4);
      done();
    });
  });

  it('handles family-agnostic queries', function (done) {
    var error = null;
    var options = {family: undefined, hints: dns.ADDRCONFIG | dns.V4MAPPED};

    if (/^0\.10/.test(process.versions.node) || /^0\.11/.test(process.versions.node)) {
      options = 4;
    }

    try {
      dns.lookup('nodejs.org', options, function (err) {
        expect(err).to.not.exist;
        done();
      });
    } catch (err) {
      expect(err).to.not.exist;
      done();
    }
  });

  it('handles empty options', function (done) {
    var error = null;

    try {
      dns.lookup('nodejs.org', function (err) {
        expect(err).to.not.exist;
        done();
      });
    } catch (err) {
      expect(err).to.not.exist;
      done();
    }
  });

  afterEach(function () {
    evilDNS.clear();
  });
});
