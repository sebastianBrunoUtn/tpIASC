const {assert} = require('chai');
const Buyer = require("../Buyer");

describe('Buyer', function() {
    const name = "name";
    const address = "address";
    const tagsOfInterest = ["tag1", "tag2"];
    const buyer = new Buyer(name, address, tagsOfInterest);

    it('should correctly set all attributes', function() {
        assert.equal(buyer.name, name);
        assert.equal(buyer.address, address);
        assert.equal(buyer.tagsOfInterest, tagsOfInterest);
    });

    it('should correctly correctly return true if a tag is of its interest', function() {
        assert.isTrue(buyer.hasTag("tag1"));
    });

    it('should correctly correctly return false if a tag is not of its interest', function() {
        assert.isFalse(buyer.hasTag("tag3"));
    });

    it('should correctly correctly return true if some of a set of tags is of its interest', function() {
        assert.isTrue(buyer.hasAnyTag(["tag1", "tag3"]));
    });

    it('should correctly correctly return false if some of a set of tags is of its interest', function() {
        assert.isFalse(buyer.hasAnyTag(["tag3", "tag4"]));
    });
});