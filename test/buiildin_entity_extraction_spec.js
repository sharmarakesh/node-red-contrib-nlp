const should = require("should");
const helper = require("node-red-node-test-helper");
helper.init(require.resolve("node-red"));

const node = require("../nodes/buildin_entity_extraction");

describe("Entity Extraction Node", () => {

  before(function(done) {
    helper.startServer(done);
  });

  after((done) => {
    helper.stopServer(done);
  });

  afterEach(() => {
    helper.unload();
  });

  it("should be loaded", (done) => {
    const flow = [{ id: "n1", type: "buildin_entity_extraction", name: "test" }];
    helper.load(node, flow, () => {
      const n1 = helper.getNode("n1");
      n1.should.have.property("name", "test");
      done();
    });
  });

  it("should make payload", function (done) {
    const flow = [
      { id: "n1", type: "buildin_entity_extraction", name: "test", wires:[["n2"]] },
      { id: "n2", type: "helper" }
    ];
    helper.load(node, flow, () => {
      const n2 = helper.getNode("n2");
      const n1 = helper.getNode("n1");
      n2.on("input", (msg) => {
        msg.payload.should.have.size(1);
        msg.payload[0].should.have.property("sourceText", "8.8.8.8");
        msg.payload[0].should.have.property("entity", "ip");
        done();
      });
      n1.receive({ payload: "My ip is 8.8.8.8" });
    });
  });

  it("should make empty payload", (done) => {
    const flow = [
      { id: "n1", type: "buildin_entity_extraction", name: "test", wires:[["n2"]] },
      { id: "n2", type: "helper" }
    ];
    helper.load(node, flow, () => {
      const n2 = helper.getNode("n2");
      const n1 = helper.getNode("n1");
      n2.on("input", (msg) => {
        msg.payload.should.have.size(0);
        done();
      });
      n1.receive({ payload: "" });
    });
  });
});