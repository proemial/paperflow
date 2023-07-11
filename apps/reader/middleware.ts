import { authMiddleware } from "./app/components/utils/middleware/authMiddleware";
import { MiddlewareStack } from "./app/components/utils/middleware/middleware";
import { splitMiddleware } from "./app/components/utils/middleware/splitMiddleware";

const middlewares = [authMiddleware, splitMiddleware];

export default MiddlewareStack(middlewares);
