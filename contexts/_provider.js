import { GeneralProvider } from './general';
import { UserProvider } from './user';
import { MainProvider } from './main';

import combineContexts from '../utils/combineContexts';

const providers = [GeneralProvider, UserProvider, MainProvider];

export const Provider = combineContexts(...providers);
