import * as graphqlHTTP from 'express-graphql';
import * as express from 'express';

import CONFIG from '../config';
import { UserSchema, AdminSchema } from '../graphql';

const isProduction: boolean = CONFIG.isProduction;

interface Location$ {
  line: number;
  column: number;
}

interface GraphqlError$ {
  message: string;
  locations: Location$[];
  path: string[];
  stack: string;
}

interface OutputError$ {
  message: string;
  locations: Location$[];
  path: string[];
  stack?: string[];
}

function errorFormattor(err: GraphqlError$): OutputError$ {
  const output: OutputError$ = {
    message: err.message,
    locations: err.locations,
    path: err.path
  };

  if (!isProduction) {
    output.stack = err.stack.split('\n');
  }

  return output;
}

interface ExtensionsArgv$ {
  startTime: number;
}

interface ExtensionsRes$ {
  runTime?: number;
  variables?: any;
  operationName?: string;
}

function extensions(
  { document, variables, operationName, result }: any,
  argv: ExtensionsArgv$
): ExtensionsRes$ {
  const startTime = argv.startTime;
  if (!isProduction) {
    return {
      runTime: Date.now() - startTime,
      variables,
      operationName
    };
  } else {
    return {};
  }
}

export default () => {
  const router = express.Router();

  router.use(
    '/graphql',
    graphqlHTTP((req: any) => {
      const startTime = Date.now();
      return {
        schema: UserSchema,
        graphiql: !isProduction,
        formatError: errorFormattor,
        extensions(argv: any) {
          return extensions(argv, { startTime });
        }
      };
    })
  );

  router.use(
    '/admin.graphql',
    graphqlHTTP((req: any) => {
      const startTime = Date.now();
      return {
        schema: AdminSchema,
        graphiql: !isProduction,
        formatError: errorFormattor,
        extensions(argv: any) {
          return extensions(argv, { startTime });
        }
      };
    })
  );
  return router;
};
