const {assert} = require('chai');
const Buyer = require("../Buyer");
const BuyersRegistry = require("../BuyersRegistry");

describe('BuyersRegistry', function() {
    it('should correctly return true if a buyer is registered', function() {
        const buyersRegistry = new BuyersRegistry();
        const name = "name";
        const buyer = new Buyer(name, "address", ["tag1", "tag2"]);

        buyersRegistry.addBuyer(buyer);

        assert.isTrue(buyersRegistry.buyerWithNameExists(name));
    });

    it('should correctly return false if a buyer is not registered', function() {
        const buyersRegistry = new BuyersRegistry();
        const buyer = new Buyer("name", "address", ["tag1", "tag2"]);

        buyersRegistry.addBuyer(buyer);

        assert.isFalse(buyersRegistry.buyerWithNameExists("different name"));
    });

    it('should correctly add all buyers', function() {
        const buyersRegistry = new BuyersRegistry();
        const name1 = "name 1";
        const name2 = "name 2";

        buyersRegistry.addBuyers([
            new Buyer(name1, "address", ["tag1", "tag2"]),
            new Buyer(name2, "address", ["tag1", "tag2"])
        ]);

        assert.isTrue(buyersRegistry.buyerWithNameExists(name1));
        assert.isTrue(buyersRegistry.buyerWithNameExists(name2));
    });

    it('should correctly return all buyers with tags', function() {
        const buyersRegistry = new BuyersRegistry();
        const tag1 = "tag 1";
        const tag2 = "tag 2";
        const tag3 = "tag 3";
        const buyer1 = new Buyer("name 1", "address", [tag1, tag2]);
        const buyer2 = new Buyer("name 2", "address", [tag2, tag3]);

        buyersRegistry.addBuyers([buyer1, buyer2]);

        assert.equal(buyersRegistry.getBuyersWithTags([tag1]).length, 1);
        assert.isTrue(buyersRegistry.getBuyersWithTags([tag1]).includes(buyer1));
        assert.equal(buyersRegistry.getBuyersWithTags([tag2]).length, 2);
        assert.isTrue(buyersRegistry.getBuyersWithTags([tag2]).includes(buyer1));
        assert.isTrue(buyersRegistry.getBuyersWithTags([tag2]).includes(buyer2));
        assert.equal(buyersRegistry.getBuyersWithTags([tag3]).length, 1);
        assert.isTrue(buyersRegistry.getBuyersWithTags([tag3]).includes(buyer2));
    });

    it('should correctly add a buyer only once', function() {
        const buyersRegistry = new BuyersRegistry();
        const tag1 = "tag1";
        const buyer1 = new Buyer("name 1", "address", [tag1]);

        buyersRegistry.addBuyers([buyer1, buyer1]);

        assert.equal(buyersRegistry.getBuyersWithTags([tag1]).length, 1);
        assert.isTrue(buyersRegistry.getBuyersWithTags([tag1]).includes(buyer1));
    });
});