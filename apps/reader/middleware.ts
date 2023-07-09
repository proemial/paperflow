import { authMiddleware } from "./app/components/utils/middleware/authMiddleware";
import { loggingMiddleware } from "./app/components/utils/middleware/loggingMiddleware";
import { MiddlewareStack } from "./app/components/utils/middleware/middleware";

const middlewares = [loggingMiddleware, authMiddleware];

export default MiddlewareStack(middlewares);
