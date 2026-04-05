import NodeCache from "node-cache";

const cacheService = new NodeCache({ stdTTL: 300 });

export default cacheService;