import { authMiddleware } from "./utils/middleware/authMiddleware";
import { loggingMiddleware } from "./utils/middleware/loggingMiddleware";
import { MiddlewareStack } from "./utils/middleware/middleware";

const middlewares = [loggingMiddleware, authMiddleware];

export default MiddlewareStack(middlewares);
